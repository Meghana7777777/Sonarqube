import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { ErrorResponse } from '@xpparel/backend-utils';
import { ActualRollInfoModel, CurrentPalletLocationEnum, GlobalResponseObject, GrnRollInfoModel, GrnRollInfoResponse, GrnStatusEnum, MaterialConsumptionEnum, PalletDetailsModel, PalletGroupTypeEnum, PhLinesGrnStatusEnum, PoNumberRequest, ProductInfoResp, RollBasicInfoModel, RollIdRequest, RollIdsRequest, RollInfoModel } from '@xpparel/shared-models';
import { DataSource, In, Not } from 'typeorm';
import { GenericTransactionManager } from '../../database/typeorm-transactions';
import { GrnService } from '../grn/grn.service';
import { PalletGroupInfoService } from '../location-allocation/pallet-group-info.service';
import { PalletsDataService } from '../master-data/master-services/pallets/pallets.service';
import { TrayRollInfoService } from '../tray-trolly/tray-roll-info.service';
import { PackingListEntity } from './entities/packing-list.entity';
import { PhItemLinesActualEntity } from './entities/ph-item-lines-actual.entity';
import { PhItemLinesEntity } from './entities/ph-item-lines.entity';
import { PhItemsEntity } from './entities/ph-items.entity';
import { PackingListRepo } from './repository/packing-list.repository';
import { PhItemLinesActualRepo } from './repository/ph-item-lines-actual.repository';
import { PhItemLinesAiRepo } from './repository/ph-item-lines-ai.repository';
import { PhItemLinesRepo } from './repository/ph-item-lines.repository';
import { PhItemsRepo } from './repository/ph-items.repository';
import { GrnInfoQryResp } from './repository/query-response/grn-info.qry.response';
import { SupplierAndPLQryResp } from './repository/query-response/supplier-pl-info.qry.resp';
import { InsConfigItemRepo } from '../wms-inspection-config/repositories/ins-config-item.repository';
import { InsConfigItemsEntity } from '../wms-inspection-config/entities/ins-header-config-items';
const util = require('util');

@Injectable()
export class PackingListInfoService {

  constructor(
    private dataSource: DataSource,
    private phItemLinesRepo: PhItemLinesRepo,
    @Inject(forwardRef(() => GrnService)) private grnService: GrnService,
    private phItemsRepo: PhItemsRepo,
    private phItemLinesActualRepo: PhItemLinesActualRepo,
    private phRepo: PackingListRepo,
    private phItemRepo: PhItemsRepo,
    private pgInfoService: PalletGroupInfoService,
    private palletService: PalletsDataService,
    private packingListRepo: PackingListRepo,
    private trayRollInfoService: TrayRollInfoService,
    private phItemLinesAiRepo: PhItemLinesAiRepo,
    private insConfigItemRepo: InsConfigItemRepo,
  ) {
    //
  }

  // HELPER
  // READER
  async getPackListRecordForPackListId(phId: number): Promise<PackingListEntity> {
    const packRec = await this.phRepo.findOne({ where: { id: phId, isActive: true } });
    if (!packRec) {
      throw new ErrorResponse(0, 'Pack list does not exist');
    }
    return packRec;
  }

  // HELPER
  // READER
  async getPackListItemRecordForPhItemIId(phItemId: number): Promise<PhItemsEntity> {
    const packItemRec = await this.phItemRepo.findOne({ where: { id: phItemId, isActive: true } });
    if (!packItemRec) {
      throw new ErrorResponse(0, 'Pack list item does not exist');
    }
    return packItemRec;
  }

  // HELPER
  // READER
  async getRollRecordForRollId(rollId: number): Promise<PhItemLinesEntity> {
    const rollRec = await this.phItemLinesRepo.findOne({ where: { id: rollId, isActive: true } });
    if (!rollRec) {
      throw new ErrorResponse(0, 'Object does not exist');
    }
    return rollRec;
  }

  async getRollIdsByBarcodes(barcodes: string[], uniCode: string, companyCode: string): Promise<number[]> {
    return await this.phItemLinesRepo.getRollIdsByBarcodes(barcodes, uniCode, companyCode);
  }

  async getRollIdBarcodesMap(barcodes: string[], uniCode: string, companyCode: string): Promise<Map<string, number>> {
    return await this.phItemLinesRepo.getRollIdBarcodesMap(barcodes, uniCode, companyCode);
  }

