import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ForecastPlanningController } from './forecast-planning.controller';
import { ForecastPlanEntity } from './forecast-planning.entity';
import { ForecastPlanningService } from './forecast-planning.service';
import { ForecastPlanningRepo } from './forecast-planning.repository';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([ForecastPlanEntity]),
  ],
  controllers: [ForecastPlanningController],
  providers: [ForecastPlanningService, ForecastPlanningRepo],
  exports: [ForecastPlanningService],
})
export class ForecastPlanningModule {}
