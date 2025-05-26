import { Global, Injectable } from '@nestjs/common';
import { CreateGrnDto } from './dto/create-grn.dto';
import { UpdateGrnDto } from './dto/update-grn.dto';
import { PhBatchLotRollRequest, GrnUnLoadingRequest, RollsGrnRequest, GrnConfirmRequest, PackingListInfoModel, PackingListInfoResponse, CommonRequestAttrs, GlobalResponseObject, SecurityCheckRequest, CheckListStatus, PackListLoadingStatus, SecurityCheckResponse, SecurityCheckModel, PackListIdRequest, PackListVehicleIdModel, GrnUnLoadingResponse, GrnUnLoadingModel, PhLinesGrnStatusEnum, GrnStatusEnum, RollSelectionTypeEnum, SystemPreferenceModel, SystemPreferenceResp, GrnVehiclesInThePlantResp, PackingListDeliveryDateResp, VehiclesResponse, GrnDetailsReportResponse, ADDVehicleReqModal } from '@xpparel/shared-models';
import { PhVehicleRepo } from './repositories/ph-vehicle.repository';
import { PackListVehicleStatusResp } from './repositories/query-response/pack-list-vehicle-status.qry.resp';
import { PhVehicleEntity } from './entities/ph-vehicle.entity';
import { GenericTransactionManager } from '../../database/typeorm-transactions';
import { PackingListService } from '../packing-list/packing-list.service';
import { CommonResponse, ErrorResponse } from '@xpparel/backend-utils';
import { DataSource, In } from 'typeorm';
import { VehicleUnloadingHistory } from './entities/vehicle-unloading-history.entity';
import { PhGrnEntity } from './entities/ph-grn.entity';
import { PhGrnRepo } from './repositories/ph-grn.repository';
import { SystemPreferenceQryResp } from './repositories/query-response/system-preference.qry.resp';
import { PackingListInfoService } from '../packing-list/packing-list-info.service';
import { VehicleUnloadingHisRepo } from './repositories/vehical-unload-history.repository';
import moment = require('moment');
import { GatexService } from '@xpparel/shared-services';
import { PackingListEntity } from '../packing-list/entities/packing-list.entity';

@Injectable()
export class GrnService {
  constructor(
    private dataSource: DataSource,
    private packListVehicleInfo: PhVehicleRepo,
    private packingListService: PackingListService,
    private packListInfoService: PackingListInfoService,
    private phGrnRepo: PhGrnRepo,
    private phVehicleRepo: PhVehicleRepo,
    private vehicleHistoryRepo: VehicleUnloadingHisRepo,
    private gatexService: GatexService,
  ) {

  }

  /**
   * 
   * @param packListId 
   * @returns 
   */
  async getVehicleRecordForPackListId(packListId: number): Promise<PhVehicleEntity> {
    const trcukInfo = await this.packListVehicleInfo.findOne({ where: { phId: packListId, isActive: true } });
    return trcukInfo;
  }

  async getPackListIdsBasedOnVehicleUnloadStatus(companyCode: string, unitCode: string, unloadStatus: PackListLoadingStatus[]): Promise<number[]> {
    const packListIds: Set<number> = new Set();
    const truckInfos = await this.packListVehicleInfo.find({ select: ['phId'], where: { companyCode: companyCode, unitCode: unitCode, status: In(unloadStatus.map(x => x.toString())) } });
    truckInfos.forEach(r => packListIds.add(r.phId));
    console.log(packListIds, 'packListIds of status ', unloadStatus);
    
    return Array.from(packListIds);
  }

