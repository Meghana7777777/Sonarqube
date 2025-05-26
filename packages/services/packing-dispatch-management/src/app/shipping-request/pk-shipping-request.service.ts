import { Injectable } from "@nestjs/common"; import { DataSource, In } from "typeorm";
import moment = require("moment");
import { PkDSetIdsRequest, GlobalResponseObject, PkShippingRequestCheckoutRequest, PkShippingRequestIdRequest, PkShippingRequestItemIdRequest, PkShippingRequestItemLevelEnum, PkShippingRequestProceedingEnum, PkShippingRequestStageEnum, PkShippingRequestTruckIdRequest, PkShippingRequestTruckRequest, PkShippingRequestVendorRequest, PkTruckTypeEnum, PKMSPackListIdReqDto, CommonResponse } from "@xpparel/shared-models";
import { SRequestRepository } from "./repository/s-request-repository";
import { ErrorResponse } from "@xpparel/backend-utils";
import { GenericTransactionManager } from "../../database/typeorm-transactions";
import { SRequestEntity } from "./entites/s-request.entity";
import { SRequestItemEntity } from "./entites/s-request-item.entity";
import { SRequestProceedingEntity } from "./entites/s-request-proceeding.entity";
import { SRequestTruckEntity } from "./entites/s-request-truck.entity";
import { PkShippingRequestHelperService } from "./pk-shipping-request-helper.service";
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
import { DSetItemEntity } from "../dispatch-set/entity/d-set-item.entity";


