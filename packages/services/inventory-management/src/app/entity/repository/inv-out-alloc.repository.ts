
import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InvOutRequestEntity } from "../inv.out.req.entity";
import { InvOutAllocEntity } from "../inv.out.alloc.entity";

@Injectable()
export class InvOutAllocRepository extends Repository<InvOutAllocEntity> {
    constructor(private dataSource: DataSource) {
        super(InvOutAllocEntity, dataSource.createEntityManager());
    }

}