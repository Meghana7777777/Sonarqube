import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { DataSource, In, Not } from 'typeorm';
import { WhRequestHeaderRepo } from '../repositories/wh-request-header.repository';
import { WhRequestLineItemRepo } from '../repositories/wh-request-line-item.repository';
import { WhRequestLineRepo } from '../repositories/wh-request-line.repository';
import { CommonResponse, CutTableIdRequest, ManufacturingOrderNumberRequest, MaterialRequestNoRequest, MRStatusRequest, RollBasicInfoModel, WhDashMaterialRequesHeaderModel, WhDashMaterialRequesLineItemModel, WhDashMaterialRequesLineModel, WhFabMaterialRequestInfoResponse, WhMaterialRequestsResponse, WhMatReqLineStatusEnum } from '@xpparel/shared-models';
import { WhMatRequestHeaderEntity } from '../entities/wh-mat-request-header.entity';
import { FabricRequestCreationHelperService } from './fabric-request-creation-helper.service';
import { log } from 'console';
import { ErrorResponse } from '@xpparel/backend-utils';
const util = require('util');

@Injectable()
export class FabricRequestCreationInfoService {

  constructor(
    private dataSource: DataSource,
    private whHeaderRepo: WhRequestHeaderRepo,
    private whLineRepo: WhRequestLineRepo,
    private whLineItemRepo: WhRequestLineItemRepo,
    private helperService: FabricRequestCreationHelperService
  ) {
    //
  }

  /**
   * READER
   * Gets the pending WH fab requests for the given cut table for the warehouse team
   * @param req 
   */
  async getPendingWhFabricRequestsForCutTableId(req: CutTableIdRequest): Promise<WhMaterialRequestsResponse> {
    const { companyCode, unitCode } = req;
    // get all the fabric requests for the cut table id 
    const requestDetails: WhMatRequestHeaderEntity[] = await this.whHeaderRepo.getWareHouseRequestDetailsByCutTableId(req.cutTableId, companyCode, unitCode);
    if (requestDetails.length == 0) {
      return new WhMaterialRequestsResponse(true, 6195, 'No pending requests found for the cut table', []);
    }
    const warehouseRequests = await this.constructWarehouseReqRespModel(requestDetails, false, false);
    // WhDashMaterialRequesLineModel.materials is not required for the this response
    return new WhMaterialRequestsResponse(true, 6196, 'Pending Warehouse Requests For Cut table Retrieved successfully', warehouseRequests);
  }

  /**
   * Service to construct warehouse request response model for given request details
   * @param requestDetails 
   * @param isMaterialRequired 
   * @returns 
  */
  async constructWarehouseReqRespModel(requestDetails: WhMatRequestHeaderEntity[], isMaterialRequired: boolean, issued: boolean): Promise<WhDashMaterialRequesHeaderModel[]> {
    const unitCode = requestDetails[0].unitCode;
    const companyCode = requestDetails[0].companyCode;
    const warehouseRequests = [];
    for (const eachRequest of requestDetails) {
      const reqLineDetails = issued ? await this.whLineRepo.find({ where: { whRequestHeaderId: eachRequest.id, unitCode, companyCode } }) : await this.whLineRepo.find({ where: { whRequestHeaderId: eachRequest.id, unitCode, companyCode, reqLineStatus: Not(WhMatReqLineStatusEnum.MATERIAL_ISSUED) } });
      if (reqLineDetails.length) {
        const reqLines = [];
        for (const reqLine of reqLineDetails) {
          let materials: WhDashMaterialRequesLineItemModel[] = [];
          if (isMaterialRequired) {
            const reqLineItems = await this.whLineItemRepo.find({ where: { whRequestLineId: reqLine.id, unitCode, companyCode } });
            const rollBasicInfo = await this.helperService.getRollDetailsForRollIds(reqLineItems.map(item => item.itemId),
              companyCode, unitCode);
            reqLineItems.map((eachItem) => {
              const basicInfo: RollBasicInfoModel = rollBasicInfo.find(item => item.rollId == eachItem.itemId);
              const reqLineItem = new WhDashMaterialRequesLineItemModel(eachItem.itemBarcode, basicInfo?.rollId, basicInfo?.originalQty, null, eachItem.reqQuantity, eachItem.reqLineItemStatus, basicInfo?.itemCode, basicInfo?.itemDesc, basicInfo);
              materials.push(reqLineItem);
            });
          }
          const wareHouseReqLineLine = new WhDashMaterialRequesLineModel(reqLine.jobNumber, reqLine.reqLineStatus, eachRequest.fulfillWithin, eachRequest.materialReqOn, materials);
          reqLines.push(wareHouseReqLineLine);
        };
        const wareHouseReqModel = new WhDashMaterialRequesHeaderModel(eachRequest.id, eachRequest.whReqNo, eachRequest.reqProgressStatus, eachRequest.materialReqOn, eachRequest.fulfillWithin, eachRequest.extRefEntityType, eachRequest.reqMaterialType, reqLines);
        warehouseRequests.push(wareHouseReqModel);
      }
    }
    return warehouseRequests;
  }


