import { TypeOrmModule } from "@nestjs/typeorm";
import { WarehouseEntity } from "./warehouse-entity";
import { WarehouseRepository } from "./REPO/warehouse-repo";
import { WarehouseService } from "./warehouse-service";
import { WarehouseController } from "./warehouse-controller";
import { Module } from "@nestjs/common";

@Module({
    imports: [TypeOrmModule.forFeature([WarehouseEntity])],
    providers: [WarehouseService, WarehouseRepository],
    controllers: [WarehouseController],
    exports: [WarehouseService]
})

export class WarehouseModule {}