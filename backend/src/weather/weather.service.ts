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
            const pokemonNames = await this.fetchPokemonList(pokemonType);
        
        return{
            city: city,
            temperature: weather.temp,
            isRaining: weather.isRaining,
            pokemonType,
            pokemonNames,
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

private async fetchPokemonList(type: string): Promise<string[]> {
    const pokemonApiUrl = `https://pokeapi.co/api/v2/type/${type}`;
    const response = await firstValueFrom(this.httpService.get(pokemonApiUrl));
    if (!response.data.pokemon || response.data.pokemon.length === 0) {
        throw new NotFoundException(`Nenhum Pokémon encontrado para o tipo ${type}`);
    }
    return response.data.pokemon.map((p: any) => p.pokemon.name);
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
