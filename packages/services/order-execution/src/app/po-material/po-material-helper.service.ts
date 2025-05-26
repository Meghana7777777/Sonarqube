import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { DataSource, In } from "typeorm";
import { dataSource } from "../../database/type-orm-config/typeorm.config-migrations";
import { GenericTransactionManager } from "../../database/typeorm-transactions";
import moment = require("moment");
import { PCutRmSizePropsEntity } from "./entity/p-cut-rm-size-prop.entity";
import { PCutRmRepository } from "./repository/p-cut-rm.repository";
import { PTrimRmRepository } from "./repository/p-trim-rm.respository";
import { PoSummaryModel } from "@xpparel/shared-models";
import { PoRatioService } from "../po-ratio/po-ratio.service";
import { PoRatioEntity } from "../po-ratio/entity/po-ratio.entity";
import { PoRatioInfoService } from "../po-ratio/po-ratio-info.service";
import { PoInfoService } from "../processing-order/po-info.service";

@Injectable()
export class PoMaterialHelperService {
  constructor(
    private dataSource: DataSource,
    private poCutRmRepo: PCutRmRepository,
    private poTrimRmRepo: PTrimRmRepository,
    private poCutRmSizeRepo: PCutRmSizePropsEntity,
    @Inject(forwardRef(() => PoInfoService)) private poInfoService: PoInfoService,
    @Inject(forwardRef(() => PoRatioInfoService)) private poRatioInfoService: PoRatioInfoService,
  ) {

  }

  /**
   * Service to get Only Basic Information regarding a po serial. It does not include child properties. 
   * @param poSerial 
   * @param unitCode 
   * @param companyCode 
   * @returns 
  */
  async getPoBasicInfoByPoSerial(poSerial: number, unitCode: string, companyCode: string): Promise<PoSummaryModel> {
    // Need to validate PO is already processed or not
    return await this.poInfoService.getPoBasicInfoByPoSerial(poSerial, unitCode, companyCode)[0].data;
  }

  async getRatioRecordsForPo(poSerial: number, companyCode: string, unitCode: string): Promise<PoRatioEntity[]> {
    return await this.poRatioInfoService.getRatioRecordsForPo(poSerial, companyCode, unitCode);
  }

}