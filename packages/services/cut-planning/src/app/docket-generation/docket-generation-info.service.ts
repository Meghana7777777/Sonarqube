import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { ErrorResponse } from "@xpparel/backend-utils";
import { CutRmModel, CutStatusEnum, DocConfirmationStatusEnum, DocketAndFabHelperModel, DocketAttrEnum, DocketBasicInfoModel, DocketBasicInfoResponse, DocketDetailedInfoModel, DocketDetailedInfoResponse, DocketGroupBasicInfoModel, DocketGroupBasicInfoResponse, DocketGroupDetailedInfoModel, DocketGroupDetailedInfoResponse, DocketGroupResponseModel, DocketHeaderResponse, DocketNumberModel, DocketNumberResponse, DocketsCardDetailsResponse, DocketsConfirmationListModel, DocketsConfirmationListResponse, LayedCutsResponse, LayerMeterageRequest, MarkerIdRequest, MarkerInfoModel, MarkerSpecificDocketsResponse, OpCategoryEnum, OpFormEnum, OpVersionModel, PhysicalEntityTypeEnum, PoDocketGroupRequest, PoDocketNumberRequest, PoItemRefCompProductModel, PoMarkerModel, PoProdutNameRequest, PoRatioIdMarkerIdRequest, PoRatioIdRequest, PoRatioModel, PoRatioSizeModel, PoSerialRequest } from "@xpparel/shared-models";
import { DocketQuantityInformation } from "packages/libs/shared-models/src/cps/docket/info/docket-card-details-list.model";
import { DataSource, In } from "typeorm";
import { docketBindingRequirement, docketRequirementWithoutBinding } from '../../../../../libs/shared-calculations/src/common-calculations/common-calcultatoins';
import { GenericTransactionManager } from "../../database/typeorm-transactions";
import { PoRatioAttrRepository } from "../common/repository/po-ratio-attr.repository";
import { DocketMaterialInfoService } from "../docket-material/docket-material-info.service";
import { DocketPlanningInfoService } from "../docket-planning/docket-planning-info.service";
import { DocketGenerationHelperService } from "./docket-generation-helper.service";
import { PoComponentSerialsEntity } from "./entity/po-component-serials.entity";
import { PoDocketBundleEntity } from "./entity/po-docket-bundle.entity";
import { PoDocketGroupEntity } from "./entity/po-docket-group.entity";
import { PoDocketSerialsEntity } from "./entity/po-docket-serials.entity";
import { PoDocketEntity } from "./entity/po-docket.entity";
import { PoComponentSerialsRepository } from "./repository/po-component-serial.repository";
import { PoDocketAttrRepository } from "./repository/po-docket-attr.repository";
import { PoDocketBundleRepository } from "./repository/po-docket-bundle.repository";
import { PoDocketGroupRepository } from "./repository/po-docket-group.repository";
import { PoDocketPanelRepository } from "./repository/po-docket-panel.repository";
import { PoDocketSerialRepository } from "./repository/po-docket-serial.repository";
import { PoDocketRepository } from "./repository/po-docket.repository";
import { PoDocketPslRepository } from "./repository/po-docket-psl.repository";
import { PoMaterialService } from "@xpparel/shared-services";
import { DOC_ElgPanelsForBundlingQueryResponse, DOC_SizeWiseBundledQtysQueryResponse, DOC_SizeWiseCutRepQytsQueryResponse, ItemDocSizeWiseQtysQueryResponse } from "./repository/query-response/doc-query-response.models";

@Injectable()
export class DocketGenerationInfoService {
  constructor(
    private dataSource: DataSource,
    private poDocketRepo: PoDocketRepository,
    private poDocketAttrRepo: PoDocketAttrRepository,
    private poDocBundleRepo: PoDocketBundleRepository,
    private poDocPanelRepo: PoDocketPanelRepository,
    private poDocGroupRepo: PoDocketGroupRepository,
    private ratioAttrRepo: PoRatioAttrRepository,
    private poColorSizePanelSerialRepo: PoDocketSerialRepository,
    private poPanelSerialRepo: PoComponentSerialsRepository,
    @Inject(forwardRef(() => DocketGenerationHelperService)) private helperService: DocketGenerationHelperService,
    @Inject(forwardRef(() => DocketMaterialInfoService)) private DocketMaterialInfoService: DocketMaterialInfoService,
    @Inject(forwardRef(() => DocketPlanningInfoService)) private DocketPlanningInfoService: DocketPlanningInfoService,
    private poDocPslRepo: PoDocketPslRepository,

  ) {

  }

  /**
   * Service to get docket confirmation list of a PO
   * @param req 
   * @returns 
  */
  async getDocketsConfimrationListForPo(req: PoProdutNameRequest): Promise<DocketsConfirmationListResponse> {
    const { unitCode, companyCode } = req;
    try {
      const docketIds = new Set<number>();
      let confirmedDockets: string[] = [];
      let confirmationInProgDockets: string[] = [];
      let yetToBeConfirmedDokcets: string[] = [];
      const docketDetailsByPoProd = await this.poDocketRepo.find({ where: { poSerial: req.poSerial, productName: req.productName, unitCode, companyCode } });
      if (!docketDetailsByPoProd.length) {
        throw new ErrorResponse(0, 'No dockets found for the given po and product name')
      }
      for (const docketInfo of docketDetailsByPoProd) {
        switch (docketInfo.docketConfirmation) {
          case DocConfirmationStatusEnum.OPEN: yetToBeConfirmedDokcets.push(docketInfo.docketNumber); break;
          case DocConfirmationStatusEnum.INPROGRESS: confirmationInProgDockets.push(docketInfo.docketNumber); break;
          case DocConfirmationStatusEnum.CONFIRMED: confirmedDockets.push(docketInfo.docketNumber); break;
        }
        docketIds.add(docketInfo.id);
      }
      const confirmList = new DocketsConfirmationListModel(req.productName, docketIds.size, confirmedDockets, confirmationInProgDockets, yetToBeConfirmedDokcets);
      return new DocketsConfirmationListResponse(true, 0, 'Docket Confirmation List Retrieved Successfully', [confirmList]);
    } catch (err) {
      throw err;
    }
  }

  /**
   * Service to get docket basic info for the PO
   * @param req 
   * @returns 
  */
  async getDocketsBasicInfoForPo(req: PoProdutNameRequest): Promise<DocketBasicInfoResponse> {
    const { unitCode, companyCode } = req;
    try {
      // if prod name, then filter only those dockets. else send back all dockets for the PO
      const docketDetailsByPoProd = await this.poDocketRepo.find({ where: { poSerial: req.poSerial, productName: req.productName, unitCode, companyCode } });
      if (!docketDetailsByPoProd.length) {
        throw new ErrorResponse(0, 'No dockets found for the given po and product name')
      }
      const docketBasicInfo: DocketBasicInfoModel[] = await this.constructTheDocketBasicInfoRespByEntity(docketDetailsByPoProd, req.username, req.poSerial, req.userId, unitCode, companyCode, req.iNeedDocketFabricInfo, false)
      return new DocketBasicInfoResponse(true, 0, 'Docket Info Retrieved Successfully.', docketBasicInfo)
    } catch (err) {
      throw err;
    }
  }

