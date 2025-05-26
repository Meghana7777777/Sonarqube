import { Inject, Injectable, InternalServerErrorException, forwardRef } from '@nestjs/common';
import { CommonResponse, ErrorResponse } from '@xpparel/backend-utils';
import { BarcodeTypesEnum, BatchInfoModel, CommonRequestAttrs, DistinctPLItemCategoriesModelResp, GlobalResponseObject, GrnStatusEnum, InsInspectionStatusEnum, ItemCategoryReqModel, ItemInfoQryRespModel, LocationFromTypeEnum, LocationToTypeEnum, LotInfoModel, ManufacturingOrderItemDataModel, ManufacturingOrderItemDataResponse, ManufacturingOrderItemRequest, ManufacturingOrderNumberRequest, PLHeadIdReq, PackingListConfirmRequest, PackingListInfoModel, PackingListInfoResponse, PackingListSummaryModel, PackingListSummaryRequest, PackingListSummaryResponse, PackingListUploadTypeEnum, PhBatchLotRollRequest, PhItemPrintStatus, PhLinesGrnStatusEnum, ReqStatus, RollBasicInfoResponse, RollIdsRequest, RollInfoModel, SecurityCheckRequest, SupplierCodeReq, SupplierPoModel, SupplierPoSummaryModel, SupplierPoSummaryResponse, SupplierResponse, SupplierWisePackListsCountReqIdDto, SupplierWisePackListsCountResponse, SuppliersResponse, VehicleINRDto } from '@xpparel/shared-models';
import { DataSource, In } from 'typeorm';
import { GenericTransactionManager } from '../../database/typeorm-transactions';
import { GrnService } from '../grn/grn.service';
import { PackListVehicleStatusResp } from '../grn/repositories/query-response/pack-list-vehicle-status.qry.resp';
import { PackingListEntity } from './entities/packing-list.entity';
import { PhBarcodePrintHistoryEntity } from './entities/ph-bar-code-print-history.entity';
import { PhItemLinesActualEntity } from './entities/ph-item-lines-actual.entity';
import { PhItemLinesEntity } from './entities/ph-item-lines.entity';
import { PhItemsEntity } from './entities/ph-items.entity';
import { PhLinesHistoryEntity } from './entities/ph-lines-print-history.entity';
import { PhLinesEntity } from './entities/ph-lines.entity';
import { PhLogEntity } from './entities/ph-log.entity';
import { PackingListRepo } from './repository/packing-list.repository';
import { PhItemLineSampleRepo } from './repository/ph-item-line-sample.repository';
import { PhItemLinesRepo } from './repository/ph-item-lines.repository';
import { PackingListSummaryQueryResp } from './repository/query-response/packing-list-summary.qry.resp';

import moment from 'moment';
import { SupplierDataService } from '../master-data/master-services/supplier/supplier-service';
import { PackingListInfoService } from './packing-list-info.service';
import { BasicRollInfoQryResp } from './repository/query-response/roll-basic-info.qry.resp';
import { rollIdSampleIdQryResp } from './repository/query-response/roll-id-sample-id.qry.resp';
// import { GatexDcControllerService } from '@xpparel/shared-services';
import { GatexService } from '@xpparel/shared-services';
import { InspectionReportsRepo } from './repository/packlist.repository';
import { PhItemsRepo } from './repository/ph-items.repository';
import { ItemInfoQryResp } from './repository/query-response/item-info.qry.resp';

@Injectable()
export class PackingListService {
  constructor(
    private dataSource: DataSource,
    private phRepo: PackingListRepo,
    private phItemLinesRepo: PhItemLinesRepo,
    private phItemLinesSampleRepo: PhItemLineSampleRepo,
    private supplierDataService: SupplierDataService,
    private inspectionReportsRepo: InspectionReportsRepo,
    private phItemsRepo: PhItemsRepo,
    private gatexService: GatexService,
    @Inject(forwardRef(() => GrnService)) private grnService: GrnService,
    @Inject(forwardRef(() => PackingListInfoService)) private infoService: PackingListInfoService,

  ) {
  }

  async getRmPosForPackList(reqModel: PLHeadIdReq): Promise<CommonResponse> {
    if (!reqModel?.phId) {
      throw new Error("Invalid request: phId is required");
    }
    const poNumbers = await this.phItemLinesRepo.getPONumbersByPhId(reqModel.phId);
    return new CommonResponse(true, 0, "PO numbers retrieved successfully", poNumbers);
  }



  /**
   * Service to create packing list. It will create packing list against to the supplier PO
   * @param reqModel 
   * @returns 
  */
  async createPackList(reqModel: PackingListInfoModel): Promise<GlobalResponseObject> {
    const transactionalEntityManager = new GenericTransactionManager(this.dataSource);
    try {
      const unitCode = reqModel.unitCode;
      const companyCode = reqModel.companyCode;
      const supplierCode = reqModel.supplierCode;
      // checking supplier po exits in the db or not
      // const supplierPoInfo = await this.preIntegrationService.getSupplierPoBasicInfo(supplierCode, unitCode, companyCode);
      // If the packing list has been already created then we nee to delete the previous records and save it again
      // before that we need to check grn is started for that quantity or not
      // checking packing list not yet confirmed
      // VALIDATING LOT NUMBER DUPLICATION AND ROLL DUPLICATION
      const lotNumberSet = new Set<string>();
      for (const batchInfo of reqModel.batchInfo) {
        for (const lotInfo of batchInfo.lotInfo) {
          // roll set
          const lotRollSet = new Set<string>();
          if (lotNumberSet.has(lotInfo.lotNumber)) {
            throw new ErrorResponse(6216, 'Duplicate lot number identified in the packing list, Please check.' + lotInfo.lotNumber);
          }
          lotNumberSet.add(lotInfo.lotNumber);
          for (const rollInfo of lotInfo.rollInfo) {
            if (lotRollSet.has(rollInfo.externalRollNumber)) {
              throw new ErrorResponse(6217, 'Duplicate Object number identified with in the lot number. Please check' + lotInfo.lotNumber + '--' + rollInfo.externalRollNumber)
            }
            lotRollSet.add(rollInfo.externalRollNumber);
          }
        }
      }
      const packingListInfo = await this.phRepo.findOne({ where: { packListCode: reqModel.packListCode, unitCode, companyCode } });
      if (packingListInfo) {
        throw new ErrorResponse(6218, 'Pack list already exist with given pack list code');
      }
      //TODO:has to finalize
      // const isLotExistForSupplier = await this.phRepo.checkIsLotExistForSupplier(reqModel.supplierCode, reqModel.unitCode, reqModel.companyCode, Array.from(lotNumberSet));
      // if (isLotExistForSupplier) {
      //   throw new ErrorResponse(1051, 'Lot Number already exist for given Supplier');
      // }

      await transactionalEntityManager.startTransaction();
      reqModel.id ? await this.validateAndDeletePackingList(reqModel.id, unitCode, companyCode, transactionalEntityManager) : null;
      const saveLog: PhLogEntity = await this.savePhLog(reqModel.description, reqModel.uploadType, reqModel.username, unitCode, companyCode, transactionalEntityManager);
      const packingListId = await this.savePackList(reqModel, transactionalEntityManager, saveLog.id);

      const vehicleINRRequest = new VehicleINRDto(
        undefined,
        String(packingListId),
        reqModel.packListCode,
        new Date(),
        reqModel.supplierCode,
        unitCode,
        LocationFromTypeEnum.SUPP,
        LocationToTypeEnum.WH,
        1,
        ReqStatus.OPEN,
        1,
        true,
        new Date(),
        reqModel.username,
        new Date(),
        reqModel.username,
        1,
        []
      );
      await transactionalEntityManager.completeTransaction();
      //saving to gatex
      const vinrResponse = await this.gatexService.createVINR([vehicleINRRequest]);
      if (!vinrResponse.status) {
        throw new ErrorResponse(48565, vinrResponse.internalMessage);
      }
      return new GlobalResponseObject(true, 6219, 'Packing list has been created successfully.')

    } catch (error) {
      await transactionalEntityManager.releaseTransaction();
      throw error;
    }
  }

