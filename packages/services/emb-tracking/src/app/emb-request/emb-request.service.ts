import { Injectable } from "@nestjs/common"; import { DataSource, In } from "typeorm";
import moment = require("moment");
import { EmbRequestHelperService } from "./emb-request-helper.service";
import { EmbRequestInfoService } from "./emb-request-info.service";
import { EmbHeaderRepository } from "./repository/emb-header.repository";
import { EmbLineItemRepository } from "./repository/emb-line-item.repository";
import { EmbLineRepository } from "./repository/emb-line.repository";
import { EmbTagsPrintRepository } from "./repository/emb-tags-print.repository";
import { ActualDocketBasicInfoModel, AdResponse, BarcodePrefixEnum, EmbBarcodePrintRequest, EmbLocationTypeEnum, EmbReqAttibutesEnum, GlobalResponseObject, LayIdsRequest, ProcessTypeEnum, OpFormEnum, PoDocketNumberRequest, PoDocketNumbersRequest } from "@xpparel/shared-models";
import { GenericTransactionManager } from "../../database/typeorm-transactions";
import { EmbLineEntity } from "./entity/emb-line.entity";
import { EmbHeaderEntity } from "./entity/emb-header.entity";
import { group } from "console";
import { EmbLineItemEntity } from "./entity/emb-line-item.entity";
import { EmbAttributeEntity } from "./entity/emb-attribute.entity";
import { ErrorResponse } from "@xpparel/backend-utils";
import { EmbTagsPrintEntity } from "./entity/emb-tags-print.entity";

@Injectable()
export class EmbRequestService {
  constructor(
    private dataSource: DataSource,
    private infoService: EmbRequestInfoService,
    private helperService: EmbRequestHelperService,
    private embHeaderRepo: EmbHeaderRepository,
    private embLineRepo: EmbLineRepository,
    private embBundleRepo: EmbLineItemRepository,
    private embTagsPrintRepo: EmbTagsPrintRepository
  ) {

  }