  // HELPER
  // READER
  async getRollRecordForRollIds(rollIds: number[]): Promise<PhItemLinesEntity[]> {
    const rollRecs = await this.phItemLinesRepo.find({ where: { id: In(rollIds), isActive: true } });
    return rollRecs;
  }

  // HELPER
  async getRollsBasicInfoForRollIds(companyCode: string, unitCode: string, rollIds: number[]): Promise<RollBasicInfoModel[]> {
    const rolls = await this.phItemLinesRepo.find({ select: ['id', 'barcode', 'inputWidth', 'issuedQuantity', 'inspectionPick', 'grnStatus', 'printStatus', 'inputWidthUom', 'phId', 'inputQuantity', 'sShade', 'sQuantity', 'sWidth', 'grnDate', 'inputQuantityUom', 'measuredWidth', 'measuredWeight', 'allocatedQuantity', 'objectExtNumber', 'inspectionStatus'], where: { companyCode: companyCode, unitCode: unitCode, id: In(rollIds) }, relations: ['phItemId', 'phItemId.phLinesId'] });

    const itemLinesIds = rolls.map(r => r.id);
    // addd required from select
    const actualRollsRecords = await this.phItemLinesActualRepo.find({ select: ['aShade', 'phItemLinesId', 'aWidth'], where: { companyCode: companyCode, unitCode: unitCode, phItemLinesId: In(itemLinesIds) } });
    const actualRollInfoMap = new Map<number, PhItemLinesActualEntity>();
    actualRollsRecords.forEach(r => actualRollInfoMap.set(r.phItemLinesId, r));
    const rollsInfo: RollBasicInfoModel[] = [];
    const insRollIds = rolls.map(rec => rec.id)
    const isInsRollOrNot = await this.dataSource.getRepository(InsConfigItemsEntity).find({ select: ['insItemId', 'insItemBarcode'], where: { insItemId: In(insRollIds) } })
    const insBarcodes = isInsRollOrNot.map(rec => rec.insItemBarcode)
    for (const r of rolls) {
      const actualRollProps = actualRollInfoMap.get(r.id);
      const batchInfo = r.phItemId.phLinesId;
      const remQty = Number(r.inputQuantity) - Number(r.issuedQuantity);
      rollsInfo.push(new RollBasicInfoModel(r.id, insBarcodes.includes(r.barcode), r.barcode, r.phId, r.inputQuantity, remQty, batchInfo.id, batchInfo.batchNumber, batchInfo.lotNumber, r.inputWidth?.toString(), r.issuedQuantity, r.inputQuantity, r.sShade, r.sSkGroup, r.phItemId.itemCode, r.phItemId.itemDescription, actualRollProps?.aShade, r.sWidth, r.sQuantity, r.grnDate, r.inputQuantityUom, r.inputWidthUom, r.measuredWidth, r.measuredWeight, actualRollProps?.aWidth.toString(), Number(r.allocatedQuantity), r.objectExtNumber, r.inspectionStatus));
    }
    return rollsInfo;
  }

