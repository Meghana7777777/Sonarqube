import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { ErrorResponse } from "@xpparel/backend-utils";
import { ActualMarkerModel, CommonRequestAttrs, DocMaterialAllocationModel, DocMaterialAllocationResponse, DocRollsModel, DocketAttrEnum, DocketGroupResponseModel, FabUtilizationModel, ItemCodeCronPatternRequest, LayerMeterageRequest, LockedFabMaterialModel, LockedFabMaterialResponse, MarkerIdRequest, MaterialLockEnum, MaterialRequestNoRequest, PhItemCategoryEnum, PoDocketGroupRequest, PoSerialRequest, PoSummaryModel, RequestTypeEnum, RollBasicInfoModel, RollIdsRequest, RollLocationEnum, RollLocationRequest, RollReceivingConfirmationStatusEnum, StockCodesRequest, StockObjectInfoModel, StockObjectInfoResponse, StockRollInfoModel, StockRollInfoResponse, TodayLayAndCutResponse, TodayLayedCutAndMeterage, WhMatReqLineItemStatusEnum, WhReqByObjectEnum, WhReqCreateHeaderModel, WhReqCreateHeaderResponse, WhReqCreateItemsListModel, WhReqCreateLineModel } from "@xpparel/shared-models";
import moment from "moment";
import { DataSource, In, Not } from "typeorm";
import { dynamicRedlock } from "../../config/redis/redlock.config";
import { RollAttrRepository } from "../common/repository/roll-attr.repository";
import { PoCutDocketEntity } from "../cut-generation/entity/po-cut-docket.entity";
import { DocketGenerationInfoService } from "../docket-generation/docket-generation-info.service";
import { LayReportingInfoService } from "../lay-reporting/lay-reporting-info.service";
import { DocketMaterialHelperService } from "./docket-material-helper.service";
import { DocketMaterialService } from "./docket-material.service";
import { OnFloorRollsEntity } from "./entity/on-floor-rolls.entity";
import { PoDocketMaterialRequestEntity } from "./entity/po-docket-material-request.entity";
import { PoDocketMaterialEntity } from "./entity/po-docket-material.entity";
import { ActualMarkerRepository } from "./repository/actual-marker.repository";
import { OnFloorRollsRepository } from "./repository/on-floor-rolls.repository";
import { PoDocketMaterialRequestRepository } from "./repository/po-docket-material-request.repository";
import { PoDocketMaterialRepository } from "./repository/po-docket-material.repository";
import { PoMaterialLockRepository } from "./repository/po-material-lock.repository";
import { PoMaterialRequestRepository } from "./repository/po-material-request.repository";

@Injectable()
export class DocketMaterialInfoService {
  private lockMinutes = 9;
  constructor(
    private dataSource: DataSource,
    private poMaterialReqRepo: PoMaterialRequestRepository,
    private poDocMaterialReqRepo: PoDocketMaterialRequestRepository,
    private poDocMaterialRepo: PoDocketMaterialRepository,
    private rollAttrRepo: RollAttrRepository,
    @Inject(forwardRef(() => DocketMaterialHelperService)) private helperService: DocketMaterialHelperService,
    private materialLockRepo: PoMaterialLockRepository,
    @Inject(forwardRef(() => DocketMaterialService)) private docketMaterialService: DocketMaterialService,
    private onFloorRollsRepo: OnFloorRollsRepository,
    @Inject(forwardRef(() => DocketGenerationInfoService)) private docketInfoService: DocketGenerationInfoService,
    private actualMarkerRepo: ActualMarkerRepository,
    @Inject(forwardRef(() => LayReportingInfoService)) private layReportingInfoService: LayReportingInfoService,
  ) {

  }

