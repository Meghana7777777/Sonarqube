import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { PoDocketBundlePslEntity } from "../entity/po-docket-bundle-psl.entity";

@Injectable()
export class PoDocketBundlePslRepository extends Repository<PoDocketBundlePslEntity> {
    constructor(private dataSource: DataSource) {
        super(PoDocketBundlePslEntity, dataSource.createEntityManager());
    }
}