import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderConfigController } from './order-config.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { OrderConfigService } from './order-config.service';
import { MoOpRoutingService } from './mo-op-routing.service';
import { MOProductFgColorRepository } from './repository/mo-product-fg-color.repository';
import { MoOpVersionRepository } from './repository/mo-op-version.repository';
import { MoOpProcessTypeRepository } from './repository/mo-op-proc-type.repository';
import { MoOpSubProcessRepository } from './repository/mo-op-sub-process.repository';
import { MoOpSubProcessBomRepository } from './repository/mo-op-sub-proc-bom.repository';
import { MoOpSubProcessOpRepository } from './repository/mo-op-sub-process-op.repository';
import { MoOpSubProcessComponentRepository } from './repository/mo-op-sub-proc-comp.repository';
import { MOProductFgColorEntity } from './entity/mo-product-color.entity';
import { MoOpVersionEntity } from './entity/mo-op-version.entity';
import { MoOpSubProcessBomEntity } from './entity/mo-op-sub-proc-bom.entity';
import { StyleOpRoutingService } from '../style-management/style-op-routing.service';
import { StyleOpRoutingModule } from '../style-management/style-op-routing.module';
import { MoItemConsumptionRepository } from './repository/mo-item-consumption.repository';
import { MoInfoRepository } from '../repository/mo-info.repository';
import { MoLineRepository } from '../repository/mo-line.repository';
import { MoLineProductRepository } from '../repository/mo-line-product.repository';
import { MoProductSubLineRepository } from '../repository/mo-product-sub-line.repository';
import { MoPoBundleEntity } from '../entity/mo-po-bundle.entity';
import { MoPoBundleRepository } from '../repository/mo-po-bundle.repository';
import { MoPoBundleService } from './mo-po-bundle.service';
import { MoOpProcTypeEntity } from './entity/mo-op-proc-type.entity';
import { MoOpSubprocessEntity } from './entity/mo-op-sub-process.entity';
import { MoOpSubProcessOPEntity } from './entity/mo-op-sub-process-op.entity';
import { MoOpSubProcessComponentEntity } from './entity/mo-op-sub-proc-comp.entity';
import { MoItemConsumptionEntity } from './entity/mo-item-consumption.entity';
import { MoProductFgColorService } from './mo-product-fg-colo.service';
import { RawMaterialInfoRepository } from '../repository/rm-info.repository';
import { OrderConfigHelperService } from './order-config-helper.service';
import { CpsPslService, FgCreationService, PKMSBullQueueService } from '@xpparel/shared-services';
import { MoInfoController } from './mo-info.controller';
import { MoInfoService } from './mo-info.service';
import { OrderCreationInfoService } from '../order-creation/order-creation-info.service';
import { OrderCreationModule } from '../order-creation/order-creation.module';
@Module({
    imports: [
        ScheduleModule.forRoot(),
        TypeOrmModule.forFeature([
            MOProductFgColorEntity,
            MoOpVersionEntity,
            MoOpProcessTypeRepository,
            MoOpSubProcessRepository,
            MoPoBundleEntity,
            MoOpProcTypeEntity,
            MoOpSubprocessEntity,
            MoOpSubProcessOPEntity,
            MoOpSubProcessComponentEntity,
            MoOpSubProcessBomEntity,
            MoItemConsumptionEntity

        ]),
        forwardRef(() => StyleOpRoutingModule),
        OrderCreationModule
    ],
    controllers: [OrderConfigController, MoInfoController],
    providers: [OrderConfigService, MoOpRoutingService, MOProductFgColorRepository, MoOpVersionRepository, MoOpProcessTypeRepository, MoOpSubProcessRepository, MoOpSubProcessBomRepository, MoOpSubProcessOpRepository, MoOpSubProcessComponentRepository, MoItemConsumptionRepository, MoInfoRepository, MoLineRepository, MoLineProductRepository, MoProductSubLineRepository, MoPoBundleRepository, MoPoBundleService, MoProductFgColorService, RawMaterialInfoRepository, OrderConfigHelperService, FgCreationService, PKMSBullQueueService, MoInfoService, CpsPslService],
    exports: [OrderConfigService]
})
export class OrderConfigModule { }