  /**
   * READER
   * gets the request status and the items under it for the given WH-FAB req number
   * @param req 
   * @returns 
   */
  async getItemInfoForWhFabRequestNo(req: MaterialRequestNoRequest): Promise<WhFabMaterialRequestInfoResponse> {
    // We need all the fields in child classes also in the response object
    // to get the basicc roll info use this getRollDetailsForRollIds in the helper service 
    const { companyCode, unitCode } = req;
    // get all the fabric requests for the cut table id 
    const requestDetails: WhMatRequestHeaderEntity[] = await this.whHeaderRepo.getWareHouseRequestDetailsByReqNoAndJob(req.docketGroup, req.materialRequestNo, companyCode, unitCode);
    // if()
    console.log(requestDetails,'requestDetails')
    const warehouseRequests = await this.constructWarehouseReqRespModel(requestDetails, true, true);
    // WhDashMaterialRequesLineModel.materials is not required for the this response
    return new WhFabMaterialRequestInfoResponse(true, 6196, 'Pending Warehouse Requests For Cut table Retrieved successfully', warehouseRequests);
  }

  async getWhMaterialRequests(req: MRStatusRequest): Promise<WhMaterialRequestsResponse> {
    const { companyCode, unitCode } = req;
    // get all the fabric requests for the cut table id 
    const requestDetails: WhMatRequestHeaderEntity[] = await this.whHeaderRepo.find({
      where: {
        matRequestStatus: In(req.materialRequestStatus),
        extRefEntityType: req.externalRefModuleType,
        companyCode,
        unitCode
      }
    });
    if (requestDetails.length == 0) {
      return new WhMaterialRequestsResponse(true, 6195, 'No pending requests found for the cut table', []);
    }
    const warehouseRequests = requestDetails.map(item => new WhDashMaterialRequesHeaderModel(item.id, item.whReqNo, item.reqProgressStatus, item.materialReqOn, item.fulfillWithin, item.extRefEntityType, item.reqMaterialType, []));
    // WhDashMaterialRequesLineModel.materials is not required for the this response
    return new WhMaterialRequestsResponse(true, 6196, 'Pending Warehouse Requests For Cut table Retrieved successfully', warehouseRequests);
  }

  async checkMRExistForGivenMoNo(req: ManufacturingOrderNumberRequest): Promise<CommonResponse> {
    const noWhRequests = await this.whHeaderRepo.count({ where: { moNumber: In(req.manufacturingOrderNos) } });
    if (noWhRequests === 0) {
      throw new ErrorResponse(0, 'No requests found for the given MO numbers');
    }
    return new CommonResponse(true, 0, 'Requests found for the given MO numbers');
  }
}
