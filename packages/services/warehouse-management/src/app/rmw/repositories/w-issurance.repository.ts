import { Injectable } from "@nestjs/common";
import { Repository, DataSource } from "typeorm";
import { WIssuranceEntity } from "../entities/w-issurance.entity";



@Injectable()
export class WIssuranceRepo extends Repository<WIssuranceEntity>{
    constructor(private dataSource: DataSource) {
        super(WIssuranceEntity, dataSource.createEntityManager());
    }
}