
import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InvInRequestBundleEntity } from "../inv.in.request.bundle.entity";
import { InvOutRequestBundleEntity } from "../inv.out.request.bundle.entity";

@Injectable()
export class InvOutRequestBundleRepository extends Repository<InvOutRequestBundleEntity> {
    constructor(private dataSource: DataSource) {
        super(InvOutRequestBundleEntity, dataSource.createEntityManager());
    }

}