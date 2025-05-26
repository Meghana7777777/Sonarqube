
import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { DSetProceedingEntity } from "../entity/d-set-proceeding.entity";

@Injectable()
export class DSetProceedingRepository extends Repository<DSetProceedingEntity> {
    constructor(private dataSource: DataSource) {
        super(DSetProceedingEntity, dataSource.createEntityManager());
    }
}