  /**
   * TODO: Can be optimized
   * End point
   * Bull job consumer
   * Creates the EMB request for the laying ids
   * @param req 
   */
  async createEmbRequest(req: PoDocketNumberRequest): Promise<GlobalResponseObject> {
    const transManager = new GenericTransactionManager(this.dataSource);
    try {
      // NOTE: We have to process only docket related lays at a time to reduce the load on the system
      const docInfo = await this.helperService.getDocketsBasicInfoForDocketNumber(req.poSerial, req.docketNumber, req.companyCode, req.unitCode);
      const docketNumber = docInfo.docketNumber;
      const poSerial = docInfo.poSerial;
      const prodName = docInfo.productName;
      const prodType = docInfo.productType;
      const docComps = docInfo.components;
      const color    = docInfo.fgColor;
      const originalDocQty = docInfo.originalDocQuantity;
      const docketGroup = docInfo.docketGroup;

      // First validate if this docket has the emb operations
      const pfEmbOpGroups = new Set<string>();
      const opGroupOps = new Map<string, string[]>();
      const opGroupComps = new Map<string, Set<string>>();

      // get the po operations info for the po serial
      const opVersion = await this.helperService.getOpVersionsForPo(poSerial, prodName, req.companyCode, req.unitCode);
      // now check if the op version has the panel form emb matching with the current docket
      opVersion.operations.forEach(op => {
        if(op.opCategory == ProcessTypeEnum.EMB && op.opForm == OpFormEnum.PF) {
          // now checkf if comp matches
          // We are going with a find method since the array size is very less and no need to worry about performance
          const groupInfo = opVersion.opGroups.find(g => g.operations.includes(op.opCode));
          // console.log(util.inspect(opVersion, false, null, true));
          groupInfo?.components?.forEach(comp => {
            if(docComps?.includes(comp)) {
              // push the eligible PF + EMB op groups
              pfEmbOpGroups.add(groupInfo.group);
              if(!opGroupComps.has(groupInfo.group)) {
                opGroupComps.set(groupInfo.group, new Set<string>());
              }
              opGroupComps.get(groupInfo.group).add(comp);
            }
          });
          // set the operations for the op group
          opGroupOps.set(groupInfo.group, groupInfo.operations);
        }
      });
      if(pfEmbOpGroups.size == 0) {
        return new GlobalResponseObject(true, 16039, 'The provided dockets doesnt have the component mapped for the emb operation');
      }

      const poSummary = await this.helperService.getPoSummary(req.poSerial, req.companyCode, req.unitCode);
      // now get the lay ids for the docket if any.
      const layingInfoForDoc = await this.helperService.getLayInfoForDocketGroup(req.poSerial, docketGroup, req.companyCode, req.unitCode, true);
      console.log(layingInfoForDoc);
      const layIds: number[] = [];
      layingInfoForDoc?.forEach(r => { layIds.push(r.layId); });

      // get the lay ids related info from the CPS i.e the the lay info and the bundles info
      let layInfo: ActualDocketBasicInfoModel[] = [];
      if(layIds.length > 0) {
        layInfo = await this.helperService.getActualDocketInfo(layIds, req.docketNumber, req.companyCode, req.unitCode, true);
      }

      await transManager.startTransaction();
      // Now iterate each op group and create the emb header => emb tracking
      // then iterate the lay item and create the emb lines if they are not already created
      for(const opGroup of pfEmbOpGroups) {
        const createdEmbLineActJobRefs: string[] = [];
        let embHeaderId = 0;

        const embHeaderRec = await this.embHeaderRepo.findOne({select: ['id'],  where: { companyCode: req.companyCode, unitCode: req.unitCode, poSerial: poSerial, isActive: true, opGroup: opGroup, embParentJobRef: docketNumber } });
        if(!embHeaderRec) {
          const embJobNumber =  BarcodePrefixEnum.PF_EMB_JOB + opGroup + ':' + docketNumber;
          // This means ther are no any records created for the docket. So we can create a new emb header
          const embHeaderEnt = new EmbHeaderEntity();
          embHeaderEnt.companyCode = req.companyCode;
          embHeaderEnt.unitCode = req.unitCode;
          embHeaderEnt.createdUser = req.username;
          embHeaderEnt.poSerial = poSerial;
          embHeaderEnt.productName = prodName;
          embHeaderEnt.productType = prodType;
          embHeaderEnt.embJobNumber = embJobNumber;
          embHeaderEnt.docketGroup = docInfo.docketGroup;
          embHeaderEnt.embType = EmbLocationTypeEnum.EXTERNAL;
          embHeaderEnt.opGroup = opGroup;
          embHeaderEnt.embParentJobRef = docketNumber;
          embHeaderEnt.supplierId = 0;
          const savedEmbHeader = await transManager.getRepository(EmbHeaderEntity).save(embHeaderEnt);
          embHeaderId = savedEmbHeader.id;

          // ATTRIBUTES BEGIN
          const embHeaderAttrs: EmbAttributeEntity[] = [];
          const attr1Ent = new EmbAttributeEntity();
          attr1Ent.embHeaderId = embHeaderId; attr1Ent.name = EmbReqAttibutesEnum.COMPONENTS; attr1Ent.value = Array.from(opGroupComps.get(opGroup))?.toString();
          const attr2Ent = new EmbAttributeEntity();
          attr2Ent.embHeaderId = embHeaderId; attr2Ent.name = EmbReqAttibutesEnum.MONO; attr2Ent.value = poSummary.orderRefNo;
          const attr3Ent = new EmbAttributeEntity();
          attr3Ent.embHeaderId = embHeaderId; attr3Ent.name = EmbReqAttibutesEnum.MOLINES; attr3Ent.value = poSummary.moLines?.toString();
          const attr4Ent = new EmbAttributeEntity();
          attr4Ent.embHeaderId = embHeaderId; attr4Ent.name = EmbReqAttibutesEnum.PROD_NAME; attr4Ent.value = prodName;
          const attr5Ent = new EmbAttributeEntity();
          attr5Ent.embHeaderId = embHeaderId; attr5Ent.name = EmbReqAttibutesEnum.PROD_TYPE; attr5Ent.value = prodType;
          const attr6Ent = new EmbAttributeEntity();
          attr6Ent.embHeaderId = embHeaderId; attr6Ent.name = EmbReqAttibutesEnum.JOB_QTY; attr6Ent.value = originalDocQty.toString();
          const attr7Ent = new EmbAttributeEntity();
          attr7Ent.embHeaderId = embHeaderId; attr7Ent.name = EmbReqAttibutesEnum.STYLE; attr7Ent.value = poSummary.style;
          // TODO: CUTNUMBER
          // const attr7Ent = new EmbAttributeEntity();
          // attr7Ent.embHeaderId = embHeaderId; attr7Ent.name = EmbReqAttibutesEnum.CUT_NUMBER; attr7Ent.value = docInfo.cutNumber?.toString();
          embHeaderAttrs.push(attr1Ent, attr2Ent, attr3Ent, attr4Ent, attr5Ent, attr6Ent, attr7Ent);
          await transManager.getRepository(EmbAttributeEntity).save(embHeaderAttrs, { reload: false });
          // ATTRIBUTES END

          // save the emb job tracking details 
          await this.helperService.createEmbTrackingInfoInternally(poSerial, docketNumber, embJobNumber, embHeaderId, originalDocQty, opGroupOps.get(opGroup), opVersion.opGroups, opVersion.operations, req.companyCode, req.unitCode, req.username, transManager);
        } else {
          embHeaderId = embHeaderRec.id;
        }
        console.log('going for lines');
        console.log(layInfo);
        // get all the emb lines under the dock + op group
        const embLines = await transManager.getRepository(EmbLineEntity).find({ select: ['embHeaderId', 'embActualJobRef'], where: { companyCode: req.companyCode, unitCode: req.unitCode, poSerial: poSerial, embParentJobRef: docketNumber, isActive: true, opGroup: opGroup }});
        embLines.forEach(r => { createdEmbLineActJobRefs.push(r.embActualJobRef) });
        for(const line of layInfo) {
          if(!createdEmbLineActJobRefs.includes(line.layId.toString())) {
            // create the emb line
            const embLine = new EmbLineEntity();
            embLine.companyCode = req.companyCode;
            embLine.unitCode = req.unitCode;
            embLine.poSerial = poSerial;
            embLine.embHeaderId = embHeaderId;
            embLine.embActualJobRef = line.layId.toString();
            embLine.embParentJobRef = docketNumber;
            embLine.bundlePrintStatus = false;
            embLine.color = color;
            embLine.opGroup = opGroup;
            embLine.createdUser = req.username;
            embLine.supplierId = 0;

            const savedEmbLine = await transManager.getRepository(EmbLineEntity).save(embLine);

            // ATTRIBUTES BEGIN
            const embLineAttrs: EmbAttributeEntity[] = [];
            const attr1Ent = new EmbAttributeEntity();
            attr1Ent.embLineId = savedEmbLine.id; attr1Ent.name = EmbReqAttibutesEnum.ITEM_CODE; attr1Ent.value = line.itemCode;
            const attr2Ent = new EmbAttributeEntity();
            attr2Ent.embLineId = savedEmbLine.id; attr2Ent.name = EmbReqAttibutesEnum.ITEM_DESC; attr2Ent.value = line.itemDesc;
            const attr3Ent = new EmbAttributeEntity();
            attr3Ent.embLineId = savedEmbLine.id; attr3Ent.name = EmbReqAttibutesEnum.PD_PLIES; attr3Ent.value = line.docketPlies.toString();
            const attr4Ent = new EmbAttributeEntity();
            attr4Ent.embLineId = savedEmbLine.id; attr4Ent.name = EmbReqAttibutesEnum.AD_PLIES; attr4Ent.value = line.actualDocketPlies.toString();
            const attr5Ent = new EmbAttributeEntity();
            attr5Ent.embLineId = savedEmbLine.id; attr5Ent.name = EmbReqAttibutesEnum.AD_NUMBER; attr5Ent.value = line.layNumber.toString();
            // TODO: CUTNUMBER
            // const attr6Ent = new EmbAttributeEntity();
            // attr6Ent.embLineId = savedEmbLine.id; attr6Ent.name = EmbReqAttibutesEnum.CUT_NUMBER; attr6Ent.value = line.cutNumber.toString();
            embLineAttrs.push(attr1Ent, attr2Ent, attr3Ent, attr4Ent, attr5Ent);
            await transManager.getRepository(EmbAttributeEntity).save(embLineAttrs, { reload: false });
            // ATTRIBUTES END

            const embLineItemEnts: EmbLineItemEntity[] = [];
            // const bundleBarcodePrefix = BarcodePrefixEnum.PANEL_EMB_BUNDLE + opGroup + poSerial.toString(16) + '-' + line.underPolayNumber;
            // const bundleBarcodePrefix = BarcodePrefixEnum.PANEL_EMB_BUNDLE + opGroup + ':' + line.layId;
            const bundleBarcodePrefix = BarcodePrefixEnum.PANEL_EMB_BUNDLE + opGroup + ':';
            // now save the emb items i.e the barcodes for the emb job line
            for(const bundle of line.adBundles) {
              const barcodeParts = bundle.barcode.split(':');
              // Keeping the same barcode as in the CPS. just changing the prefix of the barcode
              // const bundleBarcode = bundleBarcodePrefix + '-' + bundle.underLayBundleNo + '-'+ bundle.barcode;
              const bundleBarcode = bundleBarcodePrefix + barcodeParts[1];
              const embLineItem = new EmbLineItemEntity();
              embLineItem.companyCode = req.companyCode;
              embLineItem.unitCode = req.unitCode;
              embLineItem.createdUser = req.username;
              embLineItem.embHeaderId = embHeaderId;
              embLineItem.embLineId = savedEmbLine.id;
              embLineItem.poSerial = poSerial;
              embLineItem.refBundleId = bundle.adbId.toString();
              embLineItem.size = bundle.size;
              embLineItem.quantity = bundle.quantity;
              embLineItem.barcode = bundleBarcode;

              embLineItemEnts.push(embLineItem);
            }
            await transManager.getRepository(EmbLineItemEntity).save(embLineItemEnts, {reload: false});
          }
        }
      }
      await transManager.completeTransaction();
      return new GlobalResponseObject(true, 16040, 'EMB job created');
    } catch (error) {
      console.log(error);
      throw error;
    }
  }


