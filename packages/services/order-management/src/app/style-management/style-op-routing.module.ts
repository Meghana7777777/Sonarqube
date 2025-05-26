import { forwardRef, Module } from '@nestjs/common';
import { StyleOpRoutingService } from './style-op-routing.service';
import { StyleOpRoutingController } from './style-op-routing.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StyleProductTypeEntity } from './entity/style-product.entity';
import { SpOpVersionEntity } from './entity/sp-op-version.entity';
import { SpProcTypeEntity } from './entity/sp-proc-type.entity';
import { SpSubprocessEntity } from './entity/sp-sub-process.entity';
import { SpSubProcessOPEntity } from './entity/sp-sub-process-op.entity';
import { SPSubProcessBomEntity } from './entity/sp-sub-proc-bom.entity';
import { SpSubProcessComponentEntity } from './entity/sp-sub-proc-comp.entity';
import { StyleProductTypeRepository } from './repository/style-product-type.repository';
import { SPOpVersionRepository } from './repository/sp-op-version.repository';
import { SPProcessTypeRepository } from './repository/sp-proc-type.repository';
import { SPSubProcessRepository } from './repository/sp-sub-process.repository';
import { SPSubProcessOpRepository } from './repository/sp-sub-process-op.repository';
import { SPSubProcessBomRepository } from './repository/sp-sub-proc-bom.repository';
import { SPSubProcessComponentRepository } from './repository/sp-sub-proc-comp.repository';
import { StyleOperationInfoService } from './style-product-type.service';
import { MoProductSubLineRepository } from '../repository/mo-product-sub-line.repository';
import { FgSkuEntity } from './entity/fg-sku.entity';
import { SoProductSubLineRepository } from '../repository/so-product-sub-line.repository';
import { OperationService } from '@xpparel/shared-services';

@Module({
  imports: [
        TypeOrmModule.forFeature([
            StyleProductTypeEntity, SpOpVersionEntity, SpProcTypeEntity, SpSubprocessEntity, SpSubProcessOPEntity, SPSubProcessBomEntity, SpSubProcessComponentEntity, FgSkuEntity
        ])
    ],
  providers: [StyleOpRoutingService, StyleProductTypeRepository, SPOpVersionRepository, SPProcessTypeRepository, SPSubProcessRepository, SPSubProcessOpRepository, SPSubProcessBomRepository, SPSubProcessComponentRepository,StyleOperationInfoService,MoProductSubLineRepository,SoProductSubLineRepository,OperationService],
  controllers: [StyleOpRoutingController],
  exports: [StyleOpRoutingService]
})
export class StyleOpRoutingModule {}
