import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PoMarkerHelperService } from './po-marker-helper.service';
import { PoMarkerInfoService } from './po-marker-info.service';
import { PoMarkerController } from './po-marker.controller';
import { PoMarkerService } from './po-marker.service';
import { PoRatioModule } from '../po-ratio/po-ratio.module';
import { PoMarkerEntity } from './entity/po-marker.entity';
import { PoMarkerRepository } from './repository/po-ratio-marker.repository';
import { MarkerTypService } from '../master/marker-type/marker-type.service';
import { MarkerTypeModule } from '../master/marker-type/marker-type.module';
import { DocketGenerationServices } from '@xpparel/shared-services';
import { PoMaterialModule } from '../po-material/po-material.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            PoMarkerEntity
        ]),
        forwardRef(() => PoRatioModule),
        forwardRef(() => MarkerTypeModule),
        forwardRef(() => PoMaterialModule)
    ],
    controllers: [PoMarkerController],
    providers: [PoMarkerService, PoMarkerInfoService, PoMarkerHelperService, PoMarkerRepository, DocketGenerationServices],
    exports: [PoMarkerService, PoMarkerInfoService, PoMarkerHelperService]
})
export class PoMarkerModule { }