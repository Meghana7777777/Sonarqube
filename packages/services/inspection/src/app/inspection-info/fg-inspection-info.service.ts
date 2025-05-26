import { Injectable } from "@nestjs/common";
import { ErrorResponse } from "@xpparel/backend-utils";
import { CommonResponse, InsAttributeNameValueModel, InsBasicInspectionRequest, InsCartonIdsRequest, InsGetInspectionHeaderRollInfoResp, InsInspectionActivityStatusEnum, InsInspectionFinalInSpectionStatusEnum, InsInspectionHeaderAttributes, InsLabInspectionRequest, InsPKMSAttributesNamesAndValues, InsPKMSInsCartonsResModel, InsPKMSInsDetailsResponseDto, InsPKMSInsSummeryCartonsDto, InsPKMSPendingMaterialResponse, InsPackListAndPoIdsReqDto, InsRelaxationInspectionRequest, InsRollInspectionInfo, InsShadeInspectionRequest, InsShrinkageInspectionRequest, InsTypesEnumType, PKMSInsReqIdDto, PKMSUploadedFiles, PackFabricInspectionRequestCategoryEnum, PackListIdRequest, PkInsRatioModel, PlBatchLotRequest, ReferenceFeaturesEnum } from "@xpparel/shared-models";
import { GrnServices, InsPackingHelperService } from "@xpparel/shared-services";
import { DataSource } from "typeorm";
import { FileUploadEntity } from "../entities/file-upload.entity";
import { InsRequestItemEntity } from "../entities/ins-request-items.entity";
import { InsRequestEntity } from "../entities/ins-request.entity";
import { InsCartonActualInfoRepo } from "../inspection/repositories/ins-carton-actual-info.repository";
import { InsFpDefectCapturingRepo } from "../inspection/repositories/ins-fp-defect-capturing.repository";
import { InsGsmRepo } from "../inspection/repositories/ins-gsm.repository";
import { InsRelaxationRepo } from "../inspection/repositories/ins-relaxation.repository";
import { InsRequestAttributeRepo } from "../inspection/repositories/ins-request-attributes.repository";
import { InsRequestItemRepo } from "../inspection/repositories/ins-request-items.repository";
import { InsRequestLinesRepository } from "../inspection/repositories/ins-request-lines.repository";
import { InsRequestEntityRepo } from "../inspection/repositories/ins-request.repository";
import { InsShadeRepo } from "../inspection/repositories/ins-shade.repository";
import { InsShrinkageRepo } from "../inspection/repositories/ins-shrinkage.repository";
import { IReasonRepo } from "../masters/repositories/i-reason.repository";

@Injectable()
export class FgInspectionInfoService {
    constructor(
        private dataSource: DataSource,
        private inspReqRepo: InsRequestEntityRepo,
        private inspAttributesRepo: InsRequestAttributeRepo,
        private inspReqItemsRepo: InsRequestItemRepo,
        private insRequestLinesRepository: InsRequestLinesRepository,
        private grnServices: GrnServices,
        private insFpDefectCapturingRepo: InsFpDefectCapturingRepo,
        private insGsmRepo: InsGsmRepo,
        private insRelaxationRepo: InsRelaxationRepo,
        private insShadeRepo: InsShadeRepo,
        private insShrinkageRepo: InsShrinkageRepo,
        private insPackingHelperService: InsPackingHelperService,
        private iReasonRepo: IReasonRepo,
        private insCartonActualInfoRepo: InsCartonActualInfoRepo,


    ) { }

