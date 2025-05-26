import { Injectable } from "@nestjs/common"; import { DataSource, In } from "typeorm";
import moment = require("moment");
import { DSetIdsRequest, GlobalResponseObject, ShippingRequestCheckoutRequest, ShippingRequestIdRequest, ShippingRequestItemIdRequest, ShippingRequestItemLevelEnum, ShippingRequestProceedingEnum, ShippingRequestStageEnum, ShippingRequestTruckIdRequest, ShippingRequestTruckRequest, ShippingRequestVendorRequest, TruckTypeEnum } from "@xpparel/shared-models";
import { SRequestRepository } from "./repository/s-request-repository";
import { ErrorResponse } from "@xpparel/backend-utils";
import { GenericTransactionManager } from "../../database/typeorm-transactions";
import { SRequestEntity } from "./entites/s-request.entity";
import { SRequestItemEntity } from "./entites/s-request-item.entity";
import { SRequestProceedingEntity } from "./entites/s-request-proceeding.entity";
import { SRequestTruckEntity } from "./entites/s-request-truck.entity";
import { ShippingRequestHelperService } from "./shipping-request-helper.service";
import { SRequestItemTruckMapEntity } from "./entites/s-request-item-truck-map.entity";
import { SRequestVendorEntity } from "./entites/s-request-vendor.entity";
import { SRequestVendorRepository } from "./repository/s-request-vendor.repository";
import { SRequestTruckRepository } from "./repository/s-request-truck-repository";
import { SRequestItemRepository } from "./repository/s-request-item-repository";
import { SRequestProceedingRepository } from "./repository/s-request-proceeding-repository";
import { SRequestItemTruckMapRepository } from "./repository/s-request-item-truck-map.repository";
import { Console } from "console";
import { DSetItemAttrEntity } from "../dispatch-set/entity/d-set-item-attr.entity";
import { SRequestItemAttrEntity } from "./entites/s-request-item-attr.entity";


@Injectable()
export class ShippingRequestService {
  constructor(
    private dataSource: DataSource,
    private sRequestRepository: SRequestRepository,
    private shippingRequestHelperService: ShippingRequestHelperService,
    private sRequestVendorRepository: SRequestVendorRepository,
    private sRequestTruckRepository: SRequestTruckRepository,
    private sRequestItemRepository: SRequestItemRepository,
    private sRequestProceedingRepository: SRequestProceedingRepository,
    private sRequestItemTruckMapRepository: SRequestItemTruckMapRepository,

  ) {

  }

