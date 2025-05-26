import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { DataSource, In } from "typeorm";
import { DSetItemAttrRepository } from "./repository/d-set-item-attr.repository";
import { DSetItemRepository } from "./repository/d-set-item-repository";
import { DSetProceedingRepository } from "./repository/d-set-proceeding-repository";
import { DSetRepository } from "./repository/d-set-repository";
import { DSetSubItemAttrRepository } from "./repository/d-set-sub-item-attr.repository";
import { DSetSubItemRepository } from "./repository/d-set-sub-item-repository";
import { PkContainerModel, PkDSetFilterRequest, PkDSetIdsRequest, PkDSetItemAttrEnum, PkDSetItemModel, PkDSetItemsAbstractModel, PkDSetModel, PkDSetResponse, PkDSetSubItemAbstractModel, PkDSetSubItemsModel, GlobalResponseObject, ItemAttrNameEnum, PkShippingRequestFilterRequest, PkShippingRequestItemLevelEnum, PackListIdRequest, PkDSetSubItemRefResponse, PkDSetSubItemRefModel, DSetReqIdDto } from "@xpparel/shared-models";
import { ErrorResponse } from "@xpparel/backend-utils";
import { DSetContainerRepository } from "../dispatch-ready/repository/d-set-container-repository";
import { DSetSubItemContainerMapRepository } from "../dispatch-ready/repository/d-set-sub-item-container-map.repository";
import { PkDispatchSetHelperService } from "./pk-dispatch-set-helper.service";
import { DSetEntity } from "./entity/d-set.entity";
import { DSetItemAttrEntity } from "./entity/d-set-item-attr.entity";
import { DSetItemEntity } from "./entity/d-set-item.entity";
import { DSetContainerEntity } from "../dispatch-ready/entity/d-set-container.entity";
import { PackListIdsReqeust } from "./models/pk-pack-order-info.model";
import { DSetSubItemEntity } from "./entity/d-set-sub-item.entity";
import { SRequestItemEntity } from "../shipping-request/entites/s-request-item.entity";

@Injectable()
export class PkDispatchSetInfoService {
  constructor(
    private dataSource: DataSource,
    private dSetItemAttrRepo: DSetItemAttrRepository,
    private dSetItemRepo: DSetItemRepository,
    private dSetProceedingRepo: DSetProceedingRepository,
    private dSetRepo: DSetRepository,
    private dSetSubItemAttrRepo: DSetSubItemAttrRepository,
    private dSetSubItemRepo: DSetSubItemRepository,
    private dSetContainerRepo: DSetContainerRepository,
    private subItemContainerMapRepo: DSetSubItemContainerMapRepository,
    @Inject(forwardRef(() => PkDispatchSetHelperService)) private dSetHelperService: PkDispatchSetHelperService,
  ) {

  }

  // ENDPOINT
  async getDispatchSetByIds(req: PkDSetIdsRequest): Promise<PkDSetResponse> {
    const { companyCode, unitCode } = req;
    if (!req.dSetPks?.length) {
      throw new ErrorResponse(41022, 'Dispatch ids not provided');
    }
    const dSets = await this.dSetRepo.find({ select: ['id'], where: { id: In(req.dSetPks), companyCode: companyCode, unitCode: unitCode, isActive: true } });
    if (dSets.length != req.dSetPks.length) {
      throw new ErrorResponse(41023, 'Some dispatch sets doesnt exist');
    }
    const dSetModels = await this.getDSetModelsInfo(req.dSetPks, companyCode, unitCode, req.iNeedItemsAlso, req.iNeedSubItemsAlso, req.iNeedContainersAlso, req.iNeedItemAttrAlso);
    return new PkDSetResponse(true, 984, 'Dispatch sets retrieved', dSetModels);
  }

  // ENDPOINT
  async getDispatchSetByFilter(req: PkDSetFilterRequest): Promise<PkDSetResponse> {
    const { companyCode, unitCode } = req;
    if (!req.manufacturingOrderPks?.length) {
      throw new ErrorResponse(41024, 'manufacturing orders not provided');
    }
    const dSets = await this.dSetRepo.find({ select: ['id'], where: { l4: In(req.manufacturingOrderPks), companyCode: companyCode, unitCode: unitCode, isActive: true }, order: { createdAt: 'DESC' } });
    if (dSets.length <= 0) {
      throw new ErrorResponse(41025, 'Dispatch sets doesnt exist for the provided manufacturing orders');
    }
    const dSetIds = dSets.map(r => r.id);
    const dSetModels = await this.getDSetModelsInfo(dSetIds, companyCode, unitCode, req.iNeedItemsAlso, req.iNeedSubItemsAlso, req.iNeedContainersAlso, req.iNeedItemAttrAlso);
    return new PkDSetResponse(true, 984, 'Dispatch sets retrieved', dSetModels);
  }

