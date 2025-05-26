import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { DataSource, In, Not } from "typeorm";
import { GenericTransactionManager } from "../../database/typeorm-transactions";
import { ErrorResponse } from "@xpparel/backend-utils";
import { PoRatioAttrRepository } from "../common/repository/po-ratio-attr.repository";
import { RollAttrRepository } from "../common/repository/roll-attr.repository";
import { PoDocketMaterialRequestRepository } from "./repository/po-docket-material-request.repository";
import { PoDocketMaterialRepository } from "./repository/po-docket-material.repository";
import { PoMaterialRequestRepository } from "./repository/po-material-request.repository";
import { DocketMaterialHelperService } from "./docket-material-helper.service";
import { DocketMaterialInfoService } from "./docket-material-info.service";
import { PoMaterialLockRepository } from "./repository/po-material-lock.repository";
import { PoMaterialLockEntity } from "./entity/po-material-lock.entity";
import moment from "moment";
import { ActualMarkerCreateRequest, ActualMarkerModel, ActualMarkerResponse, CommonRequestAttrs, DocMaterialAllocationRequest, GetActualMarkerRequest, GlobalResponseObject, LayIdRequest, LayItemIdRequest, LayingStatusEnum, MaterialLockEnum, MaterialRequestNoRequest, MrnStatusEnum, OnFloorConfirmedRollBarcodeRequest, OnFloorConfirmedRollIdsRequest, OnFloorRollIdsRequest, PoDocketGroupRequest, PoSerialRequest, RequestTypeEnum, RollAllocationStatusModel, RollAllocationStatusResponse, RollBasicInfoModel, RollIdConsumedQtyRequest, RollIdQtyRequest, RollIdRequest, RollIdsConsumptionRequest, RollIdsRequest, RollLocationEnum, RollLockEnum, RollReceivingConfirmationStatusEnum, WhFabReqItemStatusRequest, WhFabReqStatusRequest, WhMatReqLineItemStatusEnum, WhMatReqLineStatusEnum } from "@xpparel/shared-models";
import { dynamicRedlock, redlock } from "../../config/redis/redlock.config";
import { DocketGenerationInfoService } from "../docket-generation/docket-generation-info.service";
import { PoDocketMaterialEntity } from "./entity/po-docket-material.entity";
import { OnFloorRollsEntity } from "./entity/on-floor-rolls.entity";
import { OnFloorRollsRepository } from "./repository/on-floor-rolls.repository";
import { PoMaterialRequestEntity } from "./entity/po-material-request.entity";
import { PoDocketMaterialRequestEntity } from "./entity/po-docket-material-request.entity";
import { PoDocketLayItemEntity } from "../lay-reporting/entity/po-docket-lay-item.entity";
import { PoDocketEntity } from "../docket-generation/entity/po-docket.entity";
import { ActualMarkerEntity } from "./entity/actual-marker.entity";
import { ActualMarkerRepository } from "./repository/actual-marker.repository";
@Injectable()
export class DocketMaterialService {
  private lockMinutes = 6;
  constructor(
    private dataSource: DataSource,
    // private docMaterialInfoService: DocketMaterialInfoService,
    @Inject(forwardRef(() => DocketMaterialHelperService)) private docMaterialHelperService: DocketMaterialHelperService,
    private poMaterialReqRepo: PoMaterialRequestRepository,
    private poDocMaterialReqRepo: PoDocketMaterialRequestRepository,
    private poDocMaterialRepo: PoDocketMaterialRepository,
    private rollAttrRepo: RollAttrRepository,
    private materialLockRepo: PoMaterialLockRepository,
    @Inject(forwardRef(() => DocketGenerationInfoService)) private docketInfoService: DocketGenerationInfoService,
    private onFloorRollsRepo: OnFloorRollsRepository,
    @Inject(forwardRef(() => DocketMaterialInfoService)) private docMaterialInfoService: DocketMaterialInfoService,
    private actualMarkerRepo: ActualMarkerRepository
  ) {

  }

  /**
   * Service to save Po Material Lock 
   * @param itemCode 
   * @param unitCode 
   * @param companyCode 
   * @param userName 
   * @returns 
  */
  async savePoMaterialLock(itemCode: string, unitCode: string, companyCode: string, userName: string): Promise<PoMaterialLockEntity> {
    const lockEntity = new PoMaterialLockEntity();
    lockEntity.companyCode = companyCode;
    lockEntity.createdUser = userName;
    lockEntity.itemCode = itemCode;
    const currentDateTime = moment(new Date()).format('YYYY-MM-DD HH:mm');
    const addedTime = this.addMinutesToTheGivenTime(currentDateTime, this.lockMinutes);
    lockEntity.lockExpiryTime = addedTime;
    lockEntity.lockStatus = MaterialLockEnum.LOCK;
    lockEntity.unitCode = unitCode;
    return await this.materialLockRepo.save(lockEntity);

  }

  addMinutesToTheGivenTime(dateTimeString, minutes) {
    // Parse the input date-time string using moment
    const originalDateTime = moment(dateTimeString, 'YYYY-MM-DD HH:mm');

    // Add 6 minutes to the original date
    const newDateTime = originalDateTime.add(minutes, 'minutes');

    // Format the new date into "YYYY-MM-DD HH:mm" format
    const newDateTimeString = newDateTime.format('YYYY-MM-DD HH:mm');

    return newDateTimeString;
  }

  /**
   * Service to unlock the material from the lock stage
   * @param itemCode 
   * @param unitCode 
   * @param companyCode 
   * @param userName 
  */
  async unlockMaterial(itemCode: string, unitCode: string, companyCode: string, userName: string, lockId?: number) {
    if (!lockId) {
      await this.materialLockRepo.update({ itemCode, unitCode, companyCode }, { lockStatus: MaterialLockEnum.UNLOCK, updatedUser: userName });
    } else {
      await this.materialLockRepo.update({ itemCode, unitCode, companyCode, id: lockId }, { lockStatus: MaterialLockEnum.UNLOCK, updatedUser: userName });
    }

    return new GlobalResponseObject(true, 0, 'Material Unlocked successfully');
  }