    /**
   * Service to get inspection details for a request Id
   * @param inspReqId 
   * @param unitCode 
   * @param companyCode 
   * @param rollId 
  */
    // LOT (ins request) 1 -> 1 LOT (ins lines) 1 -> M Rolls
    async getFgInspectionDetailsForRequestId(userName: string, inspReqId: number, unitCode: string, companyCode: string, rollId?: number, userId?: number, createdUser?: string): Promise<InsGetInspectionHeaderRollInfoResp> {
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

        const req = new PackListIdRequest(createdUser, unitCode, companyCode, userId, Number(inspectDetails.refIdL1))
        const sysPerf = await this.grnServices.getSystemPreferences(req);

        if (!sysPerf.status) {
            throw new ErrorResponse(1037, 'GRN Details not found for the given pack list. Please verify')
        }

        const totalNoOfRequestRolls: number = (await this.inspReqItemsRepo.getInspectionQtyByInspReqId(inspReqId, unitCode, companyCode)).no_of_rolls;
        const rollReq = new PlBatchLotRequest(createdUser, unitCode, companyCode, userId, 0, [inspectDetails.refJobL1], []);


        const totalNoOfInspectedRolls: number = inspectedResults.no_of_rolls;

        const inspectionPercentage: number = sysPerf.data.rollsPickPercentage;

        const inspectionQty = (await this.inspReqItemsRepo.getInspectionQtyByInspReqId(inspReqId, unitCode, companyCode)).inspected_qty;

        // get the lot, batch info from the request_lines
        // const inspHeaderInfo = new InsCommonInspectionHeaderInfo(inspectDetails.id, inspectDetails.insType, inspectDetails.refJobL1, totalNoOfBatchRolls.data[0]?.rollCount, totalNoOfRequestRolls, totalNoOfInspectedRolls
        //     , inspectionPercentage, inspectDetails.refJobL2, null, inspectionQty, inspectedResults.inspected_qty, inspectDetails.insCreationTime, inspectDetails.materialReceiveAt, inspectDetails.insCompletedAt, inspectDetails.expInsCompletedAt, null, inspectDetails.finalInspectionStatus, null, null, attributeInfo, inspectDetails.createReRequest);

        let shadeInsInfo: InsShadeInspectionRequest = null;
        let basicInsInfo: InsBasicInspectionRequest = null;
        let labInsInfo: InsLabInspectionRequest = null;
        let shrinkageInfo: InsShrinkageInspectionRequest = null;
        let relaxationInfo: InsRelaxationInspectionRequest = null;
        const inspectedRolls = rollId ? await this.inspReqItemsRepo.find({ where: { insRequestId: inspectDetails.id, unitCode, companyCode, refIdL1: rollId.toString() } }) : await this.inspReqItemsRepo.find({ where: { insRequestId: inspectDetails.id, unitCode, companyCode } });
        if (!inspectedRolls.length) {
            throw new ErrorResponse(1039, 'Inspection objects not found for given inspection header Id');
        }
        // if (inspectDetails.insType == InsFabricInspectionRequestCategoryEnum.INSPECTION) {
        //     basicInsInfo = new InsBasicInspectionRequest();
        //     basicInsInfo.inspectionHeader = inspHeaderInfo;
        //     basicInsInfo.inspectionRollDetails = [];
        //     for (const eachRoll of inspectedRolls) {
        //         // get the defect capturing entity into the INS module. Then copy the code
        //         const fourPointInfo = await this.getFourPointDetailsForRoll(Number(eachRoll.refIdL1), unitCode, companyCode);
        //         // get the actual four points width
        //         const atualRollInfoReq = new RollNumberRequest(userName, unitCode, companyCode, userId, Number(inspectDetails.refJobL2));
        //         const atualRollInfo = await this.inspectionHelperService.getItemLineActualRecord(atualRollInfoReq);
        //         const rollBasicInfo: BasicRollInfoRespone = await this.inspectionHelperService.getBasicRollInfoForRollId(atualRollInfoReq);
        //         // const inspectionDetails = new BasicInspectionRollDetails(Number(eachRoll.refIdI1), rollBasicInfo?.data[0]?.object_ext_no, rollBasicInfo?.data[0]?.barcode, rollBasicInfo?.data[0]?.qr_code, inspectDetails.refJobI2, eachRoll.insQuantity, rollBasicInfo?.data[0]?.s_width, eachRoll.finalInspectionStatus, eachRoll.finalInspectionStatus, fourPointInfo, eachRoll.remarks, atualRollInfo?.data[0]?.fourPointsWidth, atualRollInfo?.data[0]?.fourPointsLength, rollBasicInfo?.data[0]?.s_shade);
        //         // basicInsInfo.inspectionRollDetails.push(inspectionDetails);
        //     }
        // }
        // if (inspectDetails.insType == InsFabricInspectionRequestCategoryEnum.LAB_INSPECTION) {
        //     labInsInfo = new InsLabInspectionRequest();
        //     labInsInfo.inspectionHeader = inspHeaderInfo;
        //     labInsInfo.inspectionRollDetails = [];
        //     for (const eachRoll of inspectedRolls) {
        //         const gsmInfo = await this.geItemLineActualForGsm(Number(eachRoll.refIdL1), unitCode, companyCode, userId, userName);
        //         gsmInfo.remarks = eachRoll.remarks;
        //         gsmInfo.rollFinalInsResult = eachRoll.inspectionResult;
        //         gsmInfo.rollInsResult = eachRoll.finalInspectionStatus
        //         labInsInfo.inspectionRollDetails.push(gsmInfo);
        //     }
        // }
        // if (inspectDetails.insType == InsFabricInspectionRequestCategoryEnum.RELAXATION) {
        //     relaxationInfo = new InsRelaxationInspectionRequest();
        //     relaxationInfo.inspectionHeader = inspHeaderInfo;
        //     relaxationInfo.inspectionRollDetails = [];
        //     for (const eachRoll of inspectedRolls) {
        //         const relaxationDetails = await this.getItemLineActualForRelaxation(Number(eachRoll.refIdL1), unitCode, companyCode, userName, userId);
        //         relaxationDetails.rollInsResult = eachRoll.inspectionResult;
        //         relaxationDetails.rollFinalInsResult = eachRoll.finalInspectionStatus;
        //         relaxationDetails.remarks = eachRoll.remarks;
        //         relaxationInfo.inspectionRollDetails.push(relaxationDetails);
        //     }
        // }
        // if (inspectDetails.insType == InsFabricInspectionRequestCategoryEnum.SHADE_SEGREGATION) {
        //     shadeInsInfo = new InsShadeInspectionRequest();
        //     shadeInsInfo.inspectionHeader = inspHeaderInfo;
        //     shadeInsInfo.inspectionRollDetails = [];
        //     for (const eachRoll of inspectedRolls) {
        //         const shadeDetails = await this.getItemLineActualForShade(Number(eachRoll.refIdL1), unitCode, companyCode, userName, userId);
        //         shadeDetails.remarks = eachRoll.remarks;
        //         shadeDetails.rollInsResult = eachRoll.inspectionResult;
        //         shadeDetails.rollFinalInsResult = eachRoll.finalInspectionStatus;
        //         shadeInsInfo.inspectionRollDetails.push(shadeDetails);
        //     }
        // }
        // if (inspectDetails.insType == InsFabricInspectionRequestCategoryEnum.SHRINKAGE) {
        //     shrinkageInfo = new InsShrinkageInspectionRequest();
        //     shrinkageInfo.inspectionHeader = inspHeaderInfo;
        //     shrinkageInfo.inspectionRollDetails = [];
        //     for (const eachRoll of inspectedRolls) {
        //         const shrinkageDetails = await this.getItemLineActualForShrinkage(Number(eachRoll.refIdL1), Number(eachRoll.refIdL1), unitCode, companyCode, userName, userId);
        //         shrinkageDetails.rollInfo.rollFinalInsResult = eachRoll.inspectionResult;
        //         shrinkageDetails.rollInfo.rollInsResult = eachRoll.finalInspectionStatus;
        //         shrinkageInfo.inspectionRollDetails.push(shrinkageDetails);
        //     }
        // }
        // if (inspectDetails.insType == FabricInspectionRequestCategoryEnum.GSM) {

        // }
        const rollInfo = new InsRollInspectionInfo(shadeInsInfo, basicInsInfo, labInsInfo, shrinkageInfo, relaxationInfo);
        return new InsGetInspectionHeaderRollInfoResp(true, 1041, 'Inspection header and object info received successfully', rollInfo)
    }