  /**
   * END POINT
   * Bull job consumer
   * Deletes the emb lines
   * Called when doing the lay reversal
   * @param req 
   */
  async deleteEmbLine(req: LayIdsRequest): Promise<GlobalResponseObject> {
    const transManager = new GenericTransactionManager(this.dataSource)
    try {
      await transManager.startTransaction();
      // delete the emb request line and the request line items
      for(const layId of req.layIds) {
        const embLines = await this.embLineRepo.find({ select: ['embHeaderId', 'embActualJobRef', 'id'], where: { companyCode: req.companyCode, unitCode: req.unitCode, embActualJobRef: layId.toString(), isActive: true }});
        // based on as many emb op groups
        for(const line of embLines) {
          // delete the emb line items
          await transManager.getRepository(EmbLineItemEntity).delete({ companyCode: req.companyCode, unitCode: req.unitCode, embLineId: line.id});
          // delete the emb line
          await transManager.getRepository(EmbLineEntity).delete({ companyCode: req.companyCode, unitCode: req.unitCode, id: line.id});
        }
      }
      await transManager.completeTransaction();
      return new GlobalResponseObject(true, 16041, 'Emb line deleted successfully');
    } catch (error) {
      await transManager.releaseTransaction();
      throw error;
    }
  }

  /**
   * END POINT
   * Deletes the emb header
   * Bull job consumer
   * Called when the dockets are unconfirmed / dockets are deleted
   * @param req 
   */
  async deleteEmbHeader(req: PoDocketNumberRequest): Promise<GlobalResponseObject> {
    const transManager = new GenericTransactionManager(this.dataSource);
    try {
      const embHeaderRec = await this.embHeaderRepo.findOne({ where: { companyCode: req.companyCode, unitCode: req.unitCode, poSerial: req.poSerial, isActive: true, embParentJobRef: req.docketNumber } });
      if (!embHeaderRec) {
        return new GlobalResponseObject(true, 16042, `EMB header does not exist for the docket ${req.docketNumber} in the system`);
      }
      // check if any lines exist for the emb header
      const embLines = await this.embLineRepo.find({select:['id'], where: { companyCode: req.companyCode, unitCode: req.unitCode, poSerial: embHeaderRec.poSerial, embHeaderId: embHeaderRec.id } });
      if (embLines.length > 0) {
        throw new ErrorResponse(16043, `EMB lines exist for the emb header and doc : ${req.docketNumber}`);
      }
      await transManager.startTransaction();
      await transManager.getRepository(EmbHeaderEntity).delete({poSerial: embHeaderRec.poSerial, embJobNumber: embHeaderRec.embJobNumber, companyCode: req.companyCode, unitCode: req.unitCode});
      await this.helperService.deleteEmbTrackingInfoInternally(embHeaderRec.poSerial, embHeaderRec.embJobNumber, embHeaderRec.id, req.companyCode, req.unitCode, transManager);
      await transManager.completeTransaction();
      return new GlobalResponseObject(true, 16044, `EMB header details deleted for the doc : ${req.docketNumber} `);
    } catch (error) {
      await transManager.releaseTransaction();
      throw error;
    }
  }


