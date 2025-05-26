import { BaseInterfaceRepository } from "packages/services/packing-management/src/database/common-repositories";

import { PackInsRequestItemEntity } from "../../entites/ins-request-items.entity";

export interface PkReqItemsRepoInterface extends BaseInterfaceRepository<PackInsRequestItemEntity> {

}