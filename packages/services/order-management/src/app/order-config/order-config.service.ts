import { Injectable } from "@nestjs/common";
import { ErrorResponse } from "@xpparel/backend-utils";
import { GlobalResponseObject, MOC_MoBOMCreationRequest, MOC_MoBomModelResponse, MOC_MoOrderRevisionRequest, MOC_MoOrderRevisionResponse, MOC_MoProdCodeRequest, MOC_MoProductFabConsResponse, MOC_MoProductFabConsumptionRequest, MOCProductFgColorVersionRequest, OrderTypeEnum, SI_MoNumberRequest, MOC_MoBomModel, MOC_MoLineOrderRevisionModel, MOC_MoLineProductOrderRevisionModel, MOC_MoOrderRevisionModel, MOC_MoProcessTypeBomModel, MOC_MoProcessTypesBomModel, MOC_MoProductFabConsumptionModel, MOC_MoProductFabSizeCons, MOC_MoSubLineQtyModel, MOC_MoSubProcessTypesBomModel, MC_ProductSubLineProcessTypeRequest, MC_MoStyleProdDetailModel, BomItemTypeEnum, PhItemCategoryEnum, ProductItemResponse, ProductIdRequest } from "@xpparel/shared-models";
import { DataSource, In, MoreThan } from "typeorm";
import { GenericTransactionManager } from "../../database/typeorm-transactions";
import { MoProductSubLineEntity } from "../entity/mo-product-sub-line.entity";
import { MoInfoRepository } from "../repository/mo-info.repository";
import { MoLineProductRepository } from "../repository/mo-line-product.repository";
import { MoLineRepository } from "../repository/mo-line.repository";
import { MoProductSubLineRepository } from "../repository/mo-product-sub-line.repository";
import { MoItemConsumptionEntity } from "./entity/mo-item-consumption.entity";
import { MoOpSubProcessBomEntity } from "./entity/mo-op-sub-proc-bom.entity";
import { MoItemConsumptionRepository } from "./repository/mo-item-consumption.repository";
import { MoOpProcessTypeRepository } from "./repository/mo-op-proc-type.repository";
import { MoOpSubProcessBomRepository } from "./repository/mo-op-sub-proc-bom.repository";
import { MoOpSubProcessRepository } from "./repository/mo-op-sub-process.repository";
import { MoOpVersionRepository } from "./repository/mo-op-version.repository";
import { MOProductFgColorRepository } from "./repository/mo-product-fg-color.repository";
import moment = require("moment");
import { MoOpSubProcessComponentRepository } from "./repository/mo-op-sub-proc-comp.repository";
import { MoInfoEntity } from "../entity/mo-info.entity";
import { MoPoBundleService } from "./mo-po-bundle.service";
import { OrderConfigHelperService } from "./order-config-helper.service";
import { PKMSBullQueueService } from "@xpparel/shared-services";
import { RawMaterialInfoRepository } from "../repository/rm-info.repository";
import { MoPoBundleEntity } from "../entity/mo-po-bundle.entity";
import { MoPoBundleRepository } from "../repository/mo-po-bundle.repository";

@Injectable()
export class OrderConfigService {
  constructor(
    private dataSource: DataSource,
    private moProductFgColorRepo: MOProductFgColorRepository,
    private moOpVersionRepo: MoOpVersionRepository,
    private moOpProcessTypeRepo: MoOpProcessTypeRepository,
    private moOpSubProcessRepo: MoOpSubProcessRepository,
    private moOpSubProcessBomRepo: MoOpSubProcessBomRepository,
    private itemConsumptionRepo: MoItemConsumptionRepository,
    private moInfoRepo: MoInfoRepository,
    private moLineRepo: MoLineRepository,
    private moLineProductRepo: MoLineProductRepository,
    private moProductSubLineRepo: MoProductSubLineRepository,
    private moSubProcessCompRepo: MoOpSubProcessComponentRepository,
    private moPoBundleService: MoPoBundleService,
    private orderConfigHelperService: OrderConfigHelperService,
    private pkmsBullQueueService: PKMSBullQueueService,
    private moItemRepo: RawMaterialInfoRepository,
    private moPoBundleRepository: MoPoBundleRepository
  ) {
  }



