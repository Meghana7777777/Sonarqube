import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { CutDispatchHeaderEntity } from "../entity/cut-dispatch-header.entity";

@Injectable()
export class CutDisptachHeaderRepository extends Repository<CutDispatchHeaderEntity> {
    constructor(private dataSource: DataSource) {
        super(CutDispatchHeaderEntity, dataSource.createEntityManager());
    }
    

}

