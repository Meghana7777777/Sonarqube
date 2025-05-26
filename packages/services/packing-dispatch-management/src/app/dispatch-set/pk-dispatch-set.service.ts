import { Inject, Injectable, forwardRef } from "@nestjs/common"; import { DataSource, In } from "typeorm";
import moment = require("moment");
import { BarcodePrefixEnum, PkContainerReadinessEnum, PkContainerSubItemReadinessEnum, PkContainerTypeEnum, PkDSetCreateRequest, PkDSetIdsRequest, PkDSetItemIdsRequest, PkDSetItemProceedingEnum, PkDSetItemStageEnum, PkDSetPlannedItemContainerModel, PkDSetProceedingEnum, DispatchEntityEnum, GlobalResponseObject, PackingMethodsEnum, PkShippingRequestItemLevelEnum, CreateDispatchSetRequest } from "@xpparel/shared-models";
import { GenericTransactionManager } from "../../database/typeorm-transactions";
import { ErrorResponse } from "@xpparel/backend-utils";
import { DSetRepository } from "./repository/d-set-repository";
import { DSetEntity } from "./entity/d-set.entity";
import { DSetSubItemRepository } from "./repository/d-set-sub-item-repository";
import { DSetSubItemEntity } from "./entity/d-set-sub-item.entity";
import { DSetItemRepository } from "./repository/d-set-item-repository";
import { DSetItemEntity } from "./entity/d-set-item.entity";
import { DSetProceedingEntity } from "./entity/d-set-proceeding.entity";
import { DSetItemAttrEntity } from "./entity/d-set-item-attr.entity";
import { DSetSubItemAttrEntity } from "./entity/d-set-sub-item-attr.entity";
import { DSetContainerEntity } from "../dispatch-ready/entity/d-set-container.entity";
import { PkDispatchSetHelperService } from "./pk-dispatch-set-helper.service";
import { DSetContainerRepository } from "../dispatch-ready/repository/d-set-container-repository";
import { DSetSubItemContainerMapEntity } from "../dispatch-ready/entity/d-set-sub-item-container-map.entity";


@Injectable()
export class PkDispatchSetService {
  constructor(
    private dataSource: DataSource,
    private dSetRepository: DSetRepository,
    private dSetSubItemRepository: DSetSubItemRepository,
    private dSetItemRepository: DSetItemRepository,
    private dSetContainerRepository: DSetContainerRepository,
    @Inject(forwardRef(() => PkDispatchSetHelperService)) private dSetHelperService: PkDispatchSetHelperService
  ) {

  }