  // HELPER
  async constructTheDocketBasicInfoRespByEntity(docketEntityDetails: PoDocketEntity[], username: string, poSerial: number, userId: number, unitCode: string, companyCode: string, iNeedDocketFabricInfo: boolean, helpingAbstractInfoOnly: boolean): Promise<DocketBasicInfoModel[]> {
    const ratioIdDetailsMap = new Map<number, PoRatioModel>();
    const markerVersionMap = new Map<number, PoMarkerModel>();
    const docketBasicInfo: DocketBasicInfoModel[] = [];

    const docketNos = docketEntityDetails.map(d => d.docketNumber);
    const cutNumbersForDocs = await this.helperService.getCutDocketRecordsForDockets(docketNos, companyCode, unitCode);
    const docCutNumMap = new Map<string, { cutNo: number, cutSubNumber: number }>();
    cutNumbersForDocs.forEach(r => {
      // putting this condition just to ensure that we get the very first cut number for a docket.(If a docket is span accross multiple cuts)
      if (!docCutNumMap.has(r.docketNumber)) {
        docCutNumMap.set(r.docketNumber, { cutNo: r.cutNumber, cutSubNumber: r.cutSubNumber });
      }
    });

    const fabrInfoMap = new Map<string, Map<string, CutRmModel>>();
    if (iNeedDocketFabricInfo) {
      // if we pass the prod name as empty then
      const fabInfo = await this.helperService.getPoProdTypeAndFabricsForPoSerial(poSerial, companyCode, unitCode);
      fabInfo.forEach(p => {
        if (!fabrInfoMap.has(p.productName)) {
          fabrInfoMap.set(p.productName, new Map<string, CutRmModel>());
        }
        p.iCodes.forEach(i => {
          fabrInfoMap.get(p.productName).set(i.iCode, i);
        });
      })
    }


    for (const docketInfo of docketEntityDetails) {
      let allocatedQty = 0;
      if (!helpingAbstractInfoOnly) {
        if (!ratioIdDetailsMap.has(docketInfo.poRatioId)) {
          const reqObj = new PoRatioIdRequest(username, unitCode, companyCode, userId, poSerial, docketInfo.poRatioId);
          const ratioInfo = await this.helperService.getRatioDetailedInfoForRatioId(reqObj);
          const currentRatio: PoRatioModel = ratioInfo[0];
          ratioIdDetailsMap.set(docketInfo.poRatioId, currentRatio);
        }
        if (!markerVersionMap.has(docketInfo.poMarkerId)) {
          const markerReq = new MarkerIdRequest(username, unitCode, companyCode, userId, docketInfo.poMarkerId);
          const markerDetails: MarkerInfoModel = await this.helperService.getPoMarker(markerReq);
          const poMarkerModel = new PoMarkerModel(markerDetails.id, markerDetails.markerName, markerDetails.markerVersion, markerDetails.mWidth, markerDetails.mLength, markerDetails.patVer, markerDetails.defaultMarker, markerDetails.endAllowance, markerDetails.perimeter, markerDetails.remarks1, markerDetails.remarks2);
          markerVersionMap.set(docketInfo.poMarkerId, poMarkerModel);
        }
        allocatedQty = await this.helperService.getAllocatedQtyForDocketGroup(docketInfo.docketGroup, unitCode, companyCode);
      }
      const totalLayedPliesRecs = await this.helperService.getLayReportedPliesPerDocketOfGivenDocketGroups([docketInfo.docketGroup], companyCode, unitCode);
      let totalLayedPlies = 0;
      totalLayedPliesRecs.forEach(r => {
        totalLayedPlies += Number(r.layed_plies);
      })
      const docAttrs = await this.getDocketAttrByDocNumber(docketInfo.docketNumber, companyCode, unitCode);
      const ratioDetails = ratioIdDetailsMap.get(docketInfo.poRatioId);
      const basicInfo = new DocketBasicInfoModel();
      basicInfo.mo = docAttrs.MO;
      basicInfo.moLines = docAttrs.MOLINES?.split(',');
      basicInfo.bundleGenStatus = docketInfo.bundleGenStatus;
      // basicInfo.cutNumber = docketInfo.cutNumber;
      basicInfo.cutNumber = docCutNumMap.get(docketInfo.docketNumber)?.cutNo ?? 0;
      basicInfo.docConfirmationSatus = docketInfo.docketConfirmation;
      basicInfo.docketNumber = docketInfo.docketNumber;
      basicInfo.docketGroup = docketInfo.docketGroup;
      basicInfo.fgColor = docketInfo.color;
      basicInfo.itemCode = docketInfo.itemCode;
      basicInfo.markerInfo = markerVersionMap.get(docketInfo.poMarkerId);
      basicInfo.plies = docketInfo.plies;
      basicInfo.poSerial = docketInfo.poSerial;
      basicInfo.productName = docketInfo.productName;
      basicInfo.productType = docketInfo.productType;
      basicInfo.ratioDesc = ratioDetails?.rDesc;
      basicInfo.ratioId = ratioDetails?.id;
      basicInfo.ratioName = ratioDetails?.rName;
      basicInfo.sizeRatios = ratioDetails?.rLines[0]?.sizeRatios;
      basicInfo.totalBundles = docketInfo.plannedBundles;
      basicInfo.totalIssuedMrCount = 0;
      basicInfo.totalMrCount = 0;
      basicInfo.allocatedQty = Number(allocatedQty.toFixed(2));
      basicInfo.originalDocQuantity = docketInfo.plies * docketInfo.plannedBundles;
      basicInfo.components = ratioDetails?.rLines?.find(r => r.productName == docketInfo.productName)?.components; // ratioDetails.components;
      basicInfo.isMainDoc = docketInfo.mainDocket;
      basicInfo.layedPlies = totalLayedPlies;
      basicInfo.materialRequirement = 0;
      basicInfo.completeBindingDocket = docketInfo.isBinding;
      basicInfo.cutSubNumber = docCutNumMap.get(docketInfo.docketNumber)?.cutSubNumber ?? 0;

      const fabInfo = fabrInfoMap?.get(docketInfo.productName)?.get(docketInfo.itemCode);
      basicInfo.bindingConsumption = fabInfo?.bindingConsumption ? Number(fabInfo?.bindingConsumption) : 0;
      basicInfo.cutWastage = fabInfo?.wastage ? Number(fabInfo?.wastage) : 0;
      if (iNeedDocketFabricInfo) {
        basicInfo.fabricInfo = fabrInfoMap?.get(docketInfo.productName)?.get(docketInfo.itemCode);
        const reqWithOutWastage = docketRequirementWithoutBinding(docketInfo.plies, Number(basicInfo.markerInfo.mLength), Number(basicInfo.fabricInfo.wastage));
        const bindReqWithOutWastage = docketBindingRequirement(docketInfo.plies * docketInfo.plannedBundles, Number(basicInfo.fabricInfo.bindingConsumption), Number(basicInfo.fabricInfo.wastage));
        basicInfo.materialRequirement = Number((reqWithOutWastage + bindReqWithOutWastage).toFixed(2));
      }

      let itemDesc = '';
      ratioDetails?.rLines?.forEach(rL => rL.ratioFabric.forEach(f => f.iCode == docketInfo.itemCode ? itemDesc = f.iDesc : null));
      basicInfo.itemDesc = itemDesc;
      docketBasicInfo.push(basicInfo);
    }
    return docketBasicInfo;
  }

  async getDocketRecordByDocNumber(docketNumber: string, companyCode: string, unitCode: string): Promise<PoDocketEntity> {
    return await this.poDocketRepo.findOne({ where: { docketNumber: docketNumber, companyCode: companyCode, unitCode: unitCode } });
  }

