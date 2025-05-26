import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import {  PoComponentsEntity } from "../entities/po-components-entity";
import { PoBundlingEntity } from "../entities/po-bundling.entity";

@Injectable()
export class PoBundlingRepository extends Repository<PoBundlingEntity> {
    constructor(private dataSource: DataSource) {
        super(PoBundlingEntity, dataSource.createEntityManager());
    }
}
