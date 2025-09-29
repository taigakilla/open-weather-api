import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import axios from 'axios';
import { PrismaService } from 'prisma/prisma.service';
import { IWeatherService } from './interfaces/weather.interface';

@Injectable()
export class WeatherServiceProxy implements IWeatherService {
  private cache: any = null;
  private lastFetchTime: number = 0;
  private readonly CACHE_DURATION = 1000 * 60; // 1 minuto

  constructor(private readonly prisma: PrismaService) {}

  async getWeatherInfos() {
    const now = Date.now();

    if (this.cache && now - this.lastFetchTime < this.CACHE_DURATION) {
      console.log('Retornando cache');
      return this.cache;
    }

    console.log('Chamando API real');
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=-18.579250&lon=-46.518589&appid=${process.env.API_KEY}&units=metric&lang=pt_br`
    );

    const weatherResponse = response.data;

    this.cache = {
      city: weatherResponse.name,
      temp: weatherResponse.main.temp,
      feels_like: weatherResponse.main.feels_like,
      main: weatherResponse.weather[0].description,
    };

    this.lastFetchTime = now;
    return this.cache;
  }

  calculateEfficiency(temperature: number): number {
    if (temperature >= 28) return 100;
    if (temperature <= 24) return 75;
    return Math.round(75 + (25 / 4) * (temperature - 24));
  }

  async saveEfficiency(weatherData: { temp: number; eficiencia: number }) {
    if (weatherData.temp < -50 || weatherData.temp > 60)
      throw new Error('Temperatura inválida');

    if (weatherData.eficiencia < 0 || weatherData.eficiencia > 100)
      throw new Error('Eficiência inválida');

    try {
      await this.prisma.$transaction(async (tx) => {
        await tx.propiedadesDaMaquina.create({
          data: {
            temperatura: weatherData.temp,
            eficiencia: weatherData.eficiencia,
            timestamp: new Date(),
          },
        });
      });
      console.log('Eficiência salva no banco com sucesso');
    } catch (error) {
      console.error('Erro ao salvar no banco, operação revertida', error);
      throw error;
    }
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async efficiencySyncDB() {
    try {
      const weather = await this.getWeatherInfos();
      const efficiency = this.calculateEfficiency(weather.temp);
      await this.saveEfficiency({ temp: weather.temp, eficiencia: efficiency });
    } catch (error) {
      console.error('Erro ao sincronizar eficiência:', error);
    }
  }
}
