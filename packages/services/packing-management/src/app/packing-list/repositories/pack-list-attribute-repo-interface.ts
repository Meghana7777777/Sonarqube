import { BaseInterfaceRepository } from "../../../database/common-repositories";
import { PackListRequestAttributesEntity } from "../entities/packlist-attributes.entity";

export interface PackListReqAttributeRepoInterFace extends BaseInterfaceRepository<PackListRequestAttributesEntity> {
    getBlocks(packList)
}