import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { DataSource, In } from "typeorm";
import { PoCutDocketRepository } from "./repository/po-cut-docket.repository";
import { PoCutRepository } from "./repository/po-cut.repository";
import { PoCutDocketEntity } from "./entity/po-cut-docket.entity";
import { ActualDocketBasicInfoModel, DocketBasicInfoModel, LayIdsRequest, PoCutModel, PoCutResponse, PoDocketNumberRequest, PoDocketNumbersRequest, PoSerialWithCutPrefRequest, DocketCutNumberResponse, DocketCutNumberModel, CutIdWithCutPrefRequest, LayerMeterageRequest, CommonResponse, TotalLayedCutsResponse } from "@xpparel/shared-models";
import { DocketGenerationInfoService } from "../docket-generation/docket-generation-info.service";
import { ErrorResponse } from "@xpparel/backend-utils";
import { LayReportingInfoService } from "../lay-reporting/lay-reporting-info.service";
import { CutGenerationHelperService } from "./cut-generation-helper.service";
import moment from "moment";
import { PoCutEntity } from "./entity/po-cut.entity";

@Injectable()
export class CutGenerationInfoService {
  constructor(
    private dataSource: DataSource,
    private poCutRepo: PoCutRepository,
    private poCutDocRepo: PoCutDocketRepository,
    @Inject(forwardRef(() => CutGenerationHelperService)) private cutGenHelperService: CutGenerationHelperService,
    @Inject(forwardRef(() => DocketGenerationInfoService)) private docketGenerationInfoService: DocketGenerationInfoService,



  ) {

  }

  async getCutDocketRecordsForDockets(docketNumbers: string[], companyCode: string, unitCode: string): Promise<PoCutDocketEntity[]> {
    return await this.poCutDocRepo.find({ where: { docketNumber: In(docketNumbers), unitCode: unitCode, companyCode: companyCode } });
  }

  async getCutDocketRecordsForDocket(docketNumber: string, companyCode: string, unitCode: string): Promise<PoCutDocketEntity[]> {
    return await this.poCutDocRepo.find({ where: { docketNumber: docketNumber, unitCode: unitCode, companyCode: companyCode } });
  }

  async getCutDocketRecordsForPoSerialAndCutNumbers(poSerial: number, cutNumbers: number[], companyCode: string, unitCode: string): Promise<PoCutDocketEntity[]> {
    return await this.poCutDocRepo.find({ where: { poSerial: poSerial, cutNumber: In(cutNumbers), unitCode: unitCode, companyCode: companyCode } });
  }

  /**
   * READER
   * gets the cuts and its associated dockets => actual dockets under it if mentioned in the request
   * @param req 
   * @returns 
   */
  async getCutInfoForPo(req: PoSerialWithCutPrefRequest): Promise<PoCutResponse> {
    /**
     * STRICT NOTE: actualDockets in response must be only retrieved if req.iNeedActualDockets = true
     *              dockets in response must be only retrieved if req.iNeedDockets = true
     *              When getting the actual docket info, ensure that the bundles (adBundles in the actualDockets) are not being retrieved at any cost
     * 
     * 
     * get the dockets for the cut
     * get the docket info from the docket-info.service
     * for each docket, get the actual dockets from the laying-info.service 
     * construct the response object
     */
    const { poSerial, companyCode, unitCode } = req;
    const allCutResp: PoCutModel[] = [];
    let poCuts: PoCutEntity[] = [];
    if (req.productName) {
      poCuts = await this.poCutRepo.find({ where: { poSerial, unitCode, companyCode, productName: req.productName } });
    } else {
      poCuts = await this.poCutRepo.find({ where: { poSerial, unitCode, companyCode } });
    }
    const cutModels = await this.getCutInfoModel(poCuts, req.poSerial, req.iNeedDockets, req.iNeedActualDockets, req.iNeedDocketBundles, req.iNeedActualDocketSize, companyCode, unitCode, true);
    return new PoCutResponse(true, 0, 'Cut info retrieved', cutModels);
  }

