import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { DataSource, In } from "typeorm";
import { CutGenerationServices, CutReportingService, DocketGenerationServices, LayReportingService, OpVersionService, POService } from '@xpparel/shared-services';
import moment = require("moment");
import { LayIdsRequest, ActualDocketBasicInfoModel, PoSerialRequest, OpVersionModel, PoProdutNameRequest, OperationModel, PoDocketNumberRequest, DocketBasicInfoModel, DocketLayModel, PoSummaryModel, OpGroupModel, DocketCutNumberResponse, PoDocketNumbersRequest, DocketCutNumberModel, PoDocketGroupRequest } from "@xpparel/shared-models";
import { ErrorResponse } from "@xpparel/backend-utils";
import { EmbTrackingService } from "../emb-tracking/emb-tracking.service";
import { GenericTransactionManager } from "../../database/typeorm-transactions";
import { EmbOpLineEntity } from "../emb-tracking/entity/emb-op-line.entity";
import { EmbTrackingInfoService } from "../emb-tracking/emb-tracking-info.service";
import { EmbDispatchInfoService } from "../dispatch/emb-dispatch-info.service";
import { EmbDispatchLineEntity } from "../dispatch/entity/emb-dispatch-line.entity";
import { EmbDispatchHeaderEntity } from "../dispatch/entity/emb-dispatch-header.entity";

@Injectable()
export class EmbRequestHelperService {
  constructor(
    private dataSource: DataSource,
    private layInfoService: LayReportingService,
    private docInfoService: DocketGenerationServices,
    private opVerService: OpVersionService,
    private poInfoService: POService,
    private cutRepInfoService: CutReportingService,
    private cutGenInfoService: CutGenerationServices,
    @Inject(forwardRef(()=>EmbTrackingService)) private embTrackingService: EmbTrackingService,
    @Inject(forwardRef(()=>EmbTrackingInfoService)) private embTrackingInfoService: EmbTrackingInfoService,
    @Inject(forwardRef(()=>EmbDispatchInfoService)) private embDispatchInfo: EmbDispatchInfoService

  ) {

  }
  
  async getActualDocketInfo(layIds: number[], docketNumber: string, companyCode: string, unitCode: string, iNeedAdBundles: boolean): Promise<ActualDocketBasicInfoModel[]> {
    const layIdsReq = new LayIdsRequest(null, unitCode, companyCode, 0, layIds, true, iNeedAdBundles, docketNumber);
    const adRes = await this.layInfoService.getActualDocketInfo(layIdsReq);
    if(!adRes.status) {
      throw new ErrorResponse(adRes.errorCode, adRes.internalMessage);
    }
    return adRes.data;
  }

  async getDocketsBasicInfoForDocketNumber(poSerial: number, docketNumber: string, companyCode: string, unitCode: string): Promise<DocketBasicInfoModel> {
    const docReq = new PoDocketNumberRequest(null, unitCode, companyCode, 0, poSerial, docketNumber, false, false, null);
    const docRes = await this.docInfoService.getDocketsBasicInfoForDocketNumber(docReq);
    if(!docRes.status) {
      throw new ErrorResponse(docRes.errorCode, docRes.internalMessage);
    }
    return docRes.data[0];
  }

  async getLayInfoForDocketGroup(poSerial: number, docketGroup: string, companyCode: string, unitCode: string, dontThrowException?: boolean): Promise<DocketLayModel[]> {
    const docReq = new PoDocketGroupRequest(null, unitCode, companyCode, 0, poSerial, docketGroup, false, false, null);
    const layRes =  await this.layInfoService.getLayInfoForDocketGroup(docReq);
    if(dontThrowException) {
      if(!layRes.status) {
        return [];
      }
      return layRes.data;
    } else {
      if(!layRes.status) {
        throw new ErrorResponse(layRes.errorCode, layRes.internalMessage);
      }
    }
  }

  async getOpVersionsForPo(poSerial: number, prodName: string, companyCode: string, unitCode: string): Promise<OpVersionModel> {
    const poSerialReq = new PoProdutNameRequest(null, unitCode, companyCode, 0, poSerial, prodName);
    const opVerRes = await this.opVerService.getOpVersionForPoProductName(poSerialReq);
    if(!opVerRes.status) {
      throw new ErrorResponse(opVerRes.errorCode, opVerRes.internalMessage);
    }
    return opVerRes.data[0];
  }

  async getPoSummary(poSerial: number, companyCode: string, unitCode: string): Promise<PoSummaryModel> {
    const poReq = new PoSerialRequest(null, unitCode, companyCode, 0, poSerial, 0, false, false);
    const poRes = await this.poInfoService.getPoSummary(poReq);
    if(!poRes.status) {
      throw new ErrorResponse(poRes.errorCode, poRes.internalMessage);
    }
    return poRes.data[0];
  }

  async createEmbTrackingInfoInternally(poSerial: number, docketNumber: string, embJobNumber: string, embHeaderId: number, jobQty: number, operations: string[], opGroups: OpGroupModel[],opInfoMap: OperationModel[], companyCode: string, unitCode: string, username: string, transManager: GenericTransactionManager): Promise<boolean> {
    return await this.embTrackingService.createEmbTrackingInfoInternally(poSerial, docketNumber, embJobNumber, embHeaderId, jobQty, operations, opGroups, opInfoMap, companyCode, unitCode, username, transManager);
  }
      
  async deleteEmbTrackingInfoInternally(poSerial: number, embJobNumber: string, embHeaderId: number, companyCode: string, unitCode: string, transManager: GenericTransactionManager): Promise<boolean> {
    return await this.embTrackingService.deleteEmbTrackingInfoInternally(poSerial, embJobNumber, embHeaderId, companyCode, unitCode, transManager);
  }

  async getEmbOpLinesForEmbJobNumber(poSerial: number, embJobNumber: string, companyCode: string, unitCode: string): Promise<EmbOpLineEntity[]> {
    return await this.embTrackingInfoService.getEmbOpLinesForEmbJobNumber(poSerial, embJobNumber, companyCode, unitCode);
  }


  async getDisptachLineRecordForLineRefId(embLineId: number, companyCode: string, unitCode: string): Promise<EmbDispatchLineEntity> {
    return await this.embDispatchInfo.getDisptachLineRecordForLineRefId(embLineId, companyCode, unitCode);
  }

  async getDisptachRecordForDrId(drId: number, companyCode: string, unitCode: string): Promise<EmbDispatchHeaderEntity> {
    return await this.embDispatchInfo.getDisptachRecordForDrId(drId, companyCode, unitCode);
  }

  async getCutNumberForDockets(docketNumbers: string[], companyCode: string, unitCode: string): Promise<DocketCutNumberModel[]> {
    const req = new PoDocketNumbersRequest(null, unitCode, companyCode, 0, 0, docketNumbers, false, false, null, true);
    const cutNumbersForDoc = await this.cutGenInfoService.getCutNumberForDocket(req);
    console.log(cutNumbersForDoc);
    if(!cutNumbersForDoc.status) {
      throw new ErrorResponse(0, cutNumbersForDoc.internalMessage);
    }
    return cutNumbersForDoc.data;
  }

}