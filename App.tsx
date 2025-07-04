import React, { useState, useCallback, useEffect, useRef } from 'react';
import { SelectedLine, BirthData, Planet, CitySuggestion } from './types';
import { getAstroInterpretation, getCitySuggestions } from './services/geminiService';
import AstroMap from './components/AstroMap';
import InterpretationPanel from './components/InterpretationPanel';
import HelpModal from './components/HelpModal';
import { PLANET_INFO } from './constants';
import ApiKeyManager from './components/ApiKeyManager';

const Header: React.FC<{ onHelpClick: () => void }> = ({ onHelpClick }) => (
    <header className="relative text-center p-4 md:p-6">
        <h1 className="font-orbitron text-3xl md:text-5xl font-bold text-white tracking-widest" style={{textShadow: '0 0 10px #60a5fa, 0 0 20px #60a5fa'}}>
            에스트로카토그래피
        </h1>
        <p className="text-blue-300 mt-2 text-sm md:text-base">당신의 잠재력이 빛나는 곳을 찾아보세요</p>
        <button 
            onClick={onHelpClick}
            className="absolute top-4 right-0 md:right-4 w-10 h-10 bg-black/20 rounded-full flex items-center justify-center text-blue-300 hover:bg-blue-500/40 hover:text-white transition-all duration-300 border border-blue-400/30"
            aria-label="도움말 보기"
        >
            <span className="text-2xl font-bold">?</span>
        </button>
    </header>
);

interface BirthDataFormProps {
    birthData: BirthData;
    setBirthData: React.Dispatch<React.SetStateAction<BirthData>>;
    setChartGenerated: (g: boolean) => void;
    apiKey: string | null;
}

