import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { InsTrimDefects } from "../../entities/ins-trim-defects.entity";

@Injectable()
export class InsTrimsDefectsRepo extends Repository<InsTrimDefects>{
    constructor(dataSource: DataSource) {
        super(InsTrimDefects, dataSource.createEntityManager());
    }
}