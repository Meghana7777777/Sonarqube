import { Inject, Injectable, forwardRef } from "@nestjs/common";import { DataSource } from "typeorm";
import moment = require("moment");
import { EmbOpHeaderRepository } from "./repository/emb-op-header.repository";
import { EmbOpLineRepository } from "./repository/emb-op-line.repository";
import { EmbTransactionLogRepository } from "./repository/emb-transaction-log.repository";
import { EmbJobBundleModel, EmbJobBundleResponse, PoDocketNumberRequest, PoDocketNumbersRequest, EmbOpRepQtyModel, JobScanQtyBasicResponse, JobScanQtyBasicModel, PoDocketOpCodeRequest, EmbReqAttibutesEnum } from "@xpparel/shared-models";
import { EmbOpLineEntity } from "./entity/emb-op-line.entity";
import { EmbTrackingHelperService } from "./emb-tracking-helper.service";
import { ErrorResponse } from "@xpparel/backend-utils";
import { JobScanQtyQueryResposne } from "./repository/query-response/job-scan-qty.query.response";

@Injectable()
export class EmbTrackingInfoService {
  constructor(
    private dataSource: DataSource,
    private embOpHeaderRepo: EmbOpHeaderRepository,
    private embOpLineRepo: EmbOpLineRepository,
    private transLogRepo: EmbTransactionLogRepository,
    @Inject(forwardRef(() => EmbTrackingHelperService)) private embTrackingHelper: EmbTrackingHelperService
  ) {

  }

  
  async getEmbOpLinesForEmbJobNumber(poSerial: number, embJob: string, companyCode: string, unitCode: string): Promise<EmbOpLineEntity[]> {
    return await this.embOpLineRepo.find({ where: { poSerial: poSerial, embJobNumber: embJob, companyCode: companyCode, unitCode: unitCode } });
  }


  // END POINT
  // Gets the emb bundle info for a given docket
  async getEmbJobBundlesInfo(req: PoDocketOpCodeRequest): Promise<EmbJobBundleResponse> {
    const embLines = await this.embTrackingHelper.getEmbLineRecordsForDocNumber(req.docketNumber, req.companyCode, req.unitCode);

    let embLineIds: number[] = [];
    const opGroups = new Set<string>();
    // now filter the emb lines based on the operation code
    if(req.operationCode) {
      const embJobOpRecs = await this.embOpLineRepo.find({select: ['embJobNumber', 'opGroup'], where: { companyCode: req.companyCode, unitCode: req.unitCode, embParentJobRef: req.docketNumber, isActive: true, operationCode: req.operationCode } });
      // add the op group into a set. Usually this will  be a size of 1
      embJobOpRecs.forEach(r => opGroups.add(r.opGroup)); 
      if(opGroups.size == 0) {
        throw new ErrorResponse(16051, `No emb jobs found for the docket: ${req.docketNumber} and the operation : ${req.operationCode}`);
      }
      // iterate every line and filter out the lines based on the incoming op group
      embLines.forEach(e => {
        if(opGroups.has(e.opGroup)) {
          embLineIds.push(e.id);
        }
      });
    } else {
      embLineIds = embLines.map(r => r.id);
    }
    const embBundleModels = await this.getEmbJobBundlesForEmbLineIds(embLineIds, req.companyCode, req.unitCode);
    return new EmbJobBundleResponse(true, 16052, 'Emb bundles retrieved', embBundleModels);
  }


