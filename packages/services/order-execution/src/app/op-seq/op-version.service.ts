import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { DataSource } from "typeorm";
import moment = require("moment");
import { OpVersionHelperService } from "./op-version-helper.service";
import { OpSeqRepository } from "./repository/op-seq.repository";
import { OpVersionRepository } from "./repository/op-version.repository";
import { GlobalResponseObject, OpGroupModel, OpVerIdRequest, OpVersionModel, OpVersionRequest, OpVersionResponse, OperationModel, PoProdutNameRequest, PoSerialRequest, StyleProdFgColorModel } from "@xpparel/shared-models";
import { GenericTransactionManager } from "../../database/typeorm-transactions";
import { OpVersion } from "./entity/op-version.entity";
import { OpSequence } from "./entity/op-seq.entity";
import { ErrorResponse } from "@xpparel/backend-utils";
import { OpVersionInfoService } from "./op-version-info.service";

@Injectable()
export class OpVersionService {
  constructor(
    private dataSource: DataSource,
    private opSeqRepo: OpSeqRepository,
    private opVerRepo: OpVersionRepository,
    @Inject(forwardRef(() => OpVersionHelperService)) private helperService: OpVersionHelperService,
    @Inject(forwardRef(() => OpVersionInfoService)) private infoService: OpVersionInfoService,
  ) {

  }

  /**
   * Service to Save Op evrsion sequence for the product/po serial number
   * @param req 
   * @returns 
  */
  async createOpVersionForProduct(req: OpVersionRequest): Promise<GlobalResponseObject> {
    const transManager = new GenericTransactionManager(this.dataSource);
    try {
      // check if a version is already saved. 
      const savedOpVersion = await this.opVerRepo.findOne({ where: { poSerial: req.poSerial, productName: req.productName, companyCode: req.companyCode, unitCode: req.unitCode } });
      if (savedOpVersion) {
        throw new ErrorResponse(0, `OP version is already saved for the PO and product : ${req.productName} `);
      }
      await transManager.startTransaction();
      await this.createOpVersionForProductWithManager(req, transManager);
      await transManager.completeTransaction();
      return new GlobalResponseObject(true, 1, 'Operation Sequence Saved Suceessfully');
    } catch (err) {
      await transManager.releaseTransaction();
      throw err;
    }
  }

  /**
   * Service to Save Op evrsion sequence for the product/po serial number with manager
   * @param req 
   * @param transManager 
   * @returns 
  */
  async createOpVersionForProductWithManager(req: OpVersionRequest, transManager: GenericTransactionManager): Promise<boolean> {
    console.log(req);
    //save product and version details 
    const opVesrionObj = new OpVersion()
    opVesrionObj.companyCode = req.companyCode;
    opVesrionObj.createdUser = req.username;
    opVesrionObj.description = req.opSeqModel.description;
    opVesrionObj.poSerial = req.poSerial;
    opVesrionObj.productName = req.productName;
    opVesrionObj.unitCode = req.unitCode;
    opVesrionObj.version = req.opSeqModel.version;
    opVesrionObj.style = req.style;
    opVesrionObj.productCode = req.productName;
    opVesrionObj.fgColor = req.fgColor;
    const saveopVersion = await transManager.getRepository(OpVersion).save(opVesrionObj);
    if (saveopVersion) {
      const opSeqs: OpSequence[] = [];
      for (const item of req.opSeqModel.operations) {
        // console.log(item);
        //get all the componenets and dependent groups under operation category and group
        const componentsInfo = req.opSeqModel.opGroups.filter(info => info.group == item.group && info.groupCategory == item.opCategory)
        //SAVE OPERATION SEQUENCE INFO
        const opSeqObj = new OpSequence()
        opSeqObj.companyCode = req.companyCode;
        opSeqObj.componentNames = componentsInfo[0].components.toString();
        opSeqObj.createdUser = req.username;
        opSeqObj.depGroup = componentsInfo[0].depGroups.toString();
        opSeqObj.eOpCode = item.opCode;
        opSeqObj.group = item.group;
        opSeqObj.iOpCode = item.opCode;
        opSeqObj.opCategory = item.opCategory;
        opSeqObj.opForm = item.opForm;
        opSeqObj.opName = item.opName;
        opSeqObj.opSequence = item.opSeq;
        opSeqObj.opVersionId = saveopVersion.id;
        opSeqObj.poSerial = req.poSerial;
        opSeqObj.productName = req.productName;
        opSeqObj.smv = item.smv ? item.smv : 0;
        opSeqObj.unitCode = req.unitCode;
        opSeqObj.productCode = req.productName;
        opSeqObj.productName = req.productName;
        opSeqObj.fgColor = req.fgColor;
        opSeqObj.style = req.style;
        opSeqs.push(opSeqObj);
      }
      await transManager.getRepository(OpSequence).save(opSeqs, { reload: false });
    }
    return true;
  }

