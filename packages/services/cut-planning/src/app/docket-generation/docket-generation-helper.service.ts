import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { ErrorResponse } from "@xpparel/backend-utils";
import { ActualMarkerModel, CPS_BULLJSJOBNAMES, DocBundlePanelsRequest, DocRollsModel, DocketLayModel, GlobalResponseObject, MarkerIdRequest, MarkerInfoModel, OpVersionModel, PoDocketGroupRequest, PoDocketNumberRequest, PoProdTypeAndFabModel, PoProdTypeAndFabResponse, PoProdutNameRequest, PoRatioIdRequest, PoRatioModel, PoSerialRequest, PoSummaryModel, RatioDocGenStatusRequest, MoCustomerInfoHelperModel, PoProductFgColorRequest, PO_PoSerialRequest, ProcessTypeEnum, PO_C_PoSerialPslIdsRequest, MO_R_OslBundlesResponse, PoItemRefCompProductModel, RefComponentInfoResponse } from "@xpparel/shared-models";
import { CutOrderService, EtsBullQueueService, OpVersionService, OrderManipulationServices, POService, PoMarkerService, PoMaterialService, PoRatioService } from "@xpparel/shared-services";
import { DataSource } from "typeorm";
import { GenericTransactionManager } from "../../database/typeorm-transactions";
import { BullQueueService } from "../bull-queue/bull-queue.service";
import { PoRatioAttrRepository } from "../common/repository/po-ratio-attr.repository";
import { CutGenerationInfoService } from "../cut-generation/cut-generation-info.service";
import { CutGenerationService } from "../cut-generation/cut-generation.service";
import { PoCutDocketEntity } from "../cut-generation/entity/po-cut-docket.entity";
import { PoCutEntity } from "../cut-generation/entity/po-cut.entity";
import { DocketMaterialInfoService } from "../docket-material/docket-material-info.service";
import { PoDocketMaterialEntity } from "../docket-material/entity/po-docket-material.entity";
import { DocketPlanningInfoService } from "../docket-planning/docket-planning-info.service";
import { LayReportingInfoService } from "../lay-reporting/lay-reporting-info.service";
import { DocketLayPliesQueryResponse } from "../lay-reporting/repository/query-response/docket-lay-plies.query.reponse";
import { DocketGenerationInfoService } from "./docket-generation-info.service";
import { PoDocketBundleRepository } from "./repository/po-docket-bundle.repository";
import { PoDocketGroupRepository } from "./repository/po-docket-group.repository";
import { PoDocketPanelRepository } from "./repository/po-docket-panel.repository";
import { PoDocketRepository } from "./repository/po-docket.repository";

@Injectable()
export class DocketGenerationHelperService {
  constructor(
    private dataSource: DataSource,
    private poDocketRepo: PoDocketRepository,
    private poDocBundleRepo: PoDocketBundleRepository,
    private poDocPanelRepo: PoDocketPanelRepository,
    private poDocGroupRepo: PoDocketGroupRepository,
    private ratioAttrRepo: PoRatioAttrRepository,
    private poRatioService: PoRatioService,
    private poMaterialService: PoMaterialService,
    @Inject(forwardRef(() => BullQueueService)) private bullJobService: BullQueueService,
    private poService: POService,
    @Inject(forwardRef(() => DocketMaterialInfoService)) private docketMaterialInfo: DocketMaterialInfoService,
    @Inject(forwardRef(() => DocketGenerationInfoService)) private docketGenerationInfo: DocketGenerationInfoService,
    @Inject(forwardRef(() => DocketPlanningInfoService)) private docketPlanningInfo: DocketPlanningInfoService,

    private poMarkerService: PoMarkerService,
    @Inject(forwardRef(() => CutGenerationService)) private cutGenService: CutGenerationService,
    @Inject(forwardRef(() => CutGenerationInfoService)) private cutGenInfoService: CutGenerationInfoService,
    @Inject(forwardRef(() => LayReportingInfoService)) private layInfoService: LayReportingInfoService,
    private etsBullService: EtsBullQueueService,
    private opVerService: OpVersionService,
    private cutOrderService: CutOrderService

  ) {

  }

  /**
   * Service to get ratio details info for a ratio Id
   * @param req 
   * @returns 
  */
  async getRatioDetailedInfoForRatioId(req: PoRatioIdRequest): Promise<PoRatioModel[]> {
    console.log(req);
    const ratioDetails = await this.poRatioService.getRatioDetailedInfoForRatioId(req);
    if (!ratioDetails.status) {
      throw new ErrorResponse(ratioDetails.errorCode, ratioDetails.internalMessage);
    }
    return ratioDetails.data;
  }