  /**
   * Service to create docket material request for given docket number and rolls
   * @param req 
   * @returns 
  */
  async createDocketMaterialRequest(req: DocMaterialAllocationRequest): Promise<GlobalResponseObject> {
    const { unitCode, companyCode } = req;
    let lock = null;
    let poReqSerialLock = null;
    const manager = new GenericTransactionManager(this.dataSource);
    try {

      const info = await this.validatePreRequirementOfMaterialRequest(req, lock);
      const docketInfo = info.docketInfo;
      const rollInfo: RollBasicInfoModel[] = info.rollInfo;
      await manager.startTransaction();
      // save the actual marker info only if all the 3 necessary fields are provided
      if(req.aMarkerLength && req.aMarkerName && req.aMarkerWidth) {
        const actualReq = new ActualMarkerCreateRequest(req.username, req.unitCode, req.companyCode, req.userId, req.aMarkerName, req.aMarkerLength, req.aMarkerWidth, req.docketGroup)
        await this.createActualMarker(actualReq, manager);
      }
      const materialReqObj: PoMaterialRequestEntity = await this.createDocketMaterialRequestWithManager(req, rollInfo, poReqSerialLock, docketInfo, manager);
      await manager.completeTransaction();
      // NEED TO UNLOCK THE MATERIAL LOCK
      await this.unlockMaterial(docketInfo.itemCode, unitCode, companyCode, req.username);
      // trigger a job to create the records to the cut table planning 
      await this.docMaterialHelperService.createCutRequestPlanToOpenCutTable(materialReqObj.requestNumber, req.docketGroup, req.companyCode, req.unitCode, req.username);
      // const rollIdsReq = new RollIdsRequest(req.username, req.unitCode, req.companyCode, req.userId, req.rollsInfo.map(roll => roll.rollId));
      const consumedOn = moment(Date.now()).format('YYYY-MM-DD HH:MM:ss');  
      const rollIdsDocReq = new RollIdsConsumptionRequest(req.username, req.unitCode, req.companyCode, req.userId, req.rollsInfo.map(roll => roll.rollId), materialReqObj.requestNumber, RequestTypeEnum.NORMAL, consumedOn, false)
      await this.docMaterialHelperService.addJobForUpdatingAllocFabToExtSystem(rollIdsDocReq);
      // 
      return new GlobalResponseObject(true, 0, 'Material allocated successfully')
    } catch (err) {
      await manager.releaseTransaction();
      poReqSerialLock ? await poReqSerialLock.unlock() : null;
      lock ? await lock.unlock() : null;
      throw err;
    }
  }

  async validatePreRequirementOfMaterialRequest(req: DocMaterialAllocationRequest, lock: any): Promise<{ docketInfo: PoDocketEntity, rollInfo: RollBasicInfoModel[] }> {
    const { unitCode, companyCode } = req;
    // Need to check the material is in lock state or not
    const docketsInDocGroup = await this.docketInfoService.getDocketRecordsByDocGroup(req.docketGroup, companyCode, unitCode);
    if (docketsInDocGroup.length == 0) {
      throw new ErrorResponse(0, 'Docket information not found. Please check and try again');
    }
    const docketInfo = docketsInDocGroup[0]; // await this.docketInfoService.getDocketRecordByDocNumber(req.docketGroup, companyCode, unitCode);

    const lockInfo = await this.materialLockRepo.findOne({ where: { itemCode: docketInfo.itemCode, isActive: true, lockStatus: MaterialLockEnum.LOCK } });
    // if (!lockInfo) {
    //   throw new ErrorResponse(0, 'Some one already doing allocation for the same material. Please check and try again');
    // }
    // NEED TO GET ROLL BASIC INFO FROM WMS
    const rollInfoReq = new RollIdsRequest(req.username, unitCode, companyCode, req.userId, req.rollsInfo.map(roll => roll.rollId));
    const rollInfo: RollBasicInfoModel[] = await this.docMaterialHelperService.getRollsBasicInfoForRollIds(rollInfoReq);
    for (const eachRoll of req.rollsInfo) {
      const basicInfo = rollInfo.find(roll => roll.rollId == eachRoll.rollId);
      if (!basicInfo) {
        throw new ErrorResponse(0, `Roll ${eachRoll.rollId} not found in packing list . Please verify`)
      }
      /*Disabling lock status due to partial allocation 20240515*/
      // const docMaterialItem = await this.poDocMaterialRepo.findOne({ where: { rollId: eachRoll.rollId, unitCode, companyCode, rollLockStatus: RollLockEnum.LOCK } });
      // if (docMaterialItem) {
      //   throw new ErrorResponse(0, `The roll ${eachRoll.rollBarcode} is already locked by someone Please check and try again`);
      // }
    }
    const allocatingQty = req.rollsInfo.reduce((pre, current) => {
      return pre + current.allocatedQauntity;
    }, 0)
    // CHECK THE DOCKET EXISTS IN ANY OTHER MATERIAL REQUEST OR NOT, IF YES NEED TO THROW ERROR SAYING ALREADY REQUEST RAISED FOR THE DOCKET
    const docketMaterialRequests = await this.poDocMaterialRepo.find({ where: { docketGroup: req.docketGroup, unitCode, companyCode, isActive: true } });
    const allocatedQty = docketMaterialRequests?.reduce((pre, current) => {
      return pre + current.requestedQuantity;
    }, 0)
    // This validation has to be corrected based on the MRN and by getting the proper requirement for the docket
    // if ((allocatedQty + allocatingQty) > (docketInfo.materialRequirement)) {
    //   throw new ErrorResponse(0, 'You are trying to allocate more that requirement . Please check and try again');
    // }
    // NEED TO APPLY A LOCK FOR THE MATERIAL CODE, IF LOCK ALREADY EXISTS SHOULD THROW ERROR SAYING ANOTHER PERSON WORKING ON SAME MATERIAL
    const lockPoMaterial = `LOCK_ALLOC_MATERIAL:${docketInfo.itemCode}`;
    const ttl = 120000;
    // Apply a lock for the sub po to ensure the creation of serial number for the Master PO 
    lock = await dynamicRedlock.lock(lockPoMaterial, ttl).catch(error => {
      throw new ErrorResponse(0, 'Someone already triggered Docket generation / deletion / confirmation. Please try again');
    });
    await lock.unlock();
    lock = null;
    return {
      docketInfo: docketInfo,
      rollInfo: rollInfo
    }
  }

