import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { CutDispatchProgressEntity } from "../entity/cut-dispatch-progress.entity";

@Injectable()
export class CutDispatchProgressRepository extends Repository<CutDispatchProgressEntity> {
    constructor(private dataSource: DataSource) {
        super(CutDispatchProgressEntity, dataSource.createEntityManager());
    }
    

}

