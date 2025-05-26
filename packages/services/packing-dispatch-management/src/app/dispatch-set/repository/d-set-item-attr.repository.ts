import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { DSetItemAttrEntity } from "../entity/d-set-item-attr.entity";

@Injectable()
export class DSetItemAttrRepository extends Repository<DSetItemAttrEntity> {
    constructor(private dataSource: DataSource) {
        super(DSetItemAttrEntity, dataSource.createEntityManager());

    }
}