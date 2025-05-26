import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { PoBundlingDepMap } from "../entities/po-bundling-dep-map.entity";

@Injectable()
export class PoBundlingDepMapRepository extends Repository<PoBundlingDepMap> {
    constructor(private dataSource: DataSource) {
        super(PoBundlingDepMap, dataSource.createEntityManager());
    }
}
