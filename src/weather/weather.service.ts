import { Injectable } from '@nestjs/common';
import { default as axios } from 'axios';
import { PrismaService } from 'prisma/prisma.service';
import {
  TempInfos,
  WeatherInfo,
} from './interfaces/weather-response.interface';
import { IWeatherService } from './interfaces/weather.interface';

@Injectable()
export class WeatherService implements IWeatherService {
  constructor(private prisma: PrismaService) {}
  async getWeatherInfos() {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=-18.579250&lon=-46.518589&appid=${process.env.API_KEY}&units=metric&lang=pt_br`
    );

    const weatherResponse = response.data;

    const weatherInfos = weatherResponse.weather[0] as WeatherInfo;

    const tempInfos = weatherResponse.main as TempInfos;

    return {
      city: weatherResponse.name,
      temp: tempInfos.temp,
      feels_like: tempInfos.feels_like,
      main: weatherInfos.description,
    };
  }
}
