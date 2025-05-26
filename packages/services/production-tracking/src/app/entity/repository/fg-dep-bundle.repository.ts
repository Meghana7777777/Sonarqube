
import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { FgDepBundleEntity } from "../fg-dep-bundle.entity";


@Injectable()
export class FgDepBundleRepository extends Repository<FgDepBundleEntity> {
    constructor(private dataSource: DataSource) {
        super(FgDepBundleEntity, dataSource.createEntityManager());
    }

}