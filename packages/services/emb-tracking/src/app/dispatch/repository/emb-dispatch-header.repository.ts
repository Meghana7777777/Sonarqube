import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { EmbDispatchHeaderEntity } from "../entity/emb-dispatch-header.entity";

@Injectable()
export class EmbDisptachHeaderRepository extends Repository<EmbDispatchHeaderEntity> {
    constructor(private dataSource: DataSource) {
        super(EmbDispatchHeaderEntity, dataSource.createEntityManager());
    }
    

}