  /**
   * UPDATER
   * END POINT
   * @param req 
   */
  async printBarcodesForEmbJob(req: EmbBarcodePrintRequest): Promise<GlobalResponseObject> {
    const transManager = new GenericTransactionManager(this.dataSource);
    try {
      console.log('Print request came in');
      if(req?.lineIds?.length <= 0) {
        throw new ErrorResponse( 16074 ,'Provide the emb line ids');
      }
      // get the emb header rec
      const embHeaderRec = await this.embHeaderRepo.findOne({select: ['id'],  where: { companyCode: req.companyCode, unitCode: req.unitCode, isActive: true, embJobNumber: req.embJobNumber } });
      if (!embHeaderRec) {
        return new GlobalResponseObject(true, 16072, `EMB header does not exist for the job ${req.embJobNumber} in the system`);
      }
      console.log('0');
      // update the barcode status in the emb line
      const embLineRecs = await this.embLineRepo.find({ where: {companyCode: req.companyCode, unitCode: req.unitCode, id: In(req.lineIds), embHeaderId: embHeaderRec.id}});
      if(embLineRecs.length == 0) {
        throw new ErrorResponse(16073,`EMB lines does not exist for job : ${req.embJobNumber} `);
      }
      console.log('1');

      await transManager.startTransaction();
      console.log('2');
      for(const line of embLineRecs) {
        if(line.bundlePrintStatus == true) {
          throw new ErrorResponse(16045, `Bundle tag is already printed for job : ${req.embJobNumber} and laying id : ${line.embActualJobRef}`);
        }
        console.log('3');
        await transManager.getRepository(EmbLineEntity).update({ companyCode: req.companyCode, unitCode: req.unitCode, id:line.id }, { bundlePrintStatus: true, supplierId: req.supplierId });
        console.log('4');
        const embPrintHistory = new EmbTagsPrintEntity();
        embPrintHistory.companyCode = req.companyCode;
        embPrintHistory.unitCode = req.unitCode;
        embPrintHistory.embLineId = line.id;
        embPrintHistory.createdUser = req.username;
        embPrintHistory.action = true;
        await transManager.getRepository(EmbTagsPrintEntity).save(embPrintHistory);
        console.log('5');
      }
      console.log('6');
      await transManager.completeTransaction();
      console.log('7');
      return new GlobalResponseObject(true, 16046, 'Emb barcode print successfull');
    } catch (error) {
      console.log(error);
      await transManager.releaseTransaction();
      throw error;
    }
  }

