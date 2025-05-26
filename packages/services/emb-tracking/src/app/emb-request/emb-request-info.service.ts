import { Inject, Injectable, forwardRef } from "@nestjs/common";import { DataSource, In } from "typeorm";
import moment = require("moment");
import { EmbHeaderRepository } from "./repository/emb-header.repository";
import { EmbLineRepository } from "./repository/emb-line.repository";
import { EmbLineItemRepository } from "./repository/emb-line-item.repository";
import { EmbTagsPrintRepository } from "./repository/emb-tags-print.repository";
import { EmbHeaderEntity } from "./entity/emb-header.entity";
import { EmbAttributeRepository } from "./repository/emb-attribute.repository";
import { EmbAttributeEntity } from "./entity/emb-attribute.entity";
import { AdBundleModel, BarcodePrefixEnum, EmbJobNumberRequest, EmbReqAttibutesEnum, OpFormEnum, PfEmbLinePropsModel, PfEmbLinesPropsModel, PoEmbHeaderModel, PoEmbHeaderResponse, PoEmbLineModel, PoRatioSizeModel, PoSerialWithEmbPrefRequest, ManufacturingOrderNumberRequest } from "@xpparel/shared-models";
import { EmbLineItemEntity } from "./entity/emb-line-item.entity";
import { EmbLineEntity } from "./entity/emb-line.entity";
import { ErrorResponse } from "@xpparel/backend-utils";
import { EmbRequestHelperService } from "./emb-request-helper.service";
import { SizeQtyQueryResponse } from "./repository/query-response/size-qty.query.response";
import { OrderManipulationServices } from "@xpparel/shared-services";

@Injectable()
export class EmbRequestInfoService {
  constructor(
    private dataSource: DataSource,
    private embHeaderRepo: EmbHeaderRepository,
    private embLineRepo: EmbLineRepository,
    private embBundleRepo: EmbLineItemRepository,
    private embAttrRepo: EmbAttributeRepository,
    private embTagsPrintRepo: EmbTagsPrintRepository,
    private orderInfoService: OrderManipulationServices,
    @Inject(forwardRef(()=> EmbRequestHelperService)) private helperService: EmbRequestHelperService
  ) {

  }

  // ENDPOINT
  async getEmbJobsForPo(req: PoSerialWithEmbPrefRequest): Promise<PoEmbHeaderResponse> {
    const embHeaders = await this.embHeaderRepo.find({ select: ['id', 'poSerial'], where: { companyCode: req.companyCode, unitCode: req.unitCode, poSerial: req.poSerial }});
    if(embHeaders.length == 0) {
      throw new ErrorResponse(16070, 'No emb jobs found for the PO');
    }
    const embHeaderModels: PoEmbHeaderModel[] = [];
    for(const embHeader of embHeaders) {
      const embHeaderModel = await this.getEmbHeaderInfoForHeaderId(embHeader.id, embHeader.poSerial, req.companyCode, req.unitCode, req.iNeedEmbLines, req.iNeedEmbProps, req.iNeedEmbBundles, []);
      embHeaderModels.push(embHeaderModel);
    }
    return new PoEmbHeaderResponse(true, 16071, 'Emb header info retrieved', embHeaderModels);
  }

