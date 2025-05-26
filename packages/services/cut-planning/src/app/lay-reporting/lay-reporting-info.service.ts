import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { ErrorResponse } from "@xpparel/backend-utils";
import { ActualDocketBasicInfoModel, AdBundleModel, AdResponse, DocketGroupResponseModel, DocketLayModel, DocketLaysResponse, EndBitsResponse, LayDowntimeModel, LayerMeterageRequest, LayIdsRequest, LayingStatusEnum, LayReportingCuttingModel, LayReportingCuttingResponse, LayRollInfoAttrsModel, LayRollInfoModel, ManufacturingOrderNumberRequest, PoDocketGroupRequest, PoSerialRequest, PoSummaryModel, RollIdsRequest } from "@xpparel/shared-models";
import { OrderManipulationServices } from "@xpparel/shared-services";
import { DataSource, In } from "typeorm";
import { CutGenerationInfoService } from "../cut-generation/cut-generation-info.service";
import { DocketMaterialInfoService } from "../docket-material/docket-material-info.service";
import { DocketPlanningInfoService } from "../docket-planning/docket-planning-info.service";
import { MrnInfoService } from "../mrn/mrn-info.service";
import { PoDocketLayItemEntity } from "./entity/po-docket-lay-item.entity";
import { PoDocketLayEntity } from "./entity/po-docket-lay.entity";
import { LayReportingHelperService } from "./lay-reporting-helper.service";
import { PoDocketLayBundlePrintRepository } from "./repository/po-docket-lay-bundle-print.repository";
import { PoDocketLayDowntimeRepository } from "./repository/po-docket-lay-downtime.repository";
import { PoDocketLayItemRepository } from "./repository/po-docket-lay-item.repository";
import { PoDocketLayRepository } from "./repository/po-docket-lay.repository";
import { DocketCutPliesQueryResponse } from "./repository/query-response/docket-cut-plies.query.reponse";
import { DocketLayPliesQueryResponse } from "./repository/query-response/docket-lay-plies.query.reponse";
@Injectable()
export class LayReportingInfoService {
  constructor(
    private dataSource: DataSource,
    @Inject(LayReportingHelperService) private layRepHelperService: LayReportingHelperService,
    private poDocketLayRepo: PoDocketLayRepository,
    private poDocketLayItemRepo: PoDocketLayItemRepository,
    private downTimeRepo: PoDocketLayDowntimeRepository,
    private bundlePrintRepo: PoDocketLayBundlePrintRepository,
    private orderInfoService: OrderManipulationServices,
    @Inject(forwardRef(() => DocketMaterialInfoService)) private docketMaterialInfoService: DocketMaterialInfoService,
    // private cutGenerationInfoService: CutGenerationInfoService,
    private docketPlanningInfoService: DocketPlanningInfoService,    private mrnInfoService: MrnInfoService
  ) {

  }

  // CORRECT
  async getLayInfoForDocketGroup(req: PoDocketGroupRequest): Promise<DocketLaysResponse> {
    const { unitCode, companyCode } = req;
    const layInfo: PoDocketLayEntity[] = await this.poDocketLayRepo.find({ where: { docketGroup: req.docketGroup, unitCode, companyCode } });
    if (layInfo.length == 0) {
      if (req.doNoThrowErrorIfSomethingIsMissing) {
        return new DocketLaysResponse(true, 0, 'Lay info retrieved successfully docket', []);
      }
      throw new ErrorResponse(0, 'No laying is reported for the docket');
    }
    const docketLayInfoModel: DocketLayModel[] = await this.getDocketLayModels(req.docketGroup, req.companyCode, req.unitCode, req.iNeedAllocatedRollsAlso);
    return new DocketLaysResponse(true, 0, 'Lay info retrieved successfully docket', docketLayInfoModel);
  }

