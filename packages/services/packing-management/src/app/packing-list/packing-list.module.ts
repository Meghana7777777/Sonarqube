import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ColorsService, MoOpRoutingService, PKMSBullQueueService, PkShippingRequestService } from "@xpparel/shared-services";
import { DataSource } from "typeorm";
import { GenericTransactionManager } from "../../database/typeorm-transactions";
import { LoggerService } from "../../logger";
import { FileUploadEntity } from "../__common__/file-upload/entity/file-upload.entity";
import { SequenceHandlingModule } from "../__common__/sequence-handling/sequence-handling.module";
import { ItemDimensionsEntity } from "../__masters__/items/entities/item-dimensions.entity";
import { ItemsEntity } from "../__masters__/items/entities/items.entity";
import { ItemsService } from "../__masters__/items/items.service";
import { ItemDimensionsRepo } from "../__masters__/items/repositories/item-dimensions.repo";
import { ItemsRepo } from "../__masters__/items/repositories/items.repo";
import { TempFGToCartonItemsMapEntity } from "../pre-integrations/entities/temp-fg-to-carton-items-map.entity";
import { PKMSPoLineEntity } from "../pre-integrations/pkms-po-entities/pkms-po-line-entity";
import { PKMSPoProductEntity } from "../pre-integrations/pkms-po-entities/pkms-po-product-entity";
import { PKMSPoSerialsEntity } from "../pre-integrations/pkms-po-entities/pkms-po-serials-entity";
import { PKMSPoSubLineEntity } from "../pre-integrations/pkms-po-entities/pkms-po-sub-line-entity";
import { PKMSProcessingOrderEntity } from "../pre-integrations/pkms-po-entities/pkms-processing-order-entity";
import { PKMSProductSubLineFeaturesEntity } from "../pre-integrations/pkms-po-entities/pkms-product-sub-line-features-entity";
import { PKMSPoLineRepository } from "../pre-integrations/pkms-po-repositories/repos/pkms-po-line.repo";
import { PKMSPoProductRepository } from "../pre-integrations/pkms-po-repositories/repos/pkms-po-product.repo";
import { PKMSPoSerialsRepository } from "../pre-integrations/pkms-po-repositories/repos/pkms-po-serials-repo";
import { PKMSPoSubLineRepository } from "../pre-integrations/pkms-po-repositories/repos/pkms-po-sub-line.repo";
import { PKMSProcessingOrderRepository } from "../pre-integrations/pkms-po-repositories/repos/pkms-processing-order.repo";
import { PKMSProductSubLineFeaturesRepository } from "../pre-integrations/pkms-po-repositories/repos/pkms-product-sub-line-features.repo";
import { PreIntegrationModule } from "../pre-integrations/pre-integration.module";
import { PreIntegrationService } from "../pre-integrations/pre-integration.service";
import { CartonParentHierarchyEntity } from "./entities/carton-config-parent-hierarchy.entity";
import { CartonTemplateAttributesEntity } from "./entities/carton-template-attributes.entity";
import { ConfigLeastAggregatorEntity } from "./entities/config-least-aggregator.entity";
import { ConfigLeastChildEntity } from "./entities/config-least-child.entity";
import { CrtnItemsEntity } from "./entities/crtn-item.entity";
import { CrtnEntity } from "./entities/crtns.entity";
import { JobHeaderEntity } from "./entities/job-header.entity";
import { PackOrderBomEntity } from "./entities/pack-bom.entity";
import { PackJobRequestAttributesEntity } from "./entities/pack-job-attributes.entity";
import { PLConfigEntity } from "./entities/pack-list.entity";
import { PackListRequestAttributesEntity } from "./entities/packlist-attributes.entity";
import { PackingListController } from "./packing-list.controller";
import { PackingListInfoService } from "./packing-list.info.service";
import { PackListService } from "./packing-list.service";
import { CartonConfigParentHierarchyRepo } from "./repositories/carton-config-parent-hierarchy.repo";
import { CrtnItemsRepo } from "./repositories/carton-item-repo";
import { CartonRepo } from "./repositories/carton-repo";
import { CartonReqAttributeRepo } from "./repositories/carton-req-attribute-repo";
import { ConfigLeastAggregatorRepo } from "./repositories/config-least-aggregator.repo";
import { ConfigLeastChildRepo } from "./repositories/config-least-child.repo";
import { PLConfigRepo } from "./repositories/config.repo";
import { JobHeaderRepo } from "./repositories/job-header.repo";
import { PackJobReqAttributeRepo } from "./repositories/pack-job-attribute-repo";
import { PackListReqAttributeRepo } from "./repositories/pack-list-attribute-repo";
import { PackOrderBomRepo } from "./repositories/pack-order-bom-repo";

@Module({
    imports: [
        TypeOrmModule.forFeature([PLConfigEntity, ConfigLeastChildEntity, CartonParentHierarchyEntity, JobHeaderEntity, CrtnItemsEntity, CrtnEntity, ConfigLeastAggregatorEntity, ItemsEntity,
            FileUploadEntity, PackJobRequestAttributesEntity, PackListRequestAttributesEntity, CartonTemplateAttributesEntity,
            ItemDimensionsEntity,
            PKMSProcessingOrderEntity,
            PKMSPoLineEntity,
            PKMSPoProductEntity,
            PKMSPoSubLineEntity,
            PKMSProductSubLineFeaturesEntity,
            PKMSPoSerialsEntity,
            PackOrderBomEntity,
            TempFGToCartonItemsMapEntity
        ]),
        PreIntegrationModule,
        SequenceHandlingModule,
    ],
    controllers: [PackingListController],
    exports: [PackListService, PackingListInfoService],
    providers: [
        PackListService,
        PackingListInfoService,
        PreIntegrationService,
        ColorsService,
        PkShippingRequestService,
        PKMSBullQueueService,
        PKMSProcessingOrderRepository,
        MoOpRoutingService,
        PackOrderBomRepo,
        ItemsService,
        {
            provide: 'CartonConfigParentHierarchyRepoInterface',
            useClass: CartonConfigParentHierarchyRepo,
        },
        {
            provide: 'ConfigLeastChildRepoInterface',
            useClass: ConfigLeastChildRepo,
        },
        {
            provide: 'ConfigLeastAggregatorRepoInterface',
            useClass: ConfigLeastAggregatorRepo,
        },
        {
            provide: 'CartonRepoInterFace',
            useClass: CartonRepo,
        },
        {
            provide: 'ConfigRepoInterface',
            useClass: PLConfigRepo,
        },
        {
            provide: 'JobHeaderRepoInterface',
            useClass: JobHeaderRepo,
        },
        {
            provide: 'ItemsRepoInterface',
            useClass: ItemsRepo,
        },
        {
            provide: 'CrtnItemsRepoInterface',
            useClass: CrtnItemsRepo,
        },
        {
            provide: 'PackJobReqAttributeRepoInterFace',
            useClass: PackJobReqAttributeRepo,
        },
        {
            provide: 'PackListReqAttributeRepoInterFace',
            useClass: PackListReqAttributeRepo,
        },
        {
            provide: 'CartonJobReqAttributeRepoInterFace',
            useClass: CartonReqAttributeRepo,
        },
        {
            provide: 'ItemDimensionsRepoInterface',
            useClass: ItemDimensionsRepo,
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
            provide: 'PKMSPoProductRepoInterface',
            useClass: PKMSPoProductRepository
        },
        {
            provide: 'PKMSPoSubLineRepoInterface',
            useClass: PKMSPoSubLineRepository
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
export class PackingListModule { }