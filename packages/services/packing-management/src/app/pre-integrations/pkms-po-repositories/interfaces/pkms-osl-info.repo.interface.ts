import { BaseInterfaceRepository } from "packages/services/packing-management/src/database/common-repositories";
import { OslInfoEntity } from "../../entities/osl-info.entity";



export interface PKMSOslInfoRepoInterface extends BaseInterfaceRepository<OslInfoEntity> {
}

