import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { DataSource, In } from "typeorm";
import moment = require("moment");
import { PoMaterialHelperService } from "./po-material-helper.service";
import { PCutRmRepository } from "./repository/p-cut-rm.repository";
import { PTrimRmRepository } from "./repository/p-trim-rm.respository";
import { PCutRmSizePropsEntity } from "./entity/p-cut-rm-size-prop.entity";
import { CutRmModel, CutRmSizePropsModel, GlobalResponseObject, InsUomEnum, PoProdTypeAndFabModel, PoProdTypeAndFabResponse, PoProdutNameRequest, PoRmItemsModel, PoRmModel, PoRmResponse, PoRmUpdateRequest, PoSerialRequest } from "@xpparel/shared-models";
import { PCutRmEntity } from "./entity/p-cut-rm.entity";
import { GenericTransactionManager } from "../../database/typeorm-transactions";
import { ErrorResponse } from "@xpparel/backend-utils";
import { FabLevelProdNameQueryResponse, FabricColorAndItemInfo } from "./repository/query-response/fab-level-prod-name.query.response";

@Injectable()
export class PoMaterialInfoService {
  constructor(
    private dataSource: DataSource,
    @Inject(forwardRef(() => PoMaterialHelperService)) private helperService: PoMaterialHelperService,
    private poCutRmRepo: PCutRmRepository,
    private poTrimRmRepo: PTrimRmRepository,
    private poCutRmSizeRepo: PCutRmSizePropsEntity
  ) {

  }

  /**
    * Service to get Po Material Information for the po serial
    * @param req 
    * @returns 
    */
  async getPoMaterialInfo(req: PoSerialRequest): Promise<PoRmResponse> {
    const unitCode = req.unitCode;
    const companyCode = req.companyCode;
    const rmItems = await this.poCutRmRepo.find({ where: { poSerial: req.poSerial, unitCode, companyCode } });
    if (!rmItems.length) {
      throw new ErrorResponse(0, 'RM details not found fot the given PO. Please check and try again');
    }
    // Getting Po Basic Information
    const poBasicInfo = await this.helperService.getPoBasicInfoByPoSerial(req.poSerial, unitCode, companyCode);
    const poItemsMap = new Map<string, CutRmModel[]>();
    const poRmItems = rmItems.forEach((eachItem) => {
      const prodKey = `${eachItem.productName}&&${eachItem.productType}&&${eachItem.fgColor}&&${poBasicInfo.style}`;
      if (!poItemsMap.has(prodKey)) {
        poItemsMap.set(prodKey, []);
      }
      const sizeWiseProps = eachItem.pCutRmSizeProps.map((eachSize) => {
        return new CutRmSizePropsModel(eachSize.size, eachSize.consumption, InsUomEnum.YRD, null)
      });
      poItemsMap.get(prodKey).push(new CutRmModel(eachItem.id, eachItem.itemCode, eachItem.itemName, eachItem.itemColor, eachItem.uom, eachItem.itemDesc, eachItem.gussetSeparation, eachItem.purchaseWidth, eachItem.sequence, eachItem.isMainFabric, eachItem.fabricCategory, eachItem.productName, eachItem.fgColor, eachItem.maxPlies, eachItem.bindingConsumption, eachItem.isBinding, eachItem.wastage, eachItem.avgConsumption, eachItem.componentNames.split(','), eachItem.refComponent, sizeWiseProps));
    });
    const poRmProdItems = [];
    for (const [eachProdKey, prodDetails] of poItemsMap) {
      const keySplit = eachProdKey.split('&&');
      const productName = keySplit[0];
      const productType = keySplit[1];
      const fgColor = keySplit[2];
      const style = keySplit[3];
      poRmProdItems.push(new PoRmItemsModel(productName, productType, fgColor, style, prodDetails, []));
    }
    const poRmData = new PoRmModel(req.poSerial, poBasicInfo.orderRefNo, poBasicInfo.orderRefId, poBasicInfo.poDesc, poRmProdItems);
    return new PoRmResponse(true, 0, 'PO RM details retrieved successfully', [poRmData])
  }

