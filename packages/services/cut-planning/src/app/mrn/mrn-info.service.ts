import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { ErrorResponse } from "@xpparel/backend-utils";
import { CommonResponse, DocRollsModel, LayerMeterageRequest, MrnIdStatusRequest, MrnRequestInfoModel, MrnRequestModel, MrnRequestResponse, MrnRequestResponseOfTheDay, MrnStatusEnum, MrnStatusRequest, RequestQuantityResponse } from "@xpparel/shared-models";
import { DataSource, In } from "typeorm";
import { MrnEntity } from "./entity/mrn.entity";
import { MrnRepository } from "./repository/mrn.repository";
import { MrnItemRepository } from "./repository/mrn-item.repository";
import { MrnStatusHistoryRepository } from "./repository/mrn-status-history.repository";
import { MrnHelperService } from "./mrn-helper.service";

@Injectable()
export class MrnInfoService {
  constructor(
    private dataSource: DataSource,
    private mrnRepo: MrnRepository,
    private mrnItemRepo: MrnItemRepository,
    private mrnHisRepo: MrnStatusHistoryRepository,
    @Inject(forwardRef(() => MrnHelperService)) private mrnHelperService: MrnHelperService
  ) {

  }

  // END POINT
  async getMrnRequestsByMrnStatus(req: MrnStatusRequest): Promise<MrnRequestResponse> {
    const status = req.mrnStatus;
    if (!req.unitCode || !req.companyCode) {
      throw new ErrorResponse(0, 'Please provide the company code, unit code');
    }
    let mrnReqModels: MrnRequestModel[] = [];
    const mrnRecords = await this.getMrnReqRecordsForMrnStatuses(req.mrnStatus, req.companyCode, req.unitCode, req.poSerials);
    if (mrnRecords.length == 0) {
      throw new ErrorResponse(0, `MRN records does not exist for the status : ${req.mrnStatus}`);
    }
    const mrnIds = mrnRecords.map(r => r.id);
    mrnReqModels = await this.getMrnRequestModels(mrnIds, req.companyCode, req.unitCode, req.iNeedRollsInfo);
    return new MrnRequestResponse(true, 0, 'Mrn requests retrieved', mrnReqModels);
  }

  // END POINT
  async getMrnRequestForMrnId(req: MrnIdStatusRequest): Promise<MrnRequestResponse> {
    const status = req.mrnStatus;
    if (!req.unitCode || !req.companyCode || !req.mrnId) {
      throw new ErrorResponse(0, 'Please provide the company code, unit code and the mrn id');
    }
    const mrnRecord = await this.getMrnRequestRecordForMrnId(req.mrnId, req.companyCode, req.unitCode);
    if (!mrnRecord) {
      throw new ErrorResponse(0, 'MRN record does not exist');
    }
    let mrnReqModels: MrnRequestModel[] = [];
    mrnReqModels = await this.getMrnRequestModels([mrnRecord.id], req.companyCode, req.unitCode, true);
    return new MrnRequestResponse(true, 0, 'Mrn requests retrieved', mrnReqModels);
  }

  // HELPER
  async getMrnRequestModels(mrnIds: number[], companyCode: string, unitCode: string, iNeedRollInfo: boolean): Promise<MrnRequestModel[]> {
    const mrnReqModels: MrnRequestModel[] = [];
    const mrnRecords = await this.mrnRepo.find({ where: { id: In(mrnIds), companyCode: companyCode, unitCode: unitCode } });
    for (const rec of mrnRecords) {
      // get the rolls info for the mrn request. Get the rolls info only if asked
      let rollsForMrnReq: DocRollsModel[] = [];
      if (iNeedRollInfo) {
        rollsForMrnReq = await this.mrnHelperService.getDocketRollsModel(rec.docketGroup, companyCode, unitCode, rec.requestNumber, rec.id);
      }
      const mrnItems = await this.mrnItemRepo.find({ select: ['requestedQuantity'], where: { mrnId: rec.id, companyCode: companyCode, unitCode: unitCode } });
      let mrnQty = 0;
      mrnItems.forEach(r => { mrnQty += Number(r.requestedQuantity) });
      mrnQty = Number(mrnQty.toFixed(2));
      const layRec = await this.mrnHelperService.getLayingRecordForLayId(Number(rec.poDocketLayId), unitCode, companyCode);
      const cutRecs = await this.mrnHelperService.getCutDocketRecordsForDockets([rec.docketGroup], companyCode, unitCode);
      let cutNumbers = [];
      cutNumbers = cutRecs?.map(r => r.cutNumber);
      const mrnModel = new MrnRequestModel(rec.poSerial, rec.docketGroup, cutNumbers?.toString(), rec.remarks, rec.requestStatus, rec.requestNumber, rec.id, layRec.cutStatus, layRec.layingStatus, mrnQty, rollsForMrnReq);
      mrnReqModels.push(mrnModel);
    }
    return mrnReqModels;
  }

  // HELPER
  async getMrnReqRecordsForMrnStatuses(mrnStatuses: MrnStatusEnum[], companyCode: string, unitCode: string, poSerials: number[]): Promise<MrnEntity[]> {
    if (poSerials.length > 0) {
      return await this.mrnRepo.find({ where: { companyCode: companyCode, unitCode: unitCode, poSerial: In(poSerials), requestStatus: In(mrnStatuses) } });
    } else {
      return await this.mrnRepo.find({ where: { companyCode: companyCode, unitCode: unitCode, requestStatus: In(mrnStatuses) } });
    }
  }

  // HELPER
  async getMrnRequestRecordForMrnId(mrnId: number, companyCode: string, unitCode: string): Promise<MrnEntity> {
    return await this.mrnRepo.findOne({ where: { companyCode: companyCode, unitCode: unitCode, id: mrnId } });
  }

  async getMrnRequestRecordsByDocketNumberAndMrnStatus(docketGroup: string, companyCode: string, unitCode: string, mrnStatus: MrnStatusEnum[]) {
    return await this.mrnRepo.find({ where: { docketGroup, unitCode, companyCode, requestStatus: In(mrnStatus) } });
  }


  async getTotalRequestedQuantityToday(req: LayerMeterageRequest): Promise<MrnRequestResponseOfTheDay> {
    const mrnResult = await this.mrnItemRepo.getTotalRequestedQuantityTodayRepo(req.unitCode, req.companyCode, req.date);
    const MrnData = new MrnRequestInfoModel(mrnResult.totalRequestedQuantityToday, mrnResult.totalRequestedRequest);
    return new MrnRequestResponseOfTheDay(true, 1234, "Mrn Requested quantity data retrieved", MrnData)
  }

}