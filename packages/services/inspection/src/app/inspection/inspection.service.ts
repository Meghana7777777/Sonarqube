import { Injectable } from '@nestjs/common';
import { ErrorResponse } from '@xpparel/backend-utils';
import { ActivityStatusEnum, GlobalResponseObject, InsAttributeNameValueModel, InsBasicInspectionRequest, InsFabricInspectionRequestCategoryEnum, InsGetInspectionHeaderRollInfoResp, InsInspectionActivityStatusEnum, InsInspectionCreateRequest, InsInspectionFinalInSpectionStatusEnum, InsInspectionHeaderAttributes, InsIrActivityChangeRequest, InsLabInspectionRequest, InsRelaxationInspectionRequest, InsRollInspectionInfo, InsShadeInspectionRequest, InsShrinkageInspectionRequest, InsTypesEnum } from '@xpparel/shared-models';
import moment from 'moment';
import { DataSource } from 'typeorm';
import { GenericTransactionManager } from '../../database/typeorm-transactions';
import { InsRequestAttributeEntity } from '../entities/ins-request-attributes.entity';
import { InsRequestItemEntity } from '../entities/ins-request-items.entity';
import { InsRequestRevisionEntity } from '../entities/ins-request-revision.entity';
import { InsRequestEntity } from '../entities/ins-request.entity';
import { InsRequestAttributeRepo } from './repositories/ins-request-attributes.repository';
import { InsRequestItemRepo } from './repositories/ins-request-items.repository';
import { InsRequestEntityRepo } from './repositories/ins-request.repository';
import { InspReqStatusQryResp } from './repositories/query-response/insp-req-status.qry-resp';

@Injectable()
export class InspectionService {
  private inspectionCatsForAllRows = [InsFabricInspectionRequestCategoryEnum.SHADE_SEGREGATION, InsFabricInspectionRequestCategoryEnum.RELAXATION];
  constructor(
    private dataSource: DataSource,
    private inspReqRepo: InsRequestEntityRepo,
    private inspAttributesRepo: InsRequestAttributeRepo,
    private inspReqItemsRepo: InsRequestItemRepo,
  ) {

  }
  /**
   * Service to get roll to inspection request id mapping entities
   * @param rollIds 
   * @param batchNo 
   * @param inspReqId 
   * @param itemCode 
   * @param lotNumber 
   * @param unitCode 
   * @param companyCode 
   * @param username 
   * @returns 
   */
  async getRollsToInspectionRequestIdMappingEntities(rollIds: number[], batchNo: string, inspReqId: number, itemCode: string, lotNumber: string, unitCode: string, companyCode: string, username: string): Promise<InsRequestItemEntity[]> {

    // const codes: RollSoAbtractInfoQueryResponse[] = await this.phItemLinesRepo.getSoAbstractInfoForRollIds(unitCode, companyCode, rollIds);

    // const styleCodesAndRollIds = codes.reduce((acc, code) => {
    //   acc[code.rollId] = code.style;
    //   return acc;
    // }, {} as Record<string, string>);
    const mappingEntities: InsRequestItemEntity[] = [];
    for (const eachRoll of rollIds) {
      const inspReqItem = new InsRequestItemEntity();
      // inspReqItem.acceptance = null;
      // inspReqItem.acceptedQuantity = 0;
      // inspReqItem.batchNumber = batchNo;
      inspReqItem.companyCode = companyCode;
      inspReqItem.createdUser = username;
      // inspReqItem.insCompletedAt = null;
      inspReqItem.insRequestId = inspReqId;
      // inspReqItem.insStartedAt = null;
      // inspReqItem.inspectionPerson = null;
      // inspReqItem.inspectionResult = InspectionResultEnum.OPEN;
      inspReqItem.inspectionResult = InsInspectionFinalInSpectionStatusEnum.OPEN;
      // inspReqItem.finalInspectionResult = InsInspectionFinalInSpectionStatusEnum.OPEN;

      // inspReqItem.itemCode = itemCode;
      // inspReqItem.lotNumber = lotNumber;
      // inspReqItem.objectType = PhItemLinesObjectTypeEnum.ROLL;
      // inspReqItem.phItemLineSampleId = reqModel.requestCategory == FabricInspectionRequestCategoryEnum.SHRINKAGE ? (await this.packingListService.getSampleRollIdByRollId(eachRoll, unitCode, companyCode)).sample_roll_id : null;
      // inspReqItem.phItemLineSampleId = null;
      inspReqItem.insRequestLineId = eachRoll;
      // inspReqItem.quantity = await this.packingListService.getRollQtyByRollId(eachRoll, unitCode, companyCode);
      inspReqItem.remarks = null;
      inspReqItem.unitCode = unitCode;
      // inspReqItem.workstationCode = null;
      // inspReqItem.styleNumber = styleCodesAndRollIds[eachRoll] || "";
      mappingEntities.push(inspReqItem);
    }
    return mappingEntities;
  }

