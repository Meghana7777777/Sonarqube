
import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { FgEntity } from "../fg.entity";
import { InvReceivingEntity } from "../inv-receiving.entity";
import { InvReceivingPslEntity } from "../inv-receiving-psl.entity";

@Injectable()
export class InvReceivingPslRepository extends Repository<InvReceivingPslEntity> {
    constructor(private dataSource: DataSource) {
        super(InvReceivingPslEntity, dataSource.createEntityManager());
    }
}