  async packListNumbersDropDown(reqModel: CommonRequestAttrs): Promise<CommonResponse> {
    const result = await this.inspectionReportsRepo.packListNumbersDropDown(reqModel);
    return new CommonResponse(true, result.length, 'Packlist numbers retrived successfully', result)
  }

  async getPackListsForSupplier(reqModel: SupplierCodeReq): Promise<CommonResponse> {
    const result = await this.inspectionReportsRepo.getPackListsForSupplier(reqModel);
    return new CommonResponse(true, result.length, 'PackList numbers retrieved successfully', result)
  }

  async savePhLog(description: string, uploadType: PackingListUploadTypeEnum, userName: string, unitCode: string, companyCode: string, transactionalEntityManager: GenericTransactionManager): Promise<PhLogEntity> {
    const phLogEntity = new PhLogEntity();
    phLogEntity.companyCode = companyCode;
    phLogEntity.createdUser = userName;
    phLogEntity.description = description;
    phLogEntity.filePath = '/';
    phLogEntity.fileType = uploadType;
    phLogEntity.remarks = '';
    phLogEntity.unitCode = unitCode;
    return await transactionalEntityManager.getRepository(PhLogEntity).save(phLogEntity);
  }
  /**
   * Service to validate and delete the packing list 
   * @param packingListId Packing list Id
   * @param unitCode Unit Code
   * @param companyCode Company Code
   * @param transaction Generic transaction manager
   * @returns 
  */
  async validateAndDeletePackingList(packingListId: number, unitCode: string, companyCode: string, transaction?: GenericTransactionManager): Promise<GlobalResponseObject> {
    let transactionalEntityManager: GenericTransactionManager = transaction;
    transactionalEntityManager = transaction ? transaction : new GenericTransactionManager(this.dataSource);
    transaction ? null : await transactionalEntityManager.startTransaction();
    try {
      const packingListDetail = await this.phRepo.findOne(({ where: { id: packingListId, unitCode, companyCode }, relations: ['phLineInfo', 'phLineInfo.phItemInfo', 'phLineInfo.phItemInfo.phItemLinesInfo'] }));
      if (!packingListDetail) {
        return new GlobalResponseObject(true, 6220, 'Packing list has been deleted successfully.');
      }
      //TODO: WMS-MO-DUMP
      // check if there is a truck for the packing list
      // const truckInfo = await this.grnService.getVehicleRecordForPackListId(packingListId);
      // if (truckInfo) {
      //   throw new ErrorResponse(1002, 'Processing has been started for the packing list you cannot edit or delete');
      // }
      if (packingListDetail.confirmedDate) {
        // throw new ErrorResponse(1006, 'Packing List already confirmed you cannot delete or update.');
      }
      if (packingListDetail?.phLineInfo?.length) {
        for (const packingListLine of packingListDetail?.phLineInfo) {
          for (const packingListItem of packingListLine?.phItemInfo) {
            for (const packingListItemLine of packingListItem?.phItemLinesInfo) {
              await transactionalEntityManager.getRepository(PhItemLinesEntity).delete({ id: packingListItemLine.id, unitCode, companyCode });
            }
            await transactionalEntityManager.getRepository(PhItemsEntity).delete({ id: packingListItem.id, unitCode, companyCode });
          }
          await transactionalEntityManager.getRepository(PhLinesEntity).delete({ id: packingListLine.id, unitCode, companyCode });
        }
      }
      const delObj = await transactionalEntityManager.getRepository(PackingListEntity).delete({ id: packingListDetail.id, unitCode, companyCode });
      transaction ? null : await transactionalEntityManager.completeTransaction();
      return new GlobalResponseObject(true, 6220, 'Packing list has been deleted successfully.');
    } catch (err) {
      if (!transaction) {
        await transactionalEntityManager.releaseTransaction();
      }
      throw err;
    }
  };

  /**
   * 
   * @param batchInfoModels 
   * @returns 
  */
  generateRollInfoMap(batchInfoModels: BatchInfoModel[]): Map<string, Map<string, Map<string, RollInfoModel[]>>> {
    const rollInfoMap: Map<string, Map<string, Map<string, RollInfoModel[]>>> = new Map();

    // Iterate over each BatchInfoModel
    for (const batchInfo of batchInfoModels) {
      const { batchNumber, lotInfo } = batchInfo;

      // Create a map for the lotNumber
      const lotRollInfoMap: Map<string, Map<string, RollInfoModel[]>> = new Map();

      // Iterate over each LotInfoModel in the current BatchInfoModel
      for (const lotInfoModel of lotInfo) {
        const { lotNumber, rollInfo } = lotInfoModel;

        // Create a map for the materialItemCode
        const materialRollInfoMap: Map<string, RollInfoModel[]> = new Map();

        // Iterate over each RollInfoModel in the current LotInfoModel
        for (const rollInfoModel of rollInfo) {
          const { materialItemCode } = rollInfoModel;

          // Add the RollInfoModel to the materialRollInfoMap
          if (!materialRollInfoMap.has(materialItemCode)) {
            materialRollInfoMap.set(materialItemCode, []);
          }
          materialRollInfoMap.get(materialItemCode).push(rollInfoModel);
        }

        // Assign the materialRollInfoMap to the lotNumber key in the lotRollInfoMap
        lotRollInfoMap.set(lotNumber, materialRollInfoMap);
      }

      // Assign the lotRollInfoMap to the batchNumber key in the rollInfoMap
      rollInfoMap.set(batchNumber, lotRollInfoMap);
    }

    return rollInfoMap;
  }

