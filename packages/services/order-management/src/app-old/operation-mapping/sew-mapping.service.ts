import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { ErrorResponse } from "@xpparel/backend-utils";
import { GlobalResponseObject, ProcessTypeEnum, OpVersionModel, OrderLinesRequest, PoProdNameModel, PoProdNameResponse, RawMaterialIdRequest, SewRawMaterialResponse, SewRawMaterialResponseModel, SewSerialRequest, SewVerIdRequest, SewVersionRequest } from "@xpparel/shared-models";
import { DataSource, Repository } from "typeorm";
import { GenericTransactionManager } from "../../database/typeorm-transactions";
import { SewRawMaterial } from "./entity/sew-raw-material-entity";
import { SewSequence } from "./entity/sew-seq.entity";
import { SewVersion } from "./entity/sew-version.entity";
import { SewSeqRepository } from "./repository/sew-seq.repository";
import { SewVersionRepository } from "./repository/sew-version-repository";
import { SewVersionHelperService } from "./sew-mapping-helper.service";
import { SewVersionInfoService } from "./sew-mapping-info.service";
import moment = require("moment");
import { InjectRepository } from "@nestjs/typeorm";
import { POService } from "@xpparel/shared-services";
// import { SewingOrderService } from "../sewing-order-creation/sewing-order/sewing-order.service";

@Injectable()
export class SewVersionService {
  constructor(
    private dataSource: DataSource,
    private sewSeqRepo: SewSeqRepository,
    private sewVerRepo: SewVersionRepository,
    @Inject(forwardRef(() => SewVersionHelperService)) private helperService: SewVersionHelperService,
    @Inject(forwardRef(() => SewVersionInfoService)) private infoService: SewVersionInfoService,
    @InjectRepository(SewRawMaterial)
    private readonly sewRawRepo: Repository<SewRawMaterial>,
    private poService: POService,
    // @Inject(forwardRef(() => SewingOrderService)) private sewOrderService: SewingOrderService
  ) {

  }

  /**
   * Service to Save Op evrsion sequence for the product/po serial number
   * @param req 
   * @returns 
  */
  // async createSewVersionForProduct(req: SewVersionRequest): Promise<GlobalResponseObject> {
  //   const transManager = new GenericTransactionManager(this.dataSource);
  //   try {
  //     // check if a version is already saved. 
  //     const savedOpVersion = await this.sewVerRepo.findOne({
  //       where: {
  //         saleOrder:req.saleOrder,
  //         productName: req.productName,
  //         companyCode: req.companyCode,
  //         unitCode: req.unitCode
  //       }
  //     });
  //     if (savedOpVersion) {
  //       throw new ErrorResponse(0, `OP version is already saved for the PO and product : ${req.productName} `);
  //     }
  //     await transManager.startTransaction();
  //     const opVersion = await this.createSewVersionForProductWithManager(req, transManager);
  //     const sewRawMaterials = req.rawMaterials.map((material) => {
  //       const rawMaterialObj = new SewRawMaterial();
  //       rawMaterialObj.companyCode = req.companyCode;
  //       rawMaterialObj.unitCode = req.unitCode;
  //       rawMaterialObj.product = material.product;
  //       rawMaterialObj.productType = material.productType;
  //       rawMaterialObj.consumption = material.consumption;
  //       rawMaterialObj.iOpCode = material.opCode;
  //       rawMaterialObj.uom = material.uom;
  //       rawMaterialObj.createdUser = req.username;
  //       rawMaterialObj.opVersionId = opVersion.id;
  //       rawMaterialObj.sewSerial = opVersion.sewSerial;
  //       return rawMaterialObj;
  //     });
  //     await transManager.getRepository(SewRawMaterial).save(sewRawMaterials, { reload: false });
  //     await transManager.completeTransaction();
  //     return new GlobalResponseObject(true, 1, 'Operation Sequence Saved Suceessfully');
  //   } catch (err) {
  //     await transManager.releaseTransaction();
  //     throw err;
  //   }
  // }

