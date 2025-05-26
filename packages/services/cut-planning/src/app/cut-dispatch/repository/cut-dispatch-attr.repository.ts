import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { CutDispatchLineEntity } from "../entity/cut-dispatch-line.entity";
import { CutDispatchAttrEntity } from "../entity/cut-dispatch-attr.entity";

@Injectable()
export class CutDispatchAttrRepository extends Repository<CutDispatchAttrEntity> {
    constructor(private dataSource: DataSource) {
        super(CutDispatchAttrEntity, dataSource.createEntityManager());
    }
    

}

