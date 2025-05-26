import { Injectable } from "@nestjs/common";
import { Repository, DataSource } from "typeorm";
import { WPickListEntity } from "../entities/w-pick-list.entity";



@Injectable()
export class WPickListRepo extends Repository<WPickListEntity>{
    constructor(private dataSource: DataSource) {
        super(WPickListEntity, dataSource.createEntityManager());
    }
}