    async getInspectionMaterialPendingData(req: InsPackListAndPoIdsReqDto): Promise<CommonResponse> {
        const whereClause = new InsRequestEntity();
        if (req.poId) {
            whereClause.refIdL2 = req.poId.toString();
        }
        if (req.packListId) {
            whereClause.refIdL1 = req.packListId.toString();
        }    
        whereClause.insActivityStatus = req.insActivityStatus;
        whereClause.companyCode = req.companyCode;
        whereClause.unitCode = req.unitCode;
        whereClause.insType = req.inspectionType
        let insReqData: InsRequestEntity[] = [];
        if (req.fromCount >= 0 && req.recordsCount) {
            insReqData = await this.inspReqRepo.find({ where: { ...whereClause }, take: req.recordsCount, skip: req.fromCount === 0 ? 0 : req.fromCount });
        }
        else {
            insReqData = await this.inspReqRepo.find({ where: { ...whereClause } });
        }
        const data: InsPKMSPendingMaterialResponse[] = [];
        for (const rec of insReqData) {
            const buyer = await this.inspAttributesRepo.findOne({ select: ['attributeValue'], where: { insRequestId: rec.id, attributeName: InsInspectionHeaderAttributes.BUYER } });
            const style = await this.inspAttributesRepo.findOne({ select: ['attributeValue'], where: { insRequestId: rec.id, attributeName: InsInspectionHeaderAttributes.STYLE_NO } });
            const poNumber = await this.inspAttributesRepo.findOne({ select: ['attributeValue'], where: { insRequestId: rec.id, attributeName: InsInspectionHeaderAttributes.PO_NO } });
            const packListNo = await this.inspAttributesRepo.findOne({ select: ['attributeValue'], where: { insRequestId: rec.id, attributeName: InsInspectionHeaderAttributes.PACKING_LIST_NUMBER } });
            const items = await this.inspReqItemsRepo.find({ select: ['refIdL1', 'inspectionResult'], where: { insRequestId: rec.id } });
            const cartonIds: number[] = items.map(item => Number(item.refIdL1));
            const creq = new InsCartonIdsRequest(req.username, req.unitCode, req.companyCode, req.userId, cartonIds);
            const res = await this.insPackingHelperService.getCartonsDataByCartonId(creq);
            const cartonMap = new Map(res.data.map(carton => [carton.id, carton]));
            let crtnsQty: number = 0;
            let totalPassed = 0;
            let totalFail = 0;
            for (const item of items) {
                // const carton = await this.dataSource.getRepository(CrtnEntity).findOne({ where: { id: item.refIdL1 } })
                const carton = cartonMap.get(Number(item.refIdL1));
                if (carton) {
                    crtnsQty += 1;
                }
                if (item.inspectionResult == InsInspectionFinalInSpectionStatusEnum.PASS) {
                    totalPassed++
                }
                if (item.inspectionResult == InsInspectionFinalInSpectionStatusEnum.FAIL) {
                    totalFail++
                }
            }
            data.push(new InsPKMSPendingMaterialResponse(rec.insCode, rec.id, rec.finalInspectionStatus, undefined, buyer?.attributeValue, style?.attributeValue, poNumber?.attributeValue, packListNo?.attributeValue, rec.insCreationTime, rec.createReRequest, crtnsQty, rec.insType as unknown as PackFabricInspectionRequestCategoryEnum, rec.materialReceiveAt?.toString(), String(rec.insCreationTime), rec.insStartedAt?.toString(), rec.insCompletedAt?.toString(), rec.insActivityStatus === InsInspectionActivityStatusEnum.MATERIAL_RECEIVED, rec.insActivityStatus === InsInspectionActivityStatusEnum.INPROGRESS, rec.insActivityStatus === InsInspectionActivityStatusEnum.COMPLETED, totalFail, '', [], totalPassed))
        }
        if (!data.length) {
            throw new ErrorResponse(965, "Data Not Found")
        }
        return new CommonResponse(true, 36043, "Ins Pending Materials Retrieved Successfully", data);
    }


