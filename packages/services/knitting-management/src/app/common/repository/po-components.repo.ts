import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import {  PoComponentsEntity } from "../entities/po-components-entity";

@Injectable()
export class PoComponentsRepository extends Repository<PoComponentsEntity> {
    constructor(private dataSource: DataSource) {
        super(PoComponentsEntity, dataSource.createEntityManager());
    }

}
