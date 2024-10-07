import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { default as axios } from 'axios';
import { PrismaService } from 'prisma/prisma.service';
import {
  TempInfos,
  WeatherInfo,
} from './interfaces/weather-response.interface';

@Injectable()
export class WeatherService {
  constructor(private prisma: PrismaService) {}
  async getWeatherInfos() {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=-18.579250&lon=-46.518589&appid=${process.env.API_KEY}&units=metric`
    );

    const weatherResponse = response.data;

    const weatherInfos = weatherResponse.weather[0] as WeatherInfo;

    const tempInfos = weatherResponse.main as TempInfos;

    return {
      city: weatherResponse.name,
      temp: tempInfos.temp,
      feels_like: tempInfos.feels_like,
      main: weatherInfos.description,
      description: weatherInfos.main,
    };
  }
  calculateEfficiency(temperature): number {
    if (temperature >= 28) return 100;
    if (temperature <= 24) return 75;
    const efficiency = Math.round(75 + (25 / 4) * (temperature - 24));

    return efficiency;
  }

  @Cron(CronExpression.EVERY_30_MINUTES)
  async efficiencySyncDB() {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=-18.579250&lon=-46.518589&appid=${process.env.API_KEY}&units=metric`
    );

    const currentTemperature = response.data.main.temp;

    const efficiency = this.calculateEfficiency(currentTemperature);

    await this.prisma.propiedadesDaMaquina.create({
      data: {
        temperatura: currentTemperature,
        eficiencia: efficiency,
        timestamp: new Date(),
      },
    });
  }
}
