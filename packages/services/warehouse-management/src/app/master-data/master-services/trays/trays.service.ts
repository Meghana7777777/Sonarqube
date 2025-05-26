import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { ErrorResponse } from '@xpparel/backend-utils';
import { CommonRequestAttrs, GlobalResponseObject, TrayBarcodesRequest, TrayCodesRequest, TrayCreateRequest, TrayIdsRequest, TrayModel, TrayResponse, TrollyModel } from '@xpparel/shared-models';
import { LTrayRepo } from '../../repositories/l-tray.repository';
import { TrolleyService } from '../trollys/trolley.service';
import { In } from 'typeorm';
import { LTrayEntity } from '../../entities/l-tray.entity';
import { TrayRollInfoService } from '../../../tray-trolly/tray-roll-info.service';
import { TrayTrolleyInfoService } from '../../../tray-trolly/tray-trolley-info.service';
@Injectable()
export class TraysService {
  constructor(
    private trayrepo: LTrayRepo,
    @Inject(forwardRef(() => TrolleyService)) private trollyService: TrolleyService,
    @Inject(forwardRef(() => TrayRollInfoService)) private trayRollInfoService: TrayRollInfoService,
    @Inject(forwardRef(() => TrayTrolleyInfoService)) private trayTrolleyInfoService: TrayTrolleyInfoService
  ) {

  }

  /**
   * 
   * @param reqModel 
   * @returns 
   */
  async createTray(reqModel: TrayCreateRequest): Promise<TrayResponse> {
    if (reqModel.code) {
      const findRecord = await this.trayrepo.findOne({ where: { code: reqModel.code } });
      if (findRecord) {
        throw new ErrorResponse(6157, `Trays Code ${reqModel.code} already available please check`)
      }
    }
    if (reqModel.name) {
      const findRecordByName = await this.trayrepo.findOne({ where: { name: reqModel.name } });
      if (findRecordByName) {
        throw new Error(`Tray with name ${reqModel.name} already exists.`);
      }
    }
    // check id the tray is present
    if(reqModel.trollyId) {
      // const trollyRec = await this.trollyService.getTrollyRecordByTrollyId(Number(reqModel.trollyId), reqModel.companyCode, reqModel.unitCode);
      // if(!trollyRec) {
      //   throw new ErrorResponse(0, 'Trolly does not exist');
      // }
    }
    const entity = new LTrayEntity();
    entity.name = reqModel.name;
    entity.code=reqModel.code;
    entity.unitCode=reqModel.unitCode;
    entity.capacity=reqModel.capacity;
    entity.trollyId=reqModel.trollyId;
    entity.companyCode=reqModel.companyCode;
    entity.length=reqModel.length;
    entity.height=reqModel.height;
    entity.width=reqModel.width;
    entity.uom='NA';
    entity.createdUser=reqModel.username;
    entity.barcode = reqModel.code;

    const saveData = await this.trayrepo.save(entity);
    const pk = (saveData.id).toString().padStart(5, "0");
    // const newBarcode = 'TRAY' + pk;
    // update the barcode for the tray
    // await this.trayrepo.update({ id: saveData.id }, { barcode: newBarcode } );
    const rec = new TrayModel(saveData.id, saveData.name, saveData.code, saveData.capacity, saveData.uom, reqModel.trollyId, saveData.length, saveData.width, saveData.height, true, null, null, null);
    return new TrayResponse(true, 6158,`Tray Created successfully`);
  }

  async updateTray(reqModel: TrayCreateRequest): Promise<GlobalResponseObject> {
    if (!reqModel.id) {
      throw new ErrorResponse(6342, `Tray Id not provided`)
    }
    const findRecord = await this.trayrepo.findOne({ where: { id: reqModel.id} });
    if (!findRecord) {
      throw new ErrorResponse(6160, `Tray Id doen't exists`)
    }
    const updateData=await this.trayrepo.update({ id: reqModel.id }, { capacity:reqModel.capacity,trollyId:reqModel.trollyId,length:reqModel.length,height:reqModel.height,width:reqModel.width,updatedUser:reqModel.username });
    return new GlobalResponseObject(true, 6161, `Tray Updated successfully`);
  }


  /**
   * 
   * @param reqModel 
   * @returns 
   */
  async activateDeactivateTray(reqModel: TrayIdsRequest): Promise<GlobalResponseObject> {
    if(!reqModel.ids) {
      throw new ErrorResponse(6342, 'Tray id not provided');
    }
    if(reqModel.ids?.length <= 0) {
      throw new ErrorResponse(6342, 'Tray id not provided');
    }
    const trayId = reqModel.ids[0];
    const trayRecord = await this.trayrepo.findOne({ where: { id: trayId } });
    if(!trayRecord) {
      throw new ErrorResponse(6162, 'Tray does not exist');
    }
    // check if any rolls present in the tray
    const rollIdsInTray = await this.trayRollInfoService.getRollIdsMappedForTray(trayId, reqModel.companyCode, reqModel.unitCode);
    if(rollIdsInTray.length > 0) {
      throw new ErrorResponse(0, `${rollIdsInTray.length} rolls are present in the tray. Cannot be de-activated`);
    }
    await this.trayrepo.update(
      { id: trayId },
      { isActive: trayRecord.isActive == true ? false : true });
    return new GlobalResponseObject(true, trayRecord.isActive ? 0 : 1, trayRecord.isActive ? 'Tray de-activated successfully' : 'Tray activated successfully');
  }

