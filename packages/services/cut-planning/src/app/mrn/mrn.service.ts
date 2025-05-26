import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { DataSource } from "typeorm";
import { MrnInfoService } from "./mrn-info.service";
import { DocMaterialAllocationRequest, GlobalResponseObject, LayingStatusEnum, MrnCreateRequest, MrnIdStatusRequest, MrnStatusEnum, PoDocketGroupRequest, PoDocketNumberRequest, RequestTypeEnum, RollIdsConsumptionRequest, WhFabReqStatusRequest, WhMatReqLineStatusEnum, mrnStatusEnumDiplayValues, mrnStatusOrder } from "@xpparel/shared-models";
import { ErrorResponse } from "@xpparel/backend-utils";
import { GenericTransactionManager } from "../../database/typeorm-transactions";
import { MrnStatusHistoryEntity } from "./entity/mrn-status-history.entity";
import { MrnEntity } from "./entity/mrn.entity";
import { MrnHelperService } from "./mrn-helper.service";
import { dynamicRedlock, redlock } from "../../config/redis/redlock.config";
import { MrnRepository } from "./repository/mrn.repository";
import { MrnItemEntity } from "./entity/mrn-item.entity";
import moment from "moment";
@Injectable()
export class MrnService {
  constructor(
    private dataSource: DataSource,
    @Inject(forwardRef(() => MrnInfoService)) private mrnInfoService: MrnInfoService,
    @Inject(forwardRef(() => MrnHelperService)) private mrnHelperService: MrnHelperService,
    private mrnRepo: MrnRepository
  ) {

  }

  // END POINT
  async changeMrnRequestStatus(req: MrnIdStatusRequest): Promise<GlobalResponseObject> {
    const transManager = new GenericTransactionManager(this.dataSource);
    try {
      if (!req.unitCode || !req.companyCode || !req.mrnId) {
        throw new ErrorResponse(0, 'Please provide the company code, unit code and the mrn id');
      }
      const mrnRecord = await this.mrnInfoService.getMrnRequestRecordForMrnId(req.mrnId, req.companyCode, req.unitCode);
      if (!mrnRecord) {
        throw new ErrorResponse(0, 'MRN record does not exist');
      }
      // if the laying is confirmed, then no changes must be allowed
      const layingRec = await this.mrnHelperService.getLayingRecordForLayId(Number(mrnRecord.poDocketLayId), req.unitCode, req.companyCode);
      if (layingRec.layingStatus == LayingStatusEnum.COMPLETED) {
        throw new ErrorResponse(0, 'Laying is already confirmed. Changes are not encouraged');
      }
      const mrnIncomingOrder = mrnStatusOrder[req.mrnStatus];
      const existinOrder = mrnStatusOrder[mrnRecord.requestStatus];
      // now check for the status fall back
      if (mrnIncomingOrder <= existinOrder) {
        throw new ErrorResponse(0, `You are trying to change the status from ${mrnStatusEnumDiplayValues[mrnRecord.requestStatus]} to ${mrnStatusEnumDiplayValues[req.mrnStatus]}. Action not allowed`);
      }
      if (mrnRecord.requestStatus == MrnStatusEnum.REJECTED) {
        throw new ErrorResponse(0, 'MRN status is rejected. No changes allowed');
      }
      await transManager.startTransaction();
      const mrnHistEnt = new MrnStatusHistoryEntity();
      mrnHistEnt.companyCode = req.companyCode;
      mrnHistEnt.unitCode = req.unitCode;
      mrnHistEnt.createdUser = req.username;
      mrnHistEnt.mrnId = mrnRecord.id;
      mrnHistEnt.poSerial = mrnRecord.poSerial;
      mrnHistEnt.requestStatus = req.mrnStatus;
      await transManager.getRepository(MrnStatusHistoryEntity).save(mrnHistEnt, { reload: false });
      await transManager.getRepository(MrnEntity).update({ companyCode: req.companyCode, unitCode: req.unitCode, id: req.mrnId }, { requestStatus: req.mrnStatus });
      let rollIssueObjects = [];
      if(req.mrnStatus == MrnStatusEnum.REJECTED || req.mrnStatus == MrnStatusEnum.ISSUED){
        rollIssueObjects =  await this.mrnHelperService.changeDocketMaterialReqStatusOfMRN(req.username, req.userId, req.companyCode, req.unitCode, req.mrnId, WhMatReqLineStatusEnum.MATERIAL_ISSUED, req.mrnStatus, transManager); 
          // return new GlobalResponseObject(true, 0, `Material ${mrnStatusEnumDiplayValues[req.mrnStatus]} successfully.`);
      }      
      await transManager.completeTransaction();
      for(const eachRollObject of rollIssueObjects){
        await this.mrnHelperService.addJobForUpdatingIssuedFabToExtSystem(eachRollObject);
      }
      return new GlobalResponseObject(true, 0, 'Material Status Updated successfully.');
    } catch (error) {
      await transManager.releaseTransaction();
      throw error;
    }
  }

