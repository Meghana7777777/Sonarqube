import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PoRatioController } from './po-ratio.controller';
import { PoRatioService } from './po-ratio.service';
import { PoRatioInfoService } from './po-ratio-info.service';
import { PoRatioHelperService } from './po-ratio-helper.service';
import { PoRatioEntity } from './entity/po-ratio.entity';
import { PoRatioLineEntity } from './entity/po-ratio-line.entity';
import { PoRatioFabricEntity } from './entity/po-ratio-fabric.entity';
import { PoRatioSizeEntity } from './entity/po-ratio-size.entity';
import { PoRatioRepository } from './repository/po-ratio.repository';
import { PoRatioLineRepository } from './repository/po-ratio-line.repository';
import { PoRatioFabricRepository } from './repository/po-ratio-fabric.repository';
import { PoRatioSizeRepository } from './repository/po-ratio-size.repository';
import { PoMaterialModule } from '../po-material/po-material.module';
import { PoRatioComponentEntity } from './entity/po-ratio-component.entity';
import { PoRatioComponentRepository } from './repository/po-ratio-component.repository';
import { PoDocketGenOrderEntity } from './entity/po-docket-gen-order.entity';
import { PoDocketGenOrderRepository } from './repository/po-ratio-component.repository copy';
import { PoMarkerModule } from '../po-marker/po-marker.module';
import { CpsBullQueueService } from '@xpparel/shared-services';
import { ProcessingOrderModule } from '../processing-order/processing-order.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            PoRatioEntity, PoRatioLineEntity, PoRatioFabricEntity, PoRatioSizeEntity, PoRatioComponentEntity, PoDocketGenOrderEntity
        ]),
        forwardRef(()=>ProcessingOrderModule),
        forwardRef(()=>PoMaterialModule),
        forwardRef(()=>PoMarkerModule)

    ],
    controllers: [PoRatioController],
    providers: [PoRatioService, PoRatioInfoService, PoRatioHelperService, PoRatioRepository, PoRatioLineRepository, PoRatioFabricRepository, PoRatioSizeRepository, PoRatioComponentRepository, PoDocketGenOrderRepository, CpsBullQueueService],
    exports: [PoRatioService, PoRatioInfoService, PoRatioHelperService]
})
export class PoRatioModule { }