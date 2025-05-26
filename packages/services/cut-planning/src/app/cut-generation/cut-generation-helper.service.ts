import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { DataSource } from "typeorm";
import { DocketGenerationInfoService } from "../docket-generation/docket-generation-info.service";
import { PoDocketEntity } from "../docket-generation/entity/po-docket.entity";
import { LayReportingInfoService } from "../lay-reporting/lay-reporting-info.service";
import { AdResponse, DocketAttrEnum, DocketBasicInfoResponse, DocketLaysResponse, LayIdsRequest, PoDocketGroupRequest, PoDocketNumberRequest } from "@xpparel/shared-models";
import { PoDocketLayEntity } from "../lay-reporting/entity/po-docket-lay.entity";
import { CutDispatchInfoService } from "../cut-dispatch/cut-dispatch-info.service";
import { CutDispatchHeaderEntity } from "../cut-dispatch/entity/cut-dispatch-header.entity";

@Injectable()
export class CutGenerationHelperService {
  constructor(
    private dataSource: DataSource,
    @Inject(forwardRef(() => DocketGenerationInfoService)) private docInfoService: DocketGenerationInfoService,
    @Inject(forwardRef(() => LayReportingInfoService)) private layInfoService: LayReportingInfoService,
    @Inject(forwardRef(() => CutDispatchInfoService)) private dispatchInfoService: CutDispatchInfoService,
  ) {

  }

  async getDocketRecordsForPoSerial(poSerial: number, companyCode: string, unitCode: string): Promise<PoDocketEntity[]> {
    return await this.docInfoService.getDocketRecordByPoSerial(poSerial, companyCode, unitCode);
  }

  async getDocketRecordByPoSerialProdName(poSerial: number,  prodName: string, companyCode: string, unitCode: string): Promise<PoDocketEntity[]> {
    return await this.docInfoService.getDocketRecordByPoSerialProdName(poSerial, prodName, companyCode, unitCode);
  }

  async getDocketRecordByDocNumber(docketNumber: string, companyCode: string, unitCode: string): Promise<PoDocketEntity> {
    return await this.docInfoService.getDocketRecordByDocNumber(docketNumber, companyCode, unitCode);
  }

  async getDocketRecordByDocNumbers(docketNumbers: string[], companyCode: string, unitCode: string): Promise<PoDocketEntity[]> {
    return await this.docInfoService.getDocketRecordByDocNumbers(docketNumbers, companyCode, unitCode);
  }

  async getRelatedDocketsMappedForRefDocket(poSerial: number, docketNumber: string, companyCode: string, unitCode: string): Promise<string[]> {
    return await this.docInfoService.getRelatedDocketsMappedForRefDocket(poSerial, docketNumber, companyCode, unitCode);
  }

  async getDocketsBasicInfoForDocketNumber(poDocReq: PoDocketNumberRequest, helpingAbstractInfoOnly: boolean): Promise<DocketBasicInfoResponse> {
    return await this.docInfoService.getDocketsBasicInfoForDocketNumber(poDocReq, helpingAbstractInfoOnly);
  }

  async getLayInfoForDocketGroup(poDocReq: PoDocketGroupRequest): Promise<DocketLaysResponse> {
    return this.layInfoService.getLayInfoForDocketGroup(poDocReq);
  }

  async getActualDocketInfo(layIdsReq: LayIdsRequest, iNeedCutAndDipatchNumbers): Promise<AdResponse> {
    return await this.layInfoService.getActualDocketInfo(layIdsReq, iNeedCutAndDipatchNumbers);
  }
  
  async getLayingRecordsForDocketGroups(docketNumbers: string[], companyCode: string, unitCode: string): Promise<PoDocketLayEntity[]> {
    return await this.layInfoService.getLayingRecordsForDocketGroups(docketNumbers, companyCode, unitCode);
  }

  async getDocketAttrByDocNumber(docketNumber: string, companyCode: string, unitCode: string): Promise<{ [k in DocketAttrEnum]: string }> {
    return await this.docInfoService.getDocketAttrByDocNumber(docketNumber, companyCode, unitCode);
  }

  async getCutDrRequestHeaderRecordForPoSerialCutNumber(poSerial: number, cutNumber: number, companyCode: string, unitCode: string): Promise<CutDispatchHeaderEntity> {
    return await this.dispatchInfoService.getCutDrRequestHeaderRecordForPoSerialCutNumber(poSerial, cutNumber, companyCode, unitCode);
  }

  async getCutDrRequestHeaderRecordForPoSerialCutNumbers(poSerial: number, cutNumbers: number[], companyCode: string, unitCode: string): Promise<CutDispatchHeaderEntity> {
    return await this.dispatchInfoService.getCutDrRequestHeaderRecordForPoSerialCutNumbers(poSerial, cutNumbers, companyCode, unitCode);
  }

}