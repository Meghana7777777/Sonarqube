import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { DataSource, In } from "typeorm";
import { dataSource } from "../../database/type-orm-config/typeorm.config-migrations";
import { GenericTransactionManager } from "../../database/typeorm-transactions";
import moment = require("moment");
import { PoRatioHelperService } from "./po-ratio-helper.service";
import { PoRatioFabricRepository } from "./repository/po-ratio-fabric.repository";
import { PoRatioLineRepository } from "./repository/po-ratio-line.repository";
import { PoRatioSizeRepository } from "./repository/po-ratio-size.repository";
import { PoRatioRepository } from "./repository/po-ratio.repository";
import { CutRmModel, MarkerIdRequest, PoFabricRatioModel, PoFabricRatioResponse, PoItemCodeRequest, PoMarkerModel, PoProdutNameRequest, PoRatioFabricModel, PoRatioIdRequest, PoRatioLineModel, PoRatioModel, PoRatioResponse, PoRatioSizeModel, PoSerialRequest, PoSizeQtysModel } from "@xpparel/shared-models";
import { PoRatioMarkerIdModel, PoRatioMarkerIdResponse } from "@xpparel/shared-models";
import { ErrorResponse } from "@xpparel/backend-utils";
import { PoRatioLineEntity } from "./entity/po-ratio-line.entity";
import { PoRatioEntity } from "./entity/po-ratio.entity";
import { PoRatioComponentRepository } from "./repository/po-ratio-component.repository";
import { PoMarkerInfoService } from "../po-marker/po-marker-info.service";
import { PoDocketGenOrderRepository } from "./repository/po-ratio-component.repository copy";
const util = require('util');
@Injectable()
export class PoRatioInfoService {
  constructor(
    private dataSource: DataSource,
    @Inject(forwardRef(() => PoRatioHelperService)) private helperService: PoRatioHelperService,
    private ratioRepo: PoRatioRepository,
    private ratioLineRepo: PoRatioLineRepository,
    private ratioFabRepo: PoRatioFabricRepository,
    private ratioSizeRepo: PoRatioSizeRepository,
    private ratioCompRepo: PoRatioComponentRepository,
    private ratioDocGenOrderRepo: PoDocketGenOrderRepository
  ) {

  }

