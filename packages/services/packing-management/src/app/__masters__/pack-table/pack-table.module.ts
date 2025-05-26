import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { GenericTransactionManager } from '../../../database/typeorm-transactions';
import { LoggerService } from '../../../logger';
import { JobHeaderEntity } from '../../packing-list/entities/job-header.entity';
import { JobHeaderRepo } from '../../packing-list/repositories/job-header.repo';
import { PackTableEntity } from './entities/pack-table.entity';
import { PackTableController } from './pack-table.controller';
import { PackTableService } from './pack-table.service';
import { PackTableRepo } from './repositories/pack-table.repo';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            PackTableEntity,JobHeaderEntity
        ])],
    controllers: [PackTableController],
    providers: [PackTableService,
        {
            provide: 'PackTableRepoInterface',
            useClass: PackTableRepo,
        },
        {
            provide: 'JobHeaderRepoInterface',
            useClass: JobHeaderRepo,
        },
        {
            provide: 'TransactionManager',
            useFactory: (dataSource: DataSource) => new GenericTransactionManager(dataSource),
            inject: [DataSource],
        },
        {
            provide:'LoggerService',
            useClass:LoggerService
        }
    ],
    exports: [PackTableService]
})
export class PackTableModule { }