import { Injectable } from "@nestjs/common";
import { DataSource, LessThan, MoreThan, MoreThanOrEqual } from "typeorm";
import { DocketMaterialHelperService } from "../docket-material/docket-material-helper.service";
import { DocketMaterialInfoService } from "../docket-material/docket-material-info.service";
import { CutTableDocketPlanRequest, CutTableDocketUnPlanRequest, CutTableDocketsResponse, CutTableOpenDocketsResponse, GlobalResponseObject, MaterialRequestNoRequest, MaterialRequestToWhRequest, PoDocketNumberRequest, TaskStatusEnum, WhAckEnum, WhExtReqNoRequest, WhMatReqLineStatusEnum, WhReqByObjectEnum } from "@xpparel/shared-models";
import { GenericTransactionManager } from "../../database/typeorm-transactions";
import { PoDocketCutTableEntity } from "./entity/po-docket-cut-table.entity";
import { ErrorResponse } from "@xpparel/backend-utils";
import { DocketPlanningInfoService } from "./docket-planning-info.service";
import { DocketPlanningHelperService } from "./docket-planning-helper.service";
import { PoDocketCutTableRepository } from "./repository/po-docket-cut-table.repository";
import moment from 'moment';
import { PoDocketMaterialEntity } from "../docket-material/entity/po-docket-material.entity";
import { PoDocketMaterialRequestEntity } from "../docket-material/entity/po-docket-material-request.entity";

@Injectable()
export class DocketPlanningService {
  constructor(
    private dataSource: DataSource,
    private docPlanningInfoService: DocketPlanningInfoService,
    private docPlanningHelperService: DocketPlanningHelperService,
    private docPlanRepo: PoDocketCutTableRepository
  ) {

  }

  /**
   * WRITER
   * BULLJOB CONSUMER - CURRENTLY being called from the material request service directly
   * ENDPOINT
   * This function saves the docket record into the cut-table-plan after the docket is generated/ after the save allocation is done for a docket
   * @param docNoRequest 
   */
  async saveDocketsToDocPlan(req: MaterialRequestNoRequest): Promise<GlobalResponseObject> {
    // if the record is alreadt present throw error
    const docPlanRec = await this.docPlanRepo.findOne({select:['id'], where: {companyCode: req.companyCode, unitCode: req.unitCode, requestNumber: req.materialRequestNo } });
    if(docPlanRec) {
      throw new ErrorResponse(0, 'Docket request is already created in the planning table')
    }
    const docReqInfo = await this.docPlanningHelperService.getDocketMaterialRequestRecordByReqNumber(req.materialRequestNo, req.companyCode, req.unitCode);
    const plantEnt = new PoDocketCutTableEntity();
    plantEnt.companyCode = req.companyCode;
    plantEnt.unitCode = req.unitCode;
    plantEnt.docketGroup = docReqInfo.docketGroup;
    plantEnt.requestNumber = docReqInfo.requestNumber;
    // plantEnt.plannedDateTime = moment().format('YYYY-MM-DD HH:mm:ss');
    plantEnt.resourceDesc = '';
    plantEnt.resourceId = '';
    plantEnt.createdUser = req.username;
    plantEnt.priority = 0;
    plantEnt.remarks = '';
    plantEnt.poSerial = docReqInfo.poSerial;
    plantEnt.taskStatus = TaskStatusEnum.OPEN;
    await this.docPlanRepo.save(plantEnt);
    return new GlobalResponseObject(true, 0, 'Docket request created in pendng cuttable list');
  }

  /**
   * will be called by the docket-material deletion process
   * @param req 
   * @returns 
   */
  async deleteDocketsFromDocPlan(req: MaterialRequestNoRequest, manager?: GenericTransactionManager): Promise<GlobalResponseObject> {
    const transManager = manager ? manager : new GenericTransactionManager(this.dataSource);
    try {
      // if the record is alreadt present throw error
      const docPlanRec = await this.docPlanRepo.findOne({select:['id', 'resourceId', 'matFulfillmentDateTime', 'resourceDesc', 'whAck'], where: {companyCode: req.companyCode, unitCode: req.unitCode, requestNumber: req.materialRequestNo } });
      if(!docPlanRec) {
        throw new ErrorResponse(0, 'Docket request is not created in the planning table')
      }
      if(docPlanRec.resourceId){
        throw new ErrorResponse(0, `The request ${req.materialRequestNo} is already planned to cut table ${docPlanRec.resourceDesc}`);
      }
      // for a safety side, also check the WH ACK status
      if(docPlanRec.whAck != WhAckEnum.OPEN) {
        throw new ErrorResponse(0, `The request ${req.materialRequestNo} is already sent to the Warehouse. Please unplan the docket and try`);
      }
      await transManager.getRepository(PoDocketCutTableEntity).delete({ companyCode: req.companyCode, unitCode: req.unitCode, requestNumber: req.materialRequestNo });
      return new GlobalResponseObject(true, 0, 'Docket request removed from the pendng cuttable list');
    } catch (error) {
      if(!manager){
        await transManager.releaseTransaction();
      }
      throw error;
    }
  } 

