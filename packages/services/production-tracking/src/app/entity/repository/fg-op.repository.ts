
import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { FgOpEntity_OLD } from "../fg-op.entity";

@Injectable()
export class FgOpRepositoryOld extends Repository<FgOpEntity_OLD> {
    constructor(private dataSource: DataSource) {
        super(FgOpEntity_OLD, dataSource.createEntityManager());
    }
}

