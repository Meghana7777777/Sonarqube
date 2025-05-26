
import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { QMSTransLogEntity } from "../qms-trans-log.entity";

@Injectable()
export class QMSTransLogRepository extends Repository<QMSTransLogEntity> {
    constructor(private dataSource: DataSource) {
        super(QMSTransLogEntity, dataSource.createEntityManager());
    }

}