import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OpVersionController } from './op-version.controller';
import { OpVersionService } from './op-version.service';
import { OpVersionInfoService } from './op-version-info.service';
import { OpVersionHelperService } from './op-version-helper.service';
import { OpSequence } from './entity/op-seq.entity';
import { OpSeqRepository } from './repository/op-seq.repository';
import { OpVersion } from './entity/op-version.entity';
import { OpVersionRepository } from './repository/op-version.repository';
import { PoRatioModule } from '../po-ratio/po-ratio.module';
import { ProcessingOrderModule } from '../processing-order/processing-order.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            OpSequence, OpVersion
        ]),
        forwardRef(()=>ProcessingOrderModule),
        forwardRef(()=>PoRatioModule)
    ],
    controllers: [OpVersionController],
    providers: [OpVersionService, OpVersionInfoService, OpVersionHelperService, OpSeqRepository, OpVersionRepository],
    exports: [OpVersionService, OpVersionInfoService, OpVersionHelperService]
})
export class OpVersionModule { }