  /**
   * Serve to save packing list 
   * @param reqModel 
   * @returns 
  */
  async savePackList(reqModel: PackingListInfoModel, transactionalEntityManager: GenericTransactionManager, logId: number): Promise<number> {
    // TODO: If upload type is EXCEL we need to get excel from payload and save
    const unitCode = reqModel.unitCode;
    const companyCode = reqModel.companyCode;
    const createdUser = reqModel.username;
    /**Packing List Header Entity Converter */
    const packListEntity = new PackingListEntity();
    packListEntity.supplierCode = reqModel.supplierCode;
    packListEntity.supplierName = reqModel.supplierName;
    packListEntity.companyCode = reqModel.companyCode;
    packListEntity.description = reqModel.description;
    packListEntity.unitCode = reqModel.unitCode;
    packListEntity.remarks = reqModel.remarks;
    // TODO
    packListEntity.phCode = 123;
    packListEntity.phLineInfo = [];
    packListEntity.companyCode = companyCode;
    packListEntity.unitCode = unitCode;
    packListEntity.confirmedDate = reqModel.confirmedDate;
    packListEntity.createdUser = createdUser;
    const packListDate: any = moment(reqModel.packListDate).format('YYYY-MM-DD');
    packListEntity.deliveryDate = reqModel.deliveryDate;
    packListEntity.packListDate = packListDate;
    packListEntity.description = reqModel.description;
    packListEntity.packListCode = reqModel.packListCode;
    packListEntity.grnStatus = GrnStatusEnum.OPEN,
      packListEntity.isActive = true;
    packListEntity.packHeaderLogId = logId // TODO
    packListEntity.remarks = reqModel.remarks;
    packListEntity.uploadType = reqModel.uploadType;
    const savedPh = await transactionalEntityManager.getRepository(PackingListEntity).save(packListEntity);
    const phId = savedPh.id;

    const overallBatchLotInfo: Map<string, Map<string, Map<string, RollInfoModel[]>>> = this.generateRollInfoMap(reqModel.batchInfo);
    for (const [batchNumber, lotInfo] of overallBatchLotInfo) {
      const batchLotDetails: BatchInfoModel = reqModel.batchInfo.find((batch) => {
        return batch.batchNumber == batchNumber
      });
      for (const [lotNumber, materialItemCodeInfo] of lotInfo) {
        const packListLineEntity = new PhLinesEntity();
        packListLineEntity.phItemInfo = [];
        packListLineEntity.batchNumber = batchLotDetails.batchNumber;
        packListLineEntity.invoiceDate = batchLotDetails.invoiceDate;
        packListLineEntity.invoiceNumber = batchLotDetails.invoiceNumber;
        packListLineEntity.deliveryDate = batchLotDetails.deliveryDate;
        packListLineEntity.companyCode = companyCode;
        packListLineEntity.createdUser = createdUser;
        packListLineEntity.remarks = batchLotDetails.remarks;
        packListLineEntity.unitCode = unitCode;
        packListLineEntity.lotNumber = lotNumber;
        packListLineEntity.packHeaderId = new PackingListEntity();
        packListLineEntity.packHeaderId.id = phId;
        for (const [materialItemCode, lotRollInfo] of materialItemCodeInfo) {
          const packListItemEntity = new PhItemsEntity();
          packListItemEntity.itemCode = materialItemCode;
          packListItemEntity.itemName = lotRollInfo[0].materialItemName;
          packListItemEntity.itemDescription = lotRollInfo[0].materialItemDesc;
          packListItemEntity.actualUom = lotRollInfo[0].inputQuantityUom;
          packListItemEntity.preferredUom = 'MTR';
          packListItemEntity.itemCategory = lotRollInfo[0].itemCategory;
          packListItemEntity.companyCode = companyCode;
          packListItemEntity.createdUser = createdUser;
          packListItemEntity.itemColor = lotRollInfo[0].itemColor;
          packListItemEntity.itemSize = lotRollInfo[0].itemSize;
          packListItemEntity.itemStyle = lotRollInfo[0].itemStyle;
          packListItemEntity.phItemLinesInfo = [];
          packListItemEntity.remarks = lotRollInfo[0].remarks;
          packListItemEntity.unitCode = unitCode;
          for (const rollInfo of lotRollInfo) {
            const phItemLinesEntity = new PhItemLinesEntity();
            phItemLinesEntity.objectType = rollInfo.objectType;
            phItemLinesEntity.objectSysNumber = rollInfo.id;
            phItemLinesEntity.objectExtNumber = rollInfo.externalRollNumber;

            phItemLinesEntity.poNumber = rollInfo.poNumber;
            phItemLinesEntity.poLineItemNo = rollInfo.poLineItemNo;

            phItemLinesEntity.inputQuantity = rollInfo.inputQuantity;
            phItemLinesEntity.inputQuantityUom = rollInfo.inputQuantityUom;
            phItemLinesEntity.sQuantity = rollInfo.supplierQuantity;

            phItemLinesEntity.inputLength = rollInfo.inputLength;
            phItemLinesEntity.inputLengthUom = rollInfo.inputLengthUom;
            phItemLinesEntity.sLength = rollInfo.supplierLength;

            phItemLinesEntity.inputWidth = rollInfo.inputWidth;
            phItemLinesEntity.inputWidthUom = rollInfo.inputWidthUom;
            phItemLinesEntity.sWidth = rollInfo.supplierWidth;

            phItemLinesEntity.netWeight = rollInfo.netWeight;
            phItemLinesEntity.grossWeight = rollInfo.grossWeight;

            phItemLinesEntity.sShade = rollInfo.shade;
            phItemLinesEntity.gsm = rollInfo.gsm;
            phItemLinesEntity.sSkLength = rollInfo.skLength;
            phItemLinesEntity.sSkWidth = rollInfo.skWidth;
            phItemLinesEntity.sSkGroup = rollInfo.skGroup;
            phItemLinesEntity.objectSeqNumber = rollInfo.objectSeqNumber;
            phItemLinesEntity.measuredWeight = rollInfo.measuredWeight;

            phItemLinesEntity.qrCode = rollInfo.qrCodeInfo;
            phItemLinesEntity.allocatedQuantity = 0; // Set the initial value
            phItemLinesEntity.issuedQuantity = 0; // Set the initial value
            phItemLinesEntity.returnQuantity = 0; // Set the initial value
            phItemLinesEntity.inspectionStatus = InsInspectionStatusEnum.OPEN; // Set the default value
            phItemLinesEntity.barcode = ''; // TODO 
            phItemLinesEntity.printStatus = rollInfo.printStatus;
            phItemLinesEntity.grnStatus = PhLinesGrnStatusEnum.OPEN; // Set the default value
            phItemLinesEntity.isReleased = false; // Set the default value
            phItemLinesEntity.inspectionPick = rollInfo.pickForInspection;
            phItemLinesEntity.unitCode = unitCode;
            phItemLinesEntity.companyCode = companyCode;
            phItemLinesEntity.phId = phId;
            phItemLinesEntity.lotNumber = lotNumber;
            phItemLinesEntity.batchNumber = batchNumber;

            packListItemEntity.phItemLinesInfo.push(phItemLinesEntity);
          }
          packListLineEntity.phItemInfo.push(packListItemEntity);
        }
        packListEntity.phLineInfo.push(packListLineEntity);
      }
    }
    await transactionalEntityManager.getRepository(PhLinesEntity).save(packListEntity.phLineInfo);
    for (const packingListLines of packListEntity.phLineInfo) {
      for (const packingListItem of packingListLines.phItemInfo) {
        for (const packingListItemLines of packingListItem.phItemLinesInfo) {
          const barcode = `${BarcodeTypesEnum.R}-${packingListItemLines.id.toString(16)}`
          await transactionalEntityManager.getRepository(PhItemLinesEntity).update({ id: packingListItemLines.id }, { barcode });
          // Need to insert a row in ph item line Actuals
          const phItemLineAct = this.getPhItemLineActualEntities(packingListItem.id, packingListItemLines.id, unitCode, companyCode, createdUser, packingListItemLines.sQuantity);
          await transactionalEntityManager.getRepository(PhItemLinesActualEntity).save(phItemLineAct);
        }
      }
    }

    return phId;
  }


