import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { ActualPbEntity } from "../entity/actual-pb.entity";

@Injectable()
export class ActualPbRepository extends Repository<ActualPbEntity> {
    constructor(private dataSource: DataSource) {
        super(ActualPbEntity, dataSource.createEntityManager());
    }


}