  // HELPER
  async getDocketLayModels(docketGroup: string, companyCode: string, unitCode: string, iNeedAllocatedRollsAlso: boolean): Promise<DocketLayModel[]> {
    const layInfo: PoDocketLayEntity[] = await this.poDocketLayRepo.find({ where: { docketGroup: docketGroup, unitCode, companyCode } });
    const docketLayInfoModels: DocketLayModel[] = [];
    for (const lay of layInfo) {
      const layDetails = await this.poDocketLayItemRepo.find({ where: { poDocketLayId: lay.id, unitCode, companyCode } });
      const rollIds = new Set([...layDetails.map(mat => mat.rollId)]);
      const alreadyLayedPlies = layDetails.reduce((accumulator, currentValue) => accumulator + currentValue.layedPlies, 0);
      const downTimeDetails = await this.downTimeRepo.find({ where: { poDocketLayId: lay.id, unitCode, companyCode } });
      const downTimeModel = downTimeDetails.map((downTime) => {
        return new LayDowntimeModel(lay.id, downTime.id, downTime.downtimeStartDateTime, downTime.downtimeEndDateTime, downTime.reasonId, downTime.reasonDesc, downTime.downtimeCompleted, downTime.downTimeMins);
      });
      let layRollInfo: LayRollInfoModel[] = [];
      if (iNeedAllocatedRollsAlso) {
        const rollIdsReq = new RollIdsRequest(null, unitCode, companyCode, 0, [...rollIds]);
        const rollBasicInfo = await this.layRepHelperService.getRollsBasicInfoForRollIds(rollIdsReq);
        if (!rollBasicInfo.status) {
          throw new ErrorResponse(rollBasicInfo.errorCode, rollBasicInfo.internalMessage);
        }
        layRollInfo = layDetails.map((layItem) => {
          const basicInfo = rollBasicInfo.data.find(info => info.rollId == layItem.rollId);
          const layRollAttr = new LayRollInfoAttrsModel(layItem.endBits, layItem.damage, layItem.shortage, layItem.remarks, layItem.layStartDateTime, layItem.layCompletedDateTime, null, layItem.sequence, layItem.jointsOverlapping, layItem.noOfJoints, layItem.remnantsOfOtherLay, layItem.halfPlieOfPreRoll, layItem.fabricDefects, layItem.usableRemains, layItem.unUsableRemains);
          return new LayRollInfoModel(layItem.rollId, layItem.rollBarcode, basicInfo, basicInfo.itemCode, basicInfo.itemDesc, layItem.layedPlies, layRollAttr);
        })
      }
      const docketLayInfo = new DocketLayModel(lay.id, lay.docketGroup, lay.requestNumber, lay.layStartDateTime, lay.layCompletedDateTime, lay.layingStatus, lay.cutStatus, alreadyLayedPlies, lay.layInspectedPerson, downTimeModel, layRollInfo);
      docketLayInfoModels.push(docketLayInfo);
    }
    return docketLayInfoModels;
  }

  async getLayingRecordForLayId(layId: number, unitCode: string, companyCode: string): Promise<PoDocketLayEntity> {
    return await this.poDocketLayRepo.findOne({ where: { id: layId, companyCode: companyCode, unitCode: unitCode } });
  }

  async getLayingRecordsForLayIds(layIds: number[], unitCode: string, companyCode: string): Promise<PoDocketLayEntity[]> {
    return await this.poDocketLayRepo.find({ where: { id: In(layIds), companyCode: companyCode, unitCode: unitCode } });
  }

  async getLayingRecordsForDocketGroups(docketGroups: string[], companyCode: string, unitCode: string): Promise<PoDocketLayEntity[]> {
    return await this.poDocketLayRepo.find({ where: { docketGroup: In(docketGroups), companyCode: companyCode, unitCode: unitCode, isActive: true }, order: { createdAt: 'ASC' } });
  }