  /**
   * Service to update the BOM for op version for product code and FG Color
   * @param reqModel 
   * @returns 
  */
  async updateBomForOpVersionMoProductFgColor(reqModel: MOC_MoBOMCreationRequest): Promise<GlobalResponseObject> {
    const { unitCode, companyCode, username, userId } = reqModel;
    const manager = new GenericTransactionManager(this.dataSource);
    const moInfo = await this.moInfoRepo.findOne({ where: { moNumber: reqModel.moNumber, unitCode, companyCode, isActive: true } });

    if (moInfo?.moProceedingStatus == true) {
      throw new ErrorResponse(0, 'MO is already Confirmed and  Proceeded')
    }
    try {
      const moProductFgColorInfo = await this.moProductFgColorRepo.findOne({ where: { styleCode: reqModel.styleCode, fgColor: reqModel.fgColor, productCode: reqModel.productCode, moNumber: reqModel.moNumber } });
      if (!moProductFgColorInfo) {
        throw new ErrorResponse(0, 'Style product fg color info not found , Please try again');
      }
      const moProductFgColorVersion = await this.moOpVersionRepo.findOne({ where: { moProductFgColorId: moProductFgColorInfo.id, unitCode, companyCode, isActive: true, id: reqModel.versionId } });
      if (!moProductFgColorVersion) {
        throw new ErrorResponse(0, 'Operation Version does not exists for the given MO, Product Code and FG Color');
      }
      const processTypeInfoForVersion = await this.moOpProcessTypeRepo.find({ where: { moOpVersionId: moProductFgColorVersion.id, unitCode: unitCode, companyCode, isActive: true }, select: ['id'] });
      const processTypIds = processTypeInfoForVersion.map(ver => ver.id);
      if (!processTypIds.length) {
        throw new ErrorResponse(0, 'Process type Ids not found for the given version id')
      }
      const bomEntities: MoOpSubProcessBomEntity[] = [];
      const subProcessInfo = await this.moOpSubProcessRepo.find({ where: { processTypeId: In(processTypIds), unitCode, companyCode, isActive: true } });
      const mpPslAndSizesInfo = await this.moProductSubLineRepo.getMoSizesInfoForMoProduct(reqModel.moNumber, reqModel.productCode, reqModel.fgColor, reqModel.unitCode, reqModel.companyCode);
      await manager.startTransaction();
      //delete existing MoItemConsumptionEntity info by  moProductFgColorInfo.id 
      await manager.getRepository(MoItemConsumptionEntity).delete({ moProductFgColorId: moProductFgColorInfo.id, unitCode, companyCode, isActive: true })
      for (const eachProcessType of reqModel.bomInfo) {
        if (eachProcessType.subProcessBomInfo) {
          for (const eachSubProcess of eachProcessType.subProcessBomInfo) {
            const actSubProcess = subProcessInfo.find(sp => sp.subProcessName == eachSubProcess.subProcessName);
            if (!actSubProcess) {
              throw new ErrorResponse(0, 'Sub Process not found. Please verify and try again');
            };
            //delete existing MoOpSubProcessBomEntity info by    bomEntity.subProcessId = actSubProcess.id; and .bomItemType == BomItemTypeEnum.RM 
            await manager.getRepository(MoOpSubProcessBomEntity).delete({ subProcessId: actSubProcess.id, unitCode, companyCode, isActive: true, bomItemType: BomItemTypeEnum.RM })
            const subProcessComps = await this.moSubProcessCompRepo.find({ where: { subProcessId: actSubProcess.id } });
            const itemCodesOfSuProcess = new Set<string>();
            if (eachSubProcess.bomInfo) {
              for (const eachBom of eachSubProcess.bomInfo) {
                if (eachBom.bomItemType == BomItemTypeEnum.RM) {
                  if (eachBom.itemType == PhItemCategoryEnum.YARN) itemCodesOfSuProcess.add(eachBom.itemCode);
                  const bomEntity = new MoOpSubProcessBomEntity();
                  bomEntity.bomItemCode = eachBom.itemCode;
                  bomEntity.bomItemDesc = eachBom.itemDesc;
                  bomEntity.bomItemType = eachBom.bomItemType;
                  bomEntity.bomSku = eachBom.itemCode;
                  bomEntity.companyCode = companyCode;
                  bomEntity.createdUser = username;
                  bomEntity.procType = eachProcessType.processType;
                  bomEntity.subProcessId = actSubProcess.id;
                  bomEntity.subProcessName = actSubProcess.subProcessName;
                  bomEntity.unitCode = unitCode;
                  bomEntity.itemType = eachBom.itemType;
                  if (eachBom.itemType == PhItemCategoryEnum.TRIM) {
                    const itemConsumption = await this.moItemRepo.findOne({ where: { moNumber: reqModel.moNumber, unitCode, companyCode, itemCode: eachBom.itemCode } });
                    if (itemConsumption) {
                      bomEntity.consumption = itemConsumption.consumption;
                    }
                  }
                  bomEntities.push(bomEntity);
                }
              };
            }
            if (subProcessComps.length && itemCodesOfSuProcess.size) {
              for (const eachSize of mpPslAndSizesInfo) {
                for (const eachItemCode of itemCodesOfSuProcess) {
                  for (const eachComp of subProcessComps) {
                    const itemConsumptionDetail = new MoItemConsumptionEntity();
                    itemConsumptionDetail.companyCode = companyCode;
                    itemConsumptionDetail.consumption = 0;
                    itemConsumptionDetail.createdUser = username;
                    itemConsumptionDetail.itemCode = eachItemCode;
                    itemConsumptionDetail.size = eachSize.size;
                    itemConsumptionDetail.moProductFgColorId = moProductFgColorInfo.id;
                    itemConsumptionDetail.unitCode = unitCode;
                    itemConsumptionDetail.componentName = eachComp.componentName;
                    await manager.getRepository(MoItemConsumptionEntity).save(itemConsumptionDetail);
                  }
                }
              }
            }

          }
        }
      }
      await manager.getRepository(MoOpSubProcessBomEntity).save(bomEntities, { reload: false });
      await manager.completeTransaction();
      return new GlobalResponseObject(true, 0, 'BOM updated successfully for MO , Product Code, FG color and  OP Version ');
    } catch (err) {
      await manager.releaseTransaction();
      throw err;
    }

  }