  /**
   * 
   * @param inspReqId 
   * @param unitCode 
   * @param companyCode 
   * @param username 
   * @returns 
  */
  async getAndSaveAttributesForInspReqId(inspReqId: number, unitCode: string, companyCode: string, username: string) {
    const manager = new GenericTransactionManager(this.dataSource);
    try {
      const attributes: InsRequestAttributeEntity[] = [];
      const inspHeaderEntityObj = await this.inspReqRepo.findOne({ where: { id: inspReqId, unitCode, companyCode } });
      // const vehicleInfo = await this.grnService.getPackListVehicleInfo(inspHeaderEntityObj.phId, unitCode, companyCode);
      // const packListCode = await this.packingListInfoService.getPackingListNumberById(inspHeaderEntityObj.phId, unitCode, companyCode);
      await manager.startTransaction();
      // if (inspHeaderEntityObj.lotNumber) {
      //   const productDetails = await this.packingListInfoService.getProductDetailsByLotNumber(inspHeaderEntityObj.lotNumber, unitCode, companyCode);
      //   attributes.push(this.getAttributesEntity(InspectionHeaderAttributes.STYLE_NO, productDetails.styles.toString(), unitCode, companyCode, username, inspHeaderEntityObj.id));
      //   attributes.push(this.getAttributesEntity(InspectionHeaderAttributes.STYLE_DESC, productDetails.styleDesc.toString(), unitCode, companyCode, username, inspHeaderEntityObj.id));
      //   attributes.push(this.getAttributesEntity(InspectionHeaderAttributes.CUSTOMER_STYLE, productDetails.customerStyle.toString(), unitCode, companyCode, username, inspHeaderEntityObj.id));
      //   attributes.push(this.getAttributesEntity(InspectionHeaderAttributes.BUYER, productDetails.buyers.toString(), unitCode, companyCode, username, inspHeaderEntityObj.id));
      //   attributes.push(this.getAttributesEntity(InspectionHeaderAttributes.COLOR, productDetails.colors.toString(), unitCode, companyCode, username, inspHeaderEntityObj.id));
      //   attributes.push(this.getAttributesEntity(InspectionHeaderAttributes.SUPPLIER, productDetails.suppliers.toString(), unitCode, companyCode, username, inspHeaderEntityObj.id));
      //   attributes.push(this.getAttributesEntity(InspectionHeaderAttributes.FABRIC_DESCRIPTION, productDetails.itemDesc, unitCode, companyCode, username, inspHeaderEntityObj.id));
      //   attributes.push(this.getAttributesEntity(InspectionHeaderAttributes.INVOICE_NO, vehicleInfo.invoice_no, unitCode, companyCode, username, inspHeaderEntityObj.id));
      //   attributes.push(this.getAttributesEntity(InspectionHeaderAttributes.PO_NO, productDetails.poNumber, unitCode, companyCode, username, inspHeaderEntityObj.id));
      //   attributes.push(this.getAttributesEntity(InspectionHeaderAttributes.MILL_SHADE, productDetails.millShade, unitCode, companyCode, username, inspHeaderEntityObj.id));
      //   attributes.push(this.getAttributesEntity(InspectionHeaderAttributes.PACKING_LIST_NUMBER, packListCode, unitCode, companyCode, username, inspHeaderEntityObj.id));
      // }
      await manager.getRepository(InsRequestAttributeEntity).save(attributes);
      await manager.completeTransaction();
      return true;
    } catch (err) {
      await manager.releaseTransaction();
      throw err;
    }
  }


