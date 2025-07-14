export interface ApiPokemon{
    name: string;
    url: string;
}

export interface Pokemon {
    id: number;
    name: string;
    image:string;
    types:string[];
}

export interface WeatherData {
    city: string;
    temperature: number;
    isRaining: boolean;
    type: string;
}