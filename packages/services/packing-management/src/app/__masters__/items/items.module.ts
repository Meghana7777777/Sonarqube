import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LoggerService } from "../../../logger";
import { ItemDimensionsEntity } from "./entities/item-dimensions.entity";
import { ItemsEntity } from "./entities/items.entity";
import { ItemsController } from "./items.controller";
import { ItemsService } from "./items.service";
import { ItemsRepo } from "./repositories/items.repo";
import { ItemDimensionsRepo } from "./repositories/item-dimensions.repo";
import { DataSource } from "typeorm";
import { GenericTransactionManager } from "../../../database/typeorm-transactions";

@Module({
    imports: [
        TypeOrmModule.forFeature([ItemsEntity, ItemDimensionsEntity]),
    ],
    controllers: [ItemsController],
    providers: [
        ItemsService,
        {
            provide: 'ItemsRepoInterface',
            useClass: ItemsRepo,
        },
        {
            provide: 'ItemDimensionsRepoInterface',
            useClass: ItemDimensionsRepo,
        },
        {
            provide: 'LoggerService',
            useClass: LoggerService,
        },
        {
            provide: 'TransactionManager',
            useFactory: (dataSource: DataSource) => new GenericTransactionManager(dataSource),
            inject: [DataSource],
        },
    ]
})
export class ItemsModule { }