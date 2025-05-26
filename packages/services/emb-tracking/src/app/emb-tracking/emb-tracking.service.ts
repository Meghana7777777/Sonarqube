import { Injectable } from "@nestjs/common"; import { DataSource } from "typeorm";
import moment = require("moment");
import { EmbTrackingHelperService } from "./emb-tracking-helper.service";
import { EmbTrackingInfoService } from "./emb-tracking-info.service";
import { EmbOpHeaderRepository } from "./repository/emb-op-header.repository";
import { EmbOpLineRepository } from "./repository/emb-op-line.repository";
import { EmbTransactionLogRepository } from "./repository/emb-transaction-log.repository";
import { BarcodePrefixEnum, EmbBundleScanModel, EmbBundleScanRequest, EmbBundleScanResponse, EmbJobNumberOpCodeRequest, EmbJobNumberRequest, EmbReqAttibutesEnum, GlobalResponseObject, JobReconciliationEnum, ProcessTypeEnum, OpFormEnum, OpGroupModel, OperationModel, PoSerialRequest } from "@xpparel/shared-models";
import { ErrorResponse } from "@xpparel/backend-utils";
import { EmbOpHeaderEntity } from "./entity/emb-op-header.entity";
import { GenericTransactionManager } from "../../database/typeorm-transactions";
import { EmbOpLineEntity } from "./entity/emb-op-line.entity";
import { EmbTransactionLogEntity } from "./entity/emb-transaction-log.entity";
import { RejectionScanModel } from "packages/libs/shared-models/src/ets/emb-transaction/rejection/rejection-scan.model";
import { EmbAttributeEntity } from "../emb-request/entity/emb-attribute.entity";
import { EmbBundlePropsModel } from "packages/libs/shared-models/src/ets/emb-transaction/bundle-info/emb-bundle-prop.model";
import { redlock } from "../../config/redis/redlock.config";

@Injectable()
export class EmbTrackingService {
  constructor(
    private dataSource: DataSource,
    private infoService: EmbTrackingInfoService,
    private helperService: EmbTrackingHelperService,
    private embOpHeaderRepo: EmbOpHeaderRepository,
    private embOpLineRepo: EmbOpLineRepository,
    private transLogRepo: EmbTransactionLogRepository,
  ) {

  }

  // TODO
  // ENDPOINT
  // This is utilized to create the emb job from the backend if something goes wrong
  async createEmbTrackingInfo(req: EmbJobNumberRequest): Promise<GlobalResponseObject> {
    const transManager = new GenericTransactionManager(this.dataSource);
    try {
      // check if the emb job already created in the tracking
      const embRec = await this.embOpHeaderRepo.findOne({ where: { embJobNumber: req.embJobNumber, companyCode: req.companyCode, unitCode: req.unitCode }});
      if(embRec) {
        throw new ErrorResponse(16054, `The emb job : ${req.embJobNumber} is already created`);
      }
      // get the emb job info for the emb job number
      const embJobRec = await this.helperService.getEmbHeaderRecordForEmbJobNumber(req.embJobNumber, req.companyCode, req.unitCode);
      const embJobAttrs = await this.helperService.getEmbHeaderAttrsForEmbHeaderId(embRec.id, req.companyCode, req.unitCode);
      
      const poSerial = embJobRec.poSerial;
      const prodName = embJobRec.productName;
      const compAttrs = embJobAttrs.find(r => r.name == EmbReqAttibutesEnum.COMPONENTS);
      const jobQty = embJobAttrs.find(r => r.name == EmbReqAttibutesEnum.JOB_QTY);
      const jobComps = compAttrs?.value?.split(',');

      const pfEmbOpGroups = new Set<string>();
      const opGroupOps = new Map<string, string[]>();
      // get the po operations info for the po serial
      const opVersion = await this.helperService.getOpVersionsForPo(poSerial, prodName, req.companyCode, req.unitCode);
      // now check if the op version has the panel form emb matching with the current docket
      opVersion.operations.forEach(op => {
        if(op.opCategory == ProcessTypeEnum.EMB && op.opForm == OpFormEnum.PF) {
          // now checkf if comp matches
          // We are going with a find method since the array size is very less and no need to worry about performance
          const groupInfo = opVersion.opGroups.find(g => g.operations.includes(op.opCode))
          groupInfo?.components?.forEach(comp => {
            if(jobComps?.includes(comp)) {
              // push the eligible PF + EMB op groups
              pfEmbOpGroups.add(groupInfo.group);
            }
          });
          // set the operations for the op group
          opGroupOps.set(groupInfo.group, groupInfo.operations);
        }
      });
      if(pfEmbOpGroups.size == 0) {
        return new GlobalResponseObject(true, 16055, 'The provided lay ids doesnt have the component mapped for the emb operation');
      }
      await transManager.startTransaction();
      for(const opGroup of pfEmbOpGroups) {
        // save the emb job tracking details
        await this.createEmbTrackingInfoInternally( embJobRec.poSerial, embJobRec.embParentJobRef, embJobRec.embJobNumber, embJobRec.id, Number(jobQty), opGroupOps.get(opGroup), opVersion.opGroups, opVersion.operations, req.companyCode, req.unitCode, req.username, transManager);
      }
      await transManager.completeTransaction();
      return new GlobalResponseObject(true, 16056, 'Emb job created successfully');

    } catch (error) {
      await transManager.releaseTransaction();
      throw error;
    }
  }

