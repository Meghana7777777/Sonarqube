import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { DataSource, In } from "typeorm";
import { CutDispatchInfoService } from "./cut-dispatch-info.service";
import { LayReportingInfoService } from "../lay-reporting/lay-reporting-info.service";
import { PoDocketLayEntity } from "../lay-reporting/entity/po-docket-lay.entity";
import { CutGenerationInfoService } from "../cut-generation/cut-generation-info.service";
import { PoCutDocketEntity } from "../cut-generation/entity/po-cut-docket.entity";
import { DocketGenerationInfoService } from "../docket-generation/docket-generation-info.service";
import { DocketAttrEnum, GlobalResponseObject, JobScanQtyBasicModel, JobScanQtyBasicResponse, PoDocketNumbersRequest, PoSerialRequest, PoSummaryModel, PoSummaryResponse, VendorIdRequest, VendorModel } from "@xpparel/shared-models";
import { CutOrderService, EmbRequestHandlingService, EmbTrackingService, POService, VendorService } from "@xpparel/shared-services";
import { ErrorResponse } from "@xpparel/backend-utils";
import { PoCutEntity } from "../cut-generation/entity/po-cut.entity";
import { CutReportingInfoService } from "../cut-reporting/cut-reporting-info.service";
import { PoDocketLayItemEntity } from "../lay-reporting/entity/po-docket-lay-item.entity";
import { PoDocketEntity } from "../docket-generation/entity/po-docket.entity";
import { DocketCutPliesQueryResponse } from "../lay-reporting/repository/query-response/docket-cut-plies.query.reponse";

@Injectable()
export class CutDispatchHelperService {
  constructor(
    private dataSource: DataSource,
    @Inject(forwardRef(()=>CutDispatchInfoService)) private cutDispatchInfo: CutDispatchInfoService,
    @Inject(forwardRef(()=>LayReportingInfoService)) private layInfoService: LayReportingInfoService,
    @Inject(forwardRef(()=>CutGenerationInfoService)) private cutInfoService: CutGenerationInfoService,
    @Inject(forwardRef(()=>CutReportingInfoService)) private cutRepInfoService: CutReportingInfoService,
    @Inject(forwardRef(()=>DocketGenerationInfoService)) private docInfoService: DocketGenerationInfoService,
    private vendorService: VendorService,
    private poService: CutOrderService,
    private embTrackingService: EmbTrackingService,
    private embReqService: EmbRequestHandlingService,
  ) {

  }

  async getLayingRecordsForLayIds(layIds: number[], unitCode: string, companyCode: string): Promise<PoDocketLayEntity[]> {
    return await this.layInfoService.getLayingRecordsForLayIds(layIds, unitCode, companyCode);
  }

  async getDocketsForPoSerialAndCutNumber(poSerial: number, cutNumber: number, companyCode: string, unitCode: string): Promise<PoCutDocketEntity[]> {
    return await this.cutInfoService.getDocketsForPoSerialAndCutNumber(poSerial, cutNumber, companyCode, unitCode);
  }

  async getCutDocketRecordsForDocket(docketNumber: string, companyCode: string, unitCode: string): Promise<PoCutDocketEntity[]> {
    return await this.cutInfoService.getCutDocketRecordsForDocket(docketNumber, companyCode, unitCode);
  }

  async getCutDocketRecordsForDockets(docketNumbers: string[], companyCode: string, unitCode: string): Promise<PoCutDocketEntity[]> {
    return await this.cutInfoService.getCutDocketRecordsForDockets(docketNumbers, companyCode, unitCode);
  }

  async getCutDocketRecordsForPoSerialAndCutNumbers(poSerial: number, cutNumbers: number[], companyCode: string, unitCode: string): Promise<PoCutDocketEntity[]> {
    return await this.cutInfoService.getCutDocketRecordsForPoSerialAndCutNumbers(poSerial, cutNumbers, companyCode, unitCode);
  }

  async getDocketAttrByDocNumber(docketNumber: string, companyCode: string, unitCode: string): Promise<{ [k in DocketAttrEnum]: string }> {
    return await this.docInfoService.getDocketAttrByDocNumber(docketNumber, companyCode, unitCode);
  }

  async getVendorInfoById(vendorId: number, companyCode: string, unitCode: string): Promise<VendorModel> {
    const vendorReq = new VendorIdRequest(null, unitCode, companyCode, 0, vendorId);
    const vendorRes = await this.vendorService.getVendorInfoById(vendorReq);
    if(!vendorRes.status) {
      throw new ErrorResponse(0, 'Vendor does not exist for the provided ID');
    }
    return vendorRes.data[0];
  }