  // HELPER
  async getEmbJobBundlesForEmbLineIds(embLinesIds: number[], companyCode: string, unitCode: string ): Promise<EmbJobBundleModel[]> {
    const embBundleModels: EmbJobBundleModel[] = [];
    for(const lineId of embLinesIds) {
      const line = await this.embTrackingHelper.getEmbLineRecordsForEmbLineId(lineId, companyCode, unitCode);
      
      const embLineAttrs = await this.embTrackingHelper.getEmbHeaderAttrsForEmbLineId(lineId, companyCode, unitCode);
      const embLineAttrMap = new Map<EmbReqAttibutesEnum, string>();
      embLineAttrs.forEach(r => embLineAttrMap.set(r.name, r.value));
      const layNumber = embLineAttrMap.get(EmbReqAttibutesEnum.AD_NUMBER);

      const embHeaderRec = await this.embTrackingHelper.getEmbHeaderRecordForEmbHeaderId(line.embHeaderId, companyCode, unitCode);
      // get the emb operations
      const embOpLines = await this.embOpLineRepo.find({select: ['operationCode', 'sequence'], where: { companyCode: companyCode, unitCode: unitCode, embJobNumber: embHeaderRec.embJobNumber }});
      const ops = embOpLines.map(r => r.operationCode );
      const embBarcodes = await this.embTrackingHelper.getEmbLineItemsByEmbLineId(line.id, companyCode, unitCode);
      const bundleIdBarcodeMap = new Map<number, string>();
      embBarcodes.forEach(r => bundleIdBarcodeMap.set(Number(r.refBundleId), r.barcode) );
      // get the bundles for the emb line 
      const adInfo = await this.embTrackingHelper.getActualDocketInfo([Number(line.embActualJobRef)], line.embParentJobRef, companyCode, unitCode, true);
      const bundles = adInfo[0].adBundles;
      // get the transactions for the emb job 
      const transactions = await this.transLogRepo.getBundleWiseGoodAndRejQtyForEmbJob(embHeaderRec.embJobNumber, ops, companyCode, unitCode);
      const barcodeOpMap = new Map<string, Map<string, { gQty: number, rQty: number }>>();
      transactions.forEach(r => {
        if(!barcodeOpMap.has(r.barcode)) {
          barcodeOpMap.set(r.barcode, new Map<string, { gQty: number, rQty: number }>());
        }
        barcodeOpMap.get(r.barcode).set(r.operation_code, { gQty: Number(r.g_qty), rQty: Number(r.r_qty) });
      });
      for(const bundle of bundles) {
        // replace the doc bundle barcode with the emb barcode
        const barcode = bundleIdBarcodeMap.get(bundle.adbId);
        bundle.barcode = barcode;
        const bundleOps = embOpLines.map(r => {
          const repQtyInfo = barcodeOpMap?.get(barcode)?.get(r.operationCode);
          return new EmbOpRepQtyModel(r.operationCode, r.sequence, repQtyInfo?.rQty ?? 0, repQtyInfo?.gQty ?? 0, 0);
        });
        const embBundleModel = new EmbJobBundleModel(bundleOps, bundle, adInfo[0].cutNumber, adInfo[0].cutSubNumber, embHeaderRec.embParentJobRef, layNumber, embHeaderRec.docketGroup, embHeaderRec.embJobNumber);
        embBundleModels.push(embBundleModel);
      }
    }
    return embBundleModels;
  }

  // ENDPOINT
  // Used to get the emb job => op level good and rej qtys
  async getEmbJobWiseReportedQtysForRefJobNos(req: PoDocketNumbersRequest): Promise<JobScanQtyBasicResponse> {
    const jobRefNos = new Set<string>();
    req.docketNumbers.forEach(r => {
      jobRefNos.add(r);
    });
    if(jobRefNos.size == 0) {
      throw new ErrorResponse(935, 'No dockets given in the request');
    }
    const embJobScanModels: JobScanQtyBasicModel[] = [];
    const embJobNumbers = await this.embTrackingHelper.getEmbHeaderRecordsForDocNumbers(Array.from(jobRefNos), req.companyCode, req.unitCode);
    if (embJobNumbers.length > 0) {
      for(const embJob of embJobNumbers) {
        // get the emb job wise org, good and rej qtys
        const embTrackingRec = await this.embOpHeaderRepo.findOne({ select: ['jobQuantity', 'embJobNumber'], where: { companyCode: req.companyCode, unitCode: req.unitCode, embJobNumber: embJob.embJobNumber, isActive: true}});
        const embOps = await this.embOpLineRepo.find({ select: ['operationCode'], where: { companyCode: req.companyCode, unitCode: req.unitCode, embJobNumber: embJob.embJobNumber, isActive: true}});

        const embJobQtys: JobScanQtyQueryResposne[] = await this.transLogRepo.getCumulativeGoodAndRejQtyForEmbJobWithoutColorSize(embJob.embJobNumber, [], req.companyCode, req.unitCode);
      
        const embJobOpModels: EmbOpRepQtyModel[] = [];
        embOps.forEach(r => {
          const embJobOpTrackInfo = embJobQtys.find(t => t.operation_code == r.operationCode);
          const embOpModel = embJobOpTrackInfo ?  new EmbOpRepQtyModel(embJobOpTrackInfo.operation_code, 0, Number(embJobOpTrackInfo.r_qty), Number(embJobOpTrackInfo.g_qty), 0) : new EmbOpRepQtyModel(r.operationCode, 0, 0, 0, 0);
          embJobOpModels.push(embOpModel);
        });
        embJobScanModels.push(new JobScanQtyBasicModel(embJob.embJobNumber, embJobOpModels, embJob.embParentJobRef, embTrackingRec.jobQuantity ));
      }
    }
    return new JobScanQtyBasicResponse(true, 16053 , 'Job scanned qtys retrieved', embJobScanModels);
  }
  
}