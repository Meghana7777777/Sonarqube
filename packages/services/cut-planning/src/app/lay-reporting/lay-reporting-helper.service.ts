import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { AdBundleModel, DocketAttrEnum, DocketBasicInfoResponse, MrnStatusEnum, PoDocketNumberRequest, PoRatioSizeModel, PoSerialRequest, PoSummaryResponse, ReasonIdRequest, ReasonResponse, RollBasicInfoResponse, RollIdsRequest } from "@xpparel/shared-models";
import { CutOrderService, FabricRequestCreationService, POService, PackingListService, ReasonsService } from "@xpparel/shared-services";
import { DataSource } from "typeorm";
import { CutDispatchInfoService } from "../cut-dispatch/cut-dispatch-info.service";
import { CutDispatchHeaderEntity } from "../cut-dispatch/entity/cut-dispatch-header.entity";
import { CutGenerationInfoService } from "../cut-generation/cut-generation-info.service";
import { PoCutDocketEntity } from "../cut-generation/entity/po-cut-docket.entity";
import { CutReportingInfoService } from "../cut-reporting/cut-reporting-info.service";
import { DocketGenerationInfoService } from "../docket-generation/docket-generation-info.service";
import { PoDocketEntity } from "../docket-generation/entity/po-docket.entity";
import { DocketMaterialInfoService } from "../docket-material/docket-material-info.service";
import { PoDocketMaterialRequestEntity } from "../docket-material/entity/po-docket-material-request.entity";
import { PoDocketMaterialEntity } from "../docket-material/entity/po-docket-material.entity";
import { CutTableService } from "../master/cut-table/cut-table.service";
import { CutTableEntity } from "../master/cut-table/entity/cut-table.entity";
import { MrnEntity } from "../mrn/entity/mrn.entity";
import { MrnInfoService } from "../mrn/mrn-info.service";

@Injectable()
export class LayReportingHelperService {
  constructor(
    private dataSource: DataSource,
    @Inject(forwardRef(() => DocketGenerationInfoService)) private docGenInfoService: DocketGenerationInfoService,
    @Inject(forwardRef(() => DocketMaterialInfoService)) private docMatInfoService: DocketMaterialInfoService,
    @Inject(forwardRef(() => CutTableService)) private cutTableService: CutTableService,
    private fabReqCreationService: FabricRequestCreationService,
    private reasonsService: ReasonsService,
    private packingListService: PackingListService,
    @Inject(forwardRef(() => CutReportingInfoService)) private cutReportingInfoService: CutReportingInfoService,
    private poService: CutOrderService,
    @Inject(forwardRef(() => DocketGenerationInfoService)) private docketInfoService: DocketGenerationInfoService,
    @Inject(forwardRef(() => CutDispatchInfoService)) private dispatchInfoService: CutDispatchInfoService,
    @Inject(forwardRef(() => CutGenerationInfoService)) private cutGenInfoService: CutGenerationInfoService,
    @Inject(forwardRef(() => MrnInfoService)) private mrnInfoService: MrnInfoService,
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

  async getDocketAttrByDocNumber(docketNumber: string, companyCode: string, unitCode: string): Promise<{ [k in DocketAttrEnum]: string }> {
    return await this.docGenInfoService.getDocketAttrByDocNumber(docketNumber, companyCode, unitCode);
  }

  async getDocketMaterialRequestRecordByReqNumber(requestNumber: string, companyCode: string, unitCode: string): Promise<PoDocketMaterialRequestEntity> {
    return await this.docMatInfoService.getDocketMaterialRequestRecordByReqNumber(requestNumber, companyCode, unitCode);
  }

  async getDocketMaterialRequestRecordsByDocGroup(docketNumber: string, companyCode: string, unitCode: string): Promise<PoDocketMaterialRequestEntity[]> {
    return await this.docMatInfoService.getDocketMaterialRequestRecordsByDocGroup(docketNumber, companyCode, unitCode);
  }

  async getPoDocketMaterialRecordsByDocNumber(docketNumbers: string[], companyCode: string, unitCode: string): Promise<PoDocketMaterialEntity[]> {
    return await this.docMatInfoService.getPoDocketMaterialRecordsByDocGroup(docketNumbers, companyCode, unitCode);
  }

  async getReasonbyId(reqData: ReasonIdRequest): Promise<ReasonResponse> {
    return await this.reasonsService.getReasonbyId(reqData);
  }

  async getRollsBasicInfoForRollIds(reqModel: RollIdsRequest): Promise<RollBasicInfoResponse> {
    return await this.packingListService.getRollsBasicInfoForRollIds(reqModel);
  }

  async getDocketsBasicInfoForDocketNumber(req: PoDocketNumberRequest): Promise<DocketBasicInfoResponse> {
    return await this.docGenInfoService.getDocketsBasicInfoForDocketNumber(req);
  }

  async getPoSummary(req: PoSerialRequest): Promise<PoSummaryResponse> {
    return await this.poService.getPoSummary(req);
  }

  async getAdbInfoByLayId(layId: number, unitCode: string, companyCode: string, component: string, docketNumber: string): Promise<AdBundleModel[]> {
    return await this.cutReportingInfoService.getAdbInfoByLayId(layId, unitCode, companyCode, component, docketNumber)
  }

  async getAdbShadeCountForLayId(layId: number, unitCode: string, companyCode: string): Promise<number> {
    return await this.cutReportingInfoService.getAdbShadeCountForLayId(layId, unitCode, companyCode);
  }


  async getSizeRatiosByDocketNumber(docketNumber: string, companyCode: string, unitCode: string): Promise<PoRatioSizeModel[]> {
    return await this.docketInfoService.getSizeRatiosByDocketNumber(docketNumber, companyCode, unitCode);
  }

  async getCutDrRequestHeaderRecordForPoSerialCutNumber(poSerial: number, cutNumber: number, companyCode: string, unitCode: string): Promise<CutDispatchHeaderEntity> {
    return await this.dispatchInfoService.getCutDrRequestHeaderRecordForPoSerialCutNumber(poSerial, cutNumber, companyCode, unitCode);
  }

  async getCutDocketRecordsForDocket(docketNumber: string, companyCode: string, unitCode: string): Promise<PoCutDocketEntity[]> {
    return await this.cutGenInfoService.getCutDocketRecordsForDocket(docketNumber, companyCode, unitCode);
  }

  async getMrnRequestRecordsByDocketNumberAndMrnStatus(docketNumber: string, companyCode: string, unitCode: string, mrnStatus: MrnStatusEnum[]): Promise<MrnEntity[]> {
    return await this.mrnInfoService.getMrnRequestRecordsByDocketNumberAndMrnStatus(docketNumber,companyCode, unitCode, mrnStatus)
  }
}