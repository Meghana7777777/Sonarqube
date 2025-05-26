import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { ErrorResponse } from "@xpparel/backend-utils";
import { DocGenStatusEnum, GlobalResponseObject, PoLinesModel, PoRatioCreateRequest, PoRatioIdMarkerIdRequest, PoRatioIdRequest, PoRatioSizeRequest, RatioDocGenStatusRequest } from "@xpparel/shared-models";
import { DataSource, In } from "typeorm";
import { GenericTransactionManager } from "../../database/typeorm-transactions";
import { PoMarkerEntity } from "../po-marker/entity/po-marker.entity";
import { PoDocketGenOrderEntity } from "./entity/po-docket-gen-order.entity";
import { PoRatioComponentEntity } from "./entity/po-ratio-component.entity";
import { PoRatioFabricEntity } from "./entity/po-ratio-fabric.entity";
import { PoRatioLineEntity } from "./entity/po-ratio-line.entity";
import { PoRatioSizeEntity } from "./entity/po-ratio-size.entity";
import { PoRatioEntity } from "./entity/po-ratio.entity";
import { PoRatioHelperService } from "./po-ratio-helper.service";
import { PoDocketGenOrderRepository } from "./repository/po-ratio-component.repository copy";
import { PoRatioFabricRepository } from "./repository/po-ratio-fabric.repository";
import { PoRatioLineRepository } from "./repository/po-ratio-line.repository";
import { PoRatioSizeRepository } from "./repository/po-ratio-size.repository";
import { PoRatioRepository } from "./repository/po-ratio.repository";
import moment = require("moment");

@Injectable()
export class PoRatioService {
  constructor(
    private dataSource: DataSource,
    @Inject(forwardRef(() => PoRatioHelperService)) private helperService: PoRatioHelperService,
    private ratioRepo: PoRatioRepository,
    private ratioLineRepo: PoRatioLineRepository,
    private ratioFabRepo: PoRatioFabricRepository,
    private ratioSizeRepo: PoRatioSizeRepository,
    private docGenOrderRepo: PoDocketGenOrderRepository
  ) {

  }


  /**
   * WRITER
   * creates the ratios
   * @param req 
   * @returns 
   */
  async createPoRatio(req: PoRatioCreateRequest[]): Promise<any> {
    const transManager = new GenericTransactionManager(this.dataSource);
    try {
      if (!req[0]?.poSerial) {
        throw new ErrorResponse(0, 'PO serial is not sent in the request');
      }
      const ratioEntities: PoRatioEntity[] = [];
      for (const ratio of req) {
        const ratioEntity = await this.getRatioObject(ratio);
        ratioEntities.push(ratioEntity);
      }
      // after all now get the max ratio code to generate the new ratio codes now
      // lock the ratio creation per PO serial
      const lock = 'PO-RATIO-' + req[0].poSerial;
      let maxRatioCode = await this.ratioRepo.getMaxRatioCodeForPo(req[0].poSerial, req[0].companyCode, req[0].unitCode);
      const firstRatio = maxRatioCode == 0;
      // reassign the ratio codes and ratio names
      ratioEntities.forEach(r => {
        r.ratioCode = ++maxRatioCode;
        r.ratioName = 'Ratio-' + maxRatioCode;
      });
      await transManager.startTransaction();
      await transManager.getRepository(PoRatioEntity).save(ratioEntities);
      await transManager.completeTransaction();
      // release the lock
      // trigger the po serial generation job for the first ratio
      if (firstRatio) {
        await this.helperService.addPoDocketSerialGenerationJob(req[0].poSerial, req[0].companyCode, req[0].unitCode, req[0].username);
      }
      return new GlobalResponseObject(true, 0, 'Ratio saved successfully');
    } catch (err) {
      await transManager.releaseTransaction();
      throw err;
    }
  }