  // HELPER
  async getRollInfoForRollIds(companyCode: string, unitCode: string, rollIds: number[], iNeedRollActualInfoAlso: boolean): Promise<RollInfoModel[]> {
    const rollInfoModels: RollInfoModel[] = [];
    const rolls = await this.phItemLinesRepo.find({ where: { companyCode: companyCode, unitCode: unitCode, id: In(rollIds) }, relations: ['phItemId', 'phItemId.phLinesId', 'phItemId.phLinesId.packHeaderId'] });
    const insRollIds = rolls.map(rec => rec.id)
    const isInsRollOrNot = await this.dataSource.getRepository(InsConfigItemsEntity).find({ select: ['insItemId', 'insItemBarcode'], where: { insItemId: In(insRollIds) } })
    const insBarcodes = isInsRollOrNot.map(rec => rec.insItemBarcode)
    for (const rollInfo of rolls) {
      const packListData = await this.getPackListRecordForPackListId(rollInfo.phId);
      const lotRollObj = new RollInfoModel(rollInfo.id, rollInfo.id, rollInfo.barcode, rollInfo.objectExtNumber, rollInfo.objectType, rollInfo.inputQuantity, rollInfo.inputQuantityUom, rollInfo.sQuantity, rollInfo.inputLength, rollInfo.inputLengthUom, rollInfo.sLength, rollInfo.inputWidth, rollInfo.inputWidthUom, rollInfo.sWidth, rollInfo.netWeight, rollInfo.grossWeight, rollInfo.sShade, rollInfo.gsm, rollInfo.sSkLength, rollInfo.sSkWidth, rollInfo.sSkGroup, rollInfo.remarks, rollInfo.printStatus, rollInfo.isReleased, '', insBarcodes.includes(rollInfo.barcode), false, rollInfo.phItemId.itemCode, rollInfo.phItemId.itemName, rollInfo.phItemId.itemDescription, rollInfo.phItemId.itemCategory, rollInfo.phItemId.itemColor, rollInfo.phItemId.itemStyle, rollInfo.phItemId.itemSize, rollInfo.phItemId.phLinesId.batchNumber, rollInfo.phItemId.phLinesId.lotNumber, null, rollInfo.phItemId.phLinesId.packHeaderId.id, rollInfo.poNumber, rollInfo.poLineItemNo, rollInfo.measuredWidth?.toString(), rollInfo.grnStatus, rollInfo.measuredWeight, rollInfo.objectSeqNumber, packListData.packListCode, packListData.supplierCode, packListData.supplierName, false, rollInfo.issuedQuantity, rollInfo.allocatedQuantity, null);
      if (iNeedRollActualInfoAlso) {
        const actualRoles = await this.phItemLinesActualRepo.findOne({ where: { phItemsId: rollInfo.phItemId.id, phItemLinesId: rollInfo.phItemId.phLinesId.id } });
        if (actualRoles) {
          lotRollObj.actualRollInfo = new ActualRollInfoModel(actualRoles.aShade, actualRoles.aWidth, actualRoles.aGsm, actualRoles.aLength);
        }
      }
      rollInfoModels.push(lotRollObj);
    }
    return rollInfoModels;
  }

  /**
   * Service to get GRN roll info for roll Id
   * @param rollId 
   * @param uniCode 
   * @param companyCode 
   * @returns 
  */
  // ENDPOINT
  // READER
  async getGrnRollInfoForRollId(req: RollIdRequest): Promise<GrnRollInfoResponse> {
    const roll = await this.phItemLinesRepo.findOne({ select: ['id', 'grnStatus'], where: { barcode: req.barcode, companyCode: req.companyCode, unitCode: req.unitCode } });
    if (!roll) {
      throw new ErrorResponse(0, 'Object does not exist');
    }
    req.rollId = roll.id;
    if (roll.grnStatus == PhLinesGrnStatusEnum.OPEN) {
      throw new ErrorResponse(0, 'GRN Not Completed, Please do the GRN.');
    }
    const rollsInfo = await this.getRollInfoForRollIds(req.companyCode, req.unitCode, [req.rollId], false);
    const rollInfo = rollsInfo[0];
    const pgType = rollInfo.pickForInspection ? PalletGroupTypeEnum.INSPECTION : PalletGroupTypeEnum.WAREHOUSE;

    let defaultPalletInfo: PalletDetailsModel[] = [];
    const defaultPg = await this.pgInfoService.getDefaultPalletMappedForARoll(req.companyCode, req.unitCode, req.rollId, pgType);
    if (defaultPg.defaulPalletId) {
      defaultPalletInfo = await this.palletService.getPalletsBasicInfo(req.companyCode, req.unitCode, [defaultPg.defaulPalletId]);
    }

    let actualAssignedPalletInfo: PalletDetailsModel[] = [];
    const actualAssignedPallet = await this.pgInfoService.getConfirmedPalletMappedForARoll(req.companyCode, req.unitCode, req.rollId);
    if (actualAssignedPallet.defaulPalletId) {
      actualAssignedPalletInfo = await this.palletService.getPalletsBasicInfo(req.companyCode, req.unitCode, [actualAssignedPallet.defaulPalletId]);
    }
    const rollObj = new GrnRollInfoModel(defaultPg.pgName, defaultPg.pgId, defaultPg.defaulPalletId, defaultPalletInfo[0]?.palletCode, actualAssignedPallet.defaulPalletId, actualAssignedPalletInfo[0]?.palletCode, rollInfo);
    return new GrnRollInfoResponse(true, 1032, 'GRN object information retrieved successfully', rollObj)
  }

