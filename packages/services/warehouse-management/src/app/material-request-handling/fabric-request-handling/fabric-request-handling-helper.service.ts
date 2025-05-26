import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { WhRequestHeaderRepo } from '../repositories/wh-request-header.repository';
import { WhRequestLineItemRepo } from '../repositories/wh-request-line-item.repository';
import { WhRequestLineRepo } from '../repositories/wh-request-line.repository';
import { PackingListInfoService } from '../../packing-list/packing-list-info.service';
import { DocketLayModel, PoDocketGroupRequest, PoDocketNumberRequest, RollBasicInfoModel, WhFabReqItemStatusRequest, WhFabReqStatusRequest } from '@xpparel/shared-models';
import { DocketMaterialServices, LayReportingService } from '@xpparel/shared-services';
import { ErrorResponse } from '@xpparel/backend-utils';
const util = require('util');

@Injectable()
export class FabricRequestHandlingHelperService {

  constructor(
    private dataSource: DataSource,
    private whHeaderRepo: WhRequestHeaderRepo,
    private whLineRepo: WhRequestLineRepo,
    private whLineItemRepo: WhRequestLineItemRepo, 
    @Inject(forwardRef(() => PackingListInfoService)) private plInfoService: PackingListInfoService,
    private docMaterialService: DocketMaterialServices,
    private layInfoService: LayReportingService
  ) {
    //
  }

  
  async getRollDetailsForRollIds(rollIds: number[], companyCode: string, unitCode: string): Promise<RollBasicInfoModel[]> {
    return await this.plInfoService.getRollsBasicInfoForRollIds(companyCode, unitCode, rollIds);
  }

  async updateMaterialReqStausToDocketgroup(req: WhFabReqStatusRequest): Promise<boolean> {
    const res = await this.docMaterialService.changeDocketMaterialReqStatus(req);
    if(!res.status) {
      throw new ErrorResponse(res.errorCode, res.internalMessage);
    }
    return res.status;
  }

  // UNUSED
  async updateMaterialReqStausToDocketRoll(req: WhFabReqItemStatusRequest): Promise<boolean> {
    const res = await this.docMaterialService.changeDocketMaterialStatus(req);
    if(!res.status) {
      throw new ErrorResponse(res.errorCode, res.internalMessage);
    }
    return res.status;
  }
  

  async getLayingInfoForDocket(docketGroup: string, companyCode: string, unitCode: string): Promise<DocketLayModel[]> {
    const req = new PoDocketGroupRequest(null, unitCode, companyCode, 0, 0, docketGroup, false, false, null, true);
    const layInfoRes = await this.layInfoService.getLayInfoForDocketGroup(req);
    if (!layInfoRes.status) {
      throw new ErrorResponse(6326, 'Unable to check for docket status from cutting team');
    }
    return layInfoRes.data;
  }
}
