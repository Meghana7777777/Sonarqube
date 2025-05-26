import { Injectable } from "@nestjs/common";
import { Repository, DataSource } from "typeorm";
import { RollAttributesEntity } from "../entities/roll-attributes.entity";


@Injectable()
export class RollAttributesRepo extends Repository<RollAttributesEntity>{
    constructor(private dataSource: DataSource) {
        super(RollAttributesEntity, dataSource.createEntityManager());
    }
}