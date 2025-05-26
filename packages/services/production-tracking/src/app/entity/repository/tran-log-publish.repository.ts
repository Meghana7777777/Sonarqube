
import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { FgBundleEntity } from "../fg-bundle.entity";
import { TranLogFgEntity } from "../tran-log-fg.entity";
import { TranLogPublishEntity } from "../tran-log-publish.entity";

@Injectable()
export class TranLogPublishRepository extends Repository<TranLogPublishEntity> {
    constructor(private dataSource: DataSource) {
        super(TranLogPublishEntity, dataSource.createEntityManager());
    }

}