import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { ErrorResponse } from "@xpparel/backend-utils";
import { PKMSPackListIdsRequest, PKMSPackListInfoModel, PKMSPackListInfoResponse, PkShippingRequestItemLevelEnum } from "@xpparel/shared-models";
import { PackListService } from "@xpparel/shared-services";
import { PkDispatchReadyInfoService } from "../dispatch-ready/pk-dispatch-ready-info.service";
import { SRequestItemEntity } from "../shipping-request/entites/s-request-item.entity";
import { PkShippingRequestInfoService } from "../shipping-request/pk-shipping-request-info.service";

@Injectable()
export class PkDispatchSetHelperService {
  constructor(
    private packListInfoService: PackListService,
    @Inject(forwardRef(() => PkDispatchReadyInfoService)) private dsetReadinessInfoService: PkDispatchReadyInfoService,
    @Inject(forwardRef(() => PkShippingRequestInfoService)) private sRequestInfoService: PkShippingRequestInfoService
  ) {

  }

  // gets the pack order info for the PO from PKMS
  async getPacklistInfoForPackListIds(packlistIds: number[], iNeedPackLists: boolean, iNeedPackListAttrs: boolean, iNeedPackJobs: boolean, iNeedPackJobAttrs: boolean, iNeedCartons: boolean, iNeedCartonAttrs: boolean, companyCode: string, unitCode: string): Promise<PKMSPackListInfoModel[]> {
    const packIdReq = new PKMSPackListIdsRequest(null, unitCode, companyCode, 0, packlistIds, iNeedPackListAttrs, iNeedPackJobs, iNeedPackJobAttrs, iNeedCartons, iNeedCartonAttrs);
    console.log(packIdReq);
    let packOrderInfo: PKMSPackListInfoResponse = await this.packListInfoService.getPackListInfoByPackListId(packIdReq);
    if (!packOrderInfo.status) {
      throw new ErrorResponse(41020, 'PKMS Says : ' + packOrderInfo.internalMessage);
    }
    return packOrderInfo.data;
  }


  // HELPER
  async getTotalContainerPackedItemsCountForDSetIds(dSetIds: number[], companyCode: string, unitCode: string) {
    return await this.dsetReadinessInfoService.getTotalContainerPackedItemsCountForDSetIds(dSetIds, companyCode, unitCode);
  }

  // HELPER
  async getShippingRequestItemRecordsForRefIds(refType: PkShippingRequestItemLevelEnum, refIds: number[], companyCode: string, unitCode: string): Promise<SRequestItemEntity[]> {
    return this.sRequestInfoService.getShippingRequestItemRecordsForRefIds(refType, refIds, companyCode, unitCode);
  }

}
