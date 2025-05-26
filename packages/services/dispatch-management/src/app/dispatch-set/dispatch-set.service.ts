import { Inject, Injectable, forwardRef } from "@nestjs/common"; import { DataSource, In } from "typeorm";
import moment = require("moment");
import { BarcodePrefixEnum, ContainerReadinessEnum, ContainerSubItemReadinessEnum, ContainerTypeEnum, DSetCreateRequest, DSetIdsRequest, DSetItemIdsRequest, DSetItemProceedingEnum, DSetItemStageEnum, DSetPlannedItemContainerModel, DSetProceedingEnum, DispatchEntityEnum, GlobalResponseObject, ShippingRequestItemLevelEnum } from "@xpparel/shared-models";
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
import { DispatchSetHelperService } from "./dispatch-set-helper.service";
import { DSetContainerRepository } from "../dispatch-ready/repository/d-set-container-repository";
import { DSetSubItemContainerMapEntity } from "../dispatch-ready/entity/d-set-sub-item-container-map.entity";


@Injectable()
export class DispatchSetService {
  constructor(
    private dataSource: DataSource,
    private dSetRepository: DSetRepository,
    private dSetSubItemRepository: DSetSubItemRepository,
    private dSetItemRepository: DSetItemRepository,
    private dSetContainerRepository: DSetContainerRepository,
    @Inject(forwardRef(() => DispatchSetHelperService)) private dSetHelperService: DispatchSetHelperService
  ) {

  }

