import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { PoCutEntity } from "../entity/po-cut.entity";

@Injectable()
export class PoCutRepository extends Repository<PoCutEntity> {
    constructor(private dataSource: DataSource) {
        super(PoCutEntity, dataSource.createEntityManager());
    }


}

