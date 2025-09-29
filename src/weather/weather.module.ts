import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaService } from 'prisma/prisma.service';
import { WeatherServiceProxy } from './weather-proxy.service';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [WeatherController],
  providers: [
    PrismaService,
    {
      provide: 'REAL_WEATHER_SERVICE',
      useClass: WeatherService,
    },
    {
      provide: WeatherService,
      useClass: WeatherServiceProxy,
    },
  ],
  exports: [WeatherService],
})
export class WeatherModule {}
