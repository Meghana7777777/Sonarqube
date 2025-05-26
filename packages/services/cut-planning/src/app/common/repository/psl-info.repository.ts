
import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { PslInfoEntity } from "../entity/psl-info.entity";

@Injectable()
export class PslInfoRepository extends Repository<PslInfoEntity> {
    constructor(private dataSource: DataSource) {
        super(PslInfoEntity, dataSource.createEntityManager());
    }
}

