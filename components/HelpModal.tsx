import React from 'react';

interface HelpModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 animate-fade-in"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="help-modal-title"
        >
            <div
                className="bg-gray-900/80 w-11/12 max-w-2xl rounded-lg border border-blue-300/30 shadow-2xl shadow-blue-500/20 m-4"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-5 border-b border-blue-300/20 flex justify-between items-center">
                    <h2 id="help-modal-title" className="font-orbitron text-xl text-blue-200">
                        앱 사용법 안내
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors text-3xl leading-none font-bold"
                        aria-label="Close help modal"
                    >
                        &times;
                    </button>
                </div>
                <div className="p-6 text-blue-100/90 max-h-[70vh] overflow-y-auto space-y-6">
                    <div className="space-y-2">
                        <h3 className="font-orbitron text-lg text-blue-300">에스트로카도그래피란?</h3>
                        <p className="font-light leading-relaxed">
                            에스트로카토그래피(Astrocartography)는 '별의 지도'라는 뜻으로, 당신이 태어난 순간의 행성 배치를 세계 지도 위에 투영하는 점성술의 한 분야입니다. 지도 위의 각 행성선은 특정 행성의 에너지가 강하게 나타나는 지역을 의미하며, 이를 통해 특정 장소가 당신의 삶에 어떤 영향을 미칠지 탐색할 수 있습니다.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <h3 className="font-orbitron text-lg text-blue-300">사용 방법</h3>
                        <ol className="list-decimal list-inside space-y-3 font-light leading-relaxed pl-2">
                            <li>
                                <strong>탄생 정보 입력:</strong> 정확한 분석을 위해 당신의 이름, 생년월일, 태어난 시간과 도시를 입력하세요. 만약 태어난 시간을 모른다면, 해당 체크박스를 선택해주세요.
                            </li>
                            <li>
                                <strong>지도 생성:</strong> '지도 생성하기' 버튼을 클릭하여 당신만의 에스트로카토그래피 지도를 만듭니다.
                            </li>
                            <li>
                                <strong>행성선 탐색:</strong> 지도 위에 여러 색상의 선들이 나타납니다. 각 선은 특정 행성과 각도(AC, DC, MC, IC)를 나타냅니다. 범례를 참고하여 각 행성을 확인하세요.
                            </li>
                            <li>
                                <strong>해석 확인:</strong> 궁금한 행성선을 클릭하세요. 오른쪽 패널에 해당 선이 당신의 삶(경력, 관계, 개인적 성장 등)에 미치는 영향에 대한 자세한 해석이 표시됩니다.
                            </li>
                        </ol>
                    </div>
                     <div className="space-y-2">
                        <h3 className="font-orbitron text-lg text-blue-300">알아두기</h3>
                         <p className="font-light leading-relaxed">
                           정확한 출생 시간은 상승선(AC)과 천정선(MC)을 결정하는 데 매우 중요합니다. 시간을 모를 경우, 일부 행성선의 실제 위치가 지도 시뮬레이션과 다를 수 있으며, 제공되는 해석 또한 더 일반적인 내용일 수 있습니다.
                        </p>
                         <p className="font-light leading-relaxed">
                            이 앱에서 제공되는 해석은 Gemini AI를 통해 생성되며, 오락 및 자기 탐색을 위한 참고 자료로 활용해주세요. 중요한 결정을 내릴 때는 전문가와 상담하는 것이 좋습니다.
                        </p>
                    </div>
                </div>
                 <div className="p-4 bg-black/20 text-right rounded-b-lg">
                     <button onClick={onClose} className="font-orbitron bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded-lg transition duration-300 ease-in-out">
                        닫기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HelpModal;