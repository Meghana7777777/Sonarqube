
import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InvOutRequestEntity } from "../inv.out.req.entity";
import { InvOutAllocEntity } from "../inv.out.alloc.entity";
import { InvOutAllocBundleEntity } from "../inv.out.alloc.bundle.entity";
import { InvOutRequestActivityEntity } from "../inv.out.request.activity.entity";

@Injectable()
export class InvOutReqActivityRepository extends Repository<InvOutRequestActivityEntity> {
    constructor(private dataSource: DataSource) {
        super(InvOutRequestActivityEntity, dataSource.createEntityManager());
    }

}