  /**
   * WRITER
   * ENDPOINT
   * plans the docket to a workstation
   * @param req 
   * @returns 
   */
  async planDocketRequestsToCutTable(req: CutTableDocketPlanRequest): Promise<GlobalResponseObject> {
    let transManager = new GenericTransactionManager(this.dataSource);
    try {
      if(req.docketsList.length > 1) {
        throw new ErrorResponse(0, 'You can plan only 1 request at a time');
      }
      // check if the request is available in the cut-table-plan
      const currPlanningDoc = req.docketsList[0];
      const reqRecord = await this.docPlanRepo.findOne({ select: ['id', 'resourceId', 'resourceDesc'], where: { companyCode: req.companyCode, unitCode: req.unitCode, requestNumber: currPlanningDoc.matReqNo, docketGroup: currPlanningDoc.docketGroup} });
      if(!reqRecord) {
        throw new ErrorResponse(0, `Request ${currPlanningDoc.matReqNo} does not exist in pending to cut table requests`);
      }
      if(reqRecord.resourceId) {
        throw new ErrorResponse(0, `Request ${currPlanningDoc.matReqNo} is already planned to ${reqRecord.resourceDesc}`);
      }
      // get the cut table info from the masters
      const tableInfo = await this.docPlanningHelperService.getWorkstationInfo(req.tableId, req.companyCode, req.unitCode);
      if(!tableInfo) {
        throw new ErrorResponse(0, `Given table id : ${req.tableId} does not exist`);
      }

      let priority = 0;
      // If np priority is provided, then plan it to the last
      if(!currPlanningDoc.priority) {
        // get the max priority for the current table
        const maxPriority = await this.docPlanRepo.getMaxPriorityForWorkstationId(req.tableId.toString(), req.companyCode, req.unitCode);
        priority = maxPriority+1;
      } else {
        priority = currPlanningDoc.priority;
      }
      // const planTime =  moment().format('YYYY-MM-DD HH:mm:ss');
      const resourceDesc = tableInfo.tableDesc;
      await transManager.startTransaction();
      await transManager.getRepository(PoDocketCutTableEntity).update({ id: reqRecord.id, companyCode: req.companyCode, unitCode: req.unitCode }, 
        { plannedDateTime: ()=>`Now()`, updatedUser: req.username, resourceId: req.tableId.toString(), resourceDesc: resourceDesc, taskStatus: TaskStatusEnum.INPROGRESS, priority: priority});
      // Swap the priorities of other dockets only if the incoming priority is > 0. When we are plannning at the last priority, there is no need to change the priorities
      if(currPlanningDoc.priority > 0) {
        await this.updateThePrioritiesBasedOnThePlan(req.tableId.toString(), currPlanningDoc.priority, reqRecord.id, req.companyCode, req.unitCode, transManager);
      }
      await transManager.completeTransaction();
      return new GlobalResponseObject(true, 0, 'Docket request is planned to cut table');
    } catch (err) {
      await transManager.releaseTransaction();
      throw err;
    }
  }

  /**
   * HELPER
   * WRITER
   * @param tableId 
   * @param priority 
   * @param currentId This is to ensure after updating the priority to new record, we have to skip that specific record while doing the priority adjustments
   * @param companyCode 
   * @param unitCode 
   * @param manager 
   * @returns 
   */
  async updateThePrioritiesBasedOnThePlan(tableId: string, priority: number, currentId: number, companyCode: string, unitCode: string, manager?: GenericTransactionManager): Promise<boolean> { 
    // const lowPriorityRequests = await manager.getRepository(PoDocketCutTableEntity).find({select: ['id', 'priority'], where: { companyCode: companyCode, unitCode: unitCode, resourceId: tableId, taskStatus: TaskStatusEnum.INPROGRESS, priority: LessThan(priority)}});
    let limiter = priority;
    const hightPriorityRequests = await manager.getRepository(PoDocketCutTableEntity).find({select: ['id', 'priority'], where: { companyCode: companyCode, unitCode: unitCode, resourceId: tableId, taskStatus: TaskStatusEnum.INPROGRESS, priority: MoreThanOrEqual(priority)}, order: {priority: 'ASC'}  });
    for(const rec of hightPriorityRequests) {
      if(currentId == rec.id) {
        continue;
      }
      // if the current record priority is already greater than +1 of the incoming priority, then dont update it
      if(rec.priority <= limiter) {
        await manager.getRepository(PoDocketCutTableEntity).update({ id: rec.id, companyCode: companyCode, unitCode: unitCode}, { priority: ()=>`priority + 1`});
        limiter += 1;
      }
    }
    return true;
  }

