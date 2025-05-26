
import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { DSetEntity } from "../entity/d-set.entity";

@Injectable()
export class DSetRepository extends Repository<DSetEntity> {
    constructor(private dataSource: DataSource) {
        super(DSetEntity, dataSource.createEntityManager());
    }
}
