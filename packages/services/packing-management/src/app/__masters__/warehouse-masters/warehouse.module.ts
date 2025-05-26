import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GenericTransactionManager } from '../../../database/typeorm-transactions';

import { DataSource } from 'typeorm';
import { LoggerService } from '../../../logger';
import { FGMWareHouseEntity } from './entities/fg-m-warehouse.entity';
import { WareHouseRepo } from './repositories/warehouse.repo';
import { WareHouseController } from './warehouse.controller';
import { WareHouseService } from './warehouse.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([FGMWareHouseEntity]),
    ],
    controllers: [WareHouseController],
    providers: [
        WareHouseService,
        {
            provide: 'WareHouseRepoInterface',
            useClass: WareHouseRepo,
        },
        {
            provide: 'TransactionManager',
            useFactory: (dataSource: DataSource) => new GenericTransactionManager(dataSource),
            inject: [DataSource],
        },
        {
            provide: 'LoggerService',
            useClass: LoggerService,
        }
    ]
})
export class WareHouseModule { }