  /**
   * Service to get available rolls for a item Code 
   * @param reqObj 
   * @returns 
  */
  async getAvailableRollsForItemCode(reqObj: StockCodesRequest): Promise<StockObjectInfoResponse> {
    const { unitCode, companyCode } = reqObj;
    let checkFlag = false;
    let savedLock = null;
    let lockAlreadyReleased = false;
    let lock = null;
    // Need to check the material is in lock state or not
    try {
      const lockPoMaterial = `${reqObj.itemCode}-${reqObj.unitCode}`;
      const ttl = 120000;
      lock = await dynamicRedlock.lock(lockPoMaterial, ttl).catch(error => {
        throw new ErrorResponse(0, 'Someone already doing allocation for the same materia. Please try again');
      });
      const lockInfo = await this.materialLockRepo.findOne({ where: { itemCode: reqObj.itemCode, isActive: true, lockStatus: MaterialLockEnum.LOCK } });
      if (lockInfo) {
        throw new ErrorResponse(0, 'Some one already doing allocation for the same material. Please check and try again');
      }
      // Need to lock the material by inserting a row into material loc entity
      const currentLockInfo = await this.docketMaterialService.savePoMaterialLock(reqObj.itemCode, unitCode, companyCode, reqObj.username);
      await lock.unlock();
      lockAlreadyReleased = true;
      savedLock = currentLockInfo.id;
      checkFlag = true;
      const inStockRolls: StockObjectInfoModel[] = await this.helperService.getInStockRollsForItemCode(reqObj);
      const rollIds = inStockRolls.map((roll) => roll.objectId);
      const rollRequest = new RollIdsRequest(null, unitCode, companyCode, 0, rollIds);
      // Fetch data in bulk for all rolls
      const [palletAndBinInfo, trayAndTrolleyInfo, relaxedData] = await Promise.all([
        this.helperService.getPalletAndBinbyRollIdData(rollRequest),
        this.helperService.getTrayAndTrolleyInfoForRollIdData(rollRequest),
        // this.helperService.getMeasuredWidthForAllocation(rollRequest),
        null
      ]);

      // Map the data by rollId for faster lookup
      const palletAndBinMap = new Map(palletAndBinInfo?.data?.map(info => [info.rollId, info]));
      const trayAndTrolleyMap = new Map(trayAndTrolleyInfo?.data?.map(info => [info.rollId, info]));
      const measuredWidths = relaxedData?.data?.map((item) => item.width).join(" | ");
      // Need to get the rolls from IN Stock and calculate the available quantity. 
      const actualRolls = [];
      for (const eachRoll of inStockRolls) {
        // checking Roll is in lock state or not. If Roll is in lock state we need to skip that roll other wise we can allot this roll 
        /*Disabling Lock status of each roll due to partial allocation 20240515 */
        // const poMaterialInfo = await this.poDocMaterialRepo.findOne({ select: ['id'], where: { itemCode: reqObj.itemCode, rollId: eachRoll.rollId, unitCode, companyCode, rollLockStatus: RollLockEnum.LOCK } });
        // if (poMaterialInfo) {
        //   continue;
        // }
        // Need to check the roll is existing in the on floor or not. If yet need to get the consumed quantity and subtract it from the rolls original quantity and give it for the allocation   
        const onFloorInfo: PoDocketMaterialEntity[] = await this.poDocMaterialRepo.find({ select: ['rollId', 'requestedQuantity'], where: { rollId: eachRoll.objectId, rollBarcode: eachRoll.barcode } });
        const palletInfo = palletAndBinMap.get(eachRoll.objectId) || { palletCode: '', binCode: '' };
        const trayInfo = trayAndTrolleyMap.get(eachRoll.objectId) || { trayCode: '', trollyCode: '' };
        eachRoll.palletCode = palletInfo.palletCode;
        eachRoll.trayCode = trayInfo.trayCode;
        eachRoll.trolleyCode = trayInfo.trollyCode;
        eachRoll.measuredWidth = measuredWidths;
        let consumedQty = 0;
        for (const onFloorRoll of onFloorInfo) {
          consumedQty += Number(onFloorRoll.requestedQuantity);
        }
        let balanceQty;
        // const totalissuedQuantity= (Number(rollInfo.issuedQuantity) + Number(req.issuedQty)).toFixed(2); 
        balanceQty = (Number(eachRoll.originalQty) - Number(eachRoll.returnQuntity ?? 0) - Number(eachRoll.manualIssuedQty ?? 0) - Number(consumedQty)).toFixed(2);
        if (Number(balanceQty)) {
          eachRoll.issuedQuantity = consumedQty;
          eachRoll.leftOverQuantity = balanceQty;
          actualRolls.push(eachRoll);
        }
      }
      const jobId = `${unitCode}-${reqObj.itemCode}`;
      const jobReq = new ItemCodeCronPatternRequest(reqObj.username, unitCode, companyCode, reqObj.userId, reqObj.itemCode, jobId, this.lockMinutes * 60 * 1000, currentLockInfo.id);
      await this.helperService.addScheduledJobForMaterialUnLock(jobReq);
      return new StockObjectInfoResponse(true, 0, 'Available Rolls Information Retrieved successfully', actualRolls);
    } catch (err) {
      console.log(err);
      (lock && !lockAlreadyReleased) ? await lock.unlock() : null;
      checkFlag ? await this.docketMaterialService.unlockMaterial(reqObj.itemCode, unitCode, companyCode, reqObj.username, savedLock) : null;
      throw err;
    }

  }

