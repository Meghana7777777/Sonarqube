import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { QualityCheckListConfigEntity } from "../entities/quality-checklist-config.entity";

@Injectable()
export class QualityChecklistConfigRepository extends Repository<QualityCheckListConfigEntity> {
    constructor(private dataSource: DataSource) {
        super(QualityCheckListConfigEntity, dataSource.createEntityManager());
    }

    

}