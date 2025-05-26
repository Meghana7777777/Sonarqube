import { Injectable } from "@nestjs/common";
import { DataSource, In } from "typeorm";
import { SRequestItemRepository } from "./repository/s-request-item-repository";
import { SRequestItemTruckMapRepository } from "./repository/s-request-item-truck-map.repository";
import { SRequestProceedingRepository } from "./repository/s-request-proceeding-repository";
import { SRequestRepository } from "./repository/s-request-repository";
import { SRequestTruckRepository } from "./repository/s-request-truck-repository";
import { GlobalResponseObject, ShippingRequestIdRequest, ShippingReqesutItemAttrsModel, ShippingReqesutItemModel, ShippingRequestFilterRequest, ShippingRequestItemLevelEnum, ShippingRequestModel, ShippingRequestResponse, ShippingRequestTruckInfoModel, ShippingRequestShippingInfoModel, DSetItemIdsRequest, ShippingRequestItemIdRequest, AodAbstractResponse, AodAbstarctModel, ShippingItemsAbstractModel, ShippingDispatchRequest, ShippingDispatchRequestModel, ShippingDispatchResponse } from "@xpparel/shared-models";
import { SRequestEntity } from "./entites/s-request.entity";
import { SRequestItemEntity } from "./entites/s-request-item.entity";
import { ErrorResponse } from "@xpparel/backend-utils";
import { SRequestItemAttrRepository } from "./repository/s-request-item-attr.repository";
import { SRequestVendorRepository } from "./repository/s-request-vendor.repository";
import { ShippingRequestHelperService } from "./shipping-request-helper.service";

@Injectable()
export class ShippingRequestInfoService {
  constructor(
    private dataSource: DataSource,
    private sRequestItemRepository: SRequestItemRepository,
    private sRequestItemAttrRepository: SRequestItemAttrRepository,
    private sRequestItemTruckMapRepository: SRequestItemTruckMapRepository,
    private sRequestProceedingRepository: SRequestProceedingRepository,
    private sRequestRepository: SRequestRepository,
    private sRequestVendorRepository: SRequestVendorRepository,
    private sRequestTruckRepository: SRequestTruckRepository,
    private helperService: ShippingRequestHelperService
  ) {

  }

  // ENDPOINT
  async getShippingRequestByIds(req: ShippingRequestIdRequest): Promise<ShippingRequestResponse> {
    if (!req?.srIds?.length) {
      throw new ErrorResponse(0, 'Please provide the Shipping Request ids');
    }
    const { companyCode, unitCode } = req;
    const sReqRecs = await this.sRequestRepository.find({ select: ['id'], where: { companyCode: companyCode, unitCode: unitCode, id: In(req.srIds) } });
    if (sReqRecs.length == 0) {
      throw new ErrorResponse(0, 'No Shipping Requests for the given criteria');
    }
    const ids = sReqRecs.map(r => r.id);
    const srModels = await this.getShippingRequestModels(ids, companyCode, unitCode, false, req.iNeedSrItemsAlso, req.iNeedSrItemsAttrAlso, req.iNeedVendorInfoAlso, req.iNeedTruckInfoAlso);
    return new ShippingRequestResponse(true, 41056, 'Shipping info retrieved', srModels);
  }

  // ENDPOINT
  async getShippingRequestByFilterRequest(req: ShippingRequestFilterRequest): Promise<ShippingRequestResponse> {
    if (!req?.manufacturingOrderPks?.length) {
      throw new ErrorResponse(0, 'Please provide the Manufacturing orders');
    }
    const { companyCode, unitCode } = req;

    // get the sr ids based on the sr items using the mo_number
    const sReqItemRecs = await this.sRequestItemRepository.find({ select: ['sRequestId'], where: { companyCode: companyCode, unitCode: unitCode, l1: In(req.manufacturingOrderPks), isActive: true } });
    if (sReqItemRecs.length == 0) {
      throw new ErrorResponse(0, 'No shipping reqeusts found for the criteria');
    }
    let filteredSReqIds = sReqItemRecs.map(r => r.sRequestId);

    if (req?.proceedingStatus?.length) {
      // now if the status is provided, then filter only those such shipping requests
      const sReqStatusRecs = await this.sRequestRepository.find({ select: ['id'], where: { companyCode: companyCode, unitCode: unitCode, id: In(filteredSReqIds), currentStage: In(req.proceedingStatus) } });
      filteredSReqIds = sReqStatusRecs.map(r => r.id);
    }


    const srModels = await this.getShippingRequestModels(filteredSReqIds, companyCode, unitCode, false, req.iNeedSrItemsAlso, req.iNeedSrItemsAttrAlso, req.iNeedVendorInfoAlso, req.iNeedTruckInfoAlso);
    return new ShippingRequestResponse(true, 41056, 'Shipping info retrieved', srModels);
  }

