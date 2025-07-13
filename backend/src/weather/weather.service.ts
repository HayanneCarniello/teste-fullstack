import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import {HttpService} from "@nestjs/axios";
import { firstValueFrom } from 'rxjs';

@Injectable()
export class WeatherService {
    constructor(private readonly httpService: HttpService) {}

    async getWeatherAndPokemon(city:string){

        try{
            const weather = await this.fetchWeather(city);
            const pokemonType = this.getPokemonType(weather.temp, weather.isRaining);
            const pokemons = await this.fetchPokemonList(pokemonType);
        
        return{
            city: city,
            temperature: weather.temp,
            isRaining: weather.isRaining,
            pokemonType,
            pokemons,
        };
    }catch (error) {
        throw new InternalServerErrorException('Erro ao obter dados:' +error.message);
    }
}

private async fetchWeather(city: string): Promise<{ temp: number, isRaining: boolean }> {
    const weatherApiKey = process.env.WEATHER_API_KEY;
    if (!weatherApiKey) {
        throw new InternalServerErrorException('WEATHER_API_KEY não configurada. Por favor, defina a variável de ambiente.');
    }
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}&units=metric`;
    if (!weatherApiKey) {
        throw new InternalServerErrorException('WEATHER_API_KEY não configurada. Por favor, defina a variável de ambiente.');
    }

    const weatherResponse = await firstValueFrom(this.httpService.get(weatherUrl));
    const temp = weatherResponse.data.main.temp;
    const isRaining = weatherResponse.data.weather.some((w: any) => w.main.toLowerCase() === 'rain');
    return{temp, isRaining};
}

private async fetchPokemonList(type: string): Promise<{name:string, id:number, types:string[]}[]> {
    const pokemonApiUrl = `https://pokeapi.co/api/v2/type/${type}`;
    const response = await firstValueFrom(this.httpService.get(pokemonApiUrl));

    const pokemons = response.data.pokemon;
    if (!pokemons || pokemons.length === 0) {
        throw new NotFoundException(`Nenhum Pokémon encontrado para o tipo ${type}`);
    }

    const detailedPokemons = await Promise.all(
        pokemons.slice(0, 9).map(async(p: any) => {
            const id = this.extractIdFromUrl(p.pokemon.url);
            const pokeData = await firstValueFrom(this.httpService.get(`https://pokeapi.co/api/v2/pokemon/${id}`));

            return{
                name: p.pokemon.name,
                id,
                types: pokeData.data.types.map((t: any) => t.type.name).join(', '),
            };
        })
    );
    return detailedPokemons;
}

private extractIdFromUrl(url: string): number {
    const segments = url.split('/');
    return parseInt(segments[segments.length - 2], 10);
}

private getPokemonType(temp: number, isRaining: boolean): string {
    if (isRaining) {return 'eletric'};
    if (temp < 5) {return 'ice'};
    if (temp >= 5 && temp <10) {return 'water'};
    if (temp >=12 && temp <20) {return 'grass'};
    if (temp >=15 && temp <21){return 'ground'};
    if (temp >= 23 && temp <27) {return 'bug'};
    if (temp >= 27 && temp <33) {return 'rock'};
    if (temp >=33) {return 'fire'};
    return 'normal';
    }
}