  // NOT AN ENDPOINT
  // CALLED FROM THE EMB JOB CREAITON SERVICE
  async createEmbTrackingInfoInternally(poSerial: number, docketNumber: string, embJobNumber: string, embHeaderId: number, jobQty: number, operations: string[], opGroups: OpGroupModel[], opInfoMap: OperationModel[], companyCode: string, unitCode: string, username: string, transManager: GenericTransactionManager): Promise<boolean> {
    const embRec = await this.embOpHeaderRepo.findOne({ where: { embJobNumber: embJobNumber, companyCode: companyCode, unitCode: unitCode }});
    if(embRec) {
      // emb job tracking detail is already created
      return true;
    }
    // identify the pre op of any given operation
    const embOpHeader = new EmbOpHeaderEntity();
    embOpHeader.companyCode = companyCode;
    embOpHeader.unitCode = unitCode;
    embOpHeader.createdUser = username;
    embOpHeader.embJobNumber = embJobNumber;
    embOpHeader.embHeaderId = embHeaderId;
    embOpHeader.jobQuantity = jobQty;
    embOpHeader.poSerial = poSerial;
    embOpHeader.goodQuantity = 0; embOpHeader.rejectedQuantity = 0; embOpHeader.reconciliationStatus = JobReconciliationEnum.OPEN;
    const savedEmbOpHeader = await transManager.getRepository(EmbOpHeaderEntity).save(embOpHeader);

    for(const op of operations) {
      // We are going with a find method since the array size is very less and no need to worry about performance
      const opInfo = opInfoMap.find(r => r.opCode == op);

      const embOpEnt = new EmbOpLineEntity();
      embOpEnt.companyCode = companyCode;
      embOpEnt.unitCode = unitCode;
      embOpEnt.createdUser = username;
      embOpEnt.embJobNumber = embJobNumber;
      embOpEnt.embOpHeaderId = savedEmbOpHeader.id;
      embOpEnt.rejectedQuantity = 0;
      embOpEnt.goodQuantity = 0;
      embOpEnt.jobQuantity = jobQty;
      embOpEnt.operationCode = op;
      embOpEnt.opGroup = opInfo.group;
      embOpEnt.sequence = opInfo.opSeq;
      embOpEnt.embParentJobRef = docketNumber;
      embOpEnt.poSerial = poSerial;
      await transManager.getRepository(EmbOpLineEntity).save(embOpEnt, {reload: false});
    }

  }

  // END POINT
  // Deletes the emb job tracking info
  async deleteEmbTrackingInfoInternally(poSerial: number, embJobNumber: string, embHeaderId: number, companyCode: string, unitCode: string, transManager: GenericTransactionManager): Promise<boolean> {
    await transManager.getRepository(EmbOpHeaderEntity).delete({ companyCode: companyCode, unitCode: unitCode, poSerial: poSerial, embJobNumber: embJobNumber, embHeaderId: embHeaderId });
    await transManager.getRepository(EmbOpLineEntity).delete({ companyCode: companyCode, unitCode: unitCode, embJobNumber: embJobNumber, poSerial: poSerial });
    return true;
  }