  getAttributesEntity(attName: InsInspectionHeaderAttributes, attValue: string, unitCode: string, companyCode: string, userName: string, inspId: number) {
    const inspReqAttributes = new InsRequestAttributeEntity();
    inspReqAttributes.attributeName = attName;
    inspReqAttributes.attributeValue = attValue;
    inspReqAttributes.companyCode = companyCode;
    inspReqAttributes.createdUser = userName;
    inspReqAttributes.insRequestId = inspId;
    inspReqAttributes.unitCode = unitCode;
    return inspReqAttributes;
  }

  /**
   * Service to get inspection details for pack list and lot
   * @param packListId 
   * @param lotNumber 
   * @param unitCode 
   * @param companyCode 
   * @returns 
   */
  async getInspectionDetailsForLot(packListId: number, lotNumber: string, unitCode: string, companyCode: string): Promise<InspReqStatusQryResp[]> {
    return await this.inspReqRepo.getInspectionDetailsForLot(packListId, lotNumber, unitCode, companyCode);
  }

  /**
   * Service to get inspection details for a request Id
   * @param inspReqId 
   * @param unitCode 
   * @param companyCode 
   * @param rollId 
  */
  async getInspectionDetailsForRequestId(inspReqId: number, unitCode: string, companyCode: string, rollId?: number, rollSampleId?: number): Promise<InsGetInspectionHeaderRollInfoResp> {
    const inspectDetails = await this.inspReqRepo.findOne({ where: { id: inspReqId, unitCode, companyCode } });
    if (!inspectDetails) {
      throw new ErrorResponse(1038, 'Inspection details not found for given inspection header Id');
    }
    if (inspectDetails.insActivityStatus != InsInspectionActivityStatusEnum.INPROGRESS) {
      throw new ErrorResponse(1052, 'Inspection not yet started, Please start the inspection in the board.')
    }
    const inspectedResults = await this.inspReqItemsRepo.getInspectedQtyByInspReqId(inspectDetails.id, unitCode, companyCode);

    const inspectionAttributes = await this.inspAttributesRepo.find({ where: { insRequestId: inspReqId, unitCode, companyCode } });
    const attributeInfo = inspectionAttributes.map((att) => {
      return new InsAttributeNameValueModel(att.attributeName, att.attributeValue);
    });

    // const sysPerf = await this.grnService.getSystemPreferenceForPackListId(inspectDetails.phId, unitCode, companyCode);

    // if (!sysPerf.status) {
    //   throw new ErrorResponse(1037, 'GRN Details not found for the given pack list. Please verify')
    // }

    // const totalNoOfRequestRolls: number = (await this.inspReqItemsRepo.getInspectionQtyByInspReqId(inspReqId, unitCode, companyCode)).no_of_rolls;

    // const totalNoOfBatchRolls: number = await this.packingListInfoService.getRollCountByBatchNo(inspectDetails.batchNumber, unitCode, companyCode);

    const totalNoOfInspectedRolls: number = inspectedResults.no_of_rolls;

    // const inspectionPercentage: number = sysPerf.data.rollsPickPercentage;

    const inspectionQty = (await this.inspReqItemsRepo.getInspectionQtyByInspReqId(inspReqId, unitCode, companyCode)).inspected_qty;

    // const inspHeaderInfo = new InsCommonInspectionHeaderInfo(inspectDetails.id, inspectDetails.insType, inspectDetails.refJobL1, totalNoOfBatchRolls, totalNoOfRequestRolls, totalNoOfInspectedRolls
    //   , inspectionPercentage, inspectDetails.refJobL2, inspectionQty, inspectedResults.inspected_qty, inspectDetails.insCreationTime, inspectDetails.materialReceiveAt, inspectDetails.insCompletedAt, inspectDetails.inspector, inspectDetails.finalInspectionStatus,  attributeInfo, inspectDetails.createReRequest, inspectDetails.lab);

    let shadeInsInfo: InsShadeInspectionRequest = null;
    let basicInsInfo: InsBasicInspectionRequest = null;
    let labInsInfo: InsLabInspectionRequest = null;
    let shrinkageInfo: InsShrinkageInspectionRequest = null;
    let relaxationInfo: InsRelaxationInspectionRequest = null;
    const inspectedRolls = rollId ? await this.inspReqItemsRepo.find({ where: { insRequestId: inspectDetails.id, unitCode, companyCode, insRequestLineId: rollId } }) : await this.inspReqItemsRepo.find({ where: { insRequestId: inspectDetails.id, unitCode, companyCode } });
    if (!inspectedRolls.length) {
      throw new ErrorResponse(1039, 'Inspection objects not found for given inspection header Id');
    }
    if (inspectDetails.insType == InsTypesEnum.INSPECTION) {
      basicInsInfo = new InsBasicInspectionRequest();
      // basicInsInfo.inspectionHeader = inspHeaderInfo;
      basicInsInfo.inspectionRollDetails = [];
      for (const eachRoll of inspectedRolls) {
        // const fourPointInfo = await this.packingListActualInfoService.getFourPointDetailsForRoll(eachRoll.insRequestLineId, unitCode, companyCode);
        // // get the actual four points width
        // const atualRollInfo = await this.packingListActualInfoService.getItemLineActualRecord(eachRoll.insRequestLineId, unitCode, companyCode);
        // const rollBasicInfo: BasicRollInfoQryResp = await this.packingListService.getBasicRollInfoForRollId(eachRoll.insRequestLineId, unitCode, companyCode);
        // const inspectionDetails = new InsBasicInspectionRollDetails(eachRoll.insRequestLineId, rollBasicInfo.object_ext_no, rollBasicInfo.barcode, rollBasicInfo.qr_code, eachRoll.lotNumber, eachRoll.quantity, rollBasicInfo.s_width, eachRoll.inspectionResult, eachRoll.finalInspectionStatus, fourPointInfo, eachRoll.acceptance, eachRoll.acceptedQuantity, eachRoll.remarks, atualRollInfo?.fourPointsWidth, atualRollInfo?.fourPointsLength, rollBasicInfo.s_shade);
        // basicInsInfo.inspectionRollDetails.push(inspectionDetails);
      } 
    }
    if (inspectDetails.insType == InsTypesEnum.LAB_INSPECTION) {
      labInsInfo = new InsLabInspectionRequest();
      // labInsInfo.inspectionHeader = inspHeaderInfo;
      labInsInfo.inspectionRollDetails = [];
      for (const eachRoll of inspectedRolls) {
        // const gsmInfo = await this.packingListActualInfoService.geItemLineActualForGsm(eachRoll.insRequestLineId, unitCode, companyCode);
        // gsmInfo.remarks = eachRoll.remarks;
        // gsmInfo.rollFinalInsResult = eachRoll.finalInspectionStatus;
        // gsmInfo.rollInsResult = eachRoll.inspectionResult;
        // labInsInfo.inspectionRollDetails.push(gsmInfo);
      }
    }
    if (inspectDetails.insType == InsTypesEnum.RELAXATION) {
      relaxationInfo = new InsRelaxationInspectionRequest();
      // relaxationInfo.inspectionHeader = inspHeaderInfo;
      relaxationInfo.inspectionRollDetails = [];
      for (const eachRoll of inspectedRolls) {
        // const relaxationDetails = await this.packingListActualInfoService.getItemLineActualForRelaxation(eachRoll.insRequestLineId, unitCode, companyCode);
        // relaxationDetails.rollInsResult = eachRoll.inspectionResult;
        // relaxationDetails.rollFinalInsResult = eachRoll.finalInspectionStatus;
        // relaxationDetails.remarks = eachRoll.remarks;
        // relaxationInfo.inspectionRollDetails.push(relaxationDetails);
      }
    }
    if (inspectDetails.insType == InsTypesEnum.SHADE_SEGREGATION) {
      shadeInsInfo = new InsShadeInspectionRequest();
      // shadeInsInfo.inspectionHeader = inspHeaderInfo;
      shadeInsInfo.inspectionRollDetails = [];
      for (const eachRoll of inspectedRolls) {
        // const shadeDetails = await this.packingListActualInfoService.getItemLineActualForShade(eachRoll.insRequestLineId, unitCode, companyCode);
        // shadeDetails.remarks = eachRoll.remarks;
        // shadeDetails.rollInsResult = eachRoll.inspectionResult;
        // shadeDetails.rollFinalInsResult = eachRoll.finalInspectionResult;
        // shadeInsInfo.inspectionRollDetails.push(shadeDetails);
      }
    }
    if (inspectDetails.insType == InsTypesEnum.SHRINKAGE) {
      shrinkageInfo = new InsShrinkageInspectionRequest();
      // shrinkageInfo.inspectionHeader = inspHeaderInfo;
      shrinkageInfo.inspectionRollDetails = [];
      for (const eachRoll of inspectedRolls) {
        // const shrinkageDetails = await this.packingListActualInfoService.getItemLineActualForShrinkage(eachRoll.insRequestLineId, eachRoll.insRequestLineId, unitCode, companyCode);
        // shrinkageDetails.rollInfo.rollFinalInsResult = eachRoll.finalInspectionStatus;
        // shrinkageDetails.rollInfo.rollInsResult = eachRoll.inspectionResult;
        // shrinkageInfo.inspectionRollDetails.push(shrinkageDetails);
      }
    }
    const rollInfo = new InsRollInspectionInfo(shadeInsInfo, basicInsInfo, labInsInfo, shrinkageInfo, relaxationInfo);
    return new InsGetInspectionHeaderRollInfoResp(true, 1041, 'Inspection header and object info received successfully', rollInfo)
  }