  // HELPER
  async getShippingRequestModels(sReqIds: number[], companyCode: string, unitCode: string, throwErrorIfNoRecs: boolean, iNeedSrItemsAlso: boolean, iNeedSrItemsAttrAlso: boolean, iNeedVendorInfoAlso: boolean, iNeedTruckInfoAlso: boolean): Promise<ShippingRequestModel[]> {
    const sReqRecs = await this.sRequestRepository.find({ where: { id: In(sReqIds), companyCode: companyCode, unitCode: unitCode, isActive: true } });
    if (throwErrorIfNoRecs && sReqRecs.length == 0) {
      throw new ErrorResponse(41057, 'No shipping requests found for the criteria');
    }
    const sReqModels: ShippingRequestModel[] = [];
    for (const rec of sReqRecs) {
      let srItemModels: ShippingReqesutItemModel[];
      let truckModels: ShippingRequestTruckInfoModel[];
      let vendorModel: ShippingRequestShippingInfoModel;
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
      const sRModel = new ShippingRequestModel(rec.id, rec.requestNo, srItemModels, sReqStatusRec.currentStage, rec.printStatus ? true : false, vendorModel, truckModels);
      sReqModels.push(sRModel);
    }
    return sReqModels;
  }

  async getGetShippingRequestItemModel(sReqId: number, companyCode: string, unitCode: string, throwErrorIfNoRecs: boolean, iNeedSrItemsAttrAlso: boolean): Promise<ShippingReqesutItemModel[]> {
    const sReqItemRecs = await this.sRequestItemRepository.find({ where: { sRequestId: sReqId, companyCode: companyCode, unitCode: unitCode } });
    if (throwErrorIfNoRecs && sReqItemRecs.length == 0) {
      throw new ErrorResponse(0, 'No shipping items found for the shipping request id' + sReqId);
    }
    const sReqItemModels: ShippingReqesutItemModel[] = [];
    for (const item of sReqItemRecs) {
      let attrs: ShippingReqesutItemAttrsModel;
      if (iNeedSrItemsAttrAlso) {
        attrs = await this.getShippingRequestItemAttrModel(item.id, null, companyCode, unitCode, throwErrorIfNoRecs);
      }
      const sReqItemModel = new ShippingReqesutItemModel(item.id, item.itemLevel, item.refId, item.l4, item.l3, attrs);
      sReqItemModels.push(sReqItemModel);
    }
    return sReqItemModels;
  }

  // HELPER
  async getShippingRequestTruckInfo(sReqId: number, companyCode: string, unitCode: string, throwErrorIfNoRecs: boolean): Promise<ShippingRequestTruckInfoModel[]> {
    const truckRecs = await this.sRequestTruckRepository.find({ where: { sRequestId: sReqId, companyCode: companyCode, unitCode: unitCode } });
    if (throwErrorIfNoRecs && truckRecs.length == 0) {
      throw new ErrorResponse(0, 'No truck info updated to the shipping request id' + sReqId);
    }
    const truckModels: ShippingRequestTruckInfoModel[] = [];
    for (const t of truckRecs) {
      const truckModel = new ShippingRequestTruckInfoModel(t.id, t.truckNo, t.contact, t.remarks, t.loadStartAt, t.loadEndAt, t.inAt, t.outAt, t.driverName, t.licenseNumber);
      truckModels.push(truckModel);
    }
    return truckModels;
  }