  validateRejectionQtys(rejQty: number, rejReasonQtys: RejectionScanModel[]): boolean {
    let totalRejQty = 0;
    rejReasonQtys?.forEach(r => totalRejQty += Number(r.quantity) );
    if(totalRejQty != rejQty) {
      throw new ErrorResponse(16057, 'Entered rejection qty and reason wise qtys doesnt match');
    }
    return true;
  }


  // ENDPOINT
  // TODO: Applty the dynamic redlock to stop duplicate scans from the scanner
  // scan the emb bundle
  // Scans Good / Rejections
  async reportEmbBundle(req: EmbBundleScanRequest): Promise<EmbBundleScanResponse> {
    const transManager = new GenericTransactionManager(this.dataSource);
    try {
      const barcodeParts = req.barcode.split('-');
      const prefix = barcodeParts[0];
      const layId = barcodeParts[1];
      const bunleNo = barcodeParts[2];
      // if rejections are present validate for equality
      this.validateRejectionQtys(req.rQty, req.rejections);
      // get the barcode record
      const barcodeRecord = await this.helperService.getEmbLineItemByBarcodeNumber(req.barcode, req.companyCode, req.unitCode);
      if(!barcodeRecord) {
        throw new ErrorResponse(  16076,`Barcode ${req.barcode} does not exist`);
      }
      // If the input is for report as full good true, then the bundle original quantity will be scanned
      if(req.considerFullBundleQty) {
        req.gQty = barcodeRecord.quantity;
      }
      const embHeaderRecord = await this.helperService.getEmbHeaderRecordForEmbHeaderId(barcodeRecord.embHeaderId, req.companyCode, req.unitCode);
      if(!embHeaderRecord) {
        throw new ErrorResponse(16077,`EMB job is not found for the barcode : ${req.barcode} `);
      }
      const embLineRecord = await this.helperService.getEmbLineRecordsForEmbLineId(barcodeRecord.embLineId, req.companyCode, req.unitCode);
      const bundleColor = embLineRecord.color;
      if(embLineRecord.freezeStatus) {
        throw new ErrorResponse(16078, 'Emb jobs are freezed. Might be cut is already dispatch.');
      }
      const operationsForBarcode = await this.embOpLineRepo.find({ select: ['opGroup', 'operationCode'], where: { companyCode: req.companyCode, unitCode: req.unitCode, embJobNumber: embHeaderRecord.embJobNumber }, order: { sequence: 'ASC' } });
      if(operationsForBarcode.length == 0) {
        throw new ErrorResponse(16064, 'Barcode is invalid for the operation');
      }
      const opsForJob = operationsForBarcode.map(b => b.operationCode);
      if (!opsForJob.includes(req.operationCode)) {
        throw new ErrorResponse(16058, 'Operation does not belong to the bundle. Please verify');
      }
      const scannedQty = await this.transLogRepo.getGoodAndRejQtyForBarcodeAndOp(req.barcode, req.operationCode, req.companyCode, req.unitCode);
      const preScanQty = Number(scannedQty.g_qty) + Number(scannedQty.r_qty);
      const pendingQty = Number(barcodeRecord.quantity) - ( preScanQty );
      if(pendingQty == 0) {
        throw new ErrorResponse(16065, 'Bundle is already scanned for the operation');
      }
      if (Number(req.gQty) + Number(req.rQty) > pendingQty) {
        throw new ErrorResponse(16066, `Trying to scan more than bundle qty. Bundle qty : ${barcodeRecord.quantity}. Already scanned qty : ${preScanQty} `);
      }
      const howManyOpsInOpGroup = operationsForBarcode.length;
      const firstOpInOpGroup = operationsForBarcode[0].operationCode;
      const lastOpInOpGroup = operationsForBarcode[1]?.operationCode;
      // let preOperations = []; // 'NOT-REQUIRED';
      // let newBarcode = '';
      let preOpIsCutting = false;
      const preBarcodeOpsCombos: {preOp: string, barcode: string}[] = [];
      if (firstOpInOpGroup == req.operationCode || howManyOpsInOpGroup == 1) {
        // This means this operation is the first in the job group. So we have to bother about the last operation of the previous job group
        const poSerial = embHeaderRecord.poSerial;
        const prodName = embHeaderRecord.productName;
        const embHeaderId = embHeaderRecord.id;
        const embJob = embHeaderRecord.embJobNumber;
        // get the op version info from the OES
        const opVersionInfo = await this.helperService.getOpVersionsForPo(poSerial, prodName, req.companyCode, req.unitCode);
        const sortedOperations = opVersionInfo.operations.sort((a, b) => a.opSeq - b.opSeq );
        const opGroupOpInfoMap = new Map<string, OperationModel[]>();
        const opGroupInfoMap = new Map<string, OpGroupModel>();
        sortedOperations.forEach(r => {
          if(!opGroupOpInfoMap.has(r.group)) {
            opGroupOpInfoMap.set(r.group, []);
          }
          opGroupOpInfoMap.get(r.group).push(r);
        });
        opVersionInfo.opGroups.forEach(r => {
          opGroupInfoMap.set(r.group, r);
        });
        const currOpInfo = opVersionInfo.operations.find(r => r.opCode == req.operationCode);
        const currentOpGroup = currOpInfo.group;
        const currOpGroupInfo = opVersionInfo.opGroups.find(r => r.group == currentOpGroup);
        const depGroups = currOpGroupInfo.depGroups;
        depGroups.forEach(g => {
          const depGroupInfo = opGroupInfoMap.get(g);
          if(depGroupInfo.groupCategory != ProcessTypeEnum.LAY && depGroupInfo.groupCategory != ProcessTypeEnum.CUT) {
            // now read the last op in the dep group
            const tempLastOp = opGroupOpInfoMap.get(g);
            // if the last op group has 2 oeprations, then identify the last of it
            const preOp = tempLastOp.length == 2 ? tempLastOp[1].opCode : tempLastOp[0].opCode;
            // TODO: Move this construction to a common place
            const newTempBrcd = BarcodePrefixEnum.PANEL_EMB_BUNDLE+g+'-'+layId+'-'+bunleNo;
            preBarcodeOpsCombos.push({ barcode: newTempBrcd, preOp: firstOpInOpGroup});
          }
        });
        preOpIsCutting = preBarcodeOpsCombos.length == 0;
      } else {
        // the incoming is the last operation of an opgroup. so we can assign the first op in the op group as the dep operation
        // preOperations = [firstOpInOpGroup];
        // newBarcode = req.barcode;
        preBarcodeOpsCombos.push({ barcode: req.barcode, preOp: firstOpInOpGroup});
      }

      // If the pre operation is a cutting, then no need to do any validations. Simply skip
      if(!preOpIsCutting) {
        // pre ops may be N. We have to check if all those operations are completed for the current operation to proceed
        for(const preOpBarcode of preBarcodeOpsCombos) {
          // get the pre operation qtys
          const preOpScannedQty = await this.transLogRepo.getGoodAndRejQtyForBarcodeAndOp(preOpBarcode.barcode, preOpBarcode.preOp, req.companyCode, req.unitCode);
          // findout the eligible qty from the pervious operation
          const availableScannableQty = Number(preOpScannedQty.g_qty) - ( Number(scannedQty.g_qty) + Number(scannedQty.r_qty) );
          if( availableScannableQty < (req.gQty + req.rQty) ) {
            throw new ErrorResponse(0, `Previous operation ${preOpBarcode.preOp} is not done to fulfill this operation. Available qty : ${availableScannableQty}`);
          }
        }
      }
      await transManager.startTransaction();
      // Now all validations are done. There is an eligible qty and the bundle can be scanned. 
      if(req.rQty > 0) {
        await this.helperService.createEmbRejectionsInternally(embHeaderRecord.poSerial, embHeaderRecord.embJobNumber, req.barcode, req.operationCode, embHeaderRecord.opGroup, req.rQty, req.rejections, req.companyCode, req.unitCode, req.username, transManager);
      }

      // finally create the entry in the transaction log for the good and the rejected qty
      const transLogEnt = new EmbTransactionLogEntity();
      transLogEnt.companyCode = req.companyCode;
      transLogEnt.unitCode = req.unitCode;
      transLogEnt.barcode = req.barcode;
      transLogEnt.color = bundleColor;
      transLogEnt.size = barcodeRecord.size;
      transLogEnt.embJobNumber = embHeaderRecord.embJobNumber;
      transLogEnt.goodQuantity = req.gQty;
      transLogEnt.rejectedQuantity = req.rQty;
      transLogEnt.poSerial = embHeaderRecord.poSerial;
      transLogEnt.operationCode = req.operationCode;
      transLogEnt.createdUser = req.username;
      await transManager.getRepository(EmbTransactionLogEntity).save(transLogEnt, { reload: false });
      await transManager.completeTransaction();

      // add bull job after every bundle scan to update the job qty 
      await this.helperService.addEmbOpQtyUpdate(embHeaderRecord.embJobNumber, req.operationCode, req.companyCode, req.unitCode, req.username);
      let otherProps = null;
      if (req.iNeedBundleDetailedResponse) {
        console.log('TRIGGERED');
        otherProps = await this.getEmbBundleScannedProps(embHeaderRecord.id, embHeaderRecord.docketGroup, barcodeRecord.embLineId, embHeaderRecord.embParentJobRef, bundleColor, barcodeRecord.size, req.companyCode, req.unitCode);
      }

      const embScanResModel = new EmbBundleScanModel(null, null, null, null, req.barcode, req.operationCode, req.gQty, req.rQty, barcodeRecord.quantity, otherProps);
      return new EmbBundleScanResponse(true, 16079, 'Bundle scan success', [embScanResModel]);
    } catch (error) {
      await transManager.releaseTransaction();
      throw error;
    }
  }