  /**
   * Service to get BOM For Given Version
   * @param reqModel 
   * @returns 
  */
  async getBomForOpVersionMoProductFgColor(reqModel: MOCProductFgColorVersionRequest): Promise<MOC_MoBomModelResponse> {
    const { unitCode, companyCode, username, userId } = reqModel;
    const moProductFgColorInfo = await this.moProductFgColorRepo.findOne({ where: { styleCode: reqModel.styleCode, fgColor: reqModel.fgColor, productCode: reqModel.productCode, moNumber: reqModel.moNumber } });
    if (!moProductFgColorInfo) {
      throw new ErrorResponse(0, 'Style product fg color info not found , Please try again');
    };
    const processTypeBomInfo: MOC_MoProcessTypesBomModel[] = [];
    const moMobModel = new MOC_MoBomModel(null, reqModel.moNumber, []);
    const moProductFgColorVersion = await this.moOpVersionRepo.findOne({ where: { moProductFgColorId: moProductFgColorInfo.id, unitCode, companyCode, isActive: true, id: reqModel.versionId } });
    if (!moProductFgColorVersion) {
      throw new ErrorResponse(0, 'Operation Version already there for the given MO, Product Code and FG Color');
    }
    const processingTypeInfo = await this.moOpProcessTypeRepo.find({ where: { moOpVersionId: moProductFgColorVersion.id, unitCode, companyCode, isActive: true } });
    for (const eachProcessType of processingTypeInfo) {
      const subProcessBomInfo: MOC_MoSubProcessTypesBomModel[] = [];
      const subProcessDetails = await this.moOpSubProcessRepo.find({ where: { processTypeId: eachProcessType.id, unitCode, companyCode, isActive: true } });
      for (const eachSubProcess of subProcessDetails) {
        const subProcessBomInfo: MOC_MoProcessTypeBomModel[] = [];
        const subProcessBom = new MOC_MoSubProcessTypesBomModel(eachProcessType.procType, eachSubProcess.subProcessName, [])
        const subProcessBomDetails = await this.moOpSubProcessBomRepo.find({ where: { subProcessId: eachSubProcess.id, unitCode, companyCode, isActive: true } });
        for (const eachBom of subProcessBomDetails) {
          const subProcessBomModel = new MOC_MoProcessTypeBomModel(eachBom.bomItemCode, eachBom.bomItemDesc, eachBom.bomItemDesc, 0, eachBom.itemType, eachBom.bomItemType);
        }
      }
      const processTypeBom = new MOC_MoProcessTypesBomModel(eachProcessType.procType, moProductFgColorInfo.productCode, moProductFgColorInfo.fgColor, subProcessBomInfo);
      processTypeBomInfo.push(processTypeBom);
    }
    return new MOC_MoBomModelResponse(true, 0, 'BOM information retrieved successfully', moMobModel)
  }
  // ---------------------------- CONSUMPTION -------------------------

