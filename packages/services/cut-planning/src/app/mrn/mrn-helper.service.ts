import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { DataSource } from "typeorm";
import { DocketGenerationInfoService } from "../docket-generation/docket-generation-info.service";
import { DocMaterialAllocationRequest, DocRollsModel, DocketAttrEnum, GlobalResponseObject, ItemCodeCronPatternRequest, MaterialRequestNoRequest, MrnStatusEnum, PoDocketGroupRequest, PoDocketNumberRequest, RollBasicInfoModel, RollIdsConsumptionRequest, WhExtReqNoRequest, WhFabReqStatusRequest, WhMatReqLineStatusEnum } from "@xpparel/shared-models";
import { PoDocketEntity } from "../docket-generation/entity/po-docket.entity";
import { DocketMaterialInfoService } from "../docket-material/docket-material-info.service";
import { PoDocketMaterialRequestEntity } from "../docket-material/entity/po-docket-material-request.entity";
import { CutTableService } from "../master/cut-table/cut-table.service";
import { CutTableEntity } from "../master/cut-table/entity/cut-table.entity";
import { FabricRequestCreationService } from "@xpparel/shared-services";
import { PoDocketMaterialEntity } from "../docket-material/entity/po-docket-material.entity";
import { CutGenerationInfoService } from "../cut-generation/cut-generation-info.service";
import { PoCutDocketEntity } from "../cut-generation/entity/po-cut-docket.entity";
import { LayReportingInfoService } from "../lay-reporting/lay-reporting-info.service";
import { PoDocketLayEntity } from "../lay-reporting/entity/po-docket-lay.entity";
import { DocketMaterialService } from "../docket-material/docket-material.service";
import { GenericTransactionManager } from "../../database/typeorm-transactions";
import { PoMaterialRequestEntity } from "../docket-material/entity/po-material-request.entity";
import { PoDocketGroupRepository } from "../docket-generation/repository/po-docket-group.repository";

@Injectable()
export class MrnHelperService {
  constructor(
    private dataSource: DataSource,
    @Inject(forwardRef(() => DocketGenerationInfoService)) private docGenInfoService: DocketGenerationInfoService,
    @Inject(forwardRef(() => DocketMaterialInfoService)) private docMatInfoService: DocketMaterialInfoService,
    @Inject(forwardRef(() => LayReportingInfoService)) private layInfoService: LayReportingInfoService,
    @Inject(forwardRef(() => CutGenerationInfoService)) private cutGenInfoService: CutGenerationInfoService,
    private fabReqCreationService: FabricRequestCreationService,
    @Inject(forwardRef(() => DocketMaterialService)) private docMatService: DocketMaterialService,
  ) {

  }

  // HELPER
  async getDocketRollsModel(docketNumber: string, companyCode: string, unitCode: string, requestNumber: string, mrnId?: number): Promise<DocRollsModel[]> {
    return await this.docMatInfoService.getDocketRollModelsForMaterialRequest(docketNumber, companyCode, unitCode, null, mrnId);
  }

  // HELPER
  async getCutDocketRecordsForDockets(docketNumbers: string[], companyCode: string, unitCode: string): Promise<PoCutDocketEntity[]> {
    return await this.cutGenInfoService.getCutDocketRecordsForDockets(docketNumbers, companyCode, unitCode);
  }

  // HELPER
  async getLayingRecordForLayId(layId: number, unitCode: string, companyCode: string): Promise<PoDocketLayEntity> {
    return await this.layInfoService.getLayingRecordForLayId(layId, unitCode, companyCode);
  }




  async getDocketRecordByDocNumber(docketNumber: string, companyCode: string, unitCode: string): Promise<PoDocketEntity> {
    return await this.docGenInfoService.getDocketRecordByDocNumber(docketNumber, companyCode, unitCode);
  }

  async getDocketAttrByDocNumber(docketNumber: string, companyCode: string, unitCode: string): Promise<{ [k in DocketAttrEnum]: string }> {
    return await this.docGenInfoService.getDocketAttrByDocNumber(docketNumber, companyCode, unitCode);
  }

  // TODO
  async getPoDocketMaterialRecordsByDocNumber(docketNumbers: string[], requestNumber: string, companyCode: string, unitCode: string): Promise<PoDocketMaterialEntity[]> {
    return await this.docMatInfoService.getPoDocketMaterialRecordsByDocGroup(docketNumbers, companyCode, unitCode)
  }

  // TODO
  async getDocketMaterialRequestRecordByReqNumber(requestNumber: string, companyCode: string, unitCode: string): Promise<PoDocketMaterialRequestEntity> {
    return await this.docMatInfoService.getDocketMaterialRequestRecordByReqNumber(requestNumber, companyCode, unitCode);
  }

  // TODO
  async deleteFabricRequestInWh(req: WhExtReqNoRequest): Promise<boolean> {
    // TODO modify to a bull job instead of an API call
    const whReqStatus = await this.fabReqCreationService.deleteFabricWhRequest(req);
    return whReqStatus.status;
  }

  async getInprogressLaysForDocketGroup(req: PoDocketGroupRequest): Promise<PoDocketLayEntity> {
    return await this.layInfoService.getInprogressLaysForDocketGroup(req);
  }

  async createDocketMaterialRequest(req: DocMaterialAllocationRequest): Promise<GlobalResponseObject> {
    return await this.docMatService.createDocketMaterialRequest(req);
  }

  async validatePreRequirementOfMaterialRequest(req: DocMaterialAllocationRequest, lock: any): Promise<{docketInfo: PoDocketEntity, rollInfo: RollBasicInfoModel[]}> {
    return await this.docMatService.validatePreRequirementOfMaterialRequest(req, lock);
  }

  async createDocketMaterialRequestWithManager(req: DocMaterialAllocationRequest, rollInfo: RollBasicInfoModel[], poReqSerialLock: any, docketInfo: PoDocketEntity, manager: GenericTransactionManager): Promise<PoMaterialRequestEntity> {
    return await this.docMatService.createDocketMaterialRequestWithManager(req, rollInfo, poReqSerialLock, docketInfo, manager)
  }

  async unlockMaterial(itemCode: string, unitCode: string, companyCode: string, userName: string): Promise<GlobalResponseObject> {
    return await this.docMatService.unlockMaterial(itemCode, unitCode, companyCode, userName)
  }

  async removeMRNRollsFromTheMaterialRequest(mrnId: number, unitCode: string, companyCode: string, manager: GenericTransactionManager): Promise<boolean> {
    return await this.docMatService.removeMRNRollsFromTheMaterialRequest(mrnId, unitCode, companyCode, manager);
  }

  async changeDocketMaterialReqStatusOfMRN(userName: string, userId: number, companyCode: string, unitCode:string, mrnId: number, status : WhMatReqLineStatusEnum, mrnStatus: MrnStatusEnum, manager: GenericTransactionManager): Promise<RollIdsConsumptionRequest[]> {
    return await this.docMatService.changeDocketMaterialReqStatusOfMRN(userName, userId, companyCode, unitCode, mrnId, status, mrnStatus, manager);
  }

  async addJobForUpdatingAllocFabToExtSystem(reqObj: RollIdsConsumptionRequest): Promise<GlobalResponseObject> {
    return await this.docMatService.addJobForUpdatingAllocFabToExtSystem(reqObj);
  }

  async addJobForUpdatingIssuedFabToExtSystem(reqObj: RollIdsConsumptionRequest): Promise<GlobalResponseObject> {
    return await this.docMatService.addJobForUpdatingIssuedFabToExtSystem(reqObj);
  }

}