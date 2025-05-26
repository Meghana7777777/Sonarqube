import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CommonRequestAttrs, MoversCreateRequest, TrollyCreateRequest, TrollyResponse, TrollyModel, TrollyIdsRequest, GlobalResponseObject, TrollyBarcodesRequest } from '@xpparel/shared-models';
import { LTrollyRepo } from '../../repositories/l-trolly.repository';
import { ErrorResponse } from '@xpparel/backend-utils';
import { In } from 'typeorm';
import { BinsDataService } from '../bins/bins.services';
import { LTrolleyEntity } from '../../entities/l-trolly.entity';
import { TrayTrolleyInfoService } from '../../../tray-trolly/tray-trolley-info.service';
import { TraysService } from '../trays/trays.service';
import { TrolleyBinInfoService } from '../../../tray-trolly/trolley-bin-info.service';

@Injectable()
export class TrolleyService {
  constructor(
    private trollyrepo: LTrollyRepo,
    private binMasterService: BinsDataService,
    @Inject(forwardRef(() => TraysService)) private trayService: TraysService,
    @Inject(forwardRef(() => TrayTrolleyInfoService)) private trayTrolleyInfoService: TrayTrolleyInfoService,
    @Inject(forwardRef(() => TrolleyBinInfoService)) private trolleyBinInfoService: TrolleyBinInfoService,
  ) {

  }

  /**
   * 
   * @param reqModel 
   * @returns 
   */
  async createTrolly(reqModel: TrollyCreateRequest): Promise<TrollyResponse> {
    if (reqModel.code) {
      const findRecord = await this.trollyrepo.findOne({ where: { code: reqModel.code, companyCode: reqModel.companyCode, unitCode: reqModel.unitCode } });
      if (findRecord) {
        throw new ErrorResponse(6173, "Trolly Code already available please check")
      }
    }
    if (reqModel.name) {
      const findRecordByName = await this.trollyrepo.findOne({ where: { name: reqModel.name } });
      if (findRecordByName) {
        throw new Error(`Trolly with name ${reqModel.name} already exists.`);
      }
    }
    if(reqModel.binId) {
      // // check if the bin exist
      // const binRec = await this.binMasterService.getBinRecordById(Number(reqModel.binId), reqModel.companyCode, reqModel.unitCode);
      // if(!binRec) {
      //   throw new ErrorResponse(0, 'Selected bin does not exist');
      // }
    }
    const entity = new LTrolleyEntity();
    entity.name = reqModel.name;
    entity.code=reqModel.code;
    entity.unitCode=reqModel.unitCode;
    entity.capacity=reqModel.capacity;
    entity.binId=reqModel.binId;
    entity.companyCode=reqModel.companyCode;
    entity.uom='NA';
    entity.createdUser=reqModel.username;
    entity.barcode = reqModel.code;
    const saveData = await this.trollyrepo.save(entity);
    const pk = (saveData.id).toString().padStart(5, "0");
    // const newBarcode = 'TRLY-' + pk;
    // update the barcode for the tray
    // await this.trollyrepo.update({ id: saveData.id }, { barcode: newBarcode } );
    const rec = new TrollyModel(saveData.id, saveData.name, saveData.code, saveData.capacity, saveData.uom, saveData.binId, true, [], null, null);
    return new TrollyResponse(true, 6174, `Trolly created successfully`, [rec]);
  }

  async updateTrolly(reqModel: TrollyCreateRequest): Promise<GlobalResponseObject> {
    if(!reqModel.id ){
      throw new ErrorResponse(6175, "Trolly Id not provided")
    }
    const findRecord = await this.trollyrepo.findOne({ where: { id:reqModel.id} });
    if (!findRecord) {
      throw new ErrorResponse(6176, "Trolly Id doesn't exists")
    }
    const updateData=await this.trollyrepo.update({ id: reqModel.id }, { capacity:reqModel.capacity,binId:reqModel.binId,updatedUser:reqModel.username });
    return new GlobalResponseObject(true, 6177, `Trolly Updated successfully`);
  }

  /**
   * 
   * @param reqModel 
   * @returns 
   */
  async activateDeactivateTrollys(reqModel: TrollyIdsRequest): Promise<TrollyResponse> {
    const trollyId = reqModel?.ids[0];
    if(!trollyId) {
      throw new ErrorResponse(6178, 'Please provide the trolly id');
    }
    const trollyRec = await this.trollyrepo.findOne({ where: { id: trollyId } });
    if(!trollyId) {
      throw new ErrorResponse(6179, 'Trolly does not exist');
    }
    // if we are tring to de ativate then check if no roll is present in the trolley
    const traysInTrolley = await this.trayTrolleyInfoService.getTrayIdsMappedForTrolley(trollyId, reqModel.companyCode, reqModel.unitCode);
    if (traysInTrolley.length > 0) {
      throw new ErrorResponse(6180, `${traysInTrolley.length} trays are present in the trolley. Cannot be de-activated`);
    }
    await this.trollyrepo.update(
      { id: In(reqModel.ids) },
      { isActive: trollyRec.isActive == true ? false : true });
    return new TrollyResponse(true, trollyRec.isActive ? 0 : 1, trollyRec.isActive ? 'Trolly de-activated successfully' : 'Trolly activated successfully');
  }