  async savePhItemLineActual(phId: number, unitCode: string, companyCode: string) {
    const manager = new GenericTransactionManager(this.dataSource);
    try {
      await manager.startTransaction();
      const phItem = await this.phItemLinesRepo.find({ where: { phId, unitCode, companyCode }, relations: ['phItemId'] });
      for (const eachPhItem of phItem) {
        const phItemLineAct = this.getPhItemLineActualEntities(eachPhItem.phItemId.id, eachPhItem.id, unitCode, companyCode, eachPhItem.createdUser, eachPhItem.sQuantity);
        await manager.getRepository(PhItemLinesActualEntity).save(phItemLineAct)
      }
      await manager.completeTransaction();
    } catch (err) {
      manager ? manager.releaseTransaction() : null;
      throw err;
    }
  }
  /**
   * 
   * @param phItemId \
   * @param phItemLineId 
   * @param unitCode 
   * @param companyCode 
   * @param userName 
   * @param grnQty 
   * @returns 
  */
  getPhItemLineActualEntities(phItemId: number, phItemLineId: number, unitCode: string, companyCode: string, userName: string, grnQty: number): PhItemLinesActualEntity {
    const phItemLineActualObj = new PhItemLinesActualEntity();
    phItemLineActualObj.aGsm = 0;
    phItemLineActualObj.aLength = 0;
    phItemLineActualObj.aShade = null;
    phItemLineActualObj.aShadeGroup = null;
    phItemLineActualObj.aWeight = 0;
    phItemLineActualObj.aWidth = 0;
    phItemLineActualObj.adjustment = null;
    phItemLineActualObj.adjustmentValue = 0;
    phItemLineActualObj.companyCode = companyCode;
    phItemLineActualObj.createdUser = userName;
    phItemLineActualObj.grnQuantity = grnQty;
    phItemLineActualObj.noOfJoins = 0;
    phItemLineActualObj.phItemLinesId = phItemLineId;
    phItemLineActualObj.phItemsId = phItemId;
    phItemLineActualObj.toleranceFrom = 0;
    phItemLineActualObj.toleranceTo = 0;
    phItemLineActualObj.unitCode = unitCode;
    return phItemLineActualObj;
  }

  /**
   * Service to get packing list information for supplier po number and phId or batch number or lot number or roll number 
   * @param packListId 
   * @returns 
  */
  async getPackListInfo(reqModel: PhBatchLotRollRequest): Promise<PackingListInfoResponse> {
    const unitCode = reqModel.unitCode;
    const companyCode = reqModel.companyCode;
    const supplierCode = reqModel.supplierCode;
    try {
      // get the packing list info
      // TODO : Expecting nulls to this service for phId, batchNumber, lot number and roll number
      const packingListInfo: PackingListEntity[] = await this.phRepo.getPackingListEntireDetails(supplierCode, unitCode, companyCode, reqModel?.phId, reqModel?.batchNumber, reqModel?.lotNumber, reqModel?.rollNumber, reqModel?.itemCategory);
      if (!packingListInfo.length) {
        throw new ErrorResponse(6223, 'Packing lists not found for the given criteria');
      };



      // Fetch distinct item categories based on phId

      const packingLists: PackingListInfoModel[] = [];
      for (const packingListHead of packingListInfo) {
        // TODO: UNLOAD START TIME AND END TIME
        const packingListBatches: BatchInfoModel[] = [];
        const batchLotMap: Map<string, Map<string, PhLinesEntity[]>> = this.getBatchToLotMapping(packingListHead.phLineInfo);
        // batch to lot number map  
        for (const [batchNumber, batchLotInfo] of batchLotMap) {
          const batchInfo = packingListHead.phLineInfo.find(line => line.batchNumber == batchNumber);
          const packingListBatchLots: LotInfoModel[] = [];
          for (const [lotNumber, lotInfoForLot] of batchLotInfo) {
            const lotRollInfo: RollInfoModel[] = [];
            for (const batchLotMoreInfo of lotInfoForLot) {
              for (const lotItemInfo of batchLotMoreInfo.phItemInfo) {
                for (const rollInfo of lotItemInfo.phItemLinesInfo) {
                  const lotRollObj = new RollInfoModel(rollInfo.id, rollInfo.id, rollInfo.barcode, rollInfo.objectExtNumber, rollInfo.objectType, rollInfo.inputQuantity, rollInfo.inputQuantityUom, rollInfo.sQuantity, rollInfo.inputLength, rollInfo.inputLengthUom, rollInfo.sLength, rollInfo.inputWidth, rollInfo.inputWidthUom, rollInfo.sWidth, rollInfo.netWeight, rollInfo.grossWeight, rollInfo.sShade, rollInfo.gsm, rollInfo.sSkLength, rollInfo.sSkWidth, rollInfo.sSkGroup, rollInfo.remarks, rollInfo.printStatus, rollInfo.isReleased, '', rollInfo.inspectionPick, false, lotItemInfo.itemCode, lotItemInfo.itemName, lotItemInfo.itemDescription, lotItemInfo.itemCategory, lotItemInfo.itemColor, lotItemInfo.itemStyle, lotItemInfo.itemSize, batchNumber, lotNumber, null, packingListHead.id, rollInfo.poNumber, rollInfo.poLineItemNo, rollInfo.measuredWidth?.toString(), rollInfo.grnStatus, rollInfo.measuredWeight, rollInfo.objectSeqNumber, packingListHead.packListCode, packingListHead.supplierCode, packingListHead.supplierName, false, rollInfo.issuedQuantity, rollInfo.allocatedQuantity, null);
                  lotRollInfo.push(lotRollObj);
                }
              }
            }
            //TODO: WMS-MO-DUMP
            // NEED TO GET THE INSPECTION REQUESTS IF ANY 
            // const inspDetail: InspReqStatusQryResp[] = await this.inspService.getInspectionDetailsForLot(packingListHead.id, lotNumber, unitCode, companyCode);
            // const inspInfo = inspDetail.map((insp) => {
            //   return new InspReqStatusModel(insp.ins_req_id, insp.status);
            // })
            // const packingListLotObj = new LotInfoModel(0, lotNumber, '', lotRollInfo, inspInfo);
            const packingListLotObj = new LotInfoModel(0, lotNumber, '', lotRollInfo, []);//need to change mo dump
            packingListBatchLots.push(packingListLotObj);
          }
          const packingListBatchObj = new BatchInfoModel(batchInfo.id, batchInfo.deliveryDate, batchNumber, batchInfo.invoiceDate, batchInfo.invoiceDate, batchInfo.remarks, packingListBatchLots);
          packingListBatches.push(packingListBatchObj);
        }
        //TODO: WMS-MO-DUMP
        const grnDetails: PackListVehicleStatusResp = await this.grnService.getPackListVehicleInfo(packingListHead.id, reqModel.unitCode, reqModel.companyCode);
        const systemPreference = await this.grnService.getSystemPreferenceForPackListId(packingListHead.id, reqModel.unitCode, reqModel.companyCode);
        const packingListHeaderObj = new PackingListInfoModel(packingListHead.id, packingListHead.supplierCode, packingListHead.supplierName, packingListHead.deliveryDate, packingListHead.packListDate, packingListHead.packListCode, packingListHead.description, packingListHead.remarks, packingListHead.confirmedDate,
          grnDetails?.unload_start_at,
          grnDetails?.unload_complete_at,
          // null,//need to change mo dump
          // null,//need to change mo dump
          packingListBatches, packingListHead.createdUser, packingListHead.unitCode, packingListHead.companyCode, 0, packingListHead.uploadType, null, null, systemPreference?.data?.rollSelectionType, systemPreference?.data?.rollsPickPercentage);
        packingLists.push(packingListHeaderObj);
      }
      return new PackingListInfoResponse(true, 6224, '', packingLists);
    } catch (err) {
      throw err;
    }
  }