  // READER
  // NOT AN END POINT
  async getCutInfoModel(poCuts: PoCutEntity[], poSerial: number, iNeedDockets: boolean, iNeedActualDockets: boolean, iNeedActualBundles: boolean, iNeedActualDocketSize: boolean, companyCode: string, unitCode: string, docketHelpingAbstractInfoOnly: boolean = true): Promise<PoCutModel[]> {
    const allCutResp: PoCutModel[] = [];
    for (const eachCut of poCuts) {
      // get the planned qty for the ref docket i.e main docket for the cut
      const refDocket = eachCut.refDocketNumber;
      const docketRecord = await this.cutGenHelperService.getDocketRecordByDocNumber(refDocket, companyCode, unitCode);
      const refDocAttrs = await this.cutGenHelperService.getDocketAttrByDocNumber(refDocket, companyCode, unitCode);
      const cutDockets = await this.poCutDocRepo.find({ select: ['docketNumber'], where: { cutNumber: eachCut.cutNumber, poSerial, unitCode, companyCode } });
      const docketsInvolved = cutDockets.map(cut => cut.docketNumber);
      const docketsBasicInfo: DocketBasicInfoModel[] = [];
      let actualDocketsBasicInfo: ActualDocketBasicInfoModel[] = [];
      if (iNeedDockets) {
        for (const eachDocket of docketsInvolved) {
          const poDocReq = new PoDocketNumberRequest(null, unitCode, companyCode, null, poSerial, eachDocket, false, false, []);
          const docketInfo = await this.cutGenHelperService.getDocketsBasicInfoForDocketNumber(poDocReq, docketHelpingAbstractInfoOnly);
          if (!docketInfo.status) {
            throw new ErrorResponse(docketInfo.errorCode, docketInfo.internalMessage);
          }
          const docketBasicInfoModel = docketInfo.data[0];
          docketsBasicInfo.push(docketBasicInfoModel);
          if (iNeedActualDockets) {
            // const docRecord = await this.cutGenHelperService.getDocketRecordByDocNumber(refDocket, req.companyCode, req.unitCode);
            const layInfo = await this.cutGenHelperService.getLayingRecordsForDocketGroups([docketBasicInfoModel.docketGroup], companyCode, unitCode);
            if (layInfo.length > 0) {
              const layIds = layInfo.map(lay => lay.id);
              const layIdsReq = new LayIdsRequest(null, unitCode, companyCode, null, layIds, iNeedActualDocketSize, iNeedActualBundles, eachDocket);
              const adbBasicInfo = await this.cutGenHelperService.getActualDocketInfo(layIdsReq, false);
              if (!adbBasicInfo.status) {
                throw new ErrorResponse(adbBasicInfo.errorCode, adbBasicInfo.internalMessage);
              }
              // assign the cut number manually
              adbBasicInfo?.data?.forEach(r => {
                r.cutNumber = eachCut.cutNumber ?? null;
                actualDocketsBasicInfo.push(r);
              });
            }
          }
        }
      }
      let plannedCutQty = docketRecord.mainDocket ? Number(docketRecord.plies) * Number(docketRecord.plannedBundles) : 0;
      // docketsBasicInfo.forEach(d => d.isMainDoc ? cutQty += Number(d.plies) * Number(d.totalBundles) : '' );
      const cutCreatedOn = eachCut.createdAt.toString(); // moment(eachCut.createdAt).format('YYYY-MM-DD HH:MM');
      const soLines = refDocAttrs.MOLINES ? refDocAttrs.MOLINES.split(',') : [];
      const cutDrRecord = await this.cutGenHelperService.getCutDrRequestHeaderRecordForPoSerialCutNumber(poSerial, eachCut.cutNumber, companyCode, unitCode);
      const drCreated = cutDrRecord ? true : false;
      const drReqNo = cutDrRecord ? cutDrRecord.requestNumber : '';
      // After all if there are any actual dockets for the cut, then asignt he dispatch info manually
      if (actualDocketsBasicInfo.length > 0) {
        actualDocketsBasicInfo.forEach(r => {
          r.dispatchCreated = drCreated;
          r.dispatchReqNo = drReqNo;
        })
      }
      const cutResp = new PoCutModel(eachCut.id, eachCut.cutNumber.toString(), eachCut.refDocketNumber, docketsInvolved, poSerial.toString(), refDocAttrs.MO, soLines, plannedCutQty, docketRecord.plannedBundles, cutCreatedOn, drCreated, drReqNo, eachCut.productName, eachCut.fgColor, eachCut.cutSubNumber.toString(), docketsBasicInfo, actualDocketsBasicInfo);
      allCutResp.push(cutResp);
    }
    return allCutResp;
  }