  async getDocketRecordsByDocGroup(docketGroup: string, companyCode: string, unitCode: string): Promise<PoDocketEntity[]> {
    return await this.poDocketRepo.find({ where: { docketGroup: docketGroup, companyCode: companyCode, unitCode: unitCode } });
  }

  async getDocketRecordByDocNumbers(docketNumbers: string[], companyCode: string, unitCode: string): Promise<PoDocketEntity[]> {
    return await this.poDocketRepo.find({ where: { docketNumber: In(docketNumbers), companyCode: companyCode, unitCode: unitCode } });
  }

  async getDocketRecordByPoSerial(poSerial: number, companyCode: string, unitCode: string): Promise<PoDocketEntity[]> {
    return await this.poDocketRepo.find({ where: { poSerial: poSerial, companyCode: companyCode, unitCode: unitCode, isActive: true } });
  }

  async getDocketRecordByPoSerialProdName(poSerial: number, prodName: string, companyCode: string, unitCode: string): Promise<PoDocketEntity[]> {
    return await this.poDocketRepo.find({ where: { poSerial: poSerial, productName: prodName, companyCode: companyCode, unitCode: unitCode, isActive: true } });
  }

  async getDocketRecordsByPoAndItemCode(poSerial: number, itemCode: string, companyCode: string, unitCode: string): Promise<PoDocketEntity[]> {
    return await this.poDocketRepo.find({ where: { poSerial: poSerial, companyCode: companyCode, unitCode: unitCode, isActive: true, itemCode: itemCode } });
  }

  async getDocketBundleRecordsByDocNumber(docketNumber: string, companyCode: string, unitCode: string, component: string): Promise<PoDocketBundleEntity[]> {
    console.log(docketNumber,companyCode,unitCode, component  )
    if (component) {
      return await this.poDocBundleRepo.find({ where: { docketNumber: docketNumber, companyCode: companyCode, unitCode: unitCode, component: component } });
    } else {
      return await this.poDocBundleRepo.find({ where: { docketNumber: docketNumber, companyCode: companyCode, unitCode: unitCode } });
    }
  }

  async getDocketAttrByDocNumber(docketNumber: string, companyCode: string, unitCode: string): Promise<{ [k in DocketAttrEnum]: string }> {
    let docAttrs: any = {};
    const docAttrRecs = await this.poDocketAttrRepo.find({ where: { docketNumber: docketNumber } });
    for (const rec of docAttrRecs) {
      docAttrs[rec.name] = rec.value;
    }
    return docAttrs;
  }

  async getDocketAttrByDocNumbers(docketNumbers: string[], companyCode: string, unitCode: string): Promise<Map<string, { [k in DocketAttrEnum]: string }>> {
    let docAttrs = new Map<string, any>();
    const docAttrRecs = await this.poDocketAttrRepo.find({ where: { docketNumber: In(docketNumbers) } });
    for (const rec of docAttrRecs) {
      if (!docAttrs.has(rec.docketNumber)) {
        docAttrs.set(rec.docketNumber, {})
      }
      docAttrs.get(rec.docketNumber)[rec.name] = rec.value;
    }
    return docAttrs;
  }

  /**
   * TODO: Need to get the sizes info information only if asked in the request. Add i need sizes in the request object.
   * 
   * @param req 
   * @returns 
   */
  async getDocketsBasicInfoForDocketNumber(req: PoDocketNumberRequest, helpingAbstractInfoOnly: boolean = false): Promise<DocketBasicInfoResponse> {
    const { unitCode, companyCode } = req;
    const docketDetailsByPoProd = await this.poDocketRepo.find({ where: { docketNumber: req.docketNumber, unitCode, companyCode } });
    if (!docketDetailsByPoProd.length) {
      throw new ErrorResponse(0, 'No dockets found for the given po and product name')
    }
    const docketBasicInfo: DocketBasicInfoModel[] = await this.constructTheDocketBasicInfoRespByEntity(docketDetailsByPoProd, req.username, docketDetailsByPoProd[0].poSerial, req.userId, unitCode, companyCode, req.iNeedFabricInfoAlso, helpingAbstractInfoOnly);
    return new DocketBasicInfoResponse(true, 0, 'Docket Info Retrieved Successfully.', docketBasicInfo)
  }

  async getDocBundleRecordByDocBundleSize(docketNumber: string, bundleNumber: number, size: string, companyCode: string, unitCode: string): Promise<PoDocketBundleEntity> {
    return await this.poDocBundleRepo.findOne({ where: { docketNumber: docketNumber, bundleNumber: bundleNumber, size: size, companyCode: companyCode, unitCode: unitCode } });
  }



  /**
   * READER
   * HELPER for marker deletion
   * @param req 
   * @returns 
   */
  async getDocketsMappedForPoMarker(req: PoRatioIdMarkerIdRequest): Promise<MarkerSpecificDocketsResponse> {
    const docsForMarker = await this.poDocketRepo.find({ select: ['docketNumber'], where: { companyCode: req.companyCode, unitCode: req.unitCode, poSerial: req.poSerial, poMarkerId: req.poMarkerId } });
    const dockets = docsForMarker.map(r => r.docketNumber);
    return new MarkerSpecificDocketsResponse(true, 0, 'Marker specific docket numbers are retrieved', dockets);
  }

  /**
   * READER
   * HELPER for updating or reverting cut status for a lay
   * @param docketNumber 
   * @param cutStatus 
   * @param companyCode 
   * @param unitCode 
   * @returns 
   */
  async getDocBundleRecordsCountByDocketNumberAndCutStatus(docketNumbers: string[], cutStatus: CutStatusEnum, companyCode: string, unitCode: string): Promise<number> {
    const docBundles = await this.poDocBundleRepo.count({ where: { docketNumber: In(docketNumbers), companyCode: companyCode, unitCode: unitCode, cutStatus: cutStatus } });
    return docBundles;
  }



  /**
   * 
   * @param poSerial 
   * @param companyCode 
   * @param unitCode 
   */
  async getPoColorSizePanelSerialNumbers(poSerial: number, physicalEntityType: PhysicalEntityTypeEnum, companyCode: string, unitCode: string, transManager: GenericTransactionManager): Promise<PoDocketSerialsEntity[]> {
    if (transManager) {
      return await transManager.getRepository(PoDocketSerialsEntity).find({ where: { companyCode: companyCode, unitCode: unitCode, poSerial: poSerial, entityType: physicalEntityType } });
    } else {
      return await this.poColorSizePanelSerialRepo.find({ where: { companyCode: companyCode, unitCode: unitCode, poSerial: poSerial, entityType: physicalEntityType } });
    }
  }

  async getPoPanelSerialNumbers(poSerial: number, physicalEntityType: PhysicalEntityTypeEnum, companyCode: string, unitCode: string, transManager: GenericTransactionManager): Promise<PoComponentSerialsEntity[]> {
    if (transManager) {
      return await transManager.getRepository(PoComponentSerialsEntity).find({ where: { companyCode: companyCode, unitCode: unitCode, poSerial: poSerial, entityType: physicalEntityType } });
    } else {
      return await this.poPanelSerialRepo.find({ where: { companyCode: companyCode, unitCode: unitCode, poSerial: poSerial, entityType: physicalEntityType } });
    }
  }

