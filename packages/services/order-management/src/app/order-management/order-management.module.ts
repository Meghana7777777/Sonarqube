import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoInfoEntity } from '../entity/mo-info.entity';
import { MoInfoRepository } from '../repository/mo-info.repository';
import { OrderManagementController } from './order-management.controller';
import { OrderManagementService } from './order-management-service';

@Module({
    imports: [
        ScheduleModule.forRoot(),
        TypeOrmModule.forFeature([
            MoInfoEntity
        ])
    ],
    controllers: [OrderManagementController],
    providers: [OrderManagementService, MoInfoRepository
    ],
    exports: [OrderManagementService]
})
export class OrderManagementModule { }