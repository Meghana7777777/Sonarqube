
import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { FgBundleEntity } from "../fg-bundle.entity";
import { TranLogFgEntity } from "../tran-log-fg.entity";

@Injectable()
export class TranLogFgRepository extends Repository<TranLogFgEntity> {
    constructor(private dataSource: DataSource) {
        super(TranLogFgEntity, dataSource.createEntityManager());
    }

}