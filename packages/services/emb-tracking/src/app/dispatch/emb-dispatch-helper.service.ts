import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { DataSource, In } from "typeorm";
import moment = require("moment");
import { EmbDisptachHeaderRepository } from "./repository/emb-dispatch-header.repository";
import { EmbDispatchLineRepository } from "./repository/emb-dispatch-line.repository";
import { EmbDispatchProgressRepository } from "./repository/emb-dispatch-progress.repository";
import { EmbRequestInfoService } from "../emb-request/emb-request-info.service";
import { EmbLineEntity } from "../emb-request/entity/emb-line.entity";
import { EmbHeaderEntity } from "../emb-request/entity/emb-header.entity";
import { EmbAttributeEntity } from "../emb-request/entity/emb-attribute.entity";
import { SizeQtyQueryResponse } from "../emb-request/repository/query-response/size-qty.query.response";
import { DocketCutNumberModel, PoDocketNumbersRequest } from "@xpparel/shared-models";
import { ErrorResponse } from "@xpparel/backend-utils";
import { CutGenerationServices } from "@xpparel/shared-services";

@Injectable()
export class EmbDispatchHelperService {
  constructor(
    private dataSource: DataSource,
    private cutGenInfoService: CutGenerationServices,
    @Inject(forwardRef(()=>EmbRequestInfoService)) private embReqInfoService: EmbRequestInfoService
  ) {

  }

  async getEmbLineRecordsForEmbLineIds(embLineIds: number[], companyCode: string, unitCode: string): Promise<EmbLineEntity[]> {
    return await this.embReqInfoService.getEmbLineRecordsForEmbLineIds(embLineIds, companyCode, unitCode);
  }

  async getEmbHeaderRecordsForEmbHeaderIds(embHeaderIds: number[], companyCode: string, unitCode: string): Promise<EmbHeaderEntity[]> {
    return await this.embReqInfoService.getEmbHeaderRecordsForEmbHeaderIds(embHeaderIds, companyCode, unitCode);
  }
      
  // HELPER
  async getEmbHeaderAttrsForEmbHeaderId(embHeaderId: number): Promise<EmbAttributeEntity[]> {
    return await this.embReqInfoService.getEmbHeaderAttrsForEmbHeaderId(embHeaderId);
  }

  // HELPER
  async getEmbLineAttrsForEmbLineId(embLineId: number): Promise<EmbAttributeEntity[]> {
    return await this.embReqInfoService.getEmbLineAttrsForEmbLineId(embLineId);
  }

  async getEmbLineRecordsForEmbLineId(embLineId: number, companyCode: string, unitCode: string): Promise<EmbLineEntity> {
    return await this.embReqInfoService.getEmbLineRecordsForEmbLineId(embLineId, companyCode, unitCode);
  }

  async getEmbLineQtyForEmbLineId(poSerial: number, embLineId: number, companyCode: string, unitCode: string): Promise<SizeQtyQueryResponse[]> {
    return await this.embReqInfoService.getEmbLineQtyForEmbLineId(poSerial, embLineId, companyCode, unitCode);
  }

  async getCutNumberForDockets(docketNumbers: string[], companyCode: string, unitCode: string): Promise<DocketCutNumberModel[]> {
    const req = new PoDocketNumbersRequest(null, unitCode, companyCode, 0, 0, docketNumbers, false, false, null, true);
    const cutNumbersForDoc = await this.cutGenInfoService.getCutNumberForDocket(req);
    if(!cutNumbersForDoc.status) {
      throw new ErrorResponse(16021, cutNumbersForDoc.internalMessage);
    }
    return cutNumbersForDoc.data;
  }

}