  /**
   * 
   * @param req 
   * @returns 
   */
  async getAllTrays(req: TrayIdsRequest): Promise<TrayResponse> {
    let trays;
    if (req.ids?.length > 0) {
      trays = await this.trayrepo.find({select: ['id'],where: {id: In(req.ids), companyCode: req.companyCode,unitCode: req.unitCode}});
    } else {
      trays = await this.trayrepo.find({select: ['id'],where: {companyCode: req.companyCode,unitCode: req.unitCode}});
    }
    if (trays.length === 0) {
      throw new ErrorResponse(6163, 'Trays do not exist');
    }
    const trayIds = trays.map(r => r.id);
    const trayModels = await this.getTraysByTrayIdsInternal(trayIds,req.companyCode,req.unitCode,req.iNeedTrolleyInfo,false);
  
    return new TrayResponse(true, 967, 'Data Retrieved Successfully', trayModels);
  }
  


  /**
   * READER
   * ENDPOINT
   * @param req 
   */
  async getTraysByTrayBarcodes(req: TrayBarcodesRequest): Promise<TrayResponse> {
    if(!req.barcodes) {
      throw new ErrorResponse(6343, 'Tray barcodes not provided');
    }
    if(req?.barcodes?.length == 0) {
      throw new ErrorResponse(6343, 'Tray barcodes not provided');
    }
    const trayRecs = await this.trayrepo.find({ select: ['id'], where: { companyCode: req.companyCode, unitCode: req.unitCode, barcode: In(req.barcodes) } });
    if(trayRecs.length == 0) {
      throw new ErrorResponse(6165, 'Tray not found for the given barcodes');
    }
    const trayIds = trayRecs.map(r => r.id);
    const trayModels = await this.getTraysByTrayIdsInternal(trayIds, req.companyCode, req.unitCode, req.iNeedTrolleyInfo, req.iNeedRollIdsInTray);
    return new TrayResponse(true, 967, 'Data Retrieved Successfully', trayModels);

  }


  /**
   * NOT USED ATM
   * READER
   * ENDPOINT
   * @param req 
   */
    async getTraysByTrayCodes(req: TrayCodesRequest): Promise<TrayResponse> {
      if(!req.traycodes) {
        throw new ErrorResponse(0, 'Tray traycodes not provided');
      }
      if(req?.traycodes?.length == 0) {
        throw new ErrorResponse(0, 'Tray traycodes not provided');
      }
      const trayRecs = await this.trayrepo.find({ select: ['id'], where: { companyCode: req.companyCode, unitCode: req.unitCode, code: In(req.traycodes) } });
      if(trayRecs.length == 0) {
        throw new ErrorResponse(6167, 'Tray not found for the given traycodes');
      }
      const trayIds = trayRecs.map(r => r.id);
      const trayModels = await this.getTraysByTrayIdsInternal(trayIds, req.companyCode, req.unitCode, req.iNeedTrolleyInfo, req.iNeedRollIdsInTray);
      return new TrayResponse(true, 967, 'Data Retrieved Successfully', trayModels);
    }

  /**
   * READER
   * ENDPOINT
   * @param req 
   * @returns 
   */
  async getTraysByTrayIds(req: TrayIdsRequest): Promise<TrayResponse> {
    if(!req.ids) {
      throw new ErrorResponse(6169, 'Tray ids not provided');
    }
    if(req?.ids?.length == 0) {
      throw new ErrorResponse(6170, 'Tray ids not provided');
    }
    const trayModels = await this.getTraysByTrayIdsInternal(req.ids, req.companyCode, req.unitCode, req.iNeedTrolleyInfo, req.iNeedRollIdsInTray);
    return new TrayResponse(true, 967, 'Data retrieved successfully', trayModels);
  }

  /**
   * HELPER
   * @param trayIds 
   * @param companyCode 
   * @param unitCode 
   * @param iNeedTrolleyInfo 
   * @param iNeedRollIdsInTray 
   * @returns 
   */
  async getTraysByTrayIdsInternal(trayIds: number[], companyCode: string, unitCode: string, iNeedTrolleyInfo: boolean, iNeedRollIdsInTray: boolean): Promise<TrayModel[]> {
    const trayModels: TrayModel[] = [];
    const trays = await this.trayrepo.find({ where: { companyCode: companyCode, unitCode: unitCode, id: In(trayIds) }});
    if(trayIds.length == 0) {
      throw new ErrorResponse(6172, 'No trays exist for the provided ids');
    }
    for(const tray of trays) {
      let trollyInfo: TrollyModel;
      let rollIds: string[] = [];
      if(iNeedTrolleyInfo) {
        const trolleyIds = await this.trayTrolleyInfoService.getTrolleyIdsMappedForTray([tray.id], companyCode, unitCode);
        if(trolleyIds.length > 0) {
          const trollysInfo = await this.trollyService.getTrollysByTrollyIdsInternal(trolleyIds, companyCode, unitCode, false, false, false);
          trollyInfo = trollysInfo[0];
        }
      }
      if(iNeedRollIdsInTray) {
        rollIds = await this.trayRollInfoService.getRollIdsMappedForTray(tray.id, companyCode, unitCode)
      }
      const eachTray = new TrayModel(tray.id, tray.name, tray.code, tray.capacity, tray.uom, tray.trollyId, tray.length, tray.width, tray.height, tray.isActive, trollyInfo, rollIds, tray.barcode);
      trayModels.push(eachTray);      
    }
    return trayModels;
  }
}

  




