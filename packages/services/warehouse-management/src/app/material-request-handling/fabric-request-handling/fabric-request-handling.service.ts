import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { ErrorResponse } from '@xpparel/backend-utils';
import { FabIssuingEntityEnum, GlobalResponseObject, LayingStatusEnum, MaterialReqStatusEnum, MaterialRequestNoRequest, PhItemCategoryEnum, RequestTypeEnum, WhFabReqStatusRequest, WhMatReqLineStatusEnum, WhReqByObjectISSEnum, WMS_C_FAB_IssuanceRequest, WMS_C_FAB_ItemLevelIssuanceRequest } from '@xpparel/shared-models';
import moment from 'moment';
import { DataSource, Like, } from 'typeorm';
import { dynamicRedlock } from "../../../config/redis/redlock.config";
import { GenericTransactionManager } from '../../../database/typeorm-transactions';
import { PhItemIssuanceEntity } from '../../packing-list/entities/ph-item-issuance.entity';
import { PackingListActualInfoService } from '../../packing-list/packing-list-actuals-info.service';
import { WhMatIssLogHeaderEntity } from '../entities/wh-mat-issuance-header.entity';
import { WhMatRequestHeaderEntity } from '../entities/wh-mat-request-header.entity';
import { WhMatRequestLineEntity } from '../entities/wh-mat-request-line.entity';
import { WhRequestHeaderRepo } from '../repositories/wh-request-header.repository';
import { WhRequestLineRepo } from '../repositories/wh-request-line.repository';
import { FabricRequestHandlingHelperService } from './fabric-request-handling-helper.service';
import { FabricRequestHandlingInfoService } from './fabric-request-handling-info.service';
import { FabricRequestCreationInfoService } from '../fabric-request-creation/fabric-request-creation-info.service';

@Injectable()
export class FabricRequestHandlingService {
  constructor(
    private dataSource: DataSource,
    private infoService: FabricRequestHandlingInfoService,
    @Inject(forwardRef(() => FabricRequestHandlingHelperService)) private helperService: FabricRequestHandlingHelperService,
    private whHeaderRepo: WhRequestHeaderRepo,
    private whLineRepo: WhRequestLineRepo,
    @Inject(forwardRef(() => PackingListActualInfoService)) private packListActualInfoSerive: PackingListActualInfoService,
    @Inject(forwardRef(() => FabricRequestCreationInfoService)) private fabricReqCreationInfoService: FabricRequestCreationInfoService,
  ) {

  }

  async changeWhFabRequestStatusToIssued(req: WhFabReqStatusRequest): Promise<GlobalResponseObject> {
    const matReqNo = new MaterialRequestNoRequest(req.username, req.unitCode, req.companyCode, req.userId, req.materialRequestNo, [], undefined);
    const whItemsData = await this.fabricReqCreationInfoService.getItemInfoForWhFabRequestNo(matReqNo);
    if (!whItemsData.status) {
      throw new ErrorResponse(6206, whItemsData.internalMessage);
    }
    const items: WMS_C_FAB_ItemLevelIssuanceRequest[] = []
    whItemsData.data.forEach((reqLine) => {
      reqLine.reqLines.forEach((reqLineItem) => {
        reqLineItem.materials.forEach((reqLineItemItem) => {
          items.push(new WMS_C_FAB_ItemLevelIssuanceRequest(reqLineItemItem.rollId, reqLineItemItem.allocQty));
        })
      })
    })
    const latestIssuanceReq = new WMS_C_FAB_IssuanceRequest(req.username, req.unitCode, req.companyCode, req.userId, whItemsData.data[0].id, req.username, moment().format('YYYY-MM-DD'), items);
    return await this.changeWhFabRequestStatusToIssuedLatest(latestIssuanceReq);
  }