  async getMarkerLengthForDocGroup(docGroup: string, companyCode: string, unitCode: string): Promise<number> {
    let markerLength = 0;
    const docketRec = await this.docketInfoService.getDocketRecordsByDocGroup(docGroup, companyCode, unitCode);
    const actualMarkerInfo = await this.actualMarkerRepo.findOne({ where: { companyCode: companyCode, unitCode: unitCode, docketGroup: docGroup, isActive: true}});
    if(actualMarkerInfo) {
      markerLength = Number(actualMarkerInfo.markerLength);
      return markerLength;
    }
    // get the normal marker info
    const markerIdReq = new MarkerIdRequest(null, unitCode, companyCode, 0, docketRec[0].poMarkerId);
    const markerInfo = await this.helperService.getPoMarker(markerIdReq);
    markerLength = Number(markerInfo?.mLength) ?? 0;
    return markerLength
  }


  async getDocketMaterialRequests(req: PoDocketGroupRequest): Promise<DocMaterialAllocationResponse> {
    const { unitCode, companyCode } = req;
    const poDocMaterialReq = await this.poDocMaterialReqRepo.find({ where: { docketGroup: req.docketGroup, unitCode, companyCode, isActive: true } });
    const docketsInDocGroup = await this.docketInfoService.getDocketRecordsByDocGroup(req.docketGroup, req.companyCode, req.unitCode);
    if (docketsInDocGroup.length == 0) {
      throw new ErrorResponse(0, 'Docket information not found. Please check and try again');
    }
    const docketInfo = docketsInDocGroup[0];// await this.docketInfoService.getDocketRecordByDocNumber(req.docketGroup, companyCode, unitCode);
    const materialReqModels: DocMaterialAllocationModel[] = [];
    for (const eachReq of poDocMaterialReq) {
      const docMaterialModel = new DocMaterialAllocationModel();
      docMaterialModel.docketGroup = eachReq.docketGroup;
      docMaterialModel.itemCode = eachReq.itemCode;
      docMaterialModel.poSerial = eachReq.poSerial;
      docMaterialModel.productName = docketInfo.productName;
      docMaterialModel.productType = docketInfo.productType;
      docMaterialModel.requestNumber = eachReq.requestNumber;
      docMaterialModel.requestStatus = eachReq.requestStatus;

      const rollsForDoc = await this.getDocketRollModelsForMaterialRequest(req.docketGroup, companyCode, unitCode, eachReq.requestNumber, 0);
      docMaterialModel.rollsInfo = rollsForDoc;
      materialReqModels.push(docMaterialModel);
    };
    return new DocMaterialAllocationResponse(true, 0, 'Material Requests retrieved successfully', materialReqModels)
  }


  async getDocketAllocatedRollsForDocketGroup(req: PoDocketGroupRequest): Promise<DocRollsModel[]> {
    const { unitCode, companyCode } = req;
    const poDocMaterialReq = await this.poDocMaterialReqRepo.find({ where: { docketGroup: req.docketGroup, unitCode, companyCode, isActive: true } });
    let poDocRollModels: DocRollsModel[] = [];
    if (poDocMaterialReq.length == 0) {
      return [];
    }
    for (const eachReq of poDocMaterialReq) {
      const rollsForDoc = await this.getDocketRollModelsForMaterialRequest(req.docketGroup, companyCode, unitCode, eachReq.requestNumber, 0);
      rollsForDoc.forEach(r => poDocRollModels.push(r));
    }
    return poDocRollModels;
  }

