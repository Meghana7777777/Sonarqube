import { Injectable } from "@nestjs/common";
import { DataSource, In } from "typeorm";
import { SRequestItemRepository } from "./repository/s-request-item-repository";
import { SRequestItemTruckMapRepository } from "./repository/s-request-item-truck-map.repository";
import { SRequestProceedingRepository } from "./repository/s-request-proceeding-repository";
import { SRequestRepository } from "./repository/s-request-repository";
import { SRequestTruckRepository } from "./repository/s-request-truck-repository";
import { GlobalResponseObject, PkShippingRequestIdRequest, PkShippingReqesutItemAttrsModel, PkShippingReqesutItemModel, PkShippingRequestFilterRequest, PkShippingRequestItemLevelEnum, PkShippingRequestModel, PkShippingRequestResponse, PkShippingRequestTruckInfoModel, PkShippingRequestShippingInfoModel, PkDSetItemIdsRequest, PkShippingRequestItemIdRequest, PkAodAbstractResponse, PkAodAbstarctModel, PkShippingItemsAbstractModel, PkShippingDispatchRequest, PkShippingDispatchRequestModel, PkShippingDispatchResponse, PackListCartoonIDs, VendorDetailsReq, UpdateVendorResponseModel, VendorInfoByShippingReqIdModel } from "@xpparel/shared-models";
import { SRequestEntity } from "./entites/s-request.entity";
import { SRequestItemEntity } from "./entites/s-request-item.entity";
import { ErrorResponse } from "@xpparel/backend-utils";
import { SRequestItemAttrRepository } from "./repository/s-request-item-attr.repository";
import { SRequestVendorRepository } from "./repository/s-request-vendor.repository";
import { PkShippingRequestHelperService } from "./pk-shipping-request-helper.service";

@Injectable()
export class PkShippingRequestInfoService {
  constructor(
    private dataSource: DataSource,
    private sRequestItemRepository: SRequestItemRepository,
    private sRequestItemAttrRepository: SRequestItemAttrRepository,
    private sRequestItemTruckMapRepository: SRequestItemTruckMapRepository,
    private sRequestProceedingRepository: SRequestProceedingRepository,
    private sRequestRepository: SRequestRepository,
    private sRequestVendorRepository: SRequestVendorRepository,
    private sRequestTruckRepository: SRequestTruckRepository,
    private helperService: PkShippingRequestHelperService
  ) {

  }

  // ENDPOINT
  async getShippingRequestByIds(req: PkShippingRequestIdRequest): Promise<PkShippingRequestResponse> {
    if (!req?.srIds?.length) {
      throw new ErrorResponse(41043, 'Please provide the Shipping Request ids');
    }
    const { companyCode, unitCode } = req;
    const sReqRecs = await this.sRequestRepository.find({ select: ['id'], where: { companyCode: companyCode, unitCode: unitCode, id: In(req.srIds) } });
    if (sReqRecs.length == 0) {
      throw new ErrorResponse(41044, 'No Shipping Requests for the given criteria');
    }
    const ids = sReqRecs.map(r => r.id);
    const srModels = await this.getShippingRequestModels(ids, companyCode, unitCode, false, req.iNeedSrItemsAlso, req.iNeedSrItemsAttrAlso, req.iNeedVendorInfoAlso, req.iNeedTruckInfoAlso);
    return new PkShippingRequestResponse(true, 41056, 'Shipping info retrieved', srModels);
  }

  // ENDPOINT
  async getShippingRequestByFilterRequest(req: PkShippingRequestFilterRequest): Promise<PkShippingRequestResponse> {
    if (!req?.manufacturingOrderPks?.length) {
      throw new ErrorResponse(41045, 'Please provide the manufacturing orders');
    }
    const { companyCode, unitCode } = req;

    // get the sr ids based on the sr items using the mo_number
    const sReqItemRecs = await this.sRequestItemRepository.find({ select: ['sRequestId'], where: { companyCode: companyCode, unitCode: unitCode, l4: In(req.manufacturingOrderPks), isActive: true } });
    if (sReqItemRecs.length == 0) {
      throw new ErrorResponse(41057, 'No shipping requests found for the criteria');
    }
    let filteredSReqIds = sReqItemRecs.map(r => r.sRequestId);

    if (req?.proceedingStatus?.length) {
      // now if the status is provided, then filter only those such shipping requests
      const sReqStatusRecs = await this.sRequestRepository.find({ select: ['id'], where: { companyCode: companyCode, unitCode: unitCode, id: In(filteredSReqIds), currentStage: In(req.proceedingStatus) }, order: { createdAt: 'DESC' } });
      filteredSReqIds = sReqStatusRecs.map(r => r.id);
    }
    const srModels = await this.getShippingRequestModels(filteredSReqIds, companyCode, unitCode, false, req.iNeedSrItemsAlso, req.iNeedSrItemsAttrAlso, req.iNeedVendorInfoAlso, req.iNeedTruckInfoAlso);
    return new PkShippingRequestResponse(true, 41056, 'Shipping info retrieved', srModels);
  }