  /**
   * Service to unloading start or resume the paused unloading for a packing list vehicle
   * @param reqModel 
   * @returns 
  */
  async updateGrnUnLoadingStartOrResume(reqModel: GrnUnLoadingRequest): Promise<GlobalResponseObject> {
    const unitCode = reqModel.unitCode;
    const companyCode = reqModel.companyCode;
    const transactionalEntityManager = new GenericTransactionManager(this.dataSource);
    try {
      // check ph vehicle is there or not
      const phVehicleInfo: PhVehicleEntity = await this.packListVehicleInfo.findOne({ where: { id: reqModel.id, phId: reqModel.phId, unitCode, companyCode } });
      if (!phVehicleInfo) {
        throw new ErrorResponse(1018, 'Packing list vehicle information not found for the given Id');
      }
      if (phVehicleInfo.unloadCompleteAt) {
        throw new ErrorResponse(1021, 'Unloading already completed. Please verify')
      }
      await transactionalEntityManager.startTransaction();
      // NEED TO UPDATE THE START TIME AGAINST TO THE PH VEHICLE INFO ID
      if (phVehicleInfo.status == PackListLoadingStatus.IN) {
        await transactionalEntityManager.getRepository(PhVehicleEntity).update({ id: reqModel.id, unitCode, companyCode, phId: reqModel.phId }, { unloadStartAt: reqModel.unloadingStartTime, actualUnloadStartAt: reqModel.unloadingStartTime, status: PackListLoadingStatus.UN_LOADING_START })
      } else {
        await transactionalEntityManager.getRepository(PhVehicleEntity).update({ id: reqModel.id, unitCode, companyCode, phId: reqModel.phId }, { status: PackListLoadingStatus.UN_LOADING_START });
      }

      // NEED TO CAPTURE THE HISTORY
      const unloadingHistory = new VehicleUnloadingHistory();
      unloadingHistory.unloadStartAt = reqModel.unloadingStartTime;
      // unloadingHistory.actualUnloadStartAt = reqModel.unloadingStartTime;
      unloadingHistory.companyCode = companyCode;
      unloadingHistory.createdUser = reqModel.username;
      unloadingHistory.phVehicleId = reqModel.id;
      unloadingHistory.remarks = reqModel.remarks;
      unloadingHistory.unitCode = unitCode;
      await transactionalEntityManager.getRepository(VehicleUnloadingHistory).save(unloadingHistory);
      await transactionalEntityManager.completeTransaction();
      return new GlobalResponseObject(true, 1022, 'Unloading started the packing list.');
    } catch (err) {
      transactionalEntityManager ? await transactionalEntityManager.releaseTransaction() : '';
      throw err;
    }
  }

  /**
   * Service to unloading pause for the given packing list vehicle Id
   * @param reqModel 
   * @returns 
  */
  async updateGrnUnLoadingPause(reqModel: GrnUnLoadingRequest): Promise<GlobalResponseObject> {
    const unitCode = reqModel.unitCode;
    const companyCode = reqModel.companyCode;
    const transactionalEntityManager = new GenericTransactionManager(this.dataSource);
    try {
      // check ph vehicle is there or not
      const phVehicleInfo: PhVehicleEntity = await this.packListVehicleInfo.findOne({ where: { id: reqModel.id, phId: reqModel.phId, unitCode, companyCode } });
      if (!phVehicleInfo) {
        throw new ErrorResponse(1018, 'Packing list vehicle information not found for the given Id');
      }
      if (!phVehicleInfo.unloadStartAt) {
        throw new ErrorResponse(1020, 'Unloading not yet started. Please verify')
      }
      if (phVehicleInfo.unloadCompleteAt) {
        throw new ErrorResponse(1021, 'Unloading already completed. Please verify')
      }
      if (phVehicleInfo.versionFlag != reqModel.versionFlag) {
        throw new ErrorResponse(1026, 'Some Updated please refresh and tray again')
      }
      if (!reqModel.pauseReason) {
        throw new ErrorResponse(1019, 'Pause reason and unloading spent secs mandatory to pause the unloading.')
      }


      await transactionalEntityManager.startTransaction();
      // NEED TO UPDATE THE START TIME AGAINST TO THE PH VEHICLE INFO ID
      await transactionalEntityManager.getRepository(PhVehicleEntity).update({ id: reqModel.id, unitCode, companyCode, phId: reqModel.phId }, { unloadPauseAt: reqModel.unloadingCompletedTime, unloadingSpentSecs: reqModel.unloadingSpentSecs, status: PackListLoadingStatus.UN_LOADING_PAUSED });
      const historyRecord = await transactionalEntityManager.getRepository(VehicleUnloadingHistory).findOne({ where: { phVehicleId: phVehicleInfo.id }, order: { id: 'DESC' } });
      const startDate = new Date(historyRecord.unloadStartAt);
      const endDate = new Date(reqModel.unloadingCompletedTime);
      // Calculate the time difference in milliseconds
      const timeDiffInMilliseconds = endDate.getTime() - startDate.getTime();
      // Convert milliseconds to seconds
      const diffInSeconds = timeDiffInMilliseconds / 1000;
      await transactionalEntityManager.getRepository(VehicleUnloadingHistory).update({ id: historyRecord.id }, { unloadCompleteAt: reqModel.unloadingCompletedTime, pauseReason: reqModel.pauseReason, unloadingSpentSecs: diffInSeconds, isPaused: true });
      // NEED TO CAPTURE THE HISTORY
      // const unloadingHistory = new VehicleUnloadingHistory();
      // // unloadingHistory.unloadPausedAt = reqModel.unloadingPauseTime;
      // unloadingHistory.pauseReason = reqModel.pauseReason;
      // unloadingHistory.unloadingSpentSecs = reqModel.unloadingSpentSecs;
      // unloadingHistory.companyCode = companyCode;
      // unloadingHistory.createdUser = reqModel.username;
      // unloadingHistory.phVehicleId = reqModel.id;
      // unloadingHistory.remarks = reqModel.remarks;
      // unloadingHistory.unitCode = unitCode;
      // await transactionalEntityManager.getRepository(VehicleUnloadingHistory).save(unloadingHistory);
      await transactionalEntityManager.completeTransaction();
      return new GlobalResponseObject(true, 1023, 'Unloading paused the packing list.');
    } catch (err) {
      transactionalEntityManager ? await transactionalEntityManager.releaseTransaction() : '';
      throw err;
    }
  }

