import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PoMaterialController } from './po-material.controller';
import { PoMaterialService } from './po-material.service';
import { PoMaterialInfoService } from './po-material-info.service';
import { PoMaterialHelperService } from './po-material-helper.service';
import { PCutRmEntity } from './entity/p-cut-rm.entity';
import { PCutRmSizePropsEntity } from './entity/p-cut-rm-size-prop.entity';
import { PTrimRmEntity } from './entity/p-trim-rm.entity';
import { PCutRmRepository } from './repository/p-cut-rm.repository';
import { PTrimRmRepository } from './repository/p-trim-rm.respository';
import { PoRatioModule } from '../po-ratio/po-ratio.module';
import { ProcessingOrderModule } from '../processing-order/processing-order.module';
import { ProcessingOrderRepository } from '../common/repository/processing-order.repo';
import { PCutRmSizePropRepository } from './repository/p-cut-rm-size-prop.respository';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            PCutRmEntity, PCutRmSizePropsEntity, PTrimRmEntity
        ]),
        forwardRef(() => ProcessingOrderModule),
        forwardRef(() => PoRatioModule)
    ],
    controllers: [PoMaterialController],
    providers: [PoMaterialService, PoMaterialInfoService, PoMaterialHelperService, PCutRmSizePropsEntity, PCutRmRepository, PTrimRmRepository, ProcessingOrderRepository, PCutRmSizePropRepository],
    exports: [PoMaterialService, PoMaterialInfoService, PoMaterialHelperService]
})
export class PoMaterialModule { }