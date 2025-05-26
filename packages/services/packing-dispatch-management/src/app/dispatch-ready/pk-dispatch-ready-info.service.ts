import { Injectable } from "@nestjs/common";
import { DataSource, In } from "typeorm";
import { DSetSubItemContainerMapRepository } from "./repository/d-set-sub-item-container-map.repository";
import { DSetContainerRepository } from "./repository/d-set-container-repository";
import { PkContainerWiseSubItemBarcodeModel, PkDSetBarcodeModel, PkDSetGetBarcodesRequest, PkDSetItemIdsRequest, PkDSetItemsBarcodesModel, PkDSetBarcodesResponse, PkDSetSubItemsBarcodesModel, PkDSetItemBarcodesResponse, PkDSetItemAttrEnum, PkDSetSubItemBarcodeDetailedModel } from "@xpparel/shared-models";
import { ErrorResponse } from "@xpparel/backend-utils";
import { GenericTransactionManager } from "../../database/typeorm-transactions";
import { DSetRepository } from "../dispatch-set/repository/d-set-repository";
import { DSetItemRepository } from "../dispatch-set/repository/d-set-item-repository";
import { DSetSubItemRepository } from "../dispatch-set/repository/d-set-sub-item-repository";
import { DSetSubItemEntity } from "../dispatch-set/entity/d-set-sub-item.entity";
import { DSetSubItemContainerMapEntity } from "./entity/d-set-sub-item-container-map.entity";
import { DSetItemAttrRepository } from "../dispatch-set/repository/d-set-item-attr.repository";
import { DSetItemAttrEntity } from "../dispatch-set/entity/d-set-item-attr.entity";
import { DSetSubItemAttrRepository } from "../dispatch-set/repository/d-set-sub-item-attr.repository";
import { DSetSubItemAttrEntity } from "../dispatch-set/entity/d-set-sub-item-attr.entity";

@Injectable()
export class PkDispatchReadyInfoService {
  constructor(
    private dataSource: DataSource,
    private dsetRepo : DSetRepository,
    private dsetItemRepo : DSetItemRepository,
    private dsetSubItemRepo : DSetSubItemRepository,
    private dSetContainerRepo : DSetContainerRepository,
    private dSetContainerMapRepo : DSetSubItemContainerMapRepository,
    private dSetContainerMapRepository: DSetContainerRepository,
    private dSetSubItemContainerMapRepository: DSetSubItemContainerMapRepository,
    private dSetItemAttrRepo: DSetItemAttrRepository,
    private dSetSubItemAttrRepo: DSetSubItemAttrRepository
  ) {

  }


