import { Column, CreateDateColumn, DataSource, Entity, ManyToMany, ManyToOne, OneToMany, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { SubProductEntity } from "../entity/sub-product.entity";

@Injectable()
export class SubProductRepository extends Repository<SubProductEntity> {
    constructor(private dataSource: DataSource) {
        super(SubProductEntity, dataSource.createEntityManager());
    }

}

