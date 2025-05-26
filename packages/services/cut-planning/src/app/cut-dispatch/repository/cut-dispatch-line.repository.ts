import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { CutDispatchLineEntity } from "../entity/cut-dispatch-line.entity";

@Injectable()
export class CutDispatchLineRepository extends Repository<CutDispatchLineEntity> {
    constructor(private dataSource: DataSource) {
        super(CutDispatchLineEntity, dataSource.createEntityManager());
    }
    

}

