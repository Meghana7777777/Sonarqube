import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { PoFabricEntity } from "../entities/po-fabric-entity";

@Injectable()
export class PoFabricRepository extends Repository<PoFabricEntity> {
    constructor(private dataSource: DataSource) {
        super(PoFabricEntity, dataSource.createEntityManager());
    }

}
