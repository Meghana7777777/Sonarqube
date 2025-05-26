import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductsController } from "./product-controller";
import { ProductsService } from "./product-service";
import { ProductsRepository } from "./repository/product-repository";
import { ProductsEntity } from "./entity/product-entity";



@Module({
    imports: [TypeOrmModule.forFeature([ProductsEntity])],
    controllers: [ProductsController],
    providers: [ProductsService,ProductsRepository],
    exports: [ProductsService]
})
export class ProductsModule {}