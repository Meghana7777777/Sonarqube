import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { EmbRejectionHeaderEntity } from "../entity/emb-rejection-header.entity";

@Injectable()
export class EmbRejectionHeaderRepository extends Repository<EmbRejectionHeaderEntity> {
    constructor(private dataSource: DataSource) {
        super(EmbRejectionHeaderEntity, dataSource.createEntityManager());
    }


}

