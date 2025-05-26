import { DataSource, Repository } from "typeorm";
import { PackOrderBomEntity } from "../entities/pack-bom.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PackOrderBomRepo extends Repository<PackOrderBomEntity>{
    constructor(private dataSource: DataSource) {
        super(PackOrderBomEntity, dataSource.createEntityManager());
    }
}