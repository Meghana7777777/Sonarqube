import { PackIdRequest, PackListIdRequest } from "@xpparel/shared-models";
import { BaseInterfaceRepository } from "../../../database/common-repositories";
import { ConfigLeastChildEntity } from "../entities/config-least-child.entity";

export interface ConfigLeastChildRepoInterface extends BaseInterfaceRepository<ConfigLeastChildEntity> {
    getPlGenQty(companyCode: string, unitCode: string, subLineId: number): Promise<{
        qty: number;
    }>
    getColorCode(req: PackListIdRequest)
    getSizes(req: PackIdRequest)
    getReportData(req: PackIdRequest)
}
