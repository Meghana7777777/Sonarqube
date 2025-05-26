import { Injectable } from "@nestjs/common"; import { DataSource, In } from "typeorm";
import moment = require("moment");
import { CutDispatchInfoService } from "./cut-dispatch-info.service";
import { CutDispatchHelperService } from "./cut-dispatch-helper.service";
import { CutDisptachHeaderRepository } from "./repository/cut-dispatch-header.repository";
import { CutDispatchLineRepository } from "./repository/cut-dispatch-line.repository";
import { CutDispatchProgressRepository } from "./repository/cut-dispatch-progress.repository";
import { CutDispatchAttrEnum, CutDispatchCreateRequest, CutDispatchIdStatusRequest, CutDispatchStatusEnum, CutDispatchVendorTransUpdateRequest, CutStatusEnum, GlobalResponseObject, LayIdsRequest } from "@xpparel/shared-models";
import { ErrorResponse } from "@xpparel/backend-utils";
import { CutDispatchLineEntity } from "./entity/cut-dispatch-line.entity";
import { CutDispatchHeaderEntity } from "./entity/cut-dispatch-header.entity";
import { GenericTransactionManager } from "../../database/typeorm-transactions";
import { redlock } from "../../config/redis/redlock.config";
import { CutDispatchProgressEntity } from "./entity/cut-dispatch-progress.entity";
import { CutDispatchVehicleEntity } from "./entity/cut-dispatch-vehicle.entity";
import { CutDispatchAttrEntity } from "./entity/cut-dispatch-attr.entity";
import { CutDispatchSubLineEntity } from "./entity/cut-dispatch-sub-line.entity";
import { PoDocketLayEntity } from "../lay-reporting/entity/po-docket-lay.entity";
import { DocketCutPliesQueryResponse } from "../lay-reporting/repository/query-response/docket-cut-plies.query.reponse";
import { CutDispatchSubLineRepository } from "./repository/cut-dispatch-sub-line.repository";


@Injectable()
export class CutDispatchService {
  constructor(
    private dataSource: DataSource,
    private cutDispatchRepo: CutDisptachHeaderRepository,
    private cutDispatchLineRepo: CutDispatchLineRepository,
    private cutDispatchSubLineRepo: CutDispatchSubLineRepository,
    private cutDispatchProgRepo: CutDispatchProgressRepository,
    private infoService: CutDispatchInfoService,
    private helperService: CutDispatchHelperService,
  ) {

  }

