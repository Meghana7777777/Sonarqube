import { Injectable } from "@nestjs/common"; import { DataSource } from "typeorm";
import moment = require("moment");
import { EmbDispatchHelperService } from "./emb-dispatch-helper.service";
import { EmbDispatchInfoService } from "./emb-dispatch-info.service";
import { EmbDisptachHeaderRepository } from "./repository/emb-dispatch-header.repository";
import { EmbDispatchLineRepository } from "./repository/emb-dispatch-line.repository";
import { EmbDispatchProgressRepository } from "./repository/emb-dispatch-progress.repository";
import { EmbDispatchCreateRequest, EmbDispatchIdStatusRequest, EmbDispatchStatusEnum, GlobalResponseObject, embDispatchStatusEnumDisplayValues, embDispatchStatusOrder } from "@xpparel/shared-models";
import { ErrorResponse } from "@xpparel/backend-utils";
import { redlock } from "../../config/redis/redlock.config";
import { GenericTransactionManager } from "../../database/typeorm-transactions";
import { EmbDispatchHeaderEntity } from "./entity/emb-dispatch-header.entity";
import { EmbDispatchLineEntity } from "./entity/emb-dispatch-line.entity";
import { EmbHeaderEntity } from "../emb-request/entity/emb-header.entity";
import { EmbLineEntity } from "../emb-request/entity/emb-line.entity";
import { EmbDispatchProgressEntity } from "./entity/emb-dispatch-progress.entity";

@Injectable()
export class EmbDispatchService {
  constructor(
    private dataSource: DataSource,
    private infoService: EmbDispatchInfoService,
    private helperService: EmbDispatchHelperService,
    private embDisReqRepo: EmbDisptachHeaderRepository,
    private embDisLineRepo: EmbDispatchLineRepository,
    private embDisProgRepo: EmbDispatchProgressRepository
  ) {

  }

  // END POINT
  async createEmbDispatch(req: EmbDispatchCreateRequest): Promise<GlobalResponseObject> {
    let lock;
    const transManager = new GenericTransactionManager(this.dataSource);
    try {
      if(!req.embLineIds) {
        throw new ErrorResponse(16022, 'Emb lines are not selected');
      }
      const embLineRecs = await this.helperService.getEmbLineRecordsForEmbLineIds(req.embLineIds, req.companyCode, req.unitCode);
      if(embLineRecs.length != req.embLineIds.length){
        throw new ErrorResponse(16023, 'Emb lines are not found');
      }
      const embHeaderIds = new Set<number>();
      // check if the gate pass req is already created for the emb lines
      for(const embLine of embLineRecs) {
        const disReq = await this.infoService.getDisptachLineRecordForLineRefId(embLine.id, req.companyCode, req.unitCode);
        if (disReq) {
          throw new ErrorResponse(16024, `Dispatch request is already created for the docket: ${embLine.embParentJobRef}`);
        }
      }
      const embVendors = new Set<number>();
      const subPoSerials = new Set<number>();
      // now check if the selected emb lines haved the same supplier
      embLineRecs.forEach(r => {
        embVendors.add(r.supplierId);
        subPoSerials.add(r.poSerial);
        embHeaderIds.add(r.embHeaderId);
      })
      if(embVendors.size > 1) {
        throw new ErrorResponse(16025, 'Multiple vendors cannot be under the same dispacth request');
      }
      if(subPoSerials.size > 1){
        throw new ErrorResponse(16026, 'A dispatch request can only have 1 cut order');
      }

      const poSerial = embLineRecs[0].poSerial;
      // get the emb header records for the emb header ids
      const embHeaderRecs = await this.helperService.getEmbHeaderRecordsForEmbHeaderIds(Array.from(embHeaderIds), req.companyCode, req.unitCode);
      const embHeaderIdIdInfoMap = new Map<number, EmbHeaderEntity>();
      embHeaderRecs.forEach(r => { embHeaderIdIdInfoMap.set(r.id, r); });

      const lockKey = `DISPATCH-${poSerial}`;
      var ttl = 120000;
      lock = await redlock.lock(lockKey, ttl);

      const toalDrsForPoSerial = await this.infoService.getDisptachRecordForPoSerial(poSerial, req.companyCode, req.unitCode);
      // identify the last request and create the next request number from there on by summing the request number
      const lastRecord = toalDrsForPoSerial[toalDrsForPoSerial.length-1];
      // req number format:   "ED:poserial-autoinc"
      // get the last auto inc number and do a +1 to the request number
      const preReqIndex = lastRecord ? Number(lastRecord.requestNumber.split('-')[1]) : 0;

      await transManager.startTransaction();
      // construct the dispatch entities
      const drEnt = new EmbDispatchHeaderEntity();
      drEnt.companyCode = req.companyCode;
      drEnt.unitCode = req.unitCode;
      drEnt.createdUser = req.username;
      drEnt.poSerial = poSerial;
      drEnt.requestNumber = `ED:${poSerial}-${(preReqIndex + 1)}`;
      drEnt.printStatus = false;
      drEnt.vendorId = req.vendorId;
      drEnt.requestStatus = EmbDispatchStatusEnum.OPEN;
      const savedDrHeader = await transManager.getRepository(EmbDispatchHeaderEntity).save(drEnt);

      const embDrLines: EmbDispatchLineEntity[] = [];
      embLineRecs.forEach(r => {
        const embDrLine = new EmbDispatchLineEntity();
        embDrLine.companyCode = req.companyCode;
        embDrLine.unitCode = req.unitCode;
        embDrLine.createdUser = req.username;
        embDrLine.embDrId = savedDrHeader.id;
        embDrLine.embLineId = r.id;
        embDrLine.embJobNumber = embHeaderIdIdInfoMap.get(r.embHeaderId).embJobNumber;
        embDrLine.embParentJobRef = r.embParentJobRef;
        embDrLine.embActualJobRef = r.embActualJobRef;
        embDrLines.push(embDrLine);
      });
      await transManager.getRepository(EmbDispatchLineEntity).save(embDrLines, {reload: false});
      await transManager.completeTransaction();
      await lock.unlock();
      return new GlobalResponseObject(true, 16027, "Emb dispatch request created successfully");
    } catch (error) {
      await transManager.releaseTransaction();
      // release the lock
      lock ? await lock.unlock() : '';
      throw error;
    }
  }


