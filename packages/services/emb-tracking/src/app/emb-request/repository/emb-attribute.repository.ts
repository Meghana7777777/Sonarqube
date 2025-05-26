import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { EmbHeaderEntity } from "../entity/emb-header.entity";
import { EmbLineEntity } from "../entity/emb-line.entity";
import { EmbAttributeEntity } from "../entity/emb-attribute.entity";

@Injectable()
export class EmbAttributeRepository extends Repository<EmbAttributeEntity> {
    constructor(private dataSource: DataSource) {
        super(EmbAttributeEntity, dataSource.createEntityManager());
    }


}