  /**
   * gets the fabric info for the PO + item code
   * @param poSerial 
   * @param productName 
   * @param iCode 
   * @param companyCode 
   * @param unitCode 
   * @returns 
   */
  async getPoCutFabInfoForItemCode(poSerial: number, productName: string, iCode, companyCode, unitCode): Promise<CutRmModel> {
    const material = await this.poCutRmRepo.findOne({ where: { poSerial: poSerial, productName: productName, itemCode: iCode, companyCode: companyCode, unitCode: unitCode } });
    return new CutRmModel(material.id, material.itemCode, material.itemName, material.itemColor, material.uom, material.itemDesc, material.gussetSeparation, material.purchaseWidth, material.sequence, material.isMainFabric, material.fabricCategory, productName, material.fgColor, material.maxPlies, material.bindingConsumption, material.isBinding, material.wastage, material.avgConsumption, material.componentNames.split(','), material.refComponent, null);
  }

  /**
   * gets the fabric info for the whole PO
   * @param poSerial 
   * @param companyCode 
   * @param unitCode 
   * @returns 
   */
  async getPoCutFabInfoForPo(poSerial: number, companyCode: string, unitCode: string, productName?: string): Promise<CutRmModel[]> {
    const cutRmModels: CutRmModel[] = [];
    let materials: PCutRmEntity[];
    if (productName) {
      materials = await this.poCutRmRepo.find({ where: { poSerial: poSerial, companyCode: companyCode, unitCode: unitCode, productName: productName } });
    } else {
      materials = await this.poCutRmRepo.find({ where: { poSerial: poSerial, companyCode: companyCode, unitCode: unitCode } });
    }
    materials.forEach(material => {
      cutRmModels.push(new CutRmModel(material.id, material.itemCode, material.itemName, material.itemColor, material.uom, material.itemDesc, material.gussetSeparation, material.purchaseWidth, material.sequence, material.isMainFabric, material.fabricCategory, material.productName, material.fgColor, material.maxPlies, material.bindingConsumption, material.isBinding, material.wastage, material.avgConsumption, material.componentNames.split(','), material.refComponent, null));
    });
    return cutRmModels;
  }

  /**
   * HELPER
   * @param poSerial 
   * @param companyCode 
   * @param unitCode 
   * @returns 
   */
  async getFabricLevelProdNameForPo(poSerial: number, companyCode: string, unitCode: string): Promise<FabLevelProdNameQueryResponse[]> {
    return await this.poCutRmRepo.getFabricLevelProdNameForPo(poSerial, companyCode, unitCode);
  }

  /**
   * READER 
   * gets the po level product types and the fabrics under it 
   * @param req 
   */
  async getPoProdTypeAndFabrics(req: PoSerialRequest): Promise<PoProdTypeAndFabResponse> {
    const materialsMap = new Map<string, Map<string, CutRmModel[]>>();
    const poProdTypeRmModels: PoProdTypeAndFabModel[] = [];
    const materials = await this.poCutRmRepo.find({ where: { poSerial: req.poSerial, companyCode: req.companyCode, unitCode: req.unitCode } });
    materials.forEach(material => {
      const prodKey = `${material.productName}&&${material.productType}`;
      if (!materialsMap.has(prodKey)) {
        materialsMap.set(prodKey, new Map<string, []>());
      };
      if (!materialsMap.get(prodKey).has(material.fgColor)) {
        materialsMap.get(prodKey).set(material.fgColor, []);
      }
      const cutRmModel = new CutRmModel(material.id, material.itemCode, material.itemName, material.itemColor, material.uom, material.itemDesc, material.gussetSeparation, material.purchaseWidth, material.sequence, material.isMainFabric, material.fabricCategory, material.productName, material.fgColor, material.maxPlies, material.bindingConsumption, material.isBinding, material.wastage, material.avgConsumption, material.componentNames.split(','), material.refComponent, null);
      materialsMap.get(prodKey).get(material.fgColor).push(cutRmModel);
    });
    materialsMap.forEach((cutRmInfo, eachProdKey) => {
      cutRmInfo.forEach((cutRm, fgColor) => {
        const keySplit = eachProdKey.split('&&');
        const productName = keySplit[0];
        const productType = keySplit[1];
        poProdTypeRmModels.push(new PoProdTypeAndFabModel(req.poSerial, productType, productName, fgColor, cutRm));
      })

    });
    return new PoProdTypeAndFabResponse(true, 0, 'Po prod type cut rm retrieved', poProdTypeRmModels);
  }

