export enum Planet {
    Sun = 'Sun',
    Moon = 'Moon',
    Mercury = 'Mercury',
    Venus = 'Venus',
    Mars = 'Mars',
    Jupiter = 'Jupiter',
    Saturn = 'Saturn',
}

export enum LineType {
    AC = 'AC', // Ascendant
    DC = 'DC', // Descendant
    MC = 'MC', // Midheaven
    IC = 'IC', // Imum Coeli
}

export interface SelectedLine {
    planet: Planet;
    lineType: LineType;
}

export interface BirthData {
    name: string;
    date: string;
    time: string;
    location: string;
    isTimeUnknown?: boolean;
}

export interface CitySuggestion {
    city: string;
    region?: string;
    country: string;
    displayName: string;
}
