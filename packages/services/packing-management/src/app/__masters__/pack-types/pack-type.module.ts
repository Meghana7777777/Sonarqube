import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { GenericTransactionManager } from '../../../database/typeorm-transactions';
import { LoggerService } from '../../../logger';
import { PackTypeEntity } from './entities/pack-type.entity';
import { PackTypeController } from './pack-type.controller';
import { PackTypeService } from './pack-type.service';
import { PackTypeRepo } from './repositories/pack-type.repo';

@Module({
    imports: [
        TypeOrmModule.forFeature([PackTypeEntity]),
    ],
    controllers: [PackTypeController],
    providers: [
        PackTypeService,
        {
            provide: 'PackTypeRepoInterface',
            useClass: PackTypeRepo,
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
export class PackTypeModule { }