  // HELPER
  async getRatioObject(req: PoRatioCreateRequest): Promise<PoRatioEntity> {
    const savedRatioLineMap = new Map<string, Map<string, PoRatioLineEntity>>(); // map of product-name => RatioLineEntity  as we have to save only 1 line per product name
    const ratioEnt = new PoRatioEntity();
    ratioEnt.companyCode = req.companyCode;
    ratioEnt.unitCode = req.unitCode;
    ratioEnt.createdUser = req.username;
    ratioEnt.poSerial = req.poSerial;
    ratioEnt.ratioDesc = req.ratioDesc;
    ratioEnt.remarks = req.remarks;
    ratioEnt.ratioCode = 0;
    ratioEnt.ratioName = '';
    ratioEnt.poRatioLines = [];
    ratioEnt.poRatioComponents = [];

    // get the product info from the po
    const poLineInfo = await this.helperService.getPoLinesBasicInfoByPoSerial(req.poSerial, req.companyCode, req.unitCode);
    console.log(poLineInfo)
    // Product name -> fg Color -> Po Lines 
    const poLineInfoMap = new Map<string, Map<string, PoLinesModel>>();
    for (const eachLine of poLineInfo) {
      if (!poLineInfoMap.has(eachLine.productName)) {
        poLineInfoMap.set(eachLine.productName, new Map<string, PoLinesModel>())
      }
      if (!poLineInfoMap.get(eachLine.productName).has(eachLine.color)) {
        poLineInfoMap.get(eachLine.productName).set(eachLine.color, eachLine);
      }
    };
    const typesOfFabric = new Set<boolean>();
    for (const line of req.ratioLines) {
      let ratioLine = savedRatioLineMap.get(line.productName)?.get(line.fgColor);
      if (!ratioLine) {
        for (const eachLine of poLineInfo) {
          if (eachLine.color == line.fgColor && eachLine.productName == line.productName) {
            if (!savedRatioLineMap.has(eachLine.productName)) {
              savedRatioLineMap.set(eachLine.productName, new Map<string, PoRatioLineEntity>())
            }
            if (!savedRatioLineMap.get(eachLine.productName).has(eachLine.color)) {
              savedRatioLineMap.get(eachLine.productName).set(eachLine.color, new PoRatioLineEntity());
            }
          };
        }
        // override the object with the already saved one to avoid duplicate assignments
        ratioLine = savedRatioLineMap.get(line.productName).get(line.fgColor);
        // get the props of po + product type from po info
        console.log(line.productName, line.fgColor);
        const poProdInfo = poLineInfoMap.get(line.productName).get(line.fgColor);
        ratioLine.color = line.fgColor;
        ratioLine.productType = poProdInfo.productType;
        ratioLine.productName = line.productName;
        ratioLine.plies = line.plies;
        ratioLine.remarks = req.remarks;
        ratioLine.poSerial = req.poSerial;
        ratioLine.unitCode = req.unitCode;
        ratioLine.companyCode = req.companyCode;
        ratioLine.createdUser = req.username;
        ratioLine.poRatioSizes = [];
        ratioLine.poRatioFabs = [];
        // pusht he raito line into the ratio
        ratioEnt.poRatioLines.push(ratioLine);

        // save the ratio sizes only once per raito_line
        for (const size of line.sizeRatios) {
          const ratioSize = new PoRatioSizeEntity();
          ratioSize.companyCode = req.companyCode;
          ratioSize.unitCode = req.unitCode;
          ratioSize.size = size.size;
          ratioSize.ratio = size.ratio;
          ratioSize.createdUser = req.username;
          // push the sizes into the ratio line
          ratioLine.poRatioSizes.push(ratioSize);
        }
      };
      // get the fab props of the po + item
      const poFabInfo = await this.helperService.getPoCutFabInfoForItemCode(req.poSerial, line.productName, line.iCode, req.companyCode, req.unitCode);
      typesOfFabric.add(poFabInfo.isBinding)
      if (typesOfFabric.size > 1) {
        throw new ErrorResponse(0, 'Ratio should not have both binding and non binding fabrics');
      }
      const fabComps = poFabInfo.components;
      const productSelectedComps = new Set<string>();
      // now check if all the ratio components exist in the fabric
      fabComps.forEach((comp) => {
        if (!req.components.includes(comp)) {
          throw new ErrorResponse(0, 'Component : ' + comp + ' - is not mapped to the fabric : ' + poFabInfo.iCode);
        }
        productSelectedComps.add(comp);
      });
      const ratioFab = new PoRatioFabricEntity();
      ratioFab.cgName = '';
      ratioFab.itemColor = poFabInfo.iColor;
      ratioFab.poSerial = req.poSerial;
      ratioFab.companyCode = req.companyCode;
      ratioFab.unitCode = req.unitCode;
      ratioFab.itemCode = line.iCode;
      ratioFab.maxPlies = req.maxPlies;
      ratioFab.plies = line.plies;
      ratioFab.remarks = '';
      ratioFab.createdUser = req.username;
      ratioFab.fabricCategory = poFabInfo.fabCat;
      // push the fab into the ratio line
      ratioLine.poRatioFabs.push(ratioFab);
      console.log('2');

      productSelectedComps.forEach(comp => {
        const ratioComp = new PoRatioComponentEntity();
        ratioComp.component = comp;
        ratioComp.poSerial = req.poSerial;
        ratioComp.productName = line.productName;
        ratioEnt.poRatioComponents.push(ratioComp);
      });
    }


    console.log('3');
    return ratioEnt;
  }