  // HELPER
  async getDocketRollModelsForMaterialRequest(docketGroup: string, companyCode: string, unitCode: string, requestNumber: string, mrnId?: number): Promise<DocRollsModel[]> {
    let docketMaterialInfo: PoDocketMaterialEntity[] = [];
    let poDocRollModels: DocRollsModel[] = [];
    if(mrnId) {
      docketMaterialInfo = await this.poDocMaterialRepo.find({ where: { docketGroup: docketGroup, unitCode, companyCode, isActive: true, mrnId: mrnId } });
    } else {
      docketMaterialInfo = await this.poDocMaterialRepo.find({ where: { docketGroup: docketGroup, unitCode, companyCode, isActive: true, requestNumber: requestNumber } });
    }
    const markerLength = await this.getMarkerLengthForDocGroup(docketGroup, companyCode, unitCode);
    
    const rollInfoReq = new RollIdsRequest(null, unitCode, companyCode, 0, docketMaterialInfo.map(roll => roll.rollId));
    const rollInfo: RollBasicInfoModel[] = await this.helperService.getRollsBasicInfoForRollIds(rollInfoReq);
    const palletAndBinInfo = await this.helperService.getPalletAndBinbyRollIdData(rollInfoReq);
    const trayAndTrolleyInfo = await this.helperService.getTrayAndTrolleyInfoForRollIdData(rollInfoReq);
    for (const eachMaterial of docketMaterialInfo) {
      const basicInfo = rollInfo.find(roll => roll.rollId == eachMaterial.rollId);
      const palletInfo = palletAndBinInfo.data?.find(palletData => palletData.rollId == eachMaterial.rollId) || { palletCode: '', binCode: '' };
      const trayInfo = trayAndTrolleyInfo.data?.find(trayData => trayData.rollId == eachMaterial.rollId)  || { trayCode: '', trollyCode: '' };
      const rollObj = new DocRollsModel();
      rollObj.allocatedQuantity = eachMaterial.requestedQuantity;
      rollObj.batch = basicInfo.batch;
      rollObj.itemDesc = basicInfo.itemDesc; // eachReq.itemCode;
      rollObj.lotNo = basicInfo.lot;
      rollObj.mWidth = basicInfo.measuredWidth; // TODO: need to get after marker completion
      rollObj.rollBarcode = basicInfo.barcode;
      rollObj.rollId = basicInfo.rollId;
      rollObj.rollLocked = eachMaterial.rollLockStatus;
      rollObj.rollQty = basicInfo.originalQty;
      rollObj.shade = basicInfo.aShade;
      rollObj.shrinkageGroup = basicInfo.shrinkageGroup?.toString();
      rollObj.mrnId = eachMaterial.mrnId;
      rollObj.iWidth = basicInfo.width ? Number(basicInfo.width) : 0;
      rollObj.plWidth = basicInfo.width;
      rollObj.aWidth = basicInfo.relaxWidth;
      rollObj.allocatedDate = eachMaterial.createdAt?.toString();
      rollObj.externalRollNumber = basicInfo.externalRollNumber;
      const mrnRec = eachMaterial.mrnId ? await this.helperService.getMrnRequestRecordForMrnId(eachMaterial.mrnId, companyCode, unitCode) : null;
      rollObj.mrnReqStatus = mrnRec?.requestStatus;
      rollObj.mrnReqNumber = mrnRec?.requestNumber;
      rollObj.palletCode = palletInfo.palletCode;
      rollObj.trayCode = trayInfo.trayCode;
      rollObj.trolleyCode = trayInfo.trollyCode;
      rollObj.binCode = palletInfo.binCode; 
      rollObj.markerLength = markerLength;
      poDocRollModels.push(rollObj);
    };
    return poDocRollModels;
  }


  /**
   * Service to get allocated quantity for docket
   * @param docketNumber 
   * @param unitCode 
   * @param companyCode 
   * @returns 
  */
  async getAllocatedQtyForDocketGroup(docketGroup: string, unitCode: string, companyCode: string): Promise<number> {
    return await this.poDocMaterialRepo.getAllocatedQtyForDocketGroup(docketGroup, unitCode, companyCode);
  }

  /**
   * READER
   * ENDPOINT
   * Called from WMS
   * used by the WH service to get all the materials requested under a docket request
   * @param req 
   */
  async getDocketMaterialsForWhReqCreation(req: MaterialRequestNoRequest): Promise<WhReqCreateHeaderResponse> {
    if (!req.materialRequestNo || !req.docketGroup) {
      throw new ErrorResponse(0, 'Docket number and the WH Req number are mandatory');
    }
    const docketReq = await this.poDocMaterialRepo.findOne({ where: { companyCode: req.companyCode, unitCode: req.unitCode, requestNumber: req.materialRequestNo, isActive: true } });
    if (!docketReq) {
      throw new ErrorResponse(0, 'No docket material request is found');
    }
    // get the po material req record
    const poMatReq = await this.poMaterialReqRepo.findOne({ select: ['id'], where: { companyCode: req.companyCode, unitCode: req.unitCode, requestNumber: req.materialRequestNo, isActive: true } });

    // get the planned req info 
    const docPlanInfo = await this.helperService.getDocketRequestPlanRecord(req.materialRequestNo, req.docketGroup, req.companyCode, req.unitCode);

    // get the rolls info for the request 
    const docketReqRolls = await this.poDocMaterialRepo.find({
      select: ['id', 'rollBarcode', 'rollId', 'requestedQuantity'],
      where: { companyCode: req.companyCode, unitCode: req.unitCode, requestNumber: req.materialRequestNo, docketGroup: req.docketGroup, isActive: true }
    });
    if (docketReqRolls.length == 0) {
      throw new ErrorResponse(0, 'Materials not allocated for the docket request');
    }
    const whReqLineItemsModel: WhReqCreateItemsListModel[] = [];
    for (const roll of docketReqRolls) {
      whReqLineItemsModel.push(new WhReqCreateItemsListModel(roll.rollId, roll.rollBarcode, roll.requestedQuantity));
    }
    const whReqCreatLineModel = new WhReqCreateLineModel(docketReq.id, docketReq.docketGroup, whReqLineItemsModel);
    const whReqModel = new WhReqCreateHeaderModel(poMatReq.id, req.materialRequestNo, docPlanInfo.matReqOn, docPlanInfo.matReqBy, WhReqByObjectEnum.DOCKET, PhItemCategoryEnum.FABRIC, [whReqCreatLineModel], docPlanInfo.matFulfillmentDateTime, docPlanInfo.resourceId, docPlanInfo.resourceDesc);
    return new WhReqCreateHeaderResponse(true, 0, 'WH req info retrieved', [whReqModel]);
  }

