import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { DataSource } from "typeorm";
import { DSetEntity } from "../dispatch-set/entity/d-set.entity";
import { PkDispatchSetHelperService } from "../dispatch-set/pk-dispatch-set-helper.service";
import { PkDispatchSetInfoService } from "../dispatch-set/pk-dispatch-set-info.service";
import { DSetItemAttrEntity } from "../dispatch-set/entity/d-set-item-attr.entity";
import { DSetItemEntity } from "../dispatch-set/entity/d-set-item.entity";
import { DSetContainerEntity } from "../dispatch-ready/entity/d-set-container.entity";
import { PackListCartoonIDs, PkDSetItemModel, PkDSetItemsAbstractModel, PkDSetModel, VendorIdRequest, VendorModel } from "@xpparel/shared-models";
import { PkDispatchReadyInfoService } from "../dispatch-ready/pk-dispatch-ready-info.service";
import { ErrorResponse } from "@xpparel/backend-utils";
import { VendorService } from "@xpparel/shared-services";
import axios from "axios";
import { SRequestItemRepository } from "./repository/s-request-item-repository";
import { SRequestRepository } from "./repository/s-request-repository";
import { DSetSubItemEntity } from "../dispatch-set/entity/d-set-sub-item.entity";

@Injectable()
export class PkShippingRequestHelperService {

  constructor(
    private dataSource: DataSource,
    private vendorService: VendorService,
    private srItemRepo: SRequestItemRepository,
    private srRepo: SRequestRepository,
    @Inject(forwardRef(() => PkDispatchReadyInfoService)) private dSetReadyInfoService: PkDispatchReadyInfoService,
    @Inject(forwardRef(() => PkDispatchSetInfoService)) private dSetInfoService: PkDispatchSetInfoService
  ) {

  }

  async getVendorInfoById(vendorId: number, companyCode: string, unitCode: string): Promise<VendorModel> {
    const vendorReq = new VendorIdRequest(null, unitCode, companyCode, 0, vendorId);
    const vendorRes = await this.vendorService.getVendorInfoById(vendorReq);
    if (!vendorRes.status) {
      throw new ErrorResponse(41042, 'Vendor does not exist for the provided ID');
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

  async getDSetSubItemsByDSetId(dSetId: number[], companyCode: string, unitCode: string): Promise<DSetSubItemEntity[]> {
    return await this.dSetInfoService.getDSetSubItemRefIdsForDSetIds(dSetId, companyCode, unitCode);
  }
  async getDSetContainersByDSetId(dSetId: number, companyCode: string, unitCode: string): Promise<DSetContainerEntity[]> {
    return await this.dSetInfoService.getDSetContainersByDSetId(dSetId, companyCode, unitCode);
  }

  async getDispatchSetItemLevelAbstarctInfo(dSetId: number, companyCode: string, unitCode: string): Promise<PkDSetItemsAbstractModel[]> {
    return await this.dSetInfoService.getDispatchSetItemLevelAbstarctInfo(dSetId, companyCode, unitCode);
  }

  async getPendingToPutInBagItemsCountForDsetIds(dSetIds: number[], companyCode: string, unitCode: string): Promise<number> {
    return await this.dSetReadyInfoService.getPendingToPutInBagItemsCountForDsetIds(dSetIds, companyCode, unitCode);
  }

  async getTotalSubItemsCountForDSetIds(dSetIds: number[], companyCode: string, unitCode: string): Promise<number> {
    return await this.dSetInfoService.getTotalSubItemsCountForDSetIds(dSetIds, companyCode, unitCode);
  }

  async sendSrDataToGatePass(srId: number, companyCode: string, unitCode: string): Promise<boolean> {
    const srItems = await this.srItemRepo.find({select: ['refId'], where: { sRequestId: srId, companyCode: companyCode, unitCode: unitCode}});
    const dSetIds = srItems.map(i => i.refId);
    const allDSetItemModels: PkDSetItemModel[] = [];
    for(const dSetId of dSetIds) {
      const dSetItemModels = await this.dSetInfoService.getDSetItemModelsInfo(dSetId, companyCode, unitCode, false, false, true);
      dSetItemModels.forEach(r => allDSetItemModels.push(r));
    }
    const srData = await this.setDatatoGatepass(allDSetItemModels, srId.toString(), null);
    // now update the gate pass no against to the shipping request 
    await this.srRepo.update({ id: srId, unitCode: unitCode, companyCode: companyCode }, { gatePassCode: srData.data.dcNumber });
    return true;
  }

  async setDatatoGatepass(items: PkDSetItemModel[], srId: string, srCode: string){
    try {
      const payload = {
        dispatchChallanNo: srId, // Set to Rajesh Anna
        fromUnitId: 10,
        warehouseId: 2,
        departmentId: 3,
        toAddresser: "buyer",
        addresserNameId: 84,
        weight: "50kg",
        purpose: "Delivery",
        value: 10000,
        status: "ASSIGN TO APPROVAL",
        requestedBy: 8212,
        remarks: "Sample Remarks",
        createdUser: "admin",
        dcItemDetails: items.map((dSetItem) => ({
          description: dSetItem.packListDesc, // check to Rajesh Anna
          uom: "Count",
          qty: dSetItem.totalSubItems, // check to Rajesh Anna
          itemCode: dSetItem.itemAttributes.lm1, // check to Rajesh Anna
          itemName: dSetItem.itemAttributes.lm2, // check to Rajesh Anna
          itemType: "Carton",
          poNumber: dSetItem.itemAttributes.l4, // check to Rajesh Anna
          color: 'NA', // check to Rajesh Anna
          style: dSetItem.itemAttributes.lm1, // check to Rajesh Anna
          pieces: dSetItem.totalFgQty, // check to Rajesh Anna
        })),
        updatedUser: "admin",
        isAssignable: "NO",
        assignBy: 3,
        buyerTeam: "SQ",
        dcType: "nonReturnable",
      };

      const response = await axios.post(
        "https://gatex-be.schemaxtech.in/api/dc/createDc",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Gatepass created successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating gatepass:", error);
      throw new Error("Failed to create gatepass");
    }
  }
}