  /**
   * Service to save fabric consumption for MO product
   * @param reqModel 
   * @returns 
  */
  async saveFabConsumptionForMoProduct(reqModel: MOC_MoProductFabConsumptionRequest): Promise<GlobalResponseObject> {
    const { unitCode, companyCode, username, userId } = reqModel;
    const manager = new GenericTransactionManager(this.dataSource);
    const moInfo = await this.moInfoRepo.findOne({ where: { moNumber: reqModel.moNumber, unitCode, companyCode, isActive: true } });

    if (moInfo?.moProceedingStatus == true) {
      throw new ErrorResponse(0, 'MO is already Confirmed and  Proceeded')
    }
    try {
      const moProductFgColorInfo = await this.moProductFgColorRepo.findOne({ where: { styleCode: reqModel.styleCode, fgColor: reqModel.fgColor, productCode: reqModel.productCode, moNumber: reqModel.moNumber } });
      if (!moProductFgColorInfo) {
        throw new ErrorResponse(0, 'Style product fg color info not found , Please try again');
      };
      await manager.startTransaction();
      const existingItemConsumptionDetails = await this.itemConsumptionRepo.find({ where: { moProductFgColorId: moProductFgColorInfo.id, unitCode, companyCode, isActive: true } });
      if (!existingItemConsumptionDetails) {
        throw new ErrorResponse(0, `Please save operation version for given MO ${reqModel.moNumber} Product ${reqModel.productCode} FG Color ${reqModel.fgColor}`);
      }
      if (existingItemConsumptionDetails) {
        await manager.getRepository(MoItemConsumptionEntity).delete({ moProductFgColorId: moProductFgColorInfo.id, unitCode, companyCode, isActive: true })
      }
      for (const eachItemAndComp of reqModel.fabCons) {
        for (const eachComp of eachItemAndComp.sizeCons) {
          const itemConsumptionDetail = new MoItemConsumptionEntity();
          itemConsumptionDetail.companyCode = companyCode;
          itemConsumptionDetail.consumption = eachComp.cons;
          itemConsumptionDetail.createdUser = username;
          itemConsumptionDetail.itemCode = eachItemAndComp.itemCode;
          itemConsumptionDetail.size = eachComp.size;
          itemConsumptionDetail.moProductFgColorId = moProductFgColorInfo.id;
          itemConsumptionDetail.unitCode = unitCode;
          itemConsumptionDetail.componentName = eachItemAndComp.component;
          await manager.getRepository(MoItemConsumptionEntity).save(itemConsumptionDetail);
        }
      }
      await manager.completeTransaction();
      return new GlobalResponseObject(true, 0, 'Consumption Saved Successfully')
    } catch (err) {
      await manager.releaseTransaction();
      throw err;
    }



  }