  /**
   * Service to update the unload completion status for a packing list vehicle
   * @param reqModel \
   * @returns 
  */
  async grnUnLoadingCompleteUpdate(reqModel: GrnUnLoadingRequest): Promise<GlobalResponseObject> {
    const unitCode = reqModel.unitCode;
    const companyCode = reqModel.companyCode;
    const transactionalEntityManager = new GenericTransactionManager(this.dataSource);
    try {
      // check ph vehicle is there or not
      const phVehicleInfo: PhVehicleEntity = await this.packListVehicleInfo.findOne({ where: { id: reqModel.id, phId: reqModel.phId, unitCode, companyCode } });
      if (!phVehicleInfo) {
        throw new ErrorResponse(1018, 'Packing list vehicle information not found for the given Id');
      }
      if (!phVehicleInfo.unloadStartAt) {
        throw new ErrorResponse(1020, 'Unloading not yet started. Please verify')
      }
      await transactionalEntityManager.startTransaction();
      // NEED TO UPDATE THE START TIME AGAINST TO THE PH VEHICLE INFO ID
      await transactionalEntityManager.getRepository(PhVehicleEntity).update({ id: reqModel.id, unitCode, companyCode, phId: reqModel.phId }, { unloadCompleteAt: reqModel.unloadingCompletedTime, actualUnloadCompleteAt: reqModel.unloadingCompletedTime, unloadingSpentSecs: reqModel.unloadingSpentSecs, status: PackListLoadingStatus.UN_LOADING_COMPLETED });
      if (phVehicleInfo.status != PackListLoadingStatus.UN_LOADING_PAUSED) {
        const historyRecord = await transactionalEntityManager.getRepository(VehicleUnloadingHistory).findOne({ where: { phVehicleId: phVehicleInfo.id }, order: { id: 'DESC' } });
        const startDate = new Date(historyRecord.unloadStartAt);
        const endDate = new Date(reqModel.unloadingCompletedTime);
        // Calculate the time difference in milliseconds
        const timeDiffInMilliseconds = endDate.getTime() - startDate.getTime();
        // Convert milliseconds to seconds
        const diffInSeconds = timeDiffInMilliseconds / 1000;
        await transactionalEntityManager.getRepository(VehicleUnloadingHistory).update({ id: historyRecord.id }, { unloadCompleteAt: reqModel.unloadingCompletedTime, pauseReason: reqModel.pauseReason, unloadingSpentSecs: diffInSeconds });
      }
      // NEED TO CAPTURE THE HISTORY
      // const unloadingHistory = new VehicleUnloadingHistory();
      // unloadingHistory.unloadCompleteAt = reqModel.unloadingCompletedTime;
      // unloadingHistory.companyCode = companyCode;
      // unloadingHistory.createdUser = reqModel.username;
      // unloadingHistory.phVehicleId = reqModel.id;
      // unloadingHistory.remarks = reqModel.remarks;
      // unloadingHistory.unitCode = unitCode;
      // await transactionalEntityManager.getRepository(VehicleUnloadingHistory).save(unloadingHistory);
      await transactionalEntityManager.completeTransaction();
      return new GlobalResponseObject(true, 1024, 'Unloading completed for the packing list.');
    } catch (err) {
      transactionalEntityManager ? await transactionalEntityManager.releaseTransaction() : '';
      throw err;
    }

  }

