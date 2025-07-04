import React, { useState, useEffect } from 'react';

interface ApiKeyManagerProps {
    apiKey: string | null;
    onSetApiKey: (key: string) => void;
}

const ApiKeyManager: React.FC<ApiKeyManagerProps> = ({ apiKey, onSetApiKey }) => {
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        setInputValue(apiKey || '');
    }, [apiKey]);

    const handleSave = () => {
        if (inputValue.trim()) {
            onSetApiKey(inputValue.trim());
        }
    };
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSave();
        }
    }

    const isApiKeySet = apiKey && apiKey.length > 0;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900/80 backdrop-blur-sm border-t border-blue-300/20 p-4 z-30">
            <div className="max-w-screen-xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                <div className="flex items-center gap-3 self-start sm:self-center">
                    <span
                        className={`w-3 h-3 rounded-full flex-shrink-0 ${isApiKeySet ? 'bg-green-500' : 'bg-red-500'}`}
                        style={{ boxShadow: `0 0 8px ${isApiKeySet ? '#22c55e' : '#ef4444'}`}}
                    ></span>
                    <span className="font-orbitron text-sm text-white whitespace-nowrap">Gemini API Key</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${isApiKeySet ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                        {isApiKeySet ? '활성' : '필요'}
                    </span>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <input
                        type="password"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="여기에 API 키를 붙여넣고 저장하세요"
                        className="flex-grow sm:w-80 bg-gray-800/70 border border-blue-400/30 rounded-md shadow-sm py-1.5 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-500 text-sm"
                        aria-label="Gemini API Key Input"
                    />
                    <button
                        onClick={handleSave}
                        className="font-orbitron bg-blue-600 hover:bg-blue-500 text-white font-bold py-1.5 px-4 rounded-lg transition duration-300"
                    >
                        저장
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ApiKeyManager;