  /**
   * READER
   * @param req 
   * @returns 
   */
  async getAllRatiosForPo(req: PoProdutNameRequest): Promise<PoRatioResponse> {
    if (!req.poSerial) {
      throw new ErrorResponse(0, 'Po Serial is not provided');
    }
    let ratioIdsForProduct: number[] = [];
    if (req.productName) {
      ratioIdsForProduct = await this.ratioLineRepo.getRatioIdsForPoAndProductName(req.poSerial, req.productName, req.companyCode, req.unitCode);
      if (ratioIdsForProduct.length == 0) {
        throw new ErrorResponse(0, 'No ratios found for the fabric');
      }
    }
    let ratios: PoRatioEntity[] = [];
    // when the product name is provided
    if (ratioIdsForProduct.length > 0) {
      ratios = await this.ratioRepo.find({ where: { companyCode: req.companyCode, unitCode: req.unitCode, poSerial: req.poSerial, id: In(ratioIdsForProduct) }, order: { ratioCode: 'ASC' } });
    } else { // when only the PO is provided
      ratios = await this.ratioRepo.find({ where: { companyCode: req.companyCode, unitCode: req.unitCode, poSerial: req.poSerial }, order: { ratioCode: 'ASC' } });
    }
    if (ratios.length == 0) {
      throw new ErrorResponse(0, 'Ratios does not exist for the PO');
    }
    const ratioDocGenOrders = await this.ratioDocGenOrderRepo.find({ select: ['poRatioId', 'poSerial'], where: { companyCode: req.companyCode, unitCode: req.unitCode, isActive: true, poSerial: req.poSerial } });
    const ratioOrderMap = new Map<number, number>();
    let count = 0;
    ratioDocGenOrders.forEach(r => {
      count++;
      ratioOrderMap.set(r.poRatioId, count);
    });

    const ratioIds = ratios.map(r => r.id);
    const ratioCompsMap: Map<number, Map<string, Set<string>>> = await this.getRatioCompsMap(req.poSerial, ratioIds);
    const prodTypeFabInfoMap: Map<string, Map<string, CutRmModel>> = await this.getPoProdTypeItemInfoMap(req.poSerial, req.companyCode, req.unitCode);
    const poRatioModels: PoRatioModel[] = [];
    for (const ratio of ratios) {
      // const ratioComps =  ratioCompsMap.get(ratio.id);
      let sandwichRatio = false;
      let sharingRatio = false;
      const ratioComps = new Set<string>();
      ratioCompsMap.forEach(cs => {
        cs.forEach(c => {
          c.forEach(comp => {
            ratioComps.add(comp);
          })
        })
      });
      // get the marker info
      let poMarkerModel: PoMarkerModel = null;
      if (ratio.poMarkerId) {
        const currentMarker = await this.helperService.getPoMarker(ratio.poMarkerId, req.companyCode, req.unitCode);
        poMarkerModel = new PoMarkerModel(currentMarker.id, currentMarker.markerName, currentMarker.markerVersion, currentMarker.mWidth, currentMarker.mLength, currentMarker.patVer, currentMarker.defaultMarker, currentMarker.endAllowance, currentMarker.perimeter, currentMarker.remarks1, currentMarker.remarks2);
      }
      const docGenOrder = ratioOrderMap.get(ratio.id) ?? 0;
      const ratioLineModels = await this.getRatioLineModels(ratio.id, req.companyCode, req.unitCode, prodTypeFabInfoMap);
      const poRatioModel = new PoRatioModel(ratio.id, req.poSerial, ratio.ratioName, ratio.ratioDesc, ratio.ratioCode, sharingRatio, sandwichRatio, ratioLineModels[0].ratioPlies, ratio.docGenStatus, docGenOrder, Array.from(ratioComps), ratioLineModels, poMarkerModel, null);
      poRatioModels.push(poRatioModel);
    }
    return new PoRatioResponse(true, 0, 'Po ratios retrieved successfully', poRatioModels);
  }

  /**
   * READER
   * @param req 
   * @returns 
   */
  async getRatioDetailedInfoForRatioId(req: PoRatioIdRequest): Promise<PoRatioResponse> {
    if (!req.poSerial) {
      throw new ErrorResponse(0, 'Po Serial is not provided');
    }
    if (!req.poRatioId) {
      throw new ErrorResponse(0, 'Po ratio id is not provided');
    }
    const ratios = await this.ratioRepo.find({ where: { companyCode: req.companyCode, unitCode: req.unitCode, poSerial: req.poSerial, id: req.poRatioId } });
    if (ratios.length == 0) {
      throw new ErrorResponse(0, 'Ratios does not exist for the PO');
    }
    const ratioIds = ratios.map(r => r.id);
    const ratioCompsMap: Map<number, Map<string, Set<string>>> = await this.getRatioCompsMap(req.poSerial, ratioIds);
    const prodTypeFabInfoMap: Map<string, Map<string, CutRmModel>> = await this.getPoProdTypeItemInfoMap(req.poSerial, req.companyCode, req.unitCode);
    const poRatioModels: PoRatioModel[] = [];
    for (const ratio of ratios) {
      const ratioComps = new Set<string>();
      ratioCompsMap.forEach(cs => {
        cs.forEach(c => {
          c.forEach(comp => {
            ratioComps.add(comp);
          })
        })
      })
      // const ratioComps =  ratioCompsMap.get(ratio.id);
      let sandwichRatio = false;
      let sharingRatio = false;
      // Need to get the markers info 
      const currentMarker = ratio.poMarkerId ? await this.helperService.getPoMarker(ratio.poMarkerId, req.companyCode, req.unitCode) : null;
      const poMarkerModel = currentMarker ? new PoMarkerModel(currentMarker.id, currentMarker.markerName, currentMarker.markerVersion, currentMarker.mWidth, currentMarker.mLength, currentMarker.patVer, currentMarker.defaultMarker, currentMarker.endAllowance, currentMarker.perimeter, currentMarker.remarks1, currentMarker.remarks2) : null;
      const ratioLineModels = await this.getRatioLineModels(ratio.id, req.companyCode, req.unitCode, prodTypeFabInfoMap);
      const poRatioModel = new PoRatioModel(ratio.id, req.poSerial, ratio.ratioName, ratio.ratioDesc, ratio.ratioCode, sharingRatio, sandwichRatio, ratioLineModels[0].ratioPlies, ratio.docGenStatus, 0, Array.from(ratioComps), ratioLineModels, poMarkerModel, null);
      poRatioModels.push(poRatioModel);
    }
    return new PoRatioResponse(true, 0, 'Po ratios retrieved successfully', poRatioModels);
  }

