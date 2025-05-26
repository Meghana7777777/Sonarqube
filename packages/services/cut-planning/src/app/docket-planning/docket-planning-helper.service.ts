import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { DataSource } from "typeorm";
import { DocketGenerationInfoService } from "../docket-generation/docket-generation-info.service";
import { DocketAttrEnum, MaterialRequestNoRequest, WhExtReqNoRequest } from "@xpparel/shared-models";
import { PoDocketEntity } from "../docket-generation/entity/po-docket.entity";
import { DocketMaterialInfoService } from "../docket-material/docket-material-info.service";
import { PoDocketMaterialRequestEntity } from "../docket-material/entity/po-docket-material-request.entity";
import { CutTableService } from "../master/cut-table/cut-table.service";
import { CutTableEntity } from "../master/cut-table/entity/cut-table.entity";
import { FabricRequestCreationService } from "@xpparel/shared-services";
import { PoDocketMaterialEntity } from "../docket-material/entity/po-docket-material.entity";

@Injectable()
export class DocketPlanningHelperService {
  constructor(
    private dataSource: DataSource,
    @Inject(forwardRef(()=>DocketGenerationInfoService) ) private docGenInfoService: DocketGenerationInfoService,
    @Inject(forwardRef(()=>DocketMaterialInfoService) ) private docMatInfoService: DocketMaterialInfoService,
    @Inject(forwardRef(()=>CutTableService) ) private cutTableService: CutTableService,
    private fabReqCreationService: FabricRequestCreationService
  ) {

  }

  async getWorkstationInfo(workstationId: number, companyCode: string, unitCode: string): Promise<CutTableEntity> {
    return await this.cutTableService.getCutTableRecordById(workstationId, companyCode, unitCode);
  }

  async getDocketRecordByDocNumber(docketNumber: string, companyCode: string, unitCode: string): Promise<PoDocketEntity> {
    return await this.docGenInfoService.getDocketRecordByDocNumber(docketNumber, companyCode, unitCode);
  }

  async getDocketRecordsByDocGroup(docketGroup: string, companyCode: string, unitCode: string): Promise<PoDocketEntity[]> {
    return await this.docGenInfoService.getDocketRecordsByDocGroup(docketGroup, companyCode, unitCode);
  }

  async getDocketAttrByDocNumber(docketNumber: string, companyCode: string, unitCode: string): Promise<{[k in DocketAttrEnum]: string}> {
    return await this.docGenInfoService.getDocketAttrByDocNumber(docketNumber, companyCode, unitCode);
  }

  async getDocketAttrByDocNumbers(docketNumbers: string[], companyCode: string, unitCode: string): Promise<Map<string, { [k in DocketAttrEnum]: string }>> {
    return await this.docGenInfoService.getDocketAttrByDocNumbers(docketNumbers, companyCode, unitCode);
  }

  // TODO
  async getPoDocketMaterialRecordsByDocGroup(docketGroups: string[], requestNumber: string, companyCode: string, unitCode: string): Promise<PoDocketMaterialEntity[]> {
    return await this.docMatInfoService.getPoDocketMaterialRecordsByDocGroup(docketGroups, companyCode, unitCode)
  }

  // TODO
  async getDocketMaterialRequestRecordByReqNumber(requestNumber: string, companyCode: string, unitCode: string): Promise<PoDocketMaterialRequestEntity> {
    return await this.docMatInfoService.getDocketMaterialRequestRecordByReqNumber(requestNumber, companyCode, unitCode);
  }

  // TODO
  async createFabricRequestInWh(req: MaterialRequestNoRequest): Promise<boolean> {
    // TODO modify to a bull job instead of an API call
    const whReqStatus = await this.fabReqCreationService.createFabricWhRequestByExtReqNo(req);
    console.log(whReqStatus);
    return whReqStatus.status;
  }

  // TODO
  async deleteFabricRequestInWh(req: WhExtReqNoRequest): Promise<boolean> {
    // TODO modify to a bull job instead of an API call
    const whReqStatus = await this.fabReqCreationService.deleteFabricWhRequest(req);
    return whReqStatus.status;
  }
}