  // END POINT
  async deleteEmbDispatch(req: EmbDispatchIdStatusRequest): Promise<GlobalResponseObject> {
    let lock;
    const transManager = new GenericTransactionManager(this.dataSource);
    try {
      const embDrEnt = await this.infoService.getDisptachRecordForDrId(req.embDispatchId, req.companyCode, req.unitCode);
      if(!embDrEnt) {
        throw new ErrorResponse( 16068, `No dispatch requests found for the ${req.embDispatchId}`);
      }
      if(embDrEnt.requestStatus != EmbDispatchStatusEnum.OPEN) {
        throw new ErrorResponse(16028, `The status is already ${embDrEnt.requestStatus}. Request cannot be deleted`);
      }
      const lockKey = `DISPATCH-${embDrEnt.poSerial}`;
      var ttl = 120000;
      lock = await redlock.lock(lockKey, ttl);

      await transManager.startTransaction();
      await transManager.getRepository(EmbDispatchHeaderEntity).delete({ poSerial: embDrEnt.poSerial, companyCode: req.companyCode, unitCode: req.unitCode });
      await transManager.getRepository(EmbDispatchLineEntity).delete({ companyCode: req.companyCode, unitCode: req.unitCode, embDrId: embDrEnt.id });

      await transManager.completeTransaction();
      await lock.unlock();
      return new GlobalResponseObject(true, 16029, 'The emb dispatch requested deleted successfully');
    } catch (error) {
      await transManager.releaseTransaction();
      // release the lock
      if(lock) {
        await lock.unlock();
      }
      throw error;
    }
  }

  // END POINT
  async updateEmbDispatchStatus(req: EmbDispatchIdStatusRequest): Promise<GlobalResponseObject> {
    const transManager = new GenericTransactionManager(this.dataSource);
    try {
      const embDrEnt = await this.infoService.getDisptachRecordForDrId(req.embDispatchId, req.companyCode, req.unitCode);
      if(!embDrEnt) {
        throw new ErrorResponse( 16068, `No dispatch requests found for the ${req.embDispatchId}`);
      }
      if (embDrEnt.requestStatus == req.dispatchStatus) {
        throw new ErrorResponse(16030, `The current status is already in ${embDispatchStatusEnumDisplayValues[embDrEnt.requestStatus]}`);
      }
      const currentStatusOrder = embDispatchStatusOrder[embDrEnt.requestStatus];
      const incomingStatusOrder = embDispatchStatusOrder[req.dispatchStatus];
      if (incomingStatusOrder < currentStatusOrder) {
        throw new ErrorResponse(16031, `The current status is ${embDispatchStatusEnumDisplayValues[embDrEnt.requestStatus]}. Previous status update is not allowed`);
      }
      const embDisProgEnt = new EmbDispatchProgressEntity();
      embDisProgEnt.embDrId = req.embDispatchId;
      embDisProgEnt.requestStatus = req.dispatchStatus;
      await transManager.startTransaction();
      await transManager.getRepository(EmbDispatchHeaderEntity).update({companyCode: req.companyCode, unitCode: req.unitCode, id: req.embDispatchId, poSerial: embDrEnt.poSerial}, { requestStatus: req.dispatchStatus } );
      await transManager.getRepository(EmbDispatchProgressEntity).save(embDisProgEnt, {reload: false});
      await transManager.completeTransaction();
      return new GlobalResponseObject(true, 16032, 'The emb dispatch status changed successfully');
    } catch (error) {
      await transManager.releaseTransaction();
      throw error;
    }
  }
  
  // END POINT
  async updatePrintStatusForDrId(req: EmbDispatchIdStatusRequest): Promise<GlobalResponseObject> {
    const embDrEnt = await this.infoService.getDisptachRecordForDrId(req.embDispatchId, req.companyCode, req.unitCode);
    if(!embDrEnt) {
      throw new ErrorResponse( 16068, `No dispatch requests found for the ${req.embDispatchId}`);
    }
    await this.embDisReqRepo.update({companyCode: req.companyCode, unitCode: req.unitCode, id: req.embDispatchId, poSerial: embDrEnt.poSerial}, { printStatus: true } );
    return new GlobalResponseObject(true, 16033, 'Print status updated successfully');
  }
}