  /**
   * Service to give batch to lot mapping for packing list header lines
   * @param phLines 
   * @returns 
  */
  getBatchToLotMapping(phLines: PhLinesEntity[]): Map<string, Map<string, PhLinesEntity[]>> {
    const batchLotMap = new Map<string, Map<string, PhLinesEntity[]>>();
    for (const phLine of phLines) {
      if (!batchLotMap.has(phLine.batchNumber)) {
        batchLotMap.set(phLine.batchNumber, new Map<string, PhLinesEntity[]>);
      }
      if (!batchLotMap.get(phLine.batchNumber).has(phLine.lotNumber)) {
        batchLotMap.get(phLine.batchNumber).set(phLine.lotNumber, [])
      }
      batchLotMap.get(phLine.batchNumber).get(phLine.lotNumber).push(phLine);
    }
    return batchLotMap;
  }

  /**
  * Service to get pending supplier pos
  * @param reqModel 
  * @returns 
 */
  async getPendingSupplierPos(reqModel: CommonRequestAttrs): Promise<SuppliersResponse> {
    const supplierPoPendingInfo: SupplierPoModel[] = []
    // TODO:getPendingSupplierPos
    // await this.preIntegrationService.getPendingSupplierPos(reqModel.unitCode, reqModel.companyCode);
    return new SuppliersResponse(true, 1002, 'Pending Supplier Po Information Received successfully', supplierPoPendingInfo);
  }

  async getDistinctItemCategoriesData(req: PLHeadIdReq): Promise<DistinctPLItemCategoriesModelResp> {
    try {
      if (!req?.phId) {
        throw new Error("phId is required");
      }
      const data = await this.phItemsRepo.getDistinctItemCategories(req.phId);
      return new DistinctPLItemCategoriesModelResp(true, 0, "Distinct item categories retrieved successfully", data);
    } catch (error) {
      throw new Error(`Error fetching distinct item categories: ${error.message}`);
    }
  }





  /**
   * Service to get supplier po summary 
   * @param reqModel contains supplier po code, unit code and company code
   * @returns 
  */
  async getPoSummaryForSupplier(reqModel: SupplierCodeReq): Promise<SupplierPoSummaryResponse> {
    // Checking supplier number exists in the db or not
    const unitCode = reqModel.unitCode;
    const companyCode = reqModel.companyCode;
    const supplierCode = reqModel.supplierCode;
    const supplierPoDetailsReq = new SupplierCodeReq(
      reqModel.username,
      reqModel.unitCode,
      reqModel.companyCode,
      reqModel.userId,
      reqModel.supplierCode
    );
    const supplierPoDetails: SupplierResponse = await this.supplierDataService.getSuppliersDataByCode(supplierPoDetailsReq);
    if (!supplierPoDetails.status) throw new ErrorResponse(1005, 'Supplier not found.');
    const supplier = supplierPoDetails?.data;
    const supplierPoInfo: SupplierPoSummaryModel = new SupplierPoSummaryModel(supplier.id, supplier.supplierCode, supplier.supplierName, 0, 0, 0, 0, 0, 0, reqModel.username, reqModel.unitCode, reqModel.companyCode, reqModel.userId);
    // getting packing list details against to the supplier Po
    const supplierQtyInfo = await this.phRepo.getPackingListIdRelatedQuantitiesForSPOCode(supplierCode, unitCode, companyCode);
    const packingLisIdsSet = new Set<number>();
    let packingListQty = 0;
    let grnCompletedQty = 0;
    let grnCompletedPackLists = new Set<number>();
    supplierQtyInfo.forEach((supplierInfo) => {
      packingLisIdsSet.add(supplierInfo.packing_list_id);
      packingListQty += supplierInfo.packing_list_quantity;
      if (supplierInfo.grn_status == GrnStatusEnum.GRN_CONFIRMED) {
        grnCompletedPackLists.add(supplierInfo.packing_list_id);
        grnCompletedQty += supplierInfo.packing_list_quantity;
      }
    });
    supplierPoInfo.noOfPackLists = packingLisIdsSet.size;
    supplierPoInfo.packingListCreatedQty = packingListQty;
    supplierPoInfo.grnCompletedPackLists = grnCompletedPackLists.size;
    supplierPoInfo.grnQty = grnCompletedQty;
    supplierPoInfo.remainingQty = supplierPoInfo.supplierPoQty - packingListQty;
    return new SupplierPoSummaryResponse(true, 6226, 'Supplier PO summary has been received successfully.', [supplierPoInfo]);
  }


