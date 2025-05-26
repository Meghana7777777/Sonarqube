import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { PoKnitGroupEntity } from "../entities/po-knit-group-entity";

@Injectable()
export class PoKnitGroupRepository extends Repository<PoKnitGroupEntity> {
    constructor(private dataSource: DataSource) {
        super(PoKnitGroupEntity, dataSource.createEntityManager());
    }

}