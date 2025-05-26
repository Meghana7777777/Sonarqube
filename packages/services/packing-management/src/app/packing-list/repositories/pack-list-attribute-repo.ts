

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseAbstractRepository } from "packages/services/packing-management/src/database/common-repositories";
import { Repository } from "typeorm";
import { PackListRequestAttributesEntity } from "../entities/packlist-attributes.entity";
import { PackListReqAttributeRepoInterFace } from "./pack-list-attribute-repo-interface";
import { PackListIdRequest, PKMSInspectionHeaderAttributesEnum } from "@xpparel/shared-models";


@Injectable()
export class PackListReqAttributeRepo extends BaseAbstractRepository<PackListRequestAttributesEntity> implements PackListReqAttributeRepoInterFace {
    constructor(
        @InjectRepository(PackListRequestAttributesEntity)
        private readonly packListAttribute: Repository<PackListRequestAttributesEntity>,
    ) {
        super(packListAttribute);
    }

    async getBlocks( req: PackListIdRequest) {
        const query = this.packListAttribute.createQueryBuilder()
            .select(`attribute_value`)
            .where(`pack_list_id=${req.packListId} and attribute_name='${PKMSInspectionHeaderAttributesEnum.DESTINATIONS}'`)
            .getRawMany()
        return query
    }

}