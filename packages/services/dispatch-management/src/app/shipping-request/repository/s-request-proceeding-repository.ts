
import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { SRequestProceedingEntity } from "../entites/s-request-proceeding.entity";

@Injectable()
export class SRequestProceedingRepository extends Repository<SRequestProceedingEntity> {
    constructor(private dataSource: DataSource) {
        super(SRequestProceedingEntity, dataSource.createEntityManager());
    }
}