  /**
   * WRITER
   * Changes the status of the WH Fab req to issued
   * @param req 
   * @returns 
   */
  async changeWhFabRequestStatusToIssuedLatest(req: WMS_C_FAB_IssuanceRequest): Promise<GlobalResponseObject> {
    let manager = new GenericTransactionManager(this.dataSource);
    let lockAlreadyReleased = false;
    let lock = null;
    try {
      // TODO: do all the pre validations
      const whFabReq = await this.whHeaderRepo.findOne({ where: { companyCode: req.companyCode, unitCode: req.unitCode, isActive: true, id: req.whReqId, reqMaterialType: PhItemCategoryEnum.FABRIC } });
      if (!whFabReq) {
        throw new ErrorResponse(6207, `The given request no : ${req.whReqId} does not exist`);
      }

      const whReqLine = await this.whLineRepo.findOne({ select: ['id', 'reqLineStatus'], where: { whRequestHeaderId: whFabReq.id, companyCode: req.companyCode, unitCode: req.unitCode } });
      if (!whReqLine) {
        throw new ErrorResponse(6208, `The given request no : ${req.whReqId} is not mapped to any docket`);
      }
      if (whReqLine.reqLineStatus == WhMatReqLineStatusEnum.MATERIAL_ISSUED) {
        throw new ErrorResponse(6209, `Material is already issued for this request`);
      }
      await manager.startTransaction();
      const lockPoMaterial = `ISS-${req.companyCode}-${req.unitCode}-${whFabReq.moNumber}`;
      const ttl = 120000;
      lock = await dynamicRedlock.lock(lockPoMaterial, ttl).catch(error => {
        throw new ErrorResponse(16095, 'Someone already doing issuance for the same mo number. Please try again');
      });
      const issuanceEntity = new WhMatIssLogHeaderEntity();
      issuanceEntity.issuedBy = req.username;
      issuanceEntity.issuedOn = req.issuedOn;
      issuanceEntity.companyCode = req.companyCode;
      issuanceEntity.createdUser = req.username;
      issuanceEntity.unitCode = req.unitCode;
      const now = moment();
      const datePart = now.format('DDMMYY');
      const prefix = `${WhReqByObjectISSEnum.DOCKET}-${datePart}-`;
      const todayIssuances = await manager.getRepository(WhMatIssLogHeaderEntity).count({
        where: {
          issuanceNo: Like(`${prefix}%`)
        }
      });
      const sequence = String(todayIssuances + 1).padStart(3, '0');
      const issuanceNo = `${prefix}${sequence}`;
      issuanceEntity.issuanceNo = issuanceNo;
      const savedIssuanceEntity = await manager.getRepository(WhMatIssLogHeaderEntity).save(issuanceEntity);
      const issuanceItems: PhItemIssuanceEntity[] = []
      for (const item of req.issuingItems) {
        const issuanceItem = new PhItemIssuanceEntity();
        issuanceItem.companyCode = req.companyCode;
        issuanceItem.createdUser = req.username;
        issuanceItem.unitCode = req.unitCode;
        issuanceItem.phItemLineId = item.phItemLineId;
        issuanceItem.issuedQuantity = item.issuingQty;
        issuanceItem.remarks = '';
        issuanceItem.issuingEntity = FabIssuingEntityEnum.PROCESS;
        issuanceItem.extRequestNo = whFabReq.extReqNo;
        issuanceItem.requestType = RequestTypeEnum.NORMAL;
        issuanceItem.issuanceId = savedIssuanceEntity.id;
        issuanceItem.whReqId = whFabReq.id;
        issuanceItems.push(issuanceItem);
        await this.packListActualInfoSerive.updateIssuedQuantity(req.unitCode, req.companyCode, req.username, item.phItemLineId, item.issuingQty, '', manager);
      }
      await manager.getRepository(PhItemIssuanceEntity).save(issuanceItems);
      await manager.getRepository(WhMatRequestHeaderEntity).update({ id: whFabReq.id, companyCode: req.companyCode, unitCode: req.unitCode }, { matRequestStatus: MaterialReqStatusEnum.MATERIAL_ISSUED });
      await manager.getRepository(WhMatRequestLineEntity).update({ whRequestHeaderId: whFabReq.id, companyCode: req.companyCode, unitCode: req.unitCode }, { reqLineStatus: WhMatReqLineStatusEnum.MATERIAL_ISSUED });
      // now update the status in the CPS also against to the request
      await manager.completeTransaction();
      // TODO: Move this update to a bull job if possible
      const dgReq = new WhFabReqStatusRequest(req.companyCode, req.unitCode, req.companyCode, req.userId, whFabReq.extReqNo, WhMatReqLineStatusEnum.MATERIAL_ISSUED);
      await this.helperService.updateMaterialReqStausToDocketgroup(dgReq);
      return new GlobalResponseObject(true, 6210, 'Material issued to the cutting table');
    } catch (err) {
      console.log(err);
      (lock && !lockAlreadyReleased) ? await lock.unlock() : null;
      await manager.releaseTransaction();
      throw err;
    }
  }


