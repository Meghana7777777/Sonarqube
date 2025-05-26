import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm/repository/Repository";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { ProductsEntity } from "../entity/product-entity";

@Injectable()
export class ProductsRepository extends Repository<ProductsEntity> {


    constructor(
        @InjectRepository(ProductsEntity) 
        private repo: Repository<ProductsEntity>,
        private datSource: DataSource) {
        super(repo.target, repo.manager, repo.queryRunner);
    }
}