  /**
   * READER
   * ENDPOINT
   * Used for dropdown purpose 
   * @param req 
   * @returns 
   */
  async getDocketNumbersForPo(req: PoSerialRequest): Promise<DocketNumberResponse> {
    const { unitCode, companyCode } = req;
    const docketsResp: DocketNumberModel[] = [];
    const poDockets = await this.poDocketRepo.find({ select: ['docketNumber', 'poSerial', 'productName', 'mainDocket', 'itemCode', 'docketGroup', 'color'], where: { poSerial: req.poSerial, unitCode, companyCode, isActive: true } });
    const poProductOpsVersionDetailMap = new Map<number, Map<string, OpVersionModel>>();
    for (const poDocket of poDockets) {
      // const components = await this.poDocBundleRepo.getComponentsInvolvedInDocket(req.poSerial, poDocket.docketNumber, companyCode, unitCode);
      const docketAttrs = await this.getDocketAttrByDocNumber(poDocket.docketNumber, companyCode, unitCode);
      const components = docketAttrs.COMPS.split(',');
      const embOperations = new Set<string>();
      if (!poProductOpsVersionDetailMap.has(poDocket.poSerial)) {
        poProductOpsVersionDetailMap.set(poDocket.poSerial, new Map<string, OpVersionModel>());
      }
      if (!poProductOpsVersionDetailMap.get(poDocket.poSerial).has(poDocket.productName)) {
        const opsInfo = await this.helperService.getOpVersionsForPo(poDocket.poSerial, poDocket.productName, null, poDocket.color, companyCode, unitCode);
        poProductOpsVersionDetailMap.get(poDocket.poSerial).set(poDocket.productName, opsInfo);
      }
      const opsVersion = poProductOpsVersionDetailMap.get(poDocket.poSerial).get(poDocket.productName);
      opsVersion.operations.forEach(op => {
        // if (op.opCategory == OpCategoryEnum.EMB && op.opForm == OpFormEnum.PF) {
        //   const groupInfo = opsVersion.opGroups.find(g => g.operations.includes(op.opCode))
        //   groupInfo?.components?.forEach(comp => {
        //     if (components?.includes(comp)) {
        //       embOperations.add(op.opCode);
        //     }
        //   });
        // }
      });

      const cutNumberRecords = await this.helperService.getCutDocketRecordsForDockets([poDocket.docketNumber], companyCode, unitCode);
      const cutNumbers = cutNumberRecords.map(r => r.cutNumber);
      const docketNumberObj = new DocketNumberModel(poDocket.docketNumber, components, poDocket.itemCode, null, embOperations.size ? true : false, [...embOperations], false, false, cutNumbers, poDocket.mainDocket, poDocket.productName, poDocket.docketGroup, poDocket.color);
      docketsResp.push(docketNumberObj);
    }
    return new DocketNumberResponse(true, 0, 'Dockets Info retrieved successfully for the PO', docketsResp)
  }

  // Used while during the cut generation
  // gets the associated dockets for a given ref docket based on the color and size wise panels mapping.
  async getRelatedDocketsMappedForRefDocket(poSerial: number, docketNumber: string, companyCode: string, unitCode: string): Promise<string[]> {
    const relativeDockets = new Set<string>();
    const allProdNameDocNumbers: string[] = [];
    const docRecord = await this.poDocketRepo.findOne({ where: { poSerial: poSerial, docketNumber: docketNumber, companyCode: companyCode, unitCode: unitCode } });
    if (!docRecord) {
      throw new ErrorResponse(0, `Docket ${docketNumber} is not found`);
    }
    const docAttrs = await this.getDocketAttrByDocNumber(docketNumber, companyCode, unitCode);
    const allDocketRecsInPo = await this.poDocketRepo.find({ select: ['docketNumber'], where: { poSerial: poSerial, companyCode: companyCode, unitCode: unitCode, productName: docRecord.productName } });
    allDocketRecsInPo.forEach(r => allProdNameDocNumbers.push(r.docketNumber));
    const compSizePanels = await this.poDocBundleRepo.getSizeWiseMinAndMaxPanelNumberOfDocket(poSerial, docketNumber, companyCode, unitCode);
    const reqOfComp = new PoItemRefCompProductModel(null, unitCode, companyCode, null, poSerial, undefined, docRecord.productName, docRecord.color, undefined)
    const compsForPo = await this.helperService.getRefComponentsForPoAndProduct(reqOfComp);
    if (!compsForPo.status) {
      throw new ErrorResponse(0, `OES Says ${compsForPo.internalMessage}`)
    }
    const components = new Set<string>();
    compsForPo.data.refComponent.split(',').forEach(r => {
      components.add(r);
    });
    // const components = [docRecord.refComponent]
    console.log(components);
    for (const rec of compSizePanels) {
      for (const comp of components) {
        // skip the main components. since those are already covered
        if (comp != rec.component) {
          // get the matching dockets based on the product name + component + size
          console.log(poSerial, docRecord.productName, docRecord.color, comp, rec.size, rec.min_panel, rec.max_panel, companyCode, unitCode)
          const otherDockets = await this.poDocBundleRepo.getDocketsForCompSizeMinMaxPanelNumbers(poSerial, docRecord.productName, docRecord.color, comp, rec.size, rec.min_panel, rec.max_panel, companyCode, unitCode);
          console.log(otherDockets);
          otherDockets.forEach(doc => relativeDockets.add(doc));
        }
      }
    }
    return relativeDockets.size ? Array.from(relativeDockets) : [];
  }

  async getSizeRatiosByDocketNumber(docketNumber: string, companyCode: string, unitCode: string): Promise<PoRatioSizeModel[]> {
    const docketInfo = await this.poDocketRepo.findOne({ where: { docketNumber, unitCode, companyCode } });
    const reqObj = new PoRatioIdRequest(null, unitCode, companyCode, null, docketInfo.poSerial, docketInfo.poRatioId);
    const ratioInfo = await this.helperService.getRatioDetailedInfoForRatioId(reqObj);
    const currentRatio: PoRatioModel = ratioInfo[0];
    return currentRatio.rLines[0].sizeRatios;
  }

  // END POINT
  // Used only for docket print purpose
  async getDocketDetailedInfo(req: PoDocketGroupRequest): Promise<DocketDetailedInfoResponse> {
    if (!req.docketGroup) {
      throw new ErrorResponse(0, 'Docket number is not provided');
    }
    const { unitCode, companyCode } = req;
    const docketRecord = await this.poDocketRepo.findOne({ where: { unitCode, companyCode, docketGroup: req.docketGroup, isActive: true } });
    if (!docketRecord) {
      throw new ErrorResponse(0, 'No dockets found for the given po and product name');
    }
    // get all the basic docket info for the docket
    const docketBasicInfo: DocketBasicInfoModel[] = await this.constructTheDocketBasicInfoRespByEntity([docketRecord], req.username, docketRecord.poSerial, req.userId, unitCode, companyCode, false, false);
    // get all the docket layed rolls
    // const docketLayingInfo = await this.helperService.getDocketLayModels(req.docketNumber, req.companyCode, req.unitCode, req.iNeedAllocatedRollsAlso);
    // get all the co info against to the mo and mo lines of the production-order
    const poOrderAttrs = await this.helperService.getMoCustomerPoInfoForPoSerial(docketRecord.poSerial, req.companyCode, req.unitCode);
    const docketMaterials = await this.helperService.getDocketAllocatedRollsForDocketGroup(docketRecord.docketGroup, req.companyCode, req.unitCode);
    const fabricDetailsForProd = await this.helperService.getPoProdTypeAndFabricsForProductName(docketRecord.poSerial, docketRecord.productName, req.companyCode, req.unitCode);
    const totalItemCodes: CutRmModel[] = [];
    for (const fabInfo of fabricDetailsForProd) {
      if (fabInfo.productName == docketRecord.productName) {
        for (const eachItem of fabInfo.iCodes) {
          totalItemCodes.push(eachItem);
        }
      }
    }
    const docFabricModel = totalItemCodes?.find(i => i.iCode == docketRecord?.itemCode && i.fgColor == docketRecord?.color);
    const docketDetailInfoModel = new DocketDetailedInfoModel(docketBasicInfo[0], poOrderAttrs, docketMaterials, docFabricModel);
    return new DocketDetailedInfoResponse(true, 0, 'Docket detailed info retrieved', [docketDetailInfoModel]);
  }