    async getPKMSInsCartonsData(req: PKMSInsReqIdDto): Promise<CommonResponse> {
        const userReq = { companyCode: req.companyCode, unitCode: req.unitCode }
        const insReqWhereClause: any = { ...userReq };
        insReqWhereClause.insRequestId = req.insReqId
        const insReqData = await this.inspReqRepo.findOne({ where: { id: req.insReqId, ...userReq } });
        const findInsItemsReqData = await this.inspReqItemsRepo.find({ where: { ...insReqWhereClause } });
        const insData = await this.inspReqRepo.findOne({ where: { 'id': req.insReqId } });
        const cartonIds: string[] = findInsItemsReqData.map((item) => item.refIdL1);
        const data: InsPKMSInsCartonsResModel[] = [];
        const attributes: InsPKMSAttributesNamesAndValues[] = [];
        const findAttributes = await this.inspAttributesRepo.find({ where: { insRequestId: req.insReqId, ...userReq } });
        for (const rec of findAttributes) {
            attributes.push(new InsPKMSAttributesNamesAndValues(rec.attributeName, rec.attributeValue))
        };
        for (const items of findInsItemsReqData) {
            const actualCartonInfo = await this.insCartonActualInfoRepo.findOne({ where: { 'insReqItemsId': items.id } })
            const colors = [];
            const mapForCLeastChild = new Map<string, PkInsRatioModel>();
            const removeDuplicates = [...new Set(colors)];
            // const findFiles = await this.dataSource.getRepository(FileUploadEntity).findOne({ where: { featuresRefNo: items?.id, featuresRefName: ReferenceFeaturesEnum.INS_CARTONS, ...userReq } }); 

            const findFiles = await this.dataSource.getRepository(FileUploadEntity).findOne({ where: { featuresRefNo: items?.id, featuresRefName: ReferenceFeaturesEnum.INS_CARTONS, ...userReq } });


            const result = new InsPKMSInsCartonsResModel(items.refNoL1, null, insReqData.refIdL1, null, insData.refIdL2, attributes, new PKMSUploadedFiles(findFiles?.fileName, findFiles?.id), items.finalInspectionStatus, actualCartonInfo?.grossWeight, actualCartonInfo?.netWeight, items?.finalInspectionStatus, cartonIds, Number(insData.refIdL3), Number(insData.refIdL1));
            data.push(result)
        };
        if (attributes.length) {
            data[0].attributes = attributes;
        }
        if (cartonIds.length) {
            data[0].cartons = cartonIds;
        }
        return new CommonResponse(true, 967, "Data Retrieved Successfully", data);
    };


