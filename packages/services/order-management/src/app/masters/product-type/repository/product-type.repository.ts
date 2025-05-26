import { Column, CreateDateColumn, DataSource, Entity, ManyToMany, ManyToOne, OneToMany, Repository } from "typeorm";
import { RollSelectionTypeEnum } from '@xpparel/shared-models';
import { Injectable } from "@nestjs/common";
import { ProductTypeEntity } from "../entity/product-type.entity";

@Injectable()
export class ProductTypeRepository extends Repository<ProductTypeEntity> {
    constructor(private dataSource: DataSource) {
        super(ProductTypeEntity, dataSource.createEntityManager());
    }

}

