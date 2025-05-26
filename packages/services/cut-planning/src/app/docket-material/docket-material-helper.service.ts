import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { DataSource, In } from "typeorm";
import { dataSource } from "../../database/type-orm-config/typeorm.config-migrations";
import { GenericTransactionManager } from "../../database/typeorm-transactions";
import { PoMaterialRequestRepository } from "./repository/po-material-request.repository";
import { PoRatioAttrRepository } from "../common/repository/po-ratio-attr.repository";
import { PoDocketMaterialRepository } from "./repository/po-docket-material.repository";
import { PoDocketMaterialRequestRepository } from "./repository/po-docket-material-request.repository";
import { RollAttrRepository } from "../common/repository/roll-attr.repository";
import { LocationAllocationService, POService, PackingListService, PoMarkerService, TrayTrolleyService } from "@xpparel/shared-services";
import { CommonResponse, DocketAttrEnum, GlobalResponseObject, ItemCodeCronPatternRequest, MarkerIdRequest, MarkerInfoModel, MaterialRequestNoRequest, PalletAndBinResponse, PoSerialRequest, PoSummaryModel, PoSummaryResponse, RollBasicInfoModel, RollBasicInfoResponse, RollIdConsumedQtyRequest, RollIdQtyRequest, RollIdsConsumptionRequest, RollIdsRequest, StockCodesRequest, StockObjectInfoModel, StockObjectInfoResponse, StockRollInfoModel, StockRollInfoResponse, TrayAndTrolleyResponse } from "@xpparel/shared-models";
import { ErrorResponse } from "@xpparel/backend-utils";
import { BullQueueService } from "../bull-queue/bull-queue.service";
import { PoDocketCutTableEntity } from "../docket-planning/entity/po-docket-cut-table.entity";
import { DocketPlanningInfoService } from "../docket-planning/docket-planning-info.service";
import { DocketPlanningService } from "../docket-planning/docket-planning.service";
import { LayReportingInfoService } from "../lay-reporting/lay-reporting-info.service";
import { PoDocketLayItemEntity } from "../lay-reporting/entity/po-docket-lay-item.entity";
import { PoDocketLayEntity } from "../lay-reporting/entity/po-docket-lay.entity";
import { DocketGenerationInfoService } from "../docket-generation/docket-generation-info.service";
import { CutGenerationInfoService } from "../cut-generation/cut-generation-info.service";
import { PoCutDocketEntity } from "../cut-generation/entity/po-cut-docket.entity";
import { MrnInfoService } from "../mrn/mrn-info.service";
import { MrnEntity } from "../mrn/entity/mrn.entity";

@Injectable()
export class DocketMaterialHelperService {
  constructor(
    private dataSource: DataSource,
    private poMaterialReqRepo: PoMaterialRequestRepository,
    private poDocMaterialReqRepo: PoDocketMaterialRequestRepository,
    private poDocMaterialRepo: PoDocketMaterialRepository,
    private rollAttrRepo: RollAttrRepository,
    private packingListService: PackingListService,
    private trayTrolleyService: TrayTrolleyService,
    private locationAllocationService: LocationAllocationService,
    private bullQueueService: BullQueueService,
    private poMarkerService: PoMarkerService,
    @Inject((forwardRef(() => DocketPlanningInfoService))) private docPlanInfoService: DocketPlanningInfoService,
    @Inject((forwardRef(() => DocketPlanningService))) private docPlanService: DocketPlanningService,
    @Inject((forwardRef(() => LayReportingInfoService))) private layRepInfoService: LayReportingInfoService,
    @Inject((forwardRef(() => DocketGenerationInfoService))) private docInfoService: DocketGenerationInfoService,
    @Inject(forwardRef(() => CutGenerationInfoService)) private cutInfoService: CutGenerationInfoService,
    @Inject(forwardRef(() => MrnInfoService)) private mrnInfoService: MrnInfoService,
    private poService: POService,
  ) {

  }

  /**
   * Service to get in stock rolls for the given item code 
   * @param reqModel 
   * @returns 
  */
  async getInStockRollsForItemCode(reqModel: StockCodesRequest): Promise<StockObjectInfoModel[]> {
    const stockRollInfo: StockObjectInfoResponse = await this.packingListService.getInStockObjectsForItemCode(reqModel);
    if (!stockRollInfo.status) {
      throw new ErrorResponse(stockRollInfo.errorCode, stockRollInfo.internalMessage);
    }
    if (stockRollInfo.data.length == 0) {
      throw new ErrorResponse(0, 'Rolls not found in the In stock for the given materials.Please try again');
    }
    return stockRollInfo.data;
  }

  /**
   * Helper service to add schedule job for material to un lock
   * @param reqObj 
   * @returns 
  */
  async addScheduledJobForMaterialUnLock(reqObj: ItemCodeCronPatternRequest): Promise<GlobalResponseObject> {
    return await this.bullQueueService.addScheduledJobForMaterialUnLock(reqObj);
  }

  /**
   * Service to get rolls basic info for roll Ids
   * @param reqModel 
   * @returns 
  */
  async getRollsBasicInfoForRollIds(reqModel: RollIdsRequest): Promise<RollBasicInfoModel[]> {
    const rollInfo = await this.packingListService.getRollsBasicInfoForRollIds(reqModel);
    if (!rollInfo.status) {
      throw new ErrorResponse(rollInfo.errorCode, rollInfo.internalMessage);
    }
    if (rollInfo.data.length == 0) {
      throw new ErrorResponse(0, 'Rolls not found in the In stock for the given materials.Please try again');
    }
    return rollInfo.data;
  }


