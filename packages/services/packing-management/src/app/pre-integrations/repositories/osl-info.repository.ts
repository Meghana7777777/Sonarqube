
import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { OslInfoEntity } from "../entities/osl-info.entity";

@Injectable()
export class OslInfoRepository extends Repository<OslInfoEntity> {
    constructor(private dataSource: DataSource) {
        super(OslInfoEntity, dataSource.createEntityManager());
    }
}