  /**
   * Service to Save Op evrsion sequence for the product/po serial number with manager
   * @param req 
   * @param transManager 
   * @returns 
  */
  // async createSewVersionForProductWithManager(req: SewVersionRequest, transManager: GenericTransactionManager): Promise<SewVersion> {
  //   //save product and version details 
  //   const opVesrionObj = new SewVersion()
  //   opVesrionObj.companyCode = req.companyCode;
  //   opVesrionObj.createdUser = req.username;
  //   opVesrionObj.description = req.opSeqModel.description;
  //   opVesrionObj.sewSerial = req.poSerial;
  //   opVesrionObj.productName = req.productName;
  //   opVesrionObj.unitCode = req.unitCode;
  //   opVesrionObj.version = req.opSeqModel.version;
  //   opVesrionObj.saleOrder = req.saleOrder;
  //   const saveopVersion = await transManager.getRepository(SewVersion).save(opVesrionObj);
  //   const prcessTypeBgMap = new Map<ProcessTypeEnum, number>();
  //   let bgNumber = 1;
  //   if (saveopVersion) {
  //     const opSeqs: SewSequence[] = [];
  //     for (const item of req.opSeqModel.operations) {
  //       if (!prcessTypeBgMap.has(item.opCategory)) {
  //         prcessTypeBgMap.set(item.opCategory, bgNumber++)
  //       }
  //       //get all the componenets and dependent groups under operation category and group
  //       const componentsInfo = req.opSeqModel.opGroups.filter(info => info.group == item.group && info.groupCategory == item.opCategory)
  //       //SAVE OPERATION SEQUENCE INFO
  //       const opSeqObj = new SewSequence()
  //       opSeqObj.companyCode = req.companyCode;
  //       opSeqObj.componentNames = componentsInfo[0].components.toString();
  //       opSeqObj.createdUser = req.username;
  //       opSeqObj.depGroup = componentsInfo[0].depGroups.toString();
  //       opSeqObj.eOpCode = item.opCode;
  //       opSeqObj.group = Number(item.group);
  //       opSeqObj.iOpCode = item.opCode;
  //       opSeqObj.opCategory = item.opCategory;
  //       opSeqObj.opForm = item.opForm;
  //       opSeqObj.opName = item.opName;
  //       opSeqObj.opSequence = item.opSeq;
  //       opSeqObj.opVersionId = saveopVersion.id;
  //       opSeqObj.sewSerial = req.poSerial;
  //       opSeqObj.productName = req.productName;
  //       opSeqObj.smv = item.smv;
  //       opSeqObj.unitCode = req.unitCode; 
  //       opSeqObj.jobType = item.opCategory;
  //       opSeqObj.itemCode=componentsInfo[0].itemCode;
        
  //       opSeqObj.bundleGroup = prcessTypeBgMap.get(item.opCategory)
  //       opSeqs.push(opSeqObj);;
  //     }
  //     await transManager.getRepository(SewSequence).save(opSeqs, { reload: false });
  //   }

  //   return saveopVersion;
  // }