  // UNUSED
  // TO BE REMOVED
  // END POINT
  async createCutDispatchOld(req: LayIdsRequest): Promise<GlobalResponseObject> {
    const transManager = new GenericTransactionManager(this.dataSource);
    let lock;
    try {
      const layIdsSet = new Set<number>();
      req.layIds.forEach(id => layIdsSet.add(id) );
      if(layIdsSet.size == 0) {
        throw new ErrorResponse(0, 'Lay ids must be provided');
      }
      const layIds = Array.from(layIdsSet);
      // check if all the lay ids exist
      const layRecords = await this.helperService.getLayingRecordsForLayIds(layIds, req.unitCode, req.companyCode);
      if(layIdsSet.size != layRecords.length)  {
        throw new ErrorResponse(0, 'Few Laying records does not exist. Refresh the page and try again ');
      }
      const associatedDockets = new Set<string>();
      for(const layRec of layRecords) {
        if (layRec.cutStatus != CutStatusEnum.COMPLETED) {
          // CORRECT
          // throw new ErrorResponse(0, `Cut is not reported for the docket : ${layRec.docketNumber} and lay number : ${layRec.underDocLayNumber} `);
        }
        // check if the lay id already has an dispatch request
        const cutDispacthLine = await this.cutDispatchLineRepo.findOne({ select: ['id'], where: { companyCode: req.companyCode, unitCode: req.unitCode }});
        if (cutDispacthLine) {
          // CORRECT
          // throw new ErrorResponse(0, `Dispatch is already created for docket : ${layRec.docketNumber} and lay number : ${layRec.underDocLayNumber} `);
        }
        // associatedDockets.add(layRec.docketNumber);
      }
      // Now after all the lays as a part of cut dispacth, now we have to go through each cut number assocaited with the incoming lay id -> dockets and check for the cut status for all dockets within the cut
      const allIncomingDockets = Array.from(associatedDockets);
      const cutDispatchValidation = await this.cutDispatchReadinessValidation(allIncomingDockets, req.companyCode, req.unitCode);

      const randomDocket = allIncomingDockets[0];
      const docAttrs = await this.helperService.getDocketAttrByDocNumber(randomDocket, req.companyCode, req.unitCode);
      const moNo = docAttrs.MO;

      const lockKey = `DISPATCH-${moNo}`;
      var ttl = 120000;
      lock = await redlock.lock(lockKey, ttl);

      const totalSoDispacthes = await this.cutDispatchRepo.find({ where: { companyCode: req.companyCode, unitCode: req.unitCode, moNo: moNo }});
      const lastRecord = totalSoDispacthes[totalSoDispacthes.length-1];
      const preReqIndex = lastRecord ? Number(lastRecord.requestNumber.split('-')[1]) : 0;

      await transManager.startTransaction();

      const drEntity = new CutDispatchHeaderEntity();
      drEntity.companyCode = req.companyCode;
      drEntity.unitCode = req.unitCode;
      drEntity.createdUser = req.username;
      drEntity.moNo = moNo;
      drEntity.requestNumber = `CD:${moNo}-${(preReqIndex + 1)}`;
      drEntity.requestStatus = CutDispatchStatusEnum.OPEN;
      drEntity.printStatus = false;
      drEntity.vendorId = 0;
      const savedDr = await transManager.getRepository(CutDispatchHeaderEntity).save(drEntity);
      // now create the dispacth request for the incoming lay ids
      const cutDrLines: CutDispatchLineEntity[] = [];
      layRecords.forEach(l => {
        const cutDrLine = new CutDispatchLineEntity();
        cutDrLine.companyCode = req.companyCode;
        cutDrLine.unitCode = req.unitCode;
        cutDrLine.createdUser = req.username;
        cutDrLine.cutDrId = savedDr.id;
        // cutDrLine.docketNumber = l.docketNumber;
        cutDrLine.poSerial = l.poSerial;
        // cutDrLine.poDocketLayId = l.id;
        cutDrLines.push(cutDrLine);
      });

      const dispatchAttrEnts: CutDispatchAttrEntity[] = [];
      

      await transManager.getRepository(CutDispatchLineEntity).save(cutDrLines, { reload: false });
      await transManager.completeTransaction();
      await lock.unlock();
      return new GlobalResponseObject(true, 0, 'Cut dispatch request created successfully');
    } catch (error) {
      throw error;
    }
  }


