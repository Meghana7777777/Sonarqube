import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { PoKgComponentFabricEntity } from "../entities/po-kg-component-faric-entity";

@Injectable()
export class PoKgComponentFabricRepository extends Repository<PoKgComponentFabricEntity> {
    constructor(private dataSource: DataSource) {
        super(PoKgComponentFabricEntity, dataSource.createEntityManager());
    }

}