  /**
   * WRITER
   * @param req 
   * @returns 
   */
  async deleteRatio(req: PoRatioIdRequest): Promise<GlobalResponseObject> {
    const transManager = new GenericTransactionManager(this.dataSource);
    try {
      if (!req.poRatioId) {
        throw new ErrorResponse(0, 'Ratio Id is not provided');
      }
      const ratio = await this.ratioRepo.findOne({ select: ['id', 'docGenStatus'], where: { id: req.poRatioId, companyCode: req.companyCode, unitCode: req.unitCode } });
      if (!ratio) {
        throw new ErrorResponse(0, 'Ratio does not exist');
      }
      // check if the dockets were already generated
      if (ratio.docGenStatus != DocGenStatusEnum.OPEN) {
        throw new ErrorResponse(0, 'Docket generation is already started for this ratio. You cannot delete');
      }
      const ratioEnt = new PoRatioEntity();
      ratioEnt.id = req.poRatioId;
      // get all the ratio lines ids
      const lineEnts: PoRatioLineEntity[] = [];
      const lineIds: number[] = [];
      const ratioLines = await this.ratioLineRepo.find({ select: ['id'], where: { poRatioId: ratioEnt, companyCode: req.companyCode, unitCode: req.unitCode } })
      ratioLines.forEach(r => {
        lineIds.push(r.id);
        const rlEnt = new PoRatioLineEntity();
        rlEnt.id = r.id;

        lineEnts.push(rlEnt);
      })

      await transManager.startTransaction();
      await transManager.getRepository(PoRatioSizeEntity).delete({ companyCode: req.companyCode, unitCode: req.unitCode, poRatioLineId: In(lineIds) });
      await transManager.getRepository(PoRatioFabricEntity).delete({ companyCode: req.companyCode, unitCode: req.unitCode, poRatioLineId: In(lineIds) });
      await transManager.getRepository(PoRatioLineEntity).delete({ companyCode: req.companyCode, unitCode: req.unitCode, poRatioId: ratioEnt });
      await transManager.getRepository(PoRatioComponentEntity).delete({ poSerial: req.poSerial, poRatioId: ratioEnt });
      await transManager.getRepository(PoRatioEntity).delete({ companyCode: req.companyCode, unitCode: req.unitCode, id: req.poRatioId });
      await transManager.completeTransaction();
      return new GlobalResponseObject(true, 0, 'Ratio deleted successfully');
    } catch (err) {
      await transManager.releaseTransaction();
      throw err;
    }
  }