  // HELPER
  async getDSetModelsInfo(dSetIds: number[], companyCode: string, unitCode: string, iNeedItems: boolean, iNeedSubItems: boolean, iNeedContainers: boolean, iNeedItemAttrs: boolean): Promise<PkDSetModel[]> {
    const dSetModels: PkDSetModel[] = [];
    for (const dSetId of dSetIds) {
      const dSetRec = await this.dSetRepo.findOne({ where: { id: dSetId, companyCode: companyCode, unitCode: unitCode } });
      let dSetItems: PkDSetItemModel[];
      if (iNeedItems) {
        dSetItems = await this.getDSetItemModelsInfo(dSetId, companyCode, unitCode, iNeedSubItems, iNeedContainers, iNeedItemAttrs);
      }
      const shippingRec = await this.dSetHelperService.getShippingRequestItemRecordsForRefIds(PkShippingRequestItemLevelEnum.SET, [dSetId], companyCode, unitCode);
      const srCreated = shippingRec.length > 0;
      const dSetModel = new PkDSetModel(dSetId, dSetRec.l2, dSetRec.setNo, srCreated, dSetItems);
      dSetModels.push(dSetModel);
    }
    return dSetModels;
  }

  // HELPER
  async getDSetItemModelsInfo(dSetId: number, companyCode: string, unitCode: string, iNeedSubItems: boolean, iNeedContainers: boolean, iNeedItemAttrs: boolean): Promise<PkDSetItemModel[]> {
    const dSetItems = await this.dSetItemRepo.find({ where: { companyCode: companyCode, unitCode: unitCode, isActive: true, dSetId: dSetId } });
    if (dSetItems.length == 0) {
      throw new ErrorResponse(41026, 'No items found for the set id : ' + dSetId);
    }
    const dSetItemModels: PkDSetItemModel[] = [];
    for (const item of dSetItems) {
      let itemContainers: PkContainerModel[] = [];
      let itemAttrs: { [k in PkDSetItemAttrEnum]?: string };
      // if the containers are requested, then get the containers as well
      if (iNeedContainers) {
        itemContainers = await this.getDSetContainerModels(item.id, companyCode, unitCode);
      }
      // if the attributes are asked, then get the attributes also
      if (iNeedItemAttrs) {
        itemAttrs = await this.getDSetItemAttrs(item.id, companyCode, unitCode);
      }
      const conPrint = item.conPrintStatus ? true : false;
      const siPrint = item.subItemPrintStatus ? true : false;
      const itemModel = new PkDSetItemModel(item.id, item.deRefNo1, item.deRefId, item.deRefDesc1, item.subItemsCount, siPrint, false, item.itemQuantity, itemAttrs, null);
      dSetItemModels.push(itemModel);
    }
    return dSetItemModels;
  }

  // HELPER
  async getDSetContainerModels(dSetItemId: number, companyCode: string, unitCode: string): Promise<PkContainerModel[]> {
    let containerModels: PkContainerModel[] = [];
    const containers = await this.dSetContainerRepo.find({ where: { dSetItemId: dSetItemId, companyCode: companyCode, unitCode: unitCode } });
    for (const c of containers) {
      // get the total items in the container 
      const itemsCount = await this.subItemContainerMapRepo.count({ where: { dSetContainerId: c.id, companyCode: companyCode, unitCode: unitCode, isActive: true } });
      const conModel = new PkContainerModel(c.id, c.barcode, c.containerNumber, itemsCount, []);
      containerModels.push(conModel);
    }
    return containerModels;
  }

  //   export enum PkDSetItemAttrEnum {
  //     MO = 'l1', // mo number
  //     PSTREF = 'lm1', // plant style REF
  //     CO = 'l3', // customer order no
  //     VPO = 'l4', // vendor purchase no
  //     PNM = 'lm2', // product name
  //     DDT = 'l8', // delivery date
  //     DEST = 'l5', // destination
  //     STY = 'l2', // style
  //     BUY='lm4' //buyers
  // }

  // HELPER
  async getDSetItemAttrs(dSetItemId: number, companyCode: string, unitCode: string): Promise<{ [k in PkDSetItemAttrEnum]?: string }> {
    const attrRecord = await this.dSetItemAttrRepo.findOne({ where: { dSetItemId: dSetItemId } });
    return {
      [PkDSetItemAttrEnum.MO]: attrRecord.l1,
      [PkDSetItemAttrEnum.PSTREF]: attrRecord.lm1,
      [PkDSetItemAttrEnum.CO]: attrRecord.l3,
      [PkDSetItemAttrEnum.VPO]: attrRecord.l4,
      [PkDSetItemAttrEnum.PNM]: attrRecord.lt1,
      [PkDSetItemAttrEnum.DDT]: attrRecord.l8,
      [PkDSetItemAttrEnum.DEST]: attrRecord.lm2,
      [PkDSetItemAttrEnum.STY]: attrRecord.l2,
      [PkDSetItemAttrEnum.BUY]: attrRecord.lm4
    }
  }

  // HELPER 
  async getDSetSubItemModelsInfo(dSetItemId: number, companyCode: string, unitCode: string): Promise<PkDSetSubItemsModel[]> {
    return null;
  }