  /*
  * HELPER
  */
  async getDocketMaterialRequestRecordByReqNumber(requestNumber: string, companyCode: string, unitCode: string): Promise<PoDocketMaterialRequestEntity> {
    return await this.poDocMaterialReqRepo.findOne({ where: { companyCode: companyCode, unitCode: unitCode, requestNumber: requestNumber } });
  }

  async getDocketMaterialRequestRecordsByDocGroup(docketGroup: string, companyCode: string, unitCode: string): Promise<PoDocketMaterialRequestEntity[]> {
    return await this.poDocMaterialReqRepo.find({ where: { companyCode: companyCode, unitCode: unitCode, docketGroup: docketGroup } });
  }

  /**
   * 
   * @param docketNumber 
   * @param companyCode 
   * @param unitCode 
   * @returns 
  */
  async getPoDocketMaterialRecordsByDocGroup(docketGroups: string[], companyCode: string, unitCode: string): Promise<PoDocketMaterialEntity[]> {
    return await this.poDocMaterialRepo.find({ where: { docketGroup: In(docketGroups), unitCode, companyCode } });
  }

  // END POINT
  async getOnFloorRolls(req: RollLocationRequest): Promise<LockedFabMaterialResponse> {
    const { unitCode, companyCode } = req;
    /**
     * get all the on floor rolls where is_active = true and avl_qty > 0
     * for each roll get the basic roll info and the docket to which it was last allocated
     */
    const onFloorRolls = await this.onFloorRollsRepo.find({ where: { rollLocation: In(req.location), unitCode: req.unitCode, companyCode: req.companyCode, isActive: true } });
    const rollConsumedQtyMap = new Map<number, number>();
    const rollAvailableQtyMap = new Map<number, number>();
    const rollIdsSet = new Set<number>();
    for (const eachRoll of onFloorRolls) {
      rollIdsSet.add(eachRoll.rollId);
    }
    // now again get the total consumed qty for all the rolls in onfloor.
    const onFloorRollsConsQtyRecs = await this.onFloorRollsRepo.getOnFloorRollsTotalConsumedQty(req.companyCode, req.unitCode, Array.from(rollIdsSet));
    onFloorRollsConsQtyRecs.forEach(r => {
      rollConsumedQtyMap.set(Number(r.roll_id), Number(r.consumed_qty));
    });
    // for (const eachRoll of onFloorRolls) {
    //   if (!rollConsumedQtyMap.has(eachRoll.rollId)) {
    //     rollConsumedQtyMap.set(eachRoll.rollId, 0);
    //   }
    //   const preQty = rollConsumedQtyMap.get(eachRoll.rollId);
    //   rollConsumedQtyMap.set(eachRoll.rollId, preQty + eachRoll.consumedQuantity);
    // };
    const rollInfoReq = new RollIdsRequest(req.username, unitCode, companyCode, req.userId, Array.from(rollIdsSet));
    const rollInfo: RollBasicInfoModel[] = await this.helperService.getRollsBasicInfoForRollIds(rollInfoReq);
    console.log(rollConsumedQtyMap);
    for (const [consumedRoll, consumedQty] of rollConsumedQtyMap) {
      const selectedRoll = rollInfo.find(roll => roll.rollId == consumedRoll);
      rollAvailableQtyMap.set(consumedRoll, (Number(selectedRoll.originalQty) - Number(consumedQty)));
    }
    const onFloorRollsModel: LockedFabMaterialModel[] = [];
    const docketAttributesMap = new Map<string, { [k in DocketAttrEnum]: string }>();
    const docketCutInfoMap = new Map<string, PoCutDocketEntity[]>();
    const poPoSummaryMap = new Map<number, PoSummaryModel>();
    for (const [eachOnFloorRoll, availableQty] of rollAvailableQtyMap) {

      const selectedRoll = rollInfo.find(roll => roll.rollId == eachOnFloorRoll);

      const onFloorRecord: OnFloorRollsEntity = onFloorRolls.find(onFloor => onFloor.rollId == eachOnFloorRoll);
      if (availableQty == 0) {
        continue;
      }
      const onFloorRollModel = new LockedFabMaterialModel(onFloorRecord.id, selectedRoll.itemCode, selectedRoll.itemDesc, selectedRoll.itemCode, selectedRoll.barcode, selectedRoll.rollId, selectedRoll.originalQty, Number(rollConsumedQtyMap.get(eachOnFloorRoll)), selectedRoll.aShade, selectedRoll.lot, onFloorRecord.rollLocation, onFloorRecord.rollRcConfirmationStatus, onFloorRecord.reasonId, onFloorRecord.remarks, []);
      if (req.iNeedUtilizationHistory) {
        const onFloorRoll = await this.onFloorRollsRepo.find({ where: { rollId: eachOnFloorRoll, unitCode, companyCode, isActive: true } });
        const utilizedRollInfo: FabUtilizationModel[] = [];
        for (const roll of onFloorRoll) {
          if (!docketAttributesMap.has(roll.docketGroup)) {
            const docAttributes = await this.helperService.getDocketAttrByDocNumber(roll.docketGroup, companyCode, unitCode);
            docketAttributesMap.set(roll.docketGroup, docAttributes);
          }
          if (!docketCutInfoMap.has(roll.docketGroup)) {
            const cutInfo: PoCutDocketEntity[] = await this.helperService.getCutDocketRecordsForDocket(roll.docketGroup, companyCode, unitCode);
            docketCutInfoMap.set(roll.docketGroup, cutInfo)
          }
          const currentCut = docketCutInfoMap.get(roll.docketGroup)
          const cutNumbers = currentCut.map(cut => cut.cutNumber);
          const soNo = docketAttributesMap.get(roll.docketGroup).MO;
          const soLines = docketAttributesMap.get(roll.docketGroup).MOLINES;
          if (!poPoSummaryMap.has(roll.poSerial)) {
            const poSerialReq = new PoSerialRequest(null, unitCode, companyCode, null, roll.poSerial, null, false, false);
            const poSummary = await this.helperService.getPoBasicInfoByPoSerial(poSerialReq);
            poPoSummaryMap.set(roll.poSerial, poSummary);
          }
          const currentPoSummary = poPoSummaryMap.get(roll.poSerial);
          const fabUtilizedObj = new FabUtilizationModel(roll.consumedQuantity, moment(roll.updatedAt).format('YYYY-MM-DD HH:mm:ss'), roll.docketGroup, Number(cutNumbers.toString()), roll.poSerial, currentPoSummary.poDesc, soNo, soLines.split(','));
          utilizedRollInfo.push(fabUtilizedObj);
        }
        onFloorRollModel.utilizationHistory = utilizedRollInfo;
      }
      onFloorRollsModel.push(onFloorRollModel)
    }
    return new LockedFabMaterialResponse(true, 0, 'On Floor Roll Info Retrieved Successfully.', onFloorRollsModel);
  }