  async createDocketMaterialRequestWithManager(req: DocMaterialAllocationRequest, rollInfo: RollBasicInfoModel[], poReqSerialLock: any, docketInfo: PoDocketEntity, manager: GenericTransactionManager): Promise<PoMaterialRequestEntity> {
    console.log(req);
    const { unitCode, companyCode } = req;
    for (const eachRoll of req.rollsInfo) {
      // Need to save the Docket Requests
      // Need to check the roll is existing in the on floor or not. If yet need to get the consumed quantity and subtract it from the rolls original quantity and give it for the allocation
      // TODO: Change the consumed qty to get it from the docket-material entity. Since on-floor rolls is just used for a track of records dont rely on it
      const onFloorInfo: OnFloorRollsEntity[] = await this.onFloorRollsRepo.find({ where: { rollId: eachRoll.rollId, rollBarcode: eachRoll.rollBarcode } });
      let consumedQty = 0;
      for (const onFloorRoll of onFloorInfo) {
        consumedQty += onFloorRoll.consumedQuantity;
      };
      const basicInfo = rollInfo.find(roll => roll.rollId == eachRoll.rollId);
      if (eachRoll.allocatedQauntity > (basicInfo.originalQty - consumedQty)) {
        throw new ErrorResponse(0, `Allocating more quantity than available quantity for the Roll ${eachRoll.rollId} `);
      }
    }
    let materialReqObj = null;
    // NEED TO GET THE LATEST REQUEST NUMBER USING RED LOCK   
    if (!req.mrnRequestId) {
      materialReqObj = new PoMaterialRequestEntity();
      materialReqObj.companyCode = companyCode;
      materialReqObj.createdUser = req.username;
      materialReqObj.poSerial = req.poSerial;
      const lockPoReqSerial = `LOCK_PO_REQ_SERIAL:${req.docketGroup}-${req.unitCode}-${req.companyCode}`;
      var ttlReqSerial = 120000;
      poReqSerialLock = await redlock.lock(lockPoReqSerial, ttlReqSerial);
      let latestSerial: number = await this.poMaterialReqRepo.getMaxRequestNumberByPoSerial(req.poSerial, unitCode, companyCode);
      await poReqSerialLock.unlock();
      poReqSerialLock = null;
      materialReqObj.requestNumber = `${req.poSerial}-${++latestSerial}`;
      materialReqObj.requestStatus = WhMatReqLineStatusEnum.OPEN;
      materialReqObj.unitCode = unitCode;
      await manager.getRepository(PoMaterialRequestEntity).save(materialReqObj);
      const poDocMaterialReqObj = new PoDocketMaterialRequestEntity();
      poDocMaterialReqObj.companyCode = companyCode;
      poDocMaterialReqObj.createdUser = req.username;
      poDocMaterialReqObj.docketGroup = req.docketGroup;
      poDocMaterialReqObj.itemCode = docketInfo.itemCode;
      poDocMaterialReqObj.poSerial = req.poSerial;
      poDocMaterialReqObj.requestNumber = materialReqObj.requestNumber;
      poDocMaterialReqObj.requestStatus = WhMatReqLineStatusEnum.OPEN;
      poDocMaterialReqObj.unitCode = req.unitCode;
      poDocMaterialReqObj.requestedQuantity = req.rollsInfo.reduce((pre, cur) => {
        return pre + cur.allocatedQauntity;
      }, 0)
      await manager.getRepository(PoDocketMaterialRequestEntity).save(poDocMaterialReqObj);
    } else {        
      materialReqObj = await this.poDocMaterialRepo.findOne({ where: { docketGroup: req.docketGroup, unitCode, companyCode } });
    }
    for (const eachAllocatedRoll of req.rollsInfo) {
      const basicInfo = rollInfo.find(roll => roll.rollId == eachAllocatedRoll.rollId);
      const docMaterialObj = new PoDocketMaterialEntity();
      docMaterialObj.companyCode = companyCode;
      docMaterialObj.docketGroup = req.docketGroup;
      docMaterialObj.itemCode = docketInfo.itemCode;
      docMaterialObj.lotNo = basicInfo.lot;
      docMaterialObj.poSerial = req.poSerial;
      docMaterialObj.requestNumber = materialReqObj.requestNumber;
      docMaterialObj.requestStatus = WhMatReqLineItemStatusEnum.OPEN;
      docMaterialObj.requestedQuantity = eachAllocatedRoll.allocatedQauntity;
      docMaterialObj.rollBarcode = eachAllocatedRoll.rollBarcode;
      docMaterialObj.rollId = eachAllocatedRoll.rollId;
      docMaterialObj.rollLockStatus = RollLockEnum.LOCK;
      docMaterialObj.unitCode = unitCode;
      docMaterialObj.mrnId = req.mrnRequestId ? req.mrnRequestId : 0;
      await manager.getRepository(PoDocketMaterialEntity).save(docMaterialObj);
    } 
    return materialReqObj;
  }