  /**
    * Create , save  (SRequestEntity).
    * Fetch the  records based on the input IDs.
    * For each ID pf d_set id:
    * Check for existing records.
    * If no existing records, create and save SRequestItemEntity.
    * Create and save the proceeding (SRequestProceedingEntity).
    * Create and save truck details (SRequestTruckEntity).
    * Map each item to the truck by creating and saving SRequestItemTruckMapEntity 
   */
  // ENDPOINT
  async createShippingRequest(req: DSetIdsRequest): Promise<GlobalResponseObject> {
    const transManager = new GenericTransactionManager(this.dataSource);
    try {
      if (!req.dSetPks?.length) {
        throw new ErrorResponse(41103, 'IDs must be provided');
      }
      const dSetIdSet = new Set<number>(req.dSetPks);
      const { companyCode, unitCode, username } = req;
      const dSetPks = Array.from(dSetIdSet);
      // Fetch DSetRecords 
      const dSetRecords = await this.shippingRequestHelperService.getDSetRecordsByDSetIds(
        dSetPks, companyCode, unitCode
      );
      if (dSetPks.length !== dSetRecords.length) {
        throw new ErrorResponse(41104, 'Few records do not exist. Refresh the page and try again');
      }
      // also check for any dset id is the shipping req already created. If so then throw an error
      const srItemRec = await this.sRequestItemRepository.findOne({ select: ['id'], where: { companyCode: companyCode, unitCode: unitCode, refId: In(dSetPks), isActive: true  }});
      if(srItemRec) {
        throw new ErrorResponse(41105, 'Shipping request is already created for some of the items');
      }
      await transManager.startTransaction();
      // requestNo not in req
      const sRequestEntity = this.getSRequestEntity(req.remarks, companyCode, unitCode, username, ShippingRequestProceedingEnum.OPEN);
      const savedSRequest = await transManager.getRepository(SRequestEntity).save(sRequestEntity);

      for (const dSetRecord of dSetRecords) {

        const sRequestItemEntity = this.getSRequestItemEntity(savedSRequest.id, dSetRecord.id, dSetRecord.l1, dSetRecord.l2, dSetRecord.l3, dSetRecord.l4, dSetRecord.l5, companyCode, unitCode, username);
        const savedSrItem = await transManager.getRepository(SRequestItemEntity).save(sRequestItemEntity);
        // construct the sr item attr entity

        // get the info from the d set
        const dSetContainers = await this.shippingRequestHelperService.getDSetContainersByDSetId(dSetRecord.id, companyCode, unitCode);
        // const dSetItemAttrs = await this.shippingRequestHelperService.getDSetItemAttrRecordsByDSetId(dSetRecord.id, companyCode, unitCode);
        const dSetItemRecs = await this.shippingRequestHelperService.getDSetItemRecordsByDSetId(dSetRecord.id, companyCode, unitCode);
        if (dSetItemRecs.length <= 0) {
          throw new ErrorResponse(41106, 'Dispatch sub items not found for the dispatch id : ' + dSetRecord.id);
        }
        const cutNumbers = new Set<string>();
        const cutSubNumbers = new Set<string>();
        let totalBundles = 0;
        let totalQty = 0;
        dSetItemRecs.forEach(r => {
          cutNumbers.add(r.deRefNo1);
          cutSubNumbers.add(r.deRefNo2);
          totalBundles += Number(r.subItemsCount);
          totalQty += Number(r.subItemsCount);
        });
        const containerBarcodes = new Set<string>();
        const containerNos = []; // taking this as an array since the bag numbers accross multiple cuts can be the same
        dSetContainers.forEach(r => {
          containerBarcodes.add(r.barcode);
          containerNos.push(r.containerNumber);
        });

        const srItemAttrEnt = new SRequestItemAttrEntity();
        srItemAttrEnt.companyCode = companyCode;
        srItemAttrEnt.unitCode = unitCode;
        srItemAttrEnt.sRequestId = savedSRequest.id;
        srItemAttrEnt.sRequestItemId = savedSrItem.id;
        srItemAttrEnt.li1 = totalBundles;// total bundles
        srItemAttrEnt.li2 = totalQty;// total panels
        srItemAttrEnt.l1 = dSetRecord.l4; // mo number
        srItemAttrEnt.lm1 = Array.from(cutNumbers).toString(); // cut numbers csv
        srItemAttrEnt.lm2 = Array.from(cutSubNumbers).toString(); // cut sub numbers csv
        srItemAttrEnt.lm3 = dSetRecord.l3; // product name
        srItemAttrEnt.lt1 = Array.from(containerBarcodes).toString();// container barcodes csv
        srItemAttrEnt.lt2 = containerNos?.toString();// container numbers csv
        // save the s request item attrs entity
        await transManager.getRepository(SRequestItemAttrEntity).save(srItemAttrEnt, { reload: false });
      }

      // save the Proceeding entity
      const proceedingEntity = this.getSRequestProceedingEntity(savedSRequest.id, req.remarks, companyCode, unitCode, username, ShippingRequestProceedingEnum.OPEN);
      await transManager.getRepository(SRequestProceedingEntity).save(proceedingEntity, { reload: false });

      // Commit transaction
      await transManager.completeTransaction();
      return new GlobalResponseObject(true, 41107, 'Shipping  Created Successfully');
    } catch (error) {
      await transManager.releaseTransaction();
      throw error;
    }
  }