  // END POINT
  async createCutDispatch(req: CutDispatchCreateRequest): Promise<GlobalResponseObject> {
    const transManager = new GenericTransactionManager(this.dataSource);
    let lock;
    try {
      const { unitCode, companyCode } = req;
      // check if the dispatch note is already created
      const cutDrLines = await this.cutDispatchLineRepo.findOne({ select: ['id'], where: { companyCode: companyCode, unitCode: unitCode, cutNumber: In(req.cutNos), poSerial: req.poSerial } });
      if (cutDrLines) {
        throw new ErrorResponse(0, 'Dispatch request is already created for some of the provided cut numbers');
      }
      // now get the cut info and the po info
      const poSerialInfo = await this.helperService.getPoSummaryLine(req.poSerial, companyCode, unitCode);

      // NOTE: In cut docket, we maintain only the original docket number but not docket groups
      // get all the dockets for the cut numbers and the PO
      const cutDocketRecordsForPo = await this.helperService.getCutDocketRecordsForPoSerialAndCutNumbers(req.poSerial, req.cutNos, req.companyCode, req.unitCode);
      if(cutDocketRecordsForPo.length == 0) {
        throw new ErrorResponse(0, 'Cuts does not exist');
      }
      const allOriginalDocketsSet = new Set<string>();
      const allDocketGroupsSet = new Set<string>();

      cutDocketRecordsForPo.forEach(r => {
        allOriginalDocketsSet.add(r.docketNumber);
      });
      const allOriginalDockets = Array.from(allOriginalDocketsSet);
      const docRecs = await this.helperService.getDocketRecordByDocNumbers(Array.from(allOriginalDocketsSet), req.companyCode, req.unitCode);
      console.log(allOriginalDocketsSet);
      // get the map of original docket to the docket group
      const docToDcoGroupMap = new Map<string, string>(); // docket group => docket
      docRecs.forEach(r => {
        docToDcoGroupMap.set(r.docketNumber, r.docketGroup);
      });
      console.log(docToDcoGroupMap);
      const docketCutNoMap = new Map<string, number>();
      cutDocketRecordsForPo.forEach(r => {
        // The po cut docket has the original docket number. so we must get the docket group
        const docGroup = docToDcoGroupMap.get(r.docketNumber);
        allDocketGroupsSet.add(docGroup);
        docketCutNoMap.set(docGroup, r.cutNumber);
      });
      console.log(allDocketGroupsSet)
      const allDocketGroups = Array.from(allDocketGroupsSet);
      
      const cutDispatchValidation = await this.cutDispatchReadinessValidation(allOriginalDockets, req.companyCode, req.unitCode);
      // do the cut dispatch validation for all the dockets
      const allLayingRecords = await this.helperService.getLayingRecordsForDocketGroups(allDocketGroups, companyCode, unitCode);
      // set these laying records w.r.t cut number
      // console.log(allLayingRecords);
      console.log('================================================');
      console.log(docketCutNoMap);
      const cutNumberLaysMap = new Map<number, PoDocketLayEntity[]>();
      allLayingRecords.forEach(r => {
        // CORRECT
        const cutNumber = docketCutNoMap.get(r.docketGroup);
        if(!cutNumberLaysMap.has(cutNumber)) {
          cutNumberLaysMap.set(cutNumber, []);
        }
        cutNumberLaysMap.get(cutNumber).push(r);
      });
      console.log(cutNumberLaysMap);
      console.log('----------------------------------------------------');
      const moNo = poSerialInfo.orderRefNo;
      const lockKey = `DISPATCH-${moNo}`;
      var ttl = 120000;
      lock = await redlock.lock(lockKey, ttl);

      const totalSoDispacthes = await this.cutDispatchRepo.find({ where: { companyCode: req.companyCode, unitCode: req.unitCode, moNo: moNo }});
      const lastRecord = totalSoDispacthes[totalSoDispacthes.length-1];
      const preReqIndex = lastRecord ? Number(lastRecord.requestNumber.split('-')[1]) : 0;

      await transManager.startTransaction();

      const drEntity = new CutDispatchHeaderEntity();
      drEntity.companyCode = req.companyCode;
      drEntity.unitCode = req.unitCode;
      drEntity.createdUser = req.username;
      drEntity.moNo = moNo;
      drEntity.requestNumber = `CD:${moNo}-${(preReqIndex + 1)}`;
      drEntity.requestStatus = CutDispatchStatusEnum.OPEN;
      drEntity.printStatus = false;
      drEntity.vendorId = 0;
      const savedDr = await transManager.getRepository(CutDispatchHeaderEntity).save(drEntity);

      // now create the dispacth request for the incoming lay ids
      const cutDrLineEnts: CutDispatchLineEntity[] = [];
      for(const cut of req.cutNos) {
        const cutDrLineEnt = new CutDispatchLineEntity();
        cutDrLineEnt.companyCode = req.companyCode;
        cutDrLineEnt.unitCode = req.unitCode;
        cutDrLineEnt.createdUser = req.username;
        cutDrLineEnt.cutDrId = savedDr.id;
        cutDrLineEnt.poSerial = req.poSerial;
        cutDrLineEnt.cutNumber = cut;
        // get the bag numbers for the cut 
        const bagsForCut = req.bagNumbers.find(r => r.cutNumber == cut);
        cutDrLineEnt.bagNumber = bagsForCut.bagNumbers.toString();
        cutDrLineEnts.push(cutDrLineEnt);

        const savedDlLine = await transManager.getRepository(CutDispatchLineEntity).save(cutDrLineEnt);

        // now construct the dispatch sub lines
        const cutDrSubLines: CutDispatchSubLineEntity[] = [];
        const layings =  cutNumberLaysMap.get(cut);
        for(const lay of layings) {
          const subLineEnt = new CutDispatchSubLineEntity();
          subLineEnt.companyCode = req.companyCode;
          subLineEnt.unitCode = req.unitCode;
          subLineEnt.createdUser = req.username;
          subLineEnt.cutDrId = savedDr.id;
          subLineEnt.poDocketLayId = lay.id;
          subLineEnt.cutDispatchLineId = savedDlLine.id;
          subLineEnt.poSerial = lay.poSerial;
          // CORRECT
          subLineEnt.docketNumber = lay.docketGroup;
          subLineEnt.cutNumber = cut;

          // TODO: Need to be optimized in the future to reduce the query count
          // get the total shade bundles 
          const totalShadeBundlesForLay = await this.helperService.getAdbShadeCountForLayId(lay.id, unitCode, companyCode);
          const layedRolls = await this.helperService.getLayingRollRecordsForLayId(lay.id, unitCode, companyCode);
          // CORRECT
          const docRecord = await this.helperService.getDocketRecordsByDocGroup(lay.docketGroup, companyCode, unitCode);
          let totalLayedQty = 0;
          // CORRECT
          layedRolls.forEach(r => { totalLayedQty = r.layedPlies * docRecord[0]?.plannedBundles } );
          // CORRECT
          // subLineEnt.mainDoc = docRecord.mainDocket;
          subLineEnt.mainDoc = false;
          subLineEnt.totalShadeBundles = totalShadeBundlesForLay;
          subLineEnt.quantity = totalLayedQty;

          cutDrSubLines.push(subLineEnt);
        }

        await transManager.getRepository(CutDispatchSubLineEntity).save(cutDrSubLines, { reload: false });
      }
    
      // construct all the cut DR line entities
      const attr1 = new CutDispatchAttrEntity();
      attr1.cutDrId = savedDr.id; attr1.name = CutDispatchAttrEnum.MO; attr1.value = moNo;
      const attr2 = new CutDispatchAttrEntity();
      attr2.cutDrId = savedDr.id; attr2.name = CutDispatchAttrEnum.MO_LINES; attr2.value = poSerialInfo.moLines.toString();
      const attr3 = new CutDispatchAttrEntity();
      attr3.cutDrId = savedDr.id; attr3.name = CutDispatchAttrEnum.PO_DESCS; attr3.value = poSerialInfo.poDesc;
      const attr4 = new CutDispatchAttrEntity();
      attr4.cutDrId = savedDr.id; attr4.name = CutDispatchAttrEnum.PO_SERIALS; attr4.value = poSerialInfo.poSerial.toString();
      const attr5 = new CutDispatchAttrEntity();
      attr5.cutDrId = savedDr.id; attr5.name = CutDispatchAttrEnum.CUT_NUMBERS; attr5.value = req.cutNos.toString();
      const attr6 = new CutDispatchAttrEntity();
      attr6.cutDrId = savedDr.id; attr6.name = CutDispatchAttrEnum.DOCKETS; attr6.value = allDocketGroups.toString();
      const cutDrAttrs = [attr1, attr2, attr3, attr4, attr5, attr6];
      
      await transManager.getRepository(CutDispatchAttrEntity).save(cutDrAttrs, { reload: false });
      await transManager.completeTransaction();
      await lock.unlock();

      // freeze the emb jobs after the dispatch is created
      await this.helperService.freezeEmbLines(allDocketGroups, req.companyCode, req.unitCode);

      return new GlobalResponseObject(true, 0, 'Cut dispatch request saved successfully');
    } catch (error) {
      console.log(error);
      await transManager.releaseTransaction();
      lock ? await lock.unlock() : null;
      throw error;
    }
  }

