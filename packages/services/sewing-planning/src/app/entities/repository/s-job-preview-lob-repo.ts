import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { SJobPreviewLog } from "../s-job-preview-log.entity";

@Injectable()
export class SJobPreviewLogRepo extends Repository<SJobPreviewLog> {
    constructor( dataSource: DataSource ) {
        super(SJobPreviewLog, dataSource.createEntityManager());
    }


}