  /**
   * Service to delete docket material requests for given request number
   * @param req 
   * @returns 
  */
  async deleteDocketMaterialRequest(req: MaterialRequestNoRequest): Promise<GlobalResponseObject> {
    const manager = new GenericTransactionManager(this.dataSource);
    try {
      if (!req.docketGroup || !req.materialRequestNo) {
        throw new ErrorResponse(0, 'Docket number and material request number are mandatory');
      }
      const { unitCode, companyCode } = req;
      const poDocMaterialReq = await this.poDocMaterialReqRepo.findOne({ where: { docketGroup: req.docketGroup, unitCode, companyCode, isActive: true, requestNumber: req.materialRequestNo } });
      if (!poDocMaterialReq) {
        throw new ErrorResponse(0, 'Requests not found for the given docket');
      }
      // if the warehouse team already started working on this request , we must not encourage any changes
      if (poDocMaterialReq.requestStatus != WhMatReqLineStatusEnum.OPEN) {
        throw new ErrorResponse(0, 'Warehouse team already started working on the request. You cannot modify now');
      }
      // SAFE SIDE VALIDATION IF THE WH VALIDATION SKIPS FOR SOME REASON
      // check if the laying is started for the docket. If so then dont allow to delete the request
      const layedRecords = await this.docMaterialHelperService.getLayingRecordsForDocketGroups([req.docketGroup], req.companyCode, req.unitCode);
      layedRecords.forEach(r => {
        if (r.layingStatus != LayingStatusEnum.OPEN) {
          throw new ErrorResponse(0, 'Laying operation is already started. You cannot modify now');
        }
      });
      const rollDetails = await this.poDocMaterialRepo.find({ where: { requestNumber: req.materialRequestNo, unitCode, companyCode } });
      const rollIds = rollDetails.map(roll => roll.rollId);
      await manager.startTransaction();
      await this.deleteDocketMaterialRequestWithManager(req, poDocMaterialReq.itemCode, manager);
      await manager.getRepository(ActualMarkerEntity).delete({ docketGroup: req.docketGroup, companyCode: req.companyCode, unitCode: req.unitCode});
      await manager.completeTransaction();
      // Need to update the allocated quantity 
      const consumedOn = moment(Date.now()).format('YYYY-MM-DD HH:MM:ss'); 
      const rollIdsDocReq = new RollIdsConsumptionRequest(req.username, req.unitCode, req.companyCode, req.userId, req.rollsInfo.map(roll => roll.rollId), req.materialRequestNo, RequestTypeEnum.NORMAL, consumedOn, false)
      // const rollIdsReq = new RollIdsRequest(req.username, req.unitCode, req.companyCode, req.userId, rollIds);
      await this.docMaterialHelperService.addJobForUpdatingAllocFabToExtSystem(rollIdsDocReq);
      await this.unlockMaterial(poDocMaterialReq.itemCode, unitCode, companyCode, req.username);
      return new GlobalResponseObject(true, 0, 'Docket Request deleted successfully');
    } catch (err) {
      await manager.releaseTransaction();
      throw err;
    }
  }

  async deleteDocketMaterialRequestWithManager(req: MaterialRequestNoRequest, itemCode: string, manager: GenericTransactionManager): Promise<boolean> {
    const { unitCode, companyCode } = req;
    await manager.getRepository(PoMaterialRequestEntity).delete({ requestNumber: req.materialRequestNo, unitCode, companyCode });
    await manager.getRepository(PoDocketMaterialRequestEntity).delete({ requestNumber: req.materialRequestNo, unitCode, companyCode });
    await manager.getRepository(PoDocketMaterialEntity).delete({ requestNumber: req.materialRequestNo, unitCode, companyCode });

    // also delete the cut table plan record 
    await this.docMaterialHelperService.deleteDocketsFromDocPlan(req.materialRequestNo, req.docketGroup, req.companyCode, req.unitCode, req.username, manager);
    return true;
  }

  /**
   * 
   * CURRENTLY NOT BEING USED
   * Service to delete rolls from material request
   * @param req 
   * @returns 
  */
  async deleteRollInDocketMaterialRequest(req: MaterialRequestNoRequest): Promise<GlobalResponseObject> {
    const manager = new GenericTransactionManager(this.dataSource);
    try {
      const { unitCode, companyCode } = req;
      // TODO: Need to validate that docket is lay reported or not
      const poDocMaterialReq = await this.poDocMaterialReqRepo.find({ where: { docketGroup: req.docketGroup, unitCode, companyCode, isActive: true } });
      if (!poDocMaterialReq.length) {
        throw new ErrorResponse(0, 'Requests not found for the given docket');
      }
      // if the request is already planned to a cut table, then we should not allow any change in the allocated rolls
      const docPlanRec = await this.docMaterialHelperService.getDocketRequestPlanRecord(req.materialRequestNo, req.docketGroup, req.companyCode, req.unitCode);
      if (docPlanRec?.resourceId) {
        throw new ErrorResponse(0, `The request ${req.materialRequestNo} is already planned to cut table ${docPlanRec.resourceDesc}`);
      }
      // Safety check : if the material status is changed for the docket, we cannot de allocate the material
      const matReqRec = await this.poDocMaterialReqRepo.findOne({ select: ['requestStatus'], where: { docketGroup: req.docketGroup, requestNumber: req.materialRequestNo, unitCode: req.unitCode, companyCode: req.companyCode } });
      if (matReqRec.requestStatus != WhMatReqLineStatusEnum.OPEN) {
        throw new ErrorResponse(0, 'Warehouse already started working on this request. You cannot modify now');
      }
      await manager.startTransaction();
      for (const eachRoll of req.rollsInfo) {
        await manager.getRepository(PoDocketMaterialEntity).delete({ requestNumber: req.materialRequestNo, unitCode, companyCode, rollId: eachRoll.rollId });
      }
      // Check rolls are there or not for that request, If not rolls need to delete entire request
      const poDocMaterials = await manager.getRepository(PoDocketMaterialEntity).find({ where: { docketGroup: req.docketGroup, requestNumber: req.materialRequestNo, unitCode, companyCode, isActive: true } });
      if (poDocMaterials.length == 0) {
        await this.deleteDocketMaterialRequestWithManager(req, poDocMaterialReq[0].itemCode, manager);
      }
      await manager.completeTransaction();
      await this.unlockMaterial(poDocMaterialReq[0].itemCode, unitCode, companyCode, req.username);
      return new GlobalResponseObject(true, 0, 'Docket Request deleted successfully');
    } catch (err) {
      await manager.releaseTransaction();
      throw err;;
    }
  }