  /**
   * Service to get grn unloading details for the given packing list vehicle details Id
   * @param reqObj 
   * @returns 
  */
  async getGrnUnloadingDetails(reqObj: PackListVehicleIdModel): Promise<GrnUnLoadingResponse> {
    const unitCode = reqObj.unitCode;
    const companyCode = reqObj.companyCode;
    // check ph vehicle is there or not
    const where = { phId: reqObj.phId, unitCode, companyCode }
    if (reqObj.phVehicleId) {
      where['id'] = reqObj.phVehicleId
    }
    const phVehicleInfos: PhVehicleEntity[] = await this.packListVehicleInfo.find({ where });
    if (phVehicleInfos.length == 0) {
      throw new ErrorResponse(1018, 'Packing list vehicle information not found for the given Id');
    }
    const unloadingDetails: GrnUnLoadingModel[] = [];
    for (const phVehicleInfo of phVehicleInfos) {
      const historyRecord = await this.vehicleHistoryRepo.getGrnLoadTimeForVehicleId(phVehicleInfo.id);
      const totalSeconds = historyRecord ? Number(historyRecord.spent_sec) : 0;
      const lastStartTime = historyRecord ? historyRecord.unload_start_at : null;
      const lastUnloadEndTime = historyRecord ? historyRecord.unload_complete_at : null;
      const packListRec = await this.packListInfoService.getPackListRecordForPackListId(phVehicleInfo.phId);
      const unloadingDetail = new GrnUnLoadingModel(phVehicleInfo.createdUser, phVehicleInfo.unitCode, phVehicleInfo.companyCode, 0, phVehicleInfo.id, phVehicleInfo.phId, phVehicleInfo.unloadStartAt, phVehicleInfo.unloadCompleteAt, phVehicleInfo.vehicleNumber, phVehicleInfo.driverName, phVehicleInfo.securityName, phVehicleInfo.vehicleContact, phVehicleInfo.inAt, phVehicleInfo.outAt, phVehicleInfo.unloadPauseAt, totalSeconds, phVehicleInfo.status, packListRec.grnStatus, phVehicleInfo.versionFlag, lastStartTime, lastUnloadEndTime, undefined, phVehicleInfo.phId);
      unloadingDetails.push(unloadingDetail);
    }

    return new GrnUnLoadingResponse(true, 1025, 'Packing list unloading details retrieved successfully', unloadingDetails)
  }

  /**
   * Service to save the roll level information for the grn
   * @param reqModel 
   * @returns 
  */
  async saveRollLevelGRN(reqModel: RollsGrnRequest): Promise<GlobalResponseObject> {
    try {
      const unitCode = reqModel.unitCode;
      const companyCode = reqModel.companyCode;
      // checking packing list header exists or not
      const phDetails = await this.packingListService.checkPackingListExistsOrNot(reqModel.phId, reqModel.unitCode, reqModel.companyCode);
      if (!phDetails) {
        throw new ErrorResponse(6004, 'Packing list header not found. Please check.');
      }
      // check GRN is already been confirmed for the packing list or not
      // const grnStatus = await this.packingListService.getGRNStatusForPackingList(reqModel.phId, reqModel.unitCode, reqModel.companyCode);
      // if (grnStatus == GrnStatusEnum.GRN_CONFIRMED) {
      //   throw new ErrorResponse(1030, 'GRN Already been confirmed please check.')
      // }
      // capture grn roll information 
      for (const rollInfo of reqModel.rollsGrnInfo) {
        const rollRec = await this.packListInfoService.getRollRecordForRollId(rollInfo.id);
        if (rollRec.grnStatus == PhLinesGrnStatusEnum.OPEN) {
          await this.packingListService.captureGrnRollInfoForRollId(rollInfo.id, rollInfo.measuredWidth, rollInfo.measuredWeight, PhLinesGrnStatusEnum.DONE, unitCode, companyCode);
        }
      }
      return new GlobalResponseObject(true, 6005, 'GRN details saved successfully for given roll Id');
    } catch (err) {
      throw err;
    }

  }