  /**
   * END POINT
   * WRITER
   * creates the dispatch request for the given cut ids
   * @param req 
   */
  async createDispatchSet(req: DSetCreateRequest): Promise<GlobalResponseObject> {
    const transManager = new GenericTransactionManager(this.dataSource);
    try {
      const { companyCode, unitCode, username } = req;
      // validate if the cut ids are provided or not
      const refIds = new Set<number>(); // cut ids. PK of the cps.po_cut
      req.setItems.forEach(r => {
        r.itemRefNos.forEach(c => {
          refIds.add(Number(c));
        });
        // check if the containers are also mapped for the set item
        if (!r.plannedItemContainers?.length) {
          // throw new ErrorResponse(0, 'Please provide the containers for all the selected items');
        }
      });
      if (refIds.size == 0) {
        throw new ErrorResponse(0, 'Please select the cut numbers');
      }
      // check if the dispatch is already created for the incoming ref ids
      const existingDSets = await this.dSetItemRepository.count({ where: { companyCode: companyCode, unitCode: unitCode, isActive: true, deRefId: In(Array.from(refIds))}});
      if (existingDSets > 0) {
        throw new ErrorResponse(0, 'Dispatch set is already created for some of the selected items');
      }

      // now get the cut info from the CPS
      const cutsInfo = await this.dSetHelperService.getCutInfoForCutIds(Array.from(refIds), true, true, false, true, true, false, companyCode, unitCode);
      const poSerial = cutsInfo[0].poSerial ? Number(cutsInfo[0].poSerial) : 0;
      if (!poSerial) {
        throw new ErrorResponse(0, 'PO Serial cannot be found for the given cut numbers');
      }
      console.log('po sum went');
      // now get the po summary info
      const poSummary = await this.dSetHelperService.getPoSummary(poSerial, true, true, false, companyCode, unitCode);
      console.log('po sum came');
      // now get the total Dset for the PO ID. And then increment the new DSet Req no by +1
      const totalDSets = await this.dSetRepository.count({ where: { companyCode: companyCode, unitCode: unitCode, l5: poSerial.toString() } });
      const newReqNo = poSummary.orderRefNo + '-' + (totalDSets + 1);

      console.log('a');
      // Now maintain a map of refId(cut id) => containers
      const itemIdContainersMap = new Map<string, DSetPlannedItemContainerModel>();
      req.setItems.forEach(r => {
        r.plannedItemContainers.forEach(c => {
          itemIdContainersMap.set(c.itemRefNo, c);
        })
      });


      // TRANSACTION START
      await transManager.startTransaction();
      // now create the dispatch set -> dispatch set item -> dispatch set sub item 
      const dSetEnt = this.getDispatchSetEntity(newReqNo, poSummary.orderRefId, poSummary.orderRefNo, poSummary.poId, poSummary.poSerial, poSummary.productType, req.remarks, companyCode, unitCode, req.username);
      const savedDispatchSet = await transManager.getRepository(DSetEntity).save(dSetEnt);
      const dSetId = dSetEnt.id;
      console.log('b');
      for (const cut of cutsInfo) {
        let totalAdbBun = 0;
        cut.actualDockets.forEach(d => {
          totalAdbBun += d.isMainDoc ? d.totalAdbs : 0;
        });
        console.log('c');
        // iterate each cut and save the cut info
        const dSetItemEnt = this.getDispatchSetItemEntity(savedDispatchSet.id, cut.cutId, cut.cutNumber, cut.cutSubNumber, cut.refDocket, totalAdbBun, cut.planQuantity, companyCode, unitCode, username);
        const savedDispatchSetItem = await transManager.getRepository(DSetItemEntity).save(dSetItemEnt);
        const dSetItemId = savedDispatchSetItem.id;

        const compsSet = new Set<string>();
        cut.dockets.forEach(d => d.components.forEach(c => compsSet.add(c)));
        // read the color based on main component
        const fgColor = cut.dockets.find(r => r.isMainDoc == true)?.fgColor;
      
        // iterate and push all the main component related lay ids to the array
        const layIds = [];
        cut.actualDockets.map(a => {
          a.isMainDoc == true ? layIds.push(a.layId) : null;
        });
        const compsArray = Array.from(compsSet);
        // get sub item attrs
        // TODO: Get some mandate info form OES 
        const subItemAttrEnt = this.getDSetItemAttrEntity(dSetId, dSetItemId, cut.moNumber, cut.moLines.toString(), '', '', cut.productName, cut.cutNumber, cut.cutSubNumber, '', poSummary.poLines[0].style, poSummary.poLines[0].plantStyle, '', compsArray.toString(), fgColor, layIds.toString());
        await transManager.getRepository(DSetItemAttrEntity).save(subItemAttrEnt);
        const subItemEnts: DSetSubItemEntity[] = [];
        const subItemAttrEnts: DSetSubItemAttrEntity[] = [];
        // now save the dispatch line item

        console.log('d');
        cut.actualDockets.forEach(ad => {
          ad.adBundles.forEach(bun => {
            const subItemEnt = this.getDispatchSetSubItemEntity(dSetId, dSetItemId, bun.adbId.toString(), bun.barcode, ad.layId.toString(), bun.underLayBundleNo?.toString(), bun.quantity, companyCode, unitCode, username);
            subItemEnts.push(subItemEnt);
            // get the sub item attr
            const subItemAttrEnt = this.getDSetSubItemAttrEntity(dSetId, dSetItemId, bun.adbId, bun.size, bun.shade, ad.color, bun.underLayBundleNo.toString());
            subItemAttrEnts.push(subItemAttrEnt);
          });
        });
        // save all the dset sub items from the dset at once
        await transManager.getRepository(DSetSubItemEntity).save(subItemEnts, { reload: false });
        await transManager.getRepository(DSetSubItemAttrEntity).save(subItemAttrEnts, { reload: false });

        console.log('e');
        // const containers = itemIdContainersMap.get(cut.cutId.toString());
        // const containerEnts = containers.containerNos.map(r => {
        //   // TODO: Barcode
        //   const contBrcd = this.getContainerBarcode(cut.cutId, Number(r));
        //   return this.getDSetContainerEntity(dSetId, dSetItemId, containers.remarks, r, contBrcd, containers.containerType, ContainerReadinessEnum.OPEN, companyCode, unitCode, username);
        // });
        // await transManager.getRepository(DSetContainerEntity).save(containerEnts, { reload: false });

        console.log('DONE');
      }
      // finally create the proceeding entity
      const dSetProcEnt = this.getDSetProceedingEntity(dSetId, companyCode, unitCode, username);
      await transManager.getRepository(DSetProceedingEntity).save(dSetProcEnt, { reload: false });

      // TRANSACTION END
      await transManager.completeTransaction();
      return new GlobalResponseObject(true, 0, 'Dispatch set created successfully');
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
    procEnt.currentStage = DSetItemProceedingEnum.OPEN;
    procEnt.remarks = '';
    procEnt.spoc = username;
    procEnt.dSetId = dSetId;
    return procEnt;
  }

  // gets the sub item barcode 
  getContainerBarcode(cutId: number, bagId: number): string {
    return BarcodePrefixEnum.D_CONTAINER + ':' + Number(cutId).toString(16) + '-' + Number(bagId);
  }

  getDSetContainerEntity(dSetId: number, dSetItemId: number, conRemarks: string, containerNo: string, barcode: string, conType: ContainerTypeEnum, itemReadiness: ContainerReadinessEnum, companyCode: string, unitCode: string, username: string): DSetContainerEntity {
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

  getDispatchSetEntity(newReqNo: string, moId: number, moNumber: string, poId: number, poSerial: number, prodType: string, remarks: string, companyCode: string, unitCode: string, username: string): DSetEntity {
    const dispatchSetEntity = new DSetEntity();
    dispatchSetEntity.setNo = newReqNo;
    dispatchSetEntity.l1 = moId.toString();
    dispatchSetEntity.l2 = poId.toString();
    dispatchSetEntity.l3 = prodType;
    dispatchSetEntity.l4 = moNumber; // not required for NL
    dispatchSetEntity.l5 = poSerial.toString(); // not required for NL
    dispatchSetEntity.dispatchEntity = DispatchEntityEnum.CUT;
    dispatchSetEntity.currentStage = DSetProceedingEnum.OPEN;
    dispatchSetEntity.currentLocation = 'PLANT';
    dispatchSetEntity.unitCode = unitCode;
    dispatchSetEntity.printStatus = 0;
    dispatchSetEntity.companyCode = companyCode;
    dispatchSetEntity.unitCode = unitCode;
    dispatchSetEntity.createdUser = username;
    dispatchSetEntity.remarks = remarks;
    return dispatchSetEntity
  }

  getDispatchSetItemEntity(dSetId: number, cutId: number, cutNumber: string, cutSubNumber: string, refDoc: string, totalSubItems: number, totalQty: number, companyCode: string, unitCode: string, username: string): DSetItemEntity {
    const dispatchSetItemEntity = new DSetItemEntity();
    dispatchSetItemEntity.dispatchEntity = DispatchEntityEnum.CUT;
    dispatchSetItemEntity.deRefTable = 'po_cut';
    dispatchSetItemEntity.deRefId = cutId.toString();
    dispatchSetItemEntity.deRefNo1 = cutNumber.toString();
    dispatchSetItemEntity.deRefNo2 = cutSubNumber.toString();
    dispatchSetItemEntity.deRefNo3 = refDoc;
    dispatchSetItemEntity.itemQuantity = totalQty;
    dispatchSetItemEntity.subItemsCount = totalSubItems;
    dispatchSetItemEntity.printStatus = 0;
    dispatchSetItemEntity.itemNo = 'CUT-' + cutSubNumber;
    dispatchSetItemEntity.barcode = ''; // NONE ATM
    dispatchSetItemEntity.dSetId = dSetId;
    dispatchSetItemEntity.companyCode = companyCode;
    dispatchSetItemEntity.unitCode = unitCode;
    dispatchSetItemEntity.createdUser = username;
    dispatchSetItemEntity.currentStage = DSetItemStageEnum.PACKED;
    return dispatchSetItemEntity;
  }

  getDispatchSetSubItemEntity(dSetId: number, dSetItemId: number, refId: string, barcode: string, adId: string, bundleNo: string, qty: number, companyCode: string, unitCode: string, username: string): DSetSubItemEntity {
    const dSetSubItem = new DSetSubItemEntity();
    dSetSubItem.barcode = barcode;
    dSetSubItem.companyCode = companyCode;
    dSetSubItem.createdUser = username;
    dSetSubItem.unitCode = unitCode;
    dSetSubItem.dSetId = dSetId;
    dSetSubItem.dSetItemId = dSetItemId;
    dSetSubItem.dispatchEntity = DispatchEntityEnum.BUNDLE;
    dSetSubItem.deRefId = refId; // PK of adb shade
    dSetSubItem.deRefNo1 = adId; // PK of po_docket_lay
    dSetSubItem.deRefNo2 = bundleNo; // under lay adb no
    dSetSubItem.itemQuantity = Number(qty);
    dSetSubItem.itemNo = '';
    dSetSubItem.itemReadiness = ContainerSubItemReadinessEnum.OPEN;
    dSetSubItem.printStatus = 0;
    return dSetSubItem;
  }

  // HELPER
  getDSetItemAttrEntity(dSetId: number, dSetItemId: number, mo: string, mol: string, co: string, vpo: string, prodName: string, cutNo: string, cutSubNo: string, delDate: string, style: string, plantStyleRef: string, dest: string, components: string, color: string, layIds: string): DSetItemAttrEntity {
    // REFERENCE ENUM
    // export enum DSetItemAttrEnum {
    //   MO = 'l1', // mo number
    //   PSTREF = 'lm1', // plant style REF
    //   CO = 'l3', // customer order no
    //   VPO = 'l4', // vendor purchase no
    //   PNM = 'lm2', // product name
    //   CNO = 'l6', // cut no
    //   CSNO = 'l7', // cut sub number
    //   DDT = 'l8', // delivery date
    //   DEST = 'l5', // destination
    //   STY = 'l2', // style
    //   COMPS = 'lt1', // csv of components
    //   MOL = 'lt2', // csv of mo lines
    //   COL = 'l9' // color of the  item
    //   LIDS = 'l10' // csv of lay ids of main docket
    // }
    const setItemAttrEnt = new DSetItemAttrEntity();
    setItemAttrEnt.l1 = mo;
    setItemAttrEnt.lm1 = plantStyleRef;
    setItemAttrEnt.l3 = co;
    setItemAttrEnt.l4 = vpo;
    setItemAttrEnt.lm2 = prodName;
    setItemAttrEnt.l6 = cutNo;
    setItemAttrEnt.l7 = cutSubNo;
    setItemAttrEnt.l8 = delDate;
    setItemAttrEnt.l9 = color;
    setItemAttrEnt.l10 = layIds;
    setItemAttrEnt.l5 = dest;
    setItemAttrEnt.l2 = style;
    setItemAttrEnt.lt1 = components;
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
  async deleteDispatchSet(req: DSetIdsRequest): Promise<GlobalResponseObject> {
    const transManager = new GenericTransactionManager(this.dataSource);
    try {
      // Remove data from all tables using the dSetId
      // check dispatch set id(s) 
      if (!req.dSetPks?.length) {
        throw new ErrorResponse(0, 'Please provide the dispatch set id');
      }
      const { unitCode, companyCode } = req;

      const dSetRec = await this.dSetRepository.findOne({ select: ['id'], where: { companyCode: companyCode, unitCode: unitCode, id: In(req.dSetPks)}});
      if(!dSetRec) {
        throw new ErrorResponse(0, 'No Dispatch set exist for the provided info');
      }

      // check is the shipping request is created for the dispatch set
      const shippingReqItemRecs = await this.dSetHelperService.getShippingRequestItemRecordsForRefIds(ShippingRequestItemLevelEnum.SET, req.dSetPks, companyCode, unitCode);
      if(shippingReqItemRecs.length > 0) {
        throw new ErrorResponse(0, 'Shipping request is already created for some of the items');
      }

      // do the validations
      for (const dSetId of req.dSetPks) {
        // check if any item related to the dSet is packed into a container
        const contianerPackedItems = await this.dSetHelperService.getTotalContainerPackedItemsCountForDSetIds([dSetId], companyCode, unitCode);
        if (contianerPackedItems > 0) {
          throw new ErrorResponse(0, `Some items related to the selected sets are already packed`);
        }
      }

      const dSetIds = req.dSetPks;
      await transManager.startTransaction();
      // then finally delete the records from all the tables
      await transManager.getRepository(DSetProceedingEntity).delete({ dSetId: In(dSetIds), companyCode: companyCode, unitCode: unitCode });
      await transManager.getRepository(DSetSubItemAttrEntity).delete({ dSetId: In(dSetIds) });
      await transManager.getRepository(DSetItemAttrEntity).delete({ dSetId: In(dSetIds) });
      await transManager.getRepository(DSetSubItemEntity).delete({ dSetId: In(dSetIds), companyCode: companyCode, unitCode: unitCode });
      await transManager.getRepository(DSetContainerEntity).delete({ dSetId: In(dSetIds), companyCode: companyCode, unitCode: unitCode });
      await transManager.getRepository(DSetSubItemContainerMapEntity).delete({ dSetId: In(dSetIds), companyCode: companyCode, unitCode: unitCode });
      await transManager.getRepository(DSetItemEntity).delete({ dSetId: In(dSetIds), companyCode: companyCode, unitCode: unitCode });
      await transManager.getRepository(DSetEntity).delete({ id: In(dSetIds), companyCode: companyCode, unitCode: unitCode });
      await transManager.getRepository(DSetSubItemAttrEntity).delete({ dSetId: In(dSetIds) });
      await transManager.completeTransaction();
      return new GlobalResponseObject(true, 0, 'Cut dispatch request deleted successfully');
    } catch (error) {
      await transManager.releaseTransaction();
      throw error;
    }
  }



  // async approveDispatchSet(req: DSetIdsRequest): Promise<GlobalResponseObject> {
  //   const transManager = new GenericTransactionManager(this.dataSource);

  //   try {
  //     await transManager.startTransaction();
  //     const dSetProceeding = await this.dSetProceedingRepository.find({ where: { dSetId: In(req.dSetPks) } });

  //     if (!dSetProceeding.length) {
  //       throw new ErrorResponse(0, `Dispatch set with ID: ${req.dSetPks} does not exist.`);
  //     }
  //     dSetProceeding.map((rec, index) => {
  //       rec.dSetId = req.dSetPks[index]
  //       rec.currentStage = ProceedingStages.APPROVED
  //       rec.remarks = req.remarks;
  //       rec.spoc = '';

  //     })
  //     const dSetIds = dSetProceeding.map((rec) => rec.dSetId);
  //     await transManager.getRepository(DSetProceedingEntity).save(dSetProceeding);
  //     await this.dSetRepository.update({ id: In(dSetIds) }, { currentStage: ProceedingStages.APPROVED });
  //     await transManager.completeTransaction();

  //     return new GlobalResponseObject(true, 200, 'Dispatch set approved successfully');
  //   } catch (error) {
  //     await transManager.releaseTransaction();
  //     throw new ErrorResponse(500, `Error approving dispatch set: ${error.message}`);
  //   }
  // }



  // async rejectDispatchSet(req: DSetIdsRequest): Promise<GlobalResponseObject> {
  //   const transManager = new GenericTransactionManager(this.dataSource);

  //   try {
  //     await transManager.startTransaction();
  //     const dSetProceeding = await this.dSetProceedingRepository.find({ where: { dSetId: In(req.dSetPks) } });

  //     if (!dSetProceeding.length) {
  //       throw new ErrorResponse(0, `Dispatch set with ID: ${req.dSetPks} does not exist.`);
  //     }
  //     dSetProceeding.map((rec, index) => {
  //       rec.dSetId = req.dSetPks[index]
  //       rec.currentStage = ProceedingStages.REJECTED
  //       rec.remarks = req.remarks;
  //       rec.spoc = '';

  //     })
  //     const dSetIds = dSetProceeding.map((rec) => rec.dSetId);
  //     await transManager.getRepository(DSetProceedingEntity).save(dSetProceeding);
  //     await this.dSetRepository.update({ id: In(dSetIds) }, { currentStage: ProceedingStages.REJECTED });
  //     await transManager.completeTransaction();

  //     return new GlobalResponseObject(true, 200, 'Dispatch set approved successfully');
  //   } catch (error) {
  //     await transManager.releaseTransaction();
  //     throw new ErrorResponse(500, `Error approving dispatch set: ${error.message}`);
  //   }
  // }


  //ENDPOINT
  async updateSubItemPrintStatus(req: DSetItemIdsRequest): Promise<GlobalResponseObject> {
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
      return new GlobalResponseObject(true, 200, "Sub item print status updated successfully");
    } catch (error) {
      await transManager.releaseTransaction();
      throw error;
    }
  }

  //ENDPOINT
  async updateContainerPrintStatus(req: DSetItemIdsRequest): Promise<GlobalResponseObject> {
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
        throw new ErrorResponse(0, "Container ids not found");
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
      return new GlobalResponseObject(true, 200, "Container print status updated successfully");
    } catch (error) {
      await transManager.releaseTransaction();
      throw error;
    }
  }

  //ENDPOINT
  async releaseSubItemPrintStatus(req: DSetItemIdsRequest): Promise<GlobalResponseObject> {
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
      return new GlobalResponseObject(true, 200, "Sub item print status released successfully");
    } catch (error) {
      await transManager.releaseTransaction();
      console.error('Error in releaseSubItemPrintStatus:', error);
      throw error;
    }
  }

  //ENDPOINT
  async releaseContainerPrintStatus(req: DSetItemIdsRequest): Promise<GlobalResponseObject> {
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
        throw new ErrorResponse(0, "Container ids not found");
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
      return new GlobalResponseObject(true, 200, "Container print status released successfully");
    } catch (error) {
      await transManager.releaseTransaction();
      throw error;
    }
  }
}