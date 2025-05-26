
import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { FgEntity } from "../fg.entity";
import { InvReceivingEntity } from "../inv-receiving.entity";

@Injectable()
export class InvReceivingRepository extends Repository<InvReceivingEntity> {
    constructor(private dataSource: DataSource) {
        super(InvReceivingEntity, dataSource.createEntityManager());
    }
}

