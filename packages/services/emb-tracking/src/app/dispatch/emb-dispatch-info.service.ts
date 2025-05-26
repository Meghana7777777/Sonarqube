import { Inject, Injectable, forwardRef } from "@nestjs/common";import { DataSource, In } from "typeorm";
import moment = require("moment");
import { EmbDisptachHeaderRepository } from "./repository/emb-dispatch-header.repository";
import { EmbDispatchProgressRepository } from "./repository/emb-dispatch-progress.repository";
import { EmbDispatchLineRepository } from "./repository/emb-dispatch-line.repository";
import { EmbDispatchHelperService } from "./emb-dispatch-helper.service";
import { EmbDispatchHeaderEntity } from "./entity/emb-dispatch-header.entity";
import { EmbDispatchLineEntity } from "./entity/emb-dispatch-line.entity";
import { EmbDispacthLineModel, EmbDispatchIdStatusRequest, EmbDispatchRequestModel, EmbDispatchRequestResponse, EmbDispatchStatusEnum, EmbDispatchStatusRequest, EmbReqAttibutesEnum } from "@xpparel/shared-models";
import { ErrorResponse } from "@xpparel/backend-utils";
@Injectable()
export class EmbDispatchInfoService {
  constructor(
    private dataSource: DataSource,
    private embDisHeaderRepo: EmbDisptachHeaderRepository,
    private embDisLineRepo: EmbDispatchLineRepository,
    private embDisProgRepo: EmbDispatchProgressRepository,
    @Inject(forwardRef(()=>EmbDispatchHelperService)) private embDisHelper: EmbDispatchHelperService
  ) {

  }

  // END POINT
  async getEmbDispatchRequestsByReqStatus(req: EmbDispatchStatusRequest): Promise<EmbDispatchRequestResponse> {
    const embDispatchRecords = await this.embDisHeaderRepo.find({select: ['id'], where: { companyCode: req.companyCode, unitCode: req.unitCode, requestStatus: req.dispatchStatus}});
    if(embDispatchRecords.length == 0) {
      throw new ErrorResponse( 16214, 'Dispatch requests not found');
    }
    const drIds = embDispatchRecords.map(r => r.id);
    const embDrModel = await this.getEmbDispatchRequestModels(drIds, req.companyCode, req.unitCode, req.iNeedDispatchLines);
    return new EmbDispatchRequestResponse(true,16069, 'Dispatch requests retrieved', embDrModel);
  }

  // END POINT
  async getEmbDispatchRequestForDrId(req: EmbDispatchIdStatusRequest): Promise<EmbDispatchRequestResponse> {
    if(!req.embDispatchId){
      throw new ErrorResponse(16034, 'Dispatch request id is not provided');
    }
    const embDispatchRecords = await this.embDisHeaderRepo.find({select: ['id'], where: { companyCode: req.companyCode, unitCode: req.unitCode, id: req.embDispatchId }});
    if(embDispatchRecords.length == 0) {
      throw new ErrorResponse( 16214, 'Dispatch requests not found');
    }
    const drIds = embDispatchRecords.map(r => r.id);
    const embDrModel = await this.getEmbDispatchRequestModels(drIds, req.companyCode, req.unitCode, true);
    return new EmbDispatchRequestResponse(true,16069, 'Dispatch requests retrieved', embDrModel);
  }