  // HELPER
  async getShippingRequestModels(sReqIds: number[], companyCode: string, unitCode: string, throwErrorIfNoRecs: boolean, iNeedSrItemsAlso: boolean, iNeedSrItemsAttrAlso: boolean, iNeedVendorInfoAlso: boolean, iNeedTruckInfoAlso: boolean): Promise<PkShippingRequestModel[]> {
    const sReqRecs = await this.sRequestRepository.find({ where: { id: In(sReqIds), companyCode: companyCode, unitCode: unitCode, isActive: true } });
    if (throwErrorIfNoRecs && sReqRecs.length == 0) {
      throw new ErrorResponse(41057, 'No shipping requests found for the criteria');
    }
    const sReqModels: PkShippingRequestModel[] = [];
    for (const rec of sReqRecs) {
      let srItemModels: PkShippingReqesutItemModel[];
      let truckModels: PkShippingRequestTruckInfoModel[];
      let vendorModel: PkShippingRequestShippingInfoModel;
      if (iNeedSrItemsAlso) {
        srItemModels = await this.getGetShippingRequestItemModel(rec.id, companyCode, unitCode, throwErrorIfNoRecs, iNeedSrItemsAttrAlso);
      }
      if (iNeedVendorInfoAlso) {
        vendorModel = await this.getShippingRequestShippingInfo(rec.id, companyCode, unitCode, throwErrorIfNoRecs);
      }
      if (iNeedTruckInfoAlso) {
        truckModels = await this.getShippingRequestTruckInfo(rec.id, companyCode, unitCode, throwErrorIfNoRecs);
      }
      const sReqStatusRec = await this.sRequestProceedingRepository.findOne({ select: ['currentStage'], where: { companyCode: companyCode, unitCode: unitCode, sRequestId: rec.id, isActive: true } });
      const sRModel = new PkShippingRequestModel(rec.id, rec.requestNo, srItemModels, sReqStatusRec.currentStage, rec.printStatus ? true : false, vendorModel, truckModels);
      sReqModels.push(sRModel);
    }
    return sReqModels;
  }

  async getGetShippingRequestItemModel(sReqId: number, companyCode: string, unitCode: string, throwErrorIfNoRecs: boolean, iNeedSrItemsAttrAlso: boolean): Promise<PkShippingReqesutItemModel[]> {
    const sReqItemRecs = await this.sRequestItemRepository.find({ where: { sRequestId: sReqId, companyCode: companyCode, unitCode: unitCode } });
    if (throwErrorIfNoRecs && sReqItemRecs.length == 0) {
      throw new ErrorResponse(41046, 'No shipping items found for the shipping request id' + sReqId);
    }
    const sReqItemModels: PkShippingReqesutItemModel[] = [];
    for (const item of sReqItemRecs) {
      const dSetItemRecs = await this.helperService.getDSetItemRecordsByDSetId(item.refId, companyCode, unitCode);
      const packListIds = dSetItemRecs.map(r => r.deRefId);
      const subItems = await this.helperService.getDSetSubItemsByDSetId([item.refId], companyCode, unitCode);
      const cartonIdsMap = new Map<number, number[]>();
      subItems.forEach(subItem => {
        const packListId = Number(subItem.deRefNo1);
        const cartonId = Number(subItem.deRefId);
        if (!cartonIdsMap.has(packListId)) {
          cartonIdsMap.set(packListId, []);
        }
        cartonIdsMap.get(packListId)?.push(cartonId);
      });
      const cartonIds: PackListCartoonIDs[] = Array.from(cartonIdsMap.entries()).map(([packListId, cartonIds]) => ({ packListId, cartonIds }));
      let attrs: PkShippingReqesutItemAttrsModel;
      if (iNeedSrItemsAttrAlso) {
        attrs = await this.getShippingRequestItemAttrModel(item.id, item.refId, companyCode, unitCode, throwErrorIfNoRecs);
      }
      const sReqItemModel = new PkShippingReqesutItemModel(item.id, item.itemLevel, item.refId, item.l5, item.l4, item.l3, packListIds, cartonIds, attrs, item.fgOutReqCreated);
      sReqItemModels.push(sReqItemModel);
    }
    return sReqItemModels;
  }