  // ENDPOINT
  // TODO: Applty the dynamic redlock to stop duplicate scans from the scanner
  // scan the emb bundle
  // Scans Good Reversal
  async reportEmbBundleReversal(req: EmbBundleScanRequest): Promise<EmbBundleScanResponse> {
    const transManager = new GenericTransactionManager(this.dataSource);
    try {
      const barcodeParts = req.barcode.split('-');
      const prefix = barcodeParts[0];
      const layId = barcodeParts[1];
      const bunleNo = barcodeParts[2];
      // if rejections are present validate for equality
      this.validateRejectionQtys(req.rQty, req.rejections);
      // get the barcode record
      const barcodeRecord = await this.helperService.getEmbLineItemByBarcodeNumber(req.barcode, req.companyCode, req.unitCode);
      if(!barcodeRecord) {
        throw new ErrorResponse(  16076,`Barcode ${req.barcode} does not exist`);
      }
      // If the input is for report as full good true, then the bundle original quantity will be scanned
      if(req.considerFullBundleQty) {
        req.gQty = Number(barcodeRecord.quantity);
      }
      const embHeaderRecord = await this.helperService.getEmbHeaderRecordForEmbHeaderId(barcodeRecord.embHeaderId, req.companyCode, req.unitCode);
      if(!embHeaderRecord) {
        throw new ErrorResponse(16077, `EMB job is not found for the barcode : ${req.barcode} `);
      }
      const embLineRecord = await this.helperService.getEmbLineRecordsForEmbLineId(barcodeRecord.embLineId, req.companyCode, req.unitCode);
      const bundleColor = embLineRecord.color;
      if(embLineRecord.freezeStatus) {
        throw new ErrorResponse(16078, 'Emb jobs are freezed. Might be cut is already dispatch.');
      }
      const operationsForBarcode = await this.embOpLineRepo.find({ select: ['opGroup', 'operationCode'], where: { companyCode: req.companyCode, unitCode: req.unitCode, embJobNumber: embHeaderRecord.embJobNumber }, order: { sequence: 'ASC'} });
      if(operationsForBarcode.length == 0) {
        throw new ErrorResponse(16058, 'Operation does not belong to the bundle. Please verify');
      }
      const scannedQty = await this.transLogRepo.getGoodAndRejQtyForBarcodeAndOp(req.barcode, req.operationCode, req.companyCode, req.unitCode);
      scannedQty.r_qty = Number(scannedQty.r_qty); 
      scannedQty.g_qty = Number(scannedQty.g_qty);
      // const pendingQty = barcodeRecord.quantity - ( scannedQty.g_qty );
      if (req.gQty > scannedQty.g_qty) {
        throw new ErrorResponse(16059, `Only ${scannedQty.g_qty} is completed for this operation. But you are trying to reverse ${req.gQty} `);
      }
      const howManyOpsInOpGroup = operationsForBarcode.length;
      const firstOpInOpGroup = operationsForBarcode[0].operationCode;
      const lastOpInOpGroup = operationsForBarcode[1]?.operationCode;

      let nextOpIsPacking = false;
      const postBarcodeOpsCombos: {postOp: string, barcode: string}[] = [];
      if (firstOpInOpGroup == req.operationCode && howManyOpsInOpGroup == 2) {
        // the incoming is the first operation of an opgroup. so we can assign the last op with in the op group as the next operation for verification
        postBarcodeOpsCombos.push({ barcode: req.barcode, postOp: lastOpInOpGroup});
      } else {
        // This means this operation is the last in the job group. So we have to bother about the first operation of the next job group in the sequence
        const poSerial = embHeaderRecord.poSerial;
        const prodName = embHeaderRecord.productName;
        const embHeaderId = embHeaderRecord.id;
        const embJob = embHeaderRecord.embJobNumber;
        // get the op version info from the OES
        const opVersionInfo = await this.helperService.getOpVersionsForPo(poSerial, prodName, req.companyCode, req.unitCode);
        const sortedOperations = opVersionInfo.operations.sort((a, b) => a.opSeq - b.opSeq );

        // The map that holds the next op groups of a given op group
        const nexOpGroupMap = new Map<string, Set<string>>();
        opVersionInfo.opGroups.forEach(currG => {
          currG.depGroups.forEach(preG => {
            if(!nexOpGroupMap.has(preG)) {
              nexOpGroupMap.set(preG, new Set<string>());
            }
            nexOpGroupMap.get(preG).add(currG.group);
          });
        });
        console.log(nexOpGroupMap);
        // map that holds the operations under a op-group
        const opGroupOpInfoMap = new Map<string, OperationModel[]>();
        sortedOperations.forEach(r => {
          if(!opGroupOpInfoMap.has(r.group)) {
            opGroupOpInfoMap.set(r.group, []);
          }
          opGroupOpInfoMap.get(r.group).push(r);
        });
        const currOpInfo = opVersionInfo.operations.find(r => r.opCode == req.operationCode);
        const currentOpGroup = currOpInfo.group;
        // The next op groups is valid only if this op-version has any other like packing operation after the emb operation. If emb is the last operation, then we will get the next group as EMPTY
        const nextOpGroups = nexOpGroupMap.get(currentOpGroup);
        if(!nextOpGroups) {
          // Do nothing as of now
          nextOpIsPacking = true;
        } else {
          nextOpGroups.forEach(nextG => {
            const nextGroupInfo = opVersionInfo.opGroups.find(r => r.group == nextG );
            if(nextGroupInfo.groupCategory != ProcessTypeEnum.PACK) {
              // now read the first op in the next immediate group
              const tempNextOps = opGroupOpInfoMap.get(nextG);
              // if the next op group has 2 oeprations, we only bother about the very first operation
              const nextOp = tempNextOps[0].opCode;
              const newTempBrcd = BarcodePrefixEnum.PANEL_EMB_BUNDLE + nextG + '-' + layId + '-' + bunleNo;
              postBarcodeOpsCombos.push({ barcode: newTempBrcd, postOp: firstOpInOpGroup});
            }
          });
          nextOpIsPacking = postBarcodeOpsCombos.length == 0;
        }
      }

      // If the pre operation is a cutting, then no need to do any validations. Simply skip
      if(nextOpIsPacking) {
        // have to implement the proper validation if the dispatch note is created or not
      } else {
        // pre ops may be N. We have to check if all those operations are completed for the current operation to proceed
        for(const postOpBarcode of postBarcodeOpsCombos) {
          // get the pre operation qtys
          console.log(postOpBarcode);
          const nextOpScannedQty = await this.transLogRepo.getGoodAndRejQtyForBarcodeAndOp(postOpBarcode.barcode, postOpBarcode.postOp, req.companyCode, req.unitCode);
          nextOpScannedQty.g_qty = Number(nextOpScannedQty.g_qty);
          nextOpScannedQty.r_qty = Number(nextOpScannedQty.r_qty);
          // findout the eligible qty from the next operation
          const availableReversableQty = scannedQty.g_qty - ( nextOpScannedQty.g_qty + nextOpScannedQty.r_qty );
          if( availableReversableQty < Number(req.gQty) ) {
            throw new ErrorResponse(16060, `Next operation ${postOpBarcode.postOp} is already done to fulfill this operation. Available reversible qty : ${availableReversableQty}`);
          }
        }
      }
      
      await transManager.startTransaction();
      // finally create the entry in the transaction log for the good and the rejected qty
      const transLogEnt = new EmbTransactionLogEntity();
      transLogEnt.companyCode = req.companyCode;
      transLogEnt.unitCode = req.unitCode;
      transLogEnt.barcode = req.barcode;
      transLogEnt.color = bundleColor;
      transLogEnt.size = barcodeRecord.size;
      transLogEnt.embJobNumber = embHeaderRecord.embJobNumber;
      transLogEnt.goodQuantity = -req.gQty;
      transLogEnt.rejectedQuantity = 0;
      transLogEnt.poSerial = embHeaderRecord.poSerial;
      transLogEnt.operationCode = req.operationCode;
      
      await transManager.getRepository(EmbTransactionLogEntity).save(transLogEnt, { reload: false });
      await transManager.completeTransaction();

      // add bull job after every bundle scan to update the job qty 
      await this.helperService.addEmbOpQtyUpdate(embHeaderRecord.embJobNumber, req.operationCode, req.companyCode, req.unitCode, req.username);
      
      let otherProps = null;
      if (req.iNeedBundleDetailedResponse) {
        otherProps = await this.getEmbBundleScannedProps(embHeaderRecord.id, embHeaderRecord.docketGroup, barcodeRecord.embLineId, embHeaderRecord.embParentJobRef, bundleColor, barcodeRecord.size, req.companyCode, req.unitCode);
      }
  
      const embScanResModel = new EmbBundleScanModel(null, null, null, null, req.barcode, req.operationCode, req.gQty, req.rQty, barcodeRecord.quantity, otherProps);
      return new EmbBundleScanResponse(true, 16079, 'Bundle scan success', [embScanResModel]);
    } catch (error) {
      await transManager.releaseTransaction();
      throw error;
    }
  }


