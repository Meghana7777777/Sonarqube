import { Module } from "@nestjs/common";
import { RejectedReasonsController } from "./rejected-reasons.controller";
import { RejectedReasonsRepository } from "./repositories/rejected-reasons.repo";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RejectedReasonsEntity } from "./entities/rejected-reasons.entity";
import { RejectedReasonsService } from "./rejected-reasons.service";
import { DataSource } from "typeorm";
import { GenericTransactionManager } from "../../../database/typeorm-transactions";
import { LoggerService } from "../../../logger";

@Module({
    imports: [TypeOrmModule.forFeature([
        RejectedReasonsEntity
    ])],
    controllers: [RejectedReasonsController],
    providers: [RejectedReasonsService,
        {
            provide: 'RejectedReasonsRepoInterface',
            useClass: RejectedReasonsRepository
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
    ]
})

export class RejectedReasonsModule { }