  /**
   * HELPER
   * @param poRatioId 
   * @param companyCode 
   * @param unitCode 
   * @returns 
   */
  async getRatioLineModels(poRatioId: number, companyCode: string, unitCode: string, prodTypeFabInfoMap: Map<string, Map<string, CutRmModel>>, ratioLineIds?: number[], itemCode?: string): Promise<PoRatioLineModel[]> {
    const ratioEnt = new PoRatioEntity();
    ratioEnt.id = poRatioId;
    const rLineModels: PoRatioLineModel[] = [];
    // get the ratio lines and sizes
    const ratioLines = await this.ratioLineRepo.find({ select: ['color', 'productName', 'productType', 'plies', 'style', 'id'], where: { companyCode: companyCode, unitCode: unitCode, poRatioId: ratioEnt } });

    const ratioCompsMap: Map<number, Map<string, Set<string>>> = await this.getRatioCompsMap(ratioLines[0].poSerial, [poRatioId]);
    for (const line of ratioLines) {
      // This is an optional filter. Utilized while getting the fabric level ratio to skip the lines that are not part of the involved fabric
      if (ratioLineIds?.length > 0) {
        if (!ratioLineIds.includes(line.id)) {
          continue;
        }
      }
      const ratioFabModels: PoRatioFabricModel[] = [];
      // get the fabric and the sizes for the ratio line
      const fabs = await this.ratioFabRepo.find({ select: ['cgName', 'itemCode', 'itemColor', 'fabricCategory', 'maxPlies', 'plies', 'id'], where: { companyCode: companyCode, unitCode: unitCode, poRatioLineId: line } });
      fabs.forEach(r => {
        const fabInfo = prodTypeFabInfoMap.get(line.productName).get(r.itemCode);
        // This is an optional filter. Utilized while getting the fabric level ratio to skip the unwanted fabrics
        if (itemCode) {
          if (itemCode == r.itemCode) {
            ratioFabModels.push(new PoRatioFabricModel(r.id, r.itemCode, r.itemColor, fabInfo.iDesc, r.maxPlies, fabInfo.mainFabric, fabInfo.isBinding, fabInfo.bindingConsumption, fabInfo.wastage));
          }
        } else {
          ratioFabModels.push(new PoRatioFabricModel(r.id, r.itemCode, r.itemColor, fabInfo.iDesc, r.maxPlies, fabInfo.mainFabric, fabInfo.isBinding, fabInfo.bindingConsumption, fabInfo.wastage));
        }
      });
      const comps = ratioCompsMap.get(poRatioId).get(line.productName);
      const compsArray = comps ? Array.from(comps) : [];
      const ratioSizeModels: PoRatioSizeModel[] = [];
      const sizes = await this.ratioSizeRepo.find({ select: ['id', 'size', 'ratio'], where: { companyCode: companyCode, unitCode: unitCode, poRatioLineId: line } });
      sizes.forEach(r => {
        ratioSizeModels.push(new PoRatioSizeModel(r.size, r.ratio));
      });
      rLineModels.push(new PoRatioLineModel(line.id, line.productType, line.productName, line.color, line.plies, ratioFabModels, ratioSizeModels, compsArray));
    }
    return rLineModels;
  }