  // HELPER
  async getShippingRequestTruckInfo(sReqId: number, companyCode: string, unitCode: string, throwErrorIfNoRecs: boolean): Promise<PkShippingRequestTruckInfoModel[]> {
    const truckRecs = await this.sRequestTruckRepository.find({ where: { sRequestId: sReqId, companyCode: companyCode, unitCode: unitCode } });
    if (throwErrorIfNoRecs && truckRecs.length == 0) {
      throw new ErrorResponse(41047, 'No truck info updated to the shipping request id' + sReqId);
    }
    const truckModels: PkShippingRequestTruckInfoModel[] = [];
    for (const t of truckRecs) {
      const truckModel = new PkShippingRequestTruckInfoModel(t.id, t.truckNo, t.contact, t.remarks, t.loadStartAt, t.loadEndAt, t.inAt, t.outAt, t.driverName, t.licenseNumber, t.loadingStatus);
      truckModels.push(truckModel);
    }
    return truckModels;
  }

  // HELPER
  async getShippingRequestShippingInfo(sReqId: number, companyCode: string, unitCode: string, throwErrorIfNoRecs: boolean): Promise<PkShippingRequestShippingInfoModel> {
    const receiverRec = await this.sRequestVendorRepository.findOne({ where: { sRequestId: sReqId, companyCode: companyCode, unitCode: unitCode } });
    if (throwErrorIfNoRecs && !receiverRec) {
      throw new ErrorResponse(41048, 'No vendor mapped to the shipping request id' + sReqId);
    }
    if (receiverRec) {
      const vendorInfo = await this.helperService.getVendorInfoById(
        receiverRec.vendorId, companyCode, unitCode
      );
      // make an api call to vendor service from helper service and add the response model here
      return new PkShippingRequestShippingInfoModel(receiverRec.vendorId, receiverRec.remarks, receiverRec.plannedDispatchDate, vendorInfo);
    }
    return null;
  }



  // HELPER
  async getShippingRequestItemAttrModel(sReqItemId: number, refId: number, companyCode: string, unitCode: string, throwErrorIfNoRecs: boolean): Promise<PkShippingReqesutItemAttrsModel> {
    // get the attrs from the d set entities
    const dSetItemAttrRec = await this.sRequestItemAttrRepository.findOne({ where: { sRequestItemId: sReqItemId, companyCode: companyCode, unitCode: unitCode } });
    if (throwErrorIfNoRecs && !dSetItemAttrRec) {
      throw new ErrorResponse(41049, 'No item attributes for the sRequest item id' + sReqItemId);
    }
    if (dSetItemAttrRec) {

      // export enum ShippingRequestItemAttrEnum {
      //     TOT_CTN = 'li1', // total cartons
      //     TOT_QTY = 'li2', // total FGs
      //     DEL_DATE = 'lm1', 
      //     DEST = 'lm2',
      //     BUYER = 'lm3',
      //     STYLES = 'lt1'
      // }

      const totalCartons = dSetItemAttrRec.li1 ? Number(dSetItemAttrRec.li1) : 0;
      const totalQuantity = dSetItemAttrRec.li2 ? Number(dSetItemAttrRec.li2) : 0;
      const destination = dSetItemAttrRec.lm1?.split(',');
      const delDates = dSetItemAttrRec.lm2?.split(',');
      const buyers = dSetItemAttrRec.lm3?.split(',');
      const styles = dSetItemAttrRec.lt1?.split(',');
      const mo = dSetItemAttrRec.l1;
      const vpo = dSetItemAttrRec.l2?.split(',');
      const co = dSetItemAttrRec.l3?.split(',');
      const itemArrModel = new PkShippingReqesutItemAttrsModel(destination, delDates, styles, vpo, co, mo, buyers, totalCartons, totalQuantity, 0);
      return itemArrModel;
    }
    return null;
  }

