import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PackingListService } from "@xpparel/shared-services";
import { DataSource } from "typeorm";
import { GenericTransactionManager } from "../../../database/typeorm-transactions";
import { LoggerService } from "../../../logger";
import { SequenceHandlingModule } from "../../__common__/sequence-handling/sequence-handling.module";
import { LocationAllocationModule } from "../../location-allocation/location-allocation.module";
import { CrtnEntity } from "../../packing-list/entities/crtns.entity";
import { JobHeaderEntity } from "../../packing-list/entities/job-header.entity";
import { PackJobRequestAttributesEntity } from "../../packing-list/entities/pack-job-attributes.entity";
import { PLConfigEntity } from "../../packing-list/entities/pack-list.entity";
import { CartonRepo } from "../../packing-list/repositories/carton-repo";
import { PLConfigRepo } from "../../packing-list/repositories/config.repo";
import { JobHeaderRepo } from "../../packing-list/repositories/job-header.repo";
import { PackJobReqAttributeRepo } from "../../packing-list/repositories/pack-job-attribute-repo";
import { PackMatReqWhItemEntity } from "../../packing-material-request/entities/pack-material-req-wh-item.entity";
import { PAckingMaterialReqInfoService } from "../../packing-material-request/packing-material-info-service";
import { PackMatReqLinesRepo } from "../../packing-material-request/repositories/pack-mat-req-lines.repo";
import { PackMatReqWhItemRepo } from "../../packing-material-request/repositories/pack-material-req-wh-item.repo";
import { PackingMaterialReqRepo } from "../../packing-material-request/repositories/packing-material-req.repo";
import { PackInsRequestItemEntity } from "../entites/ins-request-items.entity";
import { PackInsRequestAttributeEntity } from "../entites/pkms-ins-request-attributes.entity";
import { PackInsRequestEntity } from "../entites/request.entity";
import { ItemsRepo } from "../items/repositories/items.repo";
import { InspectionPreferenceEntity } from "./entites/inspection-preference.entity";
import { InspectionPreferenceService } from "./inspection-preference-service";
import { InspectionPreferenceController } from "./inspection-preference.controller";
import { InspectionPreferenceRepository } from "./repository/inspection-preference-repository";
import { PackInsReqRepository } from "./repository/pack-ins-req-repository";
import { PKReqAttributesRepository } from "./repository/pk-ins-req-attributes-repository";
import { PKReqItemsRepository } from "./repository/pk-req-items-repository";
import { ItemsEntity } from "../items/entities/items.entity";
import { PackMaterialRequestEntity } from "../../packing-material-request/entities/material-request.entity";
import { PackMatReqLinesEntity } from "../../packing-material-request/entities/pack-mat-req-lines.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([InspectionPreferenceEntity, PLConfigEntity, JobHeaderEntity, CrtnEntity, PackInsRequestEntity, PackInsRequestItemEntity, PackInsRequestAttributeEntity, PackJobRequestAttributesEntity, PackMatReqWhItemEntity, ItemsEntity, PackMaterialRequestEntity, PackMatReqLinesEntity]),
        SequenceHandlingModule,
        LocationAllocationModule
    ],
    controllers: [InspectionPreferenceController],
    providers: [
        InspectionPreferenceService, PAckingMaterialReqInfoService, PackingListService, ItemsRepo, JobHeaderRepo,
        {
            provide: 'InspectionPreferenceRepoInterface',
            useClass: InspectionPreferenceRepository,
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
            provide: 'PLConfigRepoInterface',
            useClass: PLConfigRepo,
        },
        {
            provide: 'PackInsReqRepoInterface',
            useClass: PackInsReqRepository,
        },
        {
            provide: 'PackingMaterialReqRepoInterface',
            useClass: PackingMaterialReqRepo,
        },
        {
            provide: 'PackMatReqLinesRepoInterface',
            useClass: PackMatReqLinesRepo
        },
        {
            provide: "PkReqItemsRepoInterface",
            useClass: PKReqItemsRepository
        },
        {
            provide: "PkReqAttributesRepoInterface",
            useClass: PKReqAttributesRepository
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
export class InspectionPreferenceModule { }