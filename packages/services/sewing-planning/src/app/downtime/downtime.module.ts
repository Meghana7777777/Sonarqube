import { Module } from '@nestjs/common';
import { DowntimeController } from './downtime.controller';
import { DowntimeService } from './downtime.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WsDowntimeEntity } from '../entities/ws-downtime';
import { WsDownTimeRepo } from '../entities/repository/ws-downtime.repository';

@Module({
  imports: [TypeOrmModule.forFeature([WsDowntimeEntity])],
  controllers: [DowntimeController],
  providers: [DowntimeService, WsDownTimeRepo]
})
export class DowntimeModule {}
