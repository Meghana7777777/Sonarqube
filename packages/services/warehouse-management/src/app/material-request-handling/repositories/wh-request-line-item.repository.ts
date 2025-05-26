import { Injectable } from "@nestjs/common";
import { Repository, DataSource } from "typeorm";
import { WhMatRequestHeaderEntity } from "../entities/wh-mat-request-header.entity";
import { WhMatRequestLineItemEntity } from "../entities/wh-mat-request-line-item.entity";


@Injectable()
export class WhRequestLineItemRepo extends Repository<WhMatRequestLineItemEntity>{
    constructor(private dataSource: DataSource) {
        super(WhMatRequestLineItemEntity, dataSource.createEntityManager());
    }
}