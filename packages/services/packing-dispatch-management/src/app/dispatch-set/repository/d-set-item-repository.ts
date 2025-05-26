
import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { DSetItemEntity } from "../entity/d-set-item.entity";

@Injectable()
export class DSetItemRepository extends Repository<DSetItemEntity> {
    constructor(private dataSource: DataSource) {
        super(DSetItemEntity, dataSource.createEntityManager());
    }
}
