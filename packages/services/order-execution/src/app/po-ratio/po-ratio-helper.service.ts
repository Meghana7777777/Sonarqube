import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { DataSource, In } from "typeorm";
import moment = require("moment");
import { CutRmModel, GlobalResponseObject, MarkerIdRequest, MarkerInfoModel, MarkerInfoResponse, PoLinesModel, PoSerialRequest, PoSizeQtysModel } from "@xpparel/shared-models";
import { PoMaterialInfoService } from "../po-material/po-material-info.service";
import { FabLevelProdNameQueryResponse } from "../po-material/repository/query-response/fab-level-prod-name.query.response";
import { PoMarkerInfoService } from "../po-marker/po-marker-info.service";
import { MarkerTypeEntity } from "../master/marker-type/entity/marker-type.entity";
import { PoMarkerEntity } from "../po-marker/entity/po-marker.entity";
import { CpsBullQueueService } from "@xpparel/shared-services";
import { PoInfoService } from "../processing-order/po-info.service";

@Injectable()
export class PoRatioHelperService {
  constructor(
    private dataSource: DataSource,
    @Inject(forwardRef(() => PoMaterialInfoService)) private poRmInfoService: PoMaterialInfoService,
    @Inject(forwardRef(() => PoInfoService)) private poInfoService: PoInfoService,
    @Inject(forwardRef(() => PoMarkerInfoService)) private poMarkerInfoService: PoMarkerInfoService,
    private cpsBullQueueService: CpsBullQueueService
  ) {
  }

  async getPoCutFabInfoForItemCode(poSerial: number, productName: string, iCode: string, companyCode: string, unitCode: string): Promise<CutRmModel> {
    return await this.poRmInfoService.getPoCutFabInfoForItemCode(poSerial, productName, iCode, companyCode, unitCode);
  }

  async getPoCutFabInfoForPo(poSerial: number, companyCode: string, unitCode: string): Promise<CutRmModel[]> {
    return await this.poRmInfoService.getPoCutFabInfoForPo(poSerial, companyCode, unitCode);
  }

  async getPoLinesBasicInfoByPoSerial(poSerial: number, companyCode: string,  unitCode: string): Promise<PoLinesModel[]> {
    return await this.poInfoService.getPoLinesBasicInfoByPoSerial(poSerial, companyCode, unitCode);
  }

  async getFabricLevelProdNameForPo(poSerial: number, companyCode: string,  unitCode: string): Promise<FabLevelProdNameQueryResponse[]> {
    return await this.poRmInfoService.getFabricLevelProdNameForPo(poSerial, companyCode, unitCode);
  }

  async getFabricLevelOqtysForPo(poSerial: number, companyCode: string, unitCode: string): Promise<Map<string, Map<string, Map<string, Map<string, PoSizeQtysModel[]>>>>> {
    return await this.poInfoService.getFabricLevelOqtysForPo(poSerial, companyCode, unitCode);
  }

  async getMarkerInfoByMarkerId(markerId: number, companyCode: string, unitCode: string): Promise<PoMarkerEntity> {
    return await this.poMarkerInfoService.getMarkerInfoByMarkerId(markerId, companyCode, unitCode);
  }

  async getClubMarkerInfoByMarkerId(poSerial: number, markerId: number, clubMarkerCode: number, companyCode: string, unitCode: string): Promise<PoMarkerEntity[]> {
    return await this.poMarkerInfoService.getClubMarkerInfoByMarkerId(poSerial, markerId, clubMarkerCode, companyCode, unitCode);
  }

  // CALL THE CPS BULL JOB MODULE TO ADD THE JOB TO THE QUEUE. SINCE this is a diff micro service, we cannot directly add the job. API is the only way
  async addPoDocketSerialGenerationJob(poSerial: number, companyCode: string, unitCode: string, username: string): Promise<GlobalResponseObject> {
    const req = new PoSerialRequest(username, unitCode, companyCode, 0, poSerial, 0, false, false);
    return await this.cpsBullQueueService.addPoDocketSerialGenerationJob(req);
  }

  async getPoMarker(poMarkerId: number, companyCode: string, unitCode: string): Promise<MarkerInfoModel> {
    const markerIdReq = new MarkerIdRequest(null, unitCode, companyCode, 0, poMarkerId);
    const markerRes = await this.poMarkerInfoService.getPoMarker(markerIdReq);
    return markerRes?.data[0];
  }
}