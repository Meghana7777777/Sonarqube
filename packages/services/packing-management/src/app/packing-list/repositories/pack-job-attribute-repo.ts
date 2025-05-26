

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseAbstractRepository } from "packages/services/packing-management/src/database/common-repositories";
import { Repository } from "typeorm";
import { PackJobRequestAttributesEntity } from "../entities/pack-job-attributes.entity";
import { PackJobReqAttributeRepoInterFace } from "./pack-job-attribute-repo-interface";


@Injectable()
export class PackJobReqAttributeRepo extends BaseAbstractRepository<PackJobRequestAttributesEntity> implements PackJobReqAttributeRepoInterFace {
    constructor(
        @InjectRepository(PackJobRequestAttributesEntity)
        private readonly packListAttribute: Repository<PackJobRequestAttributesEntity>,
    ) {
        super(packListAttribute);
    }

}