  // gets the rolls that were location changed but not yet confirmed
  async getPendingPresenceConfirmationRolls(req: CommonRequestAttrs): Promise<LockedFabMaterialResponse> {
    const { unitCode, companyCode } = req;
    const yetToConfirmRolls = await this.onFloorRollsRepo.find({ where: { companyCode: req.companyCode, unitCode: req.unitCode, rollRcConfirmationStatus: RollReceivingConfirmationStatusEnum.YET_TO_RECEIVE, isActive: true, rollLocation: Not(RollLocationEnum.ONFLOOR) } });
    if (yetToConfirmRolls.length == 0) {
      throw new ErrorResponse(0, 'No rolls found to confirm');
    }
    const rollIdsSet = new Set<number>();
    for (const eachRoll of yetToConfirmRolls) {
      rollIdsSet.add(eachRoll.rollId);
    }
    const rollConsumedQtyMap = new Map<number, number>();
    // now again get the total consumed qty for all the rolls in onfloor.
    const onFloorRollsConsQtyRecs = await this.onFloorRollsRepo.getOnFloorRollsTotalConsumedQty(req.companyCode, req.unitCode, Array.from(rollIdsSet));
    onFloorRollsConsQtyRecs.forEach(r => {
      rollConsumedQtyMap.set(Number(r.roll_id), Number(r.consumed_qty));
    });

    const rollInfoReq = new RollIdsRequest(req.username, unitCode, companyCode, req.userId, Array.from(rollIdsSet));
    const rollInfo: RollBasicInfoModel[] = await this.helperService.getRollsBasicInfoForRollIds(rollInfoReq);


    const onFloorRollsModel: LockedFabMaterialModel[] = [];
    yetToConfirmRolls.forEach(onFloorRecord => {
      const selectedRoll = rollInfo.find(roll => roll.rollId == onFloorRecord.rollId);
      const onFloorRollModel = new LockedFabMaterialModel(onFloorRecord.id, selectedRoll.itemCode, selectedRoll.itemDesc, selectedRoll.itemCode, selectedRoll.barcode, selectedRoll.rollId, selectedRoll.originalQty, Number(rollConsumedQtyMap.get(onFloorRecord.rollId)), selectedRoll.aShade, selectedRoll.lot, onFloorRecord.rollLocation, onFloorRecord.rollRcConfirmationStatus, onFloorRecord.reasonId, onFloorRecord.remarks, []);
      onFloorRollsModel.push(onFloorRollModel);
    });
    return new LockedFabMaterialResponse(true, 0, 'On Floor Roll Info Retrieved Successfully.', onFloorRollsModel);
  }
  /**
  * Service to get allocated quantity by roll id
  * @param rollId 
  * @param unitCode 
  * @param companyCode 
  * @returns 
 */
  async getAllocatedQtyByRollId(rollId: number, unitCode: string, companyCode: string): Promise<number> {
    const allocatedQtyDetails = await this.poDocMaterialRepo.find({ select: ['requestedQuantity'], where: { rollId, unitCode, companyCode, isActive: true } });
    if (!allocatedQtyDetails) {
      throw new ErrorResponse(0, 'Allocation details not found for the given roll Id')
    }
    let totalAllocatedQty = allocatedQtyDetails.reduce((pre, curr) => {
      return pre + Number(curr.requestedQuantity);
    }, 0);
    return totalAllocatedQty;
  }