  /**
   * Service to confirm the GRN
   * @param reqModel 
   * @returns 
  */
  async confirmGrn(reqModel: GrnConfirmRequest): Promise<GlobalResponseObject> {
    const manager = new GenericTransactionManager(this.dataSource);
    try {
      const unitCode = reqModel.unitCode;
      const companyCode = reqModel.companyCode;
      // checking packing list header exists or not
      const phDetails = await this.packingListService.checkPackingListExistsOrNot(reqModel.phId, reqModel.unitCode, reqModel.companyCode);
      if (!phDetails) {
        throw new ErrorResponse(6004, 'Packing list header not found. Please check.');
      }
      // CHECK GRN details there or not
      const grnDetail = await this.phGrnRepo.findOne({ select: ['id'], where: { phID: reqModel.phId, unitCode, companyCode } });
      if (!grnDetail) {
        throw new ErrorResponse(6006, 'GRN Details not found for the given pack list. Please verify')
      }
      // check if the truck is unload complete / out of the factory
      const truckInfo = await this.getVehicleRecordForPackListId(reqModel.phId);
      if (!(truckInfo.status == PackListLoadingStatus.UN_LOADING_COMPLETED || truckInfo.status == PackListLoadingStatus.OUT)) {
        throw new ErrorResponse(0, `Truck No : ${truckInfo.vehicleNumber} unloading is still not completed`);
      }
      await manager.startTransaction();
      // const confirmGrn = reqModel.confirmed ? GrnStatusEnum.GRN_CONFIRMED : GrnStatusEnum.OPEN;
      await manager.getRepository(PhGrnEntity).update({ id: grnDetail.id }, { grnCode: reqModel.grnNo, grnStatus: GrnStatusEnum.GRN_CONFIRMED, grnNumber: reqModel.grnNo, grnDate: reqModel.grnDate });
      await this.packingListService.updateGrnStatusForPackList(reqModel.phId, unitCode, companyCode, GrnStatusEnum.GRN_CONFIRMED, reqModel.username, manager);
      await manager.completeTransaction();
      return new GlobalResponseObject(true, 6007, 'GRN has been successfully approved.')
    } catch (err) {
      manager ? await manager.releaseTransaction() : null;
      throw err;
    }
  }

  /**
   * Service to save basic GRN information details for the packing list . This will be done while user accepts unloading (UNLOADING_START)
   * @param reqModel 
   * @param manager 
   * @returns 
  */
  async saveSystemPreferences(reqModel: SystemPreferenceModel): Promise<GlobalResponseObject> {
    const manager = new GenericTransactionManager(this.dataSource);
    try {
      const unitCode = reqModel.unitCode;
      const companyCode = reqModel.companyCode;
      // checking packing list header exists or not
      const phDetails = await this.packingListService.checkPackingListExistsOrNot(reqModel.phId, reqModel.unitCode, reqModel.companyCode);
      if (!phDetails) {
        throw new ErrorResponse(6004, 'Packing list header not found. Please check.');
      }
      const vehicleDetail = await this.packListVehicleInfo.getPackListVehicleInfo(reqModel.phId, unitCode, companyCode);
      if (!vehicleDetail) {
        throw new ErrorResponse(1049, 'Vehicle Details not found. Please check.');
      }
      // Need to capture GRN details for the 
      const isRecordExist = await this.phGrnRepo.findOne({ where: { phID: reqModel.phId } });
      if (!isRecordExist) {
        const grnEntityObj = new PhGrnEntity();
        if (isRecordExist)
          grnEntityObj.id = isRecordExist ? isRecordExist.id : undefined;
        grnEntityObj.companyCode = companyCode;
        grnEntityObj.createdUser = reqModel.username;
        grnEntityObj.grnInvoiceNumber = vehicleDetail.invoice_no;
        grnEntityObj.grnStatus = GrnStatusEnum.OPEN;
        grnEntityObj.phID = reqModel.phId;
        grnEntityObj.remarks = reqModel.remarks;
        grnEntityObj.rollSelectionType = reqModel.rollSelectionType;
        grnEntityObj.rollsPickPerc = reqModel.rollsPickPercentage;
        grnEntityObj.unitCode = unitCode;
        await manager.startTransaction();
        await manager.getRepository(PhGrnEntity).save(grnEntityObj);
        await manager.completeTransaction();
      }
      return new GlobalResponseObject(true, 1031, 'Inspection Preferences have been saved')
    } catch (err) {
      manager ? manager.releaseTransaction() : null;
      throw err;
    }
  }

