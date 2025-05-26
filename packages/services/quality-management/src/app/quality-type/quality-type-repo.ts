import { Injectable } from "@nestjs/common";
import {DataSource, Repository } from "typeorm";
import { QualityTypeEntity } from "./entites/quality-type-entity";

@Injectable()
export class QualityTypeRepository extends Repository<QualityTypeEntity>{
    constructor(private dataSource: DataSource) {
        super(QualityTypeEntity, dataSource.createEntityManager());
    }
}