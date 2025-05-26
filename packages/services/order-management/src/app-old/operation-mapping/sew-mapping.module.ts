import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SewSequence } from './entity/sew-seq.entity';
import { SewVersion } from './entity/sew-version.entity';
import { SewVersionInfoService } from './sew-mapping-info.service';
import { SewMappingController } from './sew-mapping.controller';
import { SewVersionService } from './sew-mapping.service';

import { SewSeqRepository } from './repository/sew-seq.repository';
import { SewVersionRepository } from './repository/sew-version-repository';
import { SewVersionHelperService } from './sew-mapping-helper.service';
import { SewRawMaterial } from './entity/sew-raw-material-entity';
import { SewRawMaterialRepository } from './repository/sew-raw-material.repository';
import { POService } from '@xpparel/shared-services';
// import { SewingJobGenerationModule } from '../sewing-job-generation/sewing-job-generation.module';
// import { SewingOrderModule } from '../sewing-order-creation/sewing-order/sewing-order.module';


@Module({
    imports: [
        TypeOrmModule.forFeature([
            SewSequence, SewVersion, SewRawMaterial
        ]),
        // forwardRef(()=>SewingOrderModule),
    ],
    controllers: [SewMappingController],
    providers: [SewVersionService, SewVersionInfoService, SewVersionHelperService, SewSeqRepository, SewSeqRepository, SewVersionRepository, SewRawMaterialRepository, POService],
    exports: [SewVersionService, SewVersionInfoService, SewVersionHelperService]
})
export class SewVersionModule { }