  /**
   * Service to get issued quantity 
   * @param docketNumber 
   * @param rollId 
   * @param unitCode 
   * @param companyCode 
   * @returns 
  */
  async getIssuedQtyByRoll(rollId: number, unitCode, companyCode: string): Promise<number> {
    const allocatedQtyDetails = await this.poDocMaterialRepo.find({ select: ['requestedQuantity'], where: { rollId, unitCode, companyCode, isActive: true, requestStatus: WhMatReqLineItemStatusEnum.MATERIAL_ISSUED } });
    if (!allocatedQtyDetails) {
      throw new ErrorResponse(0, 'Issuance details not found for the given roll Id')
    }
    let totalIssuedQty = allocatedQtyDetails.reduce((pre, curr) => {
      return pre + Number(curr.requestedQuantity);
    }, 0);
    return totalIssuedQty;
  }


  /**
   * Service to get issued quantity 
   * @param requestType 
   * @param requestNumber 
   * @param rollId 
   * @param unitCode 
   * @param companyCode 
   * @returns 
  */
  async getIssuedQtyByRollandRequestNumber(rollId: number, unitCode, companyCode: string, requestNumber: string, requestType: RequestTypeEnum): Promise<number> {
    let allocatedQty;
    if (requestType == RequestTypeEnum.NORMAL) {
      allocatedQty = await this.poDocMaterialRepo.find({ select: ['requestedQuantity'], where: { rollId, unitCode, companyCode, requestNumber, isActive: true, requestStatus: WhMatReqLineItemStatusEnum.MATERIAL_ISSUED } });
    } else {
      allocatedQty = await this.poDocMaterialRepo.find({ select: ['requestedQuantity'], where: { rollId, unitCode, companyCode, mrnId: Number(requestNumber), isActive: true, requestStatus: WhMatReqLineItemStatusEnum.MATERIAL_ISSUED } });
    }
    if (!allocatedQty) {
      throw new ErrorResponse(0, 'Issuance details not found for the given roll Id')
    }
    let totalIssuedQty = allocatedQty.reduce((pre, curr) => {
      return pre + Number(curr.requestedQuantity);
    }, 0);
    return totalIssuedQty;
  }

  /**
   * Service to get issued quantity 
   * @param requestType 
   * @param requestNumber 
   * @param rollId 
   * @param unitCode 
   * @param companyCode 
   * @returns 
  */
  async getAllocatedQtyByRollandRequestNumber(rollId: number, unitCode, companyCode: string, requestNumber: string, requestType: RequestTypeEnum): Promise<number> {
    let allocatedQty;
    if (requestType == RequestTypeEnum.NORMAL) {
      allocatedQty = await this.poDocMaterialRepo.find({ select: ['requestedQuantity'], where: { rollId, unitCode, companyCode, requestNumber, isActive: true } });
    } else {
      allocatedQty = await this.poDocMaterialRepo.find({ select: ['requestedQuantity'], where: { rollId, unitCode, companyCode, mrnId: Number(requestNumber) } });
    }
    if (!allocatedQty) {
      throw new ErrorResponse(0, 'Issuance details not found for the given roll Id')
    }
    let totalIssuedQty = allocatedQty.reduce((pre, curr) => {
      return pre + Number(curr.requestedQuantity);
    }, 0);
    return totalIssuedQty;
  }