  /**
   * Service to get docket basic info for the PO
   * UNUSED
   * @param req 
   * @returns 
  */
  async getDocketGroupsBasicInfoForPo(req: PoProdutNameRequest): Promise<DocketGroupBasicInfoResponse> {
    const { unitCode, companyCode } = req;
    try {
      // if prod name, then filter only those dockets. else send back all dockets for the PO
      const docketDetailsByPoProd = await this.poDocketRepo.find({ where: { poSerial: req.poSerial, productName: req.productName, unitCode, companyCode } });
      if (!docketDetailsByPoProd.length) {
        throw new ErrorResponse(0, 'No dockets found for the given po and product name')
      }
      const docketGroups = docketDetailsByPoProd.map(r => r.docketGroup);
      const docGroups = await this.poDocGroupRepo.find({ where: { unitCode, companyCode, docketGroup: In(docketGroups), isActive: true } });
      const docketBasicInfo: DocketGroupBasicInfoModel[] = await this.constructTheDocketGroupBasicInfoRespByEntity(docGroups, req.username, req.poSerial, req.userId, unitCode, companyCode, req.iNeedDocketFabricInfo)
      return new DocketGroupBasicInfoResponse(true, 0, 'Docket Info Retrieved Successfully.', docketBasicInfo);
    } catch (err) {
      throw err;
    }
  }


  /**
   * TODO: Need to get the sizes info information only if asked in the request. Add i need sizes in the request object.
   * UNUSED
   * @param req 
   * @returns 
   */
  async getDocketGroupsBasicInfoForDocketGroup(req: PoDocketGroupRequest): Promise<DocketGroupBasicInfoResponse> {
    const { unitCode, companyCode } = req;
    const docketDetailsByPoProd = await this.poDocGroupRepo.find({ where: { docketGroup: req.docketGroup, unitCode, companyCode } });
    if (!docketDetailsByPoProd.length) {
      throw new ErrorResponse(0, 'No dockets found for the given po and product name')
    }
    const docketBasicInfo: DocketGroupBasicInfoModel[] = await this.constructTheDocketGroupBasicInfoRespByEntity(docketDetailsByPoProd, req.username, docketDetailsByPoProd[0].poSerial, req.userId, unitCode, companyCode, req.iNeedFabricInfoAlso);
    return new DocketGroupBasicInfoResponse(true, 0, 'Docket Info Retrieved Successfully.', docketBasicInfo)
  }

  /**
   * READER
   * END POINT
   * @param req 
   */
  async getDocketGroupDetailedInfo(req: PoDocketGroupRequest): Promise<DocketGroupDetailedInfoResponse> {
    if (!req.docketGroup) {
      throw new ErrorResponse(0, 'Docket group is not provided');
    }
    const { unitCode, companyCode } = req;
    const docGroups = await this.poDocGroupRepo.find({ where: { unitCode, companyCode, docketGroup: req.docketGroup, isActive: true } });
    if (docGroups.length == 0) {
      throw new ErrorResponse(0, 'No dockets found for the given docket group');
    }
    const docketGroupBasicInfo = await this.constructTheDocketGroupBasicInfoRespByEntity(docGroups, req.username, docGroups[0].poSerial, req.userId, unitCode, companyCode, false);
    const poOrderAttrs = await this.helperService.getMoCustomerPoInfoForPoSerial(docGroups[0].poSerial, req.companyCode, req.unitCode);
    const docketMaterials = await this.helperService.getDocketAllocatedRollsForDocketGroup(req.docketGroup, req.companyCode, req.unitCode);


    const docGroupFabModels: CutRmModel[] = [];
    const docketRecords = await this.poDocketRepo.find({ where: { unitCode, companyCode, docketGroup: req.docketGroup, isActive: true } });
    for (const doc of docketRecords) {
      const fabricDetailsForProd = await this.helperService.getPoProdTypeAndFabricsForProductName(doc.poSerial, doc.productName, req.companyCode, req.unitCode);
      const totalItemCodes: CutRmModel[] = [];
      for (const fabInfo of fabricDetailsForProd) {
        if (fabInfo.productName == doc.productName) {
          for (const eachItem of fabInfo.iCodes) {
            totalItemCodes.push(eachItem);
          }
        }
      }
      const docFabricModel = totalItemCodes?.find(i => i.iCode == doc?.itemCode && i.fgColor == doc?.color);
      docGroupFabModels.push(docFabricModel);
    }
    const docGroupDetailModel = new DocketGroupDetailedInfoModel(docketGroupBasicInfo[0], poOrderAttrs, docketMaterials, docGroupFabModels);
    return new DocketGroupDetailedInfoResponse(true, 0, 'Docket group detailed info retrieved', [docGroupDetailModel]);
  }

