import { Column, CreateDateColumn, DataSource, Entity, ManyToMany, ManyToOne, OneToMany, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { VendorEntity } from "../entity/vendor.entity";

@Injectable()
export class VendorRepository extends Repository<VendorEntity> {
    constructor(private dataSource: DataSource) {
        super(VendorEntity, dataSource.createEntityManager());
    }

}