  /**
   * END POINT
   * WRITER
   * creates the dispatch request for the given cut ids
   * @param req 
   */
  async createDispatchSet(req: CreateDispatchSetRequest): Promise<GlobalResponseObject> {
    const transManager = new GenericTransactionManager(this.dataSource);
    try {
      const { companyCode, unitCode, username } = req;
      // Validate if pack list IDs are provided
      const refIds = new Set<number>(); // Cut IDs (PK of cps.po_cut)
      req.packLists.forEach(packList => {
        if (packList.packListId) {
          refIds.add(packList.packListId);
        }
      });


      const cartonIdMap = new Map<number, number[]>();
      req.packLists.forEach(packList => {
        if (!cartonIdMap.has(packList.packListId)) {
          cartonIdMap.set(packList.packListId, []);
        }

        const validCartonIds = packList.cartonIds.map(id => Number(id)).filter(id => !isNaN(id));
        cartonIdMap.get(packList.packListId)?.push(...validCartonIds);
      });



      // Ensure at least one pack list is selected
      if (refIds.size === 0) {
        throw new ErrorResponse(41027, 'Please select the cut numbers');
      }

      // VALIDATION: Check if any selected carton in a pack list already belongs to a dispatch set
      const selectedCartonsWithPackList: { packListId: number; cartonId: number }[] = [];

      req.packLists.forEach(packList => {
        packList.cartonIds.forEach(cartonId => { selectedCartonsWithPackList.push({ packListId: packList.packListId, cartonId: Number(cartonId) }) })
      });

      if (selectedCartonsWithPackList.length > 0) {
        // Extract only carton IDs for DB query
        const selectedCartonIds = selectedCartonsWithPackList.map(item => item.cartonId);

        // Query database to check if any of the selected cartons are already assigned
        const existingCartonRecords = await this.dSetSubItemRepository.find({ where: { companyCode, unitCode, isActive: true, deRefId: In(Array.from(refIds)), itemNo: In(selectedCartonIds) } });

        const existingCartonMap = new Map<number, number>(); // Ensure keys are numbers
        existingCartonRecords.forEach(record => {
          existingCartonMap.set(Number(record.itemNo), Number(record.deRefId)); // Convert itemNo to a number
        });

        // Now this works correctly without type errors
        const duplicateCartons = selectedCartonsWithPackList.filter(
          item =>
            existingCartonMap.has(item.cartonId) &&
            existingCartonMap.get(item.cartonId) !== item.packListId
        );

        if (duplicateCartons.length > 0) {
          throw new ErrorResponse(0, 'Some cartons in the selected pack list are already assigned to another dispatch set');
        }
      }
      // Get packing list information
      const packingListsInfo = await this.dSetHelperService.getPacklistInfoForPackListIds(Array.from(refIds), true, true, true, true, true, true, companyCode, unitCode);
      const moNo = packingListsInfo[0]?.packListAttrs?.moNos?.toString();
      const vpo = packingListsInfo[0]?.packListAttrs?.vpos?.toString();
      const moPk = packingListsInfo[0]?.moId;

      if (!moPk) {
        throw new ErrorResponse(0, 'S.O not found');
      }

      // Generate new dispatch set request number
      const totalDSets = await this.dSetRepository.count({ where: { companyCode, unitCode, l2: moNo } });
      const newReqNo = moNo + '-' + (totalDSets + 1);

      // TRANSACTION START
      await transManager.startTransaction();
      // Create the dispatch set entity
      const dSetEnt = this.getDispatchSetEntity(newReqNo, moNo, moPk?.toString(), vpo, packingListsInfo[0]?.packOrderId, null, companyCode, unitCode, username);
      const savedDispatchSet = await transManager.getRepository(DSetEntity).save(dSetEnt);
      const dSetId = dSetEnt.id;
      for (const packList of packingListsInfo) {
        let totalCartons = 0;
        let totalFgQty = 0;
        const cartonBarcodes = new Map<number, { packJobNo: string, cartonBarCode: string }>();
        packList.packJobs.forEach(pj => {
          totalCartons += pj.cartonsList.length;
          pj.cartonsList.forEach(c => {
            totalFgQty += c.qty;
            cartonBarcodes.set(c.cartonId, { packJobNo: pj.packJobNo, cartonBarCode: c.barcode })
          });

        });

        // Save dispatch set item
        const dSetItemEnt = this.getDispatchSetItemEntity(savedDispatchSet.id, packList.packListId, packList.packListId?.toString(), packList.packListDesc, packList.plType, totalCartons, totalFgQty, companyCode, unitCode, username);
        const savedDispatchSetItem = await transManager.getRepository(DSetItemEntity).save(dSetItemEnt);
        const dSetItemId = savedDispatchSetItem.id;
        const attrsInfo = packList.packListAttrs;

        // Save dispatch set item attributes
        const subItemAttrEnt = this.getDSetItemAttrEntity(dSetId, dSetItemId, moNo, attrsInfo.moNos?.toString(), attrsInfo.styles?.toString(), '', vpo, attrsInfo.prodNames?.toString(), attrsInfo.delDates?.toString(), attrsInfo.styles?.toString(), attrsInfo.destinations?.toString(), attrsInfo.buyers?.toString());
        await transManager.getRepository(DSetItemAttrEntity).save(subItemAttrEnt);
        // Save dispatch set sub-items
        const subItemEnts: DSetSubItemEntity[] = [];
        const requestedCartonIds = cartonIdMap.get(packList.packListId) || [];
        requestedCartonIds.forEach(cartonId => {
          const subItemEnt = this.getDispatchSetSubItemEntity(dSetId, dSetItemId, cartonId.toString(), cartonBarcodes.get(cartonId).cartonBarCode, cartonBarcodes.get(cartonId).cartonBarCode, packList.packListId?.toString(), cartonBarcodes.get(cartonId).packJobNo, totalFgQty, companyCode, unitCode, username);
          subItemEnts.push(subItemEnt);
        });
        console.log(subItemEnts, 'lllll')
        await transManager.getRepository(DSetSubItemEntity).save(subItemEnts, { reload: false });
      }

      // Create proceeding entity
      const dSetProcEnt = this.getDSetProceedingEntity(dSetId, companyCode, unitCode, username);
      await transManager.getRepository(DSetProceedingEntity).save(dSetProcEnt, { reload: false });

      // TRANSACTION END
      await transManager.completeTransaction();
      return new GlobalResponseObject(true, 41030, 'Dispatch set created successfully');

    } catch (error) {
      await transManager.releaseTransaction();
      throw error;
    }
  }


