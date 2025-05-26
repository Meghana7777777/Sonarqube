import { Column, CreateDateColumn, DataSource, Entity, ManyToMany, ManyToOne, OneToMany, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { VendorEntity } from "../entity/vendor.entity";
import { VendorCategoryEntity } from "../entity/vendor-category.entity";

@Injectable()
export class VendorCategoryRepository extends Repository<VendorCategoryEntity> {
    constructor(private dataSource: DataSource) {
        super(VendorCategoryEntity, dataSource.createEntityManager());
    }

}