  async getPoSummaryLine(poSerial: number, companyCode: string, unitCode: string): Promise<PoSummaryModel> {
    const poSerialReq = new PoSerialRequest(null, unitCode, companyCode, 0, poSerial, 0, false, false);
    const poRes = await this.poService.getPoSummary(poSerialReq);
    if(!poRes.status) {
      throw new ErrorResponse(0, 'Po summary does not exist');
    }
    return poRes.data[0];
  }

  async getLayingRecordsForDocketGroups(docketNumbers: string[], companyCode: string, unitCode: string ): Promise<PoDocketLayEntity[]> {
    return await this.layInfoService.getLayingRecordsForDocketGroups(docketNumbers, companyCode, unitCode);
  }

  async getMainDocketsByPoSerialCutNumbers(poSerial: number, cutNumbers: number[], companyCode: string, unitCode: string): Promise<PoCutEntity[]> {
    return await this.cutInfoService.getMainDocketsByPoSerialCutNumbers(poSerial, cutNumbers, companyCode, unitCode);
  }

  async getAdbShadeCountForLayId(layId: number, unitCode: string, companyCode: string): Promise<number> {
    return await this.cutRepInfoService.getAdbShadeCountForLayId(layId, unitCode, companyCode);
  }

  async getLayingRollRecordsForLayId(layId: number, unitCode: string, companyCode: string): Promise<PoDocketLayItemEntity[]> {
    return await this.layInfoService.getLayingRollRecordsForLayId(layId, unitCode, companyCode);
  }

  async getDocketRecordByDocNumber(docketNumber: string, companyCode: string, unitCode: string): Promise<PoDocketEntity> {
    return await this.docInfoService.getDocketRecordByDocNumber(docketNumber, companyCode, unitCode);
  }

  async getDocketRecordsByDocGroup(docketGroup: string, companyCode: string, unitCode: string): Promise<PoDocketEntity[]> {
    return await this.docInfoService.getDocketRecordsByDocGroup(docketGroup, companyCode, unitCode);
  }

  async getDocketRecordByDocNumbers(docketNumbers: string[], companyCode: string, unitCode: string): Promise<PoDocketEntity[]> {
    return await this.docInfoService.getDocketRecordByDocNumbers(docketNumbers, companyCode, unitCode);
  }

  async getCutReportedPliesPerDocketOfGivenDocketGroups(docketGroups: string[], companyCode: string, unitCode: string): Promise<DocketCutPliesQueryResponse[]> {
    return await this.layInfoService.getCutReportedPliesPerDocketOfGivenDocketGroups(docketGroups, companyCode, unitCode);
  }

  async getEmbJobWiseReportedQtysForRefJobNos(docketNumbers: string[], companyCode: string, unitCode: string): Promise<JobScanQtyBasicModel[]> {
    const req = new PoDocketNumbersRequest(null, unitCode, companyCode, 0, 0, docketNumbers, false, false, null);
    const embJobsRes = await this.embTrackingService.getEmbJobWiseReportedQtysForRefJobNos(req);
    console.log(embJobsRes);
    if(!embJobsRes.status) {
      throw new ErrorResponse(0, embJobsRes.internalMessage?.toString());
    }
    return embJobsRes.data;
  }

  async freezeEmbLines(docketNumbers: string[], companyCode: string, unitCode: string): Promise<boolean> {
    const req = new PoDocketNumbersRequest(null, unitCode, companyCode, 0, 0, docketNumbers, false, false, null);
    const freezeJobsRes = await this.embReqService.freezeEmbLines(req);
    if(!freezeJobsRes.status) {
      throw new ErrorResponse(0, freezeJobsRes.internalMessage?.toString());
    }
    return true;
  }

  async unFreezeEmbLines(docketNumbers: string[], companyCode: string, unitCode: string): Promise<boolean> {
    const req = new PoDocketNumbersRequest(null, unitCode, companyCode, 0, 0, docketNumbers, false, false, null);
    const freezeJobsRes = await this.embReqService.unFreezeEmbLines(req);
    if(!freezeJobsRes.status) {
      throw new ErrorResponse(0, freezeJobsRes.internalMessage?.toString());
    }
    return true;
  }
}
