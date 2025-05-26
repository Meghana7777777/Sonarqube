import { BaseInterfaceRepository } from "packages/services/packing-management/src/database/common-repositories"; 
import { PackInsRequestAttributeEntity } from "../../entites/pkms-ins-request-attributes.entity";

export interface PkReqAttributesRepoInterface extends BaseInterfaceRepository<PackInsRequestAttributeEntity> {

}