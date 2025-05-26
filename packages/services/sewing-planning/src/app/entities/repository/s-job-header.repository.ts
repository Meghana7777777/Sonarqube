import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { SJobHeaderEntity } from "../s-job-header.entity";

@Injectable()
export class SJobHeaderRepo extends Repository<SJobHeaderEntity> {
    constructor( dataSource: DataSource ) {
        super(SJobHeaderEntity, dataSource.createEntityManager());
    }


}

