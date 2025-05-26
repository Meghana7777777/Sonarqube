import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { DataSource, In } from "typeorm";
import { DSetItemAttrRepository } from "./repository/d-set-item-attr.repository";
import { DSetItemRepository } from "./repository/d-set-item-repository";
import { DSetProceedingRepository } from "./repository/d-set-proceeding-repository";
import { DSetRepository } from "./repository/d-set-repository";
import { DSetSubItemAttrRepository } from "./repository/d-set-sub-item-attr.repository";
import { DSetSubItemRepository } from "./repository/d-set-sub-item-repository";
import { ContainerModel, DSetFilterRequest, DSetIdsRequest, DSetItemAttrEnum, DSetItemModel, DSetItemsAbstractModel, DSetModel, DSetResponse, DSetSubItemAbstractModel, DSetSubItemsModel, GlobalResponseObject, ItemAttrNameEnum, ShippingRequestFilterRequest, ShippingRequestItemLevelEnum } from "@xpparel/shared-models";
import { ErrorResponse } from "@xpparel/backend-utils";
import { DSetContainerRepository } from "../dispatch-ready/repository/d-set-container-repository";
import { DSetSubItemContainerMapRepository } from "../dispatch-ready/repository/d-set-sub-item-container-map.repository";
import { DispatchSetHelperService } from "./dispatch-set-helper.service";
import { DSetEntity } from "./entity/d-set.entity";
import { DSetItemAttrEntity } from "./entity/d-set-item-attr.entity";
import { DSetItemEntity } from "./entity/d-set-item.entity";
import { DSetContainerEntity } from "../dispatch-ready/entity/d-set-container.entity";