  /**
   * Service to get GRN roll info for roll Id
   * @param rollId 
   * @param uniCode 
   * @param companyCode 
   * @returns 
  */
  // ENDPOINT
  // READER
  async getGrnRollInfoForRollIdGRN(req: RollIdRequest): Promise<GrnRollInfoResponse> {
    const roll = await this.phItemLinesRepo.findOne({ select: ['id'], where: { barcode: req.barcode, companyCode: req.companyCode, unitCode: req.unitCode } });
    if (!roll) {
      throw new ErrorResponse(0, 'Object does not exist');
    }
    req.rollId = roll.id;
    const rollsInfo = await this.getRollInfoForRollIds(req.companyCode, req.unitCode, [req.rollId], false);
    const rollInfo = rollsInfo[0];
    /**Keeping Unloading status validation */

    const pgType = rollInfo.pickForInspection ? PalletGroupTypeEnum.INSPECTION : PalletGroupTypeEnum.WAREHOUSE;

    let defaultPalletInfo: PalletDetailsModel[] = [];
    const defaultPg = await this.pgInfoService.getDefaultPalletMappedForARoll(req.companyCode, req.unitCode, req.rollId, pgType);
    if (defaultPg.defaulPalletId) {
      defaultPalletInfo = await this.palletService.getPalletsBasicInfo(req.companyCode, req.unitCode, [defaultPg.defaulPalletId]);
    }

    let actualAssignedPalletInfo: PalletDetailsModel[] = [];
    const actualAssignedPallet = await this.pgInfoService.getConfirmedPalletMappedForARoll(req.companyCode, req.unitCode, req.rollId);
    if (actualAssignedPallet.defaulPalletId) {
      actualAssignedPalletInfo = await this.palletService.getPalletsBasicInfo(req.companyCode, req.unitCode, [actualAssignedPallet.defaulPalletId]);
    }
    const rollObj = new GrnRollInfoModel(defaultPg.pgName, defaultPg.pgId, defaultPg.defaulPalletId, defaultPalletInfo[0]?.palletCode, actualAssignedPallet.defaulPalletId, actualAssignedPalletInfo[0]?.palletCode, rollInfo);
    return new GrnRollInfoResponse(true, 1032, 'GRN object information retrieved successfully', rollObj)
  }

  async getGrnRollInfoForRollIdAtIssuance(req: RollIdRequest): Promise<GrnRollInfoResponse> {
    const roll = await this.phItemLinesRepo.findOne({ select: ['id', 'grnStatus'], where: { barcode: req.barcode, companyCode: req.companyCode, unitCode: req.unitCode } });
    if (!roll) {
      throw new ErrorResponse(0, 'Object does not exist');
    }
    req.rollId = roll.id;
    if (roll.grnStatus == PhLinesGrnStatusEnum.OPEN) {
      throw new ErrorResponse(0, 'GRN Not Completed, Please do the GRN.');
    }

    // const pgType = rollInfo.pickForInspection ? PalletGroupTypeEnum.INSPECTION : PalletGroupTypeEnum.WAREHOUSE;
    // let defaultPalletInfo: PalletDetailsModel[] = [];
    // const defaultPg = await this.pgInfoService.getDefaultPalletMappedForARoll(req.companyCode, req.unitCode, req.rollId, pgType);
    // if (defaultPg.defaulPalletId) {
    //   defaultPalletInfo = await this.palletService.getPalletsBasicInfo(req.companyCode, req.unitCode, [defaultPg.defaulPalletId]);
    // }

    // Checking weather it is mapped to tray
    const rollIdRequest = new RollIdsRequest(req.username, req.unitCode, req.companyCode, req.userId, [req.rollId]);
    const actualAssignedTray = await this.trayRollInfoService.getTrayAndTrolleyInfoForRollIdData(rollIdRequest);
    // let actualAssignedPalletInfo: PalletDetailsModel[] = [];
    const actualAssignedPallet = await this.pgInfoService.getConfirmedPalletMappedForARoll(req.companyCode, req.unitCode, req.rollId);
    if (!actualAssignedPallet.defaulPalletId && !actualAssignedTray.status) {
      throw new ErrorResponse(0, 'Pallet/Tray Not mapped to the Object, Allocate pallet/Tray and do the issuance.');
      // actualAssignedPalletInfo = await this.palletService.getPalletsBasicInfo(req.companyCode, req.unitCode, [actualAssignedPallet.defaulPalletId]);
    }

    const rollsInfo = await this.getRollInfoForRollIds(req.companyCode, req.unitCode, [req.rollId], false);
    const rollInfo = rollsInfo[0];
    const rollObj = new GrnRollInfoModel('', 0, 0, '', 0, '', rollInfo);
    return new GrnRollInfoResponse(true, 1032, 'GRN object information retrieved successfully', rollObj)
  }