  // HELPER
  async getEmbHeaderInfoForHeaderId(embHeaderId: number, poSerial: number, companyCode: string, unitCode: string, iNeedLines: boolean, iNeedPanelFormProps: boolean, iNeedBundles: boolean, filterLineIds: number[]): Promise<PoEmbHeaderModel> {
    const embHeaderRec = await this.embHeaderRepo.findOne({ where: { companyCode: companyCode, unitCode: unitCode, poSerial: poSerial, id: embHeaderId }});
    const embHeaderArrs = await this.getEmbHeaderAttrsForEmbHeaderId(embHeaderId);
    
    
    const embHeaderAttrsMap = new Map<EmbReqAttibutesEnum, string>();
    embHeaderArrs.forEach(r => embHeaderAttrsMap.set(r.name, r.value));

    const embOperations = await this.helperService.getEmbOpLinesForEmbJobNumber(poSerial, embHeaderRec.embJobNumber, companyCode, unitCode);
    const operations = embOperations.map(r => r.operationCode);
    const dockets = [embHeaderRec.embParentJobRef]; // the docket
    const moNo = embHeaderAttrsMap.get(EmbReqAttibutesEnum.MONO);
    /**getting plantstyle, garment po and poitem */
    const moRequestObj = new ManufacturingOrderNumberRequest(null, unitCode, companyCode, null, moNo);
    const orderAndOrderLineData = await this.orderInfoService.getOrderAndOrderLineInfo(moRequestObj);
    const plantRefStyle = orderAndOrderLineData.data[0].plantStyle;
    const gamrmentPo = orderAndOrderLineData.data[0].garmentVendorPo;
    const gamrmentPoItem = orderAndOrderLineData.data[0].garmentVendorPoItem;

    const moLines = embHeaderAttrsMap.get(EmbReqAttibutesEnum.MOLINES)?.split(',');
    const jobQty = Number(embHeaderAttrsMap.get(EmbReqAttibutesEnum.JOB_QTY));
    const components = embHeaderAttrsMap.get(EmbReqAttibutesEnum.COMPONENTS)?.split(',');
    const productName = embHeaderAttrsMap.get(EmbReqAttibutesEnum.PROD_NAME);
    const embLineModels: PoEmbLineModel[] = [];
    if(iNeedLines) {
      const embLines = await this.getEmbLineRecordsForEmbHeaderId(embHeaderId, companyCode, unitCode);
      for(const line of embLines) {
        if(filterLineIds?.length > 0) {
          // Only consider those line ids that are mentioned
          if(!filterLineIds.includes(line.id)) {
            continue;
          }
        }
        const lineSizeQtys = await this.getEmbLineQtyForEmbLineId(poSerial, line.id, companyCode, unitCode);
        const dlRecord = await this.helperService.getDisptachLineRecordForLineRefId(line.id, companyCode, unitCode);
        let getPassReqNo = null;
        let dispatchStatus = null;
        if(dlRecord) {
          const dhRecord = await this.helperService.getDisptachRecordForDrId(dlRecord.embDrId, companyCode, unitCode);
          getPassReqNo = dhRecord.requestNumber;
          dispatchStatus = dhRecord.requestStatus;
        }
        let totalQty = 0;
        let totalBundles = 0;
        lineSizeQtys.forEach(r => { totalQty += r.quantity; totalBundles += r.bundle_count} );
        
        let pfEmbProps: PfEmbLinePropsModel;
        if(iNeedPanelFormProps) {
          const embLineAttrs = await this.getEmbLineAttrsForEmbLineId(line.id);
          const embLineAttrsMap = new Map<EmbReqAttibutesEnum, string>();
          embLineAttrs.forEach(r => embLineAttrsMap.set(r.name, r.value));
          const itemCode = embLineAttrsMap.get(EmbReqAttibutesEnum.ITEM_CODE);
          const itemDesc = embLineAttrsMap.get(EmbReqAttibutesEnum.ITEM_DESC);
          const pdPlies = Number(embLineAttrsMap.get(EmbReqAttibutesEnum.PD_PLIES));
          const adPlies = Number(embLineAttrsMap.get(EmbReqAttibutesEnum.AD_PLIES));
          const adNumber = Number(embLineAttrsMap.get(EmbReqAttibutesEnum.AD_NUMBER));

          const cutNumberModel = await this.helperService.getCutNumberForDockets([line.embParentJobRef], companyCode, unitCode);
          // TODO: CUTNUMBER
          // const cutNumber = Number(embLineAttrsMap.get(EmbReqAttibutesEnum.CUT_NUMBER));
          const cutNumber = cutNumberModel[0].mainCutNumber;
          const subCutNumber = cutNumberModel[0].subCutNumber;
          const sizeRatioModels = lineSizeQtys.map(r => new PoRatioSizeModel(r.size, r.bundle_count, 0) );
          pfEmbProps = new PfEmbLinePropsModel(line.embParentJobRef, embHeaderRec.docketGroup, line.color, itemCode, itemDesc, components, pdPlies, Number(line.embActualJobRef), cutNumber, subCutNumber, adNumber, adPlies, sizeRatioModels);
        }

        let adBundleModels: AdBundleModel[] = [];
        if(iNeedBundles) {
          // call to the CPS and get the AD bundles info
          const adInfo = await this.helperService.getActualDocketInfo([Number(line.embActualJobRef)], line.embParentJobRef, companyCode, unitCode, iNeedBundles);
          // after getting the bundles, replace the cut barcode with the emb barcode
          const prefix = BarcodePrefixEnum.PANEL_EMB_BUNDLE+embOperations[0].opGroup;
          adInfo[0].adBundles.forEach(b => {
            const barcodeParts = b.barcode.split(':');
            b.barcode = prefix+':'+barcodeParts[1];
          })
          adBundleModels = adInfo[0].adBundles;
        }
        const poEmbLineModel = new PoEmbLineModel(line.id, embHeaderRec.embJobNumber, moNo, moLines, embHeaderRec.opGroup, totalQty, line.supplierId, line.bundlePrintStatus, OpFormEnum.PF, pfEmbProps, totalBundles, adBundleModels, getPassReqNo, dispatchStatus);
        embLineModels.push(poEmbLineModel);
      }
    }
    const headerModel = new PoEmbHeaderModel(embHeaderId, embHeaderRec.embJobNumber, embHeaderRec.docketGroup, operations, dockets, OpFormEnum.PF,  moNo, moLines, embHeaderRec.opGroup, jobQty, productName, embLineModels, plantRefStyle, gamrmentPo, gamrmentPoItem );
    return headerModel;
  }