  /**
     * Repository to get packing list vehicle info and its status
     * @param packListId 
     * @param uniCode 
     * @param companyCode 
     * @returns 
    */
  async getPackListVehicleInfo(packListId: number, uniCode: string, companyCode: string): Promise<PackListVehicleStatusResp> {
    return await this.packListVehicleInfo.getPackListVehicleInfo(packListId, uniCode, companyCode)
  }

  /**
   * Service to save packing list vehicle details with given security details
   * @param reqModel 
   * @param transactionalEntityManager 
   * @returns 
  */
  async savePackingListVehicleDetails(reqModel: SecurityCheckRequest, transactionalEntityManager: GenericTransactionManager): Promise<PhVehicleEntity> {
    const vehicleDetails = new PhVehicleEntity();
    vehicleDetails.actualUnloadCompleteAt = null;
    vehicleDetails.actualUnloadStartAt = null;
    vehicleDetails.checkListStatus = CheckListStatus.VERIFIED;
    vehicleDetails.companyCode = reqModel.companyCode;
    vehicleDetails.containerNo = reqModel.containerNo;
    vehicleDetails.createdUser = reqModel.username;
    vehicleDetails.cusDecNo = reqModel.cusDecNo;
    vehicleDetails.driverName = reqModel.driverName;
    vehicleDetails.grossWeight = reqModel.grossWeight;
    vehicleDetails.netWeight = reqModel.netWeight;
    vehicleDetails.inAt = reqModel.inAt;
    vehicleDetails.invoiceNo = reqModel.invoiceNo;
    vehicleDetails.netWeight = reqModel.netWeight;
    vehicleDetails.outAt = null;
    vehicleDetails.phId = reqModel.phId;
    vehicleDetails.remarks = reqModel.remarks;
    vehicleDetails.securityName = reqModel.securityPerson;
    vehicleDetails.status = PackListLoadingStatus.IN;
    vehicleDetails.unitCode = reqModel.unitCode;
    vehicleDetails.unloadCompleteAt = null;
    vehicleDetails.unloadStartAt = null;
    vehicleDetails.vehicleContact = reqModel.vehicleContact;
    vehicleDetails.vehicleNumber = reqModel.vehicleNumber;
    return await transactionalEntityManager.getRepository(PhVehicleEntity).save(vehicleDetails);
  }

  /**
   * Service to save security check in details 
   * @param reqModel 
   * @returns 
  */
  async saveSecurityCheckIn(req: ADDVehicleReqModal): Promise<SecurityCheckResponse> {
    const vehiclesNumbers = req.vehicleDetails.map(v => v.vehicleNo = v.vehicleNo.toUpperCase());
    if (vehiclesNumbers.length != new Set(vehiclesNumbers).size) {
      throw new ErrorResponse(6004, 'Vehicle numbers should be unique');
    }
    const transactionalEntityManager = new GenericTransactionManager(this.dataSource);
    try {
      await transactionalEntityManager.startTransaction();
      for (const vehicle of req.vehicleDetails) {
        // VALIDATE PACKING LIST IS ELIGIBLE FOR SECURITY CHECK IN OR NOR
        const reqModel: SecurityCheckRequest = new SecurityCheckRequest(req.username, req.unitCode, req.companyCode, req.userId, vehicle.id, vehicle.vehicleNo, vehicle.dName, req.username, vehicle.dContact, new Date(), undefined, Number(req.refId), CheckListStatus.VERIFIED, undefined, undefined, undefined, undefined, undefined, undefined);
        await this.packingListService.checkPackingListEligibleForSecurityCheckIn(reqModel);
        // SAVING VEHICLE DETAILS FOR A PACKING LIST
        await this.savePackingListVehicleDetails(reqModel, transactionalEntityManager);
      }
      // REMOVE THE BELOW CALL
      await this.packingListService.updatePackListArrivalStatus(Number(req.refId), transactionalEntityManager);
      await transactionalEntityManager.completeTransaction();
      const gatexResponse = await this.gatexService.addVehicleToVINR(req);
      if (!gatexResponse.status) throw new ErrorResponse(5345435, 'Failed to add vehicle to VINR');
      const reqObj = new PackListIdRequest(req.username, req.unitCode, req.companyCode, 0, Number(req.refId));
      return await this.getSecurityCheckDetails(reqObj);
    } catch (err) {
      await transactionalEntityManager.releaseTransaction();
      throw err;
    }
  }

