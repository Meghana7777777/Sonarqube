import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { DataSource, In, Not, UpdateResult } from "typeorm";
import { CutStatusEnum, GlobalResponseObject, LayIdConfirmationRequest, LayIdRequest, LayIdsRequest, LayItemAddRequest, LayItemIdRequest, LayingInspectionStatusEnum, LayingPauseRequest, LayingStatusEnum, MrnStatusEnum, PoDocketGroupRequest, ReasonIdRequest, RollBasicInfoModel, RollIdsRequest, WhMatReqLineStatusEnum } from "@xpparel/shared-models";
import { GenericTransactionManager } from "../../database/typeorm-transactions";
import { ErrorResponse } from "@xpparel/backend-utils";
import { LayReportingInfoService } from "./lay-reporting-info.service";
import { LayReportingHelperService } from "./lay-reporting-helper.service";
import moment from 'moment';
import { PoDocketLayRepository } from "./repository/po-docket-lay.repository";
import { PoDocketLayItemRepository } from "./repository/po-docket-lay-item.repository";
import { PoDocketLayEntity } from "./entity/po-docket-lay.entity";
import { PoDocketLayDowntimeEntity } from "./entity/po-docket-lay-downtime.entity";
import { PoDocketLayDowntimeRepository } from "./repository/po-docket-lay-downtime.repository";
import { PoDocketMaterialEntity } from "../docket-material/entity/po-docket-material.entity";
import { PoDocketLayItemEntity } from "./entity/po-docket-lay-item.entity";
import { PoDocketLayBundlePrintRepository } from "./repository/po-docket-lay-bundle-print.repository";
import { PoDocketLayBundlePrintEntity } from "./entity/po-docket-lay-bundle-print.entity";
import { PoDocketLayShadeRepository } from "./repository/po-docket-lay-shade.repository";
import { PoDocketLayShadeEntity } from "./entity/po-docket-lay-shade.entity";

@Injectable()
export class LayReportingService {
  constructor(
    private dataSource: DataSource,
    @Inject(forwardRef(()=> LayReportingHelperService)) private layRepInfoService: LayReportingInfoService,
    @Inject(forwardRef(()=> LayReportingHelperService)) private layRepHelperService: LayReportingHelperService,
    private poDocketLayRepo: PoDocketLayRepository,
    private bundlePrintRepo: PoDocketLayBundlePrintRepository,
    private poDocketLayItemRepo: PoDocketLayItemRepository,
    private downTimeRepo: PoDocketLayDowntimeRepository,
  ) {

  }

