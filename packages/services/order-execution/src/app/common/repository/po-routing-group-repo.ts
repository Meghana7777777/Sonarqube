

import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { PoSerialsEntity } from "../entities/po-serials-entity";
import { PoSubLineBundleEntity } from "../entities/po-sub-line-bundle.entity";
import { PoRoutingGroupEntity } from "../entities/po-routing-group-entity";

@Injectable()
export class PoRoutingGroupRepository extends Repository<PoRoutingGroupEntity> {
    constructor(private dataSource: DataSource) {
        super(PoRoutingGroupEntity, dataSource.createEntityManager());
    }

}
