import { Inject, Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { PoDocketCutTableRepository } from "./repository/po-docket-cut-table.repository";
import { CutTableDocketsModel, CutTableDocketsResponse, CutTableIdRequest, CutTableOpenCloseDocketsCountModel, CutTableOpenCloseDocketsCountResponse, CutTableOpenDocketsResponse, DateRangeRequestForPlannedDocket, DocketAttrEnum, DocketGroupResponseModel, MaterialAllocatedDocketsResponse, MaterialRequestNoRequest, PlannedCutsModel, PlannedDocketGroupDocketsHelperModel, PlannedDocketGroupModel, PlannedDocketInfoResponse, PlannedDocketReportResponse, PoProdutNameRequest, TaskStatusEnum, ValidatorResponse } from "@xpparel/shared-models";
import { ErrorResponse } from "@xpparel/backend-utils";
import { DocketPlanningHelperService } from "./docket-planning-helper.service";
import { DocketGenerationHelperService } from "../docket-generation/docket-generation-helper.service";
import { DocketGenerationInfoService } from "../docket-generation/docket-generation-info.service";
import { PoDocketCutTableEntity } from "./entity/po-docket-cut-table.entity";
import { PoCutDocketEntity } from "../cut-generation/entity/po-cut-docket.entity";
import { PoDocketMaterialRepository } from "../docket-material/repository/po-docket-material.repository";
@Injectable()
export class DocketPlanningInfoService {
  constructor(
    private dataSource: DataSource,
    @Inject(DocketPlanningHelperService) private docPlanningHelperService: DocketPlanningHelperService,
    private docPlanRepo: PoDocketCutTableRepository,
    private poDocMaterialRepo: PoDocketMaterialRepository
    ) {

  }

  /**
   * READER
   * ENDPOINT
   * @param req 
   * @returns 
   */
  async getPlannedDocketRequestsOfCutTable(req: CutTableIdRequest): Promise<CutTableDocketsResponse> {
    const docketGroupReqs = await this.docPlanRepo.find({ where: { companyCode: req.companyCode, unitCode: req.unitCode, resourceId: req.cutTableId.toString(), taskStatus: TaskStatusEnum.INPROGRESS }, order: { priority: 'ASC' } });
    if (docketGroupReqs.length == 0) {
      throw new ErrorResponse(0, 'No inprogress Docket requests are found');
    }
    // TODO
    const tableInfo = await this.docPlanningHelperService.getWorkstationInfo(Number(req.cutTableId), req.companyCode, req.unitCode);
    const docPlanInfos: PlannedDocketGroupModel[] = [];
    for (const rec of docketGroupReqs) {
      const docInfos = await this.docPlanningHelperService.getDocketRecordsByDocGroup(rec.docketGroup, rec.companyCode, rec.unitCode);
      const randomDoc = docInfos[0];
      const docNumbers = docInfos.map(d => d.docketNumber);
      // cut number
      // get the cut number from po_cut_docket where docket_numbers = 
      const docAttrs = await this.docPlanningHelperService.getDocketAttrByDocNumbers(docNumbers, rec.companyCode, rec.unitCode);
      const docHelperModels: PlannedDocketGroupDocketsHelperModel[] = [];
      let plantStyleRef = '';
      let soNo = '';
      docInfos.forEach(async d => {
        const attrs = docAttrs.get(d.docketNumber);
        const docComps = attrs[DocketAttrEnum.COMPS].split(',');
        const docSoLines = attrs[DocketAttrEnum.MOLINES].split(',');
        const poCutDocket = await this.dataSource.getRepository(PoCutDocketEntity).find({ select: ['cutNumber', 'cutSubNumber'], where: { docketNumber: d.docketNumber } });
        // console.log(poCutDocket,'678898796')
        const cutNumber = poCutDocket.map((rec) => rec.cutNumber).reduce((a, c) => a + (c + ','), '').slice(0, -1)
        const cutSubNumber = poCutDocket.map((rec) => rec.cutSubNumber).reduce((a, c) => a + (c + ','), '').slice(0, -1)
        docHelperModels.push(new PlannedDocketGroupDocketsHelperModel(d.docketNumber, docComps, d.productName, d.color, attrs[DocketAttrEnum.DESTINATION], docSoLines[0], null, cutNumber, cutSubNumber));
        soNo = attrs[DocketAttrEnum.MO];
        plantStyleRef = attrs[DocketAttrEnum.PLANT_STYLE_REF];
      });
      const docMatReqRecord = await this.docPlanningHelperService.getDocketMaterialRequestRecordByReqNumber(rec.requestNumber, rec.companyCode, rec.unitCode);
      // TODO
      const docMaterialInfo = await this.docPlanningHelperService.getPoDocketMaterialRecordsByDocGroup([rec.docketGroup], rec.requestNumber, rec.companyCode, rec.unitCode);
      let totalReqQty = 0;
      docMaterialInfo.forEach(r => {
        totalReqQty += r.mrnId ? 0 : Number(r.requestedQuantity);
      });
      // TODO 
      const docPlanInfo = new PlannedDocketGroupModel(null, rec.docketGroup, rec.requestNumber, rec.plannedDateTime, randomDoc.plies, 0, 0,
        Number(totalReqQty), docMatReqRecord.requestStatus, soNo,
        rec.priority, rec.resourceId, randomDoc.createdAt.toString(), rec.matReqOn, randomDoc.poSerial, rec.id, rec.matFulfillmentDateTime?.toString(),
        plantStyleRef, docHelperModels);
      docPlanInfos.push(docPlanInfo);
    }
    const cutTableDocModel = new CutTableDocketsModel(req.cutTableId.toString(), '', '', docPlanInfos);
    return new CutTableDocketsResponse(true, 0, 'Dockets retrieved for the cut table', [cutTableDocModel]);
  }

  /**
   * READER
   * ENDPOINT
   * @param req 
   * @returns 
   */
  async getYetToPlanDocketRequests(req: PoProdutNameRequest): Promise<CutTableOpenDocketsResponse> {
    const unplannedDocketReqs = await this.docPlanRepo.find({ where: { companyCode: req.companyCode, unitCode: req.unitCode, resourceId: null, taskStatus: TaskStatusEnum.OPEN, poSerial: req.poSerial }, order: { priority: 'ASC' } });
    const docPlanInfos: PlannedDocketGroupModel[] = [];
    for (const rec of unplannedDocketReqs) {
      const docInfos = await this.docPlanningHelperService.getDocketRecordsByDocGroup(rec.docketGroup, rec.companyCode, rec.unitCode);
      const randomDoc = docInfos[0];
      const prodNames = docInfos.map(r => r.productName);
      if (req?.productName != "all") {
        if (!prodNames.includes(req?.productName?.trim())) {
          continue;
        }
      }
      const docHelperModels: PlannedDocketGroupDocketsHelperModel[] = [];
      let plantStyleRef = '';
      let soNo = '';
      const docNumbers = docInfos.map(d => d.docketNumber);
      const docAttrs = await this.docPlanningHelperService.getDocketAttrByDocNumbers(docNumbers, rec.companyCode, rec.unitCode);
      await docInfos.forEach(async d => {
        const attrs = docAttrs.get(d.docketNumber);
        const docComps = attrs[DocketAttrEnum.COMPS].split(',');
        const docSoLines = attrs[DocketAttrEnum.MOLINES].split(',');
        const poCutDocket = await this.dataSource.getRepository(PoCutDocketEntity).find({ select: ['cutNumber', 'cutSubNumber'], where: { docketNumber: d.docketNumber } });
        console.log(poCutDocket,'678898796')
        const cutNumber = poCutDocket.map((rec) => rec.cutNumber).reduce((a, c) => a + (c + ','), '').slice(0, -1)
        const cutSubNumber = poCutDocket.map((rec) => rec.cutSubNumber).reduce((a, c) => a + (c + ','), '').slice(0, -1)
        docHelperModels.push(new PlannedDocketGroupDocketsHelperModel(d.docketNumber, docComps, d.productName, d.color, attrs[DocketAttrEnum.DESTINATION], docSoLines[0], null, cutNumber, cutSubNumber));
        soNo = attrs[DocketAttrEnum.MO];
        plantStyleRef = attrs[DocketAttrEnum.PLANT_STYLE_REF];
      });

      // TODO Add the necessary attributes for the dockets
      const docMaterialInfo = await this.docPlanningHelperService.getPoDocketMaterialRecordsByDocGroup([rec.docketGroup], rec.requestNumber, rec.companyCode, rec.unitCode);
      let totalReqQty = 0;
      docMaterialInfo.forEach(r => {
        totalReqQty += r.mrnId ? 0 : Number(r.requestedQuantity);
      });
      // TODO 
      const docPlanInfo = new PlannedDocketGroupModel(null, rec.docketGroup, rec.requestNumber, rec.plannedDateTime, randomDoc.plies, 0, 0,
        Number(totalReqQty), null, soNo,
        rec.priority, rec.resourceId, randomDoc.createdAt.toString(), rec.matReqOn, randomDoc.poSerial, rec.id, rec.matFulfillmentDateTime?.toString(),
        plantStyleRef, docHelperModels);
      docPlanInfos.push(docPlanInfo);
      // const docPlanInfo = new PlannedDocketGroupModel(null, rec.docketGroup, docInfo.docketGroup, rec.requestNumber, rec.plannedDateTime, docInfo.plies, 0, 0, totalReqQty, 
      //   null,
      //   docAttrs[DocketAttrEnum.MO], docSoLines, null,  docAttrs[DocketAttrEnum.DESTINATION], 
      //   rec.priority, rec.resourceId, docComps, docInfo.createdAt.toString(), null, docInfo.poSerial, rec.id, rec.matFulfillmentDateTime?.toString(), docInfo.color, docInfo.productName, docAttrs[DocketAttrEnum.PLANT_STYLE_REF]);
      // docPlanInfos.push(docPlanInfo);
    }
    const cutTableDocModel = new CutTableDocketsModel('', '', '', docPlanInfos);
    return new CutTableOpenDocketsResponse(true, 0, 'Dockets retrieved for the cut table', [cutTableDocModel]);
  }

  /**
   * HELPER
   * @param reqNo 
   * @param docketNumber 
   * @param companyCode 
   * @param unitCode 
   * @returns 
   */
  async getDocketRequestPlanRecord(reqNo: string, docketGroup: string, companyCode: string, unitCode: string): Promise<PoDocketCutTableEntity> {
    return await this.docPlanRepo.findOne({ where: { companyCode: companyCode, unitCode: unitCode, docketGroup: docketGroup, requestNumber: reqNo, isActive: true } });
  }


  // 
  async getActiveInactiveDocketsForCutTable(req: CutTableIdRequest): Promise<CutTableOpenCloseDocketsCountResponse> {

    const getInprogressDocketsCount = await this.docPlanRepo.count({ where: { companyCode: req.companyCode, unitCode: req.unitCode, resourceId: req.cutTableId.toString(), taskStatus: TaskStatusEnum.INPROGRESS } });

    const getCompletedDocketsCount = await this.docPlanRepo.count({ where: { companyCode: req.companyCode, unitCode: req.unitCode, resourceId: req.cutTableId.toString(), taskStatus: TaskStatusEnum.COMPLETED } });

    const getInActiveDocketsCount = await this.docPlanRepo.count({ where: { companyCode: req.companyCode, unitCode: req.unitCode, resourceId: req.cutTableId.toString(), isActive: false } });

    const docketsCount = new CutTableOpenCloseDocketsCountModel(getInActiveDocketsCount, getInprogressDocketsCount, getCompletedDocketsCount);
    return new CutTableOpenCloseDocketsCountResponse(true, 0, 'Dockets Data Retrieved', docketsCount);
  }


  async getTotalDocketsPlannedToday( req:DocketGroupResponseModel): Promise<PlannedDocketInfoResponse> {
    const plannedDataInfo =  await this.docPlanRepo.getTotalDocketsPlannedToday(req.unitCode,req.companyCode,req.date);
    console.log(plannedDataInfo)
    if(plannedDataInfo.length === 0) {
      const planInfo = new PlannedCutsModel(0, 0);
      return new PlannedDocketInfoResponse(true, 1234, "Total layed meterage data successfully", planInfo);
    }
    const requestNumbers: string[] = plannedDataInfo.map(eachRequest => eachRequest.reqNumber);
    const docketGroup: string[] = plannedDataInfo.map(eachRequest => eachRequest.docGroup);
    let cutNumbers = [];
    let totCuts=0;
    for (const docket of docketGroup) {
      console.log(docket);
      const poCutDockets = await this.dataSource.getRepository(PoCutDocketEntity).find({ 
          select: ['poSerial','cutSubNumber'], 
          where: { docketNumber: docket } 
      });
  
      for (const poCutDocket of poCutDockets) {
        let code = `${poCutDocket.poSerial}-${poCutDocket.cutSubNumber}`;        
        if (!cutNumbers.includes(code)) { // Check if the code exists in the array
            cutNumbers.push(code); // Add the unique code to the array
            totCuts++; // Increment the total cuts
            // console.log(totCuts);
        }
      }
    } 
    const quanityInfo = await this.poDocMaterialRepo.getTotalMeterageofRequestsRepo(req.unitCode, req.companyCode, requestNumbers);
    const planInfo = new PlannedCutsModel(docketGroup.length, quanityInfo);
    return new PlannedDocketInfoResponse(true, 1234, "Total layed meterage data successfully", planInfo);
  }
 


  async getTotalDocketsToday( req:DocketGroupResponseModel): Promise<string[]> {
    const data =  await this.docPlanRepo.getTotalDocketsToday(req.unitCode,req.companyCode, req.date);
    const requestNumbers: string[] = data.map(eachRequest => eachRequest.requestNumber);
    return requestNumbers;
    // const quanityInfo = await this.poDocMaterialRepo.getTotalMeterageofRequestsRepo(req.unitCode, req.companyCode, requestNumbers);
    // const planInfo = new PlannedCutsModel(requestNumbers.length, quanityInfo);
    // return new PlannedDocketInfoResponse(true,1233,"Planned dockets Retrieved successfully",planInfo)
  }

    // get docket planned report based on dates
    async getPlannedDocketReport(req: DateRangeRequestForPlannedDocket): Promise<PlannedDocketReportResponse> {
      const plannedDocketResult = await this.docPlanRepo.getPlannedDocketRepo( req.startDate, req.endDate, req.companyCode, req.unitCode);
      if (!plannedDocketResult || plannedDocketResult.length === 0) {
        throw new ErrorResponse(9776, "No data found for the provided date range");
      }
      return new PlannedDocketReportResponse(true,22,'Data retrieved successfully',plannedDocketResult);

  }

}