  /**
   * Service to get inspection details for a request Id
   * @param inspReqId 
   * @param unitCode 
   * @param companyCode 
   * @param rollId 
  */
  async getInspectionDetailsForRequestIdReport(inspReqId: number, unitCode: string, companyCode: string, rollId?: number, rollSampleId?: number): Promise<InsGetInspectionHeaderRollInfoResp> {
    const inspectDetails = await this.inspReqRepo.findOne({ where: { id: inspReqId, unitCode, companyCode } });
    // if (!inspectDetails) {
    //   throw new ErrorResponse(1038, 'Inspection details not found for given inspection header Id');
    // }
    // if (inspectDetails.insActivityStatus != InspectionInsActivityStatusEnum.INPROGRESS) {
    //   throw new ErrorResponse(1052, 'Inspection not yet started, Please start the inspection in the board.')
    // }
    const inspectedResults = await this.inspReqItemsRepo.getInspectedQtyByInspReqId(inspectDetails.id, unitCode, companyCode);

    const inspectionAttributes = await this.inspAttributesRepo.find({ where: { insRequestId: inspReqId, unitCode, companyCode } });
    const attributeInfo = inspectionAttributes.map((att) => {
      return new InsAttributeNameValueModel(att.attributeName, att.attributeValue);
    });

    // const sysPerf = await this.grnService.getSystemPreferenceForPackListId(inspectDetails.phId, unitCode, companyCode);

    // if (!sysPerf.status) {
    //   throw new ErrorResponse(1037, 'GRN Details not found for the given pack list. Please verify')
    // }

    const totalNoOfRequestRolls: number = (await this.inspReqItemsRepo.getInspectionQtyByInspReqId(inspReqId, unitCode, companyCode)).no_of_rolls;

    // const totalNoOfBatchRolls: number = await this.packingListInfoService.getRollCountByBatchNo(inspectDetails.batchNumber, unitCode, companyCode);

    const totalNoOfInspectedRolls: number = inspectedResults.no_of_rolls;

    // const inspectionPercentage: number = sysPerf.data.rollsPickPercentage;

    const inspectionQty = (await this.inspReqItemsRepo.getInspectionQtyByInspReqId(inspReqId, unitCode, companyCode)).inspected_qty;

    // const inspHeaderInfo = new CommonInspectionHeaderInfo(inspectDetails.id, inspectDetails.requestCategory, inspectDetails.batchNumber, totalNoOfBatchRolls, totalNoOfRequestRolls, totalNoOfInspectedRolls
    //   , inspectionPercentage, inspectDetails.lotNumber, inspectDetails.batchQty, inspectionQty, inspectedResults.inspected_qty, inspectDetails.insCreationTime, inspectDetails.materialReceiveAt, inspectDetails.insCompletedAt, inspectDetails.expInsCompletedAt, inspectDetails.inspector, inspectDetails.finalInspectionStatus, inspectDetails.fabricComposition, inspectDetails.lab, attributeInfo, inspectDetails.createReRequest);

    let shadeInsInfo: InsShadeInspectionRequest = null;
    let basicInsInfo: InsBasicInspectionRequest = null;
    let labInsInfo: InsLabInspectionRequest = null;
    let shrinkageInfo: InsShrinkageInspectionRequest = null;
    let relaxationInfo: InsRelaxationInspectionRequest = null;
    const inspectedRolls = rollId ? await this.inspReqItemsRepo.find({ where: { insRequestId: inspectDetails.id, unitCode, companyCode, insRequestLineId: rollId } }) : await this.inspReqItemsRepo.find({ where: { insRequestId: inspectDetails.id, unitCode, companyCode } });
    if (!inspectedRolls.length) {
      throw new ErrorResponse(1039, 'Inspection objects not found for given inspection header Id');
    }
    if (inspectDetails.insType == InsTypesEnum.INSPECTION) {
      basicInsInfo = new InsBasicInspectionRequest();
      // basicInsInfo.inspectionHeader = inspHeaderInfo;
      basicInsInfo.inspectionRollDetails = [];
      for (const eachRoll of inspectedRolls) {
        // const fourPointInfo = await this.packingListActualInfoService.getFourPointDetailsForRoll(eachRoll.insRequestLineId, unitCode, companyCode);
        // // get the actual four points width
        // const atualRollInfo = await this.packingListActualInfoService.getItemLineActualRecord(eachRoll.insRequestLineId, unitCode, companyCode);
        // const rollBasicInfo: BasicRollInfoQryResp = await this.packingListService.getBasicRollInfoForRollId(eachRoll.insRequestLineId, unitCode, companyCode);
        // const inspectionDetails = new BasicInspectionRollDetails(eachRoll.insRequestLineId, rollBasicInfo.object_ext_no, rollBasicInfo.barcode, rollBasicInfo.qr_code, eachRoll.lotNumber, eachRoll.quantity, rollBasicInfo.s_width, eachRoll.inspectionResult, eachRoll.finalInspectionResult, fourPointInfo, eachRoll.acceptance, eachRoll.acceptedQuantity, eachRoll.remarks, atualRollInfo?.fourPointsWidth, atualRollInfo?.fourPointsLength, rollBasicInfo.s_shade);
        // basicInsInfo.inspectionRollDetails.push(inspectionDetails);
      } ``
    }
    if (inspectDetails.insType == InsTypesEnum.LAB_INSPECTION) {
      labInsInfo = new InsLabInspectionRequest();
      // labInsInfo.inspectionHeader = inspHeaderInfo;
      labInsInfo.inspectionRollDetails = [];
      for (const eachRoll of inspectedRolls) {
        // const gsmInfo = await this.packingListActualInfoService.geItemLineActualForGsm(eachRoll.insRequestLineId, unitCode, companyCode);
        // gsmInfo.remarks = eachRoll.remarks;
        // gsmInfo.rollFinalInsResult = eachRoll.finalInspectionResult;
        // gsmInfo.rollInsResult = eachRoll.inspectionResult;
        // labInsInfo.inspectionRollDetails.push(gsmInfo);
      }
    }
    if (inspectDetails.insType == InsTypesEnum.RELAXATION) {
      relaxationInfo = new InsRelaxationInspectionRequest();
      // relaxationInfo.inspectionHeader = inspHeaderInfo;
      relaxationInfo.inspectionRollDetails = [];
      for (const eachRoll of inspectedRolls) {
        // const relaxationDetails = await this.packingListActualInfoService.getItemLineActualForRelaxation(eachRoll.insRequestLineId, unitCode, companyCode);
        // relaxationDetails.rollInsResult = eachRoll.inspectionResult;
        // relaxationDetails.rollFinalInsResult = eachRoll.finalInspectionResult;
        // relaxationDetails.remarks = eachRoll.remarks;
        // relaxationInfo.inspectionRollDetails.push(relaxationDetails);
      }
    }
    if (inspectDetails.insType == InsTypesEnum.SHADE_SEGREGATION) {
      shadeInsInfo = new InsShadeInspectionRequest();
      // shadeInsInfo.inspectionHeader = inspHeaderInfo;
      shadeInsInfo.inspectionRollDetails = [];
      for (const eachRoll of inspectedRolls) {
        // const shadeDetails = await this.packingListActualInfoService.getItemLineActualForShade(eachRoll.insRequestLineId, unitCode, companyCode);
        // shadeDetails.remarks = eachRoll.remarks;
        // shadeDetails.rollInsResult = eachRoll.inspectionResult;
        // shadeDetails.rollFinalInsResult = eachRoll.finalInspectionResult;
        // shadeInsInfo.inspectionRollDetails.push(shadeDetails);
      }
    }
    if (inspectDetails.insType == InsTypesEnum.SHRINKAGE) {
      shrinkageInfo = new InsShrinkageInspectionRequest();
      // shrinkageInfo.inspectionHeader = inspHeaderInfo;
      shrinkageInfo.inspectionRollDetails = [];
      for (const eachRoll of inspectedRolls) {
        // const shrinkageDetails = await this.packingListActualInfoService.getItemLineActualForShrinkage(eachRoll.insRequestLineId, eachRoll.phItemLineSampleId, unitCode, companyCode);
        // shrinkageDetails.rollInfo.rollFinalInsResult = eachRoll.finalInspectionResult;
        // shrinkageDetails.rollInfo.rollInsResult = eachRoll.inspectionResult;
        // shrinkageInfo.inspectionRollDetails.push(shrinkageDetails);
      }
    }
    const rollInfo = new InsRollInspectionInfo(shadeInsInfo, basicInsInfo, labInsInfo, shrinkageInfo, relaxationInfo);
    return new InsGetInspectionHeaderRollInfoResp(true, 1041, 'Inspection header and object info received successfully', rollInfo)
  }

