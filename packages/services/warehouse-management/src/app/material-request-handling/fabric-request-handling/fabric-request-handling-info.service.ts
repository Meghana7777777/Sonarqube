import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { WhRequestHeaderRepo } from '../repositories/wh-request-header.repository';
import { WhRequestLineItemRepo } from '../repositories/wh-request-line-item.repository';
import { WhRequestLineRepo } from '../repositories/wh-request-line.repository';
import { CutTableIdRequest, MaterialRequestNoRequest, WhFabMaterialRequestInfoResponse, WhMaterialRequestsResponse } from '@xpparel/shared-models';
import moment from "moment";

const util = require('util');

@Injectable()
export class FabricRequestHandlingInfoService {

  constructor(
    private dataSource: DataSource,
    private whHeaderRepo: WhRequestHeaderRepo,
    private whLineRepo: WhRequestLineRepo,
    private whLineItemRepo: WhRequestLineItemRepo
  ) {
    //
  }

  async getLatestFabricRequestedDateByRollIds(rollId: number[], unitCode: string, companyCode: string) {
    const reqDate = await this.whHeaderRepo.getWarehouseReqDateByRolls(rollId, unitCode, companyCode);
    return moment(reqDate).format('YYYY-MM-DD hh:mm')
  }

  async getNoOfRollsPendingToIssueByGivenDate(date: string, unitCode: string, companyCode: string): Promise<number> {
      return await this.whHeaderRepo.getNoOfRollsPendingToIssueByGivenDate(date, unitCode, companyCode);
  }

  async getPendingQtyToIssueByGivenDate(date: string, unitCode: string, companyCode: string): Promise<number> {
    return await this.whHeaderRepo.getPendingQtyToIssueByGivenDate(date, unitCode, companyCode);
}

  
}

