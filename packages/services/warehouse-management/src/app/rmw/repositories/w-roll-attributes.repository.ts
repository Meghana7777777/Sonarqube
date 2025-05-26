import { Injectable } from "@nestjs/common";
import { Repository, DataSource } from "typeorm";
import { WRollAttributesEntity } from "../entities/w-roll-attributes.entity";



@Injectable()
export class WRollAttributesRepo extends Repository<WRollAttributesEntity>{
    constructor(private dataSource: DataSource) {
        super(WRollAttributesEntity, dataSource.createEntityManager());
    }
}