  /**
  * Service to save security check in details 
  * @param reqModel 
  * @returns 
 */
  async saveSecurityCheckOut(reqModel: SecurityCheckRequest): Promise<GlobalResponseObject> {
    const transactionalEntityManager = new GenericTransactionManager(this.dataSource);
    const unitCode = reqModel.unitCode;
    const companyCode = reqModel.companyCode;
    try {
      // VALIDATE PACKING LIST IS ELIGIBLE FOR SECURITY CHECK IN OR NOR
      await this.packingListService.checkPackingListEligibleForSecurityCheckOut(reqModel);
      // SAVING VEHICLE DETAILS FOR A PACKING LIST
      const getSecCheckInDetails = await this.packListVehicleInfo.findOne({ where: { id: reqModel.id, unitCode, companyCode } });
      if (!getSecCheckInDetails) {
        throw new ErrorResponse(1011, 'Packing list security information not found for the given vehicle information Id.');
      }
      if (getSecCheckInDetails.unloadStartAt === null || getSecCheckInDetails.unloadCompleteAt === null) {
        throw new ErrorResponse(1033, `Unloading is not Completed you can't send the vehicle out`);
      }
      await transactionalEntityManager.startTransaction();
      // NEED TO UPDATE THE OUT AT , REMARKS 
      await transactionalEntityManager.getRepository(PhVehicleEntity).update({ id: reqModel.id, unitCode, companyCode }, { outAt: reqModel.outAt, remarks: reqModel.remarks, status: PackListLoadingStatus.OUT });
      const secOutVehicles = await transactionalEntityManager.getRepository(PhVehicleEntity).count({ where: { phId: reqModel.phId, unitCode, companyCode, status: PackListLoadingStatus.OUT } });
      // REMOVE THE BELOW CALL
      // await this.packingListService.updateStatusForPackList(reqModel, transactionalEntityManager, PackingListStatusEnum.SECURITY_OUT);
      await transactionalEntityManager.completeTransaction();
      const reqObj = new PackListIdRequest(reqModel.username, reqModel.unitCode, reqModel.companyCode, 0, reqModel.phId);
      // return await this.getSecurityCheckDetails(reqObj);
      return new GlobalResponseObject(true, 0, 'Vehicle has been dispatched out successfully');
    } catch (err) {
      await transactionalEntityManager.releaseTransaction();
      throw err;
    }
  }

  /**
   * Service 
   * @param reqModel 
   * @returns 
  */
  async getSecurityCheckDetails(reqModel: PackListIdRequest): Promise<SecurityCheckResponse> {
    const unitCode = reqModel.unitCode;
    const companyCode = reqModel.companyCode;
    const securityCheckInDetailsForPackList: PhVehicleEntity[] = await this.packListVehicleInfo.find({ where: { phId: reqModel.packListId, unitCode, companyCode } });
    if (!securityCheckInDetailsForPackList.length) {
      throw new ErrorResponse(1011, 'Packing list security information not found for the given packing list Id.');
    }
    const checkInDetails: SecurityCheckModel[] = [];
    for (const securityCheckInDetails of securityCheckInDetailsForPackList) {
      const securityDetails = new SecurityCheckModel(securityCheckInDetails.id, securityCheckInDetails.vehicleNumber, securityCheckInDetails.driverName, securityCheckInDetails.securityName, securityCheckInDetails.vehicleContact, securityCheckInDetails.inAt, securityCheckInDetails.outAt, securityCheckInDetails.phId, securityCheckInDetails.createdUser, securityCheckInDetails.unitCode, securityCheckInDetails.companyCode, 0, securityCheckInDetails.checkListStatus, securityCheckInDetails.containerNo, securityCheckInDetails.cusDecNo, securityCheckInDetails.grossWeight, securityCheckInDetails.netWeight, securityCheckInDetails.invoiceNo, securityCheckInDetails.remarks);
      checkInDetails.push(securityDetails);
    }
    return new SecurityCheckResponse(true, 1012, 'Security check in details retrieved successfully for given packing list Id.', checkInDetails);
  }