const BirthDataForm: React.FC<BirthDataFormProps> = ({birthData, setBirthData, setChartGenerated, apiKey}) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isTimeUnknown = birthData.isTimeUnknown ?? false;

    const [locationQuery, setLocationQuery] = useState(birthData.location);
    const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
    const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(false);
    const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);
    const locationInputRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        setLocationQuery(birthData.location);
    }, [birthData.location]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        if (name === 'location') {
            setLocationQuery(value);
            // Also update the final form data in real-time
            setBirthData(prev => ({...prev, location: value}));
            if (value.length > 1) {
                setIsSuggestionsVisible(true);
            } else {
                setIsSuggestionsVisible(false);
                setSuggestions([]);
            }
        } else {
            setBirthData(prev => ({...prev, [name]: value}));
        }
    };
    
    useEffect(() => {
        if (locationQuery.length < 2 || !isSuggestionsVisible) {
            setSuggestions([]);
            return;
        }

        const handler = setTimeout(() => {
            setIsFetchingSuggestions(true);
            getCitySuggestions(locationQuery, apiKey).then(results => {
                setSuggestions(results);
                setIsFetchingSuggestions(false);
            });
        }, 300); // 300ms debounce

        return () => {
            clearTimeout(handler);
        };
    }, [locationQuery, apiKey, isSuggestionsVisible]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (locationInputRef.current && !locationInputRef.current.contains(event.target as Node)) {
                setIsSuggestionsVisible(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLocationSelect = (suggestion: CitySuggestion) => {
        const locationName = suggestion.displayName;
        setLocationQuery(locationName);
        setBirthData(prev => ({...prev, location: locationName}));
        setSuggestions([]);
        setIsSuggestionsVisible(false);
    };

    const handleTimeUnknownChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;
        setBirthData(prev => ({
            ...prev,
            time: checked ? '' : prev.time,
            isTimeUnknown: checked,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            localStorage.setItem('astro-birth-data', JSON.stringify(birthData));
        } catch (error) {
            console.error("Failed to save birth data to localStorage:", error);
        }
        setTimeout(() => setChartGenerated(true), 1000);
    }

    return (
        <div className="bg-gray-900/50 p-6 rounded-lg border border-blue-300/20 shadow-lg backdrop-blur-sm">
            <h2 className="font-orbitron text-xl text-blue-200 mb-4 border-b border-blue-300/20 pb-2">탄생 정보 입력</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="text-sm font-medium text-blue-300">이름</label>
                    <input type="text" name="name" id="name" value={birthData.name} onChange={handleChange} required placeholder="이름을 입력하세요" className="mt-1 block w-full bg-gray-800/70 border border-blue-400/30 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
                </div>
                 <div>
                    <label htmlFor="date" className="text-sm font-medium text-blue-300">생년월일</label>
                    <input type="date" name="date" id="date" value={birthData.date} onChange={handleChange} required className="mt-1 block w-full bg-gray-800/70 border border-blue-400/30 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" style={{colorScheme: 'dark'}}/>
                </div>
                 <div>
                    <label htmlFor="time" className="text-sm font-medium text-blue-300">태어난 시간</label>
                    <input type="time" name="time" id="time" value={birthData.time} onChange={handleChange} required={!isTimeUnknown} disabled={isTimeUnknown} className="mt-1 block w-full bg-gray-800/70 border border-blue-400/30 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-700/50 disabled:cursor-not-allowed" style={{colorScheme: 'dark'}}/>
                </div>
                <div className="flex items-center gap-2 -mt-2 mb-2">
                    <input type="checkbox" id="timeUnknown" name="timeUnknown" checked={isTimeUnknown} onChange={handleTimeUnknownChange} className="h-4 w-4 rounded border-gray-500 text-blue-600 focus:ring-blue-500 bg-gray-800/70" />
                    <label htmlFor="timeUnknown" className="text-sm text-blue-300">태어난 시간을 모릅니다</label>
                </div>
                <div ref={locationInputRef} className="relative">
                    <label htmlFor="location" className="text-sm font-medium text-blue-300">태어난 도시</label>
                    <input 
                        type="text" 
                        name="location" 
                        id="location" 
                        value={locationQuery} 
                        onChange={handleChange} 
                        onFocus={() => locationQuery.length > 1 && setIsSuggestionsVisible(true)}
                        required 
                        className="mt-1 block w-full bg-gray-800/70 border border-blue-400/30 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                        placeholder="도시 이름 검색..."
                        autoComplete="off"
                    />
                    {isSuggestionsVisible && (
                        <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-blue-400/50 rounded-md shadow-lg max-h-60 overflow-y-auto">
                            {isFetchingSuggestions && (
                                <div className="p-3 text-center text-sm text-gray-400">검색 중...</div>
                            )}
                            {!isFetchingSuggestions && suggestions.length > 0 && (
                                <ul aria-labelledby="location-suggestions">
                                    {suggestions.map((suggestion, index) => (
                                        <li key={`${suggestion.displayName}-${index}`}>
                                            <button 
                                                type="button"
                                                onClick={() => handleLocationSelect(suggestion)}
                                                className="w-full text-left px-4 py-2 text-sm text-white hover:bg-blue-600/50 transition-colors"
                                            >
                                                {suggestion.displayName}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                            {!isFetchingSuggestions && suggestions.length === 0 && locationQuery.length > 1 && (
                                 <div className="p-3 text-center text-sm text-gray-400">결과를 찾을 수 없습니다.</div>
                            )}
                        </div>
                    )}
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full font-orbitron bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800/50 disabled:cursor-not-allowed text-white font-bold py-2.5 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-lg shadow-blue-500/30">
                    {isSubmitting ? '지도 생성 중...' : '지도 생성하기'}
                </button>
            </form>
        </div>
    )
}

const Legend = () => (
    <div className="mt-6 p-4 bg-gray-900/50 rounded-lg border border-blue-300/20 backdrop-blur-sm">
        <h3 className="font-orbitron text-lg text-blue-200 mb-3">범례</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-2 gap-x-4 gap-y-2 text-sm">
            {Object.values(Planet).map((planet) => {
                const {symbol, color, name_ko} = PLANET_INFO[planet];
                return (
                    <div key={planet} className="flex items-center gap-2">
                        <span style={{color: color, textShadow: `0 0 5px ${color}`}} className="font-bold text-xl w-6 text-center">{symbol}</span>
                        <span className="text-blue-200/90">{name_ko}</span>
                    </div>
                )
            })}
        </div>
    </div>
);


const App: React.FC = () => {
    const [birthData, setBirthData] = useState<BirthData>({
        name: '',
        date: '',
        time: '',
        location: '',
        isTimeUnknown: false,
    });
    const [chartGenerated, setChartGenerated] = useState(false);
    const [selectedLine, setSelectedLine] = useState<SelectedLine | null>(null);
    const [interpretation, setInterpretation] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isPanelVisible, setIsPanelVisible] = useState(false);
    const [isHelpVisible, setIsHelpVisible] = useState(false);
    
    const [apiKey, setApiKey] = useState<string | null>(() => {
        try {
            const savedKey = localStorage.getItem('gemini-api-key');
            return savedKey || process.env.API_KEY || null;
        } catch (error) {
            console.error("Failed to access localStorage:", error);
            return process.env.API_KEY || null;
        }
    });

    const handleSetApiKey = (key: string) => {
        const trimmedKey = key.trim();
        setApiKey(trimmedKey);
        try {
            if (trimmedKey) {
                localStorage.setItem('gemini-api-key', trimmedKey);
            } else {
                localStorage.removeItem('gemini-api-key');
            }
        } catch (error) {
            console.error("Failed to save API key to localStorage:", error);
        }
    };

    useEffect(() => {
        const savedData = localStorage.getItem('astro-birth-data');
        if (savedData) {
            try {
                const parsedData: BirthData = JSON.parse(savedData);
                if (parsedData.isTimeUnknown === undefined) {
                    parsedData.isTimeUnknown = !parsedData.time;
                }
                setBirthData(parsedData);
            } catch (e) {
                console.error("Error parsing birth data from localStorage:", e);
                localStorage.removeItem('astro-birth-data');
            }
        }
    }, []);

    const handleLineSelect = useCallback((line: SelectedLine) => {
        if (selectedLine?.planet === line.planet && selectedLine?.lineType === line.lineType) {
            setIsPanelVisible(true);
            return;
        }
        setSelectedLine(line);
    }, [selectedLine]);
    
    const handlePanelClose = () => setIsPanelVisible(false);
    
    useEffect(() => {
        if (!selectedLine) return;

        const fetchInterpretation = async () => {
            setIsLoading(true);
            setInterpretation(null);
            setIsPanelVisible(true);
            const isTimeUnknown = !!birthData.isTimeUnknown;
            const result = await getAstroInterpretation(selectedLine.planet, selectedLine.lineType, apiKey, isTimeUnknown);
            setInterpretation(result);
            setIsLoading(false);
        };

        fetchInterpretation();
    }, [selectedLine, apiKey, birthData.isTimeUnknown]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#010222] to-[#030455] text-white p-4 sm:p-6 lg:p-8 pb-28 sm:pb-20">
            <div className="fixed top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.2),rgba(255,255,255,0))]"></div>
            
            <HelpModal isOpen={isHelpVisible} onClose={() => setIsHelpVisible(false)} />

            <div className="relative z-10 max-w-screen-xl mx-auto">
                <Header onHelpClick={() => setIsHelpVisible(true)} />
                
                {!chartGenerated ? (
                    <div className="max-w-md mx-auto mt-8 animate-fade-in">
                        <BirthDataForm 
                            birthData={birthData} 
                            setBirthData={setBirthData} 
                            setChartGenerated={setChartGenerated}
                            apiKey={apiKey}
                        />
                    </div>
                ) : (
                    <main className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
                        <div className="lg:col-span-2">
                             <AstroMap onLineSelect={handleLineSelect} selectedLine={selectedLine} />
                             <Legend />
                        </div>
                        <div className="lg:col-span-1 min-h-[50vh] lg:min-h-0">
                            {(isPanelVisible || selectedLine) ? (
                                <InterpretationPanel
                                    selectedLine={selectedLine}
                                    isLoading={isLoading}
                                    interpretation={interpretation}
                                    onClose={handlePanelClose}
                                />
                            ) : (
                                 <div className="h-full flex flex-col justify-center items-center text-center p-8 bg-black/30 rounded-lg border border-blue-400/20 backdrop-blur-sm">
                                    <h3 className="font-orbitron text-xl text-blue-200 mb-2">탐험을 시작하세요</h3>
                                    <p className="text-blue-200/80">지도 위의 행성선을 클릭하면 이곳에 자세한 해석이 표시됩니다.</p>
                                </div>
                            )}
                        </div>
                    </main>
                )}
            </div>
            <ApiKeyManager apiKey={apiKey} onSetApiKey={handleSetApiKey} />
        </div>
    );
};

export default App;