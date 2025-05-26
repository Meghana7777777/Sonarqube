import { BaseInterfaceRepository } from "packages/services/packing-management/src/database/common-repositories";
import { PackingSpecEntity } from "../entities/packing-spec.entity";
import { PackSerialNumberReqDto, PackSpecDropDownDtoModel } from "@xpparel/shared-models";

export interface PackingSpecRepoInterface extends BaseInterfaceRepository<PackingSpecEntity> {
    getMappedBomSpec(req: PackSerialNumberReqDto): Promise<PackSpecDropDownDtoModel[]>
}

