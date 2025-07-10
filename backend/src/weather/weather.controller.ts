import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { WeatherService } from "./weather.service";
import {
  ApiTags,
} from '@nestjs/swagger';

@Controller('weather')
@ApiTags('weather')

export class WeatherController {
    constructor(private readonly weatherService: WeatherService) {}
    @Get()
    async getWeatherAndPokemon(@Query('city') city: string) {
        return this.weatherService.getWeatherAndPokemon(city);
    }
}