  // ENDPOINT
  async getDsetBarcodeInfo(req: PkDSetGetBarcodesRequest) : Promise<PkDSetBarcodesResponse>{
    const transManager = new GenericTransactionManager(this.dataSource);
       //Check DsetIds received from the request
    if(!req?.dSetIds?.length){
      throw new ErrorResponse(41001,'No DSetIds Provided');
    }
     const { companyCode, unitCode, username } = req;
     await transManager.startTransaction();
     //Check DSetId's available in the dSet DB
    const dSetRecs = await this.dsetRepo.find({where : {id : In(req.dSetIds) , companyCode: companyCode, unitCode: unitCode}});
    const dSetBarcodeModels:PkDSetBarcodeModel[]=[];
    if(dSetRecs.length != req.dSetIds.length){
      throw new ErrorResponse(41002,'Some Disptach set ids does not exist');
    }
    const dSetItemsBarcodeModels:PkDSetItemsBarcodesModel[]=[];
    for(const records of dSetRecs){
      // call the item and item barcodes info
      const dSetItems = await this.dsetItemRepo.find({select: ['id'], where: { dSetId: records.id}});
      for(const dSetItem of dSetItems) {
        // get the item attributes
        const attrRec = await this.dSetItemAttrRepo.findOne({ where: { dSetId: dSetItem.dSetId, dSetItemId: dSetItem.id } });
        const attrsModel = this.getDsetItemAttrEnumModel(attrRec);

        // call the mapped 
        let plannedBrcdInfo: { planBarcodes: string[]; planBarcodesInfo: PkDSetSubItemsBarcodesModel[] };
        let putInBarcodeList: { putInBagBarcodes: string[]; putInBagBarcodesInfo: PkDSetSubItemsBarcodesModel[]; }
        let containerWiseBarcodes :  { containerWiseBarcodesInfo: PkContainerWiseSubItemBarcodeModel[]; }

        if(req.iNeedAllBarcodesList || req.iNeedAllBarcodesDetailedList) {
          plannedBrcdInfo = await this.getPlannedBarcodesListModels(dSetItem.id, companyCode, unitCode, req.iNeedAllBarcodesDetailedList, false);
        }

        if(req.iNeedPutInBagBarcodeList || req.iNeedPutInBagBarcodeDetailedList) {
          putInBarcodeList = await this.getPutInBagBarcodesListModels(dSetItem.id, companyCode, unitCode, req.iNeedPutInBagBarcodeDetailedList, false);
        }

        if(req.iNeedBagWiseAbstract || req.iNeedBagWiseAbstractWithDetailedBarcodes) {
          containerWiseBarcodes = await this.getBagWiseAbractModels(dSetItem.id, companyCode, unitCode, req.iNeedBagWiseAbstractWithDetailedBarcodes, false);
        }
        const dSetBarcodesModel = new PkDSetItemsBarcodesModel(dSetItem.id, dSetItem.printStatus, attrsModel, plannedBrcdInfo?.planBarcodes, plannedBrcdInfo?.planBarcodesInfo,putInBarcodeList?.putInBagBarcodes, putInBarcodeList?.putInBagBarcodesInfo, containerWiseBarcodes?.containerWiseBarcodesInfo);
        dSetItemsBarcodeModels.push(dSetBarcodesModel);
      }
      const dSetBarcodes = new PkDSetBarcodeModel(records.setNo, dSetItemsBarcodeModels);
      dSetBarcodeModels.push(dSetBarcodes);
    }
    return new PkDSetBarcodesResponse(true,11,'',dSetBarcodeModels);
  }