  /**
   * Service end point to create re request for request header
   * @param insRequestId 
   * @param unitCode 
   * @param companyCode 
   * @param userName 
  */
  async createReRequestHeaderForGivenRequestIdWithOutManager(insRequestId: number, unitCode: string, companyCode: string, userName: string): Promise<boolean> {
    const manager = new GenericTransactionManager(this.dataSource);
    try {
      await manager.startTransaction();
      await this.createReRequestHeaderForGivenRequestId(insRequestId, unitCode, companyCode, userName, manager);
      await manager.completeTransaction();
      return true;
    } catch (err) {
      await manager.releaseTransaction();
      throw err;
    }
  }

  /**
   * Service to crate re request for the request Id
   * @param insRequestId 
   * @param unitCode 
   * @param companyCode 
   * @param userName 
   * @returns 
  */
  async createReRequestHeaderForGivenRequestId(insRequestId: number, unitCode: string, companyCode: string, userName: string, manager: GenericTransactionManager): Promise<boolean> {
    try {
      // check inspection request exists or not
      const headerDetail: InsRequestEntity = await manager.getRepository(InsRequestEntity).findOne({ where: { id: insRequestId, unitCode, companyCode } });
      if (!headerDetail) {
        throw new ErrorResponse(1048, 'Inspection Request details not found for given request Id, Please verify')
      }
      if (headerDetail.finalInspectionStatus != InsInspectionFinalInSpectionStatusEnum.FAIL) {
        throw new ErrorResponse(1053, '"Reinspection requests can only be created for failed inspection requests.');
      }
      // const sysPerf = await this.grnService.getSystemPreferenceForPackListId(headerDetail.phId, unitCode, companyCode);

      // if (!sysPerf.status) {
      //   throw new ErrorResponse(1037, 'GRN Details not found for the given pack list. Please verify')
      // }
      const revisionEntity = new InsRequestRevisionEntity();
      revisionEntity.companyCode = companyCode;
      revisionEntity.createdUser = userName;
      revisionEntity.insRequestId = insRequestId;
      // revisionEntity.percentage = sysPerf.data.rollsPickPercentage;
      // revisionEntity.rollSelectionType = sysPerf.data.rollSelectionType;
      revisionEntity.unitCode = unitCode;
      const revId = await manager.getRepository(InsRequestRevisionEntity).save(revisionEntity);
      const inspCreateReq = new InsInspectionCreateRequest(userName, unitCode, companyCode, 0, Number(headerDetail.refIdL1), headerDetail.refJobL1, headerDetail.inspectionLevel,''
      //  headerDetail.refNumber
       , [],
          headerDetail.insType as unknown as InsFabricInspectionRequestCategoryEnum,0,
          // headerDetail.sla,
           [],0,0 
          //  headerDetail.lotQty, headerDetail.batchQty

        );
      // await this.createInspectionRequestForInspCategory(inspCreateReq, manager, insRequestId, revId.id)
      return true;
    } catch (err) {
      throw err;
    }

  }