  async getLayingRollRecordsForDocketGroups(docketGroups: string[], unitCode: string, companyCode: string): Promise<PoDocketLayItemEntity[]> {
    return await this.poDocketLayItemRepo.find({ where: { docketGroup: In(docketGroups), companyCode: companyCode, unitCode: unitCode } });
  }

  async getLayingRollRecordsForLayId(layId: number, unitCode: string, companyCode: string): Promise<PoDocketLayItemEntity[]> {
    return await this.poDocketLayItemRepo.find({ where: { poDocketLayId: layId, companyCode: companyCode, unitCode: unitCode } });
  }

  async getLayingRollRecordsForLayIds(layIds: number[], unitCode: string, companyCode: string): Promise<PoDocketLayItemEntity[]> {
    return await this.poDocketLayItemRepo.find({ where: { poDocketLayId: In(layIds), companyCode: companyCode, unitCode: unitCode } });
  }

  // HELPER: Used by the docket material planning to get the total consumed qty of a roll
  async getLayingRollRecordsForRollId(rollIds: number[], unitCode: string, companyCode: string): Promise<PoDocketLayItemEntity[]> {
    return await this.poDocketLayItemRepo.find({ where: { rollId: In(rollIds), companyCode: companyCode, unitCode: unitCode } });
  }


