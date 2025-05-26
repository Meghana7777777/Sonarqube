
import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { FgBundleEntity } from "../fg-bundle.entity";
import { TranLogFgEntity } from "../tran-log-fg.entity";
import { OperatorActivityEntity } from "../operator-activity.entity";

@Injectable()
export class OperatorActivityRepository extends Repository<OperatorActivityEntity> {
    constructor(private dataSource: DataSource) {
        super(OperatorActivityEntity, dataSource.createEntityManager());
    }

}