import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaService } from 'prisma/prisma.service';
import { WaetherController } from './weather.controller';
import { WeatherService } from './weather.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [WaetherController],
  providers: [WeatherService, PrismaService],
})
export class WeatherModule {}
