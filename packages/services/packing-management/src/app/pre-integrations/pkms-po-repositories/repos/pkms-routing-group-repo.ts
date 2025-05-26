import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseAbstractRepository } from "packages/services/packing-management/src/database/common-repositories";
import { Repository } from "typeorm";
import { PKMSRoutingGroupEntity } from "../../pkms-po-entities/pkms-routing-group-entity";
import { PKMSRoutingGroupInterface } from "../interfaces/pkms-routing-group-repo-interface";

@Injectable()
export class PKMSRoutingGroupRepository extends BaseAbstractRepository<PKMSRoutingGroupEntity> implements PKMSRoutingGroupInterface {
    constructor(
        @InjectRepository(PKMSRoutingGroupEntity)
        private readonly pkFgEntity: Repository<PKMSRoutingGroupEntity>,
    ) {
        super(pkFgEntity);
    }

}