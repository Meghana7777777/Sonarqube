import { forwardRef, Module } from '@nestjs/common';
import { KnittingJobsService, MOConfigService, MoOpRoutingService, OrderCreationService, OrderManagementService } from '@xpparel/shared-services';
import { PoKnitJobRatioLineRepository } from '../common/repository/po-knit-job-ratio-line.repo';
import { PoKnitJobRatioSubLineRepository } from '../common/repository/po-knit-job-ratio-sub-line.repo';
import { PoKnitJobRatioRepository } from '../common/repository/po-knit-job-ratio.repo';
import { PoLineRepository } from '../common/repository/po-line.repo';
import { PoProductRepository } from '../common/repository/po-product.repo';
import { PoSubLineRepository } from '../common/repository/po-sub-line.repo';
import { ProcessingOrderRepository } from '../common/repository/processing-order.repo';
import { ProcessingOrderInfoService } from '../processing-order/processing-order-info.service';
import { KnittingConfigurationController } from './knitting-configuration.controller';
import { KnittingConfigurationService } from './knitting-configuration.service';
import { ProcessingOrderModule } from '../processing-order/processing-order.module';

@Module({
  imports :[
    forwardRef(() => ProcessingOrderModule),
  ],
  controllers: [KnittingConfigurationController],
  providers: [KnittingConfigurationService, PoKnitJobRatioLineRepository, PoKnitJobRatioSubLineRepository, ProcessingOrderRepository, PoLineRepository, PoSubLineRepository, PoProductRepository,PoKnitJobRatioRepository,OrderManagementService,KnittingJobsService, MOConfigService, MoOpRoutingService],
  exports: [KnittingConfigurationService]
})
export class KnittingConfigurationModule {}
