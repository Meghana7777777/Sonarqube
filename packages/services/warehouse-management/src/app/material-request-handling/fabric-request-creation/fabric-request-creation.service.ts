import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { DataSource, } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { GrnService } from '../../grn/grn.service';
import { FabricRequestCreationInfoService } from './fabric-request-creation-info.service';
import { GlobalResponseObject, MaterialRequestNoRequest, WhExtReqNoRequest, WhReqByObjectEnum, WhReqCreateHeaderModel, WhReqCreateHeaderResponse, WhMatReqLineItemStatusEnum, WhMatReqLineStatusEnum, MaterialDestinationTypeEnum } from '@xpparel/shared-models';
import { WhRequestLineItemRepo } from '../repositories/wh-request-line-item.repository';
import { WhRequestLineRepo } from '../repositories/wh-request-line.repository';
import { WhRequestHeaderRepo } from '../repositories/wh-request-header.repository';
import { ErrorResponse } from '@xpparel/backend-utils';
import { WhMatRequestHeaderEntity } from '../entities/wh-mat-request-header.entity';
import { GenericTransactionManager } from '../../../database/typeorm-transactions';
import { WhMatRequestLineEntity } from '../entities/wh-mat-request-line.entity';
import { WhMatRequestLineItemEntity } from '../entities/wh-mat-request-line-item.entity';
import { FabricRequestCreationHelperService } from './fabric-request-creation-helper.service';
import { DocketMaterialServices } from '@xpparel/shared-services';

@Injectable()
export class FabricRequestCreationService {
  constructor(
    private dataSource: DataSource,
    private infoService: FabricRequestCreationInfoService,
    @Inject(forwardRef(() => FabricRequestCreationHelperService)) private helperService: FabricRequestCreationHelperService,
    private whHeaderRepo: WhRequestHeaderRepo,
    private whLineRepo: WhRequestLineRepo,
    private whLineItemRepo: WhRequestLineItemRepo,
    @Inject(forwardRef(() => GrnService)) private grnService: GrnService,
    @InjectDataSource() private datasource: DataSource,
    private docMaterialService: DocketMaterialServices
  ) {

  }

  /**
   * WRITER
   * ENDPOINT
   * This will be trigger as a user action from the CTD WH
   * This will create the fabric WH request
   * @param req 
   */
  async createFabricWhRequestByExtReqNo(req: MaterialRequestNoRequest): Promise<GlobalResponseObject> {
    let transManager = new GenericTransactionManager(this.dataSource);
    try {
      console.log(req);
      // get the request info from the CPS
      const reqInfo: WhReqCreateHeaderResponse = await this.docMaterialService.getDocketMaterialsForWhReqCreation(req);
      if(!reqInfo.status) {
        throw new ErrorResponse(0, reqInfo.internalMessage);
      }
      await this.createFabricWhRequest(reqInfo.data[0], req.companyCode, req.unitCode, req.username);
      return new GlobalResponseObject(true, 6198, 'Warehouse request created');
    } catch (err) {
      // await transManager.releaseTransaction();
      throw err;
    }
  }