  /**
   * HELPER 
   * gets productName => itemCode => CutRmModel
   * @param poSerial 
   * @param companyCode 
   * @param unitCode 
   * @returns 
   */
  async getPoProdTypeItemInfoMap(poSerial: number, companyCode: string, unitCode: string): Promise<Map<string, Map<string, CutRmModel>>> {
    const prodTypeFabInfoMap = new Map<string, Map<string, CutRmModel>>();
    const fabInfoForPo = await this.helperService.getPoCutFabInfoForPo(poSerial, companyCode, unitCode);
    fabInfoForPo.forEach(r => {
      if (!prodTypeFabInfoMap.has(r.productName)) {
        prodTypeFabInfoMap.set(r.productName, new Map<string, CutRmModel>());
      }
      prodTypeFabInfoMap.get(r.productName).set(r.iCode, r);
    });
    return prodTypeFabInfoMap
  }

  /**
   * HELPER
   * @param poSerial 
   * @param ratioIds 
   * @returns 
   */
  async getRatioCompsMap(poSerial: number, ratioIds: number[]): Promise<Map<number, Map<string, Set<string>>>> {
    const compsForRatios = await this.ratioCompRepo.find({
      select: ['component', 'productName'], where: { poSerial: poSerial, poRatioId: In(ratioIds) },
      relations: ['poRatioId'], order: { 'component': 'ASC' }
    });
    const ratioCompsMap = new Map<number, Map<string, Set<string>>>();
    compsForRatios.forEach(r => {
      if (!ratioCompsMap.has(r.poRatioId.id)) {
        ratioCompsMap.set(r.poRatioId.id, new Map<string, Set<string>>());
      }
      if (!ratioCompsMap.get(r.poRatioId.id).has(r.productName)) {
        ratioCompsMap.get(r.poRatioId.id).set(r.productName, new Set<string>());
      }
      ratioCompsMap.get(r.poRatioId.id).get(r.productName).add(r.component);
    });
    return ratioCompsMap;
  };
  

  /**
   * NEED TO MODIFY
   * READER 
   * @param req 
   */
  async getAllRatiosForPoFabric(req: PoItemCodeRequest): Promise<PoFabricRatioResponse> {
    if (!req.iCode || !req.poSerial) {
      throw new ErrorResponse(0, 'Po serial / Item code not provided')
    }
    // filter out all the ratios for the fabric 
    const ratioIds = await this.ratioFabRepo.getRatioIdsForPoAndItemCode(req.poSerial, req.iCode, req.companyCode, req.unitCode);
    if (ratioIds.length == 0) {
      throw new ErrorResponse(0, 'No ratios found for the fabric');
    }
    const ratioLineIds = await this.ratioFabRepo.getRatioLineIdsForPoAndItemCode(req.poSerial, req.iCode, req.companyCode, req.unitCode);
    // get the po prod type info 
    const poProdTypeInfo = await this.helperService.getFabricLevelProdNameForPo(req.poSerial, req.companyCode, req.unitCode);
    const currItemProds = poProdTypeInfo.find(i => i.item_code == req.iCode);
    const prodNamesString = currItemProds.product_name;
    const prodTypesString = currItemProds.product_type;
    const prodNames = prodNamesString.split(',');
    const prodTypes = prodTypesString.split(',');
    // getting the RM SKU related detail info 
    const fabInfo = await this.helperService.getPoCutFabInfoForItemCode(req.poSerial, prodNames[0], req.iCode, req.companyCode, req.unitCode);

    const ratioCompsMap: Map<number, Map<string, Set<string>>> = await this.getRatioCompsMap(req.poSerial, ratioIds);

    const poRatioModels: PoRatioModel[] = [];
    const prodTypeFabInfoMap: Map<string, Map<string, CutRmModel>> = await this.getPoProdTypeItemInfoMap(req.poSerial, req.companyCode, req.unitCode);
    for (const ratioId of ratioIds) {
      const comps = new Set<string>();
      ratioCompsMap.forEach(cs => {
        cs.forEach(c => {
          c.forEach(comp => {
            comps.add(comp);
          })
        })
      })
      // const ratioComps = ratioCompsMap.get(ratioId);
      const ratioComps = comps;
      const ratio = await this.ratioRepo.findOne({ where: { companyCode: req.companyCode, unitCode: req.unitCode, id: ratioId } });
      // dont forget to pass the last 2 params ratioLinesIds and itemCode
      const ratioLineModels = await this.getRatioLineModels(ratio.id, req.companyCode, req.unitCode, prodTypeFabInfoMap, ratioLineIds, req.iCode);
      console.log(ratioLineModels);
      const poRatioModel = new PoRatioModel(ratio.id, req.poSerial, ratio.ratioName, ratio.ratioDesc, ratio.ratioCode, false, false, ratioLineModels[0].ratioPlies, ratio.docGenStatus, 0, Array.from(ratioComps), ratioLineModels, null, null);
      poRatioModels.push(poRatioModel);
    }
    const poFabRatioModel = new PoFabricRatioModel(req.iCode, fabInfo.iColor, '', '', '', '', [], poRatioModels);
    return new PoFabricRatioResponse(true, 0, 'Fabric ratios retrieved', [poFabRatioModel]);
  }

