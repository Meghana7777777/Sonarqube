import { Column, CreateDateColumn, DataSource, Entity, ManyToMany, ManyToOne, OneToMany, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { SubProductEntity } from "../entity/sub-product.entity";
import { SubProductFabricEntity } from "../entity/sub-product-fabric.entity";

@Injectable()
export class SubProductFabricRepository extends Repository<SubProductFabricEntity> {
    constructor(private dataSource: DataSource) {
        super(SubProductFabricEntity, dataSource.createEntityManager());
    }

}

