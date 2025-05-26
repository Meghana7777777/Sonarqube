import { Injectable } from "@nestjs/common";
import { Repository, DataSource } from "typeorm";
import { WInspectionEntity } from "../entities/w-inspection.entity";



@Injectable()
export class WInspectionRepo extends Repository<WInspectionEntity>{
    constructor(private dataSource: DataSource) {
        super(WInspectionEntity, dataSource.createEntityManager());
    }
}