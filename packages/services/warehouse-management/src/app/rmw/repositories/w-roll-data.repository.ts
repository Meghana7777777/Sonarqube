import { Injectable } from "@nestjs/common";
import { Repository, DataSource } from "typeorm";
import { WRollDataEntity } from "../entities/w-roll-data.entity";



@Injectable()
export class WRollDataRepo extends Repository<WRollDataEntity>{
    constructor(private dataSource: DataSource) {
        super(WRollDataEntity, dataSource.createEntityManager());
    }
}