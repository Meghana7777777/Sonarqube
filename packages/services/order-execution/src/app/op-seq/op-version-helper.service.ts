import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { DataSource, In } from "typeorm";
import { dataSource } from "../../database/type-orm-config/typeorm.config-migrations";
import { GenericTransactionManager } from "../../database/typeorm-transactions";
import moment = require("moment");
import { PoProdNameResponse, PoSerialRequest, PoSummaryModel } from "@xpparel/shared-models";
import { OpSeqRepository } from "./repository/op-seq.repository";
import { OpVersionRepository } from "./repository/op-version.repository";
import { PoRatioInfoService } from "../po-ratio/po-ratio-info.service";
import { PoRatioEntity } from "../po-ratio/entity/po-ratio.entity";
import { PoRatioLineEntity } from "../po-ratio/entity/po-ratio-line.entity";
import { PoInfoService } from "../processing-order/po-info.service";

@Injectable()
export class OpVersionHelperService {
  constructor(
    private dataSource: DataSource,
    private opSeqRepo: OpSeqRepository,
    private opVerRepo: OpVersionRepository,
    @Inject(forwardRef(() => PoInfoService)) private poInfoService: PoInfoService,
    @Inject(forwardRef(() => PoRatioInfoService)) private poRatioInfoService: PoRatioInfoService,
  ) {

  }

  async getRatioRecordsForPo(poSerial: number, companyCode: string, unitCode: string): Promise<PoRatioEntity[]> {
    return await this.poRatioInfoService.getRatioRecordsForPo(poSerial, companyCode, unitCode);
  }

  async getRatioLineRecordsForPoAndProdName(poSerial: number, prodName: string, companyCode: string, unitCode: string): Promise<PoRatioLineEntity[]> {
    return await this.poRatioInfoService.getRatioLineRecordsForPoAndProdName(poSerial, prodName, companyCode, unitCode);
  }

  async getPoProductNames(req: PoSerialRequest): Promise<PoProdNameResponse> {
    return await this.poInfoService.getPoProductNames(req);
  }

}