import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { DataSource, In } from "typeorm";
import { BundlingInfoService } from "./bundling-info.service";
import { LayReportingInfoService } from "../lay-reporting/lay-reporting-info.service";
import { CutGenerationInfoService } from "../cut-generation/cut-generation-info.service";
import { DocketGenerationInfoService } from "../docket-generation/docket-generation-info.service";
import { CutOrderService, EmbRequestHandlingService, EmbTrackingService, FgCreationService, InvCreationService, PoMaterialService, POService, VendorService } from "@xpparel/shared-services";
import { CutReportingInfoService } from "../cut-reporting/cut-reporting-info.service";
import { PoDocketLayEntity } from "../lay-reporting/entity/po-docket-lay.entity";
import { PoDocketEntity } from "../docket-generation/entity/po-docket.entity";
import { PoAdbRollEntity } from "../cut-reporting/entity/po-adb-roll.entity";
import { CPS_C_BundlingConfirmationIdRequest, CutRmModel, MO_R_OslBundlesModel, MO_R_OslProcTypeBundlesModel, OES_C_PoProdColorRequest, OES_R_PoOrderSizeQty, PO_C_PoSerialPslIdsRequest, PoProdutNameRequest } from "@xpparel/shared-models";
import { ErrorResponse } from "@xpparel/backend-utils";
import { PslInfoEntity } from "../common/entity/psl-info.entity";
import { PslInfoRepository } from "../common/repository/psl-info.repository";
import { PoDocketLayItemEntity } from "../lay-reporting/entity/po-docket-lay-item.entity";
import { DOC_ElgPanelsForBundlingQueryResponse, DOC_SizeWiseBundledQtysQueryResponse, DOC_SizeWiseCutRepQytsQueryResponse, ItemDocSizeWiseQtysQueryResponse } from "../docket-generation/repository/query-response/doc-query-response.models";

@Injectable()
export class BundlingHelperService {
  constructor(
    private dataSource: DataSource,
    @Inject(forwardRef(()=>BundlingInfoService)) private cutDispatchInfo: BundlingInfoService,
    @Inject(forwardRef(()=>LayReportingInfoService)) private layInfoService: LayReportingInfoService,
    @Inject(forwardRef(()=>CutGenerationInfoService)) private cutInfoService: CutGenerationInfoService,
    @Inject(forwardRef(()=>CutReportingInfoService)) private cutRepInfoService: CutReportingInfoService,
    @Inject(forwardRef(()=>DocketGenerationInfoService)) private docInfoService: DocketGenerationInfoService,
    private vendorService: VendorService,
    private poService: POService,
    private embTrackingService: EmbTrackingService,
    private embReqService: EmbRequestHandlingService,
    private oesPoService: CutOrderService,
    private pslRepo: PslInfoRepository,
    private oesCutRmService: PoMaterialService,
    private invCreationService: InvCreationService,
    private ptsFgService: FgCreationService
  ) {

  }


  // uses doc generation
  async getCutReportedPanelsForBundlingByDocket(docNumber: string, companyCode: string, unitCode: string): Promise<DOC_ElgPanelsForBundlingQueryResponse[]> {
    return await this.docInfoService.getCutReportedPanelsForBundlingByDocket(docNumber, companyCode, unitCode);
  }

  // uses doc generation
  async getCutReportedPanelsForBundlingByActualDocket(docNumber: string, underDocLayNumber: number, companyCode: string, unitCode: string): Promise<DOC_ElgPanelsForBundlingQueryResponse[]> {
    return await this.docInfoService.getCutReportedPanelsForBundlingByActualDocket(docNumber, underDocLayNumber, companyCode, unitCode);
  }

  // uses doc generation
  async getCutReportedPanelsForBundlingByPslIds(procSerial: number, pslIds: number[], refComp: string, companyCode: string, unitCode: string): Promise<DOC_ElgPanelsForBundlingQueryResponse[]> {
    return await this.docInfoService.getCutReportedPanelsForBundlingByPslIds(procSerial, pslIds, refComp, companyCode, unitCode);
  }
  
  // uses lay reporting
  async getActualDocketRecordsForDocket(docGroups: string[], companyCode: string, unitCode: string): Promise<PoDocketLayEntity[]> {
    return await this.layInfoService.getLayingRecordsForDocketGroups(docGroups, companyCode, unitCode);
  }

  // uses doc generation
  async getDocketRecordByDocNumber(docNumber: string, companyCode: string, unitCode: string) : Promise<PoDocketEntity> {
    return await this.docInfoService.getDocketRecordByDocNumber(docNumber, companyCode, unitCode);
  }

  // uses doc generation
  async getDistinctComponentsForPoSerialProdTypeAndColor(poSerial: number, prodName: string, fgColor: string, companyCode: string, unitCode: string): Promise<string[]> {
    return await this.docInfoService.getDistinctComponentsForPoSerialProdTypeAndColor(poSerial, prodName, fgColor, companyCode, unitCode);
  }

  // uses cut reporting
  async getAdbRollsByAdbRollIds(adbIds: number[], unitCode: string, companyCode: string): Promise<PoAdbRollEntity[]> {
    return await this.cutRepInfoService.getAdbRollsByAdbRollIds(adbIds, unitCode, companyCode);
  }

  // uses doc generation
  async getPslIdsForDocket(docNumber: string, companyCode: string, unitCode: string): Promise<number[]> {
    return await this.docInfoService.getPslIdsForDocket(docNumber, companyCode, unitCode);
  }

