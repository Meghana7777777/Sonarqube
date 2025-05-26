
import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InvInRequestEntity } from "../inv.in.request.entity";

@Injectable()
export class InvInRequestRepository extends Repository<InvInRequestEntity> {
    constructor(private dataSource: DataSource) {
        super(InvInRequestEntity, dataSource.createEntityManager());
    }

}


