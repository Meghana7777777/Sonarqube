import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PlantDefaultUomEntity } from "../../entities/plant-default-uom.entity";
import { UomConversionEntity } from "../../entities/uom-conversion.entity";
import { PlantDefaultUomRepo } from "../../repositories/plant-default-uom.repository";
import { UomConversionRepo } from "../../repositories/uom-conversion.repository";
import { UOMConversionController } from "./uom-conversion.controller";
import { UOMConversionService } from "./uom.conversion.service";


@Module({
  imports: [
    TypeOrmModule.forFeature([PlantDefaultUomEntity, UomConversionEntity]),
  ],
  controllers: [UOMConversionController],
  providers: [UOMConversionService, PlantDefaultUomRepo, UomConversionRepo],
  exports: [UOMConversionService]
})

export class UOMConversionModule { }