import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { DataSource, In } from "typeorm";
import { dataSource } from "../../database/type-orm-config/typeorm.config-migrations";
import { GenericTransactionManager } from "../../database/typeorm-transactions";
import moment = require("moment");
import { PoProdNameResponse, SewSerialRequest, PoSummaryModel } from "@xpparel/shared-models";
import { SewSeqRepository } from "./repository/sew-seq.repository";
import { SewVersionRepository } from "./repository/sew-version-repository";

@Injectable()
export class SewVersionHelperService {
  constructor(
    private dataSource: DataSource,
    private opSeqRepo: SewSeqRepository,
    private opVerRepo: SewVersionRepository,
    // @Inject(forwardRef(() => PoInfoService)) private poInfoService: PoInfoService,
    // @Inject(forwardRef(() => PoRatioInfoService)) private poRatioInfoService: PoRatioInfoService,
  ) {

  }

  // async getRatioRecordsForPo(poSerial: number, companyCode: string, unitCode: string): Promise<PoRatioEntity[]> {
  //   return await this.poRatioInfoService.getRatioRecordsForPo(poSerial, companyCode, unitCode);
  // }

  // async getRatioLineRecordsForPoAndProdName(poSerial: number, prodName: string, companyCode: string, unitCode: string): Promise<PoRatioLineEntity[]> {
  //   return await this.poRatioInfoService.getRatioLineRecordsForPoAndProdName(poSerial, prodName, companyCode, unitCode);
  // }

  // async getPoProductNames(req: SewSerialRequest): Promise<PoProdNameResponse> {
  //   return await this.poInfoService.getPoProductNames(req);
  // }

}