import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { DataSource, In } from "typeorm";
import { CutDispatchHelperService } from "./cut-dispatch-helper.service";
import { CutDisptachHeaderRepository } from "./repository/cut-dispatch-header.repository";
import { CutDispatchLineRepository } from "./repository/cut-dispatch-line.repository";
import { CutDispatchProgressRepository } from "./repository/cut-dispatch-progress.repository";
import { CutDispatchAttrEnum, CutDispatchIdStatusRequest, CutDispatchLineModel, CutDispatchRequestModel, CutDispatchRequestResponse, CutDispatchStatusEnum, CutDispatchStatusRequest, ICutDipatchCutWiseQtyHelperModel, IPoHelperModel } from "@xpparel/shared-models";
import { ErrorResponse } from "@xpparel/backend-utils";
import { CutDispatchAttrEntity } from "./entity/cut-dispatch-attr.entity";
import { CutDispatchAttrRepository } from "./repository/cut-dispatch-attr.repository";
import moment from "moment";
import { CutDispatchSubLineRepository } from "./repository/cut-dispatch-sub-line.repository";
import { CutDispatchHeaderEntity } from "./entity/cut-dispatch-header.entity";

@Injectable()
export class CutDispatchInfoService {
  constructor(
    private dataSource: DataSource,
    private cutDispatchRepo: CutDisptachHeaderRepository,
    private cutDispatchLineRepo: CutDispatchLineRepository,
    private cutDispatchProgRepo: CutDispatchProgressRepository,
    private cutDispatchSubLineRepo: CutDispatchSubLineRepository,
    private cutDispatchAttrRepo: CutDispatchAttrRepository,
    @Inject(forwardRef(()=>CutDispatchHelperService)) private cutDispatchHelper: CutDispatchHelperService
  ) {

  }

  // ENDPOINT
  async getCutDispatchRequestsByStatus(req: CutDispatchStatusRequest): Promise<CutDispatchRequestResponse> {
    const { unitCode, companyCode } = req;
    const dispacthReqs = await this.cutDispatchRepo.find({ where: { unitCode: unitCode, companyCode: companyCode, requestStatus: req.dispatchStatus }});
    if(dispacthReqs.length == 0) {
      throw new ErrorResponse(0, 'Dispatch requests not found');
    }
    const cutDrIds = dispacthReqs.map(r => r.id);
    const cutDrModels = await this.getCutDispatchReqModel(cutDrIds, companyCode, unitCode, req.iNeedDispatchLines);
    return new CutDispatchRequestResponse(true, 0, 'Cut dispatch request retrieved', cutDrModels);
  }

  // ENDPOINT
  async getCutDispatchRequestsByCutDrId(req: CutDispatchIdStatusRequest): Promise<CutDispatchRequestResponse> {
    const { unitCode, companyCode } = req;
    const dispacthReqs = await this.cutDispatchRepo.find({ where: { unitCode: unitCode, companyCode: companyCode, requestStatus: req.dispatchStatus }});
    if(dispacthReqs.length == 0) {
      throw new ErrorResponse(0, 'Dispatch requests not found');
    }
    const cutDrIds = dispacthReqs.map(r => r.id);
    const cutDrModels = await this.getCutDispatchReqModel(cutDrIds, companyCode, unitCode, true);
    return new CutDispatchRequestResponse(true, 0, 'Cut dispatch request retrieved', cutDrModels);
  }

