import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { InsTrimEntity } from "../../entities/ins-trim.entity";

@Injectable()
export class InsTrimsRepo extends Repository<InsTrimEntity>{
    constructor(dataSource: DataSource) {
        super(InsTrimEntity, dataSource.createEntityManager());
    }
}