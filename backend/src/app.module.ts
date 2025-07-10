import { Module } from '@nestjs/common';
import { WeatherModule  } from './weather/weather.module';
import { HttpModule} from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';



@Module({
  imports: [
     ConfigModule.forRoot({
      // Optional: Specify a custom .env file path if not in the root
      // envFilePath: '.env.development',
      // Optional: Make ConfigModule global so you don't need to import it in other modules
      isGlobal: true, 
    }),
    WeatherModule, HttpModule],
  providers: [],
  controllers: [ ],
//   controllers: [WeatherModule ],
})
export class AppModule {}
