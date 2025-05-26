import { Injectable } from "@nestjs/common";
import { Repository, DataSource } from "typeorm";
import { WInspectionDetailsEntity } from "../entities/w-inspection-details.entity";



@Injectable()
export class WInspectionDetailsRepo extends Repository<WInspectionDetailsEntity>{
    constructor(private dataSource: DataSource) {
        super(WInspectionDetailsEntity, dataSource.createEntityManager());
    }
}