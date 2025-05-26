import { Global, Inject, Injectable, forwardRef } from "@nestjs/common";
import { DataSource, In } from "typeorm";
import moment = require("moment");
import { PoMarkerHelperService } from "./po-marker-helper.service";
import { GlobalResponseObject, MarkerCreateRequest, MarkerIdRequest, MarkerProdNameItemCodeModel, PoProdTypeAndFabModel } from "@xpparel/shared-models";
import { GenericTransactionManager } from "../../database/typeorm-transactions";
import { PoMarkerRepository } from "./repository/po-ratio-marker.repository";
import { ErrorResponse } from "@xpparel/backend-utils";
import { PoMarkerEntity } from "./entity/po-marker.entity";

@Injectable()
export class PoMarkerService {
  constructor(
    private dataSource: DataSource,
    @Inject(forwardRef(() => PoMarkerHelperService)) private helperService: PoMarkerHelperService,
    private markerRepo: PoMarkerRepository
  ) {

  }

  /**
   * WRITER
   * @param req 
   * @returns 
   */
  async createPoMarker( req: MarkerCreateRequest): Promise<GlobalResponseObject> {
    let transManager = new GenericTransactionManager(this.dataSource);
    try {
      // Marker will be created for a PO and the product name under it
      // markerVersion must be unique for poSerial + productName + itemCode
      // check if the marker type and id are correct from the masters
      const isClubMarker = req.productNameItemCodeCombinations.length > 1;
      let maxClubCode = 0;
      if(isClubMarker) {
        // get the clubbed marker code
        maxClubCode = await this.markerRepo.getMaxClubMarkerCode(req.poSerial, req.companyCode, req.unitCode);
        maxClubCode+=1;
        for(const prodAndFab of req.productNameItemCodeCombinations) {
          // check if the marker version already exist
          await this.checkIfMarkerVersionExistForProdNameAndPo(req.poSerial, prodAndFab.productName, prodAndFab.itemCode, req.companyCode, req.unitCode, req.markerVersion);
        }
      } else {
        // check if the marker version already exist
        const prodAndFab = req.productNameItemCodeCombinations[0];
        await this.checkIfMarkerVersionExistForProdNameAndPo(req.poSerial, prodAndFab.productName, prodAndFab.itemCode, req.companyCode, req.unitCode, req.markerVersion);
      }
      // get the marker info for the marker id
      const markerTypeInfo = await this.helperService.getMarkerRecordTypeByMarkerTypeId(req.markerTypeId, req.companyCode, req.unitCode);
      if(!markerTypeInfo) {
        throw new ErrorResponse(0, 'Marker type does not exist');
      }
      req.markerType = markerTypeInfo.markerType;

      const markerEntities = this.getMarkerEntities(req, isClubMarker, maxClubCode);
      await transManager.startTransaction();
      await transManager.getRepository(PoMarkerEntity).save(markerEntities, { reload: false });
      await transManager.completeTransaction();
      return new GlobalResponseObject(true, 0, 'Marker version saved successfully');
    } catch (err) {
      await transManager.releaseTransaction();
      throw err;
    }
  }

