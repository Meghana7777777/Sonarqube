import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { PoWhRequestMaterialItemEntity } from "../entities/po-wh-request-material-item-entity";

@Injectable()
export class PoWhRequestMaterialItemRepository extends Repository<PoWhRequestMaterialItemEntity> {
    constructor(private dataSource: DataSource) {
        super(PoWhRequestMaterialItemEntity, dataSource.createEntityManager());
    }
}