  async getPslProps(pslIds: number[], companyCode: string, unitCode: string): Promise<Map<number, PslInfoEntity>> {
    const pslRecs = await this.pslRepo.find({where: {companyCode, unitCode, pslId: In(pslIds)}});
    const pslInfoMap = new Map<number, PslInfoEntity>();
    pslRecs.forEach(r => pslInfoMap.set(Number(r.pslId), r));
    return pslInfoMap;
  }

  async getDocketsForPoProdColor(poSerial: number, prodName: string, color: string, companyCode: string, unitCode: string, iNeedOnlyMainDocs: boolean): Promise<PoDocketEntity[]> {
    const docRecs = await this.docInfoService.getDocketsForPoProdColor(poSerial, prodName, color, companyCode, unitCode, iNeedOnlyMainDocs);
    return docRecs;
  }

  async getLayingRecordsForDocketGroups(docGroups: string[], companyCode: string, unitCode: string): Promise<PoDocketLayEntity[]> {
    const layRecs = await this.layInfoService.getLayingRecordsForDocketGroups(docGroups, companyCode, unitCode);
    return layRecs;
  }

  async getLayingRollRecordsForLayIds(layIds: number[], companyCode: string, unitCode: string): Promise<PoDocketLayItemEntity[]> {
    const layRecs = await this.layInfoService.getLayingRollRecordsForLayIds(layIds, companyCode, unitCode);
    return layRecs;
  }

  async getCutRmForPoProdColor(poSerial: number, prodName: string, color: string, companyCode: string, unitCode: string): Promise<CutRmModel[]> {
    const m1 = new PoProdutNameRequest(null, unitCode, companyCode, 0, poSerial, prodName, color, true, null, null);
    const cutRmRes = await this.oesCutRmService.getPoProdTypeAndFabricsForProductName(m1);
    if(!cutRmRes.status) {
      throw new ErrorResponse(0, `OES Says : ${cutRmRes.internalMessage}`);
    }
    return cutRmRes.data[0].iCodes;
  }

  async getCutOrderQtyForPoProdColor(poSerial: number, prodName: string, color: string, companyCode: string, unitCode: string): Promise<OES_R_PoOrderSizeQty[]> {
    const m1 = new OES_C_PoProdColorRequest(null, unitCode, companyCode, 0, poSerial, prodName, color);
    const cutOrderQtys = await this.oesPoService.getCutOrderQtysForPoProdColor(m1);
    if(!cutOrderQtys.status) {
      throw new ErrorResponse(0, `OES Says : ${cutOrderQtys.internalMessage}`);
    }
    if(!cutOrderQtys.data?.length) {
      throw new ErrorResponse(0, `No order quantity info found for the po serial : ${poSerial} , product : ${prodName} , color: ${color} `);
    }
    return cutOrderQtys.data[0]?.sizeQtys;
  }
  
  async getSizeWiseDocGenQtysForPoProdColorRm(poSerial: number, prodName: string, color: string, rmSku: string, companyCode: string, unitCode: string): Promise<ItemDocSizeWiseQtysQueryResponse[]> {
    return await this.docInfoService.getSizeWiseDocGenQtysForPoProdColorRm(poSerial, prodName, color, rmSku, companyCode, unitCode);
  }

  async getSizeWiseCutReportedQtysForDockets(poSerial: number, docketNumbers: string[], companyCode: string, unitCode: string): Promise<DOC_SizeWiseCutRepQytsQueryResponse[]> {
    return await this.docInfoService.getSizeWiseCutReportedQtysForDockets(poSerial, docketNumbers, companyCode, unitCode);
  }

  async getSizeWiseBundledQtysForDockets(poSerial: number, docketNumbers: string[], companyCode: string, unitCode: string): Promise<DOC_SizeWiseBundledQtysQueryResponse[]> {
    return await this.docInfoService.getSizeWiseBundledQtysForDockets(poSerial, docketNumbers, companyCode, unitCode);
  }

  async deleteCutInvInRequestByConfirmationId(confirmationId: number,  companyCode: string, unitCode: string): Promise<boolean> {
    try {
      const m1 = new CPS_C_BundlingConfirmationIdRequest(null, unitCode, companyCode, 0, confirmationId, null);
      await this.invCreationService.deleteCutInvInRequestByConfirmationId(m1);
      return true;
    } catch(error) {
      throw error;
    }
  }

  async createCutInvInRequestByConfirmationId(confirmationId: number,  companyCode: string, unitCode: string): Promise<boolean> {
    try {
      const m1 = new CPS_C_BundlingConfirmationIdRequest(null, unitCode, companyCode, 0, confirmationId, null);
      await this.invCreationService.createCutInvInRequestByConfirmationId(m1);
      return true;
    } catch(error) {
      throw error;
    }
  }

  async createCutInvInPtsByConfirmationId(confirmationId: number,  companyCode: string, unitCode: string): Promise<boolean> {
    try {
      const m1 = new CPS_C_BundlingConfirmationIdRequest(null, unitCode, companyCode, 0, confirmationId, null);
      this.ptsFgService.createActualBundlesForConfirmationIdCut(m1);
      return true;
    } catch(error) {
      throw error;
    }
  }

  async deleteActualBundlesForConfirmationIdCut(confirmationId: number,  companyCode: string, unitCode: string): Promise<boolean> {
    try {
      const m1 = new CPS_C_BundlingConfirmationIdRequest(null, unitCode, companyCode, 0, confirmationId, null);
      this.ptsFgService.deleteActualBundlesForConfirmationIdCut(m1);
      return true;
    } catch(error) {
      throw error;
    }
  }
}
