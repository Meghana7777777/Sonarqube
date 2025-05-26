import { PackListIdRequest } from "@xpparel/shared-models";
import { BaseInterfaceRepository } from "../../../database/common-repositories";
import { PLConfigEntity } from "../entities/pack-list.entity";
import { ConfigQueryDto } from "../dto/config-qurrey.dto";
import { PacklistQurreyDto } from "../dto/packlist-qurrey-dto";

export interface PLConfigRepoInterface extends BaseInterfaceRepository<PLConfigEntity> {
    getPLConfigData(poNumber: string, poLineId?: string, subLineId?: string): Promise<PLConfigEntity | undefined>;
    getPackListsForPo(companyCode: string, unitCode: string, packSerial: number, poLineId?: string, subLineId?: string): Promise<ConfigQueryDto[]>
    getPackingListDataById(packListId: number): Promise<PacklistQurreyDto>;
    getPackListDetails(req: PackListIdRequest)
    getPackListInfoByPackList(packListIds: number[], companyCode: string, unitCode: string): Promise<{ id: number; po_id: number; plConfigNo: string; noOfCartons: number, pk_type_id: number }[]>
}
