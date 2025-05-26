
import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { FgEntity } from "../fg.entity";

@Injectable()
export class FgRepository extends Repository<FgEntity> {
    constructor(private dataSource: DataSource) {
        super(FgEntity, dataSource.createEntityManager());
    }
}

