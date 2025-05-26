import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { WorkstationOperatorRevisionEntity } from "../workstation-operator-revision";

@Injectable()
export class WorkStationOperatorRevisionRepo extends Repository<WorkstationOperatorRevisionEntity> {
    constructor( dataSource: DataSource ) {
        super(WorkstationOperatorRevisionEntity, dataSource.createEntityManager());
    }


}

