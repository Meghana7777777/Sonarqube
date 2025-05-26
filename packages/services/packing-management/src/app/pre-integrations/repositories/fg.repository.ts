
import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { FgEntity } from "../entities/fg.entity";

@Injectable()
export class FgRepository extends Repository<FgEntity> {
    constructor(private dataSource: DataSource) {
        super(FgEntity, dataSource.createEntityManager());
    }
}