  /**
   * ENDPOINT
   * WRITER
   * @param req 
   * @returns 
   */
  async unPlanDocketRequestsFromCutTable(req: CutTableDocketUnPlanRequest): Promise<GlobalResponseObject> {
    const currPlanningDoc = req.docketsList[0]; 
    const reqRecord = await this.docPlanRepo.findOne({ where: { companyCode: req.companyCode, unitCode: req.unitCode, requestNumber: currPlanningDoc.matReqNo, docketGroup: currPlanningDoc.docketGroup} });
    if(!reqRecord) {
      throw new ErrorResponse(0, `Request ${currPlanningDoc.matReqNo} does not exist`);
    }
    // check if the WH started action on this request
    if(reqRecord.taskStatus == TaskStatusEnum.COMPLETED) {
      throw new ErrorResponse(0, `Request ${currPlanningDoc.matReqNo} is already completed. You cannot unplan`);
    }
    if(reqRecord.matReqOn || reqRecord.whAck != WhAckEnum.OPEN) {
      throw new ErrorResponse(0, `Material is requested for the docket : ${currPlanningDoc.docketGroup} and request : ${currPlanningDoc.matReqNo}`);
    }
    // Safe valiation 
    // The WH material issuance validation
    const docMatReqStatus = await this.docPlanningHelperService.getDocketMaterialRequestRecordByReqNumber(reqRecord.requestNumber, req.companyCode, req.unitCode);
    if (docMatReqStatus.requestStatus != WhMatReqLineStatusEnum.OPEN) {
      throw new ErrorResponse(0, 'WH team already started working on the request. You cannot unplan');
    }
    await this.docPlanRepo.update({ companyCode: req.companyCode, unitCode: req.unitCode, requestNumber: currPlanningDoc.matReqNo, docketGroup: currPlanningDoc.docketGroup }, { resourceId: '', resourceDesc: '', priority: 0, taskStatus: TaskStatusEnum.OPEN });
    // TODO : Create the record in the history table
    return new GlobalResponseObject(true, 0, 'Request unplanned successfully');
  }


  /**
   * ENDPOINT
   * WRITER
   * @param req 
   * @returns 
   */
  async swapDocketRequestsToDiffCutTable(req: CutTableDocketPlanRequest): Promise<GlobalResponseObject> {
    let transManager = new GenericTransactionManager(this.dataSource);
    try {
      const currPlanningDoc = req.docketsList[0];
      const reqRecord = await this.docPlanRepo.findOne({ select: ['id', 'resourceId', 'resourceDesc'], where: { companyCode: req.companyCode, unitCode: req.unitCode, requestNumber: currPlanningDoc.matReqNo, docketGroup: currPlanningDoc.docketGroup } });
      if(reqRecord.taskStatus == TaskStatusEnum.COMPLETED || reqRecord.taskStatus == TaskStatusEnum.OPEN) {
        throw new ErrorResponse(0, 'The docket is not yet planned or already compelted');
      }
      if(req.tableId.toString() == reqRecord.resourceId) {
        throw new ErrorResponse(0, `Request ${currPlanningDoc.matReqNo} is already planned to ${reqRecord.resourceDesc}`);
      }
      // get the resource info
      const tableInfo = await this.docPlanningHelperService.getWorkstationInfo(req.tableId, req.companyCode, req.unitCode);
      if(!tableInfo) {
        throw new ErrorResponse(0, `Given table id : ${req.tableId} does not exist`);
      }

      let priority = 0;
      // If np priority is provided, then plan it to the last
      if(!currPlanningDoc.priority) {
        // get the max priority for the current table
        const maxPriority = await this.docPlanRepo.getMaxPriorityForWorkstationId(req.tableId.toString(), req.companyCode, req.unitCode);
        priority = maxPriority+1;
      } else {
        priority = currPlanningDoc.priority;
      }
      await transManager.startTransaction();
      await transManager.getRepository(PoDocketCutTableEntity).update({ requestNumber: currPlanningDoc.matReqNo, docketGroup: currPlanningDoc.docketGroup, companyCode: req.companyCode, unitCode: req.unitCode}, 
        { priority: priority, resourceId: req.tableId.toString(), resourceDesc: tableInfo.tableDesc });
      if(currPlanningDoc.priority > 0) {
        await this.updateThePrioritiesBasedOnThePlan(req.tableId.toString(), currPlanningDoc.priority, reqRecord.id, req.companyCode, req.unitCode, transManager);
      }
      await transManager.completeTransaction();
      return new GlobalResponseObject(true, 0, 'Request planned to new table successfully');
    } catch (err) {
      await transManager.releaseTransaction();
      throw err;
    }
  }

