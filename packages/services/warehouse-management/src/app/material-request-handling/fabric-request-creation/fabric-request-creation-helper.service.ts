import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { WhRequestHeaderRepo } from '../repositories/wh-request-header.repository';
import { WhRequestLineItemRepo } from '../repositories/wh-request-line-item.repository';
import { WhRequestLineRepo } from '../repositories/wh-request-line.repository';
import { PackingListInfoService } from '../../packing-list/packing-list-info.service';
import { RollBasicInfoModel } from '@xpparel/shared-models';
const util = require('util');

@Injectable()
export class FabricRequestCreationHelperService {

  constructor(
    private dataSource: DataSource,
    private whHeaderRepo: WhRequestHeaderRepo,
    private whLineRepo: WhRequestLineRepo,
    private whLineItemRepo: WhRequestLineItemRepo,
    @Inject(forwardRef(() => PackingListInfoService)) private plInfoService: PackingListInfoService
  ) {
    //
  }


  async getRollDetailsForRollIds(rollIds: number[], companyCode: string, unitCode: string): Promise<RollBasicInfoModel[]> {
    return await this.plInfoService.getRollsBasicInfoForRollIds(companyCode, unitCode, rollIds);
  }

  async getRollDetailsForRollBarcodes(barcodes: string[], companyCode: string, unitCode: string): Promise<RollBasicInfoModel[]> {
    const rollIds = await this.plInfoService.getRollIdsByBarcodes(barcodes, unitCode, companyCode);
    return await this.plInfoService.getRollsBasicInfoForRollIds(companyCode, unitCode, rollIds);
  }

}
