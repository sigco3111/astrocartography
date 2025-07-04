
import React from 'react';
import { SelectedLine } from '../types';
import { PLANET_INFO, LINE_TYPE_INFO } from '../constants';
import Loader from './Loader';

interface InterpretationPanelProps {
    interpretation: string | null;
    isLoading: boolean;
    selectedLine: SelectedLine | null;
    onClose: () => void;
}

const InterpretationPanel: React.FC<InterpretationPanelProps> = ({ interpretation, isLoading, selectedLine, onClose }) => {
    if (!selectedLine) {
        return (
            <div className="h-full min-h-[300px] flex flex-col justify-center items-center text-center p-8 bg-black/30 rounded-lg border border-blue-400/20">
                <h3 className="font-orbitron text-xl text-blue-200 mb-2">행성선 선택</h3>
                <p className="text-blue-200/80">지도 위의 행성선을 클릭하여 그 의미를 탐색해보세요.</p>
                <p className="text-blue-200/60 mt-2 text-sm">각 선은 당신의 삶의 특정 영역에 영향을 미칩니다.</p>
            </div>
        );
    }
    
    const planetInfo = PLANET_INFO[selectedLine.planet];
    const lineInfo = LINE_TYPE_INFO[selectedLine.lineType];

    return (
        <div className="h-full flex flex-col bg-black/30 rounded-lg border border-blue-400/20 backdrop-blur-sm relative overflow-hidden">
            <div className="p-4 flex justify-between items-center bg-black/30 border-b border-blue-400/20 flex-shrink-0">
                <h3 className="font-orbitron text-lg text-white flex items-center gap-3">
                    <span style={{color: planetInfo.color, textShadow: `0 0 8px ${planetInfo.color}`}} className="text-2xl">{planetInfo.symbol}</span>
                    {planetInfo.name_ko} {lineInfo.description_ko}
                </h3>
                <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors text-2xl leading-none font-bold">&times;</button>
            </div>
            <div className="p-6 overflow-y-auto flex-grow">
                {isLoading && <Loader />}
                {interpretation && !isLoading && (
                     <p className="whitespace-pre-wrap leading-relaxed text-blue-100/90 font-light">
                        {interpretation}
                    </p>
                )}
            </div>
        </div>
    );
};

export default InterpretationPanel;
