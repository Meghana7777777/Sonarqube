import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { GenericTransactionManager } from "../../../database/typeorm-transactions";
import { LoggerService } from "../../../logger";
import { BoxMapEntity } from "./entities/box-map.entity";
import { PackingSpecEntity } from "./entities/packing-spec.entity";
import { PackingSpecController } from "./packing-spec.controller";
import { PackingSpecService } from "./packing-spec.service";
import { BoxMapRepo } from "./repositories/box-map-repo";
import { PackingSpecRepo } from "./repositories/packing-spec-repo";

@Module({
    imports: [
        TypeOrmModule.forFeature([PackingSpecEntity, BoxMapEntity]),
    ],
    controllers: [PackingSpecController],
    providers: [
        PackingSpecService,
        {
            provide: 'PackingSpecRepoInterface',
            useClass: PackingSpecRepo,
        },
        {
            provide: 'BoxMapEntityRepoInterface',
            useClass: BoxMapRepo
        },
        {
            provide: 'LoggerService',
            useClass: LoggerService
        },
        {
            provide: 'TransactionManager',
            useFactory: (dataSource: DataSource) => new GenericTransactionManager(dataSource),
            inject: [DataSource],
        },
        {
            provide: 'TransactionManager',
            useFactory: (dataSource: DataSource) => new GenericTransactionManager(dataSource),
            inject: [DataSource],
        },
    ]
})
export class PackingSpecModule { }