  // HELPER
  async cutDispatchReadinessValidation(allDockets: string[], companyCode: string, unitCode: string): Promise<boolean> {

    // we have to check if all the cut is reported for all the dockets
    const docketRecords = await this.helperService.getDocketRecordByDocNumbers(allDockets, companyCode, unitCode);
    const docGroups = docketRecords.map(d => d.docketGroup);
    const cutReportedPliesPerDockets: DocketCutPliesQueryResponse[] = await this.helperService.getCutReportedPliesPerDocketOfGivenDocketGroups(docGroups, companyCode, unitCode);
    const docketCutRepPliesMap = new Map<string, number>();
    cutReportedPliesPerDockets.forEach(r => {
      if(!docketCutRepPliesMap.has(r.docket_group))  {
        docketCutRepPliesMap.set(r.docket_group, 0);
      }
      const prePlies = docketCutRepPliesMap.get(r.docket_group);
      docketCutRepPliesMap.set(r.docket_group, Number(r.reported_plies) + prePlies);
    });
    docketRecords.forEach(r => {
      const cutRepPlies = docketCutRepPliesMap.get(r.docketGroup) ?? 0;
      if(r.plies != cutRepPlies) {
        throw new ErrorResponse(0, `Cut is not reported for the docket : ${r.docketNumber}. Total Plies: ${r.plies} Cut Reported plies: ${cutRepPlies} `)
      }
    });

    // now if the cut is reported now check for the emb completion for all the dockets under the cut DR
    const embJobsWithOpQtysForDockets = await this.helperService.getEmbJobWiseReportedQtysForRefJobNos(allDockets, companyCode, unitCode);
    if(embJobsWithOpQtysForDockets.length > 0) {
      // if there are any emb jobs present then we have to validate the completetion qtys accrodingly      
      embJobsWithOpQtysForDockets.forEach(job => {
        const jobQty = job.jobQty;
        console.log(job);
        job.opQtys.forEach(op => {
          if((op.gQty + op.rQty) != jobQty){
            throw new ErrorResponse(0, `EMB not completed. Docket : ${job.refDocket},  Org Qty: ${jobQty},  Operation: ${op.opCode},  Scan qty: ${op.gQty}`);
          }
        })
      })
    }
    // DONT REMOVE THE BELOW CODE
    // const poSerialCutMap = new Map<number, Set<number>>();
    // const cutNumberRecordsForDockets = await this.helperService.getCutDocketRecordsForDockets(allDockets, companyCode, unitCode);
    // cutNumberRecordsForDockets.forEach(r => {
    //   if (!poSerialCutMap.has(r.poSerial)) {
    //     poSerialCutMap.set(r.poSerial, new Set<number>());
    //   }
    //   poSerialCutMap.get(r.poSerial).add(r.cutNumber);
    // });
    return true;
  }