  /**
   * COMMENTED FOR TEMP
   * READER 
   * @param req 
   */
  // async getCumRatioQtyFabricWiseForPo(req: PoSerialRequest): Promise<PoFabricRatioResponse> {
  //   if(!req.poSerial) {
  //     throw new ErrorResponse(0, 'Po serial is not sent in the request');
  //   }
  //   // map that holds the final ratio qty of the fabric and size level
  //   const fabRatioQtysMap = new Map<string, Map<string, number>>();// Map of itemCode => size => ratioQty
  //   const poFabricWiseOqtys: Map<string, PoSizeQtysModel[]> = await this.helperService.getFabricLevelOqtysForPo(req.poSerial, req.companyCode, req.unitCode);
  //   console.log('1');
  //   console.log(poFabricWiseOqtys);
  //   const prodTypeFabInfoMap: Map<string, Map<string, CutRmModel>> = await this.getPoProdTypeItemInfoMap(req.poSerial, req.companyCode, req.unitCode);
  //   const poProdTypeInfo = await this.helperService.getFabricLevelProdNameForPo(req.poSerial, req.companyCode, req.unitCode);
  //   console.log('2');
  //   const ratioLines = await this.ratioLineRepo.find({ where: {companyCode: req.companyCode, unitCode: req.unitCode, poSerial: req.poSerial, isActive: true}, 
  //     relations: ['poRatioFabs', 'poRatioSizes']
  //   });
  //   ratioLines.forEach(r => {
  //     const ratioPlies = r.plies;
  //     r.poRatioFabs.forEach(fab => {
  //       if(!fabRatioQtysMap.has(fab.itemCode)) {
  //         fabRatioQtysMap.set(fab.itemCode, new Map<string, number>());
  //       }
  //       // now loop all the size ratios for every fabric
  //       r.poRatioSizes.forEach(sz => {
  //         if(!fabRatioQtysMap.get(fab.itemCode).has(sz.size)) {
  //           fabRatioQtysMap.get(fab.itemCode).set(sz.size, 0);
  //         }
  //         const preVal = fabRatioQtysMap.get(fab.itemCode).get(sz.size);
  //         fabRatioQtysMap.get(fab.itemCode).set(sz.size, preVal + (Number(sz.ratio)*Number(ratioPlies)) );
  //       });
  //     });
  //   });

  //   console.log('3');
  //   console.log(fabRatioQtysMap);

  //   const poFabRatioModels: PoFabricRatioModel[] = [];
  //   poFabricWiseOqtys.forEach((qtys, itemCode) => {
  //     // append the ratios qty for the size 
  //     qtys.forEach(r => {
  //       r.ratioQuantity = fabRatioQtysMap?.get(itemCode)?.get(r.size) ?? 0;
  //     })
  //     const currItemProds = poProdTypeInfo.find(i => i.item_code == itemCode);
  //     const prodNamesString = currItemProds.product_name;
  //     const prodTypesString = currItemProds.product_type;
  //     const prodNames = prodNamesString.split(',');
  //     const prodTypes = prodTypesString.split(',');
  //     const fabInfo = prodTypeFabInfoMap?.get(prodNames[0])?.get(itemCode);
  //     poFabRatioModels.push(new PoFabricRatioModel(itemCode, fabInfo?.iColor, prodTypes, prodNames, qtys, []));
  //   });
  //   return new PoFabricRatioResponse(true, 0, 'Po fabric ratios and order qtys retrieved', poFabRatioModels);
  // }