  // HELPER
  // NOT AN ENDPOINT
  async constructTheDocketGroupBasicInfoRespByEntity(docketGroupEnts: PoDocketGroupEntity[], username: string, poSerial: number, userId: number, unitCode: string, companyCode: string, iNeedDocketFabricInfo: boolean): Promise<DocketGroupBasicInfoModel[]> {
    const ratioIdDetailsMap = new Map<number, PoRatioModel>();
    const markerVersionMap = new Map<number, PoMarkerModel>();
    const docketGroupBasicInfo: DocketGroupBasicInfoModel[] = [];

    const basicInfoModels: DocketGroupBasicInfoModel[] = [];
    for (const docGroup of docketGroupEnts) {
      const docketRecords = await this.poDocketRepo.find({ where: { unitCode, companyCode, docketGroup: docGroup.docketGroup, isActive: true } });
      if (docketRecords.length == 0) {
        throw new ErrorResponse(0, 'No dockets found for the given docket group');
      }

      const docketNos = docketRecords.map(d => d.docketNumber);
      const cutNumbersForDocs = await this.helperService.getCutDocketRecordsForDockets(docketNos, companyCode, unitCode);
      const docCutNumMap = new Map<string, { cutNumber: number, cutSubNumber: number }>();
      cutNumbersForDocs.forEach(r => {
        // putting this condition just to ensure that we get the very first cut number for a docket.(If a docket is span accross multiple cuts)
        if (!docCutNumMap.has(r.docketNumber)) {
          docCutNumMap.set(r.docketNumber, { cutNumber: r.cutNumber, cutSubNumber: r.cutSubNumber });
        }
      });

      const fabrInfoMap = new Map<string, Map<string, CutRmModel>>(); //prod name => item code => item info
      if (iNeedDocketFabricInfo) {
        // if we pass the prod name as empty then
        const fabInfo = await this.helperService.getPoProdTypeAndFabricsForPoSerial(poSerial, companyCode, unitCode);
        fabInfo.forEach(p => {
          if (!fabrInfoMap.has(p.productName)) {
            fabrInfoMap.set(p.productName, new Map<string, CutRmModel>());
          }
          p.iCodes.forEach(i => {
            fabrInfoMap.get(p.productName).set(i.iCode, i);
          });
        })
      }

      const randomDocInGroup = docketRecords[0];
      if (!ratioIdDetailsMap.has(randomDocInGroup.poRatioId)) {
        const reqObj = new PoRatioIdRequest(username, unitCode, companyCode, userId, poSerial, randomDocInGroup.poRatioId);
        const ratioInfo = await this.helperService.getRatioDetailedInfoForRatioId(reqObj);
        const currentRatio: PoRatioModel = ratioInfo[0];
        ratioIdDetailsMap.set(randomDocInGroup.poRatioId, currentRatio);
      }
      if (!markerVersionMap.has(randomDocInGroup.poMarkerId)) {
        const markerReq = new MarkerIdRequest(username, unitCode, companyCode, userId, randomDocInGroup.poMarkerId);
        const markerDetails: MarkerInfoModel = await this.helperService.getPoMarker(markerReq);
        const poMarkerModel = new PoMarkerModel(markerDetails.id, markerDetails.markerName, markerDetails.markerVersion, markerDetails.mWidth, markerDetails.mLength, markerDetails.patVer, markerDetails.defaultMarker, markerDetails.endAllowance, markerDetails.perimeter, markerDetails.remarks1, markerDetails.remarks2);
        markerVersionMap.set(randomDocInGroup.poMarkerId, poMarkerModel);
      }

      const totalLayedPliesRecs = await this.helperService.getLayReportedPliesPerDocketOfGivenDocketGroups([docGroup.docketGroup], companyCode, unitCode);
      let totalLayedPlies = 0;
      totalLayedPliesRecs.forEach(r => {
        totalLayedPlies += Number(r.layed_plies);
      });

      const allocatedQty = await this.helperService.getAllocatedQtyForDocketGroup(docGroup.docketGroup, unitCode, companyCode);
      const ratioDetails = ratioIdDetailsMap.get(randomDocInGroup.poRatioId);
      const basicInfo = new DocketGroupBasicInfoModel();
      basicInfo.docketGroup = docGroup.docketGroup;
      basicInfo.markerInfo = markerVersionMap.get(randomDocInGroup.poMarkerId);
      basicInfo.plies = randomDocInGroup.plies;
      basicInfo.poSerial = poSerial;
      basicInfo.ratioDesc = ratioDetails.rDesc;
      basicInfo.ratioId = ratioDetails.id;
      basicInfo.ratioName = ratioDetails.rName;
      basicInfo.sizeRatios = ratioDetails.rLines[0].sizeRatios;
      basicInfo.totalIssuedMrCount = 0;
      basicInfo.totalMrCount = 0;
      basicInfo.allocatedQty = Number(allocatedQty.toFixed(2));
      // to be corrected for the color club docket
      basicInfo.originalDocQuantity = randomDocInGroup.plies * randomDocInGroup.plannedBundles;
      basicInfo.isMainDoc = randomDocInGroup.mainDocket;
      basicInfo.layedPlies = totalLayedPlies;
      basicInfo.completeBindingDocket = randomDocInGroup.isBinding;
      basicInfo.materialRequirement = 0;
      basicInfo.bindingConsumption = 0;
      basicInfo.cutWastage = 0;
      // added for to change required material Quantity by using actualMarkerLength
      basicInfo.reqWithOutWastage = 0;
      basicInfo.bindReqWithOutWastage = 0;
      basicInfo.actualMaterialRequirement = 0;
      basicInfo.remark = docGroup.remarks;

      const moLines = new Set<string>();
      const moNos = new Set<string>();
      const docAndFabHelperModels: DocketAndFabHelperModel[] = [];
      for (const docketInfo of docketRecords) {
        const docAttrs = await this.getDocketAttrByDocNumber(docketInfo.docketNumber, companyCode, unitCode);
        docAttrs.MOLINES?.split(',').forEach(s => {
          moLines.add(s);
        });
        moNos.add(docAttrs.MO);

        const fabInfo = fabrInfoMap?.get(docketInfo.productName)?.get(docketInfo.itemCode);
        basicInfo.bindingConsumption += fabInfo?.bindingConsumption ? Number(fabInfo?.bindingConsumption) : 0;
        basicInfo.cutWastage += fabInfo?.wastage ? Number(fabInfo?.wastage) : 0;
        let itemDesc = '';
        ratioDetails.rLines.forEach(rL => rL.ratioFabric.forEach(f => f.iCode == docketInfo.itemCode ? itemDesc = f.iDesc : null));
        const docAndFabHelperModel = new DocketAndFabHelperModel();
        // find the ratio line that is matching with the prod name 
        const ratioLine = ratioDetails.rLines.find(l => l.productName == docketInfo.productName);
        docAndFabHelperModel.components = ratioLine?.components ?? [];
        docAndFabHelperModel.cutNumber = docCutNumMap.get(docketInfo.docketNumber)?.cutNumber ?? 0;
        docAndFabHelperModel.cutSubNumber = docCutNumMap.get(docketInfo.docketNumber)?.cutSubNumber ?? 0;
        docAndFabHelperModel.docketNumber = docketInfo.docketNumber;
        docAndFabHelperModel.itemCode = docketInfo.itemCode;
        docAndFabHelperModel.itemDesc = itemDesc;
        docAndFabHelperModel.productType = docketInfo.productType;
        docAndFabHelperModel.productDesc = '';
        docAndFabHelperModel.fgColor = docketInfo.color;
        docAndFabHelperModel.productName = docketInfo.productName;
        docAndFabHelperModel.totalBundles = docketInfo.plannedBundles;
        docAndFabHelperModels.push(docAndFabHelperModel);
      }

      // actualMarkerInfo must kept on top only 
      // get the actual marker info
      const actualMarkerModels = await this.helperService.getActualMarkerForDocketGroup(companyCode, unitCode, [docGroup.docketGroup])
      basicInfo.actualMarkerInfo = actualMarkerModels[0];



      if (iNeedDocketFabricInfo) {
        basicInfo.fabricInfo = fabrInfoMap?.get(randomDocInGroup.productName)?.get(randomDocInGroup.itemCode);
        console.log(basicInfo, 'basicInfo')
        const reqWithOutWastage = docketRequirementWithoutBinding(randomDocInGroup.plies, Number(basicInfo.markerInfo.mLength), Number(basicInfo.fabricInfo.wastage));
        const bindReqWithOutWastage = docketBindingRequirement((randomDocInGroup.plies * randomDocInGroup.plannedBundles * docketRecords.length), Number(basicInfo.fabricInfo.bindingConsumption), Number(basicInfo.fabricInfo.wastage));
        basicInfo.materialRequirement = Number((reqWithOutWastage + bindReqWithOutWastage).toFixed(2));
        const materialRequirementActual = docketRequirementWithoutBinding(randomDocInGroup.plies, Number(basicInfo.actualMarkerInfo?.markerLength), Number(basicInfo.fabricInfo.wastage));
        // added for to change required material by using actualMarkerLength
        basicInfo.reqWithOutWastage = reqWithOutWastage;
        basicInfo.bindReqWithOutWastage = bindReqWithOutWastage;
        basicInfo.actualMaterialRequirement = Number(basicInfo.actualMarkerInfo?.markerLength)
          ? Number((materialRequirementActual + bindReqWithOutWastage).toFixed(2))
          : 0;
      }

      basicInfo.mo = Array.from(moNos).toString();
      basicInfo.moLines = Array.from(moLines);
      basicInfo.docketNumbers = docAndFabHelperModels;




      basicInfoModels.push(basicInfo);
    }
    return basicInfoModels;
  }


