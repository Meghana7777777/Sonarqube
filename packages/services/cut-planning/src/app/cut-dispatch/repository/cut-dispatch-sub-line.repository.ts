import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { CutDispatchLineEntity } from "../entity/cut-dispatch-line.entity";
import { CutDispatchSubLineEntity } from "../entity/cut-dispatch-sub-line.entity";

@Injectable()
export class CutDispatchSubLineRepository extends Repository<CutDispatchSubLineEntity> {
    constructor(private dataSource: DataSource) {
        super(CutDispatchSubLineEntity, dataSource.createEntityManager());
    }
    

}