  /**
   * WRITER
   * ENDPOINT
   * @param req 
   */
  async swapDocketRequestsPriority(req: CutTableDocketPlanRequest): Promise<GlobalResponseObject> {
    let transManager = new GenericTransactionManager(this.dataSource);
    try {
      const currPlanningDoc = req.docketsList[0];
      const reqRecord = await this.docPlanRepo.findOne({ select: ['id', 'resourceId', 'resourceDesc'], where: { companyCode: req.companyCode, unitCode: req.unitCode, requestNumber: currPlanningDoc.matReqNo, id: currPlanningDoc.id} });
      if(!reqRecord) {
        throw new ErrorResponse(0, `Request ${currPlanningDoc.matReqNo} does not exist`);
      }
      if(reqRecord.taskStatus == TaskStatusEnum.COMPLETED) {
        throw new ErrorResponse(0, `Request ${currPlanningDoc.matReqNo} is already completed. You cannot change priority`);
      }
      let priority = 0;
      // If np priority is provided, then plan it to the last
      if(!currPlanningDoc.priority) {
        // get the max priority for the current table
        const maxPriority = await this.docPlanRepo.getMaxPriorityForWorkstationId(req.tableId.toString(), req.companyCode, req.unitCode);
        priority = maxPriority+1;
      } else {
        priority = currPlanningDoc.priority;
      }
      await transManager.startTransaction();
      await await transManager.getRepository(PoDocketCutTableEntity).update({ requestNumber: currPlanningDoc.matReqNo, docketGroup: currPlanningDoc.docketGroup, companyCode: req.companyCode, unitCode: req.unitCode}, 
        { priority: priority });
      if(currPlanningDoc.priority > 0) {
        await this.updateThePrioritiesBasedOnThePlan(req.tableId.toString(), currPlanningDoc.priority, reqRecord.id, req.companyCode, req.unitCode, transManager);
      }
      await transManager.completeTransaction();
      return new GlobalResponseObject(true, 0, 'Priority changed successfully');
    } catch (err) {
      await transManager.releaseTransaction();
      throw err;
    }
  }

  
  /**
   * WRITER
   * ENDPOINT - Called from the Cut table planning screen
   * @param req 
   * @returns 
   */
  async requestFabricForDocketRequest(req: MaterialRequestToWhRequest): Promise<GlobalResponseObject> {
    try {
      const reqRecord = await this.docPlanRepo.findOne({ select: ['id', 'matFulfillmentDateTime', 'docketGroup'], where: { companyCode: req.companyCode, unitCode: req.unitCode, requestNumber: req.materialRequestNo, docketGroup: req.docketGroup, taskStatus: TaskStatusEnum.INPROGRESS} });
      if(!reqRecord) {
        throw new ErrorResponse(0, `Request ${req.materialRequestNo} does not exist`);
      }
      if(reqRecord.matFulfillmentDateTime) {
        throw new ErrorResponse(0, `Material is already requested for the request : ${req.materialRequestNo}`);
      }
      // check for the date time format validation
      if(req.fulfillemtDateTime) {
        const materialFulFilledBy = moment(new Date(req.fulfillemtDateTime)).format('YYYY-MM-DD HH:mm:ss');
        req.fulfillemtDateTime = materialFulFilledBy;
      }
      // update the material request fulfillment date time
      await this.docPlanRepo.update({companyCode: req.companyCode, unitCode: req.unitCode, requestNumber: req.materialRequestNo}, { matFulfillmentDateTime: req.fulfillemtDateTime, matReqBy: req.username, matReqOn: ()=>`Now()`, whAck: WhAckEnum.SENT_SIGNAL});
      // trigger the job to create the warehouse req in WMS
      // WH_FAB_REQ_CREATION
      const reqNoReq = new MaterialRequestNoRequest(req.username, req.unitCode, req.companyCode, req.userId, req.materialRequestNo, [], reqRecord.docketGroup);
      const whReqStatus = await this.docPlanningHelperService.createFabricRequestInWh(reqNoReq);
      if(whReqStatus) {
        await this.docPlanRepo.update({companyCode: req.companyCode, unitCode: req.unitCode, requestNumber: req.materialRequestNo}, { whAck: WhAckEnum.ACK_RECEIVED });
      }
      return new GlobalResponseObject(true, 0, 'Material is requested for the docket'); 
    } catch (error) {
      throw error;
    }
  }