  /**
   * STRICT NOTE: For getting the bundles info, the DOCKET number is mandatory to be passed in the request
   * gets the actual docket info along with sizes and bundles if mentioned in the request
   * @param req 
   * @returns 
   */
  async getActualDocketInfo(req: LayIdsRequest, iNeedCutAndDipatchNumbers: boolean): Promise<AdResponse> {
    /**
     * STRICT NOTE: You must retrieve and send the sizeRatios only if req.iNeedAdSizes  = ture
     *              You must retrieve and send the adBundles  only if req.iNeedAdBundles = ture
     * 
     * iterate every lay id and contruct the response object
     * for mo lines and so details, make an API call to the OES using the PO serial, function-name: getPoSummary with PoSerialRequest (iNeedSubLines: true, iNeedOqPercentages: false)
     * get the docket info if any required from docket-info.service
     * get the adb shade wise bundles from the cut-reporting-info.service
     * get the cut number from the cut-generation-info.service
     */
    const { unitCode, companyCode, docketNumber } = req;
    if (!docketNumber) {
      throw new ErrorResponse(0, 'Docket number is not provided in the request');
    }
    const actualDocInfo: ActualDocketBasicInfoModel[] = [];
    for (const eachLay of req.layIds) {
      const layRecord = await this.poDocketLayRepo.findOne({ where: { id: eachLay, unitCode, companyCode } });
      if (!layRecord) {
        throw new ErrorResponse(0, 'Lay does not exists Please check and try again');
      }
      const poSerialReq = new PoSerialRequest(null, unitCode, companyCode, null, layRecord.poSerial, null, false, false);
      const poSummary = await this.layRepHelperService.getPoSummary(poSerialReq);
      if (!poSummary.status) {
        throw new ErrorResponse(poSummary.errorCode, poSummary.internalMessage);
      }
      const poDetails: PoSummaryModel = poSummary.data[0];
      /**
       * get Order Information of the sale Order
       */
      const moRequestObj = new ManufacturingOrderNumberRequest(req.username, unitCode, companyCode, req.userId, [poDetails.orderRefNo]);
      const orderAndOrderLineData = await this.orderInfoService.getOrderAndOrderLineInfo(moRequestObj);
      const plantRefStyle = orderAndOrderLineData.data[0].plantStyle;
      const gamrmentPo = orderAndOrderLineData.data[0].garmentVendorPo;
      const gamrmentPoItem = orderAndOrderLineData.data[0].garmentVendorPoItem;
      const layInfo = await this.poDocketLayRepo.findOne({ where: { id: eachLay, unitCode, companyCode } });
      const layItemInfo = await this.poDocketLayItemRepo.find({ where: { poDocketLayId: layInfo.id, unitCode, companyCode } });
      const layPlies = layItemInfo.reduce((pre, currentValue) => {
        return pre + currentValue.layedPlies;
      }, 0);
      const docketRecord = await this.layRepHelperService.getDocketRecordByDocNumber(docketNumber, companyCode, unitCode);
      if (!docketRecord) {
        throw new ErrorResponse(0, 'Docket does not exists Please check and try again');
      }
      const adbShadeCount = await this.layRepHelperService.getAdbShadeCountForLayId(layInfo.id, unitCode, companyCode);
      const sizeRatios = req.iNeedAdSizes ? await this.layRepHelperService.getSizeRatiosByDocketNumber(docketNumber, companyCode, unitCode) : [];
      const docketAttrs = await this.layRepHelperService.getDocketAttrByDocNumber(docketNumber, companyCode, unitCode);
      const components = docketAttrs.COMPS.split(',');
      // TODO: replace the cut dispatch request number
      const adbInfo: AdBundleModel[] = req.iNeedAdBundles ? await this.layRepHelperService.getAdbInfoByLayId(eachLay, unitCode, companyCode, components[0], docketNumber) : [];
      let drCreated = false;
      let cutNumber = 0;
      let cutSubNumber = 0;
      let drReqNo = '';
      if (iNeedCutAndDipatchNumbers) {
        const cutNumbers = await this.layRepHelperService.getCutDocketRecordsForDocket(docketNumber, companyCode, unitCode);
        cutNumber = cutNumbers[0] ? cutNumbers[0].cutNumber : 0;
        cutSubNumber = cutNumbers[0] ? cutNumbers[0].cutSubNumber : 0;
        const cutDrRecord = await this.layRepHelperService.getCutDrRequestHeaderRecordForPoSerialCutNumber(layInfo.poSerial, cutNumber, companyCode, unitCode);
        drCreated = cutDrRecord ? true : false;
        drReqNo = cutDrRecord ? cutDrRecord.requestNumber : '';
      }
      // get the print status based on the docket and the lay
      const printHistRec = await this.bundlePrintRepo.findOne({ where: { poDocketLayId: eachLay, docketNumber: docketRecord.docketNumber }, order: { 'createdAt': 'desc' } });
      const printStatus = printHistRec ? printHistRec.action : false;
      const actualDocketBasicInfo = new ActualDocketBasicInfoModel(layInfo.id, layInfo.poSerial, docketNumber, layInfo.docketGroup, docketRecord.itemCode, docketRecord.itemCode, docketRecord.plies, layPlies, docketRecord.productName, docketRecord.productType, cutNumber, cutSubNumber, layInfo.id, layInfo.underPolayNumber, adbShadeCount, layInfo.layingStatus, layInfo.cutStatus, printStatus, poDetails.orderRefNo, poDetails.moLines, components, sizeRatios, adbInfo, docketRecord.mainDocket, docketRecord.color, docketRecord.plies, drCreated, drReqNo, plantRefStyle, gamrmentPo, gamrmentPoItem);
      actualDocInfo.push(actualDocketBasicInfo);
    }
    return new AdResponse(true, 0, 'Actual docket bundle info retrieved successfully', actualDocInfo);
  }

  async getInprogressLaysForDocketGroup(req: PoDocketGroupRequest): Promise<PoDocketLayEntity> {
    return await this.poDocketLayRepo.findOne({ where: { docketGroup: req.docketGroup, unitCode: req.unitCode, companyCode: req.companyCode, layingStatus: In([LayingStatusEnum.INPROGRESS, LayingStatusEnum.HOLD,LayingStatusEnum.COMPLETED]) } });
  }

  async getCutReportedPliesPerDocketOfGivenDocketGroups(docketGroups: string[], companyCode: string, unitCode: string): Promise<DocketCutPliesQueryResponse[]> {
    return await this.poDocketLayRepo.getCutReportedPliesPerDocketOfGivenDocketGroups(docketGroups, companyCode, unitCode);
  }