  /**
   * UPDATER
   * Called from the WMS
   * Updates the docket material request status. 
   * @param req 
   */
  async changeDocketMaterialReqStatus(req: WhFabReqStatusRequest): Promise<GlobalResponseObject> {
    let transManager = new GenericTransactionManager(this.dataSource);
    try {
      const docReq = await this.poDocMaterialReqRepo.findOne({ where: { companyCode: req.companyCode, unitCode: req.unitCode, requestNumber: req.materialRequestNo } });
      if (!docReq) {
        throw new ErrorResponse(0, `No docket is found mapped to the request no ${req.materialRequestNo} `);
      }
      const incomingStatus = req.status;
      // TODO: Valiations based on the incoming material status. and cut reporting
      await transManager.startTransaction();
      await transManager.getRepository(PoDocketMaterialRequestEntity).update({ companyCode: req.companyCode, unitCode: req.unitCode, requestNumber: req.materialRequestNo }, { requestStatus: incomingStatus });
      const itemStatus = this.getMaterialReqItemStatusByMaterialReqStatus(req.status);
      await transManager.getRepository(PoDocketMaterialEntity).update({ companyCode: req.companyCode, unitCode: req.unitCode, requestNumber: req.materialRequestNo }, { requestStatus: itemStatus });
      await transManager.completeTransaction();
      if (req.status == WhMatReqLineStatusEnum.MATERIAL_ISSUED) {
        const dockMaterReqLines = await this.poDocMaterialRepo.find({ select: ['rollId','updatedAt'], where: { requestNumber: req.materialRequestNo, unitCode: req.unitCode, companyCode: req.companyCode, requestStatus: WhMatReqLineItemStatusEnum.MATERIAL_ISSUED } });
        for (const eachRollReq of dockMaterReqLines) {
          const issuanceDate=moment(eachRollReq.updatedAt).format('YYYY-MM-DD HH:mm:ss');
          const rollIdsDocReq = new RollIdsConsumptionRequest(req.username, req.unitCode, req.companyCode, req.userId, [eachRollReq.rollId], req.materialRequestNo, RequestTypeEnum.NORMAL, issuanceDate, false)
          await this.docMaterialHelperService.addJobForUpdatingIssuedFabToExtSystem(rollIdsDocReq);
        }
      }
      return new GlobalResponseObject(true, 0, `Docket material status changed to ${req.status} successfully`);
    } catch (error) {
      await transManager.releaseTransaction();
      throw error;
    }
  }


   /**
   * UPDATER
   * Called from the WMS
   * Updates the docket material request status. 
   * @param req 
   */
   async changeDocketMaterialReqStatusOfMRN(userName: string, userId: number, companyCode: string, unitCode: string, materialRequestNo: number, status : WhMatReqLineStatusEnum, mrnStatus: MrnStatusEnum, manager: GenericTransactionManager): Promise<RollIdsConsumptionRequest[]> {
    const jobObjects = [];
      const incomingStatus = status;
      const itemStatus = this.getMaterialReqItemStatusByMaterialReqStatus(status);
      await manager.getRepository(PoDocketMaterialEntity).update({ companyCode: companyCode, unitCode: unitCode, mrnId: materialRequestNo }, { requestStatus: itemStatus });
      const dockMaterReqLines = await this.poDocMaterialRepo.find({ select: ['rollId','updatedAt'], where: { mrnId: materialRequestNo, unitCode: unitCode, companyCode: companyCode } });
      if(mrnStatus==MrnStatusEnum.REJECTED){
          for (const eachRollReq of dockMaterReqLines) {
          const issuanceDate=moment(eachRollReq.updatedAt).format('YYYY-MM-DD HH:mm:ss');
          const rollIdsDocReq = new RollIdsConsumptionRequest(userName, unitCode, companyCode, userId, [eachRollReq.rollId], materialRequestNo.toString(), RequestTypeEnum.MRN, issuanceDate , true);
          // console.log(rollIdsDocReq);
          jobObjects.push(rollIdsDocReq);
          // await this.docMaterialHelperService.addJobForUpdatingAllocFabToExtSystem(rollIdsDocReq);
        }
      }else{
        for (const eachRollReq of dockMaterReqLines) {
          const issuanceDate=moment(eachRollReq.updatedAt).format('YYYY-MM-DD HH:mm:ss');
          const rollIdsDocReq = new RollIdsConsumptionRequest(userName, unitCode, companyCode, userId, [eachRollReq.rollId], materialRequestNo.toString(), RequestTypeEnum.MRN, issuanceDate , false);
          // console.log(rollIdsDocReq);
          jobObjects.push(rollIdsDocReq);
          // await this.docMaterialHelperService.addJobForUpdatingIssuedFabToExtSystem(rollIdsDocReq);
        }
      }      
      return jobObjects;
  }

  getMaterialReqItemStatusByMaterialReqStatus(matReqStatus: WhMatReqLineStatusEnum): WhMatReqLineItemStatusEnum {
    switch (matReqStatus) {
      case WhMatReqLineStatusEnum.MATERIAL_ISSUED: return WhMatReqLineItemStatusEnum.MATERIAL_ISSUED;
        break;
      case WhMatReqLineStatusEnum.PREPARING_MATERIAL: return WhMatReqLineItemStatusEnum.PREPARING_MATERIAL;
        break;
      default: return WhMatReqLineItemStatusEnum.OPEN;
    }
  }

  /**
   * UPDATER
   * Called from the WMS
   * Updates the docket material individual status. 
   * @param req 
   */
  async changeDocketMaterialStatus(req: WhFabReqItemStatusRequest): Promise<GlobalResponseObject> {
    let transManager = new GenericTransactionManager(this.dataSource);
    try {
      console.log(req);
      if (req.itemIds?.length == 0) {
        throw new ErrorResponse(0, 'Roll ids are not provided for the status change');
      }
      const docReq = await this.poDocMaterialReqRepo.findOne({ where: { companyCode: req.companyCode, unitCode: req.unitCode, requestNumber: req.materialRequestNo } });
      if (!docReq) {
        throw new ErrorResponse(0, `No docket is found mapped to the request no ${req.materialRequestNo} `);
      }
      const incomingStatus = req.status;
      // TODO: Valiations based on the incoming material status. and cut reporting
      await transManager.startTransaction();
      await transManager.getRepository(PoDocketMaterialEntity).update({ companyCode: req.companyCode, unitCode: req.unitCode, requestNumber: req.materialRequestNo, rollId: In(req.itemIds) }, { requestStatus: incomingStatus });
      await transManager.completeTransaction();
      return new GlobalResponseObject(true, 0, `Docket material item status changed to ${req.status} successfully`);
    } catch (error) {
      await transManager.releaseTransaction();
      throw error;
    }
  }