  /**
   * TODO: Currently the expectation is that the docket will have only 1 material request. If it has many, then we have to consider the request-nnumber also in the process
   * Service to start laying for the docket
   * @param req 
   * @returns 
   */
  async startLayingForDocket(req: PoDocketGroupRequest): Promise<GlobalResponseObject> {
    const { unitCode, companyCode } = req;
    try {
      /**
       * validations:
       * if the WH material is not released, then throw an error
       * if any record the the docket_lay with status <> 'COMPLETED' then throw an error : A lay is already initiated. You can add a new lay without completing it
       * if the docket_plies <= sum(layed_plies) in docket_lay_item, throw an error: All docket plies are layed
       * insert the laying record. laying status default is INPROGRESS. plies is 0
      */
      const docketsInfo = await this.layRepHelperService.getDocketRecordsByDocGroup(req.docketGroup, companyCode, unitCode);
      if (docketsInfo.length == 0) {
        throw new ErrorResponse(0, 'Docket information not found. Please check and try again');
      }
      const randomDocket = docketsInfo[0];
      // The WH material issuance validation
      const docMatReqStatus = await this.layRepHelperService.getDocketMaterialRequestRecordsByDocGroup(req.docketGroup, companyCode, unitCode);
      docMatReqStatus.forEach(r => {
        if (r.requestStatus != WhMatReqLineStatusEnum.MATERIAL_ISSUED) {
          throw new ErrorResponse(0, 'Material is still not issued from the warehouse');
        }
      });
      const openOrProgressLays = await this.poDocketLayRepo.find({ select: ['id'], where: { docketGroup: req.docketGroup, unitCode, companyCode, cutStatus: Not(CutStatusEnum.COMPLETED) } });
      if (openOrProgressLays.length) {
        throw new ErrorResponse(0, 'A lay is already initiated. You cannot add a new lay without completing the cut for it')
      }
      const layDetails = await this.poDocketLayItemRepo.find({ where: { docketGroup: req.docketGroup, unitCode, companyCode } });
      const alreadyLayedPlies = layDetails.reduce((accumulator, currentValue) => accumulator + currentValue.layedPlies, 0);
      if (randomDocket.plies <= alreadyLayedPlies) {
        throw new ErrorResponse(0, 'All docket plies are layed');
      }
      const requestDetails = await this.layRepHelperService.getPoDocketMaterialRecordsByDocNumber([req.docketGroup], companyCode, unitCode);
      if (!requestDetails) {
        throw new ErrorResponse(0, '');
      }
      // get the laying records for the docket
      const laysForDocket = await this.poDocketLayRepo.find({ select: ['underDocLayNumber'], where: { docketGroup: req.docketGroup, companyCode: req.companyCode, unitCode: req.unitCode, poSerial: randomDocket.poSerial }});
      const laysForPo = await this.poDocketLayRepo.find({ select: ['underPolayNumber'], where: {  companyCode: req.companyCode, unitCode: req.unitCode, poSerial: randomDocket.poSerial }});

      let maxUnderDocLayNumber = 0;
      let maxUnderPoLayNumber = 0;
      laysForDocket.forEach(r => {
        maxUnderDocLayNumber = Math.max(maxUnderDocLayNumber, r.underDocLayNumber);
      });
      laysForPo.forEach(r => { 
        maxUnderPoLayNumber = Math.max(maxUnderPoLayNumber, r.underPolayNumber);
      });
      const poDocketLayObj = new PoDocketLayEntity();
      poDocketLayObj.companyCode = companyCode;
      poDocketLayObj.createdUser = req.username;
      poDocketLayObj.cutStatus = CutStatusEnum.OPEN;
      poDocketLayObj.docketGroup = req.docketGroup;
      poDocketLayObj.underDocLayNumber = maxUnderDocLayNumber+1;
      poDocketLayObj.underPolayNumber = maxUnderPoLayNumber+1;
      poDocketLayObj.layInitiatedPerson = req.username;
      poDocketLayObj.layInspectedPerson = req.username;
      poDocketLayObj.layStartDateTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
      poDocketLayObj.layingStatus = LayingStatusEnum.INPROGRESS;
      poDocketLayObj.poSerial = req.poSerial;
      poDocketLayObj.requestNumber = requestDetails[0].requestNumber;
      poDocketLayObj.unitCode = unitCode;
      await this.poDocketLayRepo.save(poDocketLayObj, { reload: false });
      return new GlobalResponseObject(true, 0, 'Lay started successfully with docket');
    } catch (err) {
      throw err;
    }
  }

  async pauseLayingForDocket(req: LayingPauseRequest): Promise<GlobalResponseObject> {
    const { unitCode, companyCode } = req;
    const manager = new GenericTransactionManager(this.dataSource);
    try {
      /**
       * insert the record into the lay downtime every time this API is called. update the reason id and the reason later
       * if downtimeCompleted = false, for any of the records in the lay-downtime table then throw an error as downtime is already running
       * update the layingStatus to HOLD in the docket_lay
      */
      // NEED TO CHECK THE GIVEN LAY IS IN PROGRESS 
      const layDetails = await this.poDocketLayRepo.findOne({ where: { id: req.layId, unitCode, companyCode } });
      if (layDetails.layingStatus != LayingStatusEnum.INPROGRESS) {
        throw new ErrorResponse(0, 'Given lay is not in progress. Please check and try again')
      }
      const reasonIdReq = new ReasonIdRequest(req.username, unitCode, companyCode, req.userId, req.reasonId);
      const reasonDetails = await this.layRepHelperService.getReasonbyId(reasonIdReq);
      console.log(reasonDetails);
      if (!reasonDetails.status || !reasonDetails.data) {
        throw new ErrorResponse(0, 'Reason details not found. Please check and try again');
      }
      const downTimeObj = new PoDocketLayDowntimeEntity();
      downTimeObj.companyCode = companyCode;
      downTimeObj.createdUser = req.username;
      downTimeObj.docketGroup = layDetails.docketGroup;
      downTimeObj.downTimeMins = null;
      downTimeObj.downtimeCompleted = false;
      downTimeObj.downtimeEndDateTime = null;
      downTimeObj.downtimeStartDateTime = moment().format('YYYY-MM-DD HH:mm:ss');
      downTimeObj.poDocketLayId = req.layId;
      downTimeObj.poSerial = layDetails.poSerial;
      downTimeObj.reasonDesc = reasonDetails.data[0].reasonDesc;
      downTimeObj.reasonId = req.reasonId;
      downTimeObj.remarks = req.remarks;
      downTimeObj.unitCode = unitCode;
      await manager.startTransaction();
      await manager.getRepository(PoDocketLayDowntimeEntity).save(downTimeObj);
      await manager.getRepository(PoDocketLayEntity).update({ id: req.layId, unitCode, companyCode }, { layingStatus: LayingStatusEnum.HOLD });
      await manager.completeTransaction();
      return new GlobalResponseObject(true, 0, 'Laying Paused successfully');
    } catch (err) {
      console.log(err);
      await manager.releaseTransaction();
      throw err;
    }
  }