  /**
   * READER
   * END POINT
   * gets the cuts and its associated dockets => actual dockets under it if mentioned in the request
   * @param req 
   * @returns 
   */
  async getCutInfoForCutIds(req: CutIdWithCutPrefRequest): Promise<PoCutResponse> {
    /**
     * STRICT NOTE: actualDockets in response must be only retrieved if req.iNeedActualDockets = true
     *              dockets in response must be only retrieved if req.iNeedDockets = true
     *              When getting the actual docket info, ensure that the bundles (adBundles in the actualDockets) are not being retrieved at any cost
     * 
     * 
     * get the dockets for the cut
     * get the docket info from the docket-info.service
     * for each docket, get the actual dockets from the laying-info.service 
     * construct the response object
     */
    if (req?.cutIds?.length == 0) {
      throw new ErrorResponse(0, 'Please provide the cut numbers to get the info');
    }
    const { companyCode, unitCode } = req;
    const poCuts = await this.poCutRepo.find({ where: { unitCode, companyCode, id: In(req.cutIds) } });
    console.log(poCuts);
    // check if the po cuts belong to different po serials
    const poSerials = new Set<number>();
    poCuts.forEach(r => {
      poSerials.add(r.poSerial);
    });
    if (poSerials.size > 1) {
      throw new ErrorResponse(0, 'Cuts provided are of multiple cut orders. Please provide single prod order related cuts');
    }
    const poSerial = poCuts[0].poSerial;
    const cutModels = await this.getCutInfoModel(poCuts, poSerial, req.iNeedDockets, req.iNeedActualDockets, req.iNeedDocketBundles, req.iNeedActualDocketSize, companyCode, unitCode, false);
    return new PoCutResponse(true, 0, 'Cut info retrieved', cutModels);
  }

  async getDocketsForPoSerialAndCutNumber(poSerial: number, cutNumber: number, companyCode: string, unitCode: string): Promise<PoCutDocketEntity[]> {
    return await this.poCutDocRepo.find({ where: { poSerial: poSerial, cutNumber: cutNumber, unitCode: unitCode, companyCode: companyCode } });
  }

  async getMainDocketsByPoSerialCutNumbers(poSerial: number, cutNumbers: number[], companyCode: string, unitCode: string): Promise<PoCutEntity[]> {
    return await this.poCutRepo.find({ where: { companyCode: companyCode, unitCode: unitCode, poSerial: poSerial, cutNumber: In(cutNumbers), isMainCut: true } });
  }

  // END POINT
  async getCutNumberForDocket(req: PoDocketNumbersRequest): Promise<DocketCutNumberResponse> {
    if (req.docketNumbers?.length <= 0) {
      throw new ErrorResponse(0, 'No dockets given in the request');
    }
    const poSerialsForDockets = await this.cutGenHelperService.getDocketRecordByDocNumbers(req.docketNumbers, req.companyCode, req.unitCode);
    const poSerials = poSerialsForDockets.map(r => r.poSerial);
    const cutNumberRecords = await this.poCutDocRepo.find({
      select: ['cutNumber', 'docketNumber', 'cutSubNumber'], where: {
        companyCode: req.companyCode, unitCode: req.unitCode,
        poSerial: In(poSerials), docketNumber: In(req.docketNumbers)
      }, order: { createdAt: 'DESC' }
    });
    const cutNumberModelsMap = new Map<string, DocketCutNumberModel>(); // docket => cut no map
    cutNumberRecords.forEach(r => {
      if (!cutNumberModelsMap.has(r.docketNumber)) {
        cutNumberModelsMap.set(r.docketNumber, new DocketCutNumberModel(r.docketNumber, r.cutNumber, r.cutSubNumber, [r.cutNumber]));
      } else {
        // do not remove this else block
        cutNumberModelsMap.get(r.docketNumber).involvedCuts.push(r.cutNumber);
      }
    });
    const docketCutModels: DocketCutNumberModel[] = [];
    cutNumberModelsMap.forEach(r => {
      docketCutModels.push(r);
    })
    return new DocketCutNumberResponse(true, 0, 'cut number retrieved for a docket', docketCutModels);
  }


  async getCutRecordsForPoProductName(poSerial: number, prodNames: string[], companyCode: string, unitCode: string): Promise<PoCutEntity[]> {
    if (prodNames.length > 0) {
      return await this.poCutRepo.find({ where: { poSerial: poSerial, productName: In(prodNames), companyCode: companyCode, unitCode: unitCode } })
    }
    return await this.poCutRepo.find({ where: { poSerial: poSerial, companyCode: companyCode, unitCode: unitCode } })
  }


  async getTotalLayedCutsToday(req: LayerMeterageRequest): Promise<TotalLayedCutsResponse> {
    const layedCuttingInfo = await this.docketGenerationInfoService.getTotalLayedCuts(req);
    const data = await this.poCutDocRepo.getTotalLayedCutsTodayRepo(req.unitCode, req.companyCode, layedCuttingInfo.data.docketNumber);
    return new TotalLayedCutsResponse(true, 345, "Total Layed Cuts data Retrieved", data)
  }
}