  /**
   * Service to confirm the packing list so that packing list cannot be updated
   * @param reqModel 
   * @returns 
  */
  async confirmPackList(reqModel: PackingListConfirmRequest): Promise<GlobalResponseObject> {
    try {
      const unitCode = reqModel.unitCode;
      const companyCode = reqModel.companyCode;
      const createdUser = reqModel.username;
      const packingListInfo = await this.phRepo.findOne({ where: { id: reqModel.packingListId, unitCode, companyCode } });
      if (!packingListInfo) {
        throw new ErrorResponse(6223, 'Packing lists not found for the given criteria.');
      }
      await this.phRepo.update({ id: reqModel.packingListId, unitCode, companyCode }, { confirmedDate: reqModel.confirmationDateTime, updatedUser: reqModel.confirmUser });
      return new GlobalResponseObject(true, 6228, 'Packing list confirmed successfully.');
    } catch (err) {
      throw err;
    }
  }

  /**
   * Service to get packing list summary
   * @param reqModel 
   * @returns 
  */
  async getPackListSummery(reqModel: PackingListSummaryRequest): Promise<PackingListSummaryResponse> {
    // if there is no status, that means we are requesting for the open packing lists that doesnt have security check in
    let packListIds: number[] = [];
    if (reqModel.securityStatus?.length == 0) {
      const packListIdWithoutVechicle = await this.phRepo.find({ select: ['id'], where: { companyCode: reqModel.companyCode, unitCode: reqModel.unitCode, arrived: false } });
      packListIdWithoutVechicle.forEach(r => packListIds.push(r.id));
    } else {
      packListIds = await this.grnService.getPackListIdsBasedOnVehicleUnloadStatus(reqModel.companyCode, reqModel.unitCode, reqModel.securityStatus);
    }

    if (packListIds.length == 0) {
      throw new ErrorResponse(1005, 'Packing lists not found for the given criteria.');
    }

    const packingListSummaryInfo: PackingListSummaryQueryResp[] = await this.phRepo.getPackingListSummaryDetails(reqModel.supplierCode, reqModel.unitCode, reqModel.companyCode, reqModel.from, reqModel.to, reqModel.grnDateFrom, reqModel.grnDateTo, packListIds);

    if (!packingListSummaryInfo.length) {
      throw new ErrorResponse(1005, 'Packing lists not found for the given criteria.');
    }
    // NEED TO GET THE GRN STATUS FOR THE ABOVE ONES
    const packingListsInfoForSpo: PackingListSummaryModel[] = [];
    for (const packingListInfo of packingListSummaryInfo) {
      const poNumberString = packingListInfo.po_numbers;
      const poNumbers = poNumberString?.split(',') ?? [];
      //TODO: WMS-MO-DUMP
      const grnDetails: PackListVehicleStatusResp = await this.grnService.getPackListVehicleInfo(packingListInfo.id, reqModel.unitCode, reqModel.companyCode);

      const supplierPoDetailsReq = new SupplierCodeReq(
        reqModel.username,
        reqModel.unitCode,
        reqModel.companyCode,
        reqModel.userId,
        packingListInfo.supplier_code
      );
      const supplierPoDetails: SupplierResponse = await this.supplierDataService.getSuppliersDataByCode(supplierPoDetailsReq);

      if (!supplierPoDetails.status) throw new ErrorResponse(1005, 'Supplier not found for the given criteria.');
      const packListSummaryModel = new PackingListSummaryModel(packingListInfo.id, packingListInfo.batch_count, packingListInfo.lot_count, packingListInfo.roll_count, packingListInfo.s_quantity, packingListInfo.i_q_uom, grnDetails?.in_at ? true : false, grnDetails?.in_at, grnDetails?.out_at, packingListInfo.pack_list_code, packingListInfo.pack_list_date, packingListInfo.delivery_date, packingListInfo.grn_status, packingListInfo.inspection_status, supplierPoDetails?.data?.supplierName, supplierPoDetails?.data?.supplierCode, '', supplierPoDetails?.data?.supplierCode, '', 0, grnDetails?.id, grnDetails?.vehicle_number, grnDetails?.in_at ? true : false, grnDetails?.unload_start_at, grnDetails?.unload_complete_at, grnDetails?.driver_name, grnDetails?.vehicle_contact);
      packingListsInfoForSpo.push(packListSummaryModel);
    }
    //return  `This action returns PackListSummery`;
    return new PackingListSummaryResponse(true, 1008, 'Packing list summary retrieved successfully', packingListsInfoForSpo);
  }


  /**
   * Service to change the status of the rolls which are already print has been completed.
   * @param reqModel 
   * @returns 
  */
  async printBarcodes(reqModel: PhBatchLotRollRequest): Promise<GlobalResponseObject> {
    const transactionalEntityManager = new GenericTransactionManager(this.dataSource);
    const unitCode = reqModel.unitCode;
    const companyCode = reqModel.companyCode;
    try {
      const stickersInfo = await this.phRepo.getPackingListItemLineInfo(reqModel);
      if (!stickersInfo.length) {
        throw new ErrorResponse(6236, 'Object Information not found for the given selection criteria.')
      }
      // UPDATING PRINT STATUS FOR GIVEN ROLL IDS
      await transactionalEntityManager.startTransaction();
      for (const eachSticker of stickersInfo) {
        await transactionalEntityManager.getRepository(PhItemLinesEntity).update({ id: eachSticker.roll_id, unitCode, companyCode }, { printStatus: true, updatedUser: reqModel.username });
        // NEED TO SAVE PH LINES PRINT HISTORY
        const phLinesHistory = new PhBarcodePrintHistoryEntity();
        phLinesHistory.action = eachSticker.print_status ? PhItemPrintStatus.REPRINT : PhItemPrintStatus.PRINT;
        phLinesHistory.companyCode = companyCode;
        phLinesHistory.createdUser = reqModel.username;
        phLinesHistory.phLinesId = eachSticker.roll_id;
        phLinesHistory.remarks = '';
        phLinesHistory.unitCode = unitCode;
        await transactionalEntityManager.getRepository(PhLinesHistoryEntity).save(phLinesHistory);
      }
      await transactionalEntityManager.completeTransaction();
      return new GlobalResponseObject(true, 6237, 'Print status updated successfully for the rolls');
    } catch (err) {
      transactionalEntityManager ? await transactionalEntityManager.releaseTransaction() : '';
      throw err;
    }
  }

