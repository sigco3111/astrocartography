
import { Planet, LineType } from './types';

export const PLANET_INFO: { [key in Planet]: { symbol: string; color: string; name_ko: string; } } = {
    [Planet.Sun]: { symbol: '☉', color: '#facc15', name_ko: '태양' },
    [Planet.Moon]: { symbol: '☽', color: '#e5e7eb', name_ko: '달' },
    [Planet.Mercury]: { symbol: '☿', color: '#9ca3af', name_ko: '수성' },
    [Planet.Venus]: { symbol: '♀', color: '#34d399', name_ko: '금성' },
    [Planet.Mars]: { symbol: '♂', color: '#ef4444', name_ko: '화성' },
    [Planet.Jupiter]: { symbol: '♃', color: '#60a5fa', name_ko: '목성' },
    [Planet.Saturn]: { symbol: '♄', color: '#a8a29e', name_ko: '토성' },
};

export const LINE_TYPE_INFO: { [key in LineType]: { name: string; description_ko: string; } } = {
    [LineType.AC]: { name: 'Ascendant', description_ko: '상승선' },
    [LineType.DC]: { name: 'Descendant', description_ko: '하강선' },
    [LineType.MC]: { name: 'Midheaven', description_ko: '천정선' },
    [LineType.IC]: { name: 'Imum Coeli', description_ko: '천저선' },
};

// Simulated geographic coordinates for each planetary line.
export const ASTRO_LINES_DATA: { planet: Planet; lineType: LineType; coords: [number, number][]; }[] = [
    // Parabolic curves
    { planet: Planet.Sun, lineType: LineType.MC, coords: [[-90, -45], [-60, -75], [-30, -85], [0, -88], [30, -85], [60, -75], [90, -45]] },
    { planet: Planet.Moon, lineType: LineType.MC, coords: [[-90, 20], [-60, -10], [-30, -20], [0, -22], [30, -20], [60, -10], [90, 20]] },
    { planet: Planet.Venus, lineType: LineType.AC, coords: [[-90, 110], [-60, 80], [-30, 70], [0, 68], [30, 70], [60, 80], [90, 110]] },
    { planet: Planet.Jupiter, lineType: LineType.IC, coords: [[-90, -170], [-60, -140], [-30, -130], [0, -128], [30, -130], [60, -140], [90, -170]] },

    // More vertical lines (S-curves)
    { planet: Planet.Sun, lineType: LineType.AC, coords: [[-90, -130], [-45, -125], [0, -130], [45, -135], [90, -130]] },
    { planet: Planet.Mars, lineType: LineType.MC, coords: [[-90, -10], [-45, -5], [0, -10], [45, -15], [90, -10]] },
    { planet: Planet.Saturn, lineType: LineType.DC, coords: [[-90, 60], [-45, 65], [0, 60], [45, 55], [90, 60]] },
    { planet: Planet.Moon, lineType: LineType.IC, coords: [[-90, 95], [-45, 100], [0, 95], [45, 90], [90, 95]] },
    { planet: Planet.Venus, lineType: LineType.DC, coords: [[-90, 150], [-45, 155], [0, 150], [45, 145], [90, 150]] },
];