  /**
   * WRITER
   * Changes the status of the WH Fab req to issued
   * @param req 
   * @returns 
   */
  async changeWhFabRequestStatusToPreparingMaterial(req: WhFabReqStatusRequest): Promise<GlobalResponseObject> {
    let manager = new GenericTransactionManager(this.dataSource);
    try {
      // TODO: do all the pre validations
      const whFabReq = await this.whHeaderRepo.findOne({ where: { companyCode: req.companyCode, unitCode: req.unitCode, isActive: true, extReqNo: req.materialRequestNo, reqMaterialType: PhItemCategoryEnum.FABRIC } });
      if (!whFabReq) {
        throw new ErrorResponse(6211, `The given request no : ${req.materialRequestNo} does not exist`);
      }
      const whReqLine = await this.whLineRepo.findOne({ select: ['id', 'reqLineStatus', 'jobNumber'], where: { whRequestHeaderId: whFabReq.id, companyCode: req.companyCode, unitCode: req.unitCode } });
      if (!whReqLine) {
        throw new ErrorResponse(6212, `The given request no : ${req.materialRequestNo} is not mapped to any docket`);
      }
      if (whReqLine.reqLineStatus == WhMatReqLineStatusEnum.PREPARING_MATERIAL) {
        throw new ErrorResponse(6213, `Material is already set to preparing material for this request`);
      }
      await this.checkIfLayingStartedForDocket(whFabReq.extReqNo, whReqLine.jobNumber, req.companyCode, req.unitCode);
      await manager.startTransaction();
      await manager.getRepository(WhMatRequestLineEntity).update({ whRequestHeaderId: whFabReq.id, companyCode: req.companyCode, unitCode: req.unitCode }, { reqLineStatus: WhMatReqLineStatusEnum.PREPARING_MATERIAL });
      // now update the status in the CPS also against to the request
      await manager.completeTransaction();
      // TODO: Move this update to a bull job if possible
      await this.helperService.updateMaterialReqStausToDocketgroup(req);
      return new GlobalResponseObject(true, 6214, 'Material issued to the cutting table');
    } catch (error) {
      await manager.releaseTransaction();
      throw error;
    }
  }


  async checkIfLayingStartedForDocket(matReqNo: string, docketGroup: string, companyCode: string, unitCode: string): Promise<boolean> {
    const layingsForDoc = await this.helperService.getLayingInfoForDocket(docketGroup, companyCode, unitCode);
    console.log(layingsForDoc);
    layingsForDoc?.forEach(r => {
      if (r.matReqNo == matReqNo) {
        if (r.currentLayStatus != LayingStatusEnum.OPEN) {
          throw new ErrorResponse(6215, `A laying operation is already being carried out for the docket group : ${docketGroup} and req no : ${matReqNo}`);
        }
      }
    });
    return true;
  }

}
