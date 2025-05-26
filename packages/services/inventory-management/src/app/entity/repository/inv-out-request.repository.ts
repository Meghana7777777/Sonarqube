
import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InvOutRequestEntity } from "../inv.out.req.entity";

@Injectable()
export class InvOutRequestRepository extends Repository<InvOutRequestEntity> {
    constructor(private dataSource: DataSource) {
        super(InvOutRequestEntity, dataSource.createEntityManager());
    }

}