  // ENDPOINT
  async deleteCutDispatch(req: CutDispatchIdStatusRequest): Promise<GlobalResponseObject> {
    const transManager = new GenericTransactionManager(this.dataSource);
    try {
      const cutDrRec = await this.cutDispatchRepo.findOne({ where: { companyCode: req.companyCode, unitCode: req.unitCode, id: req.cutDispatchId}});
      if(!cutDrRec) {
        throw new ErrorResponse(0, 'Cut dispatch request is not found');
      }
      if (cutDrRec.requestStatus == CutDispatchStatusEnum.SENT) {
        throw new ErrorResponse(0, `The dispatch request ${cutDrRec.requestNumber} is already sent out`);
      }

      const dispacthSubLines = await this.cutDispatchSubLineRepo.find({select: ['docketNumber'], where: { cutDrId: req.cutDispatchId, companyCode: req.companyCode, unitCode: req.unitCode  }});
      const allDockets = dispacthSubLines.map(r => r.docketNumber);
      // delete from the cut dispatch and the cut dispatch lines
      await transManager.startTransaction();
      await transManager.getRepository(CutDispatchHeaderEntity).delete({ id: req.cutDispatchId, companyCode: req.companyCode, unitCode: req.unitCode });
      await transManager.getRepository(CutDispatchLineEntity).delete({ cutDrId: req.cutDispatchId, companyCode: req.companyCode, unitCode: req.unitCode  });
      await transManager.getRepository(CutDispatchSubLineEntity).delete({ cutDrId: req.cutDispatchId, companyCode: req.companyCode, unitCode: req.unitCode  });
      await transManager.getRepository(CutDispatchVehicleEntity).delete({ cutDrId: req.cutDispatchId });
      await transManager.getRepository(CutDispatchProgressEntity).delete({ cutDrId: req.cutDispatchId });
      await transManager.getRepository(CutDispatchAttrEntity).delete({ cutDrId: req.cutDispatchId });
      await transManager.completeTransaction();
      
      // freeze the emb jobs after the dispatch is created
      await this.helperService.freezeEmbLines(allDockets, req.companyCode, req.unitCode);
      return new GlobalResponseObject(true, 0, 'Cut dispatch request deleted successfully');
    } catch (error) {
      await transManager.releaseTransaction();
      throw error;
    }
    
  }

