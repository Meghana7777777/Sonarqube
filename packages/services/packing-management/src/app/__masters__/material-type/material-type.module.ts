import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GenericTransactionManager } from '../../../database/typeorm-transactions';
import { MaterialTypeEntity } from './entities/material-type.entity';
import { MaterialTypeController } from './material-type.controller';
import { MaterialTypeService } from './material-type.service';
import { MaterialTypeRepo } from './repositories/material-type.repo';
import { LoggerService } from '../../../logger';
import { DataSource } from 'typeorm';

@Module({
    imports: [
        TypeOrmModule.forFeature([MaterialTypeEntity]),
    ],
    controllers: [MaterialTypeController],
    providers: [
        MaterialTypeService,
        {
            provide: 'MaterialTypeRepoInterface',
            useClass: MaterialTypeRepo,
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
export class MaterialTypeModule { }