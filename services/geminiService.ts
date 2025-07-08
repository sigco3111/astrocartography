import { GoogleGenAI } from "@google/genai";
import { Planet, LineType, CitySuggestion } from '../types';
import { PLANET_INFO, LINE_TYPE_INFO } from '../constants';

export const getAstroInterpretation = async (planet: Planet, lineType: LineType, apiKey: string | null, isTimeUnknown: boolean): Promise<string> => {
    if (!apiKey) {
        return "Gemini API 키가 설정되지 않았습니다. 화면 하단에서 API 키를 입력하고 저장해주세요.";
    }

    const ai = new GoogleGenAI({ apiKey });

    const planetKo = PLANET_INFO[planet].name_ko;
    const lineTypeKo = LINE_TYPE_INFO[lineType].description_ko;
    const lineTypeName = LINE_TYPE_INFO[lineType].name;

    const timeContextMessage = isTimeUnknown
        ? `중요: 사용자의 정확한 출생 시간이 제공되지 않았습니다. 따라서 이 해석은 해당 행성선의 보편적이고 일반적인 의미에 중점을 둡니다. 실제 개인에게 미치는 영향은 다를 수 있다는 점을 고려하여 해석을 제공해주세요.`
        : '';

    const prompt = `
당신은 에스트로카토그래피(Astrocartography) 전문가입니다.
${timeContextMessage}

다음 행성선에 대해 깊이 있고 통찰력 있는 해석을 한국어로 작성해주세요.

- 행성선: ${planetKo} ${lineTypeKo} (${planet} ${lineTypeName})

해석에 다음 내용을 포함해주세요:
1.  핵심 주제: 이 선 근처에 살거나 여행할 때 경험할 수 있는 주요 테마와 에너지에 대해 설명해주세요.
2.  긍정적 측면: 이 행성선의 에너지를 긍정적으로 활용할 수 있는 방법과 잠재적인 기회 (예: 경력, 관계, 개인 성장)를 알려주세요.
3.  도전 과제: 이 선의 에너지가 어떻게 도전적으로 작용할 수 있는지, 그리고 주의해야 할 점은 무엇인지 설명해주세요.
4.  구체적인 조언: 이 지역에서 삶을 최대한 활용하기 위한 실용적인 조언 1-2가지를 제안해주세요.

해석은 친근하면서도 전문적인 톤을 유지하고, 읽기 쉽도록 줄바꿈을 사용하여 단락을 명확하게 구분해주세요. ** 와 같은 마크다운은 사용하지 마세요.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        
        return response.text;
    } catch (error: any) {
        console.error("Error generating interpretation:", error);
        return `해석을 생성하는 동안 오류가 발생했습니다. API 키가 유효한지 확인해주세요. (오류: ${error.message})`;
    }
};

export const getCitySuggestions = async (query: string, apiKey: string | null): Promise<CitySuggestion[]> => {
    if (!apiKey || query.length < 2) {
        return [];
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
    A user is searching for a city with the input: "${query}".
    Provide a list of up to 5 matching major cities from around the world.
    The response must be a valid JSON array of objects.
    Each object in the array must have the following properties:
    - "city": The name of the city in its original language or English.
    - "country": The name of the country in English.
    - "displayName": A string formatted in KOREAN, like "도시, 국가". For example, for San Francisco, USA, it should be "샌프란시스코, 미국". For Seoul, South Korea, it should be "서울, 대한민국".
    - "region": (Optional) The state or province, in English.

    Example response for the query "san fran":
    [
        {
            "city": "San Francisco",
            "region": "California",
            "country": "USA",
            "displayName": "샌프란시스코, 미국"
        }
    ]

    Only output the raw JSON array. Do not include any other text or markdown.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            },
        });
        
        let jsonStr = response.text.trim();
        const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
        const match = jsonStr.match(fenceRegex);
        if (match && match[2]) {
            jsonStr = match[2].trim();
        }

        const suggestions: CitySuggestion[] = JSON.parse(jsonStr);
        if (Array.isArray(suggestions) && suggestions.every(s => s.city && s.country && s.displayName)) {
            return suggestions;
        }
        return [];

    } catch (error) {
        console.error("Error fetching city suggestions:", error);
        return [];
    }
};