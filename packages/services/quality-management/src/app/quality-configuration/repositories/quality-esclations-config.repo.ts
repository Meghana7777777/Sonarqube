import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { QualityEsclationsConfigEntity } from "../entities/quality-esclations-config.entity";

@Injectable()
export class QualityEsclationsConfigRepository extends Repository<QualityEsclationsConfigEntity> {
    constructor(private dataSource: DataSource) {
        super(QualityEsclationsConfigEntity, dataSource.createEntityManager());
    }

    

}