  /**
   * WRITER
   * HELPER
   * called by createFabricWhRequestByExtReqNo
   * @param req 
   * @param companyCode 
   * @param unitCode 
   * @param username 
   * @returns 
   */
  async createFabricWhRequest(req: WhReqCreateHeaderModel, companyCode: string, unitCode: string, username: string): Promise<GlobalResponseObject> {
    let transManager = new GenericTransactionManager(this.dataSource);
    try {
      // check if the request is already created
      if(!req.id || !req.requestNo) {
        throw new ErrorResponse(6199, `Request is missing id: ${req.id} and reqNo: ${req.requestNo} `);
      }
      const whRec = await this.whHeaderRepo.findOne({ select: ['id'], where: { extRefId: req.id, extReqNo: req.requestNo, companyCode: companyCode, unitCode: unitCode }});
      if(whRec) {
        throw new ErrorResponse(6200, `Request is already created for id: ${req.id} and reqNo: ${req.requestNo} `);
      }

      // check if the requesting roll ids are exiting in the WH
      const itemIds: number[] = [];
      req.reqLines.forEach(l => l.reqInventoryList.forEach(i => itemIds.push(i.inventoryId)));
      const rollsInfo = await this.helperService.getRollDetailsForRollIds(itemIds, companyCode, unitCode);
      if(rollsInfo.length != itemIds.length) {
        throw new ErrorResponse(6201, `Provided item count : ${itemIds.length}. Existing inventory count: ${rollsInfo.length}`);
      }
      // now exactly check if the rollId and barcode are matching with each other
      const rollIdBarcodeMap = new Map<number, string>();
      rollsInfo.forEach(r => rollIdBarcodeMap.set(r.rollId, r.barcode));
      req.reqLines.forEach(l => l.reqInventoryList.forEach(i => {
        if(i.barcode != rollIdBarcodeMap.get(Number(i.inventoryId))) {
          throw new ErrorResponse(6202, `Id and Barcode not macthed for input. id: ${i.inventoryId} and barcode: ${i.barcode}`);
        }
      }));

      await transManager.startTransaction();

      // create the WH req and lines and line items
      const whHeaderEnt = new WhMatRequestHeaderEntity();
      whHeaderEnt.companyCode = companyCode;
      whHeaderEnt.unitCode = unitCode;
      whHeaderEnt.createdUser = username;
      whHeaderEnt.fulfillWithin = req.fulfillByDateTime;
      whHeaderEnt.extRefEntityType = WhReqByObjectEnum.DOCKET;
      whHeaderEnt.extRefId = req.id; // PK of the po-material-request
      whHeaderEnt.extReqNo = req.requestNo;
      whHeaderEnt.materialReqOn = req.materialRequestedOn;
      whHeaderEnt.materialReqBy = req.requestedBy;
      // lock and generate the request number
      whHeaderEnt.whReqNo = req.requestNo;
      whHeaderEnt.moNumber = req.requestNo; //TODO
      const savedWhHeader = await transManager.getRepository(WhMatRequestHeaderEntity).save(whHeaderEnt);
      const whHeaderId = savedWhHeader.id;

      for(const line of req.reqLines) {
        const whLineEnt = new WhMatRequestLineEntity();
        whLineEnt.companyCode = companyCode;
        whLineEnt.unitCode = unitCode;
        whLineEnt.createdUser = username;
        whLineEnt.jobNumber = line.jobNumber; // the docket group
        whLineEnt.extRefLineId = line.id;
        whLineEnt.reqLineStatus = WhMatReqLineStatusEnum.OPEN;
        whLineEnt.matDestinationType = MaterialDestinationTypeEnum.CUT_TABLE;
        whLineEnt.matDestinationId = req.requestedResourceId;
        whLineEnt.matDestinationDesc = req.requestedResourceDesc;
        whLineEnt.whRequestHeaderId = whHeaderId; // assing the Rek key
        const savedWhLine = await transManager.getRepository(WhMatRequestLineEntity).save(whLineEnt);
        const whLineId = savedWhLine.id;

        const whItemEntities: WhMatRequestLineItemEntity[] = [];
        for(const item of line.reqInventoryList) {
          const whItemEnt = new WhMatRequestLineItemEntity();
          whItemEnt.companyCode = companyCode;
          whItemEnt.unitCode = unitCode;
          whItemEnt.createdUser = username;
          whItemEnt.itemBarcode = item.barcode; // roll barcode
          whItemEnt.itemId = item.inventoryId; // roll id
          whItemEnt.reqLineItemStatus =  WhMatReqLineItemStatusEnum.OPEN;
          whItemEnt.reqQuantity = item.reqQty;
          whItemEnt.whRequestHeaderId = whHeaderId; // assing the Rek key
          whItemEnt.whRequestLineId = whLineId; // assing the Rek key
          whItemEnt.issuedQuantity = 0
          whItemEntities.push(whItemEnt);
        }
        await transManager.getRepository(WhMatRequestLineItemEntity).save(whItemEntities, { reload: false});
      }
      await transManager.completeTransaction();
      return new GlobalResponseObject(true, 6203, 'WH request created');
    } catch (err) {
      await transManager.releaseTransaction();
      throw err;
    }
  }
  
  /**
   * WERITER
   * ENDPOINT
   * @param req 
   * @returns 
   */
  async deleteFabricWhRequest(req: WhExtReqNoRequest): Promise<GlobalResponseObject> {
    let transManager = new GenericTransactionManager(this.dataSource);
    try {
      if(!req.extReqNo) {
        throw new ErrorResponse(6204, 'External request number is not provided');
      }
      const whRec = await this.whHeaderRepo.findOne({ select: ['id'], where: { extReqNo: req.extReqNo, companyCode: req.companyCode, unitCode: req.unitCode, extRefEntityType: req.reqEntity }});
      if(!whRec) {
        throw new ErrorResponse(6205, `Request is not existing for reqNo: ${req.extReqNo} `);
      }
      // cross check the validations before deleting
      
      await transManager.startTransaction();
      await transManager.getRepository(WhMatRequestHeaderEntity).delete({ companyCode: req.companyCode, unitCode: req.unitCode, id: whRec.id });
      await transManager.getRepository(WhMatRequestLineEntity).delete({ companyCode: req.companyCode, unitCode: req.unitCode, whRequestHeaderId: whRec.id });
      await transManager.getRepository(WhMatRequestLineItemEntity).delete({ companyCode: req.companyCode, unitCode: req.unitCode, whRequestHeaderId: whRec.id });
      await transManager.completeTransaction();

      return new GlobalResponseObject(true, 6206 , 'WH request deleted');
    } catch(err) {
      await transManager.releaseTransaction();
      throw err;
    }
  }
}