@Injectable()
export class PkShippingRequestService {
  constructor(
    private dataSource: DataSource,
    private sRequestRepository: SRequestRepository,
    private shippingRequestHelperService: PkShippingRequestHelperService,
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
  async createShippingRequest(req: PkDSetIdsRequest): Promise<GlobalResponseObject> {
    const transManager = new GenericTransactionManager(this.dataSource);
    try {
      if (!req.dSetPks?.length) {
        throw new ErrorResponse(41058, 'IDs must be provided');
      }
      const dSetIdSet = new Set<number>(req.dSetPks);
      const { companyCode, unitCode, username } = req;
      const dSetPks = Array.from(dSetIdSet);
      // Fetch DSetRecords 
      const dSetRecords = await this.shippingRequestHelperService.getDSetRecordsByDSetIds(
        dSetPks, companyCode, unitCode
      );
      if (dSetPks.length !== dSetRecords.length) {
        throw new ErrorResponse(41059, 'Few records do not exist. Refresh the page and try again');
      }
      // also check for any dset id is the shipping req already created. If mo then throw an error
      const srItemRec = await this.sRequestItemRepository.findOne({ select: ['id'], where: { companyCode: companyCode, unitCode: unitCode, refId: In(dSetPks), isActive: true } });
      if (srItemRec) {
        throw new ErrorResponse(41060, 'Shipping request is already created for some of the items');
      }
      await transManager.startTransaction();
      // requestNo not in req
      const sRequestEntity = this.getSRequestEntity(req.remarks, companyCode, unitCode, username, PkShippingRequestProceedingEnum.OPEN);
      const savedSRequest = await transManager.getRepository(SRequestEntity).save(sRequestEntity);

      for (const dSetRecord of dSetRecords) {
        const sRequestItemEntity = this.getSRequestItemEntity(savedSRequest.id, dSetRecord.id, dSetRecord.l1, dSetRecord.l2, dSetRecord.l3, dSetRecord.l4, dSetRecord.setNo, companyCode, unitCode, username);
        const savedSrItem = await transManager.getRepository(SRequestItemEntity).save(sRequestItemEntity);

        const dSetItemAttrs = await this.shippingRequestHelperService.getDSetItemAttrRecordsByDSetId(dSetRecord.id, companyCode, unitCode);
        const dSetItemRecs = await this.shippingRequestHelperService.getDSetItemRecordsByDSetId(dSetRecord.id, companyCode, unitCode);
        if (dSetItemRecs.length <= 0) {
          throw new ErrorResponse(41061, 'Dispatch sub items not found for the dispatch id : ' + dSetRecord.id);
        }
        const delDates = new Set<string>();
        const destinations = new Set<string>();
        const buyers = new Set<string>();
        const styles = new Set<string>();
        const coNos = new Set<string>();
        let totalCartons = 0;
        let totalFgs = 0;
        dSetItemAttrs.forEach(r => {
          r.l2?.split(',')?.forEach(s => { styles.add(s); });
          r.lm4?.split(',')?.forEach(b => { buyers.add(b); });
          r.lm2?.split(',')?.forEach(d => { delDates.add(d); });
          r.lm3?.split(',')?.forEach(d => { destinations.add(d); });
          r.l3?.split(',')?.forEach(c => { coNos.add(c); });
        });
        dSetItemRecs.forEach(r => {
          totalFgs += Number(r.itemQuantity);
          totalCartons += Number(r.subItemsCount);
        })
        const srItemAttrEnt = new SRequestItemAttrEntity();
        srItemAttrEnt.companyCode = companyCode;
        srItemAttrEnt.unitCode = unitCode;
        srItemAttrEnt.sRequestId = savedSRequest.id;
        srItemAttrEnt.sRequestItemId = savedSrItem.id;
        srItemAttrEnt.li1 = totalCartons;// total cartons
        srItemAttrEnt.li2 = totalFgs;// total FGs
        srItemAttrEnt.l1 = dSetRecord.l2; // mo number
        srItemAttrEnt.l2 = dSetRecord.l3; // vpo
        srItemAttrEnt.l3 = Array.from(coNos)?.toString(); // co number
        srItemAttrEnt.lm1 = Array.from(delDates)?.toString(); // del dates
        srItemAttrEnt.lm2 = Array.from(destinations).toString(); // destinations
        srItemAttrEnt.lm3 = Array.from(buyers).toString(); // buyers
        srItemAttrEnt.lt1 = Array.from(styles).toString(); // ext styles
        // save the s request item attrs entity
        await transManager.getRepository(SRequestItemAttrEntity).save(srItemAttrEnt, { reload: false });
      }

      // save the Proceeding entity
      const proceedingEntity = this.getSRequestProceedingEntity(savedSRequest.id, req.remarks, companyCode, unitCode, username, PkShippingRequestProceedingEnum.OPEN);
      await transManager.getRepository(SRequestProceedingEntity).save(proceedingEntity, { reload: false });
      await transManager.completeTransaction();
      await this.shippingRequestHelperService.sendSrDataToGatePass(savedSRequest.id, companyCode, unitCode);
      return new GlobalResponseObject(true, 41062, 'Shipping  Created Successfully');
    } catch (error) {
      await transManager.releaseTransaction();
      throw error;
    }
  }

  // HELPER
  getSRequestEntity(remarks: string, companyCode: string, unitCode: string, username: string, status: PkShippingRequestProceedingEnum): SRequestEntity {
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
    sRequestItemEntity.currentStage = PkShippingRequestProceedingEnum.OPEN;
    sRequestItemEntity.itemLevel = PkShippingRequestItemLevelEnum.SET;
    sRequestItemEntity.l1 = l1; // PK of pack order
    sRequestItemEntity.l2 = l2; // MO
    sRequestItemEntity.l3 = l3; // VPO
    sRequestItemEntity.l4 = l4; // MO ID 
    sRequestItemEntity.l5 = l5; // DR req no
    return sRequestItemEntity;
  }

  // HELPER
  getSRequestProceedingEntity(sRequestId: number, remarks: string, companyCode: string, unitCode: string, username: string, status: PkShippingRequestProceedingEnum) {
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
  async deleteVendorInfoForShippingRequest(req: PkShippingRequestIdRequest): Promise<GlobalResponseObject> {
    const transManager = new GenericTransactionManager(this.dataSource);
    try {
      if (!req?.srIds?.length) {
        throw new ErrorResponse(41063, 'Please provide the shipping request id');
      }
      const { companyCode, unitCode } = req;
      const srRecs = await this.sRequestRepository.find({ where: { companyCode: companyCode, unitCode: unitCode, id: In(req.srIds) } });
      const isApproved = srRecs.some(
        (sProceeding) => sProceeding.currentStage === PkShippingRequestProceedingEnum.APPROVED
      );
      if (isApproved) {
        throw new ErrorResponse(41064, `Some Shipping requests already been approved. No changes can be made`);
      }
      await transManager.startTransaction();
      const vendorIdRec = await this.sRequestVendorRepository.findOne({ select: ['id'], where: { sRequestId: In(req.srIds), companyCode: companyCode, unitCode: unitCode, isActive: true } });
      if (!vendorIdRec) {
        throw new ErrorResponse(41065, `Shipping  vendor id not found`);
      }
      await transManager.getRepository(SRequestVendorEntity).delete({ sRequestId: In(req.srIds), companyCode: companyCode, unitCode: unitCode });
      await transManager.completeTransaction();
      return new GlobalResponseObject(true, 41066, 'Shipping vendor id deleted successfully');
    } catch (error) {
      await transManager.releaseTransaction();
      throw error;
    }
  }

  //END POINT
  async saveVendorInfoForShippingRequest(req: PkShippingRequestVendorRequest): Promise<GlobalResponseObject> {
    const transManager = new GenericTransactionManager(this.dataSource);
    try {
      await transManager.startTransaction();
      if (!req.vendorId) {
        throw new ErrorResponse(41067, 'Shipping vendor id not provided');
      }
      const { companyCode, unitCode } = req;
      const srRec = await this.sRequestRepository.findOne({ where: { companyCode: companyCode, unitCode: unitCode, id: req.sRequestId } });
      if (!srRec) {
        throw new ErrorResponse(41068, 'Shipping request does not exist');
      }
      if (srRec.currentStage == PkShippingRequestProceedingEnum.APPROVED) {
        throw new ErrorResponse(41069, `Some Shipping requests already been approved. No changes can be made`);
      }
      const srVendorRec = await this.sRequestVendorRepository.findOne({ select: ['id'], where: { sRequestId: req.sRequestId, vendorId: req.vendorId, companyCode: req.companyCode, unitCode: req.unitCode, isActive: true } });
      //  if (srVendorRec) {
      //   // de activate the old record
      //   await transManager.getRepository(SRequestVendorEntity).update({ sRequestId: req.sRequestId, companyCode: companyCode, unitCode: unitCode }, { isActive: false });
      // }
      if (srVendorRec) {
        // Update the existing vendor record
        await transManager.getRepository(SRequestVendorEntity).update( { id: srVendorRec.id },{ vendorId: req.vendorId, plannedDispatchDate: req.plannedDispatchDate, remarks: req.remarks,updatedAt: new Date()});
      }
      else {
        const sRequestVendorEntity = new SRequestVendorEntity();
        sRequestVendorEntity.sRequestId = req.sRequestId;
        sRequestVendorEntity.vendorId = req.vendorId;
        sRequestVendorEntity.plannedDispatchDate = req.plannedDispatchDate;
        sRequestVendorEntity.remarks = req.remarks;
        sRequestVendorEntity.companyCode = req.companyCode;
        sRequestVendorEntity.unitCode = req.unitCode;
        sRequestVendorEntity.createdUser = req.username;
        await transManager.getRepository(SRequestVendorEntity).save(sRequestVendorEntity)
      }
      await transManager.completeTransaction();
      return new GlobalResponseObject(true, 41070, 'Vendor Details Updated Successfully');
    } catch (error) {
      await transManager.releaseTransaction();
      throw error;
    }
  }

  //ENDPOINT
  async deleteTruckForShippingRequest(req: PkShippingRequestTruckIdRequest): Promise<GlobalResponseObject> {
    const transManager = new GenericTransactionManager(this.dataSource);
    try {
      if (!req?.truckIds?.length) {
        throw new ErrorResponse(41071, 'Please provide the truck id');
      }
      const { companyCode, unitCode } = req;
      await transManager.startTransaction();
      const truckIdRec = await this.sRequestTruckRepository.findOne({ select: ['sRequestId', 'id'], where: { id: In(req.truckIds), sRequestId: req.sRequestId, companyCode: companyCode, unitCode: unitCode, isActive: true } });
      if (!truckIdRec) {
        throw new ErrorResponse(41072, `Truck id not found`);
      }
      // const sRequestItemTruckMap = await this.sRequestItemTruckMapRepository.find({ where: { sRequestTruckId: truckIdRec.id } })
      // if (sRequestItemTruckMap.length > 0) {
      //   throw new ErrorResponse(0, `Truck id is already mapped with item`);
      // }
      await transManager.getRepository(SRequestTruckEntity).delete({ id: In(req.truckIds), companyCode: companyCode, unitCode: unitCode });
      await transManager.completeTransaction();
      return new GlobalResponseObject(true, 41073, 'truck id deleted successfully');
    } catch (error) {
      await transManager.releaseTransaction();
      throw error;
    }
  }

  //ENDPOINT
  async saveTruckInfoForShippingRequest(req: PkShippingRequestTruckRequest[]): Promise<GlobalResponseObject> {
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
      return new GlobalResponseObject(true, 41076, 'Truck Info Updated Successfully');
    } catch (error) {
      await transManager.releaseTransaction();
      throw error;
    }
  }

  //HELPER
  getSRequestTruckEntity(sRequestId: number, contact: string, truckNo: string, truckType: PkTruckTypeEnum, remarks: string, inAt: string, outAt: string, driverName: string, licenseNumber: string, companyCode: string, unitCode: string, username: string) {
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
  async deleteShippingRequest(req: PkShippingRequestIdRequest): Promise<GlobalResponseObject> {
    const transManager = new GenericTransactionManager(this.dataSource);
    try {
      if (!req.srIds?.length) {
        throw new ErrorResponse(41077, 'Please provide the shipping request id');
      }
      const { companyCode, unitCode } = req;

      // for (const id of req.srId) {
      // const sReqID = await this.sRequestRepository.findOne({ select: ['id'], where: { id: id } });
      const sReqProceedingId = await this.sRequestProceedingRepository.find({ select: ['sRequestId', 'currentStage'], where: { sRequestId: In(req.srIds), companyCode: companyCode, unitCode: unitCode, isActive: true }, });
      if (!sReqProceedingId.length) {
        throw new ErrorResponse(41078, `Shipping requests not found`);
      }
      const isApproved = sReqProceedingId.some(
        (sProceeding) => sProceeding.currentStage === PkShippingRequestProceedingEnum.APPROVED
      );
      if (isApproved) {
        throw new ErrorResponse(41079, `Some Shipping requests already been approved and cannot be deleted`);
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
      return new GlobalResponseObject(true, 41080, 'Shipping request(s) deleted successfully');

    } catch (error) {
      await transManager.releaseTransaction();
      throw error;
    }
  }

  //ENDPOINT
  async approveShippingRequest(req: PkShippingRequestIdRequest): Promise<GlobalResponseObject> {
    const transManager = new GenericTransactionManager(this.dataSource);
    try {
      const { companyCode, unitCode, username } = req;
      const srId = req?.srIds[0];
      if (!srId) {
        throw new ErrorResponse(41074, 'Shipping request id not provided');
      }
      const sReqPreceding = await this.sRequestProceedingRepository.findOne({ where: { sRequestId: srId, companyCode: companyCode, unitCode: unitCode, isActive: true } });
      if (!sReqPreceding) {
        throw new ErrorResponse(41082, `shipping set with ID: ${srId} does not exist.`);
      }
      if (sReqPreceding.currentStage !== PkShippingRequestProceedingEnum.OPEN) {
        throw new ErrorResponse(41083, `shipping with ID: ${srId} is not open.`);
      }
      // check if the vendor info is updated
      const vendorInfoRec = await this.sRequestVendorRepository.findOne({ select: ['id'], where: { companyCode: companyCode, unitCode: unitCode, isActive: true, sRequestId: srId } });
      if (!vendorInfoRec) {
        throw new ErrorResponse(41084, 'Vendor info is not updated. Update before approving')
      }
      await transManager.startTransaction();
      await transManager.getRepository(SRequestProceedingEntity).update({ sRequestId: srId, companyCode: companyCode, unitCode: unitCode }, { isActive: false });
      const proceedingEntity = this.getSRequestProceedingEntity(srId, req.remarks, companyCode, unitCode, username, PkShippingRequestProceedingEnum.APPROVED);
      await transManager.getRepository(SRequestProceedingEntity).save(proceedingEntity);
      await transManager.getRepository(SRequestEntity).update({ id: srId, companyCode: companyCode, unitCode: unitCode }, { currentStage: PkShippingRequestProceedingEnum.APPROVED });
      await transManager.getRepository(SRequestItemEntity).update({ id: srId, companyCode: companyCode, unitCode: unitCode }, { currentStage: PkShippingRequestProceedingEnum.APPROVED });
      await transManager.completeTransaction();
      return new GlobalResponseObject(true, 41085, 'Updated Successfully');
    } catch (error) {
      await transManager.releaseTransaction();
      throw error;
    }
  }

  //ENDPOINT
  async rejectShippingRequest(req: PkShippingRequestIdRequest): Promise<GlobalResponseObject> {
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
        throw new ErrorResponse(41087, `shipping with ID: ${srId} does not exist.`);
      }
      if (sReqPreceding.currentStage !== PkShippingRequestProceedingEnum.OPEN) {
        throw new ErrorResponse(41088, `shipping with ID: ${srId} is not open.`);
      }
      await transManager.getRepository(SRequestProceedingEntity).update({ sRequestId: srId, companyCode: companyCode, unitCode: unitCode }, { isActive: false });
      const proceedingEntity = this.getSRequestProceedingEntity(srId, req.remarks, companyCode, unitCode, username, PkShippingRequestProceedingEnum.REJECTED);
      await transManager.getRepository(SRequestEntity).update({ id: srId, companyCode: companyCode, unitCode: unitCode }, { currentStage: PkShippingRequestProceedingEnum.REJECTED });
      await transManager.getRepository(SRequestItemEntity).update({ id: srId, companyCode: companyCode, unitCode: unitCode }, { currentStage: PkShippingRequestProceedingEnum.REJECTED });
      await transManager.getRepository(SRequestProceedingEntity).save(proceedingEntity);
      await transManager.completeTransaction();
      return new GlobalResponseObject(true, 41089, 'Updated Successfully');
    } catch (error) {
      await transManager.releaseTransaction();
      throw error;
    }
  }

  //ENDPOINT
  async deleteItemFromShippingRequest(req: PkShippingRequestItemIdRequest): Promise<GlobalResponseObject> {
    return null;
  }

  // ENDPOINT
  async checkoutShippingRequest(req: PkShippingRequestCheckoutRequest): Promise<GlobalResponseObject> {
    const transManager = new GenericTransactionManager(this.dataSource);
    try {
      const { companyCode, unitCode } = req;
      if (!req.srId) {
        throw new ErrorResponse(41090, "Please provide shipping request id");
      }
      if (!req.truckOutTimes.length) {
        throw new ErrorResponse(41091, "Please provide the out time of the trucks");
      }

      const sRequestRec = await this.sRequestRepository.findOne({ select: ['id'], where: { id: req.srId, companyCode: req.companyCode, unitCode: req.unitCode } });
      if (!sRequestRec) {
        throw new ErrorResponse(41092, "Shipping request not found");
      }
      if (sRequestRec.currentStage == PkShippingRequestProceedingEnum.DISPATCHED) {
        throw new ErrorResponse(41100, 'Shipping request is already dispatched');
      }
      const trucksForSr = await this.sRequestTruckRepository.find({ where: { sRequestId: req.srId, companyCode: companyCode, unitCode: unitCode } });
      if (trucksForSr.length == 0) {
        throw new ErrorResponse(41094, 'Trucks were not mapped for the shipping request');
      }

      const shippingReqItems = await this.sRequestItemRepository.find({ select: ['sRequestId'], where: { companyCode, unitCode, sRequestId: req.srId } });
      const dSetIds = shippingReqItems.map(r => r.sRequestId);
      const totalSubItems = await this.shippingRequestHelperService.getTotalSubItemsCountForDSetIds(dSetIds, companyCode, unitCode);

      const trucks = await this.sRequestTruckRepository.find({ where: { sRequestId: req.srId, companyCode, unitCode } });
      const truckMappings = await this.sRequestItemTruckMapRepository.find({ where: { truckNo: In(trucks.map(t => t.truckNo)) }, select: ["refId"] });
      if (totalSubItems !== truckMappings.length) {
        throw new ErrorResponse(41101,
          `Mismatch detected: ${totalSubItems} sub-items expected, but ${truckMappings.length} items mapped to trucks`
        );
      }

      // check if all the bundles are put into the bags for the current shipping request
      // const shippingReqItems = await this.sRequestItemRepository.find({select:['refId'], where: { companyCode: companyCode, unitCode: unitCode, sRequestId: req.srId  }});
      // const dSetIds = shippingReqItems.map(r => r.refId);
      // const totalPutInBagItems = await this.shippingRequestHelperService.getPendingToPutInBagItemsCountForDsetIds(dSetIds, companyCode, unitCode);
      // const totalSubItemsForSr = await this.shippingRequestHelperService.getTotalSubItemsCountForDSetIds(dSetIds, companyCode, unitCode);
      // if(totalSubItemsForSr > totalPutInBagItems) {
      //   throw new ErrorResponse(0, `Total shipping sub items : ${totalSubItemsForSr}. Only ${totalPutInBagItems} are put into bags. Please put all the pending items into bag before checkout`);
      // }
      // update the shipping status for the truck
      await transManager.startTransaction();
      for (const truck of req.truckOutTimes) {
        await transManager.getRepository(SRequestTruckEntity).update({ sRequestId: req.srId, id: truck.truckId, companyCode: companyCode, unitCode: unitCode }, { outAt: truck.checkoutDateTime, remarks: truck.remarks });
      }
      // if all the trucks are out then finally move the shipping request status to dispatched
      const pendingOutTrucks = await transManager.getRepository(SRequestTruckEntity).findOne({ where: { sRequestId: req.srId, outAt: '' } });
      if (!pendingOutTrucks) {
        await transManager.getRepository(SRequestEntity).update({ id: req.srId, companyCode: companyCode, unitCode: unitCode }, { currentStage: PkShippingRequestProceedingEnum.DISPATCHED });
        await transManager.getRepository(SRequestItemEntity).update({ id: req.srId, companyCode: companyCode, unitCode: unitCode }, { currentStage: PkShippingRequestProceedingEnum.DISPATCHED });
        await transManager.getRepository(SRequestProceedingEntity).update({ sRequestId: req.srId, companyCode: companyCode, unitCode: unitCode }, { isActive: false });
        const proceedingEntity = this.getSRequestProceedingEntity(req.srId, req.remarks, companyCode, unitCode, req.username, PkShippingRequestProceedingEnum.DISPATCHED);
        await transManager.getRepository(SRequestProceedingEntity).save(proceedingEntity);
      }
      await transManager.completeTransaction();
      return new GlobalResponseObject(true, 41095, "Shipping request dispatched successfully");
    } catch (error) {
      await transManager.releaseTransaction();
      throw error;
    }
  }

  // ENDPOINT
  async validateCheckoutShippingRequest(req: PkShippingRequestIdRequest): Promise<GlobalResponseObject> {
    const srId = req.srIds[0];
    const { companyCode, unitCode } = req;
    if (!srId) {
      throw new ErrorResponse(41096, "Please provide shipping request id");
    }
    const sRequestRec = await this.sRequestRepository.findOne({ select: ['id'], where: { id: srId, companyCode: req.companyCode, unitCode: req.unitCode } });
    if (!sRequestRec) {
      throw new ErrorResponse(41092, "Shipping request not found");
    }
    const sReqPreceding = await this.sRequestProceedingRepository.findOne({ where: { sRequestId: srId, companyCode, unitCode, isActive: true } });
    if (!sReqPreceding) {
      throw new ErrorResponse(41098, `shipping proceeding with ID: ${srId} does not exist.`);
    }
    if (sReqPreceding.currentStage !== PkShippingRequestProceedingEnum.APPROVED) {
      throw new ErrorResponse(41099, `shipping with ID: ${srId} is not approved from the dispatch department.`);
    }
    if (sRequestRec.currentStage == PkShippingRequestProceedingEnum.DISPATCHED) {
      throw new ErrorResponse(41100, 'Shipping request is already dispatched');
    }
    const trucksForSr = await this.sRequestTruckRepository.find({ where: { sRequestId: srId, companyCode: companyCode, unitCode: unitCode } });
    if (trucksForSr.length == 0) {
      throw new ErrorResponse(41101, 'Trucks were not mapped for the shipping request');
    }
    return new GlobalResponseObject(true, 41102, "Shipping request can be dispatched");
  };


  async getShippingDispatchStatus(req: PKMSPackListIdReqDto): Promise<CommonResponse> {
    const userReq = { unitCode: req.unitCode, companyCode: req.companyCode }
    const dReqItemId = await this.dataSource.getRepository(DSetItemEntity).findOne({ select: ['id'], where: { deRefTable: 'pack_list', deRefId: String(req.packListId), ...userReq } });
    const sReqItem = await this.dataSource.getRepository(SRequestItemEntity).findOne({ select: ['createdAt', 'remarks'], where: { currentStage: PkShippingRequestProceedingEnum.DISPATCHED, itemLevel: PkShippingRequestItemLevelEnum.SET, refId: dReqItemId.id } })
    if (sReqItem) {
      return new CommonResponse(true, 967, 'Data Retrieved Successfully', { inTime: sReqItem.createdAt, remarks: sReqItem.remarks })
    } else {
      return new CommonResponse(false, 965, 'Data Not Found')
    }
  }

}