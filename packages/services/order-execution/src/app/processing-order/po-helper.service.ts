import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { CutRmModel, GlobalResponseObject, OpVersionRequest, OpVersionResponse, OqPercentageModel, PoProdutNameRequest, PoRmItemsModel, PoSerialRequest, ProductIdRequest, ProductItemResponse, RawOrderHeaderInfoResponse, RawOrderInfoResponse, RawOrderLinePoSerialRequest, RawOrderNoRequest, SequenceRefEnums } from "@xpparel/shared-models";
import { CpsPslService, CutBundlingService, MOConfigService, MOInfoService, OrderManipulationServices, ProductPrototypeServices } from "@xpparel/shared-services";
import { DataSource } from "typeorm";
import { GenericTransactionManager } from "../../database/typeorm-transactions";
import { SequenceHandlingService } from "../master/sequence-handling/sequence-handling.service";
import { PoMaterialService } from "../po-material/po-material.service";
import moment = require("moment");
import { PoMaterialInfoService } from "../po-material/po-material-info.service";
import { PoRatioInfoService } from "../po-ratio/po-ratio-info.service";
import { PoRatioEntity } from "../po-ratio/entity/po-ratio.entity";
import { OpVersionInfoService } from "../op-seq/op-version-info.service";
import { OpVersion } from "../op-seq/entity/op-version.entity";
import { OpVersionService } from "../op-seq/op-version.service";

@Injectable()
export class PoHelperService {
  constructor(
    private dataSource: DataSource,
    @Inject(forwardRef(() => PoMaterialService)) private poMaterialService: PoMaterialService,
    @Inject(forwardRef(() => PoMaterialInfoService)) private poMaterialInfoService: PoMaterialInfoService,
    @Inject(forwardRef(() => PoRatioInfoService)) private poRatioInfoService: PoRatioInfoService,
    @Inject(forwardRef(() => OpVersionInfoService)) private opVerInfoService: OpVersionInfoService,
    private omsService: MOInfoService,
    private sequenceHandlingService: SequenceHandlingService,
    @Inject(forwardRef(() => OpVersionService)) private opVersionService: OpVersionService,
    private cpsPslService: CpsPslService
  ) {

  }

  async getRawOrderInfo(req: RawOrderNoRequest): Promise<RawOrderInfoResponse> {
    try {
      return await this.omsService.getRawOrderInfo(req);
    } catch (err) {
      throw err;
    }
  }

  async getRawOrderHeaderInfo(req: RawOrderNoRequest): Promise<RawOrderHeaderInfoResponse> {
    try {
      return await this.omsService.getRawOrderHeaderInfo(req);
    } catch (err) {
      throw err;
    }
  }

  // saves the default RM for the PO when the PO is created
  async createPoRm(poSerial: number, poRms: PoRmItemsModel[], username: string, companyCode: string, unitCode: string, manager: GenericTransactionManager): Promise<boolean> {
    try {
      return await this.poMaterialService.createPoRm(poSerial, poRms, username, companyCode, unitCode, manager);
    } catch (err) {
      throw err;
    }
  }

    // saves the default RM for the PO when the PO is created
    async createPoRmProps(poSerial: number, username: string, companyCode: string, unitCode: string, sizes: string[]): Promise<boolean> {
      try {
        return await this.poMaterialService.createPoRmProps(poSerial, companyCode, unitCode, sizes, username);
      } catch (err) {
        throw err;
      }
    }

  // delete the default RM for the PO when the PO is deleted
  async deletePoRm(poSerial: number, manager: GenericTransactionManager, companyCode: string, unitCode: string): Promise<boolean> {
    try {
      return await this.poMaterialService.deletePoRm(poSerial, manager, companyCode, unitCode)
    } catch (err) {
      throw err;
    }
  }

  // function returns a Promise that resolves to the PO Serial sequence number based on the provided company code and unit code
  async getPOSerialNumber(manager: GenericTransactionManager, companyCode: string, unitCode: string): Promise<number> {
    try {
      const seq1 = `${SequenceRefEnums.PO_SERIAL}-${companyCode}-${unitCode}`;
      return await this.sequenceHandlingService.getSequenceNumber(seq1, manager);
    } catch (err) {
      throw err;
    }
  }

  /**
   * HELPER
   * @param poSerial 
   * @param companyCode 
   * @param unitCode 
   * @returns 
   */
  async getPoCutFabInfoForPo(poSerial: number, companyCode: string, unitCode: string, productName?: string): Promise<CutRmModel[]> {
    return await this.poMaterialInfoService.getPoCutFabInfoForPo(poSerial, companyCode, unitCode, productName);
  }

  async getRatioRecordsForPo(poSerial: number, companyCode: string, unitCode: string): Promise<PoRatioEntity[]> {
    return await this.poRatioInfoService.getRatioRecordsForPo(poSerial, companyCode, unitCode);
  }

  async getPoOpVersionRecordsForPoSerial(poSerial: number, companyCode: string, unitCode: string): Promise<OpVersion[]> {
    return await this.opVerInfoService.getPoOpVersionRecordsForPoSerial(poSerial, companyCode, unitCode);
  }

  /**
   * Service to get the operation version and operation sequence details for the product
   * @param req 
   * @returns 
  */
  async getOpVersionIdForPoProductName(req: PoProdutNameRequest): Promise<number> {
    return await this.opVerInfoService.getOpVersionIdForPoProductName(req);
  }

  async createOpVersionForProduct(reqModel: OpVersionRequest, transManager: GenericTransactionManager): Promise<boolean> {
    return await this.opVersionService.createOpVersionForProductWithManager(reqModel, transManager);
  }

  async createPslBundlesInCPS(poSerial: number, companyCode: string, unitCode: string, username: string): Promise<boolean> {
    try {
      const m1 = new PoSerialRequest(username, unitCode, companyCode, 0, poSerial, 0, false, false);
      await this.cpsPslService.createPslBundlesInCPS(m1);
      return true;
    } catch (error) {
      throw error;
    }
  }

  async deletePslBundlesInCPS(poSerial: number, companyCode: string, unitCode: string, username: string): Promise<boolean> {
    try {
      const m1 = new PoSerialRequest(username, unitCode, companyCode, 0, poSerial, 0, false, false);
      await this.cpsPslService.deletePslBundlesInCPS(m1);
      return true;
    } catch (error) {
      throw error;
    }
  }
}