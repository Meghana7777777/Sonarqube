import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { DataSource, In } from "typeorm";
import moment = require("moment");
import { EmbRequestInfoService } from "../emb-request/emb-request-info.service";
import { EmbHeaderEntity } from "../emb-request/entity/emb-header.entity";
import { ActualDocketBasicInfoModel, EmbJobNumberOpCodeRequest, GlobalResponseObject, LayIdsRequest, OpVersionModel, PoProdutNameRequest } from "@xpparel/shared-models";
import { LayReportingService, OpVersionService } from "@xpparel/shared-services";
import { ErrorResponse } from "@xpparel/backend-utils";
import { EmbAttributeEntity } from "../emb-request/entity/emb-attribute.entity";
import { EmbLineItemEntity } from "../emb-request/entity/emb-line-item.entity";
import { EmbLineEntity } from "../emb-request/entity/emb-line.entity";
import { GenericTransactionManager } from "../../database/typeorm-transactions";
import { RejectionScanModel } from "packages/libs/shared-models/src/ets/emb-transaction/rejection/rejection-scan.model";
import { EmbRejectionService } from "../emb-rejection/emb-rejection.service";
import { BullQueueService } from "../bull-queue/bull-queue.service";

@Injectable()
export class EmbTrackingHelperService {
  constructor(
    private dataSource: DataSource,
    private opVerService: OpVersionService,
    private layInfoService: LayReportingService,
    private embBullJobService: BullQueueService,
    @Inject(forwardRef(()=>EmbRequestInfoService)) private embReqInfoService: EmbRequestInfoService,
    @Inject(forwardRef(()=>EmbRejectionService)) private embRejService: EmbRejectionService,
  ) {

  }
 
  async getEmbHeaderRecordForEmbJobNumber(embJobNumber: string, companyCode: string, unitCode: string): Promise<EmbHeaderEntity> {
    return await this.embReqInfoService.getEmbHeaderRecordForEmbJobNumber(embJobNumber, companyCode, unitCode);
  }

  async getEmbHeaderRecordForEmbHeaderId(embHeaderId: number, companyCode: string, unitCode: string): Promise<EmbHeaderEntity> {
    return await this.embReqInfoService.getEmbHeaderRecordForEmbHeaderId(embHeaderId, companyCode, unitCode);
  }

  async getEmbLineRecordsForEmbHeaderId(embHeaderId: number, companyCode: string, unitCode: string): Promise<EmbLineEntity[]> {
    return await this.embReqInfoService.getEmbLineRecordsForEmbHeaderId(embHeaderId, companyCode, unitCode);
  }

  async getEmbLineRecordsForEmbHeaderIds(embHeaderIds: number[], companyCode: string, unitCode: string): Promise<EmbLineEntity[]> {
    return await this.embReqInfoService.getEmbLineRecordsForEmbHeaderIds(embHeaderIds, companyCode, unitCode);
  }

  async getEmbLineRecordsForEmbLineId(embLineId: number, companyCode: string, unitCode: string): Promise<EmbLineEntity> {
    return await this.embReqInfoService.getEmbLineRecordsForEmbLineId(embLineId, companyCode, unitCode);
  }
  
  async getEmbHeaderAttrsForEmbHeaderId(embHeaderId: number, companyCode: string, unitCode: string): Promise<EmbAttributeEntity[]> {
    return await this.embReqInfoService.getEmbHeaderAttrsForEmbHeaderId(embHeaderId);
  }

  async getEmbHeaderAttrsForEmbLineId(embHeaderId: number, companyCode: string, unitCode: string): Promise<EmbAttributeEntity[]> {
    return await this.embReqInfoService.getEmbLineAttrsForEmbLineId(embHeaderId);
  }

  async getEmbLineItemByBarcodeNumber(barcode: string, companyCode: string, unitCode: string): Promise<EmbLineItemEntity> {
    return await this.embReqInfoService.getEmbLineItemByBarcodeNumber(barcode, companyCode, unitCode);
  }

  async getEmbLineItemsByEmbLineId(embLineId: number, companyCode: string, unitCode: string): Promise<EmbLineItemEntity[]> {
    return await this.embReqInfoService.getEmbLineItemsByEmbLineId(embLineId, companyCode, unitCode);
  }

  async getOpVersionsForPo(poSerial: number, prodName: string, companyCode: string, unitCode: string): Promise<OpVersionModel> {
    const poSerialReq = new PoProdutNameRequest(null, unitCode, companyCode, 0, poSerial, prodName);
    const opVerRes = await this.opVerService.getOpVersionForPoProductName(poSerialReq);
    if(!opVerRes.status) {
      throw new ErrorResponse(opVerRes.errorCode, opVerRes.internalMessage);;
    }
    return opVerRes.data[0];
  }

  async createEmbRejectionsInternally(poSerial: number, embJobNumber: string, barcode: string, opCode: string, opGroup: string, rejQty: number, reqsonWiseQtys: RejectionScanModel[], companyCode: string, unitCode: string, username: string, transManager: GenericTransactionManager): Promise<boolean> {
    return await this.embRejService.createEmbRejectionsInternally(poSerial, embJobNumber, barcode, opCode, opGroup, rejQty, reqsonWiseQtys, companyCode, unitCode, username, transManager);
  }

  async reverseEmbRejectionsInternally(poSerial: number, embJobNumber: string, barcode: string, opCode: string, companyCode: string, unitCode: string, username: string,transManager: GenericTransactionManager): Promise<boolean> {
    return await this.embRejService.reverseEmbRejectionsInternally(poSerial, embJobNumber, barcode, opCode, companyCode, unitCode, username, transManager);
  }

  async getEmbLineRecordsForDocNumber(refDoc: string, companyCode: string, unitCode: string): Promise<EmbLineEntity[]> {
    return await this.embReqInfoService.getEmbLineRecordsForDocNumber(refDoc, companyCode, unitCode);
  }

  async getEmbHeaderRecordsForDocNumbers(refDocs: string[], companyCode: string, unitCode: string): Promise<EmbHeaderEntity[]> {
    return await this.embReqInfoService.getEmbHeaderRecordsForDocNumbers(refDocs, companyCode, unitCode);
  }

  async getActualDocketInfo(layIds: number[], docketNumber: string, companyCode: string, unitCode: string, iNeedAdBundles: boolean): Promise<ActualDocketBasicInfoModel[]> {
    const layIdsReq = new LayIdsRequest(null, unitCode, companyCode, 0, layIds, true, iNeedAdBundles, docketNumber);
    const adRes = await this.layInfoService.getActualDocketInfo(layIdsReq);
    if(!adRes.status) {
      throw new ErrorResponse(adRes.errorCode, adRes.internalMessage);
    }
    return adRes.data;
  }
  
  // called after bundle scan or reversal operation
  async addEmbOpQtyUpdate(embJob: string, operationCode: string, companyCode: string, unitCode: string, username: string): Promise<boolean> {
    const embJobReq = new EmbJobNumberOpCodeRequest(username, unitCode, companyCode, 0, embJob, operationCode);
    await this.embBullJobService.addEmbOpQtyUpdate(embJobReq);
    return true;
  }

}