  /**
     * Service to get system Preferences for packing list Id
     * @param packListId 
     * @param unitCode 
     * @param companyCode 
    */
  async getSystemPreferenceForPackListId(packListId: number, unitCode: string, companyCode: string, username?: string, userId?: number): Promise<SystemPreferenceResp> {
    const res: SystemPreferenceQryResp = await this.phGrnRepo.getSystemPreferenceForPackListId(packListId, unitCode, companyCode);
    if (res) {
      return new SystemPreferenceResp(true, 123, '', new SystemPreferenceModel(username, unitCode, companyCode, userId, packListId, res?.roll_selection_type, res?.rolls_pick_perc, res?.remarks));
    } else {
      return new SystemPreferenceResp(false, 123, 'No Data found')
    }
  }

  async getAvgVehicleUnloadingTime(): Promise<GrnUnLoadingResponse> {
    const result = await this.phVehicleRepo.getAvgVehicleUnloadingTime();
    return new GrnUnLoadingResponse(true, 22, 'Data retrived successfully', result);
  }

  async getHowMuchTimeVehicleInThePlant(): Promise<GrnVehiclesInThePlantResp> {
    const result: any = await this.phVehicleRepo.getHowMuchTimeVehicleInThePlant();
    return new GrnVehiclesInThePlantResp(true, 22, 'Data retrived successfully', result);
  }

  async getHowManyVechicleCurrentlyUnloading(): Promise<GrnUnLoadingResponse> {
    const result: any = await this.phVehicleRepo.getHowManyVechicleCurrentlyUnloading();
    return new GrnUnLoadingResponse(true, 22, 'Data retrived successfully', result);
  }

  async getNoOfVehiclesArrived(): Promise<GrnVehiclesInThePlantResp> {
    const result: any = await this.phVehicleRepo.getNoOfVehiclesArrived();
    return new GrnVehiclesInThePlantResp(true, 22, 'Data retrived successfully', result)
  }

  async getNoOfVehiclesUnloadingInprogress(): Promise<GrnUnLoadingResponse> {
    const result: any = await this.phVehicleRepo.getNoOfVehiclesUnloadingInprogress();
    return new GrnUnLoadingResponse(true, 22, 'Data retrived successfully', result)
  }

  async getNoOfVehiclesToBeArrived(): Promise<PackingListDeliveryDateResp> {
    const result: any = await this.phVehicleRepo.getNoOfVehiclesToBeArrived();
    return new PackingListDeliveryDateResp(true, 22, 'Data retrived successfully', result)
  }

  async getNoOfVehiclesWaitingForUnloading(): Promise<GrnUnLoadingResponse> {
    const result: any = await this.phVehicleRepo.getNoOfVehiclesWaitingForUnloading();
    return new GrnUnLoadingResponse(true, 22, 'Data retrived successfully', result)
  }

  async getNoOfvehiclesCompletedUnloading(): Promise<GrnUnLoadingResponse> {
    const result: any = await this.phVehicleRepo.getNoOfvehiclesCompletedUnloading();
    return new GrnUnLoadingResponse(true, 22, 'Data retrived successfully', result)
  }

  async getNoOfVehiclesInPlant(): Promise<VehiclesResponse> {
    const result: any = await this.packListVehicleInfo.getNoOfVehiclesInPlant()
    return new VehiclesResponse(true, 234, 'Vehicles in plant data retrived successfully', result)
  }

  async getUnloadingCompletedNotAtSecurityCheckOutVehicles(): Promise<VehiclesResponse> {
    const result: any = await this.packListVehicleInfo.getUnloadingCompletedNotAtSecurityCheckOutVehicles()
    return new VehiclesResponse(true, 3305, 'unloading completed not at security check out vehicles data', result)
  }

  /**
     * Service to get system Preferences for packing list Id
     * @param packListId 
     * @param unitCode 
     * @param companyCode 
    */
  async grnUnloadStartStatus(packListId: number, unitCode: string, companyCode: string, username?: string, userId?: number): Promise<boolean> {
    const vehicleDetail = await this.packListVehicleInfo.getPackListVehicleInfo(packListId, unitCode, companyCode);
    if (!vehicleDetail) {
      throw new ErrorResponse(1049, 'Vehicle Details not found. Please check.');
    }
    if (PackListLoadingStatus.IN != vehicleDetail.status && PackListLoadingStatus.UN_LOADING_PAUSED != vehicleDetail.status) {
      return true;
    }
    return false;
  }



}
