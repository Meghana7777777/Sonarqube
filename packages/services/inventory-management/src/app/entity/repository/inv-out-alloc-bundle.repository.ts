
import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InvOutRequestEntity } from "../inv.out.req.entity";
import { InvOutAllocEntity } from "../inv.out.alloc.entity";
import { InvOutAllocBundleEntity } from "../inv.out.alloc.bundle.entity";

@Injectable()
export class InvOutAllocBundleRepository extends Repository<InvOutAllocBundleEntity> {
    constructor(private dataSource: DataSource) {
        super(InvOutAllocBundleEntity, dataSource.createEntityManager());
    }

}