  // HELPER
  async getEmbDispatchRequestModels(emDrIds: number[], companyCode: string, unitCode: string, iNeedDrLines: boolean ): Promise<EmbDispatchRequestModel[]> {
    const embDrRequestModels: EmbDispatchRequestModel[] = [];
    const embDrRecs = await this.getDisptachRecordsForDrIds(emDrIds, companyCode, unitCode);
    for(const rec of embDrRecs) {
      const drLineRecs = await this.embDisLineRepo.find({select: ['id', 'embJobNumber', 'embParentJobRef', 'embLineId'], where: { embDrId: rec.id, companyCode: companyCode, unitCode: unitCode }});
      const docs = new Set<string>();
      const embJobs = new Set<string>();
      const embLineIds: number[]= [];
      const embDrLineIds: number[]= [];
      drLineRecs.forEach(r => {
        docs.add(r.embParentJobRef);
        embJobs.add(r.embJobNumber);
        embLineIds.push(r.embLineId);
        embDrLineIds.push(r.id);
      });
      // get the processor lines and so for any random emb line id. Since the dipatch request will be under a single po, any random emb line should be ok
      const randomEmbLineRec = await this.embDisHelper.getEmbLineRecordsForEmbLineId(drLineRecs[0].embLineId, companyCode, unitCode);
      const embHeaderRec = await this.embDisHelper.getEmbHeaderRecordsForEmbHeaderIds([randomEmbLineRec.embHeaderId], companyCode, unitCode);
      const embHeaderAttrs = await this.embDisHelper.getEmbHeaderAttrsForEmbHeaderId(randomEmbLineRec.embHeaderId);
      const embStatusHistory = await this.embDisProgRepo.find({ where: { embDrId: rec.id } });
      const dispatchProgressTimes = new Map<EmbDispatchStatusEnum, string>();
      embStatusHistory.forEach(r => {
        dispatchProgressTimes.set(r.requestStatus, r.createdAt?.toString());
      });
      const embHeaderAttrsMap = new Map<EmbReqAttibutesEnum, string>();
      embHeaderAttrs.forEach(r => embHeaderAttrsMap.set(r.name, r.value));
      const moNo = embHeaderAttrsMap.get(EmbReqAttibutesEnum.MONO);
      const moLines = embHeaderAttrsMap.get(EmbReqAttibutesEnum.MOLINES)?.split(',');
      let embDrLineModels: EmbDispacthLineModel[] = [];
      if(iNeedDrLines) {
        // construct the detail lines info also for every Dispatch request
        embDrLineModels = await this.getEmbDispatchRequestLineModels(rec.poSerial, embDrLineIds, companyCode, unitCode);
      }
      const createdTime = rec.createdAt.toString();
      const sentOutTime = dispatchProgressTimes.get(EmbDispatchStatusEnum.SENT);
      const checkedInTime = dispatchProgressTimes.get(EmbDispatchStatusEnum.RECEIVED);
      const embDrModel = new EmbDispatchRequestModel(rec.requestNumber, embLineIds, rec.vendorId, moNo, moLines, Array.from(embJobs), Array.from(docs), embHeaderRec[0]?.docketGroup, rec.requestStatus, rec.printStatus, embDrLineModels,rec.id, createdTime, sentOutTime, checkedInTime);
      embDrRequestModels.push(embDrModel);
    }
    return embDrRequestModels;
  }