  /**
   * TODO: Need to thinl of scenarios once MRN funcionality is done
   * WRITER
   * BULL JOB CONSUMER
   * This is called after cut reporting
   * @param req 
   * @returns 
   */
  async releaseLockedRollsOfDocketToOnFloor(req: LayIdRequest): Promise<GlobalResponseObject> {
    // pre validations: 
    //    1.enssure all the rolls in this lay are in the lock status in the docket-material
    // get all the rolls associated with the lay from the lay-reporting
    // calculate the consumed qty of every layed roll
    // update the consumed qty into the docket-material
    // create the roll record in the on-floor rolls
    // STRICT NOTE: Once cut reporting is done for a docket, all the rolls allocated to it (po-docket-material) will be released to on roll irrespective of the case whether they are utilized or not. The consumed qty will be calculated from the po-docket-lay-item 
    const transManager = new GenericTransactionManager(this.dataSource);
    let lock;
    try {
      console.log(req);
      const layRecord = await this.docMaterialHelperService.getLayingRecordForLayId(req.layId, req.companyCode, req.unitCode);
      if (!layRecord) {
        throw new ErrorResponse(0, 'Laying record is not found');
      }
      const layedRolls = await this.docMaterialHelperService.getLayingRollRecordsForLayId(req.layId, req.unitCode, req.companyCode);
      if (layedRolls.length == 0) {
        throw new ErrorResponse(0, 'Layed rolls does not exist for the docket');
      }
      const layRollInfoMap = new Map<number, PoDocketLayItemEntity>();
      const rollBarcodes = layedRolls.map(roll => roll.rollBarcode);
      const rollIds = layedRolls.map(roll => roll.rollId);
      layedRolls.forEach(r => layRollInfoMap.set(r.rollId, r));

      const onFloorRollEnts: OnFloorRollsEntity[] = [];
      const poDocketMaterials = await this.poDocMaterialRepo.find({ where: { docketGroup: layRecord.docketGroup, rollId: In(rollIds), rollBarcode: In(rollBarcodes) } });

      const lockKey = `ONFLOOR-${layRecord.docketGroup}`;
      var ttl = 120000;
      lock = await redlock.lock(lockKey, ttl);

      await transManager.startTransaction();
      for (const allocatedRoll of poDocketMaterials) {
        if (allocatedRoll.rollLockStatus == RollLockEnum.LOCK) {
          // if the roll is locked, then insert the roll into the on-floor-rolls

          // before creating check if the roll is already released to the on floor for the laying entity + docket
          const onFloorRoll = await this.onFloorRollsRepo.findOne({ select: ['id'], where: { companyCode: req.companyCode, unitCode: req.unitCode, rollBarcode: allocatedRoll.rollBarcode, rollId: allocatedRoll.rollId, poDocketLayId: req.layId, docketGroup: layRecord.docketGroup } });
          if (!onFloorRoll) {
            // This means still the roll is not yet released to the floor
            const onFloorRollEnt = new OnFloorRollsEntity();
            onFloorRollEnt.companyCode = req.companyCode;
            onFloorRollEnt.unitCode = req.unitCode;
            onFloorRollEnt.createdUser = req.username;
            // TODO: Formula for the consumed qty is yet to be implemented
            const consumedRoll = layRollInfoMap.get(allocatedRoll.rollId);
            const rollConumedQty = allocatedRoll.requestedQuantity;
            // If the allocated roll is layed then caluculate the consumed qty
            if (consumedRoll) {
              onFloorRollEnt.consumedQuantity = rollConumedQty;
            } else {
              onFloorRollEnt.consumedQuantity = 0;
            }
            onFloorRollEnt.docketMaterialId = allocatedRoll.id;
            onFloorRollEnt.rollBarcode = allocatedRoll.rollBarcode;
            onFloorRollEnt.rollId = allocatedRoll.rollId;
            onFloorRollEnt.poDocketLayId = req.layId;
            onFloorRollEnt.docketGroup = layRecord.docketGroup;
            onFloorRollEnt.rollLocation = RollLocationEnum.ONFLOOR;
            onFloorRollEnt.lotNo = allocatedRoll.lotNo;
            onFloorRollEnt.poSerial = layRecord.poSerial;
            onFloorRollEnts.push(onFloorRollEnt);

            // update the consumed qty to the docket material
            await transManager.getRepository(PoDocketMaterialEntity).update({ companyCode: req.companyCode, unitCode: req.unitCode, id: allocatedRoll.id, docketGroup: allocatedRoll.docketGroup, rollId: allocatedRoll.rollId, rollBarcode: allocatedRoll.rollBarcode }, { consumedQuantity: rollConumedQty });
          }
        }
      }
      await transManager.getRepository(OnFloorRollsEntity).save(onFloorRollEnts, { reload: false });
      await transManager.completeTransaction();
      await lock.unlock();
      lock = null;
      return new GlobalResponseObject(true, 0, `Locked rolls released for the lay id : ${req.layId}. Total count: ${onFloorRollEnts.length}`);
    } catch (error) {
      await transManager.releaseTransaction();
      lock ? await lock.unlock() : null;
      throw error;
    }
  }

  /**
   * HELPER: Service to remove the MRN requested rolls from the material request 
   * @param mrnId 
   * @param unitCode 
   * @param companyCode 
   * @param manager 
   * @returns 
  */
  async removeMRNRollsFromTheMaterialRequest(mrnId: number, unitCode: string, companyCode: string, manager: GenericTransactionManager): Promise<boolean> {
    await manager.getRepository(PoDocketMaterialEntity).delete({ mrnId, unitCode, companyCode, isActive: true });
    return true;
  }

  /**
   * HELPER: Service to remove the MRN requested rolls from the material request 
   * @param rollId 
   * @param unitCode 
   * @param companyCode 
   * @param manager 
   * @returns 
  */
  async removeMRNRollFromTheMaterialRequestByRoll(mrnId: number, rollId: number, unitCode: string, companyCode: string, manager: GenericTransactionManager): Promise<boolean> {
    await manager.getRepository(PoDocketMaterialEntity).delete({ mrnId, rollId, unitCode, companyCode, isActive: true });
    return true;
  }