  /**
   * UPDATER
   * END POINT
   * @param req 
   */
  async releaseBarcodesPrintForEmbJob(req: EmbBarcodePrintRequest): Promise<GlobalResponseObject> {
    const transManager = new GenericTransactionManager(this.dataSource);
    try {
      if(req?.lineIds?.length <= 0) {
        throw new ErrorResponse( 16074 ,'Provide the emb line ids');
      }
      // get the emb header rec
      const embHeaderRec = await this.embHeaderRepo.findOne({select: ['id'],  where: { companyCode: req.companyCode, unitCode: req.unitCode, isActive: true, embJobNumber: req.embJobNumber } });
      if (!embHeaderRec) {
        return new GlobalResponseObject(true, 16072,`EMB header does not exist for the job ${req.embJobNumber} in the system`);
      }
      // update the barcode status in the emb line
      const embLineRecs = await this.embLineRepo.find({ where: {companyCode: req.companyCode, unitCode: req.unitCode, id: In(req.lineIds), embHeaderId: embHeaderRec.id}});
      if(embLineRecs.length == 0) {
        throw new ErrorResponse(16073,`EMB lines does not exist for job : ${req.embJobNumber} `);
      }

      await transManager.startTransaction();
      for(const line of embLineRecs) {
        if(line.bundlePrintStatus == false) {
          throw new ErrorResponse(16047, `Bundle tag is already released for job : ${req.embJobNumber} and laying id : ${line.embActualJobRef}`);
        }
        await transManager.getRepository(EmbLineEntity).update({ companyCode: req.companyCode, unitCode: req.unitCode, id:line.id }, { bundlePrintStatus: false, supplierId: 0 });
        const embPrintHistory = new EmbTagsPrintEntity();
        embPrintHistory.companyCode = req.companyCode;
        embPrintHistory.unitCode = req.unitCode;
        embPrintHistory.embLineId = line.id;
        embPrintHistory.createdUser = req.username;
        embPrintHistory.action = false;
        await transManager.getRepository(EmbTagsPrintEntity).save(embPrintHistory);
      }
      await transManager.completeTransaction();
      return new GlobalResponseObject(true, 16048, 'Emb barcode print release successfull');
    } catch (error) {
      await transManager.releaseTransaction();
      throw error;
    }
  }
  