  // HELPER
  getSRequestEntity(remarks: string, companyCode: string, unitCode: string, username: string, status: ShippingRequestProceedingEnum): SRequestEntity {
    const sRequestEntity = new SRequestEntity();
    sRequestEntity.requestNo = '';
    sRequestEntity.currentStage = status;
    sRequestEntity.remarks = remarks;
    sRequestEntity.printStatus = 0;
    sRequestEntity.companyCode = companyCode;
    sRequestEntity.createdUser = username;
    sRequestEntity.unitCode = unitCode;
    return sRequestEntity;
  }

  // HELPER
  getSRequestItemEntity(sRequestId: number, refId: number, l1: string, l2: string, l3: string, l4: string, l5: string, companyCode: string, unitCode: string, username: string) {
    const sRequestItemEntity = new SRequestItemEntity();
    sRequestItemEntity.sRequestId = sRequestId;
    sRequestItemEntity.refId = refId;
    sRequestItemEntity.companyCode = companyCode;
    sRequestItemEntity.unitCode = unitCode;
    sRequestItemEntity.createdUser = username;
    sRequestItemEntity.currentStage = ShippingRequestProceedingEnum.OPEN;
    sRequestItemEntity.itemLevel = ShippingRequestItemLevelEnum.SET;
    sRequestItemEntity.l1 = l1;
    sRequestItemEntity.l2 = l2;
    sRequestItemEntity.l3 = l3;
    sRequestItemEntity.l4 = l4;
    sRequestItemEntity.l5 = l5;
    return sRequestItemEntity;
  }

  // HELPER
  getSRequestProceedingEntity(sRequestId: number, remarks: string, companyCode: string, unitCode: string, username: string, status: ShippingRequestProceedingEnum) {
    const proceedingEntity = new SRequestProceedingEntity();
    proceedingEntity.sRequestId = sRequestId;
    proceedingEntity.currentStage = status;
    proceedingEntity.spoc = '';
    proceedingEntity.remarks = remarks;
    proceedingEntity.companyCode = companyCode;
    proceedingEntity.unitCode = unitCode;
    proceedingEntity.createdUser = username;
    return proceedingEntity;
  }

  //ENDPOINT
  async deleteVendorInfoForShippingRequest(req: ShippingRequestIdRequest): Promise<GlobalResponseObject> {
    const transManager = new GenericTransactionManager(this.dataSource);
    try {
      if (!req?.srIds?.length) {
        throw new ErrorResponse(41108, 'Please provide the shipping request id');
      }
      const { companyCode, unitCode } = req;
      const srRecs = await this.sRequestRepository.find({ where: { companyCode: companyCode, unitCode: unitCode, id: In(req.srIds)}});
      const isApproved = srRecs.some(
        (sProceeding) => sProceeding.currentStage === ShippingRequestProceedingEnum.APPROVED
      );
      if (isApproved) {
        throw new ErrorResponse(41109, `Some Shipping requests already been approved. No changes can be made`);
      }
      await transManager.startTransaction();
      const vendorIdRec = await this.sRequestVendorRepository.findOne({ select: ['id'], where: { sRequestId: In(req.srIds), companyCode: companyCode, unitCode: unitCode, isActive: true } });
      if (!vendorIdRec) {
        throw new ErrorResponse(41110, `Shipping  vendor id not found`);
      }
      await transManager.getRepository(SRequestVendorEntity).delete({ sRequestId: In(req.srIds), companyCode: companyCode, unitCode: unitCode });
      await transManager.completeTransaction();
      return new GlobalResponseObject(true, 41111, 'Shipping vendor id deleted successfully');
    } catch (error) {
      await transManager.releaseTransaction();
      throw error;
    }
  }

