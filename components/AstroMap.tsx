
import React, { useEffect, useRef } from 'react';
import { SelectedLine } from '../types';
import { PLANET_INFO, ASTRO_LINES_DATA } from '../constants';

// For using Leaflet in TypeScript with a CDN script
declare const L: any;

interface AstroMapProps {
    onLineSelect: (line: SelectedLine) => void;
    selectedLine: SelectedLine | null;
}

const AstroMap: React.FC<AstroMapProps> = ({ onLineSelect, selectedLine }) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<any>(null); // To hold Leaflet map instance
    const linesRef = useRef<{ [key: string]: any }>({}); // To hold line layers

    // Using a ref for selectedLine to be accessible in event handlers' closures
    const selectedLineRef = useRef(selectedLine);
    selectedLineRef.current = selectedLine;

    // Initialize map and draw lines
    useEffect(() => {
        if (mapRef.current || !mapContainerRef.current) return;

        const map = L.map(mapContainerRef.current, {
            center: [20, 15],
            zoom: 2,
            minZoom: 2,
            maxZoom: 10,
            worldCopyJump: true,
            zoomControl: false,
            attributionControl: false, 
        });
        mapRef.current = map;
        
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            // Attribution will be added via L.control.attribution
        }).addTo(map);

        L.control.zoom({ position: 'bottomright' }).addTo(map);
        L.control.attribution({ 
            position: 'bottomleft',
            prefix: ''
        }).addAttribution('&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions" target="_blank" rel="noopener noreferrer">CARTO</a>').addTo(map);

        ASTRO_LINES_DATA.forEach(({ planet, lineType, coords }) => {
            const lineId = `${planet}-${lineType}`;
            const info = PLANET_INFO[planet];
            
            const polyline = L.polyline(coords, {
                color: info.color,
                weight: 2.5,
                opacity: 0.7,
                smoothFactor: 1.5,
            });
            
            polyline.on('click', () => onLineSelect({ planet, lineType }));
            
            polyline.on('mouseover', (e: any) => { 
                e.target.setStyle({ weight: 4.5, opacity: 1 }); 
                e.target.bringToFront(); 
            });

            polyline.on('mouseout', (e: any) => {
                const currentSelected = selectedLineRef.current;
                const isSelected = currentSelected?.planet === planet && currentSelected?.lineType === lineType;
                if (!isSelected) {
                    e.target.setStyle({ weight: 2.5, opacity: 0.7 });
                }
            });

            polyline.addTo(map);
            linesRef.current[lineId] = polyline;
        });

        return () => {
            map.remove();
            mapRef.current = null;
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Run once on mount

    // Update line styles on selection change
    useEffect(() => {
        Object.entries(linesRef.current).forEach(([lineId, lineLayer]) => {
            const [planet, lineType] = lineId.split('-');
            const isSelected = selectedLine?.planet === planet && selectedLine?.lineType === lineType;
            
            lineLayer.setStyle({
                weight: isSelected ? 4.5 : 2.5,
                opacity: isSelected ? 1 : 0.7,
            });

            if (isSelected) {
                lineLayer.bringToFront();
            }
        });
    }, [selectedLine]);

    return (
        <div className="w-full aspect-[2/1] bg-gray-900/50 rounded-lg overflow-hidden relative border border-blue-300/20 shadow-xl shadow-blue-500/10">
            <div ref={mapContainerRef} className="w-full h-full" />
        </div>
    );
};

export default AstroMap;
