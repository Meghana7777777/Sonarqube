import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ItemEntity } from "./bom-item-entity";
import { ItemController } from "./bom-item-controller";
import { ItemService } from "./bom-item-service";
import { ItemRepository } from "./repo/bom-item-repo";

@Module({
    imports: [TypeOrmModule.forFeature([ItemEntity])],
    controllers: [ItemController],
    providers: [ItemService,ItemRepository],
    exports: [ItemService]
})
export class ItemModule { }