import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { DataSource, In } from "typeorm";
import moment = require("moment");
import { PoMarkerHelperService } from "./po-marker-helper.service";
import { PoMarkerRepository } from "./repository/po-ratio-marker.repository";
import { GlobalResponseObject, MarkerIdRequest, MarkerInfoModel, MarkerInfoResponse, PoProdutNameRequest, PoSerialRequest, ProductNameItemsRequest } from "@xpparel/shared-models";
import { ErrorResponse } from "@xpparel/backend-utils";
import { PoMarkerEntity } from "./entity/po-marker.entity";
import { GenericTransactionManager } from "../../database/typeorm-transactions";
import { MarkerTypeEntity } from "../master/marker-type/entity/marker-type.entity";
@Injectable()
export class PoMarkerInfoService {
  constructor(
    private dataSource: DataSource,
    @Inject(forwardRef(() => PoMarkerHelperService)) private helperService: PoMarkerHelperService,
    private markerRepo: PoMarkerRepository

  ) {

  }

  /**
   * READER
   * @param req 
   */
  async getPoMarker(req: MarkerIdRequest): Promise<MarkerInfoResponse> {
    const marker = await this.markerRepo.findOne({ where: {companyCode: req.companyCode, unitCode: req.unitCode, id: req.markerId } });
    if(!marker) {
      throw new ErrorResponse(0, 'Marker version does not exist');
    }
    // get the clubbed marker ids
    let clubbedMarkerIdsForClubCode = [];
    if(marker.clubMarker) {
      // get the clubbed marker ids
      clubbedMarkerIdsForClubCode = await this.getMarkerIdsForClubbedMarkerCode(marker.poSerial, marker.clubMarkerCode, req.companyCode, req.unitCode);
    }
    const markerModel = new MarkerInfoModel(marker.id, marker.poSerial, marker.productName, marker.fgColor, marker.itemCode, marker.markerName, marker.markerVersion, marker.markerLength, marker.markerWidth, marker.patVersion, marker.remarks1, marker.remarks2, marker.markerType, marker.markerTypeId, marker.clubMarker, marker.defaultMarker, clubbedMarkerIdsForClubCode, marker.endAllowance, marker.perimeter);
    return new MarkerInfoResponse(true, 0 , 'Marker retrieved', [markerModel]);
  }  

  /**
   * READER
   * @param req 
   */
  async getPoMarkers(req: PoProdutNameRequest): Promise<MarkerInfoResponse> {
    let markers: PoMarkerEntity[] = [];
    let clubbedMarkerIdsForClubCode = [];
    if(req.productName) {
      markers = await this.markerRepo.find({ where: {companyCode: req.companyCode, unitCode: req.unitCode, poSerial: req.poSerial, productName: req.productName } });
    } else {
      markers = await this.markerRepo.find({ where: {companyCode: req.companyCode, unitCode: req.unitCode, poSerial: req.poSerial } });
    }
    if(markers.length == 0) {
      throw new ErrorResponse(0, 'Marker version does not exist');
    }
    const markerInfoModel: MarkerInfoModel[] = [];
    for(const marker of markers) {
      let clubbedMarkerIdsForClubCode = [];
      if(marker.clubMarker) {
        // get the clubbed marker ids
        clubbedMarkerIdsForClubCode = await this.getMarkerIdsForClubbedMarkerCode(marker.poSerial, marker.clubMarkerCode, req.companyCode, req.unitCode);
      }
      const markerModel = new MarkerInfoModel(marker.id, marker.poSerial, marker.productName, marker.fgColor, marker.itemCode, marker.markerName, marker.markerVersion, marker.markerLength, marker.markerWidth, marker.patVersion, marker.remarks1, marker.remarks2, marker.markerType, marker.markerTypeId, marker.clubMarker, marker.defaultMarker, clubbedMarkerIdsForClubCode, marker.endAllowance, marker.perimeter);
      markerInfoModel.push(markerModel);
    }
    return new MarkerInfoResponse(true, 0 , 'Marker retrieved', markerInfoModel);
  }

