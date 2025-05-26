import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { DataSource } from "typeorm";
import { DocketGenerationInfoService } from "../docket-generation/docket-generation-info.service";
import { CPS_BULLJSJOBNAMES, CutReportRequest, CutStatusEnum, DbCutReportRequest, DocketAttrEnum, GlobalResponseObject, LayIdRequest, LayIdsRequest, MaterialRequestNoRequest, PhysicalEntityTypeEnum, PoDocketNumberRequest, PoItemRefCompProductModel, RefComponentInfoResponse, StockConsumptionRequest, TaskStatusEnum, WhExtReqNoRequest } from "@xpparel/shared-models";
import { PoDocketEntity } from "../docket-generation/entity/po-docket.entity";
import { DocketMaterialInfoService } from "../docket-material/docket-material-info.service";
import { PoDocketMaterialRequestEntity } from "../docket-material/entity/po-docket-material-request.entity";
import { CutTableService } from "../master/cut-table/cut-table.service";
import { CutTableEntity } from "../master/cut-table/entity/cut-table.entity";
import { EtsBullQueueService, FabricRequestCreationService, PackingListService, PoMaterialService } from "@xpparel/shared-services";
import { LayReportingInfoService } from "../lay-reporting/lay-reporting-info.service";
import { PoDocketLayEntity } from "../lay-reporting/entity/po-docket-lay.entity";
import { PoDocketBundleEntity } from "../docket-generation/entity/po-docket-bundle.entity";
import { PoDocketLayItemEntity } from "../lay-reporting/entity/po-docket-lay-item.entity";
import { DocketGenerationService } from "../docket-generation/docket-generation.service";
import { LayReportingService } from "../lay-reporting/lay-reporting.service";
import { GenericTransactionManager } from "../../database/typeorm-transactions";
import { BullQueueService } from "../bull-queue/bull-queue.service";
import { PoDocketSerialsEntity } from "../docket-generation/entity/po-docket-serials.entity";
import { PoComponentSerialsEntity } from "../docket-generation/entity/po-component-serials.entity";
import { ErrorResponse } from "@xpparel/backend-utils";
import { DocketPlanningService } from "../docket-planning/docket-planning.service";
import { PoDocketMaterialEntity } from "../docket-material/entity/po-docket-material.entity";

