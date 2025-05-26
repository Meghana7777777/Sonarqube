import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { EmbDispatchHeaderEntity } from "../entity/emb-dispatch-header.entity";
import { EmbDispatchLineEntity } from "../entity/emb-dispatch-line.entity";
import { EmbDispatchProgressEntity } from "../entity/emb-dispatch-progress.entity";

@Injectable()
export class EmbDispatchProgressRepository extends Repository<EmbDispatchProgressEntity> {
    constructor(private dataSource: DataSource) {
        super(EmbDispatchProgressEntity, dataSource.createEntityManager());
    }
    

}

