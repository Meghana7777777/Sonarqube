import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { JobHeaderEntity } from '../packing-list/entities/job-header.entity';
import { PackJobController } from './pack-job-planning.controller';
import { PackJobService } from './pack-job-planning.service';
import { LoggerService } from '../../logger';
import { GenericTransactionManager } from '../../database/typeorm-transactions';
import { PackTableRepo } from '../__masters__/pack-table/repositories/pack-table.repo';
import { PackTableEntity } from '../__masters__/pack-table/entities/pack-table.entity';
import { JobHeaderRepo } from '../packing-list/repositories/job-header.repo';
import { PackingMaterialReqRepo } from '../packing-material-request/repositories/packing-material-req.repo';
import { PackMaterialRequestEntity } from '../packing-material-request/entities/material-request.entity';
import { PKMSProcessingOrderEntity } from '../pre-integrations/pkms-po-entities/pkms-processing-order-entity';
import { PKMSProcessingOrderRepository } from '../pre-integrations/pkms-po-repositories/repos/pkms-processing-order.repo';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            JobHeaderEntity, PackTableEntity, PackMaterialRequestEntity, PKMSProcessingOrderEntity,
        ])],
    controllers: [PackJobController],
    providers: [PackJobService,
        {
            provide: 'PackTableRepoInterface',
            useClass: PackTableRepo
        },
        {
            provide: 'JobHeaderRepoInterface',
            useClass: JobHeaderRepo,
        },
        {
            provide: 'PackingMaterialReqRepoInterface',
            useClass: PackingMaterialReqRepo,
        },
        {
            provide: 'PKMSProcessingOrderRepoInterface',
            useClass: PKMSProcessingOrderRepository
        },
        {
            provide: 'TransactionManager',
            useFactory: (dataSource: DataSource) => new GenericTransactionManager(dataSource),
            inject: [DataSource],
        },
        {
            provide: 'LoggerService',
            useClass: LoggerService
        }
    ],
    exports: [PackJobService]
})
export class PackJobModule {

}