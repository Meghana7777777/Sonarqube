import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { EmbHeaderEntity } from "../entity/emb-header.entity";
import { EmbLineEntity } from "../entity/emb-line.entity";
import { SizeQtyQueryResponse } from "./query-response/size-qty.query.response";

@Injectable()
export class EmbLineRepository extends Repository<EmbLineEntity> {
    constructor(private dataSource: DataSource) {
        super(EmbLineEntity, dataSource.createEntityManager());
    }

}

