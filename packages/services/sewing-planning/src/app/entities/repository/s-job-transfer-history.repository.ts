import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { SJobTransferHistoryEntity } from "../s-job-transfer-history";

@Injectable()
export class SJobTransferHistoryRepo extends Repository<SJobTransferHistoryEntity> {
    constructor( dataSource: DataSource ) {
        super(SJobTransferHistoryEntity, dataSource.createEntityManager());
    }


}

