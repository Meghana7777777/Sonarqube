import { BaseInterfaceRepository } from "packages/services/packing-management/src/database/common-repositories";
import { PKMSPoProductEntity } from "../../pkms-po-entities/pkms-po-product-entity";



export interface PKMSPoProductRepoInterface extends BaseInterfaceRepository<PKMSPoProductEntity> {

}