  // HELPER
  async getShippingRequestItemRecordsForRefIds(refType: PkShippingRequestItemLevelEnum, refIds: number[], companyCode: string, unitCode: string): Promise<SRequestItemEntity[]> {
    return this.sRequestItemRepository.find({ where: { companyCode: companyCode, unitCode: unitCode, itemLevel: refType, refId: In(refIds), isActive: true } });
  }

  // ENDPOINT
  async getShippingRequestItemAodAbrstactInfo(req: PkShippingRequestItemIdRequest): Promise<PkAodAbstractResponse> {
    const { companyCode, unitCode, srItemId } = req;
    const srItemRecs = await this.sRequestItemRepository.find({ select: ['sRequestId', 'refId', 'id', 'l5'], where: { companyCode: companyCode, unitCode: unitCode, id: In(srItemId) } });
    if (srItemRecs.length == 0) {
      throw new ErrorResponse(41050, 'No shipping items found');
    }
    const srRec = await this.sRequestRepository.findOne({ select: ['gatePassCode'], where: { companyCode: companyCode, unitCode: unitCode, id: srItemRecs[0].sRequestId } });
    const aodAbstractModels: PkAodAbstarctModel[] = [];
    for (const srItem of srItemRecs) {
      // get the dSet info for the shipping item
      const truckInfo = await this.getShippingRequestTruckInfo(srItem.sRequestId, companyCode, unitCode, true);
      const shippingInfo = await this.getShippingRequestShippingInfo(srItem.sRequestId, companyCode, unitCode, true);
      const dSetItemAbstractInfo = await this.helperService.getDispatchSetItemLevelAbstarctInfo(srItem.refId, companyCode, unitCode);
      const shippingInfoAbstract = new PkShippingItemsAbstractModel(srItem.sRequestId, srItem.id, srItem.refId, srItem.l5, srRec.gatePassCode, dSetItemAbstractInfo);
      const aodAbstractModel = new PkAodAbstarctModel(shippingInfo, truckInfo, [shippingInfoAbstract]);
      aodAbstractModels.push(aodAbstractModel);
    }
    return new PkAodAbstractResponse(true, 41051, 'AOD abstract info retrieved', aodAbstractModels);
  }

  async getAlreadyDispatchedSRCount(req: PkShippingDispatchRequest): Promise<PkShippingDispatchResponse> {
    const totalDispatchedCutsToday = await this.sRequestRepository.getAlreadyDispatchedRepo(req.unitCode, req.companyCode, req.date);

    const dispatchRequest = new PkShippingDispatchRequestModel(totalDispatchedCutsToday);
    return new PkShippingDispatchResponse(true, 41052, 'Dispatched data retrieved successfully', dispatchRequest)

  }

  async getVendorDetailsByShippingRequest(reqModel: VendorDetailsReq): Promise<UpdateVendorResponseModel> {
    try {
      const sRequestVendor = await this.sRequestVendorRepository.findOne({ where: { sRequestId: reqModel.sReqId, companyCode: reqModel.companyCode, unitCode: reqModel.unitCode } });
      if (sRequestVendor) {
        const vendor = await this.helperService.getVendorInfoById(sRequestVendor.vendorId, reqModel.companyCode, reqModel.unitCode,);
        if (!vendor) {
          throw new ErrorResponse(0, 'Vendor information not found');
        }

        const responseData = new VendorInfoByShippingReqIdModel(
          sRequestVendor.sRequestId,
          vendor.id,
          vendor.vName,
          `${vendor.vAddress}, ${vendor.vPlace}, ${vendor.vCountry}`,
          new Date(sRequestVendor.plannedDispatchDate),
          sRequestVendor.remarks,
        );
        return new UpdateVendorResponseModel(true, 0, 'Vendor Details Fetched Successfully', responseData);
      } else {
        throw new ErrorResponse(6521,'Please Map Assign  Vendor')
      }

    } catch (error) {
      throw new ErrorResponse(0, error.message)
    }
  }
}