  /**
   * WRITER 
   * This will undo the fabric request processs. Also deletes the WH fab request 
   * @param req 
   * @returns 
   */
  async unRequestFabricForDocketRequest(req: MaterialRequestToWhRequest): Promise<GlobalResponseObject> {
    const reqRecord = await this.docPlanRepo.findOne({ select: ['id', 'matFulfillmentDateTime', 'docketGroup', 'whAck', 'requestNumber'], where: { companyCode: req.companyCode, unitCode: req.unitCode, requestNumber: req.materialRequestNo, docketGroup: req.docketGroup, taskStatus: TaskStatusEnum.INPROGRESS} });
    if(!reqRecord) {
      throw new ErrorResponse(0, `Request ${req.materialRequestNo} does not exist`);
    }
    if(!reqRecord.matFulfillmentDateTime) {
      throw new ErrorResponse(0, `Material is not requested for the request : ${req.materialRequestNo}`);
    }
    // If the WH Req in not created in WMS, then this will be in the WhAckEnum.SENT_SIGNAL state. So first we have to check if the request is really created in the WH
    if(reqRecord.whAck != WhAckEnum.ACK_RECEIVED) {
      throw new ErrorResponse(0, `Material requested for the request : ${req.materialRequestNo} is not sent to the WH team. Please check and then de-allocate`);
    }
    // update the material request fulfillment date time to empty
    await this.docPlanRepo.update({companyCode: req.companyCode, unitCode: req.unitCode, requestNumber: req.materialRequestNo}, { matFulfillmentDateTime: null, matReqBy: null, matReqOn: null});
    // TODO insert the record into the history table
    const extReq = new WhExtReqNoRequest(req.username, req.unitCode, req.companyCode, req.userId, reqRecord.requestNumber, reqRecord.id, WhReqByObjectEnum.DOCKET);
    // delete the request from the WH
    const whReqStatus = await this.docPlanningHelperService.deleteFabricRequestInWh(extReq);
    await this.docPlanRepo.update({companyCode: req.companyCode, unitCode: req.unitCode, requestNumber: req.materialRequestNo}, { whAck: WhAckEnum.OPEN });
    return new GlobalResponseObject(true, 0, 'Material is successfully un-requested for the docket');
  }

  // HELPER
  // Called after cut rpeorting or reversal
  async updateTaskStatusForDocketRequest(poSerial: number, reqNo: string, companyCode: string, unitCode: string, status: TaskStatusEnum, transManager: GenericTransactionManager): Promise<boolean> {
    if(transManager) {
      await transManager.getRepository(PoDocketCutTableEntity).update({ companyCode: companyCode, unitCode: unitCode, requestNumber: reqNo, poSerial: poSerial }, { taskStatus: status });
    } else {
      await this.docPlanRepo.update({ companyCode: companyCode, unitCode: unitCode, requestNumber: reqNo, poSerial: poSerial  }, { taskStatus: status });
    }
    return true;
  }

  // HELPER
  // Called after cut rpeorting or reversal
  async updateTaskStatusForDocketGroup(poSerial: number, docketGroup: string, companyCode: string, unitCode: string, status: TaskStatusEnum, transManager: GenericTransactionManager): Promise<boolean> {
    if(transManager) {
      await transManager.getRepository(PoDocketCutTableEntity).update({ companyCode: companyCode, unitCode: unitCode, docketGroup: docketGroup, poSerial: poSerial }, { taskStatus: status });
    } else {
      await this.docPlanRepo.update({ companyCode: companyCode, unitCode: unitCode, docketGroup: docketGroup, poSerial: poSerial  }, { taskStatus: status });
    }
    return true;
  }

}