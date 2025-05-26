import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { MoOpVersionEntity } from "../entity/mo-op-version.entity";

@Injectable()
export class MoOpVersionRepository extends Repository<MoOpVersionEntity> {
    constructor(private dataSource: DataSource) {
        super(MoOpVersionEntity, dataSource.createEntityManager());
    }

}