  /**
   * Service to Delete Op evrsion sequence for the product/po serial number
   * @param req 
   * @returns 
  */
  async deleteOpVersion(req: OpVerIdRequest): Promise<GlobalResponseObject> {
    const transManager = new GenericTransactionManager(this.dataSource);
    try {
      if (!req.opVerId) {
        throw new ErrorResponse(0, 'Provide the op version id');
      }
      const opVersionRec = await this.opVerRepo.findOne({ where: { companyCode: req.companyCode, unitCode: req.unitCode, id: req.opVerId } });
      if (!opVersionRec) {
        throw new ErrorResponse(0, 'Op version does not exist for the provided version id');
      }
      // check the ratios are created for the po. If created, then we must not allow deleting the op sequence
      const ratiosForPo = await this.helperService.getRatioRecordsForPo(opVersionRec.poSerial, opVersionRec.companyCode, opVersionRec.unitCode);
      if (ratiosForPo.length > 0) {
        throw new ErrorResponse(0, 'Ratios already created for the product. Op version cannot be modified');
      }
      // check if the version exist before deleting
      //DELETE OPERATION VERSION BASED ON REQUEST VERSION ID
      await transManager.startTransaction();
      await transManager.getRepository(OpVersion).delete({ id: req.opVerId });
      await transManager.getRepository(OpSequence).delete({ opVersionId: req.opVerId });
      await transManager.completeTransaction();
      return new GlobalResponseObject(true, 1, 'Operation Sequence Deleted Successfully');
    } catch (err) {
      await transManager.releaseTransaction();
      throw err;
    }
  }

  /**
   * Service to Clone Parent Operation Version to child product names
   * @param parentOpsVersionId 
   * @param productNames 
   * @param poSerial 
   * @param companyCode 
   * @param unitCode 
   * @returns 
   */
  async copyOperationVersionToGivenProductNames(parentOpsVersionId: number, productNames: StyleProdFgColorModel[], poSerial: number, companyCode: string, unitCode: string, username: string, userId: number): Promise<GlobalResponseObject> {
    const manager = new GenericTransactionManager(this.dataSource);
    try {
      const operationVersionInfo = await this.opVerRepo.findOne({ where: { id: parentOpsVersionId, unitCode, companyCode, isActive: true, poSerial: poSerial } });
      if (!operationVersionInfo) {
        throw new ErrorResponse(0, 'Operation Version does not exists Please check and try again');
      }
      const operationSeqInfo: OpSequence[] = await this.opSeqRepo.find({ where: { opVersionId: parentOpsVersionId, unitCode, companyCode, isActive: true, poSerial: poSerial } });
      if (!operationVersionInfo) {
        throw new ErrorResponse(0, 'Operation Version does not exists Please check and try again');
      }
      const parentProductComponents = new Set();
      for (const opsSeq of operationSeqInfo) {
        for (const eachComp of opsSeq.componentNames.split(',')) {
          parentProductComponents.add(eachComp);
        }
      }
      // Need to get components of product names which we need to copy this ops
      // If components are vary we need to throw an error saying components mismatch
      const poSerialReq = new PoSerialRequest(null, unitCode, companyCode, null, poSerial, null, false, false);
      const productNamesInfo = await this.helperService.getPoProductNames(poSerialReq);
      if (!productNamesInfo.status || productNamesInfo.data.length == 0) {
        throw new ErrorResponse(productNamesInfo.errorCode, productNamesInfo.internalMessage);
      }
      for (const eachProductName of productNames) {
        const prodComponents = productNamesInfo.data.find(prod => (prod.productName == eachProductName.productName && prod.color == eachProductName.fgColor))?.components;
        if (!prodComponents.length) {
          throw new ErrorResponse(0, 'Components not found for the given product name: ' + eachProductName);
        }
        if (prodComponents.length != parentProductComponents.size) {
          throw new ErrorResponse(0, 'Components mismatch between parent product name and given product name: ' + eachProductName);
        }
        if (!prodComponents.every(eachComponent => parentProductComponents.has(eachComponent))) {
          throw new ErrorResponse(0, `Components mismatch between parent product name and given product name: ${eachProductName}`);
        }
      }
      const operationVersionDetails: OpVersionModel[] = await this.infoService.getOpVersionModels([parentOpsVersionId], poSerial, companyCode, unitCode);
      // we can directly get the 0th index of these model since we are giving only one version Id
      if (!operationVersionDetails.length) {
        throw new ErrorResponse(0, 'Unable to retrieve operation version model by ops version Id')
      }
      const parentOpsVersionModel = operationVersionDetails[0];
      await manager.startTransaction();
      for (const eachProductName of productNames) {
        const cloneReq = new OpVersionRequest(username, unitCode, companyCode, userId, eachProductName.productName, eachProductName.fgColor, eachProductName.style, poSerial, parentOpsVersionModel);
        await this.createOpVersionForProductWithManager(cloneReq, manager);
      }
      await manager.completeTransaction();
      return new GlobalResponseObject(true, 0, 'Operation Version Cloned Successfully');
    } catch (err) {
      await manager.releaseTransaction();
      throw err;
    }

  }

}