  /**
   * READER 
   * gets the po level product types and the fabrics under it 
   * @param req 
   */
  async getPoProdTypeAndFabricsForProductName(req: PoProdutNameRequest): Promise<PoProdTypeAndFabResponse> {
    const materialsMap = new Map<string, Map<string, CutRmModel[]>>();
    const poProdTypeRmModels: PoProdTypeAndFabModel[] = [];
    let materials: PCutRmEntity[] = [];
    if(req.productName && req.fgColor) {
      materials = await this.poCutRmRepo.find({ where: { poSerial: req.poSerial, companyCode: req.companyCode, unitCode: req.unitCode, productName: req.productName, isActive: true, fgColor: req.fgColor } });
    } if (req.productName) {
      materials = await this.poCutRmRepo.find({ where: { poSerial: req.poSerial, companyCode: req.companyCode, unitCode: req.unitCode, productName: req.productName, isActive: true } });
    } else {
      materials = await this.poCutRmRepo.find({ where: { poSerial: req.poSerial, companyCode: req.companyCode, unitCode: req.unitCode, isActive: true } });
    };
    materials.forEach(material => {
      const prodKey = `${material.productName}&&${material.productType}`;
      if (!materialsMap.has(prodKey)) {
        materialsMap.set(prodKey, new Map<string, CutRmModel[]>);
      }
      if (!materialsMap.get(prodKey).has(material.fgColor)) {
        materialsMap.get(prodKey).set(material.fgColor, [])
      }
      const cutRmModel = new CutRmModel(material.id, material.itemCode, material.itemName, material.itemColor, material.uom, material.itemDesc, material.gussetSeparation, material.purchaseWidth, material.sequence, material.isMainFabric, material.fabricCategory, material.productName, material.fgColor, material.maxPlies, material.bindingConsumption, material.isBinding, material.wastage, material.avgConsumption, material.componentNames.split(','), material.refComponent, null);
      materialsMap.get(prodKey).get(material.fgColor).push(cutRmModel);
    });
    materialsMap.forEach((cutRmInfo, eachProdKey) => {
      cutRmInfo.forEach((cutRm, fgColor) => {
        const keySplit = eachProdKey.split('&&');
        const productName = keySplit[0];
        const productType = keySplit[1];
        poProdTypeRmModels.push(new PoProdTypeAndFabModel(req.poSerial, productType, productName, fgColor, cutRm));
      })
    });
    console.log(poProdTypeRmModels);
    return new PoProdTypeAndFabResponse(true, 0, 'Po prod type cut rm retrieved', poProdTypeRmModels);
  }


  /**
   * READER 
   * gets the po level product types and the fabrics under it 
   * @param req 
   */
  async getPoProdTypeAndFabricsAndItsSizes(req: PoSerialRequest): Promise<PoProdTypeAndFabResponse> {
    const materialsMap = new Map<string, CutRmModel[]>();
    const poProdTypeRmModels: PoProdTypeAndFabModel[] = [];
    const materials = await this.poCutRmRepo.find({ where: { poSerial: req.poSerial, companyCode: req.companyCode, unitCode: req.unitCode }, relations: ['pCutRmSizeProps'] });
    materials.forEach(material => {
      const prodKey = `${material.productName}&&${material.productType}&&${material.fgColor}`;
      if (!materialsMap.has(prodKey)) {
        materialsMap.set(prodKey, []);
      }
      const sizeProps = material.pCutRmSizeProps.map((eachSize) => {
        return new CutRmSizePropsModel(eachSize.size, eachSize.consumption, InsUomEnum.YRD, null)
      })
      const cutRmModel = new CutRmModel(material.id, material.itemCode, material.itemName, material.itemColor, material.uom, material.itemDesc, material.gussetSeparation, material.purchaseWidth, material.sequence, material.isMainFabric, material.fabricCategory, material.productName, material.fgColor, material.maxPlies, material.bindingConsumption, material.isBinding, material.wastage, material.avgConsumption, material.componentNames.split(','), material.refComponent, sizeProps);
      materialsMap.get(prodKey).push(cutRmModel);
    });
    materialsMap.forEach((cutRm, eachProdKey) => {
      const keySplit = eachProdKey.split('&&');
      const productName = keySplit[0];
      const productType = keySplit[1];
      const fgColor = keySplit[2];
      poProdTypeRmModels.push(new PoProdTypeAndFabModel(req.poSerial, productType, productName, fgColor, cutRm));
    });
    return new PoProdTypeAndFabResponse(true, 0, 'Po prod type cut rm retrieved', poProdTypeRmModels);
  }

  async getPoColorandItemInformation(poSerial: number, companyCode: string, unitCode: string): Promise<FabricColorAndItemInfo[]> {
    return await this.poCutRmRepo.getPoColorAndItemInformation(String(poSerial), companyCode, unitCode);
  }
}