  // HELPER
  async getEmbDispatchRequestLineModels(poSerial: number, embDrLineIds: number[], companyCode: string, unitCode: string): Promise<EmbDispacthLineModel[]> {
    const embDrLineModels: EmbDispacthLineModel[] = [];
    const drLineRecs = await this.embDisLineRepo.find({select: ['id', 'embJobNumber', 'embParentJobRef', 'embLineId'], where: { id: In(embDrLineIds), companyCode: companyCode, unitCode: unitCode }});
    for(const drLineRec of drLineRecs) {
      const embLineRec = await this.embDisHelper.getEmbLineRecordsForEmbLineId(drLineRec.embLineId, companyCode, unitCode);
      const embHeaderRec = await this.embDisHelper.getEmbHeaderRecordsForEmbHeaderIds([embLineRec.embHeaderId], companyCode, unitCode);
      const embHeaderAttrs = await this.embDisHelper.getEmbHeaderAttrsForEmbHeaderId(embLineRec.embHeaderId);
      const embHeaderAttrsMap = new Map<EmbReqAttibutesEnum, string>();
      embHeaderAttrs.forEach(r => embHeaderAttrsMap.set(r.name, r.value));
      const moNo = embHeaderAttrsMap.get(EmbReqAttibutesEnum.MONO);
      const moLines = embHeaderAttrsMap.get(EmbReqAttibutesEnum.MOLINES)?.split(',');
      const components = embHeaderAttrsMap.get(EmbReqAttibutesEnum.COMPONENTS)?.split(',');

      const embLineAttrs = await this.embDisHelper.getEmbLineAttrsForEmbLineId(drLineRec.embLineId);
      const embLineAttrsMap = new Map<EmbReqAttibutesEnum, string>();
      embLineAttrs.forEach(r => embLineAttrsMap.set(r.name, r.value));
      const itemCode = embLineAttrsMap.get(EmbReqAttibutesEnum.ITEM_CODE);
      const itemDesc = embLineAttrsMap.get(EmbReqAttibutesEnum.ITEM_DESC);
      const pdPlies = Number(embLineAttrsMap.get(EmbReqAttibutesEnum.PD_PLIES));
      const adPlies = Number(embLineAttrsMap.get(EmbReqAttibutesEnum.AD_PLIES));
      const adNumber = Number(embLineAttrsMap.get(EmbReqAttibutesEnum.AD_NUMBER)); // the lay number

      const cutNumberModel = await this.embDisHelper.getCutNumberForDockets([drLineRec.embParentJobRef], companyCode, unitCode);
      // TODO: CUTNUMBER
      // const cutNumber = Number(embLineAttrsMap.get(EmbReqAttibutesEnum.CUT_NUMBER));
      const cutNumber = cutNumberModel[0].mainCutNumber;
      const cutSubNumber = cutNumberModel[0].subCutNumber;
      const lineSizeQtys = await this.embDisHelper.getEmbLineQtyForEmbLineId(poSerial, drLineRec.embLineId, companyCode, unitCode);
      let totalQty = 0;
      let totalBundles = 0;
      lineSizeQtys.forEach(r => { totalQty += r.quantity; totalBundles += r.bundle_count} );
      const embDrLineModel = new EmbDispacthLineModel(drLineRec.embParentJobRef, components, adNumber, cutNumber, drLineRec.embJobNumber, totalBundles, totalQty, embHeaderRec[0]?.docketGroup, cutSubNumber);
      embDrLineModels.push(embDrLineModel);
    }
    return embDrLineModels;
  }


  async getDisptachLineRecordForLineRefId(embLineId: number, companyCode: string, unitCode: string): Promise<EmbDispatchLineEntity> {
    return await this.embDisLineRepo.findOne({ where: { embLineId: embLineId, companyCode: companyCode, unitCode: unitCode} });
  }

  async getDisptachLineRecordsForDrId(embDrId: number, companyCode: string, unitCode: string): Promise<EmbDispatchLineEntity> {
    return await this.embDisLineRepo.findOne({ where: { embDrId: embDrId, companyCode: companyCode, unitCode: unitCode} });
  }

  async getDisptachRecordForDrId(drId: number, companyCode: string, unitCode: string): Promise<EmbDispatchHeaderEntity> {
    return await this.embDisHeaderRepo.findOne({ where: { id: drId, companyCode: companyCode, unitCode: unitCode }});
  }

  async getDisptachRecordsForDrIds(drIds: number[], companyCode: string, unitCode: string): Promise<EmbDispatchHeaderEntity[]> {
    return await this.embDisHeaderRepo.find({ where: { id: In(drIds), companyCode: companyCode, unitCode: unitCode }});
  }

  async getDisptachRecordForPoSerial(poSerial: number, companyCode: string, unitCode: string): Promise<EmbDispatchHeaderEntity[]> {
    return await this.embDisHeaderRepo.find({ where: { poSerial: poSerial, companyCode: companyCode, unitCode: unitCode }, order: { createdAt: 'ASC'} });
  }
}