  /**
   * Service to change the roll location status for the given rolls
   * @param req 
   * @returns 
  */
  async changeRollLocation(req: OnFloorRollIdsRequest): Promise<GlobalResponseObject> {
    const { unitCode, companyCode } = req;
    const manager = new GenericTransactionManager(this.dataSource);
    try {
      const onFloorRollInfo = await this.onFloorRollsRepo.find({ where: { id: In(req.onFloorRollIds), unitCode, companyCode, isActive: true } });
      await manager.startTransaction();
      for (const eachOnFloorRoll of onFloorRollInfo) {
        req.reason = req.reason ?? 0;
        await manager.getRepository(OnFloorRollsEntity).update({ id: eachOnFloorRoll.id }, { rollLocation: req.status, reasonId: req.reason });
        // await manager.getRepository(PoDocketMaterialEntity).update({ docketGroup: eachOnFloorRoll.docketGroup, rollId: eachOnFloorRoll.rollId, rollLockStatus: RollLockEnum.LOCK }, { rollLockStatus: RollLockEnum.UNLOCK })
      }
      await manager.completeTransaction();
      return new GlobalResponseObject(true, 0, 'Roll Location Changed Successfully')
    } catch (err) {
      await manager.releaseTransaction();
      throw err;
    }
  }


  /**
   * Service to confirm that the roll barcode been received by the WH team
   * @param req 
   */
  async confirmRollPresenceByBarcode(req: OnFloorConfirmedRollBarcodeRequest): Promise<GlobalResponseObject> {
    // first check if the roll barcode is readily there in the on floor rolls and it has any quantity left within it
    const onFloorRoll = await this.onFloorRollsRepo.findOne({ where: { companyCode: req.companyCode, unitCode: req.unitCode, rollBarcode: req.rollBarcode, isActive: true, rollLocation: Not(RollLocationEnum.ONFLOOR), rollRcConfirmationStatus: Not(RollReceivingConfirmationStatusEnum.RECEIVED) } });
    if (!onFloorRoll) {
      throw new ErrorResponse(0, 'The Roll associated with the barocde is not found on the floor');
    }
    // now check if it really has left over qty
    const onFloorRollConsQtyRecs = await this.onFloorRollsRepo.getOnFloorRollsTotalConsumedQty(req.companyCode, req.unitCode, [onFloorRoll.rollId]);
    const consumedQty = onFloorRollConsQtyRecs[0].consumed_qty;

    const rollInfoReq = new RollIdsRequest(req.username, req.unitCode, req.companyCode, req.userId, [onFloorRoll.rollId]);
    const rollInfo: RollBasicInfoModel[] = await this.docMaterialHelperService.getRollsBasicInfoForRollIds(rollInfoReq);
    const currRollInfo = rollInfo[0];
    if (Number(currRollInfo.originalQty) - Number(consumedQty) <= 0) {
      throw new ErrorResponse(0, 'The Roll associated with the barocde is completely utilized');
    }
    // now finally call the confirmRollPresence
    const onFloorConfReq = new OnFloorConfirmedRollIdsRequest(req.username, req.unitCode, req.companyCode, req.userId, [onFloorRoll.id], req.confirmationStatus, req.remarks);
    return await this.confirmRollPresence(onFloorConfReq);
  }

  /**
   * Service to confirm that the roll has been received by the WH team
   * @param req 
   * @returns 
  */
  async confirmRollPresence(req: OnFloorConfirmedRollIdsRequest): Promise<GlobalResponseObject> {
    const { unitCode, companyCode } = req;
    const manager = new GenericTransactionManager(this.dataSource);
    try {
      const onFloorRollInfo = await this.onFloorRollsRepo.find({ where: { id: In(req.onFloorRollIds), unitCode, companyCode, isActive: true } });
      await manager.startTransaction();
      for (const eachOnFloorRoll of onFloorRollInfo) {
        await manager.getRepository(OnFloorRollsEntity).update({ id: eachOnFloorRoll.id }, { rollRcConfirmationStatus: req.confirmationStatus });
        if (req.confirmationStatus == RollReceivingConfirmationStatusEnum.RECEIVED) {
          // if received by the WH team, then unlock the specific roll
          await manager.getRepository(PoDocketMaterialEntity).update({ docketGroup: eachOnFloorRoll.docketGroup, rollId: eachOnFloorRoll.rollId, rollLockStatus: RollLockEnum.LOCK }, { rollLockStatus: RollLockEnum.UNLOCK })
        }
      }
      await manager.completeTransaction();
      return new GlobalResponseObject(true, 0, 'Roll presence at the location confirmed successfully')
    } catch (err) {
      await manager.releaseTransaction();
      throw err;
    }
  }

  /**
   * Service To update allocated quantity by roll Ids
   * @param rollIds 
   * @param unitCode 

   * @param companyCode 
   * @param userName 
  */
  async updateAllocatedQtyByRollIds(rollIds: number[], unitCode: string, companyCode: string, userName: string, requestNumber: string, requestType : RequestTypeEnum, lastIssuanceDate: string, isReversal: boolean): Promise<GlobalResponseObject> {
    const transManager = new GenericTransactionManager(this.dataSource);
    try {
      const rollReversedQtyMap = new Map<number, number>();
      await transManager.startTransaction();    
      for (const eachRoll of rollIds) { 
        let allocatedFortheRoll=0;
        if(isReversal){
          allocatedFortheRoll = -(await this.docMaterialInfoService.getAllocatedQtyByRollandRequestNumber(eachRoll, unitCode, companyCode, requestNumber, requestType));
          await this.removeMRNRollFromTheMaterialRequestByRoll(Number(requestNumber), eachRoll, unitCode, companyCode, transManager);
          if (!rollReversedQtyMap.has(eachRoll)) {
            rollReversedQtyMap.set(eachRoll, allocatedFortheRoll);
          }
        } else {
          allocatedFortheRoll = await this.docMaterialInfoService.getAllocatedQtyByRollandRequestNumber(eachRoll, unitCode, companyCode, requestNumber, requestType);
          if (!rollReversedQtyMap.has(eachRoll)) {
            rollReversedQtyMap.set(eachRoll, allocatedFortheRoll);
          }
        }     
      }
      await transManager.completeTransaction(); 
      for (const [rollId, qty] of rollReversedQtyMap) {
        const totalAllocatedQty = await this.docMaterialInfoService.getAllocatedQtyByRollId(rollId, unitCode, companyCode);
        const consumedOn = moment(Date.now()).format('YYYY-MM-DD HH:MM');
        const rollQtyReq = new RollIdConsumedQtyRequest(userName, unitCode, companyCode, null, rollId, totalAllocatedQty, lastIssuanceDate, requestNumber, qty, requestType);
        // console.log(rollId+'---rollid');
        // console.log(totalAllocatedQty+'---rollid tot');
        // console.log(qty+'---rollid qty');
        await this.docMaterialHelperService.updateTheAllocatedStock(rollQtyReq)
      }
      return new GlobalResponseObject(true, 0, 'Allocated quantity updated successfully for given roll Ids')
    } catch (err) {
      transManager ? transManager.releaseTransaction() : null;
      throw err;
    }
    
  }