  getDSetProceedingEntity(dSetId: number, companyCode: string, unitCode: string, username: string): DSetProceedingEntity {
    const procEnt = new DSetProceedingEntity();
    procEnt.companyCode = companyCode;
    procEnt.unitCode = unitCode;
    procEnt.createdUser = username;
    procEnt.currentStage = PkDSetItemProceedingEnum.OPEN;
    procEnt.remarks = '';
    procEnt.spoc = username;
    procEnt.dSetId = dSetId;
    return procEnt;
  }

  // gets the sub item barcode 
  getContainerBarcode(cutId: number, bagId: number): string {
    return BarcodePrefixEnum.D_CONTAINER + ':' + Number(cutId).toString(16) + '-' + Number(bagId);
  }

  getDSetContainerEntity(dSetId: number, dSetItemId: number, conRemarks: string, containerNo: string, barcode: string, conType: PkContainerTypeEnum, itemReadiness: PkContainerReadinessEnum, companyCode: string, unitCode: string, username: string): DSetContainerEntity {
    const containerEnt = new DSetContainerEntity();
    containerEnt.companyCode = companyCode;
    containerEnt.unitCode = unitCode;
    containerEnt.createdUser = username;
    containerEnt.barcode = barcode;
    containerEnt.dSetId = dSetId;
    containerEnt.dSetItemId = dSetItemId;
    containerEnt.printStatus = 0;
    containerEnt.containerType = conType;
    containerEnt.itemReadiness = itemReadiness;
    containerEnt.containerRemarks = conRemarks;
    containerEnt.containerNumber = containerNo;
    return containerEnt
  }

  getDispatchSetEntity(newReqNo: string, moNumber: string, moPk: string, vpoNumber: string, packOrderId: number, remarks: string, companyCode: string, unitCode: string, username: string): DSetEntity {
    const dispatchSetEntity = new DSetEntity();
    dispatchSetEntity.setNo = newReqNo;
    dispatchSetEntity.l1 = packOrderId?.toString();
    dispatchSetEntity.l2 = moNumber?.toString();
    dispatchSetEntity.l3 = vpoNumber;
    dispatchSetEntity.l4 = moPk;
    dispatchSetEntity.dispatchEntity = DispatchEntityEnum.CARTON;
    dispatchSetEntity.currentStage = PkDSetProceedingEnum.OPEN;
    dispatchSetEntity.currentLocation = 'PLANT';
    dispatchSetEntity.unitCode = unitCode;
    dispatchSetEntity.printStatus = 0;
    dispatchSetEntity.companyCode = companyCode;
    dispatchSetEntity.unitCode = unitCode;
    dispatchSetEntity.createdUser = username;
    dispatchSetEntity.remarks = remarks;
    return dispatchSetEntity
  }

  getDispatchSetItemEntity(dSetId: number, packListId: number, packListNumber: string, desc1: string, packListType: PackingMethodsEnum, totalSubItems: number, totalQty: number, companyCode: string, unitCode: string, username: string): DSetItemEntity {
    const dispatchSetItemEntity = new DSetItemEntity();
    dispatchSetItemEntity.dispatchEntity = DispatchEntityEnum.CUT;
    dispatchSetItemEntity.deRefTable = 'pack_list';
    dispatchSetItemEntity.deRefId = packListId?.toString();
    dispatchSetItemEntity.deRefNo1 = packListNumber?.toString();
    dispatchSetItemEntity.deRefNo2 = packListType;
    dispatchSetItemEntity.deRefNo3 = '';
    dispatchSetItemEntity.itemQuantity = totalQty;
    dispatchSetItemEntity.subItemsCount = totalSubItems;
    dispatchSetItemEntity.printStatus = 0;
    dispatchSetItemEntity.itemNo = 'PL-' + packListNumber;
    dispatchSetItemEntity.barcode = ''; // NONE ATM
    dispatchSetItemEntity.dSetId = dSetId;
    dispatchSetItemEntity.companyCode = companyCode;
    dispatchSetItemEntity.unitCode = unitCode;
    dispatchSetItemEntity.createdUser = username;
    dispatchSetItemEntity.deRefDesc1 = desc1; // pack list desc
    dispatchSetItemEntity.currentStage = PkDSetItemStageEnum.PACKED;
    return dispatchSetItemEntity;
  }