  // HELPER
  async getPlannedBarcodesListModels(dsetItemId: number, companyCode: string, unitCode: string, iNeedAllBarcodesDetailedList: boolean, throwErrorIfNoRec: boolean): Promise<{planBarcodes: string[], planBarcodesInfo: PkDSetSubItemsBarcodesModel[]}> {
    console.log('dsetItemId',dsetItemId);
    const dSetItemBarcodesRecs = await this.dsetItemRepo.find({where : {id : dsetItemId, companyCode: companyCode, unitCode: unitCode}});
    //console.log(dSetItemBarcodesRecs);
    if(dSetItemBarcodesRecs.length == 0 && throwErrorIfNoRec){
      throw new ErrorResponse(41003,'No DsetIds found');
    }
    const subItemRecords = await this.dsetSubItemRepo.find({ select: ['id', 'barcode', 'itemQuantity', 'deRefId'], where : {dSetItemId : dsetItemId, companyCode: companyCode, unitCode: unitCode}});
    if(subItemRecords.length == 0 && throwErrorIfNoRec){
      throw new ErrorResponse(41004,'No DSet SubItems Ids found');
    }

    let subItemAttrMap: Map<number, PkDSetSubItemBarcodeDetailedModel>;
    if(iNeedAllBarcodesDetailedList) {
      // get detailed info for the ADB shade ids for this specific dset item id
      subItemAttrMap = await this.getBarcodeDetailedModel(dsetItemId, companyCode, unitCode);
    }

    const dSetSubItemsBarcodes : PkDSetSubItemsBarcodesModel[] = [];
    const planBarcodesArr : string[] = [];
    for(const subItemRec of subItemRecords){
      const barcodeDetailInfo = subItemAttrMap?.get(Number(subItemRec.deRefId));
      const dSetSubItemsBarcodesModel = new PkDSetSubItemsBarcodesModel(subItemRec.barcode,subItemRec.itemQuantity,subItemRec.id, barcodeDetailInfo);
      dSetSubItemsBarcodes.push(dSetSubItemsBarcodesModel);
      planBarcodesArr.push(subItemRec.barcode);
    }
    return {
      planBarcodes: planBarcodesArr,
      planBarcodesInfo: dSetSubItemsBarcodes
    };
  }

  
  // ENDPOINT
  async getDsetItemBarcodeInfo(req: PkDSetGetBarcodesRequest): Promise<PkDSetItemBarcodesResponse> {
    const transManager = new GenericTransactionManager(this.dataSource);
       //Check DsetIds received from the request
    if(!req?.dSetItemIds?.length){
      throw new ErrorResponse(41005,'No DSetItemIds Provided');
    }
     const { companyCode, unitCode, username } = req;
      const dSetItemsBarcodeModels:PkDSetItemsBarcodesModel[]=[];
    
      // call the item and item barcodes info
      const dSetItemsRecs = await this.dsetItemRepo.find({select: ['id', 'dSetId'], where: {id : In(req.dSetItemIds) , companyCode: companyCode, unitCode: unitCode}});
      if(dSetItemsRecs.length != req.dSetIds.length){
        throw new ErrorResponse(41006,'Some set Item Ids does not exists');
      }
      for(const dSetItem of dSetItemsRecs) {
        // get the item attributes
        const attrRec = await this.dSetItemAttrRepo.findOne({ where: { dSetId: dSetItem.dSetId, dSetItemId: dSetItem.id } });
        const attrsModel = this.getDsetItemAttrEnumModel(attrRec);
        // call the mapped 
        let plannedBrcdInfo: {planBarcodes: string[]; planBarcodesInfo: PkDSetSubItemsBarcodesModel[] };
        let putInBarcodeList: {putInBagBarcodes: string[]; putInBagBarcodesInfo: PkDSetSubItemsBarcodesModel[];}
        let containerWiseBarcodes :  {containerWiseBarcodesInfo: PkContainerWiseSubItemBarcodeModel[];}

        if(req.iNeedAllBarcodesList || req.iNeedAllBarcodesDetailedList) {
          plannedBrcdInfo = await this.getPlannedBarcodesListModels(dSetItem.id, companyCode, unitCode, req.iNeedAllBarcodesDetailedList,false);
        }

        if(req.iNeedPutInBagBarcodeList || req.iNeedPutInBagBarcodeDetailedList) {
          putInBarcodeList = await this.getPutInBagBarcodesListModels(dSetItem.id, companyCode, unitCode, req.iNeedPutInBagBarcodeDetailedList,false);
        }

        if(req.iNeedBagWiseAbstract || req.iNeedBagWiseAbstractWithDetailedBarcodes) {
          containerWiseBarcodes = await this.getBagWiseAbractModels(dSetItem.id, companyCode, unitCode, req.iNeedBagWiseAbstractWithDetailedBarcodes,false);
        }
        const dSetBarcodesModel = new PkDSetItemsBarcodesModel(dSetItem.id, dSetItem.printStatus, attrsModel, plannedBrcdInfo?.planBarcodes, plannedBrcdInfo?.planBarcodesInfo,putInBarcodeList?.putInBagBarcodes, putInBarcodeList?.putInBagBarcodesInfo, containerWiseBarcodes?.containerWiseBarcodesInfo);
        dSetItemsBarcodeModels.push(dSetBarcodesModel);
      }
      
    return new PkDSetItemBarcodesResponse(true,41007,'',dSetItemsBarcodeModels);
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

  getDsetItemAttrEnumModel(dSetItemAttrRec: DSetItemAttrEntity): {[k in PkDSetItemAttrEnum]?: string} {
    return {
      [PkDSetItemAttrEnum.CO]:  dSetItemAttrRec.l3,
      [PkDSetItemAttrEnum.MO]:  dSetItemAttrRec.l1,
      [PkDSetItemAttrEnum.PSTREF]:  dSetItemAttrRec.lm1,
      [PkDSetItemAttrEnum.VPO]:  dSetItemAttrRec.l4,
      [PkDSetItemAttrEnum.PNM]:  dSetItemAttrRec.lm2,
      [PkDSetItemAttrEnum.DDT]:  dSetItemAttrRec.l8,
      [PkDSetItemAttrEnum.DEST]:  dSetItemAttrRec.l5,
      [PkDSetItemAttrEnum.STY]:  dSetItemAttrRec.l2,
      [PkDSetItemAttrEnum.BUY]:  dSetItemAttrRec.lm4
    }
    // Keep this ref code here
    // const setItemAttrEnt = new DSetItemAttrEntity();
    // setItemAttrEnt.l1 = mo;
    // setItemAttrEnt.lm1 = plantStyleRef;
    // setItemAttrEnt.l3 = co;
    // setItemAttrEnt.l4 = vpo;
    // setItemAttrEnt.lm2 = prodName;
    // setItemAttrEnt.l6 = cutNo;
    // setItemAttrEnt.l7 = cutSubNo;
    // setItemAttrEnt.l8 = delDate;
    // setItemAttrEnt.l9 = color;
    // setItemAttrEnt.l5 = dest;
    // setItemAttrEnt.l2 = style;
    // setItemAttrEnt.lt1 = components;
    // setItemAttrEnt.lt2 = mol;
    // setItemAttrEnt.dSetId = dSetId;
    // setItemAttrEnt.dSetItemId = dSetItemId;

  }

  // HELPER
  async getPutInBagBarcodesListModels(dsetItemId: number, companyCode: string, unitCode: string, iNeedPutInBagBarcodeDetailedList:boolean,throwErrorIfNoRec: boolean): Promise<{putInBagBarcodes: string[], putInBagBarcodesInfo: PkDSetSubItemsBarcodesModel[]}>{
    const containerMapRecords = await this.dSetContainerMapRepo.find({where:{dSetItemId: dsetItemId , companyCode : companyCode, unitCode : unitCode, isActive: true}});
    if(containerMapRecords.length == 0 && throwErrorIfNoRec){
      throw new ErrorResponse(41008, 'No Records Found in Container map');
    }
    // now get the sub items to keep a map of the item and its other info
    const subItemRecs = await this.dsetSubItemRepo.find({ select: ['id', 'barcode', 'itemQuantity', 'deRefId'], where: { dSetItemId: dsetItemId, companyCode: companyCode, unitCode: unitCode, isActive: true }});    
    // keep a ref map to get the barcode info handy
    const subItemMap = new Map<number, DSetSubItemEntity>();
    subItemRecs.forEach(r => subItemMap.set(r.id, r));

    let subItemAttrMap: Map<number, PkDSetSubItemBarcodeDetailedModel>;
    if(iNeedPutInBagBarcodeDetailedList) {
      // get detailed info for the ADB shade ids for this specific dset item id
      subItemAttrMap = await this.getBarcodeDetailedModel(dsetItemId, companyCode, unitCode);
    }

    const putInBagBarcodeList = [];
    const dSetSubItemsBarcodes : PkDSetSubItemsBarcodesModel[] = [];
    for(const rec of containerMapRecords){
      putInBagBarcodeList.push(rec.barcode.toString());
      
      const subItemInfo = subItemMap.get(rec.dSetSubItemId);
      const barcodeDetailInfo = subItemAttrMap?.get(Number(subItemInfo.deRefId));
      const dSetSubItemsBarcodesModel = new PkDSetSubItemsBarcodesModel(rec.barcode, subItemInfo.itemQuantity, rec.id, barcodeDetailInfo);
      dSetSubItemsBarcodes.push(dSetSubItemsBarcodesModel);
    }
    return {
      putInBagBarcodes: putInBagBarcodeList,
      putInBagBarcodesInfo: dSetSubItemsBarcodes
    };
  }

  // HELPER
  // NOTE: Returns map of ADB ID -> DSetSubItemBarcodeDetailedModel. ********* DSetSubItem id does not exist in this entity
  async getBarcodeDetailedModel(dSetItemId: number, companyCode: string, unitCode: string): Promise<Map<number, PkDSetSubItemBarcodeDetailedModel>> {
    const subItemArrRecs = await this.dSetSubItemAttrRepo.find({ select: ['dSetSubItemRefId', 'l1', 'l2'], where: { dSetItemId: dSetItemId } });
    const subItemArrMap = new Map<number, PkDSetSubItemBarcodeDetailedModel>();
    // NOTE: this map is not for dSetSubItem id. Since we dont maintain the dSetSubItem id in this DSetSubItemAttrEntity
    subItemArrRecs.forEach(r => subItemArrMap.set(Number(r.dSetSubItemRefId), new PkDSetSubItemBarcodeDetailedModel(false, r.l1, r.l2)));
    return subItemArrMap;
  }

  // HELPER 
  async getBagWiseAbractModels(dsetItemId: number, companyCode: string, unitCode: string, iNeedBagWiseAbstractWithDetailedBarcodes:boolean, throwErrorIfNoRec: boolean ): Promise<{containerWiseBarcodesInfo: PkContainerWiseSubItemBarcodeModel[]}>{
    console.log('helo');
    const containerRecords = await this.dSetContainerRepo.find({where:{dSetItemId: dsetItemId, companyCode : companyCode, unitCode : unitCode, isActive: true}}); 
    if(containerRecords.length == 0 && throwErrorIfNoRec ){
      throw new ErrorResponse(41009,'Container Ids not found in Container table');
    }

    // now get the sub items to keep a map of the item and its other info
    const subItemRecs = await this.dsetSubItemRepo.find({ select: ['id', 'barcode', 'itemQuantity', 'deRefId'], where: { dSetItemId: dsetItemId, companyCode: companyCode, unitCode: unitCode, isActive: true }});    
    // keep a ref map to get the barcode info handy
    const subItemMap = new Map<number, DSetSubItemEntity>();
    subItemRecs.forEach(r => subItemMap.set(r.id, r));

    let subItemAttrMap: Map<number, PkDSetSubItemBarcodeDetailedModel>;
    if(iNeedBagWiseAbstractWithDetailedBarcodes) {
      // get detailed info for the ADB shade ids for this specific dset item id
      subItemAttrMap = await this.getBarcodeDetailedModel(dsetItemId, companyCode, unitCode);
    }

    const containerWiseSubItemBarcodeModel : PkContainerWiseSubItemBarcodeModel[] = [];
    for(const con of containerRecords){
      
      const dSetSubItemsBarcodes : PkDSetSubItemsBarcodesModel[] = [];
      // get the barcodes inside the container
      const barcodesInConRecs = await this.dSetContainerMapRepo.find({ select:['barcode', 'dSetContainerId', 'dSetSubItemId'], where: { dSetItemId: dsetItemId, dSetContainerId: con.id, companyCode: companyCode, unitCode: unitCode, isActive: true }});

      const barcodesInCon = [];
      for(const rec of barcodesInConRecs) {
        barcodesInCon.push(rec.barcode);

        const subItemInfo = subItemMap.get(rec.dSetSubItemId);
        const barcodeDetailInfo = subItemAttrMap?.get(Number(subItemInfo.deRefId));
        const dSetSubItemsBarcodesModel = new PkDSetSubItemsBarcodesModel(rec.barcode, subItemInfo.itemQuantity, rec.id, barcodeDetailInfo);
        dSetSubItemsBarcodes.push(dSetSubItemsBarcodesModel);
      }
      const containerWiseBarcodes = new PkContainerWiseSubItemBarcodeModel(con.id, con.containerNumber, con.containerType, con.barcode, barcodesInCon, dSetSubItemsBarcodes);
      containerWiseSubItemBarcodeModel.push(containerWiseBarcodes);
    }
    return {
      containerWiseBarcodesInfo : containerWiseSubItemBarcodeModel
    };
  }


  //HELPER
  async getTotalContainerPackedItemsCountForDSetIds(dSetIds: number[], companyCode: string, unitCode: string): Promise<number> {
    return await this.dSetSubItemContainerMapRepository.count({ where: { companyCode: companyCode, unitCode: unitCode, isActive: true, dSetId: In(dSetIds)}});
  }


  // Helper
  async getPendingToPutInBagItemsCountForDsetIds(dSetIds: number[], companyCode: string, unitCode: string): Promise<number> {
    const dSetSubItems = await this.dSetSubItemContainerMapRepository.getPendingToPutInBagItemsCountForDsetIds(dSetIds, companyCode, unitCode);
    return dSetSubItems?.total_items ? Number(dSetSubItems.total_items) : 0;
  }
}