  /**
   * Service to release the roll bar codes
   * @param reqModel 
   * @returns 
  */
  async releaseBarcodes(reqModel: PhBatchLotRollRequest): Promise<GlobalResponseObject> {
    const transactionalEntityManager = new GenericTransactionManager(this.dataSource);
    const unitCode = reqModel.unitCode;
    const companyCode = reqModel.companyCode;
    try {
      const stickersInfo = await this.phRepo.getPackingListItemLineInfo(reqModel);
      if (!stickersInfo.length) {
        throw new ErrorResponse(6238, 'Object Information not found for the given selection criteria.')
      }
      // UPDATING PRINT STATUS FOR GIVEN ROLL IDS
      await transactionalEntityManager.startTransaction();
      for (const eachSticker of stickersInfo) {
        await transactionalEntityManager.getRepository(PhItemLinesEntity).update({ id: eachSticker.roll_id, unitCode, companyCode }, { isReleased: true, printStatus: false, updatedUser: reqModel.username });
        // NEED TO SAVE PH LINES PRINT HISTORY
        const phLinesHistory = new PhBarcodePrintHistoryEntity();
        phLinesHistory.action = PhItemPrintStatus.RELEASE;
        phLinesHistory.companyCode = companyCode;
        phLinesHistory.createdUser = reqModel.username;
        phLinesHistory.phLinesId = eachSticker.roll_id;
        phLinesHistory.remarks = '';
        phLinesHistory.unitCode = unitCode;
        await transactionalEntityManager.getRepository(PhLinesHistoryEntity).save(phLinesHistory);
      }
      await transactionalEntityManager.completeTransaction();
      return new GlobalResponseObject(true, 6239, 'Print barcode released successfully for the rolls');
    } catch (err) {
      transactionalEntityManager ? await transactionalEntityManager.releaseTransaction() : '';
      throw err;
    }
  }

  /**
   * Service to check packing list exists ot not
   * @param phId 
   * @param unitCode 
   * @param companyCode 
   * @returns 
  */
  async checkPackingListExistsOrNot(phId: number, unitCode: string, companyCode: string): Promise<boolean> {
    const phDetail = await this.phRepo.findOne({ select: ['id'], where: { id: phId, unitCode, companyCode, isActive: true } });
    return phDetail ? true : false;
  }

  /**
   * Service to check packing list exists ot not
   * @param phId 
   * @param unitCode 
   * @param companyCode 
   * @returns 
  */
  async getGRNStatusForPackingList(phId: number, unitCode: string, companyCode: string): Promise<GrnStatusEnum> {
    const phDetail = await this.phRepo.findOne({ select: ['grnStatus'], where: { id: phId, unitCode, companyCode, isActive: true } });
    return phDetail?.grnStatus;
  }

  /**
   * Service to capture grn roll information for a given roll Id
   * @param rollId 
   * @param measuredWidth 
   * @param grnStatus 
   * @param inspectionPick 
   * @param unitCode 
   * @param companyCode 
  */
  async captureGrnRollInfoForRollId(rollId: number, measuredWidth: number, measuredWeight: number, grnStatus: PhLinesGrnStatusEnum, unitCode: string, companyCode: string): Promise<boolean> {
    const saveGrnDetail = await this.phItemLinesRepo.update({ id: rollId, unitCode, companyCode }, { measuredWidth: measuredWidth, measuredWeight: measuredWeight, grnStatus, grnDate: () => `Now()` });
    return saveGrnDetail.affected ? true : false;
  }
  /**
   * 
   * @param phId 
   * @param unitCode 
   * @param companyCode 
   * @param grnStatus 
   * @param updatedUser 
   * @returns 
   */
  async updateGrnStatusForPackList(phId: number, unitCode: string, companyCode: string, grnStatus: GrnStatusEnum, updatedUser: string, manager: GenericTransactionManager) {
    const saveGrnDetail = await manager.getRepository(PackingListEntity).update({ id: phId, unitCode, companyCode }, { grnStatus, updatedUser });
    return saveGrnDetail.affected ? true : false;
  }

  /**
     * Service to get roll grn info for roll Id
     * @param rollId 
     * @param uniCode 
     * @param companyCode 
     * @returns 
    */
  async getBasicRollInfoForRollId(rollId: number, uniCode: string, companyCode: string): Promise<BasicRollInfoQryResp> {
    return await this.phItemLinesRepo.getBasicRollInfoForRollId(rollId, uniCode, companyCode);
  }

  /**
       * SERVICE TO GET ROLL ID BY BARCODE
       * @param barcode 
       * @param uniCode 
       * @param companyCode 
       * @returns 
  */
  async getRollIdByBarcode(barcode: string, uniCode: string, companyCode: string): Promise<number> {
    return await this.phItemLinesRepo.getRollIdByBarcode(barcode, uniCode, companyCode)
  }
  /**
       * SERVICE TO GET ROLL ID BY BARCODE
       * @param barcode 
       * @param uniCode 
       * @param companyCode 
       * @returns 
  */
  async getSampleRollIdByBarcode(barcode: string, uniCode: string, companyCode: string): Promise<rollIdSampleIdQryResp> {
    return await this.phItemLinesSampleRepo.getSampleRollIdByBarcode(barcode, uniCode, companyCode)
  }

  /**
      * SERVICE TO GET ROLL ID BY BARCODE
      * @param barcode 
      * @param uniCode 
      * @param companyCode 
      * @returns 
 */
  async getSampleRollIdByRollId(rollId: number, uniCode: string, companyCode: string): Promise<rollIdSampleIdQryResp> {
    return await this.phItemLinesSampleRepo.getSampleRollIdByRollId(rollId, uniCode, companyCode)
  }

  /**
   * Service to update the inspection pick status for roll Id
   * @param rollId 
   * @param unitCode 
   * @param companyCode 
   * @returns 
  */
  async updatePickInspectionStatusForRollId(reqObj: RollIdsRequest): Promise<CommonResponse> {
    const updateResult = await this.phItemLinesRepo.update({ id: In([...reqObj.rollIds]), unitCode: reqObj.unitCode, companyCode: reqObj.companyCode }, { inspectionPick: true });
    return new CommonResponse(true, 23213, 'Inspection Status updated successfully');
  }

  /**
     * SERVICE TO GET ROLL QTY BY ROLL ID
     * @param barcode 
     * @param uniCode 
     * @param companyCode 
     * @returns 
    */
  async getRollQtyByRollId(rollId: number, uniCode: string, companyCode: string): Promise<number> {
    return await this.phItemLinesRepo.getRollQtyByRollId(rollId, uniCode, companyCode);
  }

