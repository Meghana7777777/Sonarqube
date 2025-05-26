import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { ErrorResponse } from '@xpparel/backend-utils';
import { FabIssuingEntityEnum, GlobalResponseObject, MaterialConsumptionEnum, PalletRollMappingRequest, RollIdConsumedQtyRequest, RollIdRequest, StockConsumptionRequest } from '@xpparel/shared-models';
import { DataSource, } from 'typeorm';
import { PhItemLinesRepo } from './repository/ph-item-lines.repository';

import { GenericTransactionManager } from '../../database/typeorm-transactions';
import { LcoationMappingHelperService } from '../location-allocation/location-mapping-helper.service';
import { RollPalletMappingService } from '../location-allocation/roll-pallet-mapping.service';
import { TrayRollMappingService } from '../tray-trolly/tray-roll-mapping.service';
import { PhItemLinesAIEntity } from './entities/ph-item-lines-ai.entity';
import { PhItemLinesConEntity } from './entities/ph-item-lines-con.entity';
import { PhItemLinesEntity } from './entities/ph-item-lines.entity';
import { PhItemIssuanceRepo } from './repository/ph-item-issuance.repository';
import { PhItemLinesConRepo } from './repository/ph-item-lines-con.repository';
import { PhItemIssuanceEntity } from './entities/ph-item-issuance.entity';

@Injectable()
export class StockConsumptionService {
  constructor(
    private dataSource: DataSource,
    private phItemLineConsRepo: PhItemLinesConRepo,
    private phItemLineRepo: PhItemLinesRepo,
    private phItemIssuance: PhItemIssuanceRepo,
    private locAllocHelper: LcoationMappingHelperService,
    @Inject(forwardRef(() => RollPalletMappingService)) private rollPalletMappinService: RollPalletMappingService,
    @Inject(forwardRef(() => TrayRollMappingService)) private trayRollMapService: TrayRollMappingService
  ) {
    // this.phRepo = dataSource.getCustomRepository(PackingListRepo);
  }


  /**
   * WRITER
   * ENDPOINT
   * Called after the stock is consumed by the docket during the cut reporting
   * @param req 
   * @returns 
   */
  async updateTheConsumedStock(req: StockConsumptionRequest): Promise<GlobalResponseObject> {
    const transManager = new GenericTransactionManager(this.dataSource);
    try {
      console.log(req);
      await transManager.startTransaction();
      // check if the incoming stock updation request is already updated
      const items = req.consumedStock;
      for(const item of items) {
        const itemRec = await transManager.getRepository(PhItemLinesEntity).findOne({ select: ['id'], where: { id: item.itemId, barcode: item.itemBarcode, isActive: true}});
        if(!itemRec) {
          throw new ErrorResponse(6245, `The item : ${item.itemBarcode} for the id : ${item.itemId} does not exist`);
        }
        const consRec = await transManager.getRepository(PhItemLinesConEntity).findOne({ where: { companyCode: req.companyCode, unitCode: req.unitCode, phItemId: item.itemId, barcode: item.itemBarcode, jobRef: item.jobRef, jobActualRef:item.jobActualRef, refTransactionId: item.refTransactionId.toString() }});
        if(!consRec) {
          // create the consumption record
          const phItemLineConsEnt = new PhItemLinesConEntity();
          phItemLineConsEnt.companyCode = req.companyCode;
          phItemLineConsEnt.unitCode = req.unitCode;
          phItemLineConsEnt.createdUser = req.username;
          phItemLineConsEnt.consumedOn = item.consumedOn;
          phItemLineConsEnt.consumedQty = item.consumedQty;
          phItemLineConsEnt.barcode = item.itemBarcode;
          phItemLineConsEnt.phItemId = item.itemId;
          phItemLineConsEnt.jobRef = item.jobRef;
          phItemLineConsEnt.jobActualRef = item.jobActualRef;
          phItemLineConsEnt.refTransactionId = item.refTransactionId.toString();
          // save the record
          await transManager.getRepository(PhItemLinesConEntity).save(phItemLineConsEnt, {reload: false});
          // update the cons qty in the ph item lines
          // await transManager.getRepository(PhItemLinesEntity).update({id: item.itemId, barcode: item.itemBarcode}, { issuedQuantity: ()=>`issued_quantity + ${Number(item.consumedQty)}`});
        }
      }
      await transManager.completeTransaction();
      return new GlobalResponseObject(true, 6246, 'Stock consumption updated Successfully');
    } catch (error) {
      await transManager.releaseTransaction();
      throw error;
    }
  }