  // ENDPOINT
  // WRITER
  async resumeLayingForDocket(req: LayIdRequest): Promise<GlobalResponseObject> {
    const { unitCode, companyCode } = req;
    const manager = new GenericTransactionManager(this.dataSource);
    try {
      /**
       * when the downtime is resumed for a lay, the following has to happen
       * for the last lay-downtime record in lay-downtime table,
       *    if downtimeCompleted = true then throw an error as nothing to complete
       *    if no records in lay-downtime table throw an error  downtime is not logged
       * have to update the downtimeCompleted = true
       * also update the total minutes between downtimeStartDateTime - downtimeEndDateTime in the downTimeMins column
       * update the layingStatus to INPROGRESS in the docket_lay
      */
      const layDetails = await this.poDocketLayRepo.findOne({ where: { id: req.layId, unitCode, companyCode } });
      if (layDetails.layingStatus != LayingStatusEnum.HOLD) {
        throw new ErrorResponse(0, 'Given lay is not in hold. Please check and try again')
      }
      const lastHoldRecord: PoDocketLayDowntimeEntity = await this.downTimeRepo.getLastDownTimeRecordForLayId(req.layId, unitCode, companyCode);
      if (!lastHoldRecord) {
        throw new ErrorResponse(0, 'Downtime not yet logged. Please check and try again');
      }
      if (lastHoldRecord.downtimeCompleted) {
        throw new ErrorResponse(0, 'Downtime already completed. You cannot resume it again');
      }
      const format = 'YYYY-MM-DD HH:mm:s';
      const moment1 = moment(new Date(), format);
      const moment2 = moment(new Date(lastHoldRecord.downtimeStartDateTime), format);
      const diffInMilliseconds = moment1.diff(moment2);
      const diffInMinutes = moment.duration(diffInMilliseconds).asMinutes();
      await manager.startTransaction();
      await manager.getRepository(PoDocketLayDowntimeEntity).update({ id: lastHoldRecord.id, unitCode, companyCode }, { downtimeCompleted: true, downTimeMins: diffInMinutes, downtimeEndDateTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss') });
      await manager.getRepository(PoDocketLayEntity).update({ id: req.layId, unitCode, companyCode }, { layingStatus: LayingStatusEnum.INPROGRESS });
      await manager.completeTransaction();
      return new GlobalResponseObject(true, 0, 'Laying Resumed successfully');
    } catch (err) {
      await manager.releaseTransaction();
      throw err;
    }
  }

  // ENDPOINT
  // WRITER
  async confirmLayingForLayId(req: LayIdConfirmationRequest): Promise<GlobalResponseObject> {
    const { unitCode, companyCode } = req;
    const manager = new GenericTransactionManager(this.dataSource);
    try {
      /**
       * if no records in the docket-lay-item, then throw error: Lay cannot be completed with 0 rolls
       * if any record with downtimeCompleted = false in lay-downtime table, then throw an error
       * update the staus of laying, layCompleteTime in docket_lay table to COMPLETED, 
      */
     
      const layItemDetails = await this.poDocketLayItemRepo.find({ where: { poDocketLayId: req.layId, unitCode, companyCode } });
      if (!layItemDetails.length) {
        // throw new ErrorResponse(0, 'You cannot confirm the lay without rolls in it');
      }
      const alreadyLayedPlies = layItemDetails.reduce((accumulator, currentValue) => accumulator + currentValue.layedPlies, 0);
      if (alreadyLayedPlies == 0) {
        // throw new ErrorResponse(0, 'You cannot confirm the lay with 0 Plies')
      }
      const layDetails = await this.poDocketLayRepo.findOne({ where: { id: req.layId, unitCode, companyCode } });
      if (layDetails.layingStatus != LayingStatusEnum.INPROGRESS) {
        // throw new ErrorResponse(0, 'Some one has hold the lay or lay is already confirmed please check and try again');
      }
      const downTimeRecords = await this.downTimeRepo.find({ where: { poDocketLayId: req.layId, unitCode, companyCode, downtimeCompleted: false } });
      if (downTimeRecords.length) {
        // throw new ErrorResponse(0, 'Lay is paused by some one please check and try again');
      }
      // Need to validate any pending MRN requests are there not.
      const openMRNRequests = await this.layRepHelperService.getMrnRequestRecordsByDocketNumberAndMrnStatus(layDetails.docketGroup, companyCode, unitCode, [MrnStatusEnum.OPEN, MrnStatusEnum.APPROVED, MrnStatusEnum.REJECTED]);
      console.log(openMRNRequests);
      if (openMRNRequests.length > 0) {
        throw new ErrorResponse(0 , 'There are some OPEN MRN requests please close those and try again');
      }
      await manager.startTransaction();
      await manager.getRepository(PoDocketLayEntity).update({ id: req.layId, unitCode, companyCode }, { layingStatus: LayingStatusEnum.COMPLETED, layCompletedDateTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'), layInspectedPerson: req.layInspector });
      await manager.completeTransaction();
      // TODO
      // Free all the inventory that was actually locket. Dont forget to consider the actual qty consumed while caluculating the pending roll qty available. It might be some what more than what was actually allocated.
      return new GlobalResponseObject(true, 0, 'Laying Confirmed successfully');
    } catch (err) {
      await manager.releaseTransaction();
      throw err;
    }
  }

  // ENDPOINT
  // WRITER
  async addLayedRollsForLayId(reqs: LayItemAddRequest[]): Promise<GlobalResponseObject> {
    const { unitCode, companyCode, layId, layEndTime, layStartTime, username } = reqs[0];
    const manager = new GenericTransactionManager(this.dataSource);
    try {
      /**
       * validations to ensure 
       *  1. incoming roll must be a part of the docket material (helper: getPoDocketMaterialRecordsByDocNumber)
       *  2. layid must not be layingStatus = completed
       *  3. other validaitons we can add later.
       * create a new records in the docket_lay_item
       */
      
      // validations.
      /**
       * 1. the roll must have plies and roll sequence as mandatory
       * 2. if the roll have the damages then point 1 is optional
       */
      reqs.forEach(r => {
        if(!r.damages) {
          if(!r.layedPlies || !r.sequence) {
            throw new ErrorResponse(0, `If no damages for the roll : ${r.itemBarcode}, then plies and sequence are mandatory`);
          }
        }
      });
     
      const layDetails = await this.poDocketLayRepo.findOne({ where: { id: layId, unitCode, companyCode } });
      if (layDetails.layingStatus != LayingStatusEnum.INPROGRESS) {
        throw new ErrorResponse(0, 'Some one has hold the lay or lay is already confirmed please check and try again');
      }

      const openMRNRequests = await this.layRepHelperService.getMrnRequestRecordsByDocketNumberAndMrnStatus(layDetails.docketGroup, companyCode, unitCode, [MrnStatusEnum.OPEN, MrnStatusEnum.APPROVED, MrnStatusEnum.REJECTED]);
      if (openMRNRequests.length > 0) {
        throw new ErrorResponse(0 , 'There are some OPEN MRN requests please issue them and try again');
      }

      const docsInDocGroup = await this.layRepHelperService.getDocketRecordsByDocGroup(layDetails.docketGroup,companyCode, unitCode);
      const randomDoc = docsInDocGroup[0];
      const docketRecord = await this.layRepHelperService.getDocketRecordByDocNumber(randomDoc.docketNumber,companyCode, unitCode);
      const materialInvolved: PoDocketMaterialEntity[] = await this.layRepHelperService.getPoDocketMaterialRecordsByDocNumber([layDetails.docketGroup], companyCode, unitCode);
      if (!materialInvolved.length) {
        throw new ErrorResponse(0, 'No materials found for the given docket please check and try again')
      }

      // get the total layed rolls for the docket. 
      const layRecs = await this.poDocketLayRepo.find({ select: ['id'], where: { docketGroup: layDetails.docketGroup, unitCode: unitCode, companyCode: companyCode }});
      const layIds: number[] = [];
      layRecs.forEach(r => layIds.push(r.id));
      const layedRolls = await this.poDocketLayItemRepo.find({ select: ['layedPlies'], where: { unitCode: unitCode, companyCode:companyCode, poDocketLayId: In(layIds) }});
      let totalLayedPlies = 0;
      let totalLayedPliesValue = 0;
      for(const req of reqs) {
        totalLayedPliesValue += req.layedPlies;
      }
      layedRolls.forEach(r => totalLayedPlies += Number(r.layedPlies));
      
      if(totalLayedPlies + totalLayedPliesValue > Number(docketRecord.plies)) {
        throw new ErrorResponse(0, `Dokcet has only ${docketRecord.plies} plies. You are trying to report ${totalLayedPlies +totalLayedPliesValue } plies`);
      }
      const rollIds = new Set([...materialInvolved.map(mat => Number(mat.rollId))]);

      // get the roll level basic details from the WMS
      const incomingRollIds = reqs.map(r => r.itemId);
      const rollIdsReq = new RollIdsRequest(null, unitCode, companyCode, 0, incomingRollIds);
      const rollBasicInfo = await this.layRepHelperService.getRollsBasicInfoForRollIds(rollIdsReq);
      if (!rollBasicInfo.status) {
        throw new ErrorResponse(rollBasicInfo.errorCode, rollBasicInfo.internalMessage);
      }

      // keep a map of the roll id and the roll info
      const rollInfoMap = new Map<number, RollBasicInfoModel>();
      rollBasicInfo?.data?.forEach(r => {
        rollInfoMap.set(r.rollId, r);
      });
      const layEnts: PoDocketLayItemEntity[] = [];
      for(const req of reqs) {
        if (!rollIds.has(req.itemId)) {
          throw new ErrorResponse(0, 'Roll does not belongs to given material request please check and try again');
        }
        const currentRollInfo = rollInfoMap.get(req.itemId);
        const layItemEntity = new PoDocketLayItemEntity();
        layItemEntity.companyCode = companyCode;
        layItemEntity.createdUser = req.username;
        layItemEntity.docketGroup = layDetails.docketGroup;
        layItemEntity.layInspectionStatus = LayingInspectionStatusEnum.OPEN;
        layItemEntity.layedPlies = req.layedPlies;
        layItemEntity.poDocketLayId = req.layId;
        layItemEntity.poSerial = layDetails.poSerial;
        layItemEntity.rollBarcode = req.itemBarcode;
        layItemEntity.unitCode = unitCode;
        layItemEntity.rollId = req.itemId;
        layItemEntity.shade = currentRollInfo.aShade ?? 'NS';
        layItemEntity.damage = req.damages ?? 0;
        layItemEntity.endBits = req.endBits ?? 0;
        layItemEntity.shortage = req.shortage ?? 0;
        layItemEntity.remarks = req.remarks;
        layItemEntity.layStartDateTime = req.layStartTime;
        layItemEntity.layCompletedDateTime = req.layEndTime;
        layItemEntity.sequence=req.sequence ?? 0;
        layItemEntity.jointsOverlapping=req.jointsOverlapping ?? 0;
        layItemEntity.noOfJoints=req.noOfJoints ?? 0;
        layItemEntity.remnantsOfOtherLay=req.remnantsOfOtherLay ?? 0;
        layItemEntity.halfPlieOfPreRoll=req.halfPlieOfPreRoll ?? 0;
        layItemEntity.fabricDefects=req.fabricDefects ?? 0;
        layItemEntity.usableRemains=req.usableRemains ?? 0;
        layItemEntity.unUsableRemains=req.unUsableRemains ?? 0;
        layEnts.push(layItemEntity);
      }
      const layShadeEnts: PoDocketLayShadeEntity[] = [];

        for (const shadePlie of reqs[0].shadePlies) {
          const layShadeEntity = new PoDocketLayShadeEntity();
          layShadeEntity.docket_group = layDetails.docketGroup;
          layShadeEntity.companyCode = layDetails.companyCode;
          layShadeEntity.unitCode = layDetails.unitCode;
          layShadeEntity.createdUser = layDetails.createdUser;
          layShadeEntity.shade = shadePlie.shadeTitle;  
          layShadeEntity.plies = shadePlie.plies.toString(); 
          layShadeEntity.poDocketLayId = layDetails.id;
          layShadeEnts.push(layShadeEntity);
        } 
      await manager.startTransaction();
      await manager.getRepository(PoDocketLayItemEntity).save(layEnts, { reload: false });
      await manager.getRepository(PoDocketLayEntity).update({ id: layId, unitCode, companyCode }, { layingStatus: LayingStatusEnum.COMPLETED, layCompletedDateTime: layEndTime, layStartDateTime: layStartTime, layInspectedPerson: username });
      await manager.getRepository(PoDocketLayShadeEntity).save(layShadeEnts, { reload: false });
      await manager.completeTransaction();
      return new GlobalResponseObject(true, 0, 'Roll added successfully');
    } catch (err) {
      await manager.releaseTransaction();
      throw err;
    }
  }

  /**
   * ENDPOINT
   * WRITER 
   * @param req 
   * @returns 
  */
  async removeLayedRollForLayId(req: LayItemIdRequest): Promise<GlobalResponseObject> {
    const { unitCode, companyCode } = req;
    const manager = new GenericTransactionManager(this.dataSource);
    try {
      /**
       * validations to ensure 
       *  1. layid must not be layingStatus = completed
       * delete the records in the docket_lay_item for the roll id
      */
      const layDetails = await this.poDocketLayRepo.findOne({ where: { id: req.layId, unitCode, companyCode } });
      if (layDetails.layingStatus == LayingStatusEnum.COMPLETED) {
        throw new ErrorResponse(0, 'Lay is already confirmed.');
      }
      if (layDetails.layingStatus == LayingStatusEnum.HOLD) {
        throw new ErrorResponse(0, 'Lay is in hold state you cannot delete the roll')
      }
      await manager.startTransaction();
      for (const itemId of req.itemIds) {
        await this.poDocketLayItemRepo.delete({ rollId: itemId, unitCode, companyCode })
      }
      await manager.completeTransaction();
      return new GlobalResponseObject(true, 0, 'Roll deleted successfully');
    } catch (err) {
      await manager.releaseTransaction();
      throw err;
    }
  }

  /**
   * 
   * @param layId 
   * @param docketNumber 
   * @param cutStatus 
   * @param companyCode 
   * @param unitCode 
   */
  async updateCutStatusForLayId(layId: number, docketGroup:string, cutStatus: CutStatusEnum, companyCode: string, unitCode: string, manager: GenericTransactionManager): Promise<boolean> {
    let updatedRecords: UpdateResult;
    if(manager) {
      updatedRecords = await manager.getRepository(PoDocketLayEntity).update({ id: layId, companyCode: companyCode, unitCode: unitCode, docketGroup: docketGroup}, { cutStatus: cutStatus });
    } else {
      updatedRecords = await this.poDocketLayRepo.update({ id: layId, companyCode: companyCode, unitCode: unitCode, docketGroup: docketGroup}, { cutStatus: cutStatus });
    }
    return updatedRecords.affected > 0;
  }

  /**
   * Releases the barcode print status for the lay
   * @param req 
   */
  async printBundleTagsForLay(req: LayIdsRequest): Promise<GlobalResponseObject> {
    const transManager = new GenericTransactionManager(this.dataSource);
    try {
      /**
       * Update the status of bundle_print to true
       * Create a record in the bundle_print table
       */
      const layIds = new Set<number>();
      req.layIds.forEach(r => layIds.add(r));
      if(layIds.size == 0) {
        throw new ErrorResponse(0, 'Lay ids must be provided')
      }
      if(!req.docketNumber) {
        throw new ErrorResponse(0, 'Docket number must be provided');
      }

      const layDetails = await this.poDocketLayRepo.find({ where: { id: In(Array.from(layIds)), unitCode: req.unitCode, companyCode: req.companyCode } });
      if (layDetails.length != layIds.size) {
        throw new ErrorResponse(0, 'Some lay numbers do not exist');
      }
      // layDetails.forEach(l => {
      //   if(l.bundlePrintStatus) {
      //     throw new ErrorResponse(0, 'Bundle tags are already printed for the Lay');
      //   }
      // });
      const bundlePrintHisEnts: PoDocketLayBundlePrintEntity[] = [];
      for(const layId of layIds) {
        
        const printHistRec = await this.bundlePrintRepo.findOne({ where: { poDocketLayId: layId, docketNumber: req.docketNumber}, order: { 'createdAt': 'desc' } });
        const printStatus = printHistRec ? printHistRec.action : false;
        if(printStatus) {
          throw new ErrorResponse(0, 'Bundle tags are already printed for the Lay');
        }
        const layRec = await this.poDocketLayRepo.findOne({ where: { id: layId, unitCode: req.unitCode, companyCode: req.companyCode } });
        const bundlePrintHisEnt = new PoDocketLayBundlePrintEntity();
        bundlePrintHisEnt.poSerial = layRec.poSerial;
        bundlePrintHisEnt.poDocketLayId = layId;
        bundlePrintHisEnt.docketNumber = req.docketNumber;
        bundlePrintHisEnt.action = true;
        bundlePrintHisEnts.push(bundlePrintHisEnt);
      };
      await transManager.startTransaction();
      await transManager.getRepository(PoDocketLayEntity).update({ id: In(req.layIds), unitCode: req.unitCode, companyCode: req.companyCode }, {bundlePrintStatus: true});
      await transManager.getRepository(PoDocketLayBundlePrintEntity).save(bundlePrintHisEnts, { reload: false });
      await transManager.completeTransaction();
      return new GlobalResponseObject(true, 0 , 'Barcodes printed successfully');
    } catch (error) {
      await transManager.releaseTransaction();
      throw error;
    }
  }

  /**
   * Releases the barcode print status for the lay
   * @param req 
   */
  async releaseBundleTagsPrintForLay(req: LayIdsRequest): Promise<GlobalResponseObject> {
    const transManager = new GenericTransactionManager(this.dataSource);
    try {
      const layIds = new Set<number>();
      req.layIds.forEach(r => layIds.add(r));
      if(layIds.size == 0) {
        throw new ErrorResponse(0, 'Some lay numbers do not exist');
      }
      const layDetails = await this.poDocketLayRepo.find({ where: { id: In(Array.from(layIds)), unitCode: req.unitCode, companyCode: req.companyCode } });
      if (layDetails.length != layIds.size) {
        throw new ErrorResponse(0, 'Lay is already confirmed.');
      }
      if(!req.docketNumber) {
        throw new ErrorResponse(0, 'Docket number must be provided');
      }
      // layDetails.forEach(l => {
      //   if(!l.bundlePrintStatus) {
      //     throw new ErrorResponse(0, 'Bundle tags are already released for the Lay');
      //   }
      // });
      const bundlePrintHisEnts: PoDocketLayBundlePrintEntity[] = [];
      for(const layId of layIds) {
        const printHistRec = await this.bundlePrintRepo.findOne({ where: { poDocketLayId: layId, docketNumber: req.docketNumber}, order: { 'createdAt': 'desc' } });
        const printStatus = printHistRec ? printHistRec.action : false;
        if(!printStatus) {
          throw new ErrorResponse(0, 'Bundle tags are already released for the Lay');
        }
        const layRec = await this.poDocketLayRepo.findOne({ where: { id: layId, unitCode: req.unitCode, companyCode: req.companyCode } });
        const bundlePrintHisEnt = new PoDocketLayBundlePrintEntity();
        bundlePrintHisEnt.poSerial = layRec.poSerial;
        bundlePrintHisEnt.poDocketLayId = layId;
        bundlePrintHisEnt.docketNumber = req.docketNumber;
        bundlePrintHisEnt.action = false;
        bundlePrintHisEnts.push(bundlePrintHisEnt);
      };
      await transManager.startTransaction();
      await transManager.getRepository(PoDocketLayEntity).update({ id: In(Array.from(layIds)), unitCode: req.unitCode, companyCode: req.companyCode }, {bundlePrintStatus: false});
      await transManager.getRepository(PoDocketLayBundlePrintEntity).save(bundlePrintHisEnts, { reload: false });
      await transManager.completeTransaction();
      return new GlobalResponseObject(true, 0 , 'Barcodes released successfully');
    } catch (error) {
      await transManager.releaseTransaction();
      throw error;
    }
  }
  
}