  /**
   * Service to get fabric consumption for MO product and fg color
   * @param reqModel 
   * @returns 
  */
  async getFabConsumptionForMoProduct(reqModel: MOC_MoProdCodeRequest): Promise<MOC_MoProductFabConsResponse> {
    const { unitCode, companyCode, username, userId } = reqModel;
    const fabConsumptionInfo: MOC_MoProductFabConsumptionModel[] = [];
    const moProductFgColorInfo = await this.moProductFgColorRepo.findOne({ where: { styleCode: reqModel.styleCode, fgColor: reqModel.fgColor, productCode: reqModel.productCode, moNumber: reqModel.moNumber } });
    if (!moProductFgColorInfo) {
      throw new ErrorResponse(0, 'Style product fg color info not found , Please try again');
    };
    const existingItemConsumptionDetails: MoItemConsumptionEntity[] = await this.itemConsumptionRepo.find({ where: { moProductFgColorId: moProductFgColorInfo.id, unitCode, companyCode, isActive: true } });
    const itemCompSizeMap = new Map<string, Map<string, Map<string, MoItemConsumptionEntity[]>>>();
    for (const eachDetail of existingItemConsumptionDetails) {
      if (!itemCompSizeMap.has(eachDetail.itemCode)) {
        itemCompSizeMap.set(eachDetail.itemCode, new Map<string, Map<string, MoItemConsumptionEntity[]>>())
      }
      if (!itemCompSizeMap.get(eachDetail.itemCode).has(eachDetail.componentName)) {
        itemCompSizeMap.get(eachDetail.itemCode).set(eachDetail.componentName, new Map<string, []>())
      }
      if (!itemCompSizeMap.get(eachDetail.itemCode).get(eachDetail.componentName).has(eachDetail.size)) {
        itemCompSizeMap.get(eachDetail.itemCode).get(eachDetail.componentName).set(eachDetail.size, []);
      }
      itemCompSizeMap.get(eachDetail.itemCode).get(eachDetail.componentName).get(eachDetail.size).push(eachDetail)
    }
    for (const [item, itemDetail] of itemCompSizeMap) {
      const itemCompSizeInfo: MOC_MoProductFabSizeCons[] = [];
      const sizesSet = new Set<string>();
      for (const [comp, compDetail] of itemDetail) {
        const sizeInfo: { size: string; cons: number; }[] = [];
        for (const [size, consumption] of compDetail) {
          sizesSet.add(size);
          sizeInfo.push({
            size: size,
            cons: consumption?.length > 0 ? consumption[0].consumption : 0
          })
        }
        const itemCompObj = new MOC_MoProductFabSizeCons(item, comp, sizeInfo);
        itemCompSizeInfo.push(itemCompObj);
      }
      const itemCompDetail = new MOC_MoProductFabConsumptionModel(reqModel.moPk, reqModel.productCode, reqModel.fgColor, itemCompSizeInfo, Array.from(sizesSet));
      fabConsumptionInfo.push(itemCompDetail);
    }
    return new MOC_MoProductFabConsResponse(true, 0, '', fabConsumptionInfo)
  }


