import { Injectable } from "@nestjs/common";
import { Repository, DataSource } from "typeorm";
import { SoLineProductEntity } from "../entity/so-line-product.entity";

@Injectable()
export class SoLineProductRepository extends Repository<SoLineProductEntity> {
    constructor(private dataSource: DataSource) {
        super(SoLineProductEntity, dataSource.createEntityManager());
    }
}