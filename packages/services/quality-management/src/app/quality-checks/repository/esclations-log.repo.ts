import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { EsclationsLogEntity } from "../entities/esclations-log.entity";

@Injectable()
export class EsclationsLogRepository extends Repository<EsclationsLogEntity> {
    constructor(private dataSource: DataSource) {
        super(EsclationsLogEntity, dataSource.createEntityManager());
    }



}