  /**
   * WRITER
   * ENDPOINT
   * Called after the stock is allocated by the docket during the material allocation
   * @param req 
   * @returns 
   */
  async updateTheAllocatedStock(req: RollIdConsumedQtyRequest): Promise<GlobalResponseObject> {
    const transManager = new GenericTransactionManager(this.dataSource);
    try {
      await transManager.startTransaction();
      const itemRec = await transManager.getRepository(PhItemLinesEntity).findOne({ select: ['id', 'barcode'], where: { id: req.rollId, isActive: true, unitCode: req.unitCode, companyCode: req.companyCode}});
      if (!itemRec) {
        throw new ErrorResponse(6247, `The roll : ${req.rollId} does not exist`);
      }
      // create the consumption record
      const phItemLineConsAIEnt = new PhItemLinesAIEntity();
      phItemLineConsAIEnt.companyCode = req.companyCode;
      phItemLineConsAIEnt.unitCode = req.unitCode;
      phItemLineConsAIEnt.createdUser = req.username;
      phItemLineConsAIEnt.consumedOn = req.consumedOn;
      phItemLineConsAIEnt.quantity = req.tillQty;
      phItemLineConsAIEnt.barcode = itemRec.barcode;
      phItemLineConsAIEnt.phItemId = req.rollId;
      phItemLineConsAIEnt.consumptionType = MaterialConsumptionEnum.ALLOCATED_QUANTITY;
      phItemLineConsAIEnt.requestNumber = req.requestNumber;
      phItemLineConsAIEnt.requestType = req.requestType;
      // save the record
      await transManager.getRepository(PhItemLinesAIEntity).save(phItemLineConsAIEnt, { reload: false });
      // update the cons qty in the ph item lines
      await transManager.getRepository(PhItemLinesEntity).update({id: req.rollId, isActive: true, unitCode: req.unitCode, companyCode: req.companyCode}, {allocatedQuantity: req.tillQty});
      await transManager.completeTransaction();
      return new GlobalResponseObject(true, 6246, 'Stock consumption updated Successfully');
    } catch (error) {
      await transManager.releaseTransaction();
      throw error;
    }
  }

  /**
   * WRITER
   * ENDPOINT RollIdsConsumptionRequest
   * Called after the stock is allocated by the docket during the material allocation
   * @param req 
   * @returns 
   */
  async updateTheIssuedStock(req: RollIdConsumedQtyRequest): Promise<GlobalResponseObject> {
    const transManager = new GenericTransactionManager(this.dataSource);
    try {     
      const itemRec = await this.phItemLineRepo.findOne({ select: ['id','barcode','issuedQuantity','inputQuantity'], where: { id: req.rollId, isActive: true, unitCode: req.unitCode, companyCode: req.companyCode}});
      if (!itemRec) {
        throw new ErrorResponse(6247, `The roll : ${req.rollId} does not exist`);
      }
        const manualIssuanceQtyDetail = await this.phItemIssuance.find({select: ['issuedQuantity'], where: {phItemLineId: req.rollId, unitCode: req.unitCode, companyCode: req.companyCode, isActive: true,  issuingEntity : FabIssuingEntityEnum.MANUAL}});
        const manualIssuedQty = manualIssuanceQtyDetail.reduce((preQty, currentQty) => {
          return preQty + Number(currentQty.issuedQuantity)
        }, 0)
      // create the consumption record
      const phItemLineConsAIEnt = new PhItemLinesAIEntity();
      phItemLineConsAIEnt.companyCode = req.companyCode;
      phItemLineConsAIEnt.unitCode = req.unitCode;
      phItemLineConsAIEnt.createdUser = req.username;
      phItemLineConsAIEnt.consumedOn = req.consumedOn;
      phItemLineConsAIEnt.quantity = req.requestRollQuantity;
      phItemLineConsAIEnt.barcode = itemRec.barcode;
      phItemLineConsAIEnt.phItemId = req.rollId;
      phItemLineConsAIEnt.consumptionType = MaterialConsumptionEnum.ISSUED_QUANTITY;
      phItemLineConsAIEnt.requestNumber = req.requestNumber;
      phItemLineConsAIEnt.requestType = req.requestType;
      // save the record
      await transManager.startTransaction();
      await transManager.getRepository(PhItemLinesAIEntity).save(phItemLineConsAIEnt, { reload: false });
      
      // update the cons qty in the ph item lines
      await transManager.getRepository(PhItemLinesEntity).update({id: req.rollId, isActive: true, unitCode: req.unitCode, companyCode: req.companyCode}, {issuedQuantity: (req.tillQty + manualIssuedQty)});
      

      // inserting phItemIssuacnce Table
      const issuanceTable = new PhItemIssuanceEntity();
      issuanceTable.companyCode = req.companyCode;
      issuanceTable.createdUser = req.username;
      issuanceTable.unitCode = req.unitCode;
      issuanceTable.phItemLineId = req.rollId;
      issuanceTable.issuedQuantity = req.requestRollQuantity;
      issuanceTable.remarks = 'Dashboard';
      issuanceTable.issuingEntity= FabIssuingEntityEnum.PROCESS;
      issuanceTable.extRequestNo= req.requestNumber;
      issuanceTable.requestType= req.requestType;
      await transManager.getRepository(PhItemIssuanceEntity).save(issuanceTable, { reload: false });
      /**Unmapping while updating issuance */ 
      const totalissuedQuantity= (Number(req.tillQty) + Number(manualIssuedQty)).toFixed(2); 
      if(Number(totalissuedQuantity) == Number(itemRec.inputQuantity)) {
          // Once after the issuance, if the roll qty is no more, then de-allocate the roll from the pallet
          // de-allocate the pallet to the roll
          const rollInfo = new RollIdRequest(req.username, req.unitCode, req.companyCode, req.userId, req.rollId, null);
          const deAllocReq = new PalletRollMappingRequest(req.username, req.unitCode, req.companyCode, req.userId, null, null, false, null, null, [rollInfo], false);
          await this.rollPalletMappinService.deAllocateRollsToPalletatIssuance(deAllocReq, null, false, transManager);
          // deallocate the roll from the tray if exist
          await this.trayRollMapService.unmapRollFromTrayInternal(req.rollId, req.companyCode, req.unitCode, req.username, transManager);
      }
      /**Unmapping while updating issuance */ 

       
      await transManager.completeTransaction();
      return new GlobalResponseObject(true, 6246, 'Stock consumption updated Successfully');
    } catch (error) {
      await transManager.releaseTransaction();
      throw error;
    }
  }



}
