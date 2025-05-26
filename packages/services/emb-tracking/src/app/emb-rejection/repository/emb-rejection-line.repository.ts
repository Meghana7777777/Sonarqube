import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { EmbRejectionLineEntity } from "../entity/emb-rejection-line.entity.";

@Injectable()
export class EmbRejectionLineRepository extends Repository<EmbRejectionLineEntity> {
    constructor(private dataSource: DataSource) {
        super(EmbRejectionLineEntity, dataSource.createEntityManager());
    }


}