  // HELPER
  async getCutDispatchReqModel(cutDrIds: number[], companyCode: string, unitCode: string, iNeedDispatchLines: boolean): Promise<CutDispatchRequestModel[]> {
    const cutDrModels: CutDispatchRequestModel[] = [];
    const dispacthReqs = await this.cutDispatchRepo.find({ where: { unitCode: unitCode, companyCode: companyCode, id: In(cutDrIds) }});
    for(const dr of dispacthReqs) {
      const cutDrAttrs = await this.getCutDrAttributes(dr.id);
      // get the dispatch request lines for the cut dispatch request
      // calculate the cut wise qtys
      const drSubLines = await this.cutDispatchSubLineRepo.find({select: ['cutNumber', 'docketNumber', 'poSerial', 'totalShadeBundles', 'quantity'], where: { 
        companyCode: companyCode, unitCode: unitCode, cutDrId: dr.id, mainDoc: true
      }});
      const cutWiseQtysMap = new Map<number, ICutDipatchCutWiseQtyHelperModel>();
      drSubLines.forEach(r => {
        cutWiseQtysMap.set(r.cutNumber, {
          cutNumber: r.cutNumber, totalShadeBundles: 0, qty: 0
        });
        cutWiseQtysMap.get(r.cutNumber).totalShadeBundles += r.totalShadeBundles;
        cutWiseQtysMap.get(r.cutNumber).qty += r.quantity;
      });

      const cutWiseQtys: ICutDipatchCutWiseQtyHelperModel[] = [];
      cutWiseQtysMap.forEach(r => cutWiseQtys.push(r));
      const mo = cutDrAttrs[CutDispatchAttrEnum.MO];
      const moLines = cutDrAttrs[CutDispatchAttrEnum.MO_LINES]?.split(',');
      const cutNumberStringArray = cutDrAttrs[CutDispatchAttrEnum.CUT_NUMBERS]?.split(',');
      const cutNumbers = cutNumberStringArray.map(c => Number(c));
      const drCreatedOn = dr.createdAt.toString();
      const drSentOutOn = dr.requestStatus == CutDispatchStatusEnum.SENT ? dr.updatedAt.toString() : null;
      const poSerials = cutDrAttrs[CutDispatchAttrEnum.PO_SERIALS].split(',');
      const poSerial =  Number(cutDrAttrs[CutDispatchAttrEnum.PO_SERIALS]);
      const prodOrders: IPoHelperModel[] = [
        {
          poDesc: cutDrAttrs[CutDispatchAttrEnum.PO_DESCS],
          poSerial: poSerial
        }
      ];


      const dispatchLinesInfo: CutDispatchLineModel[] = [];
      if(iNeedDispatchLines) {
        const drLines = await this.cutDispatchLineRepo.find({ where: {  companyCode: companyCode, unitCode: unitCode, cutDrId: dr.id } });
        for(const line of drLines) {
          const cutSpecificDrSubLines = await this.cutDispatchSubLineRepo.find({select: ['cutNumber', 'docketNumber', 'poSerial', 'totalShadeBundles', 'quantity'], where: { 
            companyCode: companyCode, unitCode: unitCode, cutDrId: dr.id, cutNumber: line.cutNumber
          }});
          const dockets: string[] = cutSpecificDrSubLines.map(r => r.docketNumber);
          const totalShadeBundles = cutWiseQtysMap.get(line.cutNumber).totalShadeBundles;
          const cutQty = cutWiseQtysMap.get(line.cutNumber).qty;
          let mainDoc = '';
          // filter out the main docket
          cutSpecificDrSubLines.forEach(r => mainDoc = r.mainDoc ? r.docketNumber : mainDoc);
          const dipatchLineModel = new CutDispatchLineModel(line.id, mo, moLines, line.cutNumber, line.poSerial, dr.requestStatus, drCreatedOn, dockets, mainDoc, cutQty, totalShadeBundles, line.bagNumber);

          dispatchLinesInfo.push(dipatchLineModel);
        }
      }

      const cutDrModel = new CutDispatchRequestModel(dr.id, dr.requestNumber, cutDrAttrs[CutDispatchAttrEnum.MO], moLines, cutNumbers, prodOrders, dr.requestStatus, drCreatedOn, cutWiseQtys, dr.vendorId, dr.printStatus, drSentOutOn, dispatchLinesInfo, null);
      cutDrModels.push(cutDrModel);
    }
    return cutDrModels;
  }

  // HELPER
  async getCutDrAttributes(cutDrId: number): Promise<{ [k in CutDispatchAttrEnum]: string}> {
    let cutDrAttrs: any = { };
    const cutDrAttrRecords = await this.cutDispatchAttrRepo.find({ where: { cutDrId: cutDrId }});
    for (const rec of cutDrAttrRecords) {
      cutDrAttrs[rec.name] = rec.value;
    }
    return cutDrAttrs;
  }

  // HELPER
  async getCutDrRequestHeaderRecordForPoSerialCutNumber(poSerial: number, cutNumber: number, companyCode: string, unitCode: string): Promise<CutDispatchHeaderEntity> {
    const curDrLine = await this.cutDispatchLineRepo.findOne({ select: ['cutDrId'] , where: { companyCode: companyCode, unitCode: unitCode, poSerial: poSerial, cutNumber: cutNumber} });
    if (curDrLine) {
      return await this.cutDispatchRepo.findOne({ where: { companyCode: companyCode, unitCode: unitCode, id: curDrLine.id } });
    }
    return null;
  }

   // HELPER
   async getCutDrRequestHeaderRecordForPoSerialCutNumbers(poSerial: number, cutNumbers: number[], companyCode: string, unitCode: string): Promise<CutDispatchHeaderEntity> {
    const curDrLine = await this.cutDispatchLineRepo.findOne({ select: ['cutDrId'] , where: { companyCode: companyCode, unitCode: unitCode, poSerial: poSerial, cutNumber: In(cutNumbers)} });
    if (curDrLine) {
      return await this.cutDispatchRepo.findOne({ where: { companyCode: companyCode, unitCode: unitCode, id: curDrLine.id } });
    }
    return null;
  }
}