  /**
   * 
   * @param req 
   * @returns 
   */
  async getAllTrollys(req: CommonRequestAttrs): Promise<TrollyResponse> {
    const trolleyRecs = await this.trollyrepo.find({ where: { unitCode: req.unitCode, companyCode: req.companyCode } });
    const resultData: TrollyModel[] = [];
    if (trolleyRecs.length === 0) {
      throw new ErrorResponse(6181, "Trollys not found")
    }
    const trolleyIds = trolleyRecs.map(r => r.id);
    const trollyModels = await this.getTrollysByTrollyIdsInternal(trolleyIds, req.companyCode, req.unitCode, true, false, false);
    return new TrollyResponse(true, 967, 'Data retrieved successfully', trollyModels);
  }


  /**
   * READER
   * ENDPOINT
   * @param req 
   * @returns 
   */
  async getTrollysByTrollyBarcodes(req: TrollyBarcodesRequest): Promise<TrollyResponse> {
    if(!req.barcodes) {
      throw new ErrorResponse(6183, 'Trolley barcodes not provided');
    }
    if(req?.barcodes?.length == 0){
      throw new ErrorResponse(6184, 'Trolley barcodes not provided');
    }
    const trolleyRecs = await this.trollyrepo.find({ select: ['id'], where: { companyCode: req.companyCode, unitCode: req.unitCode, barcode: In(req.barcodes) }});
    if(trolleyRecs.length == 0) {
      throw new ErrorResponse(6185, 'Tolleys not found for the barcodes');
    }
    const trolleyIds = trolleyRecs.map(r => r.id);
    const trollyModels = await this.getTrollysByTrollyIdsInternal(trolleyIds, req.companyCode, req.unitCode, req.iNeedBinInfoAlso, req.iNeedTrayIdsInTrolly, req.iNeedTraysDetailedInfoInTrolly);
    return new TrollyResponse(true, 967, 'Data retrieved successfully', trollyModels);
  }

  /**
   * READER
   * ENDPOINT
   * @param req 
   * @returns 
   */
  async getTrollysByTrollyIds(req: TrollyIdsRequest): Promise<TrollyResponse> {
    if(!req.ids) {
      throw new ErrorResponse(6187, 'Trolley ids not provided');
    }
    if(req?.ids?.length == 0){
      throw new ErrorResponse(6188, 'Trolley ids not provided');
    }
    const trollyModels = await this.getTrollysByTrollyIdsInternal(req.ids, req.companyCode, req.unitCode, req.iNeedBinInfoAlso, req.iNeedTrayIdsInTrolly, req.iNeedTraysDetailedInfoInTrolly);
    return new TrollyResponse(true, 967, 'Data retrieved successfully', trollyModels);
  }

  /**
   * HELPER
   * @param trollyIds 
   * @param companyCode 
   * @param unitCode 
   * @param iNeedBinInfoAlso 
   * @param iNeedTrayIdsInTrolly 
   * @param iNeedTraysDetailedInfoInTrolly 
   * @returns 
   */
  async getTrollysByTrollyIdsInternal(trollyIds: number[], companyCode: string, unitCode: string, iNeedBinInfoAlso: boolean, iNeedTrayIdsInTrolly: boolean, iNeedTraysDetailedInfoInTrolly: boolean): Promise<TrollyModel[]> {
    const trollyModels: TrollyModel[] = [];
    // now get the trollys info
    const trollyRecs = await this.trollyrepo.find({ where: { id: In(trollyIds), companyCode: companyCode, unitCode: unitCode }});
    if(trollyRecs.length == 0) {
      throw new ErrorResponse(6190, 'Trollys does not exist for the provdied ids');
    }
    // get all the bin ids mapped to the trolleys
    
    for(const trolly of trollyRecs) {
      let binInfo = null;
      let trayIds = [];
      if(iNeedBinInfoAlso) {
        const binIds = await this.trolleyBinInfoService.getBinIdsForTrolleyIds([trolly.id], companyCode, unitCode);
        // get the bin info 
        if(binIds.length > 0) {
          const binsInfo = await this.binMasterService.getBinsByIds(binIds, companyCode, unitCode);
          binInfo = binsInfo[0];
        }
      }
      if(iNeedTrayIdsInTrolly) {
        trayIds = await this.trayTrolleyInfoService.getTrayIdsMappedForTrolley(trolly.id, companyCode, unitCode);
      }
      if(iNeedTraysDetailedInfoInTrolly) {
        // TODO: 
      }
      const eachTrolly = new TrollyModel(trolly.id, trolly.name, trolly.code, trolly.capacity, trolly.uom, trolly.binId, trolly.isActive, trayIds, binInfo, trolly.barcode);
      trollyModels.push(eachTrolly);
    }
    return trollyModels;
  }


  /**
   * 
   * @param trollyId 
   * @param companyCode 
   * @param unitCode 
   */
  async getTrollyRecordByTrollyId(trollyId: number, companyCode: string, unitCode: string): Promise<LTrolleyEntity> {
    return await this.trollyrepo.findOne({ where: { id: trollyId, companyCode: companyCode, unitCode: unitCode} });
  }
}


