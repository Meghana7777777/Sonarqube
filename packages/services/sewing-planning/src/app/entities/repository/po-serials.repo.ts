import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { PoSerialsEntity } from "../po-serials-entity";

@Injectable()
export class PoSerialsRepository extends Repository<PoSerialsEntity> {
    constructor(private dataSource: DataSource) {
        super(PoSerialsEntity, dataSource.createEntityManager());
    }

}