  async getDSetRecordsByDSetIds(dSetIds: number[], companyCode: string, unitCode: string): Promise<DSetEntity[]> {
    const records = await this.dSetRepo.find({ where: { id: In(dSetIds), unitCode, companyCode } });
    return records;
  }

  async getDSetItemAttrRecordsByDSetId(dSetId: number, companyCode: string, unitCode: string): Promise<DSetItemAttrEntity[]> {
    const records = await this.dSetItemAttrRepo.find({ where: { dSetId: dSetId } });
    return records;
  }

  async getDSetItemRecordsByDSetId(dSetId: number, companyCode: string, unitCode: string): Promise<DSetItemEntity[]> {
    const records = await this.dSetItemRepo.find({ where: { dSetId: dSetId, companyCode: companyCode, unitCode: unitCode } });
    return records;
  }

  async getDSetContainersByDSetId(dSetId: number, companyCode: string, unitCode: string): Promise<DSetContainerEntity[]> {
    const records = await this.dSetContainerRepo.find({ where: { dSetId: dSetId, companyCode: companyCode, unitCode: unitCode } });
    return records;
  }

  // HELPER
  async getDispatchSetItemLevelAbstarctInfo(dSetId: number, companyCode: string, unitCode: string): Promise<PkDSetItemsAbstractModel[]> {
    const dSetItems = await this.dSetItemRepo.find({ where: { companyCode: companyCode, unitCode: unitCode, dSetId: dSetId, isActive: true } });
    const dSetItemAbstarctModels: PkDSetItemsAbstractModel[] = [];
    for (const item of dSetItems) {
      const dSetItemAttr = await this.getDSetItemAttrs(item.id, companyCode, unitCode);
      const plantStyle = dSetItemAttr.lm1;

      const subItemAbsModels: PkDSetSubItemAbstractModel[] = [];
      const dSetSubItems = await this.dSetSubItemRepo.find({ select: ['barcode', 'itemQuantity'], where: { unitCode: unitCode, companyCode: companyCode, dSetItemId: item.id, dSetId: dSetId } });
      dSetSubItems.forEach(r => {
        const sAbsModel = new PkDSetSubItemAbstractModel(r.barcode, r.itemQuantity);
        subItemAbsModels.push(sAbsModel);
      });
      const dSetItemAbs = new PkDSetItemsAbstractModel(dSetId, item.id, dSetItemAttr.l1, dSetItemAttr.l2, dSetItemAttr.l8?.split(','), dSetItemAttr.lm2?.split(','), dSetItemAttr.lm4?.split(','), dSetItemAttr.l4?.split(','), item.deRefId, item.deRefDesc1, subItemAbsModels);
      dSetItemAbstarctModels.push(dSetItemAbs);
    }
    return dSetItemAbstarctModels;
  }


  // HELPER
  async getTotalSubItemsCountForDSetIds(dSetIds: number[], companyCode: string, unitCode: string): Promise<number> {
    const totalRecs = await this.dSetSubItemRepo.count({ where: { companyCode: companyCode, unitCode: unitCode, isActive: true, dSetId: In(dSetIds) } });
    return totalRecs;
  }

  async getDSetSubItemRefIdsForDSetIds(dSetIds: number[], companyCode: string, unitCode: string): Promise<DSetSubItemEntity[]> {
    const totaItems = await this.dSetSubItemRepo.find({ where: { dSetId: In(dSetIds), companyCode: companyCode, unitCode: unitCode } });
    return totaItems;
  }

  // END POINT
  async getSubItemsListForDSetRefId(req: PackListIdRequest): Promise<PkDSetSubItemRefResponse> {
    const dSetSubItems = await this.dSetSubItemRepo.find({ where: { companyCode: req.companyCode, unitCode: req.unitCode, deRefNo1: In([req.packListId]) } });
    const responseData: PkDSetSubItemRefModel[] = dSetSubItems.map(item => ({
      refId: Number(item.deRefId)
    }));
    return new PkDSetSubItemRefResponse(true, 0, "Success", responseData);
  }

  // HELPER Called to get the ref ids based on the given barcodes
  async getSubItemRefIdsForRefBarcodes(barcodes: string[], companyCode: string, unitCode: string): Promise<{ id: number; cartonId: string; barcode: string; qty: number }[]> {
    try {
      const dSetSubItems = await this.dSetSubItemRepo.find({ where: { companyCode, unitCode, barcode: In(barcodes) } });
      return dSetSubItems.map(item => ({ id: item.id, cartonId: item.deRefId, barcode: item.barcode, qty: item.itemQuantity }));
    } catch (error) {
      return [];
    }
  }



  async updateFgOutReqForDispatch(req: DSetReqIdDto): Promise<GlobalResponseObject> {
    try {
      await this.dataSource.getRepository(SRequestItemEntity).update({ id: req.dSetId, companyCode: req.companyCode, unitCode: req.unitCode }, { fgOutReqCreated: true, fgOutReqId: req.whReqId })
      return new GlobalResponseObject(true, 54541, "Dispatch Req Created")
    } catch (error) {
      console.log(error)
      throw new ErrorResponse(6541, error.message)
    }

  }
}