@Injectable()
export class DispatchSetInfoService {
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
    @Inject(forwardRef(() => DispatchSetHelperService)) private dSetHelperService: DispatchSetHelperService,
  ) {

  }

  // ENDPOINT
  async getDispatchSetByIds(req: DSetIdsRequest): Promise<DSetResponse> {
    const { companyCode, unitCode } = req;
    if (!req.dSetPks?.length) {
      throw new ErrorResponse(0, 'Dispatch ids not provided');
    }
    const dSets = await this.dSetRepo.find({ select: ['id'], where: { id: In(req.dSetPks), companyCode: companyCode, unitCode: unitCode, isActive: true } });
    if (dSets.length != req.dSetPks.length) {
      throw new ErrorResponse(0, 'Some dispatch sets doesnt exist');
    }
    const dSetModels = await this.getDSetModelsInfo(req.dSetPks, companyCode, unitCode, req.iNeedItemsAlso, req.iNeedSubItemsAlso, req.iNeedContainersAlso, req.iNeedItemAttrAlso);
    return new DSetResponse(true, 0, 'Dispatch sets retrieved', dSetModels);
  }

  // ENDPOINT
  async getDispatchSetByFilter(req: DSetFilterRequest): Promise<DSetResponse> {
    const { companyCode, unitCode } = req;
    if (!req.manufacturingOrderPks?.length) {
      throw new ErrorResponse(0, 'Manufacturing orders not provided');
    }
    const dSets = await this.dSetRepo.find({ select: ['id'], where: { l1: In(req.manufacturingOrderPks), companyCode: companyCode, unitCode: unitCode, isActive: true } });
    if (dSets.length <= 0) {
      throw new ErrorResponse(0, 'Dispatch sets doesnt exist for the provided Manufacturing orders');
    }
    const dSetIds = dSets.map(r => r.id);
    const dSetModels = await this.getDSetModelsInfo(dSetIds, companyCode, unitCode, req.iNeedItemsAlso, req.iNeedSubItemsAlso, req.iNeedContainersAlso, req.iNeedItemAttrAlso);
    return new DSetResponse(true, 0, 'Dispatch sets retrieved', dSetModels);
  }

  // HELPER
  async getDSetModelsInfo(dSetIds: number[], companyCode: string, unitCode: string, iNeedItems: boolean, iNeedSubItems: boolean, iNeedContainers: boolean, iNeedItemAttrs: boolean): Promise<DSetModel[]> {
    const dSetModels: DSetModel[] = [];
    for (const dSetId of dSetIds) {
      const dSetRec = await this.dSetRepo.findOne({ where: { id: dSetId, companyCode: companyCode, unitCode: unitCode } });
      let dSetItems: DSetItemModel[];
      if (iNeedItems) {
        dSetItems = await this.getDSetItemModelsInfo(dSetId, companyCode, unitCode, iNeedSubItems, iNeedContainers, iNeedItemAttrs);
      }
      const shippingRec = await this.dSetHelperService.getShippingRequestItemRecordsForRefIds(ShippingRequestItemLevelEnum.SET, [dSetId], companyCode, unitCode);
      const srCreated = shippingRec.length > 0;
      const dSetModel = new DSetModel(dSetId, dSetRec.l4, dSetRec.l3, dSetRec.setNo, srCreated, dSetItems);
      dSetModels.push(dSetModel);
    }
    return dSetModels;
  }

  // HELPER
  async getDSetItemModelsInfo(dSetId: number, companyCode: string, unitCode: string, iNeedSubItems: boolean, iNeedContainers: boolean, iNeedItemAttrs: boolean): Promise<DSetItemModel[]> {
    const dSetItems = await this.dSetItemRepo.find({ where: { companyCode: companyCode, unitCode: unitCode, isActive: true, dSetId: dSetId } });
    if (dSetItems.length == 0) {
      throw new ErrorResponse(0, 'No items found for the set id : ' + dSetId);
    }
    const dSetItemModels: DSetItemModel[] = [];
    for (const item of dSetItems) {
      let itemContainers: ContainerModel[] = [];
      let itemAttrs: { [k in DSetItemAttrEnum]?: string };
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
      const itemModel = new DSetItemModel(item.id, item.deRefNo1, item.deRefNo2, item.deRefNo3, item.subItemsCount, itemContainers, conPrint, siPrint, false, itemAttrs, null);
      dSetItemModels.push(itemModel);
    }
    return dSetItemModels;
  }

  // HELPER
  async getDSetContainerModels(dSetItemId: number, companyCode: string, unitCode: string): Promise<ContainerModel[]> {
    let containerModels: ContainerModel[] = [];
    const containers = await this.dSetContainerRepo.find({ where: { dSetItemId: dSetItemId, companyCode: companyCode, unitCode: unitCode } });
    for (const c of containers) {
      // get the total items in the container 
      const itemsCount = await this.subItemContainerMapRepo.count({ where: { dSetContainerId: c.id, companyCode: companyCode, unitCode: unitCode, isActive: true } });
      const conModel = new ContainerModel(c.id, c.barcode, c.containerNumber, itemsCount, []);
      containerModels.push(conModel);
    }
    return containerModels;
  }

  // HELPER
  async getDSetItemAttrs(dSetItemId: number, companyCode: string, unitCode: string): Promise<{ [k in DSetItemAttrEnum]?: string }> {
    const attrRecord = await this.dSetItemAttrRepo.findOne({ where: { dSetItemId: dSetItemId } });
    return {
      [DSetItemAttrEnum.CNO]: attrRecord.l6,
      [DSetItemAttrEnum.CO]: attrRecord.l3,
      [DSetItemAttrEnum.COMPS]: attrRecord.lt1,
      [DSetItemAttrEnum.CSNO]: attrRecord.l7,
      [DSetItemAttrEnum.DDT]: attrRecord.l8,
      [DSetItemAttrEnum.DEST]: attrRecord.l5,
      [DSetItemAttrEnum.PNM]: attrRecord.lm2,
      [DSetItemAttrEnum.PSTREF]: attrRecord.lm1,
      [DSetItemAttrEnum.MO]: attrRecord.l1,
      [DSetItemAttrEnum.MOL]: attrRecord.lt2,
      [DSetItemAttrEnum.STY]: attrRecord.l2,
      [DSetItemAttrEnum.VPO]: attrRecord.l4,
      [DSetItemAttrEnum.COL]: attrRecord.l9,
      [DSetItemAttrEnum.LIDS]: attrRecord.l10
    }
  }

  // HELPER 
  async getDSetSubItemModelsInfo(dSetItemId: number, companyCode: string, unitCode: string): Promise<DSetSubItemsModel[]> {
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
  async getDispatchSetItemLevelAbstarctInfo(dSetId: number, companyCode: string, unitCode: string): Promise<DSetItemsAbstractModel[]> {
    const dSetItems = await this.dSetItemRepo.find({ where: { companyCode: companyCode, unitCode: unitCode, dSetId: dSetId, isActive: true }});
    const dSetItemAbstarctModels: DSetItemsAbstractModel[] = [];
    for(const item of dSetItems) {
      const dSetItemAttr = await this.getDSetItemAttrs(item.id, companyCode, unitCode);
      const plantStyle = dSetItemAttr.lm1;
      const color = dSetItemAttr.l9;
      // construct the abstract info for the dset item i.e cut
      const dSetSubItemGroupedQueryRes = await this.dSetSubItemRepo.getSubItemsGroupBySizeShade(dSetId, item.id, companyCode, unitCode);
      const subItemAbsModels: DSetSubItemAbstractModel[] = [];
      dSetSubItemGroupedQueryRes.forEach(r => {
        const sAbsModel = new DSetSubItemAbstractModel(plantStyle, color, r.size, r.total_quantity, r.shade, r.total_bundles);
        subItemAbsModels.push(sAbsModel);
      });
      const dSetItemAbs = new DSetItemsAbstractModel(dSetId, item.id, item.deRefNo1, item.deRefNo2,dSetItemAttr.lm2, subItemAbsModels);
      dSetItemAbstarctModels.push(dSetItemAbs);
    }
    return dSetItemAbstarctModels;
  }


  // HELPER
  async getTotalSubItemsCountForDSetIds(dSetIds: number[], companyCode: string, unitCode: string): Promise<number> {
    const totalRecs = await this.dSetSubItemRepo.count({ where: { companyCode: companyCode, unitCode: unitCode, isActive: true, dSetId: In(dSetIds) }});
    return totalRecs;
  }
}

