
import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { SRequestItemEntity } from "../entites/s-request-item.entity";

@Injectable()
export class SRequestItemRepository extends Repository<SRequestItemEntity> {
    constructor(private dataSource: DataSource) {
        super(SRequestItemEntity, dataSource.createEntityManager());
    }
}