  async getDocketWiseRequirementInformation(docketNumbers: string[], userId: number, unitCode: string, companyCode: string): Promise<number> {
    const ratioIdDetailsMap = new Map<number, PoRatioModel>();
    const markerVersionMap = new Map<number, PoMarkerModel>();
    // const basicInfoModels: DocketAndRequriementModel[] = [];
    let totalRequiement = 0;
    for (const docket of docketNumbers) {
      const docketRecords = await this.poDocketRepo.find({ where: { unitCode, companyCode, docketNumber: docket, isActive: true } });
      if (docketRecords.length == 0) {
        throw new ErrorResponse(0, 'No dockets found for the given docket group');
      }

      const fabrInfoMap = new Map<string, Map<string, CutRmModel>>(); //prod name => item code => item info
      // if we pass the prod name as empty then
      let poSerial;
      let docketGroup;
      for (const docket of docketRecords) {
        poSerial = docket.poSerial;
        docketGroup = docket.docketGroup;
        const fabInfo = await this.helperService.getPoProdTypeAndFabricsForPoSerial(docket.poSerial, companyCode, unitCode);
        fabInfo.forEach(p => {
          if (!fabrInfoMap.has(p.productName)) {
            fabrInfoMap.set(p.productName, new Map<string, CutRmModel>());
          }
          p.iCodes.forEach(i => {
            fabrInfoMap.get(p.productName).set(i.iCode, i);
          });
        })
      }

      // const basicInfo = new DocketAndRequriementModel();
      const randomDocInGroup = docketRecords[0];
      if (!ratioIdDetailsMap.has(randomDocInGroup.poRatioId)) {
        const reqObj = new PoRatioIdRequest('username', unitCode, companyCode, userId, poSerial, randomDocInGroup.poRatioId);
        const ratioInfo = await this.helperService.getRatioDetailedInfoForRatioId(reqObj);
        const currentRatio: PoRatioModel = ratioInfo[0];
        ratioIdDetailsMap.set(randomDocInGroup.poRatioId, currentRatio);
      }
      if (!markerVersionMap.has(randomDocInGroup.poMarkerId)) {
        const markerReq = new MarkerIdRequest('username', unitCode, companyCode, userId, randomDocInGroup.poMarkerId);
        const markerDetails: MarkerInfoModel = await this.helperService.getPoMarker(markerReq);
        const poMarkerModel = new PoMarkerModel(markerDetails.id, markerDetails.markerName, markerDetails.markerVersion, markerDetails.mWidth, markerDetails.mLength, markerDetails.patVer, markerDetails.defaultMarker, markerDetails.endAllowance, markerDetails.perimeter, markerDetails.remarks1, markerDetails.remarks2);
        markerVersionMap.set(randomDocInGroup.poMarkerId, poMarkerModel);
      }

      let materialRequirement = 0;
      let markerInfo = markerVersionMap.get(randomDocInGroup.poMarkerId);
      // added for to change required material Quantity by using actualMarkerLength
      let reqWithOutWastage = 0;
      let bindReqWithOutWastage = 0;
      let actualMaterialRequirement = 0;
      // actualMarkerInfo must kept on top only 
      // get the actual marker info
      const actualMarkerModels = await this.helperService.getActualMarkerForDocketGroup(companyCode, unitCode, [docketGroup])
      let actualMarkerInfo = actualMarkerModels[0];

      let fabricInfo = fabrInfoMap?.get(randomDocInGroup.productName)?.get(randomDocInGroup.itemCode);
      // console.log(basicInfo, 'basicInfo')
      reqWithOutWastage = docketRequirementWithoutBinding(randomDocInGroup.plies, Number(markerInfo.mLength), Number(fabricInfo.wastage));
      bindReqWithOutWastage = docketBindingRequirement((randomDocInGroup.plies * randomDocInGroup.plannedBundles * docketRecords.length), Number(fabricInfo.bindingConsumption), Number(fabricInfo.wastage));
      materialRequirement = Number((reqWithOutWastage + bindReqWithOutWastage).toFixed(2));
      const materialRequirementActual = docketRequirementWithoutBinding(randomDocInGroup.plies, Number(actualMarkerInfo?.markerLength), Number(fabricInfo.wastage));
      // added for to change required material by using actualMarkerLength
      reqWithOutWastage = reqWithOutWastage;
      bindReqWithOutWastage = bindReqWithOutWastage;
      actualMaterialRequirement = Number(actualMarkerInfo?.markerLength)
        ? Number((materialRequirementActual + bindReqWithOutWastage).toFixed(2))
        : 0;

      // console.log(materialRequirement+'--planned');
      // console.log(actualMaterialRequirement+'--actal');
      // basicInfo.docketNumber = docket;
      if (actualMaterialRequirement === 0) {
        totalRequiement = totalRequiement + materialRequirement;
      } else {
        totalRequiement = totalRequiement + actualMaterialRequirement;
      }

      // basicInfoModels.push(basicInfo);
    }
    return totalRequiement;
  }


  async getDataForMainHeader(req: DocketGroupResponseModel): Promise<DocketHeaderResponse> {
    try {
      const totalDocketsGeneratedToday = await this.poDocketRepo.getTotalDocketGeneratedTodayInfo(req.unitCode, req.companyCode, req.date);
      // const dockets: string[] = totalDocketsGeneratedToday.map((docket) => docket.docketNumber);
      const dockets: string[] = totalDocketsGeneratedToday.map((docket) => docket.docketNumber);
      console.log(dockets);
      let materialRequirement = 0;
      if (dockets.length > 0) {
        materialRequirement = await this.getDocketWiseRequirementInformation(dockets, req.userId, req.unitCode, req.companyCode);
      }
      const totalMaterialAllocatedDocketsToday = await this.DocketMaterialInfoService.getTotalMaterialAllocatedDocketsTodayInfo(req);
      const totalMaterialAllocatedDocketsTodayRolls = await this.DocketMaterialInfoService.getTotalMaterialAllocatedDocketsTodayInfoRolls(req);
      const balanceAllocation = (materialRequirement - totalMaterialAllocatedDocketsToday).toFixed(2);

      const totalDocketsPlannedToday = await this.DocketPlanningInfoService.getTotalDocketsToday(req);
      let totalPlannedIssuance = 0;
      let totalPlannedIssuanceRolls = 0;
      if (totalDocketsPlannedToday.length > 0) {
        totalPlannedIssuance = await this.DocketMaterialInfoService.getTotalQuantityofRequest(totalDocketsPlannedToday, req.unitCode, req.companyCode);
        totalPlannedIssuanceRolls = await this.DocketMaterialInfoService.getTotalRollsofRequest(totalDocketsPlannedToday, req.unitCode, req.companyCode);
      }
      // const requestNumber: string[] = totalDocketsPlannedToday.data.map(d =>d.requestNumber);

      // const quanityInfo = await this.poDocMaterialRepo.getTotalMeterageofRequestsRepo(req.unitCode, req.companyCode, totalDocketsPlannedToday);
      const plannedInfo = new DocketQuantityInformation(materialRequirement, totalMaterialAllocatedDocketsToday, Number(balanceAllocation), totalPlannedIssuance, totalPlannedIssuanceRolls, 1, 1);
      return new DocketHeaderResponse(true, 0, 'Docket Confirmation List Retrieved Successfully', plannedInfo);
    } catch (err) {
      throw err;
    }
  }