  /**
   * Service to map roll Ids to the Inspection  request
   * @param insRequestId 
   * @param unitCode 
   * @param companyCode 
   * @param userName 
   * @param rollIds 
   * @returns 
  */
  async mapRollIdsToInspectionRequest(insRequestId: number, unitCode: string, companyCode: string, userName: string, rollIds: number[]): Promise<GlobalResponseObject> {
    const manager = new GenericTransactionManager(this.dataSource);
    try {
      // check inspection request exists or not
      const headerDetail: InsRequestEntity = await this.inspReqRepo.findOne({ where: { id: insRequestId, unitCode, companyCode } });
      if (!headerDetail) {
        throw new ErrorResponse(1048, 'Inspection Request details not found for given request Id, Please verify')
      }
      if (headerDetail.insActivityStatus != InsInspectionActivityStatusEnum.OPEN) {
        throw new ErrorResponse(1052, 'Inspection not yet started, Please start the inspection in the board.')
      }
      const headerItems = await this.inspReqItemsRepo.find({ where: { insRequestId: insRequestId, unitCode, companyCode } });
      if (headerItems.length) {
        throw new ErrorResponse(1055, 'objects already mapped to the inspection request, Please check');
      }
      // const itemInfo = await this.packingListInfoService.getItemInfoByLotNumber(headerDetail.lotNumber, unitCode, companyCode)
      // await manager.startTransaction();
      // const rollMapping: InsRequestItemEntity[] = await this.getRollsToInspectionRequestIdMappingEntities(rollIds, headerDetail.batchNumber, insRequestId, itemInfo.item_code, headerDetail.lotNumber, unitCode, companyCode, userName);
      // await manager.getRepository(InsRequestItemEntity).save(rollMapping);
      const date = moment(new Date()).format('YYYY-MM-DD');
      const reqObj = new InsIrActivityChangeRequest(userName, unitCode, companyCode, 0, insRequestId, date, InsInspectionActivityStatusEnum.MATERIAL_RECEIVED, '');
      // await this.inspectionInfoService.updateInspectionActivityStatus(reqObj);
      await manager.completeTransaction();


      return new GlobalResponseObject(true, 1056, 'objects successfully mapped to inspection request');


    } catch (err) {
      await manager.releaseTransaction();
      throw err;
    }
  }


}
