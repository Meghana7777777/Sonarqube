import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { DataSource } from "typeorm";
import { DSetEntity } from "../dispatch-set/entity/d-set.entity";
import { DispatchSetHelperService } from "../dispatch-set/dispatch-set-helper.service";
import { DispatchSetInfoService } from "../dispatch-set/dispatch-set-info.service";
import { DSetItemAttrEntity } from "../dispatch-set/entity/d-set-item-attr.entity";
import { DSetItemEntity } from "../dispatch-set/entity/d-set-item.entity";
import { DSetContainerEntity } from "../dispatch-ready/entity/d-set-container.entity";
import { DSetItemsAbstractModel, VendorIdRequest, VendorModel } from "@xpparel/shared-models";
import { DispatchReadyInfoService } from "../dispatch-ready/dispatch-ready-info.service";
import { ErrorResponse } from "@xpparel/backend-utils";
import { VendorService } from "@xpparel/shared-services";

@Injectable()
export class ShippingRequestHelperService {

  constructor(
    private dataSource: DataSource,
    private vendorService: VendorService,
    @Inject(forwardRef(() => DispatchReadyInfoService)) private dSetReadyInfoService: DispatchReadyInfoService,
    @Inject(forwardRef(() => DispatchSetInfoService)) private dSetInfoService: DispatchSetInfoService
  ) {

  }

  async getVendorInfoById(vendorId: number, companyCode: string, unitCode: string): Promise<VendorModel> {
    const vendorReq = new VendorIdRequest(null, unitCode, companyCode, 0, vendorId);
    const vendorRes = await this.vendorService.getVendorInfoById(vendorReq);
    if (!vendorRes.status) {
      throw new ErrorResponse(0, 'Vendor does not exist for the provided ID');
    }
    return vendorRes.data[0];
  }

  async getDSetRecordsByDSetIds(dSetIds: number[], companyCode: string, unitCode: string): Promise<DSetEntity[]> {
    return await this.dSetInfoService.getDSetRecordsByDSetIds(dSetIds, companyCode, unitCode);
  }

  async getDSetItemAttrRecordsByDSetId(dSetId: number, companyCode: string, unitCode: string): Promise<DSetItemAttrEntity[]> {
    return await this.dSetInfoService.getDSetItemAttrRecordsByDSetId(dSetId, companyCode, unitCode);
  }

  async getDSetItemRecordsByDSetId(dSetId: number, companyCode: string, unitCode: string): Promise<DSetItemEntity[]> {
    return await this.dSetInfoService.getDSetItemRecordsByDSetId(dSetId, companyCode, unitCode);
  }

  async getDSetContainersByDSetId(dSetId: number, companyCode: string, unitCode: string): Promise<DSetContainerEntity[]> {
    return await this.dSetInfoService.getDSetContainersByDSetId(dSetId, companyCode, unitCode);
  }

  async getDispatchSetItemLevelAbstarctInfo(dSetId: number, companyCode: string, unitCode: string): Promise<DSetItemsAbstractModel[]> {
    return await this.dSetInfoService.getDispatchSetItemLevelAbstarctInfo(dSetId, companyCode, unitCode);
  }

  async getPendingToPutInBagItemsCountForDsetIds(dSetIds: number[], companyCode: string, unitCode: string): Promise<number> {
    return await this.dSetReadyInfoService.getPendingToPutInBagItemsCountForDsetIds(dSetIds, companyCode, unitCode);
  }

  async getTotalSubItemsCountForDSetIds(dSetIds: number[], companyCode: string, unitCode: string): Promise<number> {
    return await this.dSetInfoService.getTotalSubItemsCountForDSetIds(dSetIds, companyCode, unitCode);
  }
}
