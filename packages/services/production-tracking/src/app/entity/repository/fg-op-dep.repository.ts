
import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { FgOpDepEntity } from "../fg-op-dep.entity";


@Injectable()
export class FgOpDepRepository extends Repository<FgOpDepEntity> {
    constructor(private dataSource: DataSource) {
        super(FgOpDepEntity, dataSource.createEntityManager());
    }


}


