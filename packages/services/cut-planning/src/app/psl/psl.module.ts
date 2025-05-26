import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PslController } from './psl.controller';
import { PslHelperService } from './psl-helper.service';
import { PslService } from './psl.service';
import { PslInfoEntity } from '../common/entity/psl-info.entity';
import { CutOrderService, OrderCreationService } from '@xpparel/shared-services';
import { PslInfoRepository } from '../common/repository/psl-info.repository';
import { PslBundleService } from './psl-bundle.service';
import { PoSubLineBundleRepository } from '../common/repository/po-sub-line-bundle.repo';
import { PoSubLineBundleEntity } from '../common/entity/po-sub-line-bundle.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            PslInfoEntity, PoSubLineBundleEntity
        ]),
    ],
    providers: [
        PslInfoRepository, PoSubLineBundleRepository,
        PslService, PslHelperService, PslBundleService,
        OrderCreationService, CutOrderService
    ],
    controllers: [PslController],
    exports: [PslService, PslHelperService, PslBundleService]
})
export class PslModule {}
