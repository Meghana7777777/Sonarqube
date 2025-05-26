
import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InvInRequestBundleEntity } from "../inv.in.request.bundle.entity";

@Injectable()
export class InvInRequestBundleRepository extends Repository<InvInRequestBundleEntity> {
    constructor(private dataSource: DataSource) {
        super(InvInRequestBundleEntity, dataSource.createEntityManager());
    }

}