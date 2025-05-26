import { CommonRequestAttrs, PackingListIdRequest } from "@xpparel/shared-models";
import { BaseInterfaceRepository } from "../../../database/common-repositories";
import { CrtnEntity } from "../entities/crtns.entity";
import { CrtnDataRes } from "./query-response/crtn-data-query.res";

export interface CartonRepoInterFace extends BaseInterfaceRepository<CrtnEntity> {
    getCartonDataForInspection(packListID: number):Promise<CrtnDataRes[]>;
    getGroupedProtoTypeIds(cartonId: number[], companyCode: string, unitCode: string)
}