  /**
   * Service to update the docket generation status for the ratio Id
   * @param req 
   * @returns 
  */
  async updateDocGenStatusByRatioId(req: RatioDocGenStatusRequest): Promise<GlobalResponseObject> {
    const { unitCode, companyCode } = req;
    const ratioRec: PoRatioEntity = await this.ratioRepo.findOne({ where: { id: req.ratioId, unitCode, companyCode, poSerial: req.poSerial } });
    if (!ratioRec) {
      throw new ErrorResponse(0, 'Ratio Details not found for the given details Please check.')
    }
    // update the order of the docket generation against to the ratio
    if (req.docGenStatus == DocGenStatusEnum.INPROGRESS) {
      // This means docket gen has been started
      const docGenOrderEnt = new PoDocketGenOrderEntity();
      docGenOrderEnt.companyCode = req.companyCode;
      docGenOrderEnt.unitCode = req.unitCode;
      docGenOrderEnt.createdUser = req.username;
      docGenOrderEnt.poRatioId = req.ratioId;
      docGenOrderEnt.poSerial = ratioRec.poSerial;
      await this.docGenOrderRepo.save(docGenOrderEnt, { reload: false });
    } else if (req.docGenStatus == DocGenStatusEnum.OPEN) {
      // This means dockets are been deleted
      await this.docGenOrderRepo.update({ poSerial: req.poSerial, poRatioId: req.ratioId, companyCode: req.companyCode, unitCode: req.unitCode }, { isActive: false });
    }
    const updateResult = await this.ratioRepo.update({ id: req.ratioId, unitCode, companyCode, poSerial: req.poSerial }, { docGenStatus: req.docGenStatus });
    if (!updateResult.affected) {
      throw new ErrorResponse(0, 'Docket generation status updating failed against to ratio Id')
    }
    return new GlobalResponseObject(true, 0, 'Docket generation Status Updated Successfully.')
  }


  /**
   * WRITER
   * ENDPOINT
   * Sets the marker version for a ratio
   * @param req 
   */
  async setMarkerVersionForRatio(req: PoRatioIdMarkerIdRequest): Promise<GlobalResponseObject> {
    if (!req.poMarkerId || !req.poRatioId) {
      throw new ErrorResponse(0, 'Ratio id and marker id are mandatory');
    }
    const ratioRec = await this.ratioRepo.findOne({ select: ['id', 'docGenStatus', 'poSerial'], where: { id: req.poRatioId, companyCode: req.companyCode, unitCode: req.unitCode } });
    if (!ratioRec) {
      throw new ErrorResponse(0, `Ratio does not exist for id : ${req.poRatioId}`);
    }
    if (ratioRec.docGenStatus != DocGenStatusEnum.OPEN) {
      throw new ErrorResponse(0, 'Dockets are already generated for the ratio. You cannot edit markers');
    }

    // get the ratio mapped prod names and fabs
    const ratioProdAndFabNames = await this.ratioLineRepo.getProductNameAndFabsForRatioId(ratioRec.poSerial, req.poRatioId, req.companyCode, req.unitCode);
    console.log(ratioProdAndFabNames)
    const clubRatio = ratioProdAndFabNames.length > 1;
    let actualMarkerInfo: PoMarkerEntity[] = [];
    const markerInfo = await this.helperService.getMarkerInfoByMarkerId(req.poMarkerId, req.companyCode, req.unitCode);
    actualMarkerInfo = [markerInfo];
    console.log(actualMarkerInfo);
    if (!markerInfo) {
      throw new ErrorResponse(0, `Marker does not exist for id : ${req.poMarkerId}`);
    }
    // if it is a club ratio, then the marker must also be a clubbed one
    if (clubRatio) {
      const clubMarkerInfo = await this.helperService.getClubMarkerInfoByMarkerId(markerInfo.poSerial, markerInfo.id, markerInfo.clubMarkerCode, req.companyCode, req.unitCode);
      actualMarkerInfo = clubMarkerInfo;
      console.log(actualMarkerInfo);
      // check if the ratio prod names and fabrics are exactly matching with the markers names
      if (actualMarkerInfo.length != ratioProdAndFabNames.length) {
        throw new ErrorResponse(0, `Club ratio has ${ratioProdAndFabNames.length} combinations. Where as marker has only ${actualMarkerInfo.length}`);
      }

      // now exactly the prod name and item combination
      clubMarkerInfo.forEach(r => {
        const refRecordInRatio = ratioProdAndFabNames.find(m => m.product_name && m.item_code == r.itemCode);
        if (!refRecordInRatio) {
          throw new ErrorResponse(0, `The product name : ${r.productName} and item : ${r.itemCode} are not matching with ratio and selected marker`);
        }
      });
    }
    // finally save the marker id against the ratio. Remeber for club ratio, you can any marker id within the clubbed combintation
    await this.ratioRepo.update({ id: req.poRatioId, companyCode: req.companyCode, unitCode: req.unitCode }, { poMarkerId: req.poMarkerId });
    return new GlobalResponseObject(true, 0, 'Marker version set successfully');
  }


