import {IsString, IsNotEmpty } from 'class-validator';

export class WeatherQueryDto {
  @IsString()
  @IsNotEmpty()
  city?: string;

}