  getDispatchSetSubItemEntity(dSetId: number, dSetItemId: number, refId: string, barcode: string, cartonNo: string, packListId: string, packJobNo: string, qty: number, companyCode: string, unitCode: string, username: string): DSetSubItemEntity {
    const dSetSubItem = new DSetSubItemEntity();
    dSetSubItem.barcode = barcode;
    dSetSubItem.companyCode = companyCode;
    dSetSubItem.createdUser = username;
    dSetSubItem.unitCode = unitCode;
    dSetSubItem.dSetId = dSetId;
    dSetSubItem.dSetItemId = dSetItemId;
    dSetSubItem.dispatchEntity = DispatchEntityEnum.CARTON;
    dSetSubItem.deRefId = refId; // PK of carton
    dSetSubItem.deRefNo1 = packListId; // PK of pack list
    dSetSubItem.deRefNo2 = packJobNo; // pack job number
    dSetSubItem.itemQuantity = Number(qty);
    dSetSubItem.itemNo = cartonNo; // carton no
    dSetSubItem.itemReadiness = PkContainerSubItemReadinessEnum.OPEN;
    dSetSubItem.printStatus = 0;
    return dSetSubItem;
  }

  // HELPER
  getDSetItemAttrEntity(dSetId: number, dSetItemId: number, mo: string, mol: string, style: string, co: string, vpo: string, prodNames: string, delDates: string, plantStyleRefs: string, dests: string, buyers: string): DSetItemAttrEntity {
    // REFERENCE ENUM
    // export enum DSetItemAttrEnum {
    //   MO = 'l1', // mo number
    //   PSTREF = 'lm1', // plant style REF
    //   CO = 'l3', // customer order no
    //   VPO = 'l4', // vendor purchase no
    //   DEST = 'lm2', // destination
    //   DELD = 'lm3', // del dates
    //   STY = 'l2', // style
    //   PRD = 'lt1', // prod names
    //   MOL = 'lt2', // csv of mo lines
    //   BUY = 'lm4' // Buyers
    // }
    const setItemAttrEnt = new DSetItemAttrEntity();
    setItemAttrEnt.l1 = mo;
    setItemAttrEnt.lm1 = plantStyleRefs;
    setItemAttrEnt.l3 = co;
    setItemAttrEnt.l4 = vpo;
    setItemAttrEnt.lm2 = dests;
    setItemAttrEnt.lm3 = delDates;
    setItemAttrEnt.lm4 = buyers;
    setItemAttrEnt.l2 = style;
    setItemAttrEnt.lt1 = prodNames;
    setItemAttrEnt.lt2 = mol;
    setItemAttrEnt.dSetId = dSetId;
    setItemAttrEnt.dSetItemId = dSetItemId;
    return setItemAttrEnt;
  }

  getDSetSubItemAttrEntity(dSetId: number, dSetItemId: number, dSetSubItemRefId: number, size: string, shade: string, color: string, bundleNo: string): DSetSubItemAttrEntity {
    // export enum DSetSubItemAttrEnum {
    //     SZ = 'l1', // size
    //     SHD = 'l2', //  shade of bundle
    //     BNO = 'l3', // bundle no
    //     COL = 'lm1', // fg color
    // }
    const dSetSubItemAttr = new DSetSubItemAttrEntity();
    dSetSubItemAttr.dSetId = dSetId;
    dSetSubItemAttr.dSetItemId = dSetItemId;
    dSetSubItemAttr.dSetSubItemRefId = dSetSubItemRefId;
    dSetSubItemAttr.l1 = size;
    dSetSubItemAttr.l2 = shade;
    dSetSubItemAttr.l3 = bundleNo;
    dSetSubItemAttr.lm1 = color;
    return dSetSubItemAttr;
  }