  // ENDPOINT
  // Only for the emb reversal operation
  async reportEmbBundleRejReversal(req: EmbBundleScanRequest): Promise<EmbBundleScanResponse> {
    const transManager = new GenericTransactionManager(this.dataSource);
    try {
      // get the barcode record
      const barcodeRecord = await this.helperService.getEmbLineItemByBarcodeNumber(req.barcode, req.companyCode, req.unitCode);
      if(!barcodeRecord) {
        throw new ErrorResponse(  16076,`Barcode ${req.barcode} does not exist`);
      }
      const embHeaderRecord = await this.helperService.getEmbHeaderRecordForEmbHeaderId(barcodeRecord.embHeaderId, req.companyCode, req.unitCode);
      if(!embHeaderRecord) {
        throw new ErrorResponse(16077, `EMB job is not found for the barcode : ${req.barcode} `);
      }
      const scannedQty = await this.transLogRepo.getGoodAndRejQtyForBarcodeAndOp(req.barcode, req.operationCode, req.companyCode, req.unitCode);
      if(scannedQty.r_qty <= 0) {
        throw new ErrorResponse(16061, 'No rejections are done to do the reversal operation');
      }
      const totalRejQty = scannedQty.r_qty;

      await transManager.startTransaction();

      await this.helperService.reverseEmbRejectionsInternally(embHeaderRecord.poSerial, embHeaderRecord.embJobNumber, req.barcode, req.operationCode, req.companyCode, req.unitCode, req.username, transManager);
      // finally create the entry in the transaction log for the good and the rejected qty
      const transLogEnt = new EmbTransactionLogEntity();
      transLogEnt.companyCode = req.companyCode;
      transLogEnt.unitCode = req.unitCode;
      transLogEnt.barcode = req.barcode;
      transLogEnt.color = scannedQty.color;
      transLogEnt.size = barcodeRecord.size;
      transLogEnt.embJobNumber = embHeaderRecord.embJobNumber;
      transLogEnt.goodQuantity = 0;
      transLogEnt.rejectedQuantity = -totalRejQty;
      await transManager.getRepository(EmbTransactionLogEntity).save(transLogEnt, { reload: false });
      await transManager.completeTransaction();
      
      // add bull job after every bundle scan to update the job qty 
      await this.helperService.addEmbOpQtyUpdate(embHeaderRecord.embJobNumber, req.operationCode, req.companyCode, req.unitCode, req.username);

      let otherProps = null;
      if (req.iNeedBundleDetailedResponse) {
        otherProps = await this.getEmbBundleScannedProps(embHeaderRecord.id, embHeaderRecord.docketGroup, barcodeRecord.embLineId, embHeaderRecord.embParentJobRef, scannedQty.color, scannedQty.size, req.companyCode, req.unitCode);
      }
      const embScanResModel = new EmbBundleScanModel(null, null, null, null, req.barcode, req.operationCode, req.gQty, req.rQty, barcodeRecord.quantity, otherProps);
      return new EmbBundleScanResponse(true, 16079, 'Bundle scan success', [embScanResModel]);
    } catch (error) {
      await transManager.releaseTransaction();
      throw error;
    }
  }