  // ----------------------------- ORDER REVISION ---------------------
  /**
   * Service to save Order Revision details for Manufacturing Order
   * @param req 
   * @returns 
  */
  async saveOrderRevisionForMo(req: MOC_MoOrderRevisionRequest): Promise<GlobalResponseObject> {
    const { unitCode, companyCode, username, userId } = req;
    const manager = new GenericTransactionManager(this.dataSource);

    const moInfo = await this.moInfoRepo.findOne({ where: { moNumber: req.moNumber, unitCode, companyCode, isActive: true } });

    if (moInfo?.moProceedingStatus == true) {
      throw new ErrorResponse(0, 'MO is already Confirmed and  Proceeded')
    }
    try {
      const moInfo = await this.moInfoRepo.findOne({ where: { moNumber: req.moNumber, unitCode, companyCode, isActive: true }, select: ['id', 'moNumber'] });
      if (!moInfo) {
        throw new ErrorResponse(0, 'Manufacturing Order Info not found. Please check and try again');
      }
      await manager.startTransaction();
      for (const eachLine of req.moLineRevisions) {
        const moLineInfo = await this.moLineRepo.findOne({ where: { moLineNumber: eachLine.moLineNumber, unitCode, companyCode, moNumber: req.moNumber, isActive: true }, select: ['id', 'moLineNumber'] });
        if (!moLineInfo) {
          throw new ErrorResponse(0, 'Manufacturing Order Line Info not found. Please check and try again')
        }
        for (const moLineProduct of eachLine.productLevelRevisions) {
          console.log(moLineProduct);
          const moLineProductInfo = await this.moLineProductRepo.findOne({ where: { moNumber: req.moNumber, moLineNumber: eachLine.moLineNumber, productCode: moLineProduct.productCode, unitCode, companyCode, isActive: true }, select: ['id'] });
          if (!moLineProductInfo) {
            throw new ErrorResponse(0, 'Manufacturing Order Product info not found. Please check and try again')
          }
          for (const eachOQType of moLineProduct.oqTypeQtys) {
            if (eachOQType.oqType != OrderTypeEnum.ORIGINAL) {
              for (const eachSize of eachOQType.sizeQtys) {
                const productSubLineInfo = await this.moProductSubLineRepo.findOne({ where: { moLineProductId: moLineProductInfo.id, unitCode, fgColor: moLineProduct.fgColor, companyCode, isActive: true, size: eachSize.size, oQType: OrderTypeEnum.ORIGINAL }, order: { id: 'DESC' } });
                if (!productSubLineInfo) {
                  throw new ErrorResponse(0, 'Manufacturing Order product Size info not found. Please check and try again')
                }

                const cloneProductSubLine: MoProductSubLineEntity = JSON.parse(JSON.stringify(productSubLineInfo));
                cloneProductSubLine.id = null;
                cloneProductSubLine.oQType = eachOQType.oqType;
                cloneProductSubLine.quantity = eachSize.qty;
                cloneProductSubLine.createdUser = username;
                await manager.getRepository(MoProductSubLineEntity).save(cloneProductSubLine, { reload: false });
              }
            }
          }

        }
      }
      await manager.completeTransaction();
      return new GlobalResponseObject(true, 0, 'Order Quantities Updated Successfully')
    } catch (err) {
      await manager.completeTransaction();
      throw err;
    }


  }