  // END POINT
  // WRITER
  // deletes the entire set from the DB
  async deleteDispatchSet(req: PkDSetIdsRequest): Promise<GlobalResponseObject> {
    const transManager = new GenericTransactionManager(this.dataSource);
    try {
      // Remove data from all tables using the dSetId
      // check dispatch set id(s) 
      if (!req.dSetPks?.length) {
        throw new ErrorResponse(41031, 'Please provide the dispatch set id');
      }
      const { unitCode, companyCode } = req;

      const dSetRec = await this.dSetRepository.findOne({ select: ['id'], where: { companyCode: companyCode, unitCode: unitCode, id: In(req.dSetPks) } });
      if (!dSetRec) {
        throw new ErrorResponse(41032, 'No Dispatch set exist for the provided info');
      }

      // check is the shipping request is created for the dispatch set
      const shippingReqItemRecs = await this.dSetHelperService.getShippingRequestItemRecordsForRefIds(PkShippingRequestItemLevelEnum.SET, req.dSetPks, companyCode, unitCode);
      if (shippingReqItemRecs.length > 0) {
        throw new ErrorResponse(41033, 'Shipping request is already created for some of the items');
      }

      // do the validations
      for (const dSetId of req.dSetPks) {
        // check if any item related to the dSet is packed into a container
        const contianerPackedItems = await this.dSetHelperService.getTotalContainerPackedItemsCountForDSetIds([dSetId], companyCode, unitCode);
        if (contianerPackedItems > 0) {
          throw new ErrorResponse(41034, `Some items related to the selected sets are already packed`);
        }
      }

      const dSetIds = req.dSetPks;
      await transManager.startTransaction();
      // then finally delete the records from all the tables
      await transManager.getRepository(DSetProceedingEntity).delete({ dSetId: In(dSetIds), companyCode: companyCode, unitCode: unitCode });
      // await transManager.getRepository(DSetSubItemAttrEntity).delete({ dSetId: In(dSetIds) });
      await transManager.getRepository(DSetItemAttrEntity).delete({ dSetId: In(dSetIds) });
      await transManager.getRepository(DSetSubItemEntity).delete({ dSetId: In(dSetIds), companyCode: companyCode, unitCode: unitCode });
      await transManager.getRepository(DSetContainerEntity).delete({ dSetId: In(dSetIds), companyCode: companyCode, unitCode: unitCode });
      await transManager.getRepository(DSetSubItemContainerMapEntity).delete({ dSetId: In(dSetIds), companyCode: companyCode, unitCode: unitCode });
      await transManager.getRepository(DSetItemEntity).delete({ dSetId: In(dSetIds), companyCode: companyCode, unitCode: unitCode });
      await transManager.getRepository(DSetEntity).delete({ id: In(dSetIds), companyCode: companyCode, unitCode: unitCode });
      await transManager.completeTransaction();
      return new GlobalResponseObject(true, 41035, 'Cut dispatch request deleted successfully');
    } catch (error) {
      await transManager.releaseTransaction();
      throw error;
    }
  }

  //ENDPOINT
  async updateSubItemPrintStatus(req: PkDSetItemIdsRequest): Promise<GlobalResponseObject> {
    // update the print status for the items to 1
    const transManager = new GenericTransactionManager(this.dataSource);
    try {
      if (!req?.dSetItemPks?.length) {
        throw new ErrorResponse(41054, "Please provide dSet item ids");
      }
      const { companyCode, unitCode } = req;
      await transManager.startTransaction();
      const dSetSubItemIds = await this.dSetSubItemRepository.findOne({
        select: ['id'],
        where: { dSetItemId: In(req.dSetItemPks), companyCode, unitCode }
      });
      if (!dSetSubItemIds) {
        throw new ErrorResponse(41055, "dSet Sub Item ids not found");
      }
      await transManager.getRepository(DSetSubItemEntity).update(
        { id: dSetSubItemIds.id, dSetItemId: In(req.dSetItemPks), companyCode, unitCode },
        { printStatus: 1 }
      );
      await transManager.completeTransaction();
      return new GlobalResponseObject(true, 41036, "Sub item print status updated successfully");
    } catch (error) {
      await transManager.releaseTransaction();
      throw error;
    }
  }