  // HELPER
  // READER
  async getRollIdsForPackList(companyCode: string, unitCode: string, packListId: number, rollsSelectedFor: CurrentPalletLocationEnum): Promise<number[]> {
    const rollIds: number[] = [];
    let rolls: PhItemLinesEntity[] = [];
    if (rollsSelectedFor) {
      const insRollIds = await this.insConfigItemRepo.find({ select: ['insItemId'], where: { plRefId: packListId } });
      if (rollsSelectedFor == CurrentPalletLocationEnum.WAREHOUSE) {
        rolls = await this.phItemLinesRepo.find({ select: ['id'], where: { companyCode: companyCode, unitCode: unitCode, phId: packListId, id: Not(In(insRollIds.map(i => i.insItemId))) } });
      } else {
        return insRollIds.map(i => i.insItemId);
      }
    } else {
      rolls = await this.phItemLinesRepo.find({ select: ['id'], where: { companyCode: companyCode, unitCode: unitCode, phId: packListId } });
    }
    rolls.forEach(r => {
      rollIds.push(r.id);
    });
    return rollIds;
  }

  /**
   * Service to get product details by lot number
   * @param lotNumber 
   * @param unitCode 
   * @param companyCode 
   * @returns 
  */
  async getProductDetailsByLotNumber(lotNumber: string, unitCode: string, companyCode: string): Promise<ProductInfoResp> {
    const poNumberDetail = await this.phItemLinesRepo.findOne({ select: ['poNumber'], where: { lotNumber, unitCode, companyCode } });
    if (!poNumberDetail) {
      throw new ErrorResponse(1045, 'Po Number not found for the given lot number.')
    }
    const poNumberReq = new PoNumberRequest(null, unitCode, companyCode, 0, poNumberDetail.poNumber);
    const productDetails: any = []
    if (!productDetails.length) {
      throw new ErrorResponse(1046, 'Product details not found for the given po number.')
    }
    const itemInfo = await this.phItemsRepo.getItemInfoByLotNumber(lotNumber, unitCode, companyCode);
    const supplierShade = await this.phItemLinesRepo.getShadeByLotNumber(lotNumber, unitCode, companyCode);
    const styleSet = new Set<string>();
    const buyerSet = new Set<string>();
    const colorSet = new Set<string>();
    const supplierSet = new Set<string>();
    const styleDescSet = new Set<string>();
    const customerStyleSet = new Set<string>();
    for (const productInfo of productDetails) {
      styleSet.add(productInfo.style);
      styleDescSet.add(productInfo.style_desc);
      customerStyleSet.add(productInfo.style_code);
      const buyerName = `${productInfo.customer_code} - ${productInfo.customer_name}`;
      buyerSet.add(buyerName);
      colorSet.add(productInfo.item_color);
      const supplierInfo = `${productInfo.supplier_code} - ${productInfo.supplier_name}`;
      supplierSet.add(supplierInfo);
    }
    return new ProductInfoResp(Array.from(styleSet), Array.from(styleDescSet), Array.from(customerStyleSet), Array.from(buyerSet), Array.from(colorSet), Array.from(supplierSet), itemInfo.item_description, itemInfo.item_code, poNumberDetail.poNumber, supplierShade, null);
  }

  // HELPER
  // WRITER
  async updateGrnCompleteForRollAndPackListAutomatically(companyCode: string, unitCode: string, rollId: number, packListId: number, username: string, incomingTransManager: GenericTransactionManager): Promise<GlobalResponseObject> {
    const transManager = incomingTransManager ? incomingTransManager : new GenericTransactionManager(this.dataSource);
    try {
      if (!incomingTransManager) {
        await transManager.startTransaction();
      }
      const grnStatusCheck = await this.getRollRecordForRollId(rollId);
      if (grnStatusCheck.grnStatus == PhLinesGrnStatusEnum.OPEN) {
        // update the GRN for the roll
        await transManager.getRepository(PhItemLinesEntity).update({ id: rollId, unitCode, companyCode }, { grnStatus: PhLinesGrnStatusEnum.DONE, updatedUser: username, grnDate: () => `Now()` });
      }
      // check if the rolls are all GRN confirmed
      const rollsWithoutGrn = await transManager.getRepository(PhItemLinesEntity).count({ where: { companyCode: companyCode, unitCode: unitCode, phId: packListId, grnStatus: PhLinesGrnStatusEnum.OPEN } });
      if (rollsWithoutGrn == 0) {
        // then update the GRN status
        await transManager.getRepository(PackingListEntity).update({ id: packListId, unitCode: unitCode, companyCode: companyCode }, { grnStatus: GrnStatusEnum.GRN_CONFIRMED, updatedUser: 'SYSTEM' });
      }
      if (!incomingTransManager) {
        await transManager.completeTransaction();
      }
      return new GlobalResponseObject(true, 0, 'Grn status updated successfully');
    } catch (error) {
      if (!incomingTransManager) {
        await transManager.releaseTransaction();
      }
      throw error;
    }
  }