  /**
   * WRITER
   * @param req 
   * @returns 
   */
  async createGlobalMarker(req: MarkerCreateRequest): Promise<GlobalResponseObject> {
    let transManager = new GenericTransactionManager(this.dataSource);
    try {
      const fabrics = req.productNameItemCodeCombinations.map(f => {
        return f.itemCode;
      });
      if(fabrics.length == 0) {
        throw new ErrorResponse(0, 'Fabrics are not selected for the PO');
      }
      // fab -> product -> fg color -> 
      const fabProdTypesMap = new Map<string, Map<string, string>>();
      // now get all the product names associated for the fabrics and the PO
      const productNamesAndFabrics: PoProdTypeAndFabModel[] = await this.helperService.getPoProdTypeAndFabrics(req.poSerial, req.companyCode, req.unitCode);
      productNamesAndFabrics.forEach(p => {
        p.iCodes.forEach(i => {
          if(fabrics.includes(i.iCode)) {
            if(!fabProdTypesMap.has(i.iCode)) {
              fabProdTypesMap.set(i.iCode, new Map<string, string>())
            }
            if(!fabProdTypesMap.get(i.iCode).has(p.color)) {
              fabProdTypesMap.get(i.iCode).set(p.color, p.productName)
            }
          }
        });
      });
      console.log(fabProdTypesMap);
      const prodFabs: MarkerProdNameItemCodeModel[] = [];
      // construct the req MarkerProductNameItemCodeModel[] by getting the prod names 
      fabProdTypesMap.forEach((prodTypes, fab) => {
        prodTypes.forEach((p, c) => {
          prodFabs.push(new MarkerProdNameItemCodeModel(p, c, fab)); 
        });
      });
      // Re assign the prod name and the fabs
      req.productNameItemCodeCombinations = prodFabs;
      await this.checkIfMarkerVersionExistForPoAndItemCodes(req.poSerial, fabrics, req.companyCode, req.unitCode, req.markerVersion);

      // get the marker info for the marker id
      const markerTypeInfo = await this.helperService.getMarkerRecordTypeByMarkerTypeId(req.markerTypeId, req.companyCode, req.unitCode);
      if(!markerTypeInfo) {
        throw new ErrorResponse(0, 'Marker type does not exist');
      }
      req.markerType = markerTypeInfo.markerType;
      let maxClubCode = await this.markerRepo.getMaxClubMarkerCode(req.poSerial, req.companyCode, req.unitCode);
      maxClubCode+=1;
      const markerEntities = this.getMarkerEntities(req, true, maxClubCode);
      await transManager.startTransaction();
      await transManager.getRepository(PoMarkerEntity).save(markerEntities, { reload: false });
      await transManager.completeTransaction();
      return new GlobalResponseObject(true, 0, 'Global Marker version saved successfully');
    } catch (err) {
      await transManager.releaseTransaction();
      throw err;
    }
  }

  // VALIDATOR
  async checkIfMarkerVersionExistForProdNameAndPo(poSerial: number, prodName: string, itemCode: string, companyCode: string, unitCode: string, markerVersion: string): Promise<boolean> {
    const mv = await this.markerRepo.findOne({ select: ['id'], where: {companyCode: companyCode, unitCode: unitCode, poSerial: poSerial, productName: prodName, itemCode: itemCode, markerVersion: markerVersion } });
    if (mv) {
      throw new ErrorResponse(0, `Marker version already exist for the prodcut name : ${prodName} `);
    }
    return true;
  }

  // VALIDATOR
  async checkIfMarkerVersionExistForPoAndItemCodes(poSerial: number, itemCodes: string[], companyCode: string, unitCode: string, markerVersion: string): Promise<boolean> {
      const mv = await this.markerRepo.findOne({ select: ['id', 'productName'], where: {companyCode: companyCode, unitCode: unitCode, poSerial: poSerial, itemCode: In(itemCodes), markerVersion: markerVersion } });
      if (mv) {
        throw new ErrorResponse(0, `Marker version already exist for the prodcut name : ${mv.productName} `);
      }
      return true;
    }

  // HELPER
  getMarkerEntities( req: MarkerCreateRequest, isClubMarker: boolean, clubMarkerCode: number): PoMarkerEntity[] {
    const markerEntities: PoMarkerEntity[] = [];
    for(const prodAndFab of req.productNameItemCodeCombinations) {
      const markerEnt = new PoMarkerEntity();
      markerEnt.companyCode = req.companyCode;
      markerEnt.unitCode = req.unitCode;
      markerEnt.poSerial = req.poSerial;
      markerEnt.createdUser = req.username;
      markerEnt.productName = prodAndFab.productName;
      markerEnt.markerName = req.markerName;
      markerEnt.markerLength = req.mLength;
      markerEnt.markerName = req.markerName;
      markerEnt.markerVersion = req.markerVersion;
      markerEnt.remarks1 = req.remarks1;
      markerEnt.remarks2 = req.remarks2;
      markerEnt.clubMarker = isClubMarker;
      markerEnt.markerType = req.markerType;
      markerEnt.markerTypeId = req.markerTypeId.toString();
      markerEnt.clubMarkerCode = isClubMarker ? clubMarkerCode : 0;
      markerEnt.itemCode = prodAndFab.itemCode;
      markerEnt.markerWidth = req.mWidth;
      markerEnt.patVersion = req.patVer;
      markerEnt.endAllowance = req.endAllowance;
      markerEnt.perimeter = req.perimeter;
      markerEnt.fgColor = prodAndFab.fgColor;
      markerEntities.push(markerEnt);
    }
    return markerEntities;
  } 