  /**
   * Service to get Order Revision Information for MO
   * @param reqModel 
   * @returns 
  */
  async getOrderRevisionForMo(reqModel: MOC_MoOrderRevisionRequest): Promise<MOC_MoOrderRevisionResponse> {
    const { unitCode, companyCode, username, userId } = reqModel;
    const moInfo = await this.moInfoRepo.findOne({ where: { moNumber: reqModel.moNumber, unitCode, companyCode, isActive: true } });
    if (!moInfo) {
      throw new ErrorResponse(0, 'Manufacturing Order Info not found. Please check and try again');
    }
    const moLineInfo: MOC_MoLineOrderRevisionModel[] = [];
    const orderLineInfo = await this.moLineRepo.find({ where: { unitCode, companyCode, moNumber: reqModel.moNumber, isActive: true }, select: ['id', 'moLineNumber'] });
    for (const eachOrderLine of orderLineInfo) {
      const moLineProductArray: MOC_MoLineProductOrderRevisionModel[] = [];
      const moLineProductInfo = await this.moLineProductRepo.find({ where: { moNumber: reqModel.moNumber, moLineNumber: eachOrderLine.moLineNumber, unitCode, companyCode, isActive: true }, select: ['id'] });
      for (const moLineProduct of moLineProductInfo) {
        const moLineProductSubLine = await this.moProductSubLineRepo.find({ where: { moLineProductId: moLineProduct.id, unitCode, companyCode, isActive: true } });
        const styleProdFgColorSubLines = new Map<string, Map<OrderTypeEnum, MoProductSubLineEntity[]>>();
        for (const subLine of moLineProductSubLine) {
          const key = `${subLine.styleCode}$$${subLine.productCode}$$${subLine.fgColor}`;
          if (!styleProdFgColorSubLines.has(key)) {
            styleProdFgColorSubLines.set(key, new Map<OrderTypeEnum, []>())
          }
          if (!styleProdFgColorSubLines.get(key).has(subLine.oQType)) {
            styleProdFgColorSubLines.get(key).set(subLine.oQType, []);
          }
          styleProdFgColorSubLines.get(key).get(subLine.oQType).push(subLine);

        }
        for (const [key, keyInfo] of styleProdFgColorSubLines) {
          const oqDetail: MOC_MoSubLineQtyModel[] = [];
          for (const [oqType, qtyInfo] of keyInfo) {
            const sizeInfo = [];
            for (const eachSubLine of qtyInfo) {
              const obj = {
                subLineId: eachSubLine.id,
                size: eachSubLine.size,
                qty: eachSubLine.quantity
              }
              sizeInfo.push(obj);
            }
            const subLineOqInfo = new MOC_MoSubLineQtyModel(oqType, sizeInfo);
            oqDetail.push(subLineOqInfo);
          }
          const keySplit = key.split('$$');
          const moLineProdObj = new MOC_MoLineProductOrderRevisionModel(keySplit[0], keySplit[1], keySplit[2], oqDetail);
          moLineProductArray.push(moLineProdObj);
        }

      }
      const moLineObj = new MOC_MoLineOrderRevisionModel(eachOrderLine.moLineNumber, eachOrderLine.id, reqModel.moNumber, moLineProductArray);
      moLineInfo.push(moLineObj);
    }
    const moRevisionDetails = new MOC_MoOrderRevisionModel(moInfo.id, moInfo.moNumber, moInfo.moProceedingStatus, moLineInfo);
    return new MOC_MoOrderRevisionResponse(true, 0, 'MO Revision Details Retrieved Successfully', moRevisionDetails)
  }


  async confirmMoProceeding(req: SI_MoNumberRequest): Promise<GlobalResponseObject> {
    // need to update the proceeding status for the MO in the mo_info table
    const manager = new GenericTransactionManager(this.dataSource);
    const { moNumber, unitCode, companyCode, username } = req;
    const moInfo = await this.moInfoRepo.findOne({ where: { moNumber: req.moNumber, unitCode, companyCode, isActive: true } });

    if (moInfo?.moProceedingStatus == true) {
      throw new ErrorResponse(0, 'MO is already Confirmed and  Proceeded')
    }
    try {
      const moProductFgColorInfo = await this.moProductFgColorRepo.find({ where: { moNumber: moNumber, unitCode, companyCode } });
      if (!moProductFgColorInfo) {
        throw new ErrorResponse(0, 'Style product fg color info not found , Please try again');
      };
      for (const moProduct of moProductFgColorInfo) {
        const moProductFgColorVersion = await this.moOpVersionRepo.findOne({ where: { moProductFgColorId: moProduct.id, unitCode, companyCode, isActive: true } });
        if (!moProductFgColorVersion) {
          throw new ErrorResponse(0, 'Operation Version does not exists the given MO, Product Code and FG Color' + `${moNumber} ${moProduct.productCode} ${moProduct.fgColor}`);
        }
      }
      await manager.startTransaction();
      await manager.getRepository(MoInfoEntity).update({ moNumber, unitCode, companyCode, isActive: true }, { moProceedingStatus: true, updatedUser: req.username })
      await manager.completeTransaction();
      await this.moPoBundleService.createProcessingBundlesForMO(req);
      return new GlobalResponseObject(true, 0, 'MO Proceeding Status Updated Successfully')
    } catch (err) {
      await manager.releaseTransaction();
      throw err;
    }
  }

