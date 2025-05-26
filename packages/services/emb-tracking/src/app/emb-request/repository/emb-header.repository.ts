import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { EmbHeaderEntity } from "../entity/emb-header.entity";

@Injectable()
export class EmbHeaderRepository extends Repository<EmbHeaderEntity> {
    constructor(private dataSource: DataSource) {
        super(EmbHeaderEntity, dataSource.createEntityManager());
    }


}