  async updateDocGenStatusByRatioId(reqModel: RatioDocGenStatusRequest): Promise<GlobalResponseObject> {
    const updateRes = await this.poRatioService.updateDocGenStatusByRatioId(reqModel);
    console.log(updateRes);
    if (!updateRes.status) {
      throw new ErrorResponse(updateRes.errorCode, updateRes.internalMessage);
    }
    return updateRes;
  }

  async getPoProdTypeAndFabricsAndItsSizes(reqModel: PoSerialRequest): Promise<PoProdTypeAndFabResponse> {
    const prodInfo = await this.poMaterialService.getPoProdTypeAndFabricsAndItsSizes(reqModel);
    if (!prodInfo.status) {
      throw new ErrorResponse(prodInfo.errorCode, prodInfo.internalMessage)
    }
    return prodInfo;
  }

  async getPoProdTypeAndFabricsForProductName(poSerial: number, prodName: string, companyCode: string, unitCode: string): Promise<PoProdTypeAndFabModel[]> {
    const reqModel = new PoProdutNameRequest(null, unitCode, companyCode, 0, poSerial, prodName, null);
    const prodInfo = await this.poMaterialService.getPoProdTypeAndFabricsForProductName(reqModel);
    if (!prodInfo.status) {
      throw new ErrorResponse(prodInfo.errorCode, prodInfo.internalMessage)
    }
    return prodInfo?.data;
  }

  async getPoProdTypeAndFabricsForPoSerial(poSerial: number, companyCode: string, unitCode: string): Promise<PoProdTypeAndFabModel[]> {
    const reqModel = new PoProdutNameRequest(null, unitCode, companyCode, 0, poSerial, undefined, null);
    // Re using the same API by passing the prod name as undefined
    const prodInfo = await this.poMaterialService.getPoProdTypeAndFabricsForProductName(reqModel);
    if (!prodInfo.status) {
      throw new ErrorResponse(prodInfo.errorCode, prodInfo.internalMessage)
    }
    return prodInfo?.data;
  }

  async getPoSummary(reqModel: PoSerialRequest): Promise<PoSummaryModel> {
    const poSummary = await this.cutOrderService.getPoSummary(reqModel);
    if (!poSummary.status) {
      throw new ErrorResponse(poSummary.errorCode, poSummary.internalMessage);
    }
    return poSummary.data[0];
  }

  async getAllocatedQtyForDocketGroup(docketGroup: string, unitCode: string, companyCode: string): Promise<number> {
    return await this.docketMaterialInfo.getAllocatedQtyForDocketGroup(docketGroup, unitCode, companyCode);
  }

  async getPoDocketMaterialRecordsByDocNumber(docketNumbers: string[], companyCode: string, unitCode: string): Promise<PoDocketMaterialEntity[]> {
    return await this.docketMaterialInfo.getPoDocketMaterialRecordsByDocGroup(docketNumbers, companyCode, unitCode);
  }

  async getDocketAllocatedRollsForDocketGroup(docketGroup: string, companyCode: string, unitCode: string): Promise<DocRollsModel[]> {
    const req = new PoDocketGroupRequest(null, unitCode, companyCode, 0, 0, docketGroup, false, false, null);
    return await this.docketMaterialInfo.getDocketAllocatedRollsForDocketGroup(req);
  }

  async getPoMarker(reqModel: MarkerIdRequest): Promise<MarkerInfoModel> {
    const markerInfo = await this.poMarkerService.getPoMarker(reqModel);
    if (!markerInfo.status || !markerInfo?.data?.length) {
      throw new ErrorResponse(markerInfo.errorCode, markerInfo.internalMessage);
    }
    return markerInfo.data[0];
  }

  async addDocketBundleGeneration(req: PoDocketNumberRequest): Promise<GlobalResponseObject> {
    try {
      return await this.bullJobService.addDocketBundleGeneration(req, CPS_BULLJSJOBNAMES.CPS_DOC_BUN_GEN);
    } catch (err) {
      throw err;
    }
  }

  async addDocketPanelGeneration(req: DocBundlePanelsRequest): Promise<GlobalResponseObject> {
    try {
      return await this.bullJobService.addDocketPanelGeneration(req, CPS_BULLJSJOBNAMES.CPS_DOC_BUN_PANEL_GEN);
    } catch (err) {
      throw err;
    }
  }

  async addDocketConfirmation(req: PoProdutNameRequest): Promise<GlobalResponseObject> {
    try {
      return await this.bullJobService.addDocketConfirmation(req, CPS_BULLJSJOBNAMES.CPS_DOC_CON);
    } catch (err) {
      throw err;
    }
  }

