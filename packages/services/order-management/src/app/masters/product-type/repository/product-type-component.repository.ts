import { Column, CreateDateColumn, DataSource, Entity, ManyToMany, ManyToOne, OneToMany, Repository } from "typeorm";
import { RollSelectionTypeEnum } from '@xpparel/shared-models';
import { Injectable } from "@nestjs/common";
import { ProductTypeComponentEntity } from "../entity/product-type-component.entity";

@Injectable()
export class ProductTypeComponentRepository extends Repository<ProductTypeComponentEntity> {
    constructor(private dataSource: DataSource) {
        super(ProductTypeComponentEntity, dataSource.createEntityManager());
    }

}

