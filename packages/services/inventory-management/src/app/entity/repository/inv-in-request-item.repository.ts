
import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InvInRequestItemEntity } from "../inv.in.request.item.entity";

@Injectable()
export class InvInRequestItemRepository extends Repository<InvInRequestItemEntity> {
    constructor(private dataSource: DataSource) {
        super(InvInRequestItemEntity, dataSource.createEntityManager());
    }

}