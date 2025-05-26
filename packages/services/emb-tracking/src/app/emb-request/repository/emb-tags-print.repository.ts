import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { EmbHeaderEntity } from "../entity/emb-header.entity";
import { EmbTagsPrintEntity } from "../entity/emb-tags-print.entity";

@Injectable()
export class EmbTagsPrintRepository extends Repository<EmbTagsPrintEntity> {
    constructor(private dataSource: DataSource) {
        super(EmbTagsPrintEntity, dataSource.createEntityManager());
    }


}

