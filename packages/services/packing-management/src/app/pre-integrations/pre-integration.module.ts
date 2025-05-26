import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MOConfigService, MoOpRoutingService, OpReportingService, OrderCreationService, OrderManipulationServices, PackingDataFeedExternalService, PKMSBullQueueService } from "@xpparel/shared-services";
import { DataSource } from "typeorm";
import { GenericTransactionManager } from "../../database/typeorm-transactions";
import { LoggerService } from "../../logger";
import { FgEntity } from "./entities/fg.entity";
import { OslInfoEntity } from "./entities/osl-info.entity";
import { TempOSLRefToCartonMapEntity } from "./entities/temp-osl-ref-to-crt-map.entity";
import { PKMSFgCreationService } from "./fg-creation.service";
import { PKMSPoLineEntity } from "./pkms-po-entities/pkms-po-line-entity";
import { PKMSPoProductEntity } from "./pkms-po-entities/pkms-po-product-entity";
import { PKMSPoSerialsEntity } from "./pkms-po-entities/pkms-po-serials-entity";
import { PKMSPoSubLineEntity } from "./pkms-po-entities/pkms-po-sub-line-entity";
import { PKMSProcessingOrderEntity } from "./pkms-po-entities/pkms-processing-order-entity";
import { PKMSProductSubLineFeaturesEntity } from "./pkms-po-entities/pkms-product-sub-line-features-entity";
import { PKMSRoutingGroupEntity } from "./pkms-po-entities/pkms-routing-group-entity";
import { PKMSPoLineRepository } from "./pkms-po-repositories/repos/pkms-po-line.repo";
import { PKMSPoProductRepository } from "./pkms-po-repositories/repos/pkms-po-product.repo";
import { PKMSPoSerialsRepository } from "./pkms-po-repositories/repos/pkms-po-serials-repo";
import { PKMSPoSubLineRepository } from "./pkms-po-repositories/repos/pkms-po-sub-line.repo";
import { PKMSProcessingOrderRepository } from "./pkms-po-repositories/repos/pkms-processing-order.repo";
import { PKMSProductSubLineFeaturesRepository } from "./pkms-po-repositories/repos/pkms-product-sub-line-features.repo";
import { PKMSRoutingGroupRepository } from "./pkms-po-repositories/repos/pkms-routing-group-repo";
import { PreIntegrationController } from "./pre-integration.controller";
import { PreIntegrationService } from "./pre-integration.service";
import { FgRepository } from "./repositories/fg.repository";
import { OslInfoRepository } from "./repositories/osl-info.repository";
import { TempOSLRefToCrtMapRepository } from "./repositories/temp-osl-ref-to-crt-map.repository";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            PKMSProcessingOrderEntity,
            PKMSPoLineEntity,
            PKMSPoProductEntity,
            PKMSPoSubLineEntity,
            PKMSProductSubLineFeaturesEntity,
            PKMSPoSerialsEntity,
            PKMSRoutingGroupEntity,
            FgEntity,
            OslInfoEntity,
            TempOSLRefToCartonMapEntity
        ]),
        PackingDataFeedExternalService,
        MoOpRoutingService
    ],
    controllers: [PreIntegrationController],
    providers: [
        FgRepository,
        OslInfoRepository,
        TempOSLRefToCrtMapRepository,
        PackingDataFeedExternalService,
        PreIntegrationService,
        PKMSFgCreationService,
        OrderManipulationServices,
        PKMSBullQueueService,
        OrderCreationService,
        MOConfigService,
        MoOpRoutingService,
        OpReportingService,
        {
            provide: 'TransactionManager',
            useFactory: (dataSource: DataSource) => new GenericTransactionManager(dataSource),
            inject: [DataSource],
        },
        {
            provide: 'LoggerService',
            useClass: LoggerService,
        },
        {
            provide: 'PKMSProcessingOrderRepoInterface',
            useClass: PKMSProcessingOrderRepository
        },
        {
            provide: 'PKMSPoLineRepoInterface',
            useClass: PKMSPoLineRepository
        },
        {
            provide: 'PKMSPoSubLineRepoInterface',
            useClass: PKMSPoSubLineRepository
        },
        {
            provide: 'PKMSPoProductRepoInterface',
            useClass: PKMSPoProductRepository
        },
        {
            provide: 'PKMSProductSubLineFeaturesInterface',
            useClass: PKMSProductSubLineFeaturesRepository
        },
        {
            provide: 'PKMSPoSerialsRepoInterface',
            useClass: PKMSPoSerialsRepository
        },
        {
            provide: 'PKMSRoutingGroupInterface',
            useClass: PKMSRoutingGroupRepository
        }

    ],
    exports: [PreIntegrationService, PKMSFgCreationService, OrderManipulationServices, OrderCreationService, MOConfigService]
})
export class PreIntegrationModule { }
