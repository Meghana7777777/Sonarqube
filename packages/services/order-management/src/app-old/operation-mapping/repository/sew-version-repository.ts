import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { SewVersion } from "../entity/sew-version.entity";

@Injectable()
export class SewVersionRepository extends Repository<SewVersion> {
    constructor(private dataSource: DataSource) {
        super(SewVersion, dataSource.createEntityManager());
    }

}