  /**
   * 
   * @param packingListId 
   * @param unitCode 
   * @param companyCode 
   */
  async getPackingListNumberById(packingListId: number, unitCode: string, companyCode: string) {
    return await this.phRepo.getPackingListNumberById(packingListId, unitCode, companyCode)
  }

  /**
    * Service query to get roll count by batch no
    * @param batchNo 
    * @param unitCode 
    * @param companyCode 
    * @returns 
   */
  async getRollCountByBatchNo(batchNo: string, unitCode: string, companyCode: string): Promise<number> {
    // return await this.phItemLinesRepo.getRollCountByBatchNo(batchNo, unitCode, companyCode);
    return null;
  }

  /**
     * 
     * @param phId 
     * @param unitCode 
     * @param companyCode 
     * @returns 
    */
  async getRollIdsByPhId(phId: number, lotNumber: string, unitCode: string, companyCode: string): Promise<number[]> {
    return await this.phItemLinesRepo.getRollIdsByPhId(phId, lotNumber, unitCode, companyCode);
  }

  async getItemInfoByLotNumber(lotNumber: string, unitCode: string, companyCode: string) {
    return await this.phItemRepo.getItemInfoByLotNumber(lotNumber, unitCode, companyCode);
  }

  /**
     * 
     * @param phId 
     * @param uniCode 
     * @param companyCode 
     * @returns 
    */
  async getSupplierDetailsByPhId(phId: number, uniCode: string, companyCode: string): Promise<SupplierAndPLQryResp> {
    return this.phRepo.getSupplierDetailsByPhId(phId, uniCode, companyCode);
  }

  /**
     * Repository to get material info for given packing list header Id
     * @param phId 
     * @param lotNumber 
     * @param unitCode 
     * @param companyCode 
  */
  async getMaterialInfoByPhId(phId: number, unitCode: string, companyCode: string): Promise<SupplierAndPLQryResp> {
    return await this.phItemLinesRepo.getMaterialInfoByPhId(phId, unitCode, companyCode);

  }

  /**
     * Repository to get material info for given packing list header Id
     * @param phId 
     * @param lotNumber 
     * @param unitCode 
     * @param companyCode 
  */
  async getGRNCompletedMaterialInfoByPhId(phId: number, unitCode: string, companyCode: string): Promise<SupplierAndPLQryResp> {
    return await this.phItemLinesRepo.getGRNCompletedMaterialInfoByPhId(phId, unitCode, companyCode);

  }

  /**
   * Service to get supplier wise arrival details for the given date
   * @param date 
   * @param unitCode 
   * @param companyCode 
  */
  async getAllocatedAndIssuedQtyForGivenDate(date: string, unitCode: string, companyCode: string): Promise<{
    qty: number,
    request_type: MaterialConsumptionEnum
  }[]> {
    return await this.phItemLinesAiRepo.getAllocatedAndIssuedQtyForGivenDate(date, unitCode, companyCode)
  }

  async getPackListGrnUploadedInfo(unitCode: string, companyCode: string): Promise<number> {
    return await this.packingListRepo.getPackListGrnUploadedInfo(unitCode, companyCode);
  }

  async getPackListGrnUploadedInfoByDate(unitCode: string, companyCode: string, selectedDate: string): Promise<number> {
    return await this.packingListRepo.getPackListGrnUploadedInfoByDate(unitCode, companyCode, selectedDate);
  }

  async getPackListGrnOpenInfo(unitCode: string, companyCode: string): Promise<GrnInfoQryResp[]> {
    return await this.packingListRepo.getPackListGrnOpenInfo(unitCode, companyCode);
  }

}