  // HELPER
  async getShippingRequestShippingInfo(sReqId: number, companyCode: string, unitCode: string, throwErrorIfNoRecs: boolean): Promise<ShippingRequestShippingInfoModel> {
    const receiverRec = await this.sRequestVendorRepository.findOne({ where: { sRequestId: sReqId, companyCode: companyCode, unitCode: unitCode } });
    if (throwErrorIfNoRecs && !receiverRec) {
      throw new ErrorResponse(0, 'No vendor mapped to the shipping request id' + sReqId);
    }

    if (receiverRec) {
      const vendorInfo = await this.helperService.getVendorInfoById(
        receiverRec.vendorId, companyCode, unitCode
      );
      // make an api call to vendor service from helper service and add the response model here
      return new ShippingRequestShippingInfoModel(receiverRec.vendorId, receiverRec.remarks, receiverRec.plannedDispatchDate, vendorInfo);
    }
    return null;
  }



  // HELPER
  async getShippingRequestItemAttrModel(sReqItemId: number, refId: number, companyCode: string, unitCode: string, throwErrorIfNoRecs: boolean): Promise<ShippingReqesutItemAttrsModel> {
    // get the attrs from the d set entities
    const dSetItemAttrRec = await this.sRequestItemAttrRepository.findOne({ where: { sRequestItemId: sReqItemId, companyCode: companyCode, unitCode: unitCode } });
    if (throwErrorIfNoRecs && !dSetItemAttrRec) {
      throw new ErrorResponse(0, 'No item attributes for the sRequest item id' + sReqItemId);
    }
    if (dSetItemAttrRec) {
      const cuts = dSetItemAttrRec.lm1?.split(',');
      const sCuts = dSetItemAttrRec.lm2?.split(',');
      const bagNos = dSetItemAttrRec.lt2?.split(',');
      const bagBarcodes = dSetItemAttrRec.lt1?.split(',');
      const totBundles = dSetItemAttrRec.li2 ? Number(dSetItemAttrRec.li2) : 0;
      const totalQty = dSetItemAttrRec.li1 ? Number(dSetItemAttrRec.li1) : 0;
      const itemArrModel = new ShippingReqesutItemAttrsModel(cuts, sCuts, bagNos, bagBarcodes, totBundles, totalQty, 0);
      return itemArrModel;
    }
    return null;
  }

  // HELPER
  async getShippingRequestItemRecordsForRefIds(refType: ShippingRequestItemLevelEnum, refIds: number[], companyCode: string, unitCode: string): Promise<SRequestItemEntity[]> {
    return this.sRequestItemRepository.find({ where: { companyCode: companyCode, unitCode: unitCode, itemLevel: refType, refId: In(refIds), isActive: true } });
  }

  // ENDPOINT
  async getShippingRequestItemAodAbrstactInfo(req: ShippingRequestItemIdRequest): Promise<AodAbstractResponse> {
    const { companyCode, unitCode, srItemId } = req;
    const srItemRecs = await this.sRequestItemRepository.find({ select: ['sRequestId', 'refId', 'id'], where: { companyCode: companyCode, unitCode: unitCode, id: In(srItemId) } });
    if (srItemRecs.length == 0) {
      throw new ErrorResponse(0, 'No shipping items found');
    }
    const aodAbstractModels: AodAbstarctModel[] = [];
    for (const srItem of srItemRecs) {
      // get the dSet info for the shipping item
      const truckInfo = await this.getShippingRequestTruckInfo(srItem.sRequestId, companyCode, unitCode, true);
      const shippingInfo = await this.getShippingRequestShippingInfo(srItem.sRequestId, companyCode, unitCode, true);
      const dSetItemAbstractInfo = await this.helperService.getDispatchSetItemLevelAbstarctInfo(srItem.refId, companyCode, unitCode);
      const shippingInfoAbstract = new ShippingItemsAbstractModel(srItem.sRequestId, srItem.id, srItem.refId, dSetItemAbstractInfo);
      const aodAbstractModel = new AodAbstarctModel(shippingInfo, truckInfo, [shippingInfoAbstract]);
      aodAbstractModels.push(aodAbstractModel);
    }
    return new AodAbstractResponse(true, 0, 'AOD abstract info retrieved', aodAbstractModels);
  }

  async getAlreadyDispatchedSRCount(req: ShippingDispatchRequest): Promise<ShippingDispatchResponse> {
    const totalDispatchedCutsToday = await this.sRequestRepository.getAlreadyDispatchedRepo(req.unitCode,req.companyCode,req.date);

    const dispatchRequest = new ShippingDispatchRequestModel(totalDispatchedCutsToday);
    return new ShippingDispatchResponse(true, 1234, 'Dispatched data retrieved successfully', dispatchRequest)

  }
}