  /**
   * Service To update Issued quantity by roll Ids
   * @param rollIds 
   * @param unitCode 
   * @param companyCode 
   * @param userName 
  */
  async updateIssuedQtyByRollIds(rollIds: number[], unitCode: string, companyCode: string, userName: string, requestNumber: string, requestType : RequestTypeEnum, lastIssuanceDate: string, isReversal: boolean): Promise<GlobalResponseObject> {    
    
    for (const eachRoll of rollIds) {
      const totalIssuedQty = await this.docMaterialInfoService.getIssuedQtyByRoll(eachRoll, unitCode, companyCode);
      const issuingQtyForTheRoll = await this.docMaterialInfoService.getIssuedQtyByRollandRequestNumber(eachRoll, unitCode, companyCode, requestNumber, requestType);
      console.log(totalIssuedQty + '---------------------------First-------------------------------------');
      console.log(issuingQtyForTheRoll + '-------------------------Second---------------------------------------');

      const consumedOn = moment(Date.now()).format('YYYY-MM-DD HH:MM');
      // const rollQtyReq = new RollIdQtyRequest(userName, unitCode, companyCode, null, eachRoll, allocatedQtyForTheRoll, consumedOn);
      const rollQtyReq = new RollIdConsumedQtyRequest(userName, unitCode, companyCode, null, eachRoll, totalIssuedQty, lastIssuanceDate, requestNumber, issuingQtyForTheRoll, requestType);
      await this.docMaterialHelperService.updateTheIssuedStock(rollQtyReq)
    }
    return new GlobalResponseObject(true, 0, 'Allocated quantity updated successfully for given roll Ids')
  }

  // This is called to get the alloation status of the roll. i.e to check the various statuses of the roll
  // READER
  async getRollAllocationstatus(req: RollIdRequest): Promise<RollAllocationStatusResponse> {
    if (!req.rollId) {
      throw new ErrorResponse(0, 'Roll id is not provided');
    }
    const rollAllocRecords = await this.poDocMaterialRepo.find({ select: ["requestStatus"], where: { rollBarcode: req.barcode, rollId: req.rollId, unitCode: req.unitCode, companyCode: req.companyCode } });
    if (rollAllocRecords.length == 0) {
      return new RollAllocationStatusResponse(true, 0, 'Roll Id is not allocated to any docket', []);
    }
    const rollStatusForRollBarcode: WhMatReqLineItemStatusEnum[] = [];
    rollAllocRecords.map(d => {
      rollStatusForRollBarcode.push(d.requestStatus);
    })
    const rollAllocModel = new RollAllocationStatusModel(req.rollId, req.companyCode, rollStatusForRollBarcode);
    // let checkStatus = [WhMatReqLineItemStatusEnum.MATERIAL_IN_TRANSIT,WhMatReqLineItemStatusEnum.MATERIAL_NOT_AVL,WhMatReqLineItemStatusEnum.MATERIAL_ON_TROLLEY,WhMatReqLineItemStatusEnum.MATERIAL_READY,WhMatReqLineItemStatusEnum.OPEN,WhMatReqLineItemStatusEnum.PREPARING_MATERIAL,WhMatReqLineItemStatusEnum.REACHED_DESITNATION];
    // let result = checkStatus.some(rollBarcodeStatus => rollStatusForRollBarcode.includes(rollBarcodeStatus));
    return new RollAllocationStatusResponse(true, 0, 'Roll Id allocation retrieved', [rollAllocModel]);
  }


  async createActualMarker(reqObj: ActualMarkerCreateRequest, incomingTransManager: GenericTransactionManager): Promise<boolean> {
    const transManager = incomingTransManager ? incomingTransManager : new GenericTransactionManager(this.dataSource);
    try {
      if(!incomingTransManager) {
        await transManager.startTransaction();
      }
      const actualMarkerEnt = new ActualMarkerEntity();
      actualMarkerEnt.markerLength = reqObj.markerLength;
      actualMarkerEnt.markerName = reqObj.markerName;
      actualMarkerEnt.markerWidth = reqObj.markerWidth;
      actualMarkerEnt.docketGroup = reqObj.docketGroup;
      actualMarkerEnt.unitCode = reqObj.unitCode;
      actualMarkerEnt.companyCode = reqObj.companyCode;
      actualMarkerEnt.createdUser = reqObj.username;
      actualMarkerEnt.remarks = 'Allocation';
      await this.actualMarkerRepo.save(actualMarkerEnt, { reload: false });
      if(!incomingTransManager) {
        await transManager.completeTransaction();
      }
      return true;
    } catch (error) {
      if(!incomingTransManager) {
        await transManager.releaseTransaction();
      }
      throw error;
    }

  }

  async getActualMarkerByDocketGroup(req: PoDocketGroupRequest): Promise<ActualMarkerResponse> {
    const records = await this.actualMarkerRepo.find({ where: { unitCode: req.unitCode, docketGroup: req.docketGroup, companyCode: req.companyCode } });
    const resultData = [];
    if (records.length === 0) {
      throw new ErrorResponse(0, "Actual markers not updated");
    }
    records.forEach(data => {
      const eachRow = new ActualMarkerModel(req.username, req.unitCode, req.companyCode, req.userId, data.markerName, data.markerLength, data.markerWidth, req.docketGroup);
      resultData.push(eachRow);
    });
    return new ActualMarkerResponse(true, 85552, 'Data Retrieved Successfully', resultData)
  }

  async addJobForUpdatingAllocFabToExtSystem(req: RollIdsConsumptionRequest): Promise<GlobalResponseObject> {
    return await this.docMaterialHelperService.addJobForUpdatingAllocFabToExtSystem(req);
  }

  async addJobForUpdatingIssuedFabToExtSystem(req: RollIdsConsumptionRequest): Promise<GlobalResponseObject> {
    return await this.docMaterialHelperService.addJobForUpdatingIssuedFabToExtSystem(req);
  }
}