  // HELPER
  async getEmbBundleScannedProps(embHEaderId: number, docketGroup: string, embLineId: number, docNumber: string, color: string, size: string, companyCode: string, unitCode: string): Promise<EmbBundlePropsModel> {
    const embHeaderAttrs = await this.helperService.getEmbHeaderAttrsForEmbHeaderId(embHEaderId, companyCode, unitCode);
    const embHeaderAttrMap = new Map<EmbReqAttibutesEnum, string>();
    embHeaderAttrs.forEach(r => embHeaderAttrMap.set(r.name, r.value));

    const embLineAttrs = await this.helperService.getEmbHeaderAttrsForEmbLineId(embLineId, companyCode, unitCode);
    const embLineAttrMap = new Map<EmbReqAttibutesEnum, string>();
    embLineAttrs.forEach(r => embLineAttrMap.set(r.name, r.value));

    // TODO: CUTNUMBER
    return new EmbBundlePropsModel(
      null, null, docNumber, docketGroup, size, color, null, embHeaderAttrMap.get(EmbReqAttibutesEnum.MONO), embHeaderAttrMap.get(EmbReqAttibutesEnum.MOLINES)
    );

  }

  // ENDPOINT
  // Called by bull job after the bundle scan
  async updateEmbJobOperationQty(req: EmbJobNumberOpCodeRequest): Promise<GlobalResponseObject> {
    let lock;
    try {
      if(!req.embJobNumber || !req.opCode) {
        throw new ErrorResponse(16067, 'Emb job number and operation code are not provided in the request');
      }
      const embJob = req.embJobNumber;
      const lockKey = `EMB_JOB-${embJob}`;
      var ttl = 120000;
      lock = await redlock.lock(lockKey, ttl);

      // get the good and rej qtys for the job
      const transactions = await this.transLogRepo.getBundleWiseGoodAndRejQtyForEmbJob(req.embJobNumber, [req.opCode], req.companyCode, req.unitCode);
      if(transactions.length == 0) {
        return new GlobalResponseObject(true, 16063, 'No transactions exist for the emb job and the operation');
      }
      let goodQty = 0;
      let rejQty = 0;
      transactions.forEach(r => {
        goodQty += Number(r.g_qty);
        rejQty += Number(r.r_qty);
      });
      await this.embOpLineRepo.update({ companyCode: req.companyCode, unitCode: req.unitCode, embJobNumber: req.embJobNumber, operationCode: req.opCode}, { rejectedQuantity: rejQty, goodQuantity: goodQty });
      await lock.unlock();
    } catch (error) {
      lock ? await lock.unlock() : '';
      throw error;
    }
  }
}