  // END POINT
  // this will freeze the emb lines after the cut dispatch is created. to stop any actions on the emb job
  async freezeEmbLines(req: PoDocketNumbersRequest): Promise<GlobalResponseObject> {
    const jobRefNos = new Set<string>();
    req.docketNumbers.forEach(r => {
      jobRefNos.add(r);
    });
    if(jobRefNos.size == 0) {
      throw new ErrorResponse(935, 'No dockets given in the request');
    }
    const refDockets = Array.from(jobRefNos);
    const embLines = await this.embLineRepo.find({select: ['id'], where: { companyCode: req.companyCode, unitCode: req.unitCode, embParentJobRef: In(refDockets)} });
    if(embLines.length == 0) {
      return new GlobalResponseObject(true, 16075,'No Emb lines found to freeze');
    }
    await this.embLineRepo.update({ companyCode: req.companyCode, unitCode: req.unitCode, embParentJobRef: In(refDockets) }, { freezeStatus: true });
    return new GlobalResponseObject(true, 999, 'Emb lines freezed successfully');
  }

  // END POINT
  // this will freeze the emb lines after the cut dispatch is created. to stop any actions on the emb job
  async unFreezeEmbLines(req: PoDocketNumbersRequest): Promise<GlobalResponseObject> {
    const jobRefNos = new Set<string>();
    req.docketNumbers.forEach(r => {
      jobRefNos.add(r);
    });
    if(jobRefNos.size == 0) {
      throw new ErrorResponse(935, 'No dockets given in the request');
    }
    const refDockets = Array.from(jobRefNos);
    const embLines = await this.embLineRepo.find({select: ['id'], where: { companyCode: req.companyCode, unitCode: req.unitCode, embParentJobRef: In(refDockets)} });
    if(embLines.length == 0) {
      return new GlobalResponseObject(true, 16075,'No Emb lines found to freeze');
    }
    await this.embLineRepo.update({ companyCode: req.companyCode, unitCode: req.unitCode, embParentJobRef: In(refDockets) }, { freezeStatus: false });
    return new GlobalResponseObject(true, 16050, 'Emb lines freezed successfully');
  }
}