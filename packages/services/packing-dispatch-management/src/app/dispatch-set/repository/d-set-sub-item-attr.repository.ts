
import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { DSetSubItemAttrEntity } from "../entity/d-set-sub-item-attr.entity";

@Injectable()
export class DSetSubItemAttrRepository extends Repository<DSetSubItemAttrEntity> {
    constructor(private dataSource: DataSource) {
        super(DSetSubItemAttrEntity, dataSource.createEntityManager());
    }
}
