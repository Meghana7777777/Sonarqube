import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PackingListService, WmsPackTrimRequestService } from "@xpparel/shared-services";
import { DataSource } from "typeorm";
import { GenericTransactionManager } from "../../database/typeorm-transactions";
import { LoggerService } from "../../logger";
import { SequenceHandlingModule } from "../__common__/sequence-handling/sequence-handling.module";
import { ItemsEntity } from "../__masters__/items/entities/items.entity";
import { ItemsRepo } from "../__masters__/items/repositories/items.repo";
import { BoxMapEntity } from "../__masters__/packing-spec/entities/box-map.entity";
import { PackingSpecEntity } from "../__masters__/packing-spec/entities/packing-spec.entity";
import { CartonParentHierarchyEntity } from "../packing-list/entities/carton-config-parent-hierarchy.entity";
import { ConfigLeastAggregatorEntity } from "../packing-list/entities/config-least-aggregator.entity";
import { CrtnEntity } from "../packing-list/entities/crtns.entity";
import { JobHeaderEntity } from "../packing-list/entities/job-header.entity";
import { PackJobRequestAttributesEntity } from "../packing-list/entities/pack-job-attributes.entity";
import { PLConfigEntity } from "../packing-list/entities/pack-list.entity";
import { CartonRepo } from "../packing-list/repositories/carton-repo";
import { PLConfigRepo } from "../packing-list/repositories/config.repo";
import { JobHeaderRepo } from "../packing-list/repositories/job-header.repo";
import { PackJobReqAttributeRepo } from "../packing-list/repositories/pack-job-attribute-repo";
import { PackMaterialRequestEntity } from "./entities/material-request.entity";
import { PackMatReqLinesEntity } from "./entities/pack-mat-req-lines.entity";
import { PackMatReqWhItemEntity } from "./entities/pack-material-req-wh-item.entity";
import { PackWhJobMaterialIssuanceEntity } from "./entities/pack-wh-job-material-issuance.entity";
import { PAckingMaterialReqInfoService } from "./packing-material-info-service";
import { PackingMaterialReqController } from "./packing-material-req.controller";
import { PackingMaterialReqService } from "./packing-material-req.service";
import { PackMatReqLinesRepo } from "./repositories/pack-mat-req-lines.repo";
import { PackMatReqWhItemRepo } from "./repositories/pack-material-req-wh-item.repo";
import { PackWhJobMaterialIssuanceRepo } from "./repositories/pack-wh-job-material-issuance.repo";
import { PackingMaterialReqRepo } from "./repositories/packing-material-req.repo";


@Module({
    imports: [
        TypeOrmModule.forFeature([PackMatReqLinesEntity, CrtnEntity, CartonParentHierarchyEntity, ConfigLeastAggregatorEntity, PLConfigEntity, JobHeaderEntity, PackingSpecEntity, BoxMapEntity, ItemsEntity, PackMaterialRequestEntity, PackJobRequestAttributesEntity, PackMatReqWhItemEntity,PackWhJobMaterialIssuanceEntity
        ]),
        SequenceHandlingModule
    ],
    controllers: [PackingMaterialReqController],
    providers: [
        PAckingMaterialReqInfoService,
        PackingMaterialReqService,
        PackingListService,
        ItemsRepo,
        JobHeaderRepo,
        WmsPackTrimRequestService,
        {
            provide: 'PackingMaterialReqRepoInterface',
            useClass: PackingMaterialReqRepo,
        },
        {
            provide: 'PLConfigRepoInterface',
            useClass: PLConfigRepo
        },
        {
            provide: 'JobHeaderRepoInterface',
            useClass: JobHeaderRepo
        },
        {
            provide: 'CartonRepoInterFace',
            useClass: CartonRepo
        },
        {
            provide: 'PackMatReqLinesRepoInterface',
            useClass: PackMatReqLinesRepo
        },
        {
            provide: 'PackJobReqAttributeRepoInterFace',
            useClass: PackJobReqAttributeRepo,
        },
        {
            provide: 'PackMatReqWhItemRepoInterface',
            useClass: PackMatReqWhItemRepo,
        },
        {
            provide: 'PackWhJobMaterialIssuanceRepoInterface',
            useClass: PackWhJobMaterialIssuanceRepo,
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
export class PackingMaterialReqModule {

}