  async getDocketRequestPlanRecord(reqNo: string, docketGroup: string, companyCode: string, unitCode: string): Promise<PoDocketCutTableEntity> {
    return await this.docPlanInfoService.getDocketRequestPlanRecord(reqNo, docketGroup, companyCode, unitCode);
  }


  async createCutRequestPlanToOpenCutTable(reqNo: string, docketGroup: string, companyCode: string, unitCode: string, username: string): Promise<GlobalResponseObject> {
    const matReqNoReq = new MaterialRequestNoRequest(username, unitCode, companyCode, 0, reqNo, [], docketGroup);
    return await this.docPlanService.saveDocketsToDocPlan(matReqNoReq);
  }

  async deleteDocketsFromDocPlan(reqNo: string, docketGroup: string, companyCode: string, unitCode: string, username: string, manager?: GenericTransactionManager): Promise<GlobalResponseObject> {
    const matReqNoReq = new MaterialRequestNoRequest(username, unitCode, companyCode, 0, reqNo, [], docketGroup);
    if (manager) {
      return await this.docPlanService.deleteDocketsFromDocPlan(matReqNoReq, manager);
    } else {
      return await this.docPlanService.deleteDocketsFromDocPlan(matReqNoReq);
    }
  }

  async getLayingRollRecordsForLayId(layId: number, unitCode: string, companyCode: string): Promise<PoDocketLayItemEntity[]> {
    return await this.layRepInfoService.getLayingRollRecordsForLayId(layId, unitCode, companyCode);
  }

  async getLayingRecordsForDocketGroups(docketGroups: string[], companyCode: string, unitCode: string): Promise<PoDocketLayEntity[]> {
    return await this.layRepInfoService.getLayingRecordsForDocketGroups(docketGroups, companyCode, unitCode);
  }

  async getLayingRecordForLayId(layId: number, companyCode: string, unitCode: string): Promise<PoDocketLayEntity> {
    return await this.layRepInfoService.getLayingRecordForLayId(layId, unitCode, companyCode);
  }

  async getDocketAttrByDocNumber(docketNumber: string, companyCode: string, unitCode: string): Promise<{ [k in DocketAttrEnum]: string }> {
    return await this.docInfoService.getDocketAttrByDocNumber(docketNumber, companyCode, unitCode);
  }

  async getCutDocketRecordsForDocket(docketNumber: string, companyCode: string, unitCode: string): Promise<PoCutDocketEntity[]> {
    return await this.cutInfoService.getCutDocketRecordsForDocket(docketNumber, companyCode, unitCode);
  }

  async getPoBasicInfoByPoSerial(reqModel: PoSerialRequest): Promise<PoSummaryModel> {
    const poInfoResp = await this.poService.getPoBasicInfoByPoSerial(reqModel);
    if (!poInfoResp.status) {
      throw new ErrorResponse(poInfoResp.errorCode, poInfoResp.internalMessage);
    }
    return poInfoResp.data[0];
  }

  async getMrnRequestRecordForMrnId(mrnId: number, companyCode: string, unitCode: string): Promise<MrnEntity> {
    return await this.mrnInfoService.getMrnRequestRecordForMrnId(mrnId, companyCode, unitCode);
  }

  async updateTheAllocatedStock(req: RollIdConsumedQtyRequest): Promise<GlobalResponseObject> {
    return await this.packingListService.updateTheAllocatedStock(req);
  }

  async updateTheIssuedStock(req: RollIdConsumedQtyRequest): Promise<GlobalResponseObject> {
    return await this.packingListService.updateTheIssuedStock(req);
  }

  async addJobForUpdatingAllocFabToExtSystem(req: RollIdsConsumptionRequest): Promise<GlobalResponseObject> {
    return await this.bullQueueService.addJobForUpdatingAllocFabToExtSystem(req);
  }


  async addJobForUpdatingIssuedFabToExtSystem(req: RollIdsConsumptionRequest): Promise<GlobalResponseObject> {
    return await this.bullQueueService.addJobForUpdatingIssuedFabToExtSystem(req);
  }

  async getPalletAndBinbyRollIdData(reqModel: RollIdsRequest): Promise<PalletAndBinResponse> {
    return await this.locationAllocationService.getPalletAndBinbyRollIdData(reqModel);
  }

  async getTrayAndTrolleyInfoForRollIdData(reqModel: RollIdsRequest): Promise<TrayAndTrolleyResponse> {
    return await this.trayTrolleyService.getTrayAndTrolleyInfoForRollIdData(reqModel);
  }

  async getMeasuredWidthForAllocation(reqModel: RollIdsRequest): Promise<CommonResponse> {
    return await this.packingListService.getMeasuredWidthForAllocation(reqModel);
  }

  async getPoMarker(reqModel: MarkerIdRequest): Promise<MarkerInfoModel> {
    const markerInfo = await this.poMarkerService.getPoMarker(reqModel);
    if (!markerInfo.status || !markerInfo?.data?.length) {
      throw new ErrorResponse(markerInfo.errorCode, markerInfo.internalMessage);
    }
    return markerInfo.data[0];
  }
}