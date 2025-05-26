import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoToPoMapEntity } from './entities/mo-to-po-mapping.entity';
import { MoToPoMapController } from './mo-to-po-controller';
import { MoToPoMapService } from './mo-to-po.service';
import { MOToMapRepo } from './repo/mo_to_po_map.repo';


@Module({
  imports: [TypeOrmModule.forFeature([MoToPoMapEntity])],
  controllers: [MoToPoMapController],
  providers: [MoToPoMapService, MOToMapRepo],
  exports: [MoToPoMapService]
})
export class MOToPOMappingModule { }
