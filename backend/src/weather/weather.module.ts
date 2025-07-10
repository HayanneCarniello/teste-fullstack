import { Module } from "@nestjs/common";
import { WeatherService } from "./weather.service";
import { WeatherController } from "./weather.controller";
import { HttpModule} from '@nestjs/axios';


@Module({
    controllers: [WeatherController],
    imports: [HttpModule],
    providers: [WeatherService],
})
export class WeatherModule {}