  //END POINT
  async saveVendorInfoForShippingRequest(req: ShippingRequestVendorRequest): Promise<GlobalResponseObject> {
    const transManager = new GenericTransactionManager(this.dataSource);
    try {
      await transManager.startTransaction();
      if (!req.vendorId) {
        throw new ErrorResponse(41112, 'Shipping vendor id not provided');
      }
      const { companyCode, unitCode } = req;
      const srRec = await this.sRequestRepository.findOne({ where: { companyCode: companyCode, unitCode: unitCode, id: req.sRequestId}});
      if(!srRec) {
        throw new ErrorResponse(41113, 'Shipping request does not exist');
      }
      if(srRec.currentStage == ShippingRequestProceedingEnum.APPROVED) {
        throw new ErrorResponse(41109, `Some Shipping requests already been approved. No changes can be made`);
      }
      const srVendorRec = await this.sRequestVendorRepository.findOne({ select: ['id'], where: { sRequestId: req.sRequestId, vendorId: req.vendorId, companyCode: req.companyCode, unitCode: req.unitCode, isActive: true } });
      if (srVendorRec) {
        // de activate the old record
        await transManager.getRepository(SRequestVendorEntity).update({ sRequestId: req.sRequestId, companyCode: companyCode, unitCode: unitCode}, { isActive: false });
      }
      const sRequestVendorEntity = new SRequestVendorEntity();
      sRequestVendorEntity.sRequestId = req.sRequestId;
      sRequestVendorEntity.vendorId = req.vendorId;
      sRequestVendorEntity.plannedDispatchDate = req.plannedDispatchDate;
      sRequestVendorEntity.remarks = req.remarks;
      sRequestVendorEntity.companyCode = req.companyCode;
      sRequestVendorEntity.unitCode = req.unitCode;
      sRequestVendorEntity.createdUser = req.username;
      await transManager.getRepository(SRequestVendorEntity).save(sRequestVendorEntity);
      await transManager.completeTransaction();
      return new GlobalResponseObject(true, 41115, 'Vendor Details Updated Successfully');
    } catch (error) {
      await transManager.releaseTransaction();
      throw error;
    }
  }

  //ENDPOINT
  async deleteTruckForShippingRequest(req: ShippingRequestTruckIdRequest): Promise<GlobalResponseObject> {
    const transManager = new GenericTransactionManager(this.dataSource);
    try {
      if (!req?.truckIds?.length) {
        throw new ErrorResponse(41116, 'Please provide the truck id');
      }
      const { companyCode, unitCode } = req;
      await transManager.startTransaction();
      const truckIdRec = await this.sRequestTruckRepository.findOne({ select: ['sRequestId', 'id'], where: { id: In(req.truckIds), sRequestId: req.sRequestId, companyCode: companyCode, unitCode: unitCode, isActive: true } });
      if (!truckIdRec) {
        throw new ErrorResponse(41117, `Truck id not found`);
      }
      // const sRequestItemTruckMap = await this.sRequestItemTruckMapRepository.find({ where: { sRequestTruckId: truckIdRec.id } })
      // if (sRequestItemTruckMap.length > 0) {
      //   throw new ErrorResponse(0, `Truck id is already mapped with item`);
      // }
      await transManager.getRepository(SRequestTruckEntity).delete({ id: In(req.truckIds), companyCode: companyCode, unitCode: unitCode });
      await transManager.completeTransaction();
      return new GlobalResponseObject(true, 41118, 'truck id deleted successfully');
    } catch (error) {
      await transManager.releaseTransaction();
      throw error;
    }
  }

  //ENDPOINT
  async saveTruckInfoForShippingRequest(req: ShippingRequestTruckRequest[]): Promise<GlobalResponseObject> {
    // console.log(req, "++++++++")
    const transManager = new GenericTransactionManager(this.dataSource);
    try {
      await transManager.startTransaction();
      const sRequestTruckEntityData: SRequestTruckEntity[] = [];
      for (const rec of req) {
        if (!rec.sRequestId) {
          throw new ErrorResponse(41074, 'Shipping request id not provided');
        }
        const srRec = await this.sRequestRepository.findOne({ select: ['id'], where: { id: rec.sRequestId, companyCode: rec.companyCode, unitCode: rec.unitCode, isActive: true } });
        if (!srRec) {
          throw new ErrorResponse(41092, 'Shipping request not found for id : ' + rec.sRequestId);
        }
        // check for truck num duplicates
        const sRequestTruckEntity = this.getSRequestTruckEntity(rec.sRequestId, rec.contact, rec.truckNo, rec.truckType, rec.remarks, rec.inAt, rec.outAt, rec.driverName, rec.licenseNo, rec.companyCode, rec.unitCode, rec.username);
        sRequestTruckEntityData.push(sRequestTruckEntity);
      }
      await transManager.getRepository(SRequestTruckEntity).save(sRequestTruckEntityData);
      await transManager.completeTransaction();
      return new GlobalResponseObject(true, 41119, 'Created Successfully');
    } catch (error) {
      await transManager.releaseTransaction();
      throw error;
    }
  }

