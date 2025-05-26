import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { WorkstationOperatorsEntity } from "../workstation-operators";

@Injectable()
export class WorkStationOperatorRepo extends Repository<WorkstationOperatorsEntity> {
    constructor( dataSource: DataSource ) {
        super(WorkstationOperatorsEntity, dataSource.createEntityManager());
    }


}

