import { Injectable } from "@nestjs/common";
import { Repository, DataSource } from "typeorm";
import { WAllocationEntity } from "../entities/w-allocation.entity";



@Injectable()
export class WAllocationRepo extends Repository<WAllocationEntity>{
    constructor(private dataSource: DataSource) {
        super(WAllocationEntity, dataSource.createEntityManager());
    }
}