import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { EmbOpLineEntity } from "../entity/emb-op-line.entity";

@Injectable()
export class EmbOpLineRepository extends Repository<EmbOpLineEntity> {
    constructor(private dataSource: DataSource) {
        super(EmbOpLineEntity, dataSource.createEntityManager());
    }


}

