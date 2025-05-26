import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { DataSource, In } from "typeorm";
import { DSetEntity } from "./entity/d-set.entity";
import { DSetRepository } from "./repository/d-set-repository";
import { CutGenerationServices, POService } from "@xpparel/shared-services";
import { CutIdWithCutPrefRequest, PoCutModel, PoSerialRequest, PoSummaryModel, ShippingRequestItemLevelEnum } from "@xpparel/shared-models";
import { ErrorResponse } from "@xpparel/backend-utils";
import { DispatchReadyService } from "../dispatch-ready/dispatch-ready.service";
import { DispatchReadyInfoService } from "../dispatch-ready/dispatch-ready-info.service";
import { ShippingRequestInfoService } from "../shipping-request/shipping-request-info.service";
import { SRequestItemEntity } from "../shipping-request/entites/s-request-item.entity";

@Injectable()
export class DispatchSetHelperService {
  constructor(
    private dataSource: DataSource,
    private dSetRepository: DSetRepository,
    private cutInfoService: CutGenerationServices,
    private poInfoService: POService,
    @Inject(forwardRef(()=> DispatchReadyInfoService))  private dsetReadinessInfoService: DispatchReadyInfoService,
    @Inject(forwardRef(()=> ShippingRequestInfoService))  private sRequestInfoService: ShippingRequestInfoService
  ) {

  }


  // gets the cut info for the PO from CPS
  async getCutInfoForCutIds(cutIds: number[], iNeedDockets: boolean, iNeedDocketBundles: boolean, iNeedDocketSize: boolean, iNeedActualDockets: boolean, iNeedActualBundles: boolean, iNeedActualDocketSize: boolean, companyCode: string, unitCode: string): Promise<PoCutModel[]> {
    const cutIdReq = new CutIdWithCutPrefRequest(null, unitCode, companyCode, 0, cutIds, iNeedDockets, iNeedActualDockets, iNeedDocketSize, iNeedActualDocketSize, iNeedActualBundles, iNeedDocketBundles);
    console.log(cutIdReq);
    const cutInfo = await this.cutInfoService.getCutInfoForCutIds(cutIdReq);
    if(!cutInfo.status) {
      throw new ErrorResponse(0, 'CPS Says : '+cutInfo.internalMessage);
    }
    return cutInfo.data;
  }

  // gets the po summary info from OES
  async getPoSummary(poSerial: number, iNeeLines: boolean, iNeedSubLines: boolean, iNeedOqPercentages: boolean, companyCode: string, unitCode: string): Promise<PoSummaryModel> {
    const req = new PoSerialRequest(null, unitCode, companyCode, 0, poSerial, 0, iNeedSubLines, iNeedOqPercentages);
    const poRes = await this.poInfoService.getPoSummary(req);
    if(!poRes.status) {
      throw new ErrorResponse(0, 'OES Says : '+poRes.internalMessage);
    }
    return poRes.data[0];
  }

  // HELPER
  async getTotalContainerPackedItemsCountForDSetIds(dSetIds: number[], companyCode: string, unitCode: string) {
    return await this.dsetReadinessInfoService.getTotalContainerPackedItemsCountForDSetIds(dSetIds, companyCode, unitCode);
  }

  // HELPER
  async getShippingRequestItemRecordsForRefIds(refType: ShippingRequestItemLevelEnum, refIds: number[], companyCode: string, unitCode: string): Promise<SRequestItemEntity[]> {
    return this.sRequestInfoService.getShippingRequestItemRecordsForRefIds(refType, refIds, companyCode, unitCode);
  } 

}