  async getPackListsYetToComeSupplierWise(req: SupplierWisePackListsCountReqIdDto): Promise<SupplierWisePackListsCountResponse> {
    try {
      const result: any = await this.phRepo.getPackListsYetToComeSupplierWise(req.supplierCode);
      return new SupplierWisePackListsCountResponse(true, result.length, 'Supplier wise packlists data retrieved successfully', result);
    } catch (error) {
      throw new InternalServerErrorException('Error while retrieving supplier-wise packlists data.');
    }
  }


  // async getFabricInwardDetails(req: any): Promise<FabricInwardDetailsResponse> {
  //   const result: any[] = await this.phRepo.getFabricInwardDetails();
  //   for (let i = 0; i < result.length; i++) {
  //     const data: any[] = await this.spoItemsRepo.getSupplierAndStyleData(result[i]?.poNo);
  //     console.log(data[i]?.style, '345', result[i]?.poNo)

  //     result[i].style = data[i]?.style;
  //     result[i].supplierCode = data[i]?.supplierCode;
  //     result[i].deliveryDate = moment(result[i]?.deliveryDate).format('YYYY-MM-DD')
  //   }
  //   if (result.length === 0) {
  //     throw new ErrorResponse(965, "Data not Found")
  //   } else {
  //     return new FabricInwardDetailsResponse(true, 967, 'Data Retrieved successfully', result);

  //   }
  // } 
  /**
   * 
   * @param reqObj 
   * @returns 
  */
  async getRollsBasicInfoForRollIds(reqObj: RollIdsRequest): Promise<RollBasicInfoResponse> {
    const rollInfo = await this.infoService.getRollsBasicInfoForRollIds(reqObj.companyCode, reqObj.unitCode, reqObj.rollIds);
    return new RollBasicInfoResponse(true, 0, 'Object Info Retried successfully ', rollInfo)
  }

  async getAllActivePackingList(req: CommonRequestAttrs): Promise<CommonResponse> {
    try {
      const result: any = await this.phRepo.getPackListInfo(req.unitCode, req.companyCode);
      return new CommonResponse(true, result.length, 'All Packing List info Retrieved', result);
    } catch (error) {
      throw new InternalServerErrorException('Error while retrievingPacking List info.');
    }
  }

  async getMoItemQty(req: ManufacturingOrderItemRequest): Promise<ManufacturingOrderItemDataResponse> {
    const manufacturingOrderReq = new ManufacturingOrderNumberRequest(req.username, req.unitCode, req.companyCode, req.userId, [req.manufacturingOrderCode])
    //TODO: WMS-MO-DUMP
    // const data = await this.spoItemsRepo.getManufacturingOrderLevelInformation(slaeOrderReq);
    const data: any = []
    console.log(data);
    if (data.length == 0) {
      throw new ErrorResponse(1005, 'Manfacturing order Data Not Available.');
    }
    const totPos = [];
    const itemPoQtyMap = new Map<string, number>();
    req.itemCode.forEach(item => {
      const itemData = data.find(eachItem => eachItem.itemCode === item);
      totPos.push(itemData.poNumber);
      if (!itemPoQtyMap.has(item)) {
        itemPoQtyMap.set(item, 0);
      }
      const prevQty = itemPoQtyMap.get(item);
      itemPoQtyMap.set(item, prevQty + Number(itemData.itemQty))

    })
    const resultItemData = await this.phItemLinesRepo.getItemLevelQtyInfo(req.unitCode, req.companyCode, totPos, req.itemCode);
    const MoItemResultModel: ManufacturingOrderItemDataModel[] = [];
    for (const itemDataDetails of resultItemData) {
      const itemPoQty = itemPoQtyMap.get(itemDataDetails.itemCode);
      const eachItem = new ManufacturingOrderItemDataModel(req.manufacturingOrderCode, itemDataDetails.itemCode, itemDataDetails.itemName, itemDataDetails.itemDesc, itemPoQty.toString(), itemDataDetails.packRollQty, itemDataDetails.grnQty, itemDataDetails.allocQty, itemDataDetails.issueQty);
      MoItemResultModel.push(eachItem);
    }
    return new ManufacturingOrderItemDataResponse(true, 0, 'Item Level Data retrived', MoItemResultModel);
  }

  /**
 * Service to save security check in details 
 * @param reqModel 
 * @returns 
*/
  async checkPackingListEligibleForSecurityCheckIn(reqModel: SecurityCheckRequest): Promise<boolean> {
    try {
      const unitCode = reqModel.unitCode;
      const companyCode = reqModel.companyCode;
      // Check Packing list Id exists or not
      const packingListDetail: PackingListEntity = await this.phRepo.findOne({ where: { id: reqModel.phId, unitCode, companyCode } });
      if (!packingListDetail) {
        throw new ErrorResponse(1005, 'Packing lists not found for the given criteria.');
      }
      const truckInfo = await this.grnService.getVehicleRecordForPackListId(reqModel.phId);
      // Check security check in already happened for the packing list or not
      if (truckInfo) {
        throw new ErrorResponse(1007, 'Packing list already checked In. Please Verify.')
      }
      return true;
    } catch (err) {
      throw err;
    }
  }

  /**
   * Service to save security check in details 
   * @param reqModel 
   * @returns 
  */
  async checkPackingListEligibleForSecurityCheckOut(reqModel: SecurityCheckRequest): Promise<boolean> {
    try {
      const unitCode = reqModel.unitCode;
      const companyCode = reqModel.companyCode;
      // Check Packing list Id exists or not
      const packingListDetail: PackingListEntity = await this.phRepo.findOne({ where: { id: reqModel.phId, unitCode, companyCode } });
      if (!packingListDetail) {
        throw new ErrorResponse(1005, 'Packing lists not found for the given criteria.');
      }
      const truckInfo = await this.grnService.getVehicleRecordForPackListId(reqModel.phId);
      // Check security check in already happened for the packing list or not
      if (!truckInfo) {
        throw new ErrorResponse(1013, 'Packing list not yet checked In. Please Verify.');
      }
      return true;
    } catch (err) {
      throw err;
    }
  }

  async updatePackListArrivalStatus(packListId: number, transManager: GenericTransactionManager): Promise<boolean> {
    await transManager.getRepository(PackingListEntity).update({ id: packListId }, { arrived: true });
    return true;
  }

  async getDistinctItemInfoByCategory(reqModel: ItemCategoryReqModel): Promise<ItemInfoQryRespModel> {
    try {
      const data = await this.phItemsRepo.getDistinctItemInfoByCategory(reqModel.itemCategory, reqModel.unitCode, reqModel.companyCode);
      return new ItemInfoQryRespModel(true, 0, 'Success', data);
    } catch (error) {
      return new ItemInfoQryRespModel(false, 500, 'Failed to fetch distinct item info', []);
    }
  }
}
