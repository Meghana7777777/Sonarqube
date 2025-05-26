import { Inject, Injectable } from "@nestjs/common";
import { DataSource, In } from "typeorm";
import { AdBundleModel, CutInventoryResponse, DocketLayingTimesResponse, DocketLaysResponse, PoDocketNumberRequest, PoSerialRequest } from "@xpparel/shared-models";
import { CutReportingHelperService } from "./cut-reporting-helper.service";
import { PoAdbRepository } from "./repository/po-adb.repository";
import { PoAdbShadeRepository } from "./repository/po-adb-shade.repository";
import { PoAdbComponentRepository } from "./repository/po-adb-component.repository";
import { PoAdbComponentEntity } from "./entity/po-adb-component.entity";
import { PoAdbRollEntity } from "./entity/po-adb-roll.entity";
import { PoAdbRollRepository } from "./repository/po-adb-roll.repository";

@Injectable()
export class CutReportingInfoService {
  constructor(
    private dataSource: DataSource,
    @Inject(CutReportingHelperService)  private cutRepHelperService: CutReportingHelperService,
    private adbRepo: PoAdbRepository,
    private adbShadeRepo: PoAdbShadeRepository,
    private adbComponentRepo: PoAdbComponentRepository,
    private adbRollRepo: PoAdbRollRepository
  ) {

  }
  
  // TO Be implemented
  async getCutInventoryForPo(req: PoSerialRequest): Promise<CutInventoryResponse> {
    // first get all the dockets for the po
    // get all the components for all the dockets getDocketAttrByDocNumber()
    // maintain a map of comps => docket numbers []
    // foreach component, maintain the original planned docket comp wise in a MAP (comp => SizeInventoryModel[])
    // iterate the comps map and for each docket in the component, construct the DocketInventoryModel[]
    //    get the cut inventory for each docket size wise from the PoAdb entity
    return null;
  }

  // TO Be implemented
  async getTotalLayingTimeForPo(req: PoSerialRequest): Promise<DocketLayingTimesResponse> {
    return null;
  }

  // TO Be implemented
  async getTotalLayingTimeForDocket(req: PoDocketNumberRequest): Promise<DocketLayingTimesResponse> {
    return null;
  }

  // TO Be implemented
  async getLayAndCutStatusForDocket(req: PoDocketNumberRequest): Promise<DocketLaysResponse> {
    return null;
  }

  async getAdbInfoByLayId(layId: number, unitCode: string, companyCode: string, component: string, docketNumber: string): Promise<AdBundleModel[]> {
    const adbInfo = await this.adbRepo.find({where: {poDocketLayId: layId, unitCode, companyCode, isActive: true, docketNumber: docketNumber}});
    const adbComponent = await this.adbComponentRepo.find({where: {poDocketLayId: layId, component: component}});
    const adbIdCompMap = new Map<string, PoAdbComponentEntity>();
    for (const eachComp of adbComponent) {
      if (!adbIdCompMap.has(eachComp.adbId.toString())) {
        adbIdCompMap.set(eachComp.adbId.toString(), eachComp);
      }
    }
    const adbBasicInfo: AdBundleModel[] = [];
    for (const eachAdb of adbInfo) {
      console.log(eachAdb);
      const adbShadeBundle = await this.adbShadeRepo.find({where: {poSerial: eachAdb.poSerial, underLayAdbNumber: eachAdb.underLayAdbNumber, poDocketLayId: eachAdb.poDocketLayId, unitCode, companyCode, docketNumber: docketNumber}, order: {underLayAdbNumber: 'ASC'} });
      const adbCompInfo = adbIdCompMap.get(eachAdb.id.toString());
      let panelStartNum = adbCompInfo.panelStartNumber;
      for (const eachShadeBundle of adbShadeBundle ) {
        const adbObj = new AdBundleModel(eachShadeBundle.id, eachShadeBundle.shade, eachShadeBundle.underLayAdbNumber, eachShadeBundle.actBundleqty, null, eachAdb.size, panelStartNum, panelStartNum + eachShadeBundle.actBundleqty - 1, eachShadeBundle.barcode, adbCompInfo.component);
        panelStartNum += (eachShadeBundle.actBundleqty);
        adbBasicInfo.push(adbObj);
      }
    }
    return adbBasicInfo;
  }

  async  getAdbShadeCountForLayId(layId: number, unitCode: string, companyCode: string): Promise<number> {
    const totalAdbShades = await this.adbShadeRepo.count({ select: ['id'], where: { poDocketLayId: layId, companyCode: companyCode, unitCode: unitCode }});
    return totalAdbShades;
  }

  // Bundling Helper
  async getAdbRollsByAdbRollIds(adbIds: number[], unitCode: string, companyCode: string): Promise<PoAdbRollEntity[]> {
    return await this.adbRollRepo.find({select: ['id', 'shade', 'adbId', 'rollId'], where: {id: In(adbIds), companyCode, unitCode }});
  }

}