  /**
   * READER 
   * @param req 
   */
  async getCumRatioQtyFabricWiseForPo(req: PoSerialRequest): Promise<PoFabricRatioResponse> {
    if (!req.poSerial) {
      throw new ErrorResponse(0, 'Po serial is not sent in the request');
    }
    // get the map of po prod names and their colors
    // map that holds the final ratio qty of the fabric and size level
    const fabRatioQtysMap = new Map<string, Map<string, Map<string, Map<string, Map<string, number>>>>>();// Map of productname => itemCode => component => size => ratioQty
    const poFabricWiseOqtys: Map<string, Map<string, Map<string, Map<string, PoSizeQtysModel[]>>>> = await this.helperService.getFabricLevelOqtysForPo(req.poSerial, req.companyCode, req.unitCode);
    console.log('1');
    console.log(util.inspect(poFabricWiseOqtys, false, null, true));
    const prodTypeFabInfoMap: Map<string, Map<string, CutRmModel>> = await this.getPoProdTypeItemInfoMap(req.poSerial, req.companyCode, req.unitCode);
    const poProdTypeInfo = await this.helperService.getFabricLevelProdNameForPo(req.poSerial, req.companyCode, req.unitCode);
    console.log('2');

    const ratioLines = await this.ratioLineRepo.find({
      where: { companyCode: req.companyCode, unitCode: req.unitCode, poSerial: req.poSerial, isActive: true },
      relations: ['poRatioFabs', 'poRatioSizes', 'poRatioId']
    });
    const ratioIds: number[] = ratioLines.map(r => r.poRatioId.id);
    console.log('2.1');

    const ratioCompsMap: Map<number, Map<string, Set<string>>> = await this.getRatioCompsMap(req.poSerial, ratioIds);

    console.log('2.3');
    ratioLines.forEach(r => {
      if (!fabRatioQtysMap.has(r.productName)) {
        fabRatioQtysMap.set(r.productName, new Map<string, Map<string, Map<string, Map<string, number>>>>());
      }
      if (!fabRatioQtysMap.get(r.productName).has(r.color)) {
        fabRatioQtysMap.get(r.productName).set(r.color, new Map<string, Map<string, Map<string, number>>>());
      }
      const comps = ratioCompsMap.get(r.poRatioId.id).get(r.productName);
      const ratioPlies = r.plies;
      r.poRatioFabs.forEach(fab => {
        if (!fabRatioQtysMap.get(r.productName).get(r.color).has(fab.itemCode)) {
          fabRatioQtysMap.get(r.productName).get(r.color).set(fab.itemCode, new Map<string, Map<string, number>>());
        }

        // withing every fabric loop all the components in the ratio to get the comp wise qtys
        comps.forEach(comp => {
          if (!fabRatioQtysMap.get(r.productName).get(r.color).get(fab.itemCode).has(comp)) {
            fabRatioQtysMap.get(r.productName).get(r.color).get(fab.itemCode).set(comp, new Map<string, number>());
          }
          // now loop all the size ratios for every fabric
          r.poRatioSizes.forEach(sz => {
            if (!fabRatioQtysMap.get(r.productName).get(r.color).get(fab.itemCode).get(comp).has(sz.size)) {
              fabRatioQtysMap.get(r.productName).get(r.color).get(fab.itemCode).get(comp).set(sz.size, 0);
            }
            const preVal = fabRatioQtysMap.get(r.productName).get(r.color).get(fab.itemCode).get(comp).get(sz.size);
            fabRatioQtysMap.get(r.productName).get(r.color).get(fab.itemCode).get(comp).set(sz.size, preVal + (Number(sz.ratio) * Number(ratioPlies)));
          });
        });
      });
    });

    console.log('3');
    // console.log(fabRatioQtysMap.get('Body'));
    console.log(util.inspect(fabRatioQtysMap, false, null, true));
    const poFabRatioModels: PoFabricRatioModel[] = [];
    poFabricWiseOqtys.forEach((fabricWiseQtys, prodName) => {
      fabricWiseQtys.forEach((colorInfo, fgColor) => {
        colorInfo.forEach((compQtys, itemCode) => {
          const currItemProds = poProdTypeInfo.find(i => i.item_code == itemCode && i.product_name.split(',')?.includes(prodName));
          const prodNamesString = currItemProds.product_name;
          const prodTypesString = currItemProds.product_type;
          const prodNames = prodNamesString.split(',');
          const prodTypes = prodTypesString.split(',');
          const fabInfo = prodTypeFabInfoMap?.get(prodNames[0])?.get(itemCode);
          compQtys.forEach((sizeQtys, comp) => {
            sizeQtys.forEach(r => {
              console.log(r.size);
              console.log(fabRatioQtysMap?.get(prodName)?.get(fgColor)?.get(itemCode)?.get(comp)?.get(r.size));
              const preVal = fabRatioQtysMap?.get(prodName)?.get(fgColor)?.get(itemCode)?.get(comp)?.get(r.size);
              r.ratioQuantity = preVal ?? 0;
            });
            // console.log(sizeQtys);
            console.log(comp + ' DONE ');
            poFabRatioModels.push(new PoFabricRatioModel(itemCode, fabInfo?.iColor, prodTypes[0], prodName, comp, fgColor, sizeQtys, []));
          });
        });
      })

    });
    return new PoFabricRatioResponse(true, 0, 'Po fabric ratios and order qtys retrieved', poFabRatioModels);
  }

