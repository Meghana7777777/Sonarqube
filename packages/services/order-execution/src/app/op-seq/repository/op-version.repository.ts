import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { OpSequence } from "../entity/op-seq.entity";
import { OpVersion } from "../entity/op-version.entity";

@Injectable()
export class OpVersionRepository extends Repository<OpVersion> {
    constructor(private dataSource: DataSource) {
        super(OpVersion, dataSource.createEntityManager());
    }

}

