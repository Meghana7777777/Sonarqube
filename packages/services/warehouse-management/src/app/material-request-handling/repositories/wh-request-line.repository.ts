import { Injectable } from "@nestjs/common";
import { Repository, DataSource } from "typeorm";
import { WhMatRequestHeaderEntity } from "../entities/wh-mat-request-header.entity";
import { WhMatRequestLineEntity } from "../entities/wh-mat-request-line.entity";


@Injectable()
export class WhRequestLineRepo extends Repository<WhMatRequestLineEntity>{
    constructor(private dataSource: DataSource) {
        super(WhMatRequestLineEntity, dataSource.createEntityManager());
    }

    
}