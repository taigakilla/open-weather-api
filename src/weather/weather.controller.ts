import { Controller, Get } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { WeatherService } from './weather.service';

@Controller('')
export class WaetherController {
  constructor(
    private readonly weatherService: WeatherService,
    private readonly prisma: PrismaService
  ) {}

  @Get('infos')
  getWeatherInfos() {
    return this.weatherService.getWeatherInfos();
  }

  @Get('efficiency')
  async getEfficiency() {
    return await this.prisma.propiedadesDaMaquina.findMany({
      orderBy: { timestamp: 'desc' },
    });
  }
  @Get('efficiency/latest')
  async getEfficiencyLatest() {
    return await this.prisma.propiedadesDaMaquina.findMany({
      orderBy: { timestamp: 'desc' },
      take: 1,
    });
  }
}