  async getLayReportedPliesPerDocketOfGivenDocketGroups(docketGroups: string[], companyCode: string, unitCode: string): Promise<DocketLayPliesQueryResponse[]> {
    return await this.poDocketLayRepo.getLayReportedPliesPerDocketOfGivenDocketGroups(docketGroups, companyCode, unitCode);
  }

  async getLayingItemRecordsForLayId(layId: number, unitCode: string, companyCode: string): Promise<PoDocketLayItemEntity[]> {
    return await this.poDocketLayItemRepo.find({ where: { poDocketLayId: layId, companyCode: companyCode, unitCode: unitCode } });
  }

  async getTotalLayedMeterageToday(req: LayerMeterageRequest): Promise<any> {
    // Fetch data from the repository
    const requestData = await this.poDocketLayRepo.getTotalLayedMeterageTodayRepo(req.unitCode, req.companyCode, req.date);
    if (!requestData || requestData.length === 0) {
      return [];
    }
    // const requestNumbers: string[] = requestData.map(eachRequest => eachRequest.reqNumber);
    return requestData;

    // Uncomment and use these lines if you need to transform the result further
    // const dataModel = requestData.map(requestNumber => new LayedMeterageModel(requestNumber));
    // return new LayMeterageResponse(true, 1234, "Total layed meterage data successfully", dataModel);
  }



  async getTotalEndBitsToday(req: LayerMeterageRequest): Promise<EndBitsResponse> {
    const data = await this.poDocketLayItemRepo.getTotalEndBitsRepo(req.unitCode, req.companyCode, req.date)
    return new EndBitsResponse(true, 675, "End bits data retrieved", data)
  }



  async getKPICardDetailsForCutting(req: LayerMeterageRequest): Promise<LayReportingCuttingResponse> {
    try {
      const totalLayedMeterageToday = await this.docketMaterialInfoService.getTotalLayedMeterage(req);
      // console.log(totalLayedMeterageToday);
      // const totalLayedCutsToday = await this.cutGenerationInfoService.getTotalLayedCutsToday(req);
      /**Get PlannedCuts */
      const reqObj = new DocketGroupResponseModel(req.unitCode, req.companyCode, '', 1, req.date)
      const totalPlannedDockets = await this.docketPlanningInfoService.getTotalDocketsPlannedToday(reqObj);
      // console.log(totalPlannedDockets);
      // const totalLayedCutsToday = await this.cutGenerationInfoService.getTotalLayedCutsToday(req);
      
      const totalEndBits = await this.getTotalEndBitsToday(req);
      const totalAMRN = await this.mrnInfoService.getTotalRequestedQuantityToday(req);
      const totalEndBitsToday = totalEndBits.data.totalEndBits ? totalEndBits.data.totalEndBits : 0
      const totalMrnRequestedToday = totalAMRN.data.totalRequestedQuantityToday ? totalAMRN.data.totalRequestedQuantityToday : 0
      const totalMrnRequestsToday = totalAMRN.data.totalRequestedRequest ? totalAMRN.data.totalRequestedRequest : 0


      const confirmList = new LayReportingCuttingModel(Number(totalLayedMeterageToday.data.totalQuantity ? totalLayedMeterageToday.data.totalQuantity : 0), Number(totalLayedMeterageToday.data.totalCuts ? totalLayedMeterageToday.data.totalCuts : 0), Number(totalPlannedDockets.data.totalPlannedQty ? totalPlannedDockets.data.totalPlannedQty : 0), Number(totalPlannedDockets.data.totalPlannedCuts ? totalPlannedDockets.data.totalPlannedCuts : 0), totalEndBitsToday, totalMrnRequestedToday);
      return new LayReportingCuttingResponse(true, 0, 'Cutting  List Retrieved Successfully', confirmList);
    } catch (err) {
      throw err;
    }
  }

}