  async getKPICardDetailsForCadAndPlanning(req: DocketGroupResponseModel): Promise<DocketsCardDetailsResponse> {
    try {
      // const totalDocketsGeneratedToday = await this.poDocketRepo.getTotalDocketsGeneratedToday(req.unitCode, req.companyCode, req.date);
      const totalDocketsGeneratedToday = await this.poDocketRepo.getTotalDocketGeneratedTodayInfo(req.unitCode, req.companyCode, req.date);
      // const dockets: string[] = totalDocketsGeneratedToday.map((docket) => docket.docketNumber);
      const dockets: string[] = totalDocketsGeneratedToday.map((docket) => docket.docketNumber);
      // console.log(dockets);
      let materialRequirement = 0;
      if (dockets.length > 0) {
        materialRequirement = await this.getDocketWiseRequirementInformation(dockets, req.userId, req.unitCode, req.companyCode);
      }
      const totalMaterialAllocatedDocketsToday = await this.DocketMaterialInfoService.getTotalMaterialAllocatedDocketsToday(req);
      // console.log(totalMaterialAllocatedDocketsToday);
      const totalMaterialAllocatedDocketsTodayQty = await this.DocketMaterialInfoService.getTotalMaterialAllocatedDocketsTodayInfo(req);
      // console.log(totalMaterialAllocatedDocketsTodayQty);
      const totalDocketsPlannedToday = await this.DocketPlanningInfoService.getTotalDocketsPlannedToday(req);
      // console.log(totalDocketsPlannedToday);
      const totalMaterialAllocatedDocketsTodayLength = totalMaterialAllocatedDocketsToday ? totalMaterialAllocatedDocketsToday : 0;
      const totalMaterialAllocatedDocketsTodayLengthQty = totalMaterialAllocatedDocketsTodayQty ? totalMaterialAllocatedDocketsTodayQty : 0;
      const totalDocketsPlannedTodayLength = totalDocketsPlannedToday?.data?.totalPlannedCuts ? totalDocketsPlannedToday.data.totalPlannedCuts : 0;
      const totalDocketsPlannedTodayLengthQty = totalDocketsPlannedToday?.data?.totalPlannedQty ? totalDocketsPlannedToday.data.totalPlannedQty : 0;
      // Create the response model for docket confirmation list

      const confirmList = null;
      // const confirmList = new DocketsCardDetailsListModel(totalDocketsGeneratedToday, totalMaterialAllocatedDocketsToday.data.length,  totalDocketsPlannedToday.data.length);
      return new DocketsCardDetailsResponse(true, 0, 'Docket Confirmation List Retrieved Successfully', confirmList);
    } catch (err) {
      throw err;
    }
  }


  async getTotalLayedCuts(req: LayerMeterageRequest): Promise<LayedCutsResponse> {
    const data = await this.poDocketRepo.getTotalLayedCutsInfoRepo(req.unitCode, req.companyCode, req.docketGroup);
    return new LayedCutsResponse(true, 123, "Total layed cuts data retrieved", data)
  }

  // Bundling Helper
  async getCutReportedPanelsForBundlingByDocket(docNumber: string, companyCode: string, unitCode: string): Promise<DOC_ElgPanelsForBundlingQueryResponse[]> {
    return await this.poDocPanelRepo.getCutReportedPanelsForBundlingByDocket(docNumber, 0, [], companyCode, unitCode);
  }

  // Bundling Helper
  async getCutReportedPanelsForBundlingByActualDocket(docNumber: string, underDocLayNumber: number, companyCode: string, unitCode: string): Promise<DOC_ElgPanelsForBundlingQueryResponse[]> {
    return await this.poDocPanelRepo.getCutReportedPanelsForBundlingByDocket(docNumber, underDocLayNumber, [], companyCode, unitCode);
  }

  // Bundling Helper
  async getCutReportedPanelsForBundlingByPslIds(procSerial: number, pslIds: number[], refComp: string, companyCode: string, unitCode: string): Promise<DOC_ElgPanelsForBundlingQueryResponse[]> {
    return await this.poDocPanelRepo.getCutReportedPanelsForBundlingByPslIds(procSerial, refComp, pslIds, companyCode, unitCode);
  }

  // Bundling Helper
  async getDistinctComponentsForPoSerialProdTypeAndColor(poSerial: number, prodName: string, fgColor: string, companyCode: string, unitCode: string): Promise<string[]> {
    const recs = await this.poColorSizePanelSerialRepo.find({ select: ['component'], where: { companyCode, unitCode, poSerial: poSerial, productName: prodName, color: fgColor } });
    const comps = new Set<string>();
    recs.forEach(r => comps.add(r.component));
    return Array.from(comps);
  }

  // Bundling Helper
  async getPslIdsForDocket(docNumber: string, companyCode: string, unitCode: string): Promise<number[]> {
    const pslIdRec = await this.poDocPslRepo.find({ select: ['pslId'], where: { companyCode, unitCode, docketNumber: docNumber } });
    const psls: number[] = [];
    pslIdRec.forEach(r => psls.push(r.pslId));
    return psls;
  }

  async getDocketsForPoProdColor(poSerial: number, prodName: string, color: string, companyCode: string, unitCode: string, iNeedOnlyMainDocs: boolean): Promise<PoDocketEntity[]> {
    const docs = iNeedOnlyMainDocs ? await this.poDocketRepo.find({where: {companyCode, unitCode, productName: prodName, color: color, poSerial: poSerial, mainDocket: true}}) : await this.poDocketRepo.find({where: {companyCode, unitCode, productName: prodName, color: color, poSerial: poSerial}});
    return docs;
  }

  async getSizeWiseDocGenQtysForPoProdColorRm(poSerial: number, prodName: string, color: string, rmSku: string, companyCode: string, unitCode: string): Promise<ItemDocSizeWiseQtysQueryResponse[]> {
    return await this.poDocketRepo.getSizeWiseDocGenQtysForPoProdColorRm(poSerial, prodName, color, rmSku, companyCode, unitCode);
  }

  async getSizeWiseCutReportedQtysForDockets(poSerial: number, docketNumbers: string[], companyCode: string, unitCode: string): Promise<DOC_SizeWiseCutRepQytsQueryResponse[]> {
    return await this.poDocPanelRepo.getSizeWiseCutReportedQtysForDockets(poSerial, docketNumbers, companyCode, unitCode);
  }

  async getSizeWiseBundledQtysForDockets(poSerial: number, docketNumbers: string[], companyCode: string, unitCode: string): Promise<DOC_SizeWiseBundledQtysQueryResponse[]> {
    return await this.poDocPanelRepo.getSizeWiseBundledQtysForDockets(poSerial, docketNumbers, companyCode, unitCode);
  }
}

