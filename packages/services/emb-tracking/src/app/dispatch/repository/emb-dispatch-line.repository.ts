import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { EmbDispatchHeaderEntity } from "../entity/emb-dispatch-header.entity";
import { EmbDispatchLineEntity } from "../entity/emb-dispatch-line.entity";

@Injectable()
export class EmbDispatchLineRepository extends Repository<EmbDispatchLineEntity> {
    constructor(private dataSource: DataSource) {
        super(EmbDispatchLineEntity, dataSource.createEntityManager());
    }
    

}