  // END POINT
  // READER
  async getEmbJobsForEmbJobNumber(req: EmbJobNumberRequest): Promise<PoEmbHeaderResponse> {
    const embHeaderRec = await this.embHeaderRepo.findOne({ select: ['id', 'poSerial'], where: { companyCode: req.companyCode, unitCode: req.unitCode, embJobNumber: req.embJobNumber, isActive: true }});
    if(!embHeaderRec) {
      throw new ErrorResponse(16036, `Emb job ${req.embJobNumber} is not found`);
    }
    const embHeaderModels: PoEmbHeaderModel[] = [];
    const embHeaderModel = await this.getEmbHeaderInfoForHeaderId(embHeaderRec.id, embHeaderRec.poSerial, req.companyCode, req.unitCode, req.iNeedEmbLines, req.iNeedEmbProps, req.iNeedEmbBundles, req.lineIds);
    embHeaderModels.push(embHeaderModel);
    return new PoEmbHeaderResponse(true, 16071, 'Emb header info retrieved', embHeaderModels);
  }

  // END POINT 
  // READER
  // Used for gatepass print of an emb request.
  async getEmbJobsForEmbLineIds(req: EmbJobNumberRequest): Promise<PoEmbHeaderResponse> {
    if(req.lineIds?.length == 0) {
      throw new ErrorResponse(16037, 'Provide the emb lines');
    }
    const embLineRecords = await this.embLineRepo.find({select: ['embHeaderId'], where: { companyCode: req.companyCode, unitCode: req.unitCode, id: In(req.lineIds)}});
    if(embLineRecords.length == 0) {
      throw new ErrorResponse(16038, 'Emb lines does not exist');
    }
    const headerIds = new Set<number>();
    embLineRecords.forEach(r => headerIds.add(r.id));
    const embHeaders = await this.embHeaderRepo.find({ select: ['id', 'poSerial'], where: { companyCode: req.companyCode, unitCode: req.unitCode, id: In(Array.from(headerIds)) }});
    if(embHeaders.length == 0) {
      throw new ErrorResponse(16070, 'No emb jobs found for the PO');
    }
    const embHeaderModels: PoEmbHeaderModel[] = [];
    for(const embHeaderRec of embHeaders) {
      const embHeaderModel = await this.getEmbHeaderInfoForHeaderId(embHeaderRec.id, embHeaderRec.poSerial, req.companyCode, req.unitCode, req.iNeedEmbLines, req.iNeedEmbProps, req.iNeedEmbBundles, req.lineIds);
      embHeaderModels.push(embHeaderModel);
    }
    return new PoEmbHeaderResponse(true, 16071, 'Emb header info retrieved', embHeaderModels);
  }


  // HELPER
  async getEmbHeaderRecordForEmbJobNumber(embJobNumber: string, companyCode: string, unitCode: string): Promise<EmbHeaderEntity> {
    return await this.embHeaderRepo.findOne({where: { companyCode: companyCode, unitCode: unitCode, embJobNumber: embJobNumber}});
  }

  // HELPER
  async getEmbHeaderRecordForEmbHeaderId(embHeaderId: number, companyCode: string, unitCode: string): Promise<EmbHeaderEntity> {
    return await this.embHeaderRepo.findOne({where: { companyCode: companyCode, unitCode: unitCode, id: embHeaderId}});
  }

  // HELPER
  async getEmbHeaderRecordsForEmbHeaderIds(embHeaderIds: number[], companyCode: string, unitCode: string): Promise<EmbHeaderEntity[]> {
    return await this.embHeaderRepo.find({where: { companyCode: companyCode, unitCode: unitCode, id: In(embHeaderIds)}});
  }

