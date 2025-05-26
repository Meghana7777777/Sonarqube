import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { SJobTranLogRefEntity } from "../s-job-tran-log-ref.entity";

@Injectable()
export class SJobTranLogRefRepository extends Repository<SJobTranLogRefEntity> {
    constructor( dataSource: DataSource ) {
        super(SJobTranLogRefEntity, dataSource.createEntityManager());
    }


}