  //HELPER
  getSRequestTruckEntity(sRequestId: number, contact: string, truckNo: string, truckType: TruckTypeEnum, remarks: string, inAt: string, outAt: string, driverName: string, licenseNumber: string, companyCode: string, unitCode: string, username: string) {
    const sRequestTruckEntity = new SRequestTruckEntity();
    sRequestTruckEntity.sRequestId = sRequestId;
    sRequestTruckEntity.contact = contact;
    sRequestTruckEntity.truckNo = truckNo;
    sRequestTruckEntity.truckType = truckType;
    sRequestTruckEntity.driverName = driverName;
    sRequestTruckEntity.licenseNumber = licenseNumber;
    sRequestTruckEntity.inAt = inAt;
    sRequestTruckEntity.outAt = '';
    sRequestTruckEntity.remarks = remarks;
    sRequestTruckEntity.unitCode = unitCode;
    sRequestTruckEntity.companyCode = companyCode;
    sRequestTruckEntity.createdUser = username;
    return sRequestTruckEntity;
  }

  //ENDPOINT
  async deleteShippingRequest(req: ShippingRequestIdRequest): Promise<GlobalResponseObject> {
    const transManager = new GenericTransactionManager(this.dataSource);
    try {
      if (!req.srIds?.length) {
        throw new ErrorResponse(41108, 'Please provide the shipping request id');
      }
      const { companyCode, unitCode } = req;

      // for (const id of req.srId) {
      // const sReqID = await this.sRequestRepository.findOne({ select: ['id'], where: { id: id } });
      const sReqProceedingId = await this.sRequestProceedingRepository.find({ select: ['sRequestId', 'currentStage'], where: { sRequestId: In(req.srIds), companyCode: companyCode, unitCode: unitCode, isActive: true }, });
      if (!sReqProceedingId.length) {
        throw new ErrorResponse(41121, `Shipping requests not found`);
      }
      const isApproved = sReqProceedingId.some(
        (sProceeding) => sProceeding.currentStage === ShippingRequestProceedingEnum.APPROVED
      );
      if (isApproved) {
        throw new ErrorResponse(41109, `Some Shipping requests already been approved and cannot be deleted`);
      }

      await transManager.startTransaction();
      await transManager.getRepository(SRequestProceedingEntity).delete({ sRequestId: In(req.srIds), companyCode: companyCode, unitCode: unitCode });
      // const sReqItems = await this.sRequestItemRepository.find({ select: ['id'], where: { sRequestId: In(req.srId) } })
      // const itemId = sReqItems.map((reqItem) => reqItem.id)
      await transManager.getRepository(SRequestItemAttrEntity).delete({ sRequestId: In(req.srIds), companyCode: companyCode, unitCode: unitCode });
      await transManager.getRepository(SRequestVendorEntity).delete({ sRequestId: In(req.srIds), companyCode: companyCode, unitCode: unitCode });
      await transManager.getRepository(SRequestTruckEntity).delete({ sRequestId: In(req.srIds), companyCode: companyCode, unitCode: unitCode });
      await transManager.getRepository(SRequestItemEntity).delete({ sRequestId: In(req.srIds), companyCode: companyCode, unitCode: unitCode });
      await transManager.getRepository(SRequestEntity).delete({ id: In(req.srIds), companyCode: companyCode, unitCode: unitCode });
      // }
      await transManager.completeTransaction();
      return new GlobalResponseObject(true, 41123, 'Shipping request(s) deleted successfully');

    } catch (error) {
      await transManager.releaseTransaction();
      throw error;
    }
  }