  // HELPER
  async getEmbLineRecordsForEmbHeaderId(embHeaderId: number, companyCode: string, unitCode: string): Promise<EmbLineEntity[]> {
    return await this.embLineRepo.find({where: { companyCode: companyCode, unitCode: unitCode, embHeaderId: embHeaderId}});
  }

  // HELPER
  async getEmbLineRecordsForEmbHeaderIds(embHeaderIds: number[], companyCode: string, unitCode: string): Promise<EmbLineEntity[]> {
    return await this.embLineRepo.find({where: { companyCode: companyCode, unitCode: unitCode, embHeaderId: In(embHeaderIds)}});
  }

  // HELPER
  async getEmbLineRecordsForEmbLineId(embLineId: number, companyCode: string, unitCode: string): Promise<EmbLineEntity> {
    return await this.embLineRepo.findOne({where: { companyCode: companyCode, unitCode: unitCode, id: embLineId}});
  }

  // HELPER
  async getEmbLineRecordsForEmbLineIds(embLineIds: number[], companyCode: string, unitCode: string): Promise<EmbLineEntity[]> {
    return await this.embLineRepo.find({where: { companyCode: companyCode, unitCode: unitCode, id: In(embLineIds)}});
  }

  // HELPER
  async getEmbHeaderAttrsForEmbHeaderId(embHeaderId: number): Promise<EmbAttributeEntity[]> {
    return await this.embAttrRepo.find({where: { embHeaderId: embHeaderId }});
  }

  // HELPER
  async getEmbLineAttrsForEmbLineId(embLineId: number): Promise<EmbAttributeEntity[]> {
    return await this.embAttrRepo.find({where: { embLineId: embLineId }});
  }

  // HELPER
  async getEmbLineItemByBarcodeNumber(barcode: string, companyCode: string, unitCode: string): Promise<EmbLineItemEntity> {
    return await this.embBundleRepo.findOne({ where: { companyCode: companyCode, unitCode: unitCode, barcode: barcode, isActive: true } });
  }

  // HELPER
  async getEmbLineItemsByEmbLineId(embLineId: number, companyCode: string, unitCode: string): Promise<EmbLineItemEntity[]> {
    return await this.embBundleRepo.find({ select: ['barcode', 'size', 'refBundleId', 'quantity', 'id'], where: { companyCode: companyCode, unitCode: unitCode, embLineId: embLineId, isActive: true } });
  }

  async getEmbLineQtyForEmbLineId(poSerial: number, embLineId: number, companyCode: string, unitCode: string): Promise<SizeQtyQueryResponse[]> {
    return await this.embBundleRepo.getEmbLineQtyForEmbLineId(poSerial, embLineId, companyCode, unitCode);
  }

  async getEmbLineRecordsForDocNumber(refDoc: string, companyCode: string, unitCode: string): Promise<EmbLineEntity[]> {
    return await this.embLineRepo.find({ where: { companyCode: companyCode, unitCode: unitCode, embParentJobRef: refDoc } });
  }

  async getEmbHeaderRecordsForDocNumbers(refDocs: string[], companyCode: string, unitCode: string): Promise<EmbHeaderEntity[]> {
    return await this.embHeaderRepo.find({ where: { companyCode: companyCode, unitCode: unitCode, embParentJobRef: In(refDocs), isActive: true } });
  }

  // HELPER for the gatepass response
  // async getPanelFormEmbPropsForEmbLineIds(embLineIds: number[], companyCode: string, unitCode: string): Promise<PfEmbLinesPropsModel> {
  //   for(const lineId of embLineIds) {

  //   }
  //   const embLineAttrs = await this.getEmbLineAttrsForEmbLineId(line.id);
  //   const embLineAttrsMap = new Map<EmbReqAttibutesEnum, string>();
  //   embLineAttrs.forEach(r => embLineAttrsMap.set(r.name, r.value));
  //   const itemCode = embLineAttrsMap.get(EmbReqAttibutesEnum.ITEM_CODE);
  //   const itemDesc = embLineAttrsMap.get(EmbReqAttibutesEnum.ITEM_DESC);
  //   const pdPlies = Number(embLineAttrsMap.get(EmbReqAttibutesEnum.PD_PLIES));
  //   const adPlies = Number(embLineAttrsMap.get(EmbReqAttibutesEnum.AD_PLIES));
  //   const adNumber = Number(embLineAttrsMap.get(EmbReqAttibutesEnum.AD_NUMBER));
  //   const cutNumber = Number(embLineAttrsMap.get(EmbReqAttibutesEnum.CUT_NUMBER));
  //   return null;
  // }
}