  async addJobForCutNumberGeneration(req: PoSerialRequest): Promise<GlobalResponseObject> {
    return await this.bullJobService.addJobForCutNumberGeneration(req);
  }

  // BULL JOB ADDER. This is called after docket confirmation and cut reporting
  async addEmbRequestGenJob(poSerial: number, docketNumber: string, companyCode: string, unitCode: string, username: string): Promise<boolean> {
    const poDocReq = new PoDocketNumberRequest(username, unitCode, companyCode, 0, poSerial, docketNumber, false, false, null);
    await this.etsBullService.addEmbRequestGenJob(poDocReq);
    return true;
  }

  // BULL JOB ADDER. This is called after the docket unconfirmation
  async addEmbHeaderDelJob(poSerial: number, docketNumber: string, companyCode: string, unitCode: string, username: string): Promise<boolean> {
    const poDocReq = new PoDocketNumberRequest(username, unitCode, companyCode, 0, poSerial, docketNumber, false, false, null);
    await this.etsBullService.addEmbHeaderDelJob(poDocReq);
    return true;
  }

  // Helper
  // Called when unconfirming the dockets
  async deleteCutsForPoSerial(poSerial: number, companyCode: string, unitCode: string, manager?: GenericTransactionManager): Promise<boolean> {
    const poSerialReq = new PoSerialRequest('', unitCode, companyCode, 0, poSerial, 0, false, false);
    // const delRes = await this.cutGenService.deleteCuts(poSerialReq, manager);
    return true;
  }

  // Helper
  async getOpVersionsForPo(poSerial: number, prodName: string, style: string, fgColor: string, companyCode: string, unitCode: string): Promise<OpVersionModel> {
    const poSerialReq = new PoProductFgColorRequest(null, unitCode, companyCode, null, poSerial, prodName, style, fgColor, false, null, null);
    const opVerRes = await this.opVerService.getOpVersionForPoProductName(poSerialReq);
    if (!opVerRes.status) {
      throw new ErrorResponse(opVerRes.errorCode, opVerRes.internalMessage);
    }
    return opVerRes.data[0];
  }

  async getCutDocketRecordsForDockets(docketNumbers: string[], companyCode: string, unitCode: string): Promise<PoCutDocketEntity[]> {
    return await this.cutGenInfoService.getCutDocketRecordsForDockets(docketNumbers, companyCode, unitCode);
  }

  async getDocketLayModels(docketNumber: string, companyCode: string, unitCode: string, iNeedAllocatedRollsAlso: boolean): Promise<DocketLayModel[]> {
    return await this.layInfoService.getDocketLayModels(docketNumber, companyCode, unitCode, iNeedAllocatedRollsAlso);
  }


  async getMoCustomerPoInfoForPoSerial(poSerial: number, companyCode: string, unitCode: string): Promise<MoCustomerInfoHelperModel[]> {
    const poSerialReq = new PO_PoSerialRequest(null, unitCode, companyCode, 0, poSerial, ProcessTypeEnum.CUT);
    console.log(poSerialReq);
    const poOrderAttrsRes = await this.cutOrderService.getMoCustomerPoInfoForPoSerial(poSerialReq);
    if (!poOrderAttrsRes.status) {
      throw new ErrorResponse(0, poOrderAttrsRes.internalMessage);
    }
    // const poOrderAttrsRes =null;
    return poOrderAttrsRes.data;
  }

  async getCutRecordsForPoProductName(poSerial: number, prodNames: string[], companyCode: string, unitCode: string): Promise<PoCutEntity[]> {
    return await this.cutGenInfoService.getCutRecordsForPoProductName(poSerial, prodNames, companyCode, unitCode);
  }

  async getLayReportedPliesPerDocketOfGivenDocketGroups(docketNumbers: string[], companyCode: string, unitCode: string): Promise<DocketLayPliesQueryResponse[]> {
    return await this.layInfoService.getLayReportedPliesPerDocketOfGivenDocketGroups(docketNumbers, companyCode, unitCode);
  }

  async getActualMarkerForDocketGroup(companyCode: string, unitCode: string, docketGroups: string[]): Promise<ActualMarkerModel[]> {
    return await this.docketMaterialInfo.getActualMarkerForDocketGroup(companyCode, unitCode, docketGroups);
  }


  async getPslBundlesForPoSerial(req: PO_C_PoSerialPslIdsRequest): Promise<MO_R_OslBundlesResponse> {
    return await this.cutOrderService.getPslBundlesForPoSerial(req);
  };

  async getRefComponentsForPoAndProduct(reqModel: PoItemRefCompProductModel): Promise<RefComponentInfoResponse> {
    return await this.poMaterialService.getRefComponentsForPoAndProduct(reqModel);
  }

}