  // ENDPOINT
  async updatePrintStatusForCutDrId(req: CutDispatchIdStatusRequest): Promise<GlobalResponseObject> {
    const cutDrRec = await this.cutDispatchRepo.findOne({ where: { companyCode: req.companyCode, unitCode: req.unitCode, id: req.cutDispatchId}});
    if(!cutDrRec) {
      throw new ErrorResponse(0, 'Cut dispatch request is not found');
    }
    if(cutDrRec.requestStatus == CutDispatchStatusEnum.SENT) {
      throw new ErrorResponse(0, 'Dispatch is already done.');
    }
    // update the print status of the cut dr
    await this.cutDispatchRepo.update({ companyCode: req.companyCode, unitCode: req.unitCode, id: req.cutDispatchId }, { printStatus: true });
    return new GlobalResponseObject(true, 0, 'Print status updated successfully');
  }
 
  // ENDPOINT
  async updateVendorAndTransportInfoForCutDrId(req: CutDispatchVendorTransUpdateRequest): Promise<GlobalResponseObject> {
    const transManager = new GenericTransactionManager(this.dataSource);
    try {
      if(!req.cutDispatchId) {
        throw new ErrorResponse(0, 'Please provide the dispatch id');
      }
      const cutDrRec = await this.cutDispatchRepo.findOne({ where: { companyCode: req.companyCode, unitCode: req.unitCode, id: req.cutDispatchId }});
      if(!cutDrRec) {
        throw new ErrorResponse(0, 'Cut dispatch request is not found');
      }
      if(cutDrRec.requestStatus == CutDispatchStatusEnum.SENT) {
        throw new ErrorResponse(0, 'Dispatch is already done. It cant be changed');
      }
      // get the vendor info by id
      const vendorInfo = await this.helperService.getVendorInfoById(req.vendorId, req.companyCode, req.unitCode);
      if(!vendorInfo) {
        throw new ErrorResponse(0, 'Vendor does not exist');
      }
      const vehicleEnts: CutDispatchVehicleEntity[] = [];
      req?.vehicleInfo?.forEach(r => {
        const vehEnt = new CutDispatchVehicleEntity();
        vehEnt.cutDrId = req.cutDispatchId;
        vehEnt.vehicleNo = r.vehicleNo;
        vehEnt.contact = r.contactNumber;
        vehEnt.remarks = r.vehicleRemarks;
        vehicleEnts.push(vehEnt);
      });
      // update the vendor id for the dispatch. Create the vehicle info into the cut dispatch vehicle table
      await transManager.startTransaction();
      // delete the already created vehicle info
      await transManager.getRepository(CutDispatchVehicleEntity).delete({ cutDrId: req.cutDispatchId });
      await transManager.getRepository(CutDispatchHeaderEntity).update({ companyCode: req.companyCode, unitCode: req.unitCode, id: req.cutDispatchId }, { vendorId: req.vendorId });
      vehicleEnts.length > 0 ? await transManager.getRepository(CutDispatchVehicleEntity).save(vehicleEnts, { reload: false }) : null;
      await transManager.completeTransaction();
      return new GlobalResponseObject(true, 0, 'Transport info updated for the cut dispatch request');
    } catch (error) {
      await transManager.releaseTransaction();
      throw error;
    }
  }

  // ENDPOINT
  async updateCutDispatchRequestStatus(req: CutDispatchIdStatusRequest): Promise<GlobalResponseObject> {
    if(!req.cutDispatchId) {
      throw new ErrorResponse(0, 'Please provide the dispatch id');
    }
    const cutDrRec = await this.cutDispatchRepo.findOne({ where: { companyCode: req.companyCode, unitCode: req.unitCode, id: req.cutDispatchId}});
    if(!cutDrRec) {
      throw new ErrorResponse(0, 'Cut dispatch request is not found');
    }
    if(!cutDrRec.vendorId) {
      throw new ErrorResponse(0, 'Vendor details are not updated for the Cut Dispatch');
    }
    if(cutDrRec.requestStatus == CutDispatchStatusEnum.SENT) {
      throw new ErrorResponse(0, 'Dispatch is already done.');
    }
    if(!cutDrRec.vendorId) {
      throw new ErrorResponse(0, 'Vendor details not updated for the dispatch request');
    }
    // update the print status of the cut dr
    await this.cutDispatchRepo.update({ companyCode: req.companyCode, unitCode: req.unitCode, id: req.cutDispatchId }, { requestStatus: req.dispatchStatus });
    return new GlobalResponseObject(true, 0, 'Cut dispatch status updated successfully');
  }
}