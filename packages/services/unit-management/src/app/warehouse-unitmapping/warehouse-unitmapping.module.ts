import { TypeOrmModule } from "@nestjs/typeorm";
import { WarehouseUnitmappingEntity } from "./warehouse-unitmapping-entity";
import { WarehouseUnitmappingService } from "./warehouse-unitmapping.service";
import { WarehouseUnitmappingRepository } from "./REPO/warehouse-unitmapping-repo";
import { WarehouseUnitmappingController } from "./warehouse-unitmapping.controller";
import { Module } from "@nestjs/common";

@Module({
    imports: [TypeOrmModule.forFeature([WarehouseUnitmappingEntity])],
    providers: [WarehouseUnitmappingService, WarehouseUnitmappingRepository],
    controllers: [WarehouseUnitmappingController],
    exports: [WarehouseUnitmappingService]
})

export class WarehouseUnitmappingModule {}