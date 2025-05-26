import { BaseInterfaceRepository } from "packages/services/packing-management/src/database/common-repositories";
import { PackInsRequestEntity } from "../../entites/request.entity";



export interface PackInsReqRepoInterface extends BaseInterfaceRepository<PackInsRequestEntity> {

}