    async getInsCartonsSummary(req: PKMSInsReqIdDto): Promise<CommonResponse> {
        const userReq = { companyCode: req.companyCode, unitCode: req.unitCode }
        const findInsReqData = await this.inspReqRepo.findOne({ where: { id: req.insReqId, ...userReq } });
        const attributes: InsPKMSAttributesNamesAndValues[] = [];
        const findAttributes = await this.inspAttributesRepo.find({ where: { insRequestId: req.insReqId, ...userReq } });
        for (const rec of findAttributes) {
            attributes.push(new InsPKMSAttributesNamesAndValues(rec.attributeName, rec.attributeValue))
        };
        let crtnsQty: number = 0;
        let totalPassed: number = 0;
        let totalFail: number = 0;
        const itemsWhereClause = new InsRequestItemEntity();
        itemsWhereClause.insRequestId = req.insReqId;
        itemsWhereClause.companyCode = req.companyCode;
        itemsWhereClause.unitCode = req.unitCode;
        if (req.cartonNo) {
            const creq = new InsCartonIdsRequest(req.username, req.unitCode, req.companyCode, req.userId,[],req.cartonNo);
            const findCartonId = await this.insPackingHelperService.getCartonsDataByCartonId(creq);
            itemsWhereClause.refIdL1 = findCartonId.data[0].id.toString();
        };
        const items = await this.inspReqItemsRepo.find({ where: { ...itemsWhereClause } });
        const crtns: InsPKMSInsSummeryCartonsDto[] = [];
        for (const item of items) {

            const insCartonActual = await this.insCartonActualInfoRepo.findOne({ where: { CartonId: Number(item.refIdL1) } });

            const findFiles = await this.dataSource.getRepository(FileUploadEntity).findOne({ where: { featuresRefNo: item.id, featuresRefName: ReferenceFeaturesEnum.INS_CARTONS, ...userReq } });
            const rejectedReasons = await this.iReasonRepo.findOne({ select: ['id', 'reasonName'], where: { id: item.rejectedReasonId } })
            crtns.push(new InsPKMSInsSummeryCartonsDto(item?.refNoL1, Number(item.refIdL1), insCartonActual?.grossWeight, insCartonActual?.netWeight, item?.finalInspectionStatus, insCartonActual?.grossWeight, insCartonActual?.netWeight, item?.finalInspectionStatus, item.id, req.insReqId, new PKMSUploadedFiles(findFiles?.fileName, findFiles?.id), rejectedReasons?.id, rejectedReasons?.name,));
            // crtnsQty += cartonData.requiredQty;
            if (item.inspectionResult === InsInspectionFinalInSpectionStatusEnum.PASS) totalPassed++
            if (item.inspectionResult === InsInspectionFinalInSpectionStatusEnum.FAIL) totalFail++
        };
        const data: InsPKMSInsDetailsResponseDto = new InsPKMSInsDetailsResponseDto(attributes, findInsReqData.insCode, findInsReqData.id, findInsReqData.finalInspectionStatus, findInsReqData.insCreationTime, crtnsQty, String(findInsReqData.insStartedAt), String(findInsReqData.insCreationTime), findInsReqData.insCompletedAt?.toString(), findInsReqData.insActivityStatus === InsInspectionActivityStatusEnum.MATERIAL_RECEIVED, findInsReqData.insActivityStatus === InsInspectionActivityStatusEnum.INPROGRESS, findInsReqData.insActivityStatus === InsInspectionActivityStatusEnum.COMPLETED, totalFail, totalPassed, findInsReqData.finalInspectionStatus, items[0]?.inspectionAreaI1, findInsReqData.updatedUser, findInsReqData.insMaterialType, findInsReqData.insMaterial, findInsReqData.insStartedAt?.toString(), findInsReqData.materialReceiveAt?.toString(), findInsReqData.insCompletedAt?.toString(), crtns,);

        return new CommonResponse(true, 967, "Data Retrieved Successfully", data)
    }









}