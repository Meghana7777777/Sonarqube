
import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { FgOpEntity } from "../entity/fg-operation.entity";

@Injectable()
export class FgOpRepository extends Repository<FgOpEntity> {
    constructor(private dataSource: DataSource) {
        super(FgOpEntity, dataSource.createEntityManager());
    }
}