  async unConfirmMoProceedingForOMS(req: SI_MoNumberRequest): Promise<GlobalResponseObject> {
    const { moNumber, unitCode, companyCode, username } = req;
    const manager = new GenericTransactionManager(this.dataSource);

    try {

      const existingBundles = await this.moPoBundleRepository.find({ where: { moNumber, unitCode, companyCode, processingSerial: MoreThan(0) }, select: ['id', 'processingSerial'] });
      if (existingBundles.length>0) {
        throw new ErrorResponse(0, 'You Cannot Delete Bundles')
      }
      await manager.startTransaction();

      await manager.getRepository(MoInfoEntity).update({ moNumber, unitCode, companyCode, isActive: true }, { moProceedingStatus: false, updatedUser: username });
      await manager.getRepository(MoPoBundleEntity).delete({ moNumber: moNumber });

      await manager.completeTransaction();
      await this.unConfirmMoProceeding(req);
      return new GlobalResponseObject(true, 0, 'MO Unconfirmed Successfully');
    } catch (err) {
      await manager.releaseTransaction();
      throw err;
    }
  }
  // TODO
  async unConfirmMoProceeding(req: SI_MoNumberRequest): Promise<GlobalResponseObject> {
    const { moNumber, companyCode, unitCode, username } = req;
    // call the PTS API
    this.orderConfigHelperService.sendMoDeConfirmationStatusToPTS(moNumber, companyCode, unitCode, username);
    this.orderConfigHelperService.sendMoDeConfirmationStatusToCPS(moNumber, companyCode, unitCode, username);
    await this.pkmsBullQueueService.sendMoDeConfirmationStatusToPKMS(new SI_MoNumberRequest(username, unitCode, companyCode, 0, moNumber, 0, false, false, false, false, false, false, false, false, false, false, false, null));
    return new GlobalResponseObject(true, 0, 'Mo un confirmed successfully');
  }

  /**
   * Service to get size wise component level item consumption details for the given product sub line Ids
   * @param reqObj 
   * @returns 
  */
  async getSizeWiseComponentConsumptionForSubLineIds(reqObj: MC_ProductSubLineProcessTypeRequest): Promise<MOC_MoProductFabConsResponse> {
    const { unitCode, companyCode } = reqObj
    const styleProdDetails: MC_MoStyleProdDetailModel[] = await this.moProductSubLineRepo.getMoStyleProductInfoForGivenIds(reqObj.moProductSubLineIds, companyCode, unitCode);
    console.log(styleProdDetails);
    const allConsumptionDetails: MOC_MoProductFabConsumptionModel[] = [];
    for (const eachCombo of styleProdDetails) {
      const fabConsumptionReq = new MOC_MoProdCodeRequest(null, unitCode, companyCode, null, null, eachCombo.moNumber, eachCombo.productCode, eachCombo.styleCode, eachCombo.fgColor);
      const fabConsumptionDetails = await this.getFabConsumptionForMoProduct(fabConsumptionReq);
      if (!fabConsumptionDetails.status) {
        throw new ErrorResponse(fabConsumptionDetails.errorCode, fabConsumptionDetails.internalMessage);
      }
      const actualConsumptionInfo = fabConsumptionDetails.data;
      if (!actualConsumptionInfo.length) {
        throw new ErrorResponse(0, 'Consumption details not found for the combo' + JSON.stringify(eachCombo));
      }
      allConsumptionDetails.push(...actualConsumptionInfo);
    }
    return new MOC_MoProductFabConsResponse(true, 0, 'Consumption Details Retrieved Successfully', allConsumptionDetails)
  }

}