  /**
   * WRITER
   * ENDPOINT
   * @param req 
   * @returns 
   */
  async unSetMarkerVersionForRatio(req: PoRatioIdRequest): Promise<GlobalResponseObject> {
    if (!req.poRatioId) {
      throw new ErrorResponse(0, 'Ratio id is mandatory');
    }
    const ratioRec = await this.ratioRepo.findOne({ select: ['id'], where: { id: req.poRatioId, companyCode: req.companyCode, unitCode: req.unitCode } });
    if (!ratioRec) {
      throw new ErrorResponse(0, `Ratio does not exist for id : ${req.poRatioId}`);
    }
    await this.ratioRepo.update({ id: req.poRatioId, companyCode: req.companyCode, unitCode: req.unitCode }, { poMarkerId: null });
    return new GlobalResponseObject(true, 0, 'Marker version unset successfully');
  }

  /**
   * HELPER
   * Unset the marker version for the ratio ids if set
   */
  async unSetMarkerIdsForRatios(markerIds: number[], poSerial: number, companyCode: string, unitCode: string, transManager: GenericTransactionManager): Promise<boolean> {
    await transManager.getRepository(PoRatioEntity).update({ poSerial: poSerial, companyCode: companyCode, unitCode: unitCode, poMarkerId: In(markerIds) }, { poMarkerId: null });
    return true;
  }


  async updateRatioSizes(req: PoRatioSizeRequest[]): Promise<GlobalResponseObject> {
    const transManager = new GenericTransactionManager(this.dataSource);
    try {
      const ratio = await this.ratioRepo.findOne({ select: ['id', 'docGenStatus'], where: { id: req[0].poRatioId, companyCode: req[0].companyCode, unitCode: req[0].unitCode } });
      if (!ratio) {
        throw new ErrorResponse(0, 'Ratio does not exist');
      }
      // check if the dockets were already generated
      if (ratio.docGenStatus != DocGenStatusEnum.OPEN) {
        throw new ErrorResponse(0, 'Docket generation is already started for this ratio. You cannot edit');
      }
      await transManager.startTransaction();
      for (const rec of req) {
        const existingRecord = await this.ratioSizeRepo.findOne({ where: { poRatioLineId: { id: rec.poRatioLinesId }, size: rec.poRatioSize, companyCode: rec.companyCode, unitCode: rec.unitCode } });
        if (existingRecord) {
          await transManager.getRepository(PoRatioSizeEntity).update({ poRatioLineId: { id: rec.poRatioLinesId }, size: rec.poRatioSize }, { ratio: rec.poRatio, companyCode: rec.companyCode, unitCode: rec.unitCode });
        }
      }
      await transManager.completeTransaction();
      return new GlobalResponseObject(true, 1, 'Size ratios updated successfully');

    } catch (error) {
      return new GlobalResponseObject(false, 0, `Error updating ratios: ${error.message}`);
    } finally {
      await transManager.releaseTransaction();
    }
  }



}