@Injectable()
export class CutReportingHelperService {
  constructor(
    private dataSource: DataSource,
    @Inject(forwardRef(() => DocketGenerationInfoService)) private docGenInfoService: DocketGenerationInfoService,
    @Inject(forwardRef(() => DocketGenerationService)) private docGenService: DocketGenerationService,
    @Inject(forwardRef(() => DocketMaterialInfoService)) private docMatInfoService: DocketMaterialInfoService,
    @Inject(forwardRef(() => CutTableService)) private cutTableService: CutTableService,
    @Inject(forwardRef(() => LayReportingInfoService)) private layInfoService: LayReportingInfoService,
    @Inject(forwardRef(() => LayReportingService)) private layRepService: LayReportingService,
    @Inject(forwardRef(() => BullQueueService)) private bullJobService: BullQueueService,
    @Inject(forwardRef(() => DocketPlanningService)) private docPlanningService: DocketPlanningService,
    private fabReqCreationService: FabricRequestCreationService,
    private packingListService: PackingListService,
    private etsBullService: EtsBullQueueService,
    private poMaterialService: PoMaterialService,
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

  async getDocketRecordsByPoAndItemCode(poSerial: number, itemCode: string, companyCode: string, unitCode: string): Promise<PoDocketEntity[]> {
    return await this.docGenInfoService.getDocketRecordsByPoAndItemCode(poSerial, itemCode, companyCode, unitCode);
  }

  async getDocketBundleRecordsByDocNumber(docketNumber: string, companyCode: string, unitCode: string, component?: string): Promise<PoDocketBundleEntity[]> {
    return await this.docGenInfoService.getDocketBundleRecordsByDocNumber(docketNumber, companyCode, unitCode, component);
  }

  async getDocketAttrByDocNumber(docketNumber: string, companyCode: string, unitCode: string): Promise<{ [k in DocketAttrEnum]: string }> {
    return await this.docGenInfoService.getDocketAttrByDocNumber(docketNumber, companyCode, unitCode);
  }

  // TODO
  async getDocketMaterialRequestInfoByDocNumber(docketNumber: string, requestNumber: string, companyCode: string, unitCode: string): Promise<any> {
    return {}
  }

  // TODO
  async getDocketMaterialRequestRecordByReqNumber(requestNumber: string, companyCode: string, unitCode: string): Promise<PoDocketMaterialRequestEntity> {
    return await this.docMatInfoService.getDocketMaterialRequestRecordByReqNumber(requestNumber, companyCode, unitCode);
  }

  async getPoDocketMaterialRecordsByDocNumber(docketNumber: string, companyCode: string, unitCode: string): Promise<PoDocketMaterialEntity[]> {
    return await this.docMatInfoService.getPoDocketMaterialRecordsByDocGroup([docketNumber], companyCode, unitCode);
  }

  // TODO
  async deleteFabricRequestInWh(req: WhExtReqNoRequest): Promise<boolean> {
    // TODO modify to a bull job instead of an API call
    const whReqStatus = await this.fabReqCreationService.deleteFabricWhRequest(req);
    return whReqStatus.status;
  }

  async getLayingRecordForLayId(layId: number, unitCode: string, companyCode: string): Promise<PoDocketLayEntity> {
    return await this.layInfoService.getLayingRecordForLayId(layId, unitCode, companyCode);
  }

  async getLayingRecordsForDocketGroups(docketNumbers: string[], companyCode: string, unitCode: string): Promise<PoDocketLayEntity[]> {
    return await this.layInfoService.getLayingRecordsForDocketGroups(docketNumbers, companyCode, unitCode);
  }

  async getDocBundleRecordByDocBundleSize(docketNumber: string, bundleNumber: number, size: string, companyCode: string, unitCode: string): Promise<PoDocketBundleEntity> {
    return await this.docGenInfoService.getDocBundleRecordByDocBundleSize(docketNumber, bundleNumber, size, companyCode, unitCode);
  }

  async getLayingRollRecordsForLayId(layId: number, unitCode: string, companyCode: string): Promise<PoDocketLayItemEntity[]> {
    return await this.layInfoService.getLayingRollRecordsForLayId(layId, unitCode, companyCode);
  }

  async getLayingRollRecordsForDocketGroups(docketNumbers: string[], unitCode: string, companyCode: string): Promise<PoDocketLayItemEntity[]> {
    return await this.layInfoService.getLayingRollRecordsForDocketGroups(docketNumbers, unitCode, companyCode);
  }


  async mappingAdbToPanels(docketNumber: string, components: string[], underDocLayNumber: number, bundleNumber: number, size: string, adbNumber: number, adbRollId: number, plies: number, companyCode: string, unitCode: string, manager: GenericTransactionManager): Promise<boolean> {
    return await this.docGenService.mappingAdbToPanels(docketNumber, components, underDocLayNumber, bundleNumber, size, adbNumber, adbRollId, plies, companyCode, unitCode, manager);
  }

  async unMappingAdbToPanels(docketNumber: string, underDocLayNumber: number, companyCode: string, unitCode: string, manager: GenericTransactionManager): Promise<boolean> {
    return await this.docGenService.unMappingAdbToPanels(docketNumber, underDocLayNumber, companyCode, unitCode, manager);
  }

  async getDocBundleRecordsCountByDocketNumberAndCutStatus(docketNumbers: string[], cutStatus: CutStatusEnum, companyCode: string, unitCode: string): Promise<number> {
    return await this.docGenInfoService.getDocBundleRecordsCountByDocketNumberAndCutStatus(docketNumbers, cutStatus, companyCode, unitCode);
  }

  async updateCutStatusForLayId(layId: number, docketGroup: string, cutStatus: CutStatusEnum, companyCode: string, unitCode: string, manager: GenericTransactionManager): Promise<boolean> {
    return await this.layRepService.updateCutStatusForLayId(layId, docketGroup, cutStatus, companyCode, unitCode, manager);
  }

  async updateCutStatusForDocBundlesByDocNumber(docketNumber: string, cutStatus: CutStatusEnum, companyCode: string, unitCode: string, manager: GenericTransactionManager): Promise<boolean> {
    return await this.docGenService.updateCutStatusForDocBundlesByDocNumber(docketNumber, cutStatus, companyCode, unitCode, manager);
  }

  async updateCutStatusForDocBundleByDocNumber(docketNumber: string, docBundleNumber: number, cutStatus: CutStatusEnum, companyCode: string, unitCode: string, manager: GenericTransactionManager): Promise<boolean> {
    return await this.docGenService.updateCutStatusForDocBundleByDocNumber(docketNumber, docBundleNumber, cutStatus, companyCode, unitCode, manager);
  }

  async getPoPanelSerialNumbers(poSerial: number, physicalEntityType: PhysicalEntityTypeEnum, companyCode: string, unitCode: string, transManager: GenericTransactionManager): Promise<PoComponentSerialsEntity[]> {
    return await this.docGenInfoService.getPoPanelSerialNumbers(poSerial, physicalEntityType, companyCode, unitCode, transManager);
  }

  async getPoColorSizePanelSerialNumbers(poSerial: number, physicalEntityType: PhysicalEntityTypeEnum, companyCode: string, unitCode: string, transManager: GenericTransactionManager): Promise<PoDocketSerialsEntity[]> {
    return await this.docGenInfoService.getPoColorSizePanelSerialNumbers(poSerial, physicalEntityType, companyCode, unitCode, transManager);
  }

  async updatePanelNumberForPoProdNameColorSizeComp(entityType: PhysicalEntityTypeEnum, poSerial: number, prodName: string, fgColor: string, size: string, comps: string[], lastPanelNumber: number, companyCode: string, unitCode: string, manager: GenericTransactionManager): Promise<boolean> {
    return await this.docGenService.updatePanelNumberForPoProdNameColorSizeComp(entityType, poSerial, prodName, fgColor, size, comps, lastPanelNumber, companyCode, unitCode, manager);
  }

  async updatePanelNumberForPoProdNameComp(entityType: PhysicalEntityTypeEnum, poSerial: number, prodName: string, comps: string[], lastPanelNumber: number, companyCode: string, unitCode: string, manager: GenericTransactionManager): Promise<boolean> {
    return await this.docGenService.updatePanelNumberForPoProdNameComp(entityType, poSerial, prodName, comps, lastPanelNumber, companyCode, unitCode, manager);
  }


  // BULL JOB ADDER
  async addJobForProcessingCutReportingForLay(req: CutReportRequest): Promise<boolean> {
    await this.bullJobService.addJobForProcessingCutReportingForLay(req, CPS_BULLJSJOBNAMES.CPS_LAY_CUT_REP);
    return true;
  }

  // BULL JOB ADDER
  async addJobForProcessingCutReportingForDocBundle(req: DbCutReportRequest): Promise<boolean> {
    await this.bullJobService.addJobForProcessingCutReportingForDocBundle(req, CPS_BULLJSJOBNAMES.CPS_DB_CUT_REP);
    return true;
  }

  // BULL JOB ADDER
  async addJobForProcessingCutReversingForLay(req: LayIdRequest): Promise<boolean> {
    await this.bullJobService.addJobForProcessingCutReversingForLay(req, CPS_BULLJSJOBNAMES.CPS_LAY_CUT_REV);
    return true;
  }

  // BULL JOB ADDER. This is called after cut reporting
  async addJobForProcessingPendingRollsToOnFloor(req: LayIdRequest): Promise<boolean> {
    await this.bullJobService.addJobForProcessingPendingRollsToOnFloor(req, CPS_BULLJSJOBNAMES.CPS_PEN_ROLLS_TO_ONFLOOR);
    return true;
  }

  // BULL JOB ADDER. This is called after cut reporting
  async addJobForUpdatingConsumedFabToExtSystem(req: LayIdRequest): Promise<boolean> {
    await this.bullJobService.addJobForUpdatingConsumedFabToExtSystem(req);
    return true;
  }

  // BULL JOB ADDER. This is called after cut reporting
  async addEmbRequestGenJob(poSerial: number, docketNumber: string, companyCode: string, unitCode: string, username: string): Promise<boolean> {
    const poDocReq = new PoDocketNumberRequest(username, unitCode, companyCode, 0, poSerial, docketNumber, false, false, null);
    await this.etsBullService.addEmbRequestGenJob(poDocReq);
    return true;
  }

  // directly called the WMS service and updates the consumed stock
  async updateTheConsumedStockToWms(req: StockConsumptionRequest): Promise<boolean> {
    const updatedRes = await this.packingListService.updateTheConsumedStock(req, null);
    if (!updatedRes.status) {
      throw new ErrorResponse(0, 'Error from WMS : ' + updatedRes.internalMessage);
    }
    return true;
  }

  // Helper
  // Called after reporting cut or reversing cut
  async updateTaskStatusForDocketRequest(poSerial: number, reqNo: string, companyCode: string, unitCode: string, status: TaskStatusEnum, transManager: GenericTransactionManager): Promise<boolean> {
    return await this.docPlanningService.updateTaskStatusForDocketRequest(poSerial, reqNo, companyCode, unitCode, status, transManager);
  }

  // Called after reporting cut or reversing cut
  async updateTaskStatusForDocketGroup(poSerial: number, docketNumber: string, companyCode: string, unitCode: string, status: TaskStatusEnum, transManager: GenericTransactionManager): Promise<boolean> {
    return await this.docPlanningService.updateTaskStatusForDocketGroup(poSerial, docketNumber, companyCode, unitCode, status, transManager);
  }

  async getLayingItemRecordsForLayId(layId: number, unitCode: string, companyCode: string): Promise<PoDocketLayItemEntity[]> {
    return await this.layInfoService.getLayingItemRecordsForLayId(layId, unitCode, companyCode);
  }

  async addEmbLineDelJob(reqModel: LayIdsRequest): Promise<GlobalResponseObject> {
    return await this.etsBullService.addEmbLineDelJob(reqModel);
  }

  async getRefComponentsForPoAndProduct(reqModel: PoItemRefCompProductModel): Promise<RefComponentInfoResponse> {
    return await this.poMaterialService.getRefComponentsForPoAndProduct(reqModel);
  }
}