  /**
   * Service to Delete Op evrsion sequence for the product/po serial number
   * @param req 
   * @returns 
  */
  async deleteSewVersion(req: SewVerIdRequest): Promise<GlobalResponseObject> {
    const transManager = new GenericTransactionManager(this.dataSource);
    try {
      if (!req.opVerId) {
        throw new ErrorResponse(0, 'Provide the op version id');
      }
      const opVersionRec = await this.sewVerRepo.findOne({ where: { companyCode: req.companyCode, unitCode: req.unitCode, id: req.opVerId } });
      if (!opVersionRec) {
        throw new ErrorResponse(0, 'Op version does not exist for the provided version id');
      }
      // check the ratios are created for the po. If created, then we must not allow deleting the op sequence
      // const ratiosForPo = await this.helperService.getRatioRecordsForPo(opVersionRec.poSerial, opVersionRec.companyCode, opVersionRec.unitCode);
      // if (ratiosForPo.length > 0) {
      //   throw new ErrorResponse(0, 'Ratios already created for the product. Op version cannot be modified');
      // }
      // check if the version exist before deleting
      //DELETE OPERATION VERSION BASED ON REQUEST VERSION ID
      await transManager.startTransaction();
      await transManager.getRepository(SewVersion).delete({ id: req.opVerId });
      await transManager.getRepository(SewSequence).delete({ opVersionId: req.opVerId });
      await transManager.getRepository(SewRawMaterial).delete({opVersionId:req.opVerId})
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
  // async copySewingVersionToGivenProductNames(parentOpsVersionId: number, productNames: string[], poSerial: number, companyCode: string, unitCode: string, username: string, userId: number): Promise<GlobalResponseObject> {
  //   const manager = new GenericTransactionManager(this.dataSource);
  //   try {
  //     const operationVersionInfo = await this.sewVerRepo.findOne({ where: { id: parentOpsVersionId, unitCode, companyCode, isActive: true, sewSerial: poSerial } });
  //     if (!operationVersionInfo) {
  //       throw new ErrorResponse(0, 'Operation Version does not exists Please check and try again');
  //     }
  //     const operationSeqInfo: SewSequence[] = await this.sewSeqRepo.find({ where: { opVersionId: parentOpsVersionId, unitCode, companyCode, isActive: true, sewSerial: poSerial } });
  //     if (!operationVersionInfo) {
  //       throw new ErrorResponse(0, 'Operation Version does not exists Please check and try again');
  //     }
  //     const parentProductComponents = new Set();
  //     for (const opsSeq of operationSeqInfo) {
  //       for (const eachComp of opsSeq.componentNames.split(',')) {
  //         parentProductComponents.add(eachComp);
  //       }
  //     }
  //     // Need to get components of product names which we need to copy this ops
  //     // If components are vary we need to throw an error saying components mismatch
  //     const poSerialReq = new SewSerialRequest(null, unitCode, companyCode, null, poSerial, null, false, false);
  //     // const productNamesInfo = await this.helperService.getPoProductNames(poSerialReq);
  //     // if (!productNamesInfo.status || productNamesInfo.data.length == 0) {
  //     //   throw new ErrorResponse(productNamesInfo.errorCode, productNamesInfo.internalMessage);
  //     // }
  //     for (const eachProductName of productNames) {
  //       // const prodComponents = productNamesInfo.data.find(prod => prod.productName == eachProductName)?.components;
  //       // if (!prodComponents.length) {
  //       //   throw new ErrorResponse(0, 'Components not found for the given product name: ' + eachProductName);
  //       // }
  //       // if (prodComponents.length != parentProductComponents.size) {
  //       //   throw new ErrorResponse(0, 'Components mismatch between parent product name and given product name: ' + eachProductName);
  //       // }
  //       // if (!prodComponents.every(eachComponent => parentProductComponents.has(eachComponent))) {
  //       //   throw new ErrorResponse(0, `Components mismatch between parent product name and given product name: ${eachProductName}`);
  //       // }
  //     }
  //     const SewingVersionDetails: OpVersionModel[] = await this.infoService.getSewVersionModels([parentOpsVersionId], poSerial, companyCode, unitCode);
  //     // we can directly get the 0th index of these model since we are giving only one version Id
  //     if (!SewingVersionDetails.length) {
  //       throw new ErrorResponse(0, 'Unable to retrieve operation version model by ops version Id')
  //     }
  //     const parentOpsVersionModel = SewingVersionDetails[0];
  //     await manager.startTransaction();
  //     for (const eachProductName of productNames) {
  //       const rawMaterials = productNames.map(productName => ({
  //         product: '', productType: '', consumption: '', uom: undefined, opCode: ''
  //       }));
  //       const cloneReq = new SewVersionRequest(username, unitCode, companyCode, userId, eachProductName, poSerial, parentOpsVersionModel, rawMaterials);
  //       await this.createSewVersionForProductWithManager(cloneReq, manager);
  //     }
  //     await manager.completeTransaction();
  //     return new GlobalResponseObject(true, 0, 'Operation Version Cloned Successfully');
  //   } catch (err) {
  //     await manager.releaseTransaction();
  //     throw err;
  //   }

  // }

  async getSewDataOpCode(req: RawMaterialIdRequest): Promise<SewRawMaterialResponse> {
    try {
      const data = await this.sewRawRepo.find({ where: { iOpCode: req.opCode,opVersionId:req.opVersionId,companyCode: req.companyCode,
        unitCode: req.unitCode
} });
      if (data.length > 0) {
        const response: SewRawMaterialResponseModel[] = [];
        for (const item of data) {
          response.push(new SewRawMaterialResponseModel(item.id, item.iOpCode, item.product, item.productType, item.consumption, item.uom, item.opVersionId));
        }
        return new SewRawMaterialResponse(true, 1, 'Data fetched successfully', response);
      } else {
        return new SewRawMaterialResponse(false, 0, 'No data found', []);
      }
    } catch (error) {
      throw new Error(`Error fetching data for iOpCode ${req.opCode}: ${error.message}`);
    }
  }


  // async getPoProductNamesAndVersionInfo(reqObj: SewSerialRequest): Promise<PoProdNameResponse> {
  //   const orderLinesInfo: PoProdNameModel[] = await this.sewOrderService.getOrderInfoBySewSerial(reqObj);
  //   for (const eachPo of orderLinesInfo) {
  //     const opsVersion = await this.sewVerRepo.findOne({ where: { productName: eachPo.productName, sewSerial: reqObj.poSerial }, select: ['id'] });
  //     if (opsVersion) {
  //       eachPo.opsVersionId = opsVersion.id;
  //     }
  //   }
  //   return new PoProdNameResponse(true, 0, 'Version details retrieved successfully', orderLinesInfo);
  // }
}