  //ENDPOINT
  async approveShippingRequest(req: ShippingRequestIdRequest): Promise<GlobalResponseObject> {
    const transManager = new GenericTransactionManager(this.dataSource);
    try {
      const { companyCode, unitCode, username } = req;
      const srId = req?.srIds[0];
      if (!srId) {
        throw new ErrorResponse(41074, 'Shipping request id not provided');
      }
      const sReqPreceding = await this.sRequestProceedingRepository.findOne({ where: { sRequestId: srId, companyCode: companyCode, unitCode: unitCode, isActive: true } });
      if (!sReqPreceding) {
        throw new ErrorResponse(41124, `shipping set with ID: ${srId} does not exist.`);
      }
      if (sReqPreceding.currentStage !== ShippingRequestProceedingEnum.OPEN) {
        throw new ErrorResponse(41083, `shipping with ID: ${srId} is not open.`);
      }
      // check if the vendor info is updated
      const vendorInfoRec = await this.sRequestVendorRepository.findOne({ select: ['id'], where: { companyCode: companyCode, unitCode: unitCode, isActive: true, sRequestId: srId}});
      if(!vendorInfoRec) {
        throw new ErrorResponse(41125, 'Vendor info is not updated. Update before approving')
      }
      await transManager.startTransaction();
      await transManager.getRepository(SRequestProceedingEntity).update({ sRequestId: srId, companyCode: companyCode, unitCode: unitCode }, { isActive: false });
      const proceedingEntity = this.getSRequestProceedingEntity(srId, req.remarks, companyCode, unitCode, username, ShippingRequestProceedingEnum.APPROVED);
      await transManager.getRepository(SRequestProceedingEntity).save(proceedingEntity);
      await transManager.getRepository(SRequestEntity).update({ id: srId, companyCode: companyCode, unitCode: unitCode }, { currentStage: ShippingRequestProceedingEnum.APPROVED });
      await transManager.getRepository(SRequestItemEntity).update({ id: srId, companyCode: companyCode, unitCode: unitCode }, { currentStage: ShippingRequestProceedingEnum.APPROVED });
      await transManager.completeTransaction();
      return new GlobalResponseObject(true, 922, 'Updated Successfully');
    } catch (error) {
      await transManager.releaseTransaction();
      throw error;
    }
  }

  //ENDPOINT
  async rejectShippingRequest(req: ShippingRequestIdRequest): Promise<GlobalResponseObject> {
    const transManager = new GenericTransactionManager(this.dataSource);
    try {
      await transManager.startTransaction();
      const { companyCode, unitCode, username } = req;
      const srId = req?.srIds[0];
      if (!srId) {
        throw new ErrorResponse(41074, 'Shipping request id not provided');
      }
      const sReqPreceding = await this.sRequestProceedingRepository.findOne({ where: { sRequestId: srId, companyCode, unitCode, isActive: true } });
      if (!sReqPreceding) {
        throw new ErrorResponse(41126, `shipping with ID: ${srId} does not exist.`);
      }
      if (sReqPreceding.currentStage !== ShippingRequestProceedingEnum.OPEN) {
        throw new ErrorResponse(41083, `shipping with ID: ${srId} is not open.`);
      }
      await transManager.getRepository(SRequestProceedingEntity).update({ sRequestId: srId, companyCode: companyCode, unitCode: unitCode }, { isActive: false });
      const proceedingEntity = this.getSRequestProceedingEntity(srId, req.remarks, companyCode, unitCode, username, ShippingRequestProceedingEnum.REJECTED);
      await transManager.getRepository(SRequestEntity).update({ id: srId, companyCode: companyCode, unitCode: unitCode }, { currentStage: ShippingRequestProceedingEnum.REJECTED });
      await transManager.getRepository(SRequestItemEntity).update({ id: srId, companyCode: companyCode, unitCode: unitCode }, { currentStage: ShippingRequestProceedingEnum.REJECTED });
      await transManager.getRepository(SRequestProceedingEntity).save(proceedingEntity);
      await transManager.completeTransaction();
      return new GlobalResponseObject(true, 922, 'Updated Successfully');
    } catch (error) {
      await transManager.releaseTransaction();
      throw error;
    }
  }