  /**
   * 
   * @param req 
   * @returns 
   */
  async getPoMarkersByProdNameAndFabComb(req: ProductNameItemsRequest): Promise<MarkerInfoResponse> {
    const prodNames = [];
    const items = [];
    const prodNameItemKeysSet = new Set<string>();
    const fgColors = [];
    req.prodNameItems?.forEach(r => {
      prodNames.push(r.productName);
      items.push(r.itemCode);
      fgColors.push(r.fgColor)
      prodNameItemKeysSet.add(r.productName+'@@'+r.itemCode+'@@'+r.fgColor);
    });
    if(prodNames.length == 0 || items.length == 0) {
      throw new ErrorResponse(0, 'Product names and item codes are mandatory');
    }
    const iNeedClubMarkers = prodNames.length > 1 || items.length > 1 || fgColors.length > 1;
    console.log(prodNames, items, fgColors)
    const markers = await this.markerRepo.find({ where: { poSerial: req.poSerial, productName: In(prodNames), itemCode: In(items), fgColor: In(fgColors), companyCode: req.companyCode, unitCode: req.unitCode, isActive: true}});
    if(markers.length == 0) {
      throw new ErrorResponse(0, 'Markers not found');
    }
    const eligibleMarkerIds: number[] = [];
    const markerInfoModel: MarkerInfoModel[] = [];
    if(iNeedClubMarkers) {
      // check if the club marker code has all the prod and fabs as requesting from the UI
      const clubMarkerCombs = new Map<number, {prodName: string, fgColor: string, itemCode: string, id: number}[]>(); // a map of clubMarkerCode => prodName, item combs
      markers.forEach(m => {
        if(m.clubMarker) {
          if(!clubMarkerCombs.has(m.clubMarkerCode)) {
            clubMarkerCombs.set(m.clubMarkerCode, []);
          }
          clubMarkerCombs.get(m.clubMarkerCode).push({ prodName: m.productName, fgColor: m.fgColor, itemCode: m.itemCode, id: m.id});
        }
      });
      console.log('------------')
      console.log(clubMarkerCombs);
      console.log('------------')
      // now iterate every club marker code and filter the matching ones
      clubMarkerCombs.forEach((combs, code) => {
        let match = 0;
        combs.forEach(c => {
          if(prodNameItemKeysSet.has(c.prodName+'@@'+c.itemCode+'@@'+c.fgColor)) {
            match++;
          }
        });
        // if the matching is set, then push the id to the response list
        if(match == prodNameItemKeysSet.size && match == combs.length) {
          eligibleMarkerIds.push(combs[0].id);
        }
      });
    } else {
      for(const marker of markers) {
        // skip the club markers because the input is only for a single prod and fabric
        if(marker.clubMarker) {
          continue;
        }
        eligibleMarkerIds.push(marker.id);
      }
    }
    if(eligibleMarkerIds.length == 0) {
      throw new ErrorResponse(0, 'Markers were not yet created for the combination')
    }

    for(const marker of markers) {
      if(!eligibleMarkerIds.includes(marker.id)) {
        continue;
      }
      let clubbedMarkerIdsForClubCode = [];
      if(marker.clubMarker) {
        // get the clubbed marker ids
        clubbedMarkerIdsForClubCode = await this.getMarkerIdsForClubbedMarkerCode(marker.poSerial, marker.clubMarkerCode, req.companyCode, req.unitCode);
      }
      // return all the pending markers matching the prod name and the fabric
      const markerModel = new MarkerInfoModel(marker.id, marker.poSerial, marker.productName, marker.fgColor, marker.itemCode, marker.markerName, marker.markerVersion, marker.markerLength, marker.markerWidth, marker.patVersion, marker.remarks1, marker.remarks2, marker.markerType, marker.markerTypeId, marker.clubMarker, marker.defaultMarker,clubbedMarkerIdsForClubCode, marker.endAllowance, marker.perimeter);
      markerInfoModel.push(markerModel);
    }
    return new MarkerInfoResponse(true, 0 , 'Markers retrieved', markerInfoModel);
  }

  async getMarkerInfoByMarkerId(markerId: number, companyCode: string, unitCode: string): Promise<PoMarkerEntity> {
    return await this.markerRepo.findOne({ where: { id: markerId, unitCode: unitCode, companyCode: companyCode}});
  }

  async getClubMarkerInfoByMarkerId(poSerial: number, markerId: number, clubMarkerCode: number, companyCode: string, unitCode: string): Promise<PoMarkerEntity[]> {
    return await this.markerRepo.find({ where: { unitCode: unitCode, companyCode: companyCode, poSerial: poSerial, clubMarker: true, clubMarkerCode: clubMarkerCode }});
  }

  async getMarkerIdsForClubbedMarkerCode(poSerial: number, clubMarkerCode: number, companyCode: string, unitCode: string): Promise<number[]> {
    const recs = await this.markerRepo.find({select:['id'], where: {poSerial: poSerial, companyCode: companyCode, unitCode: unitCode, clubMarkerCode: clubMarkerCode, clubMarker: true} });
    return recs.map(m => m.id);
  }
}