  /**
   * 
   * @param req 
   * @returns 
  */
  async createMrnRequest(req: MrnCreateRequest): Promise<GlobalResponseObject> {
    const {unitCode, companyCode} = req;
    let mrnReqNumberLock = null;
    let lock = null;
    let poReqSerialLock = null
    const manager = new GenericTransactionManager(this.dataSource);
    try {
      /**
       * Validations
       * 1. The docket must have atleast 1 lay that is still INPROGRESS.
       * 2. The materials received from the request must not be locked with any of the other dockets
       * Logic:
       * get the lay id that is in progress / paused for the docket
       * for every roll - get the info from the WMS
       * Apply a redis lock for the whole unit code
       *  create the records in the MRN, MRN item and po-docket-material entity with the MRN id
       * Release the lock
      */
      const poDocReq = new PoDocketGroupRequest(null, unitCode, companyCode, null, req.poSerial, req.docketGroup, false, false, []);
      const inProgressOrHoldLays = await this.mrnHelperService.getInprogressLaysForDocketGroup(poDocReq);
      if (!inProgressOrHoldLays) {
        throw new ErrorResponse(0, 'No Inprogress lays found for the given docket. Please check and try again')
      }
      const materialAllocReq = new DocMaterialAllocationRequest(req.username, unitCode, companyCode, req.userId, req.poSerial, req.rollsInfo, null, req.docketGroup, null, null, null);
      const preInfo = await this.mrnHelperService.validatePreRequirementOfMaterialRequest(materialAllocReq, lock);
      // Need to create warehouse request for this MRN as like normal warehouse request
      // Need to generate the MRN request number which is running for each po serial 
      const ttlReqSerial = 120000;
      let mrnReqNumber = null;
      const mrnReqLock = `FAB-MRN-${unitCode}`;
      mrnReqNumberLock = await redlock.lock(mrnReqLock, ttlReqSerial);
      let latestSerial: number = await this.mrnRepo.count({where: {poSerial: req.poSerial, unitCode, companyCode, isActive: true}});
      latestSerial == 0 ? 1 : ++latestSerial;
      mrnReqNumber = `${req.poSerial}-${latestSerial}`
      await mrnReqNumberLock.unlock();
      await manager.startTransaction();
      mrnReqNumberLock = null;
      const mrnEntityObj = new MrnEntity();
      mrnEntityObj.companyCode = companyCode;
      mrnEntityObj.createdUser = req.username;
      mrnEntityObj.docketGroup = req.docketGroup;
      mrnEntityObj.poDocketLayId = inProgressOrHoldLays.id;
      mrnEntityObj.poSerial = req.poSerial;
      mrnEntityObj.requestNumber = `MRN - ${mrnReqNumber}`;
      mrnEntityObj.requestStatus = MrnStatusEnum.OPEN;
      mrnEntityObj.unitCode = unitCode;
      const mrnDetails = await manager.getRepository(MrnEntity).save(mrnEntityObj);
      for (const eachItem of preInfo.rollInfo) {
        const reqRoll = req.rollsInfo.find(roll => roll.rollId == eachItem.rollId);
        const mrnItemObj = new MrnItemEntity();
        mrnItemObj.companyCode = companyCode;
        mrnItemObj.consumedQuantity = reqRoll.allocatedQauntity;
        mrnItemObj.createdUser = req.username;
        mrnItemObj.lotNo = eachItem.lot;
        mrnItemObj.mrnId = mrnEntityObj.id;
        mrnItemObj.poSerial = req.poSerial;
        mrnItemObj.requestedQuantity = reqRoll.allocatedQauntity;
        mrnItemObj.rollBarcode = eachItem.barcode;
        mrnItemObj.rollId = eachItem.rollId;
        mrnItemObj.unitCode = unitCode;
        await manager.getRepository(MrnItemEntity).save(mrnItemObj);
      }
      materialAllocReq.mrnRequestId = mrnDetails.id;
      await this.mrnHelperService.createDocketMaterialRequestWithManager(materialAllocReq, preInfo.rollInfo, poReqSerialLock, preInfo.docketInfo, manager);
      await manager.completeTransaction();
      // Creating a job to update allocated quantity in ph_item_lines
      const consumedOn = moment(Date.now()).format('YYYY-MM-DD HH:MM:ss'); 
      const rollIdsDocReq = new RollIdsConsumptionRequest(req.username, req.unitCode, req.companyCode, req.userId, req.rollsInfo.map(roll => roll.rollId), mrnDetails.id.toString(), RequestTypeEnum.MRN , consumedOn, false)
      await this.mrnHelperService.addJobForUpdatingAllocFabToExtSystem(rollIdsDocReq);
      await this.mrnHelperService.unlockMaterial(preInfo.rollInfo[0].itemCode, unitCode, companyCode, req.username);
      return new GlobalResponseObject(true, 0, 'MRN Request has been created successfully');
    } catch (err) {
      await manager.releaseTransaction();
      mrnReqNumberLock ? mrnReqNumberLock.unlock() : null;
      lock ? lock.unlock() : null;
      poReqSerialLock ? poReqSerialLock.unlock() : null;
      throw err;
    }
  }

  async deleteMrnRequest(req: MrnIdStatusRequest): Promise<GlobalResponseObject> {
    const {unitCode, companyCode} = req;
    const manager = new GenericTransactionManager(this.dataSource);
    try {
      /**
       * If the MRN status is <> open then throw error 
       * delete the mrn request, its items and the po-docket material with the mrn id
      */
      const mrnDetails = await this.mrnRepo.findOne({where: {id: req.mrnId, unitCode, companyCode}});
      if (!mrnDetails) {
        throw new ErrorResponse(0, 'MRN details not found for the given request number');
      }
      if (mrnDetails.requestStatus != MrnStatusEnum.OPEN) {
        throw new ErrorResponse(0, 'MRN is already processed you cannot delete.');
      }
      const mrnId = mrnDetails.id;
      await manager.startTransaction();
      await this.mrnHelperService.removeMRNRollsFromTheMaterialRequest(mrnId, unitCode, companyCode, manager);
      await manager.getRepository(MrnEntity).delete({id: mrnId, unitCode, companyCode});
      await manager.getRepository(MrnItemEntity).delete({mrnId, unitCode, companyCode, isActive: true})
      await manager.completeTransaction();
      return new GlobalResponseObject(true, 0, 'MRN Request has been deleted successfully');
    } catch (err) {
      await manager.releaseTransaction();
      throw err;
    }
  }
}