  //ENDPOINT
  async deleteItemFromShippingRequest(req: ShippingRequestItemIdRequest): Promise<GlobalResponseObject> {
    return null;
  }

  // ENDPOINT
  async checkoutShippingRequest(req: ShippingRequestCheckoutRequest): Promise<GlobalResponseObject> {
    const transManager = new GenericTransactionManager(this.dataSource);
    try {
      const { companyCode, unitCode } = req;
      if (!req.srId) {
        throw new ErrorResponse(41090, "Please provide shipping request id");
      }
      if(!req.truckOutTimes.length) {
        throw new ErrorResponse(41127, "Please provide the out time of the trucks");
      }

      const sRequestRec = await this.sRequestRepository.findOne({ select: ['id'], where: { id: req.srId, companyCode: req.companyCode, unitCode: req.unitCode } });
      if (!sRequestRec) {
        throw new ErrorResponse(41092, "Shipping request not found");
      }
      if(sRequestRec.currentStage == ShippingRequestProceedingEnum.DISPATCHED) {
        throw new ErrorResponse(41100, 'Shipping request is already dispatched');
      }
      const trucksForSr = await this.sRequestTruckRepository.find({ where: { sRequestId: req.srId, companyCode: companyCode, unitCode: unitCode }});
      if (trucksForSr.length == 0) {
        throw new ErrorResponse(41128, 'Trucks were not mapped for the shipping request');
      }
      
      // check if all the bundles are put into the bags for the current shipping request
      const shippingReqItems = await this.sRequestItemRepository.find({select:['refId'], where: { companyCode: companyCode, unitCode: unitCode, sRequestId: req.srId  }});
      const dSetIds = shippingReqItems.map(r => r.refId);
      const totalPutInBagItems = await this.shippingRequestHelperService.getPendingToPutInBagItemsCountForDsetIds(dSetIds, companyCode, unitCode);
      const totalSubItemsForSr = await this.shippingRequestHelperService.getTotalSubItemsCountForDSetIds(dSetIds, companyCode, unitCode);
      if(totalSubItemsForSr > totalPutInBagItems) {
        throw new ErrorResponse(41129, `Total shipping sub items : ${totalSubItemsForSr}. Only ${totalPutInBagItems} are put into bags. Please put all the pending items into bag before checkout`);
      }
      // update the shipping status for the truck
      await transManager.startTransaction();
      for(const truck of req.truckOutTimes) {
        await transManager.getRepository(SRequestTruckEntity).update({ sRequestId: req.srId, id: truck.truckId, companyCode: companyCode, unitCode: unitCode}, { outAt: truck.checkoutDateTime, remarks: truck.remarks });
      }
      // if all the trucks are out then finally move the shipping request status to dispatched
      const pendingOutTrucks = await transManager.getRepository(SRequestTruckEntity).findOne({ where: { sRequestId: req.srId, outAt: '' }});
      if(!pendingOutTrucks) {
        await transManager.getRepository(SRequestEntity).update({ id: req.srId, companyCode: companyCode, unitCode: unitCode }, { currentStage: ShippingRequestProceedingEnum.DISPATCHED });
        await transManager.getRepository(SRequestItemEntity).update({ id: req.srId, companyCode: companyCode, unitCode: unitCode }, { currentStage: ShippingRequestProceedingEnum.DISPATCHED });
        await transManager.getRepository(SRequestProceedingEntity).update({ sRequestId: req.srId, companyCode: companyCode, unitCode: unitCode }, { isActive: false });
        const proceedingEntity = this.getSRequestProceedingEntity(req.srId, req.remarks, companyCode, unitCode, req.username, ShippingRequestProceedingEnum.DISPATCHED);
        await transManager.getRepository(SRequestProceedingEntity).save(proceedingEntity);
      }
      await transManager.completeTransaction();
      return new GlobalResponseObject(true, 41130, "Shipping request dispatched successfully");
    } catch (error) {
      await transManager.releaseTransaction();
      throw error;
    }
  }
}