
import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InvOutRequestItemEntity } from "../inv.out.request.item.entity";

@Injectable()
export class InvOutRequestItemRepository extends Repository<InvOutRequestItemEntity> {
    constructor(private dataSource: DataSource) {
        super(InvOutRequestItemEntity, dataSource.createEntityManager());
    }

}