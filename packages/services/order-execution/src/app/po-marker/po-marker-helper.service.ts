import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { DataSource } from "typeorm";
import moment = require("moment");
import { MarkerTypeEntity } from "../master/marker-type/entity/marker-type.entity";
import { MarkerTypService } from "../master/marker-type/marker-type.service";
import { PoProdTypeAndFabModel, PoRatioIdMarkerIdRequest, PoSerialRequest } from "@xpparel/shared-models";
import { PoRatioService } from "../po-ratio/po-ratio.service";
import { GenericTransactionManager } from "../../database/typeorm-transactions";
import { DocketGenerationServices } from "@xpparel/shared-services";
import { ErrorResponse } from "@xpparel/backend-utils";
import { PoRatioEntity } from "../po-ratio/entity/po-ratio.entity";
import { PoRatioInfoService } from "../po-ratio/po-ratio-info.service";
import { PoMaterialInfoService } from "../po-material/po-material-info.service";

@Injectable()
export class PoMarkerHelperService {
  constructor(
    private dataSource: DataSource,
    // @Inject(forwardRef(() => PoInfoService)) private poInfoService: PoInfoService,
    @Inject(forwardRef(() => PoRatioService)) private poRatioService: PoRatioService,
    @Inject(forwardRef(() => PoRatioInfoService)) private poRatioInfoService: PoRatioInfoService,
    @Inject(forwardRef(() => PoMaterialInfoService)) private poFabInfoService: PoMaterialInfoService,
    private markerTypeService: MarkerTypService,
    private docGenService: DocketGenerationServices
  ) {

  }

  /**
   * HELPER
   * gets the count of the dockets that are mapped for a marker id
   * @param markerId 
   * @param companyCode 
   * @param unitCode 
   * @returns 
   */
  async getDocketsMappedForPoMarker(poSerial: number, markerId: number, companyCode: string, unitCode: string): Promise<string[]> {
    const poMarkerIdReq = new PoRatioIdMarkerIdRequest(null, unitCode, companyCode, 0, poSerial, 0, markerId);
    const markerMappedDocketsRes = await this.docGenService.getDocketsMappedForPoMarker(poMarkerIdReq);
    if(!markerMappedDocketsRes.status) {
      throw new ErrorResponse(markerMappedDocketsRes.errorCode, markerMappedDocketsRes.internalMessage);
    }
    return markerMappedDocketsRes.data;
  }

  /**
   * 
   * @param markerTypeId 
   * @param companyCode 
   * @param unitCode 
   */
  async getMarkerRecordTypeByMarkerTypeId(markerTypeId: number, companyCode: string, unitCode: string): Promise<MarkerTypeEntity> {
    return await this.markerTypeService.getMarkerRecordTypeByMarkerTypeId(markerTypeId, companyCode, unitCode);
  }

  /**
   * 
   * @param markerIds 
   * @param poSerial 
   * @param companyCode 
   * @param unitCode 
   * @param transManager 
   * @returns 
   */
  async unSetMarkerIdsForRatios(markerIds: number[], poSerial: number, companyCode: string, unitCode: string, transManager: GenericTransactionManager): Promise<boolean> {
    await this.poRatioService.unSetMarkerIdsForRatios(markerIds, poSerial, companyCode, unitCode, transManager);
    return true;
  }


  async getRatiosMappedForPoMarker(poSerial: number, markerId: number, companyCode: string, unitCode: string): Promise<PoRatioEntity[]> {
    return await this.poRatioInfoService.getRatiosMappedForPoMarker(poSerial, markerId, companyCode, unitCode);
  }


  async getPoProdTypeAndFabrics(poSerial: number, companyCode: string, unitCode: string): Promise<PoProdTypeAndFabModel[]> {
    const req = new PoSerialRequest(null, unitCode, companyCode, 0, poSerial, 0, false, false,);
    const poProdFabs = await this.poFabInfoService.getPoProdTypeAndFabrics(req);
    return poProdFabs.data;
  }
}