  //ENDPOINT
  async updateContainerPrintStatus(req: PkDSetItemIdsRequest): Promise<GlobalResponseObject> {
    const transManager = new GenericTransactionManager(this.dataSource);
    try {
      if (!req?.dSetItemPks?.length) {
        throw new ErrorResponse(41054, "Please provide dSet item ids");
      }
      const { companyCode, unitCode } = req;
      await transManager.startTransaction();
      const dSetContainerIds = await this.dSetContainerRepository.findOne({
        select: ['id'],
        where: { dSetItemId: In(req.dSetItemPks), companyCode, unitCode }
      });
      if (!dSetContainerIds) {
        throw new ErrorResponse(41037, "Container ids not found");
      }
      // Update print status for the container to 1
      await transManager.getRepository(DSetContainerEntity).update(
        { id: dSetContainerIds.id, dSetItemId: In(req.dSetItemPks), companyCode, unitCode },
        { printStatus: 1 }
      );
      // Update container print status for dSetItem to 1
      await transManager.getRepository(DSetItemEntity).update(
        { id: In(req.dSetItemPks), companyCode, unitCode },
        { conPrintStatus: 1 }
      );
      await transManager.completeTransaction();
      return new GlobalResponseObject(true, 41038, "Container print status updated successfully");
    } catch (error) {
      await transManager.releaseTransaction();
      throw error;
    }
  }

  //ENDPOINT
  async releaseSubItemPrintStatus(req: PkDSetItemIdsRequest): Promise<GlobalResponseObject> {
    // Update the print status to 0 
    const transManager = new GenericTransactionManager(this.dataSource);
    try {
      if (!req?.dSetItemPks?.length) {
        throw new ErrorResponse(41054, "Please provide dSet item ids");
      }
      const { companyCode, unitCode } = req;
      await transManager.startTransaction();
      const dSetSubItemIds = await this.dSetSubItemRepository.findOne({
        select: ['id'],
        where: { dSetItemId: In(req.dSetItemPks), companyCode, unitCode }
      });
      if (!dSetSubItemIds) {
        throw new ErrorResponse(41055, "dSet Sub Item ids not found");
      }
      await transManager.getRepository(DSetSubItemEntity).update(
        { id: dSetSubItemIds.id, dSetItemId: In(req.dSetItemPks), companyCode, unitCode },
        { printStatus: 0 }
      );
      await transManager.completeTransaction();
      return new GlobalResponseObject(true, 41039, "Sub item print status released successfully");
    } catch (error) {
      await transManager.releaseTransaction();
      console.error('Error in releaseSubItemPrintStatus:', error);
      throw error;
    }
  }

  //ENDPOINT
  async releaseContainerPrintStatus(req: PkDSetItemIdsRequest): Promise<GlobalResponseObject> {
    // update the print status for the items to 0
    const transManager = new GenericTransactionManager(this.dataSource);
    try {
      if (!req?.dSetItemPks?.length) {
        throw new ErrorResponse(41054, "Please provide dSet item ids");
      }
      const { companyCode, unitCode } = req;
      await transManager.startTransaction();
      const dSetContainerIds = await this.dSetContainerRepository.findOne({
        select: ['id'],
        where: { dSetItemId: In(req.dSetItemPks), companyCode, unitCode }
      });
      if (!dSetContainerIds) {
        throw new ErrorResponse(41040, "Container ids not found");
      }
      await transManager.getRepository(DSetContainerEntity).update(
        { id: dSetContainerIds.id, dSetItemId: In(req.dSetItemPks), companyCode, unitCode },
        { printStatus: 0 }
      );
      await transManager.getRepository(DSetItemEntity).update(
        { id: In(req.dSetItemPks), companyCode, unitCode },
        { conPrintStatus: 0 }
      );
      await transManager.completeTransaction();
      return new GlobalResponseObject(true, 41041, "Container print status released successfully");
    } catch (error) {
      await transManager.releaseTransaction();
      throw error;
    }
  }
}