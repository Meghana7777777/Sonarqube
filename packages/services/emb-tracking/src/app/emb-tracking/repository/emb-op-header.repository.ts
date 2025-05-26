import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { EmbOpHeaderEntity } from "../entity/emb-op-header.entity";

@Injectable()
export class EmbOpHeaderRepository extends Repository<EmbOpHeaderEntity> {
    constructor(private dataSource: DataSource) {
        super(EmbOpHeaderEntity, dataSource.createEntityManager());
    }


}