  /**
   * WRITER
   * @param req 
   * @returns 
   */
  async deletePoMarker(req: MarkerIdRequest): Promise<GlobalResponseObject> {
    let transManager = new GenericTransactionManager(this.dataSource);
    try {
      // check if the marker exist
      if(!req.markerId) {
        throw new ErrorResponse(0, 'Provide the marker id');
      }
      const marker = await this.markerRepo.findOne({ select: ['id', 'poSerial', 'clubMarker', 'clubMarkerCode'], where: {companyCode: req.companyCode, unitCode: req.unitCode, id: req.markerId } });
      if(!marker) {
        throw new ErrorResponse(0, 'Marker version does not exist');
      }
      let markerIds = [marker.id];
      if(marker.clubMarker) {
        // get the marker ids for the club marker
        const markers = await this.markerRepo.find({ select: ['id'], where: { companyCode: req.companyCode, unitCode: req.unitCode, clubMarker: true, clubMarkerCode: marker.clubMarkerCode, poSerial: marker.poSerial } });
        markers.forEach(m => markerIds.push(m.id));
      }
      // TODO
      // check if the ratio is mapped for the marker
      const ratiosMappedForMarker = await this.helperService.getRatiosMappedForPoMarker(marker.poSerial, marker.id, req.companyCode, req.unitCode);
      if(ratiosMappedForMarker.length > 0) {
        throw new ErrorResponse(0, `Marker version is mapped to the ratio : ${ratiosMappedForMarker[0].ratioName}`);
      }
      // also check if the marker is mapped to any of the dockets
      const docketsMappedForMaker: string[] = await this.helperService.getDocketsMappedForPoMarker(marker.poSerial, marker.id, req.companyCode, req.unitCode);
      if(docketsMappedForMaker.length > 0) {
        throw new ErrorResponse(0, `Marker version is mapped to the docket : ${docketsMappedForMaker[0]}`);
      }
      await transManager.startTransaction();
      if(marker.clubMarker) {
        await transManager.getRepository(PoMarkerEntity).delete({ companyCode: req.companyCode, unitCode: req.unitCode, poSerial: marker.poSerial, clubMarkerCode: marker.clubMarkerCode });
      } else {
        await transManager.getRepository(PoMarkerEntity).delete({ id: req.markerId, companyCode: req.companyCode, unitCode: req.unitCode });
      }
      await this.helperService.unSetMarkerIdsForRatios(markerIds, marker.poSerial, req.companyCode, req.unitCode, transManager);
      // set the marker versio in the ratios to 0
      await transManager.completeTransaction();
      return new GlobalResponseObject(true, 0, 'Marker version deleted successfully');
    } catch (error) {
      await transManager.releaseTransaction();
      throw error;
    }
  }

  /**
   * WRITER
   * @param req 
   */
  async setPoMarkerDefault(req: MarkerIdRequest): Promise<GlobalResponseObject> {
    let transManager = new GenericTransactionManager(this.dataSource);
    try {
      const marker = await this.markerRepo.findOne({ where: {companyCode: req.companyCode, unitCode: req.unitCode, id: req.markerId } });
      if(!marker) {
        throw new ErrorResponse(0, 'Marker version does not exist');
      }
      if(marker.defaultMarker) {
        throw new ErrorResponse(0, 'Marker version is already set as default');
      }
      await transManager.startTransaction();
      // unset the current default marker
      await transManager.getRepository(PoMarkerEntity).update({ companyCode: marker.companyCode, unitCode: req.unitCode, productName: marker.productName, itemCode: marker.itemCode }, { defaultMarker: false, updatedUser: req.username});
      // set the current marker as the default
      await transManager.getRepository(PoMarkerEntity).update({ id: marker.id, companyCode: marker.companyCode, unitCode: req.unitCode }, { defaultMarker: true, updatedUser: req.username});
      await transManager.completeTransaction();
      return new GlobalResponseObject(true, 0, 'Default marker saved');
    } catch (err) {
      await transManager.releaseTransaction();
      throw err;
    }
  }
}