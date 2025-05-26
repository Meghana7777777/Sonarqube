
import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { SRequestItemEntity } from "../entites/s-request-item.entity";
import { SRequestItemAttrEntity } from "../entites/s-request-item-attr.entity";

@Injectable()
export class SRequestItemAttrRepository extends Repository<SRequestItemAttrEntity> {
    constructor(private dataSource: DataSource) {
        super(SRequestItemAttrEntity, dataSource.createEntityManager());
    }
}