  // Helper function
  // gets the actual marker for the given dockets groups
  async getActualMarkerForDocketGroup(companyCode: string, unitCode: string, docketGroups: string[]): Promise<ActualMarkerModel[]> {
    const actualMarkerModels: ActualMarkerModel[] = [];
    const actualMarkers = await this.actualMarkerRepo.find({ where: { companyCode: companyCode, unitCode: unitCode, docketGroup: In(docketGroups), isActive: true } });
    actualMarkers.forEach(r => {
      actualMarkerModels.push(new ActualMarkerModel(r.createdUser, r.unitCode, r.companyCode, 0, r.markerName, r.markerLength, r.markerWidth, r.docketGroup));
    });
    return actualMarkerModels;
  }


  async getTotalMaterialAllocatedDocketsToday(req: DocketGroupResponseModel): Promise<number> {
    return await this.poDocMaterialRepo.getTotalMaterialAllocatedDocketsToday(req.unitCode, req.companyCode, req.date);
    // return new MaterialAllocatedDocketsResponse(true, 3456, "dockets retrieved successfully", data)
  }

  async getTotalMaterialAllocatedDocketsTodayInfo(req: DocketGroupResponseModel): Promise<number> {
    return await this.poDocMaterialRepo.getTotalMaterialAllocatedDocketsTodayInfo(req.unitCode, req.companyCode, req.date);
    // return new MaterialAllocatedDocketsResponse(true, 3456, "Quantity retrieved successfully", data)
  }

  async getTotalMaterialAllocatedDocketsTodayInfoRolls(req: DocketGroupResponseModel): Promise<number> {
    return await this.poDocMaterialRepo.getTotalMaterialAllocatedDocketsTodayInfoRolls(req.unitCode, req.companyCode, req.date);
    // return new MaterialAllocatedDocketsResponse(true, 3456, "Quantity retrieved successfully", data)
  }

  async getTotalMeterageofRequestsRepo(req: DocketGroupResponseModel): Promise<number> {
    return await this.poDocMaterialRepo.getTotalMaterialAllocatedDocketsTodayInfo(req.unitCode, req.companyCode, req.date);
    // return new MaterialAllocatedDocketsResponse(true, 3456, "Quantity retrieved successfully", data)
  }

  async getTotalLayedMeterage(req: LayerMeterageRequest): Promise<TodayLayAndCutResponse> {
    const layReportingInfo = await this.layReportingInfoService.getTotalLayedMeterageToday(req);
    if(layReportingInfo.length === 0) {
      const layInfo = new TodayLayedCutAndMeterage(0, 0);
      return new TodayLayAndCutResponse(true, 33546, "Total layed meterage data retrieved", layInfo)
    }
    const docketGroup: string[] = layReportingInfo.map(eachRequest => eachRequest.docGroup);
    const requestNumbers: string[] = layReportingInfo.map(eachRequest => eachRequest.reqNumber);
    let cutNumbers = [];
    let totCuts=0;
    for (const docket of docketGroup) {
      const poCutDockets = await this.dataSource.getRepository(PoCutDocketEntity).find({ 
          select: ['poSerial','cutSubNumber'], 
          where: { docketNumber: docket } 
      });
  
      for (const poCutDocket of poCutDockets) {
        let code = `${poCutDocket.poSerial}-${poCutDocket.cutSubNumber}`;        
        if (!cutNumbers.includes(code)) { // Check if the code exists in the array
            cutNumbers.push(code); // Add the unique code to the array
            totCuts++; // Increment the total cuts
        }
      }
    } 
    const quanityInfo = await this.poDocMaterialRepo.getTotalMeterageofRequestsRepo(req.unitCode, req.companyCode, requestNumbers);
    // console.log(quanityInfo);
    const layInfo = new TodayLayedCutAndMeterage(totCuts, quanityInfo);
    return new TodayLayAndCutResponse(true, 33546, "Total layed meterage data retrieved", layInfo)
  }

  async getTotalQuantityofRequest( requestNumbers: string[], unitCode: string, companyCode: string): Promise<number> {
    const quanityInfo = await this.poDocMaterialRepo.getTotalMeterageofRequestsRepo(unitCode, companyCode, requestNumbers);
    return quanityInfo;   
  }

  async getTotalRollsofRequest( requestNumbers: string[], unitCode: string, companyCode: string): Promise<number> {
    const rolls = await this.poDocMaterialRepo.getTotalRollsofRequestsRepo(unitCode, companyCode, requestNumbers);
    return rolls;   
  }
  



}