  /**
   * READER
   * ENDPOINT
   * @param req 
   * @returns 
   */
  async getMarkerVersionIdForRatio(req: PoRatioIdRequest): Promise<PoRatioMarkerIdResponse> {
    if (!req.poSerial) {
      throw new ErrorResponse(0, 'Po Serial is not provided');
    }
    if (!req.poRatioId) {
      throw new ErrorResponse(0, 'Po ratio id is not provided');
    }
    const ratio = await this.ratioRepo.findOne({ where: { companyCode: req.companyCode, unitCode: req.unitCode, poSerial: req.poSerial, id: req.poRatioId } });
    if (!ratio) {
      throw new ErrorResponse(0, `Ratio does not exist for the id : ${req.poRatioId} `);
    }
    const markerId = ratio.poMarkerId;
    const ratioMarkerIdModel: PoRatioMarkerIdModel[] = [];
    ratioMarkerIdModel.push(new PoRatioMarkerIdModel(markerId));
    return new PoRatioMarkerIdResponse(true, 0, 'Po ratio mapped marker id retrieved', ratioMarkerIdModel);
  }

  /**
   * HELPER
   * READER
   * @param poSerial 
   * @param markerId 
   * @param companyCode 
   * @param unitCode 
   */
  async getRatiosMappedForPoMarker(poSerial: number, markerId: number, companyCode: string, unitCode: string): Promise<PoRatioEntity[]> {
    const ratios = await this.ratioRepo.find({ where: { companyCode: companyCode, unitCode: unitCode, poSerial: poSerial, poMarkerId: markerId, isActive: true } });
    return ratios;
  }

  async getRatioRecordsForPo(poSerial: number, companyCode: string, unitCode: string): Promise<PoRatioEntity[]> {
    return await this.ratioRepo.find({ where: { companyCode: companyCode, unitCode: unitCode, poSerial: poSerial } });
  }

  async getRatioLineRecordsForPoAndProdName(poSerial: number, prodName: string, companyCode: string, unitCode: string): Promise<PoRatioLineEntity[]> {
    return await this.ratioLineRepo.find({ where: { companyCode: companyCode, unitCode: unitCode, poSerial: poSerial, productName: prodName } });
  }

}