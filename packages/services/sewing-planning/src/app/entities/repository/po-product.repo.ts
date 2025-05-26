import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { PoProductEntity } from "../po-product-entity";

@Injectable()
export class PoProductRepository extends Repository<PoProductEntity> {
    constructor(private dataSource: DataSource) {
        super(PoProductEntity, dataSource.createEntityManager());
    }

}