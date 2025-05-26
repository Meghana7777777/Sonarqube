import { Injectable } from "@nestjs/common";
import { ErrorResponse } from "@xpparel/backend-utils";
import { BarcodeTypesEnum, CommonResponse, HeaderDetailsResponse, InsAttributeNameValueModel, InsBasicInspectionRequest, InsBasicInspectionRollDetails, InsBasicRollInfoRequest, InsCommonInspectionHeaderInfo, InsCommonInspRollInfo, InsFabricInspectionRequestCategoryEnum, InsFourPointsInspectionRollDetails, InsGetInspectionHeaderRollInfoResp, InsInspectionActivityStatusEnum, InsInspectionBasicInfoModel, InsInspectionBasicInfoResponse, InsInspectionFinalInSpectionStatusEnum, InsInspectionHeaderAttributes, InsInspectionRequestsFilterRequest, InsInspectionResultEnum, InsInspectionTypeRequest, InsIrIdRequest, InsIrRollModel, InsIrRollsModel, InsIrRollsResponse, InsLabInspectionRequest, InsLabInspectionRollDetails, InsPhIdRequest, InsRelaxationInspectionRequest, InsRelaxationInspectionRollDetails, InsRollInspectionInfo, InsShadeInspectionRequest, InsShadeInspectionRollDetails, InsShrinkageInspectionRequest, InsShrinkageRollInfo, InsShrinkageTypeInspectionRollDetails, InsTypesEnum, InsTypesEnumType, InsWidthAtMeterModel, MeasuredRefEnum, RollIdRequest, RollIdsRequest, RollLocationModel, RollLocationsResponse, RollNumberRequest, RollReqHeaderModel, RollsCheckListResponse, RollsReqItemAbstract, RollsReqItemAttrs, RollsReqItemsModel, RollsReqSubItemModel } from "@xpparel/shared-models";
import { GrnServices, InspectionHelperService, LocationAllocationService, PackingListService } from "@xpparel/shared-services";
import { DataSource, In } from "typeorm";
import { InsRequestEntity } from "../entities/ins-request.entity";
import { InsRollsActualInfoEntity } from "../entities/ins_rolls_actual_info.entity";
import { InsFpDefectCapturingRepo } from "../inspection/repositories/ins-fp-defect-capturing.repository";
import { InsGsmRepo } from "../inspection/repositories/ins-gsm.repository";
import { InsRelaxationRepo } from "../inspection/repositories/ins-relaxation.repository";
import { InsRequestAttributeRepo } from "../inspection/repositories/ins-request-attributes.repository";
import { InsRequestItemRepo } from "../inspection/repositories/ins-request-items.repository";
import { InsRequestEntityRepo } from "../inspection/repositories/ins-request.repository";
import { InsRollActualRepo } from "../inspection/repositories/ins-roll-actual.repo";
import { InsShadeRepo } from "../inspection/repositories/ins-shade.repository";
import { InsShrinkageRepo } from "../inspection/repositories/ins-shrinkage.repository";
import { DefectCapturingDetailsResp } from "../inspection/repositories/query-response/defect-capturing-details.qry.resp";
import { RelaxationDetailsQryResp } from "../inspection/repositories/query-response/ins-relaxation.qry.resp";
import { ShadeDetailsQryResp } from "../inspection/repositories/query-response/ins-shade-details.qry.resp";
import { BasicRollInfoQryResp } from "../inspection/repositories/query-response/roll-basic-info.qry.resp";

@Injectable()
export class FabricInspectionInfoService {
    constructor(
        private dataSource: DataSource,
        private inspReqRepo: InsRequestEntityRepo,
        private inspAttributesRepo: InsRequestAttributeRepo,
        private inspReqItemsRepo: InsRequestItemRepo,
        private grnServices: GrnServices,
        private inspectionHelperService: InspectionHelperService,
        private insFpDefectCapturingRepo: InsFpDefectCapturingRepo,
        private insGsmRepo: InsGsmRepo,
        private insRelaxationRepo: InsRelaxationRepo,
        private insShadeRepo: InsShadeRepo,
        private insShrinkageRepo: InsShrinkageRepo,
        private packingListService: PackingListService,
        private insRollActualRepo: InsRollActualRepo,
        private locationAllocationService: LocationAllocationService,
    ) { }

    /**
    * Service to get inspection details for a request Id
    * @param inspReqId 
    * @param unitCode 
    * @param companyCode 
    * @param rollId 
*/


    /**
        * Service to get four point details for the roll
        * @param rollId 
        * @param unitCode 
        * @param companyCode 
        * @returns 
    */
    async getFourPointDetailsForRoll(rollId: number, unitCode: string, companyCode: string): Promise<InsFourPointsInspectionRollDetails[]> {
        const qryResp: DefectCapturingDetailsResp[] = await this.insFpDefectCapturingRepo.getFourPointDetailsForRoll(rollId, unitCode, companyCode);
        return qryResp.map((eachPoint) => {
            const fountPointObj = new InsFourPointsInspectionRollDetails();
            fountPointObj.atMeter = eachPoint.point_length;
            fountPointObj.points = eachPoint.point_value;
            fountPointObj.reason = eachPoint.reason;
            fountPointObj.reasonId = eachPoint.reason_id;
            fountPointObj.remarks = eachPoint.remarks;
            fountPointObj.id = eachPoint.id;
            fountPointObj.pointPosition = eachPoint.point_position;
            return fountPointObj
        })
    }

    /**
    * SERVICE TO GET ITEM LINE ACTUAL FOR SHRINKAGE
    * @param rollId 
    * @param unitCode 
    * @param companyCode 
    * @returns 
    */
    async getItemLineActualForShrinkage(rollId: number, rollSampleId: number, unitCode: string, companyCode: string, userName, userId): Promise<InsShrinkageRollInfo> {
        const qryResp = await this.insShrinkageRepo.getShrinkageDetailsForRoll(rollId, unitCode, companyCode);
        const atualRollInfoReq = new InsBasicRollInfoRequest(userName, unitCode, companyCode, userId, [rollId], true);
        const rollBasicInfo = await this.inspectionHelperService.getBasicRollInfoForInspection(atualRollInfoReq);
        const rollCommonInfo = new InsCommonInspRollInfo(rollId, Number(rollBasicInfo?.data[0]?.externalRollNumber), rollBasicInfo?.data[0]?.barcode, null, rollBasicInfo?.data[0]?.lot, rollBasicInfo?.data[0]?.originalQty, Number(rollBasicInfo?.data[0]?.width), null, null, rollSampleId, rollBasicInfo?.data[0]?.sShade);
        const shrinkageTypeDetail: InsShrinkageTypeInspectionRollDetails[] = qryResp.map((shrinkageType) => {
            return new InsShrinkageTypeInspectionRollDetails(shrinkageType.shrinkage_type, shrinkageType.a_sk_width, shrinkageType.a_sk_length, shrinkageType.length_after_sk, shrinkageType.width_after_sk, shrinkageType.remarks, shrinkageType.sk_group, shrinkageType.uom);
        })
        return new InsShrinkageRollInfo(rollCommonInfo, shrinkageTypeDetail);
    }

    async getItemLineActualForShade(rollId: number, unitCode: string, companyCode: string, userName: string, userId):
        Promise<InsShadeInspectionRollDetails> {
        console.log('rrrrrrrr', rollId);
        const qryResp: ShadeDetailsQryResp = await this.insRollActualRepo.getItemLineActualForShade(rollId, unitCode, companyCode);
        const atualRollInfoReq = new InsBasicRollInfoRequest(userName, unitCode, companyCode, userId, [rollId], true);
        const insItemRes = await this.inspReqItemsRepo.findOne({ where: { refIdL1: rollId?.toString() } });
        const rollBasicInfo = await this.inspectionHelperService.getBasicRollInfoForInspection(atualRollInfoReq);
        return new InsShadeInspectionRollDetails(rollId, Number(rollBasicInfo.data[0].externalRollNumber), rollBasicInfo?.data[0]?.barcode, '', rollBasicInfo?.data[0]?.lot, rollBasicInfo?.data[0]?.originalQty, Number(rollBasicInfo?.data[0]?.width), insItemRes.inspectionResult, insItemRes.finalInspectionStatus, qryResp?.a_shade, qryResp?.a_shade_group, null, insItemRes.insActivityStatus, insItemRes.inspectionResult);
    }

    /**
        * REPOSITORY TO GET ITEM LINE ACTUAL INFORMATION FOR THE RELAXATION 
        * @param rollId 
        * @param unitCode 
        * @param companyCode 
        * @returns 
        */
    async getItemLineActualForRelaxation(rollId: number, unitCode: string, companyCode: string, userName: string, userId: number, insReqItemsPK: number): Promise<InsRelaxationInspectionRollDetails> {
        const qryResp: RelaxationDetailsQryResp = await this.insRollActualRepo.getItemLineActualForRelaxation(insReqItemsPK, unitCode, companyCode);
        const atualRollInfoReq = new InsBasicRollInfoRequest(undefined, undefined, undefined, undefined, [rollId], true);
        const rollBasicInfo = await this.inspectionHelperService.getBasicRollInfoForInspection(atualRollInfoReq);
        const req = new RollIdRequest(userName, unitCode, companyCode, userId, rollId, '');
        const rollGrnInfo = await this.inspectionHelperService.getGrnRollInfoForRollId(req);
        const relaxationDetails = await this.insRelaxationRepo.getRelaxationPointDetailsForRollId(insReqItemsPK, unitCode, companyCode);
        let startWidth = 0;
        let midWidth = 0;
        let endWidth = 0;
        const pointDetails = relaxationDetails?.map((point) => {
            const pointDetail = new InsWidthAtMeterModel();
            pointDetail.atMeter = point.measured_at;
            pointDetail.order = point.measured_order;
            pointDetail.width = point.width;
            pointDetail.measuredRef = point.measured_ref;
            if (point.measured_ref == MeasuredRefEnum.START) {
                startWidth = point.width;
            }
            if (point.measured_ref == MeasuredRefEnum.MID) {
                midWidth = point.width;
            }
            if (point.measured_ref == MeasuredRefEnum.END) {
                endWidth = point.width;
            }
            return pointDetail;
        });
        return new InsRelaxationInspectionRollDetails(rollId, Number(rollBasicInfo?.data[0]?.externalRollNumber), rollBasicInfo?.data[0]?.barcode, null, rollBasicInfo?.data[0]?.lot, rollBasicInfo?.data[0]?.originalQty, Number(rollBasicInfo?.data[0]?.width), null, null, qryResp?.no_of_joins, rollBasicInfo?.data[0]?.sWidth, rollGrnInfo?.data[0]?.s_length, qryResp?.a_width, qryResp?.a_length, pointDetails, null, null, startWidth, midWidth, endWidth);
    }

    /**
        * Service to get item lines actual GSM information
        * @param rollId 
        * @param unitCode 
        * @param companyCode 
        * @returns 
    */
    async geItemLineActualForGsm(rollId: number, unitCode: string, companyCode: string, userId: number, userName: string, insReqItemId?: number): Promise<InsLabInspectionRollDetails> {
        // const qryResp: GsmDetailsQryResp = await this.insRollActualRepo.geItemLineActualForGsm(insReqItemId, unitCode, companyCode);

        const rollInfo = await this.inspReqItemsRepo.find({ select: ['inspectionResult', 'finalInspectionStatus'], where: { 'refIdL1': rollId?.toString() } });

        const response = await this.insGsmRepo.find({ where: { insReqItemId: rollId } })
        const req = new InsBasicRollInfoRequest(userName, unitCode, companyCode, userId, [rollId], true);
        // use the getRollsBasicInfoForRollIds
        const qryResp = response[0];

        const rollBasicInfo = await this.inspectionHelperService.getBasicRollInfoForInspection(req);
        return new InsLabInspectionRollDetails(rollId, Number(rollBasicInfo?.data[0]?.externalRollNumber), rollBasicInfo?.data[0]?.barcode, '', rollBasicInfo?.data[0]?.lot, rollBasicInfo?.data[0]?.originalQty, Number(rollBasicInfo?.data[0]?.width), rollInfo[0].inspectionResult, rollInfo[0]?.finalInspectionStatus, rollBasicInfo?.data[0]?.aGsm, qryResp?.aGsm, qryResp?.toleranceFrom, qryResp?.toleranceTo, qryResp?.adjustment, qryResp?.adjustmentValue, null, null, rollBasicInfo?.data[0]?.sShade);
    }

    //RETRIEVAL
    async getInspectionRequestBasicInfo(req: InsInspectionTypeRequest): Promise<InsInspectionBasicInfoResponse> {
        let insRes: InsInspectionBasicInfoModel[] = [];
        switch (req.inspectionType) {
            case InsFabricInspectionRequestCategoryEnum.INSPECTION: insRes = await this.getInitialIRBasicInfo(req);
                break;
            case InsFabricInspectionRequestCategoryEnum.LAB_INSPECTION: insRes = await this.getInitialIRBasicInfo(req);
                break;
            case InsFabricInspectionRequestCategoryEnum.RELAXATION: insRes = await this.getInitialIRBasicInfo(req);
                break;
            case InsFabricInspectionRequestCategoryEnum.SHADE_SEGREGATION: insRes = await this.getInitialIRBasicInfo(req);
                break;
            case InsFabricInspectionRequestCategoryEnum.SHRINKAGE: insRes = await this.getInitialIRBasicInfo(req);
                break;
            default: throw new ErrorResponse(0, 'Inspection request is not found');
        }
        return new InsInspectionBasicInfoResponse(true, 0, 'Inspection requests info retrieved successfully', insRes);
    }

    async getInitialIRBasicInfo(req: InsInspectionTypeRequest): Promise<InsInspectionBasicInfoModel[]> {
        let insHeaders: InsRequestEntity[] = [];
        if (req.fromCount >= 0 && req.recordsCount) {
            insHeaders = await this.inspReqRepo.find({ where: { insActivityStatus: req.inspectionCurrentActivity, insType: req.inspectionType as unknown as InsTypesEnumType, isActive: true, companyCode: req.companyCode, unitCode: req.unitCode }, take: req.recordsCount, skip: req.fromCount === 0 ? 0 : req.fromCount });
        } else {
            insHeaders = await this.inspReqRepo.find({ where: { insActivityStatus: req.inspectionCurrentActivity, insType: req.inspectionType as unknown as InsTypesEnumType, isActive: true, companyCode: req.companyCode, unitCode: req.unitCode } });
        }
        const insBasicModels = await this.getInsInfoModelForInsHeaders(insHeaders, req.companyCode, req.unitCode);
        return insBasicModels;
    }


    // HELPER
    async getInsInfoModelForInsHeaders(insHeaders: InsRequestEntity[], companyCode: string, unitCode: string): Promise<InsInspectionBasicInfoModel[]> {
        const insRes: InsInspectionBasicInfoModel[] = [];
        for (const rec of insHeaders) {
            let styleNo = await this.inspAttributesRepo.findOne({where: {insRequestId: rec.id,attributeName: InsInspectionHeaderAttributes.STYLE_NO,},select: ['attributeValue'],});
            const materialReceived = rec.insActivityStatus == InsInspectionActivityStatusEnum.MATERIAL_RECEIVED;
            const insComplete = rec.insActivityStatus == InsInspectionActivityStatusEnum.COMPLETED;
            const insProgress = rec.insActivityStatus == InsInspectionActivityStatusEnum.INPROGRESS;
            const phReq = new InsPhIdRequest('', unitCode, companyCode, 0, [rec.refIdL1])
            const phRec = await this.inspectionHelperService.getPackListRecordDataForPackListId(phReq);
            console.log('phrec98', phRec);
            // get the inspection properties for the current IR
            const insRolls = await this.getInsRollCompletionInfoForIr(companyCode, unitCode, rec.id);
            const rollIds = insRolls.map(r => r.rollId);
            const totalItemsForIns = insRolls.length;
            let totalFailItems = 0;
            let totalPassItems = 0;
            insRolls.filter(r => {
                if (r.insStatus != InsInspectionResultEnum.FAIL) {
                    totalPassItems++
                } else {
                    totalFailItems++;
                }
            });
            const rollInfoReq = new RollIdsRequest('', unitCode, companyCode, 0, rollIds)
            const rollInfo = await this.packingListService.getRollsBasicInfoForRollIds(rollInfoReq);

            if (rollInfo.status) {
                const rollIdsReq = rollInfo.data.map(r => {
                    return new RollIdRequest(null, null, null, null, r.rollId, r.barcode);
                });
                const isReRequest: boolean = rec.parentRequestId ? true : false;
                const insInfoModel = new InsInspectionBasicInfoModel(rec.id, Number(rec.refIdL1), phRec.data?.packListCode, phRec.data?.supplierCode, rec.refJobL2, null, rec.insCode, totalItemsForIns, totalPassItems, rollIdsReq, rec.insType as unknown as InsFabricInspectionRequestCategoryEnum, rec.materialReceiveAt?.toString(), rec.createdAt?.toString(), rec.insStartedAt?.toString(), null, materialReceived, insProgress, insComplete, rec.finalInspectionStatus, totalFailItems, [rec.refJobL1], isReRequest, styleNo?.attributeValue);
                insRes.push(insInfoModel);
            }
        }
        return insRes;
    }

    async getInsRollCompletionInfoForIr(companyCode: string, unitCode: string, irId: number): Promise<{ rollId: number, insStatus: InsInspectionResultEnum, insCompletedAt: string }[]> {
        const objs: { rollId: number, insStatus: InsInspectionResultEnum, insCompletedAt: string }[] = [];
        const irRolls = await this.inspReqItemsRepo.find({ select: ['insRequestLineId', 'inspectionResult', 'insCompletedAt'], where: { companyCode: companyCode, unitCode: unitCode, insRequestId: irId, isActive: true } });
        irRolls.forEach(r => {
            const insStatus: any = r.inspectionResult;
            objs.push({ rollId: r.insRequestLineId, insStatus: insStatus, insCompletedAt: r.insCompletedAt?.toString() });
        });
        return objs
    }

    // RETRIEVAL
    async getInspectionRequestRollsInfo(req: InsIrIdRequest): Promise<InsIrRollsResponse> {
        let irRollsModel: InsIrRollsModel;
        const insReqRec = await this.inspReqRepo.findOne({ select: ['insType'], where: { id: req.irId } });
        const inspectionType = insReqRec.insType;
        switch (inspectionType) {
            case InsTypesEnum.INSPECTION: irRollsModel = await this.getInitialIRRollsInfo(req);
                break;
            case InsTypesEnum.LAB_INSPECTION: irRollsModel = await this.getShrinkageIRRollsInfo(req);
                break;
            case InsTypesEnum.RELAXATION: irRollsModel = await this.getLabIRRollsInfo(req);
                break;
            case InsTypesEnum.SHADE_SEGREGATION: irRollsModel = await this.getRelaxationIRRollsInfo(req);
                break;
            case InsTypesEnum.SHRINKAGE: irRollsModel = await this.geShadeIRRollsInfo(req);
                break;
            default: throw new ErrorResponse(0, 'Inspection request is not found');
        }
        return new InsIrRollsResponse(true, 0, 'Inspection requests info retrieved successfully', irRollsModel);
    }

    async getInspectionRequestBasicInfoByBatchCode(req: InsInspectionRequestsFilterRequest): Promise<InsInspectionBasicInfoResponse> {
        let insRes: InsInspectionBasicInfoModel[] = [];
        switch (req.inspectionType) {
            case InsFabricInspectionRequestCategoryEnum.INSPECTION: insRes = await this.getInitialIRBasicInfoFilterByBatchCode(req);
                break;
            case InsFabricInspectionRequestCategoryEnum.LAB_INSPECTION: insRes = await this.getInitialIRBasicInfoFilterByBatchCode(req);
                break;
            case InsFabricInspectionRequestCategoryEnum.RELAXATION: insRes = await this.getInitialIRBasicInfoFilterByBatchCode(req);
                break;
            case InsFabricInspectionRequestCategoryEnum.SHADE_SEGREGATION: insRes = await this.getInitialIRBasicInfoFilterByBatchCode(req);
                break;
            case InsFabricInspectionRequestCategoryEnum.SHRINKAGE: insRes = await this.getInitialIRBasicInfoFilterByBatchCode(req);
                break;
            default: throw new ErrorResponse(0, 'Inspection request is not found');
        }
        return new InsInspectionBasicInfoResponse(true, 0, 'Inspection requests info retrieved successfully', insRes);
    }

    async getInitialRolls(req: InsIrIdRequest): Promise<InsIrRollsModel> {
        const rollIds = [];
        const irRollModels: InsIrRollModel[] = [];
        const rollsInIr = await this.inspReqItemsRepo?.find({ select: ['refIdL1'], where: { companyCode: req.companyCode, unitCode: req.unitCode, insRequestId: req.irId, isActive: true } });
        rollsInIr?.forEach(r => {
            rollIds.push(r.refIdL1);
        })
        const rollsBasicInfoReq = new InsBasicRollInfoRequest(req.username, req.unitCode, req.companyCode, 0, rollIds, false)
        const rollsBasicInfo = (await this.inspectionHelperService.getBasicRollInfoForInspection(rollsBasicInfoReq)).data;
        rollsBasicInfo?.forEach(r => {
            const insIrRollsModel = new InsIrRollModel(r.rollId, r.barcode, r);
            irRollModels.push(insIrRollsModel);
        });
        return new InsIrRollsModel(null, irRollModels);
    }

    async getInitialIRBasicInfoFilterByBatchCode(req: InsInspectionRequestsFilterRequest): Promise<InsInspectionBasicInfoModel[]> {
        const insReqIds = await this.inspReqItemsRepo.find({ select: ['insRequestId'], where: { 'itemCode': req.itemCode, 'companyCode': req.companyCode, 'unitCode': req.unitCode } });


        const insReqIdValues = [...new Set(insReqIds.map(obj => obj.insRequestId))];
        let insHeaders: InsRequestEntity[] = await this.inspReqRepo.find({
            where: {
                insActivityStatus: req.inspectionCurrentActivity, insType: req.inspectionType as unknown as InsTypesEnumType, isActive: true, companyCode: req.companyCode, unitCode: req.unitCode, id: In(insReqIdValues),
            }
        });
        const insBasicModels = await this.getInsInfoModelForInsHeaders(insHeaders, req.companyCode, req.unitCode);
        return insBasicModels;
    }

    async getInitialIRRollsInfo(req: InsIrIdRequest): Promise<InsIrRollsModel> {
        return await this.getInitialRolls(req);
    }

    async getShrinkageIRRollsInfo(req: InsIrIdRequest): Promise<InsIrRollsModel> {
        return await this.getInitialRolls(req);
    }

    async getLabIRRollsInfo(req: InsIrIdRequest): Promise<InsIrRollsModel> {
        return await this.getInitialRolls(req);
    }

    async getRelaxationIRRollsInfo(req: InsIrIdRequest): Promise<InsIrRollsModel> {
        return await this.getInitialRolls(req);
    }

    async geShadeIRRollsInfo(req: InsIrIdRequest): Promise<InsIrRollsModel> {
        return await this.getInitialRolls(req);
    }

    async getRollCountByBatchNoForIns(batchNo: string, unitCode: string, companyCode: string): Promise<number> {
        return await this.inspReqItemsRepo.getRollCountByBatchNoForIns(batchNo, unitCode, companyCode);
    }

    async getInsRollActualRecords(rollId: number, unitCode: string, companyCode: string): Promise<InsRollsActualInfoEntity> {
        return await this.insRollActualRepo.findOne({ where: { insRequestItemsId: rollId, unitCode: unitCode, companyCode: companyCode } });
    }

    async getInspectionDetailsForRequestId(inspReqId: number, unitCode: string, companyCode: string, username: string, rollId?: number, rollSampleId?: number, isReport?: boolean,): Promise<InsGetInspectionHeaderRollInfoResp> {
        const inspectDetails = await this.inspReqRepo.findOne({ where: { id: inspReqId, unitCode, companyCode } });

        if (!inspectDetails) {
            throw new ErrorResponse(1038, 'Inspection details not found for given inspection header Id');
        }
        // if (!isReport) {
        //     if (
        //         inspectDetails.insActivityStatus === InsInspectionActivityStatusEnum.OPEN ||
        //         inspectDetails.insActivityStatus === InsInspectionActivityStatusEnum.MATERIAL_RECEIVED
        //     ) {
        //         throw new ErrorResponse(1052, 'Inspection not yet started, Please start the inspection in the board.');
        //     }

        // }

        const inspectedResults = await this.inspReqItemsRepo.getInspectedQtyByInspReqId(inspReqId, unitCode, companyCode);
        const inspectionAttributes = await this.inspAttributesRepo.find({ where: { insRequestId: inspReqId, unitCode, companyCode } }); 

        const attributeInfo = inspectionAttributes.map((att) => {
            return new InsAttributeNameValueModel(att.attributeName, att.attributeValue);
        });

        const totalNoOfRequestRolls: number = (await this.inspReqItemsRepo.getInspectionQtyByInspReqId(inspReqId, unitCode, companyCode)).no_of_rolls;

        const totalNoOfBatchRolls: number = await this.getRollCountByBatchNoForIns(inspectDetails.refJobL1, unitCode, companyCode);

        const totalNoOfInspectedRolls: number = inspectedResults.no_of_rolls;
        const req = new InsPhIdRequest(username, unitCode, companyCode, 0, [inspectDetails.refIdL1], [inspectDetails.insType])
        const inspectionDet: HeaderDetailsResponse = await this.inspectionHelperService.getHeaderDetailsForInspection(req);

        const inspectionQty = (await this.inspReqItemsRepo.getInspectionQtyByInspReqId(inspReqId, unitCode, companyCode)).inspected_qty;


        const inspHeaderInfo = new InsCommonInspectionHeaderInfo(inspectDetails.id, inspectDetails.insType as unknown as InsFabricInspectionRequestCategoryEnum, inspectDetails.refJobL1, totalNoOfBatchRolls, totalNoOfRequestRolls, totalNoOfInspectedRolls
            , inspectionDet?.data?.percentage, inspectDetails.refJobL2, inspectionQty, inspectedResults.inspected_qty, inspectDetails.insCreationTime, inspectDetails.materialReceiveAt, inspectDetails.insCompletedAt, inspectDetails.inspector, inspectDetails.finalInspectionStatus,
            // inspectDetails.fabricComposition
            '',
            attributeInfo, inspectDetails.createReRequest,);

        let shadeInsInfo: InsShadeInspectionRequest = null;
        let basicInsInfo: InsBasicInspectionRequest = null;
        let labInsInfo: InsLabInspectionRequest = null;
        let shrinkageInfo: InsShrinkageInspectionRequest = null;
        let relaxationInfo: InsRelaxationInspectionRequest = null;
        const inspectedRolls = rollId
            ? await this.inspReqItemsRepo.find({
                where: {
                    insRequestId: inspectDetails.id,
                    unitCode,
                    companyCode,
                    refIdL1: rollId?.toString()
                }
            })
            : await this.inspReqItemsRepo.find({
                where: {
                    insRequestId: inspectDetails.id,
                    unitCode,
                    companyCode
                }
            });

        if (!inspectedRolls.length) {
            throw new ErrorResponse(1039, 'Inspection objects not found for given inspection header Id');
        }
        if (inspectDetails.insType == InsTypesEnum.INSPECTION) {
            basicInsInfo = new InsBasicInspectionRequest();
            basicInsInfo.inspectionHeader = inspHeaderInfo;
            basicInsInfo.inspectionRollDetails = [];
            for (const eachRoll of inspectedRolls) {
                const fourPointInfo = await this.getFourPointDetailsForRoll(Number(eachRoll.refIdL1), unitCode, companyCode);
                // get the actual four points width
                const atualRollInfo = await this.getInsRollActualRecords(Number(eachRoll.refIdL1), unitCode, companyCode);
                const atualRollInfoReq = new RollNumberRequest(username, unitCode, companyCode, 0, Number(eachRoll.id));

                const rollBasicInfo: BasicRollInfoQryResp = await this.inspReqItemsRepo.getInsBasicRollInfoForRollId(Number(eachRoll.refIdL1), unitCode, companyCode);

                const inspectionDetails = new InsBasicInspectionRollDetails(Number(eachRoll.refIdL1), rollBasicInfo?.object_ext_no, rollBasicInfo.barcode, rollBasicInfo.qr_code, rollBasicInfo.lot_number, eachRoll.insQuantity, rollBasicInfo.s_width, eachRoll.inspectionResult, eachRoll.finalInspectionStatus, fourPointInfo, eachRoll.remarks, atualRollInfo?.fourPointsWidth, atualRollInfo?.fourPointsLength, rollBasicInfo.s_shade);
                basicInsInfo.inspectionRollDetails.push(inspectionDetails);
            }
        }
        if (inspectDetails.insType == InsTypesEnum.LAB_INSPECTION) {
            labInsInfo = new InsLabInspectionRequest();
            labInsInfo.inspectionHeader = inspHeaderInfo;
            labInsInfo.inspectionRollDetails = [];
            for (const eachRoll of inspectedRolls) {
                const gsmInfo = await this.geItemLineActualForGsm(Number(eachRoll.refIdL1), unitCode, companyCode, 0, username, eachRoll.id);

                gsmInfo.remarks = eachRoll.remarks;
                gsmInfo.rollFinalInsResult = eachRoll.finalInspectionStatus;
                gsmInfo.rollInsResult = eachRoll.inspectionResult;
                labInsInfo.inspectionRollDetails.push(gsmInfo);
            }
        }
        if (inspectDetails.insType == InsTypesEnum.RELAXATION) {
            relaxationInfo = new InsRelaxationInspectionRequest();
            relaxationInfo.inspectionHeader = inspHeaderInfo;
            relaxationInfo.inspectionRollDetails = [];
            for (const eachRoll of inspectedRolls) {
                const relaxationDetails = await this.getItemLineActualForRelaxation(Number(eachRoll.refIdL1), unitCode, companyCode, username, 0, eachRoll.id);
                relaxationDetails.rollInsResult = eachRoll.inspectionResult;
                relaxationDetails.rollFinalInsResult = eachRoll.finalInspectionStatus;
                relaxationDetails.remarks = eachRoll.remarks;
                relaxationInfo.inspectionRollDetails.push(relaxationDetails);
            }
        }
        if (inspectDetails.insType == InsTypesEnum.SHADE_SEGREGATION) {
            shadeInsInfo = new InsShadeInspectionRequest();
            shadeInsInfo.inspectionHeader = inspHeaderInfo;
            shadeInsInfo.inspectionRollDetails = [];
            for (const eachRoll of inspectedRolls) {
                const shadeDetails = await this.getItemLineActualForShade(Number(eachRoll.refIdL1), unitCode, companyCode, username, 0);
                shadeDetails.remarks = eachRoll.remarks;
                shadeDetails.rollInsResult = eachRoll.inspectionResult;
                shadeDetails.rollFinalInsResult = eachRoll.finalInspectionStatus;
                shadeInsInfo.inspectionRollDetails.push(shadeDetails);
            }
        }
        if (inspectDetails.insType == InsTypesEnum.SHRINKAGE) {
            shrinkageInfo = new InsShrinkageInspectionRequest();
            shrinkageInfo.inspectionHeader = inspHeaderInfo;
            shrinkageInfo.inspectionRollDetails = [];
            for (const eachRoll of inspectedRolls) {
                const shrinkageDetails = await this.getItemLineActualForShrinkage(Number(eachRoll.refIdL1), eachRoll.insRequestLineId, unitCode, companyCode, username, 0);
                shrinkageDetails.rollInfo.rollFinalInsResult = eachRoll.finalInspectionStatus;
                shrinkageDetails.rollInfo.rollInsResult = eachRoll.inspectionResult;
                shrinkageInfo.inspectionRollDetails.push(shrinkageDetails);
            }
        }
        const rollInfo = new InsRollInspectionInfo(shadeInsInfo, basicInsInfo, labInsInfo, shrinkageInfo, relaxationInfo);
        return new InsGetInspectionHeaderRollInfoResp(true, 1041, 'Inspection header and object info received successfully', rollInfo)
    }

    /**
        * SERVICE TO GET INSPECTION DETAILS FOR ROLL ID AND INSPECTION CATEGORY
        * @param barcode 
        * @param inspCategory 
        * @param unitCode 
        * @param companyCode 
        * @returns 
        */
    async getInspectionDetailForRollIdAndInspCategory(barcode: string, inspCategory: InsFabricInspectionRequestCategoryEnum, unitCode: string, companyCode: string): Promise<InsGetInspectionHeaderRollInfoResp> {
        // get the roll Id by barcode;
        const barcodeType: string = barcode.split('-')[0];
        let rollSampleId = null;
        let result = null;
        let data = null
        if (barcodeType == BarcodeTypesEnum.R) {
            result = await this.inspReqItemsRepo.getInsRollIdByBarcode(barcode, unitCode, companyCode);
            const insReqData = await this.inspReqRepo.find({ select: ['insType', 'id'], where: { id: In(result?.insReqId) } });
            data = insReqData?.filter((item) => item.insType === inspCategory);
            if (!result.rollid) {
                throw new ErrorResponse(1042, 'Barcode not found.')
            }
        }
        if (barcodeType == BarcodeTypesEnum.S) {
            // const rollSampleIds = await this.packingListService.getSampleRollIdByBarcode(barcode, unitCode, companyCode);
            if (!rollSampleId) {
                throw new ErrorResponse(1043, 'Sample Barcode Not Found.')
            }
            // rollSampleId = rollSampleIds.sample_roll_id;
            // rollId = rollSampleIds.roll_id;
        }
        // let inspReqId = !rollSampleId ? await this.inspReqItemsRepo.getInspectionReqIdByRollIdAndReqCategory(rollId, inspCategory, unitCode, companyCode) : await this.inspReqItemsRepo.getInspectionReqIdBySampleRollIdAndReqCategory(rollSampleId, inspCategory, unitCode, companyCode); 
        if (!data?.length) {
            throw new ErrorResponse(1040, 'Inspection Id not found for given object id and inspection category');
        }


        return await this.getInspectionDetailsForRequestId(data[0]?.id, unitCode, companyCode,'',result?.rollid[0], rollSampleId);
    }

    /**
    * Service to get inspection details for a request Id
    * @param inspReqId 
    * @param unitCode 
    * @param companyCode 
    * @param rollId 
    */
    async getInspectionDetailsForRequestIdReport(inspReqId: number, unitCode: string, companyCode: string, username: string, rollId?: number, rollSampleId?: number): Promise<InsGetInspectionHeaderRollInfoResp> {
        const inspectDetails = await this.inspReqRepo.findOne({ where: { id: inspReqId, unitCode, companyCode } });
        console.log(inspectDetails, '87868768798908-----------')
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

        // const req = new PackListIdRequest('admin', unitCode, companyCode, 0, Number(inspectDetails.refIdL1))
        // const sysPerf = await this.grnServices.getSystemPreferences(req);

        // if (!sysPerf.status) {
        //     throw new ErrorResponse(1037, 'GRN Details not found for the given pack list. Please verify')
        // }

        const totalNoOfRequestRolls: number = (await this.inspReqItemsRepo.getInspectionQtyByInspReqId(inspReqId, unitCode, companyCode)).no_of_rolls;

        const totalNoOfBatchRolls: number = await this.getRollCountByBatchNoForIns(inspectDetails.refJobL1, unitCode, companyCode);

        const totalNoOfInspectedRolls: number = inspectedResults.no_of_rolls;

        // const inspectionPercentage: number = sysPerf.data.rollsPickPercentage;

        const inspectionQty = (await this.inspReqItemsRepo.getInspectionQtyByInspReqId(inspReqId, unitCode, companyCode)).inspected_qty;

        const inspHeaderInfo = new InsCommonInspectionHeaderInfo(inspectDetails.id, inspectDetails.insType as unknown as InsFabricInspectionRequestCategoryEnum, inspectDetails.refJobL1, totalNoOfBatchRolls, totalNoOfRequestRolls, totalNoOfInspectedRolls
            , 0, inspectDetails.refJobL2, 0, inspectionQty, inspectDetails.insCreationTime, inspectDetails.materialReceiveAt, inspectDetails.insCompletedAt, inspectDetails.inspector, inspectDetails.finalInspectionStatus, '', attributeInfo, inspectDetails.createReRequest);

        let shadeInsInfo: InsShadeInspectionRequest = null;
        let basicInsInfo: InsBasicInspectionRequest = null;
        let labInsInfo: InsLabInspectionRequest = null;
        let shrinkageInfo: InsShrinkageInspectionRequest = null;
        let relaxationInfo: InsRelaxationInspectionRequest = null;
        const inspectedRolls = rollId ? await this.inspReqItemsRepo.find({ where: { insRequestId: inspectDetails.id, unitCode, companyCode, refIdL1: rollId?.toString() } }) : await this.inspReqItemsRepo.find({ where: { insRequestId: inspectDetails.id, unitCode, companyCode } });
        if (!inspectedRolls.length) {
            throw new ErrorResponse(1039, 'Inspection objects not found for given inspection header Id');
        }
        if (inspectDetails.insType == InsTypesEnum.INSPECTION) {
            basicInsInfo = new InsBasicInspectionRequest();
            basicInsInfo.inspectionHeader = inspHeaderInfo;
            basicInsInfo.inspectionRollDetails = [];
            for (const eachRoll of inspectedRolls) {
                const fourPointInfo = await this.getFourPointDetailsForRoll(Number(eachRoll.refIdL1), unitCode, companyCode);
                // get the actual four points width
                const atualRollInfo = await this.getInsRollActualRecords(eachRoll.id, unitCode, companyCode);
                const atualRollInfoReq = new RollNumberRequest(username, unitCode, companyCode, 0, Number(eachRoll.id));
                const rollBasicInfo: BasicRollInfoQryResp = await this.inspReqItemsRepo.getInsBasicRollInfoForRollId(Number(eachRoll.refIdL1), unitCode, companyCode);
                const inspectionDetails = new InsBasicInspectionRollDetails(Number(eachRoll.id), rollBasicInfo.object_ext_no, rollBasicInfo.barcode, rollBasicInfo.qr_code, rollBasicInfo.lot_number, eachRoll.insQuantity, rollBasicInfo.s_width, eachRoll.inspectionResult, eachRoll.finalInspectionStatus, fourPointInfo, eachRoll.remarks, atualRollInfo?.fourPointsWidth, atualRollInfo?.fourPointsLength, rollBasicInfo.s_shade);
                basicInsInfo.inspectionRollDetails.push(inspectionDetails);
            }
        }
        if (inspectDetails.insType == InsTypesEnum.LAB_INSPECTION) {
            labInsInfo = new InsLabInspectionRequest();
            labInsInfo.inspectionHeader = inspHeaderInfo;
            labInsInfo.inspectionRollDetails = [];
            for (const eachRoll of inspectedRolls) {
                const gsmInfo = await this.geItemLineActualForGsm(eachRoll.id, unitCode, companyCode, 0, username);
                gsmInfo.remarks = eachRoll.remarks;
                gsmInfo.rollFinalInsResult = eachRoll.finalInspectionStatus;
                gsmInfo.rollInsResult = eachRoll.inspectionResult;
                labInsInfo.inspectionRollDetails.push(gsmInfo);
            }
        }
        if (inspectDetails.insType == InsTypesEnum.RELAXATION) {
            relaxationInfo = new InsRelaxationInspectionRequest();
            relaxationInfo.inspectionHeader = inspHeaderInfo;
            relaxationInfo.inspectionRollDetails = [];
            for (const eachRoll of inspectedRolls) {
                const relaxationDetails = await this.getItemLineActualForRelaxation(eachRoll.id, unitCode, companyCode, username, 0, 0);
                relaxationDetails.rollInsResult = eachRoll.inspectionResult;
                relaxationDetails.rollFinalInsResult = eachRoll.finalInspectionStatus;
                relaxationDetails.remarks = eachRoll.remarks;
                relaxationInfo.inspectionRollDetails.push(relaxationDetails);
            }
        }
        if (inspectDetails.insType == InsTypesEnum.SHADE_SEGREGATION) {
            shadeInsInfo = new InsShadeInspectionRequest();
            shadeInsInfo.inspectionHeader = inspHeaderInfo;
            shadeInsInfo.inspectionRollDetails = [];

            for (const eachRoll of inspectedRolls) {
                const shadeDetails = await this.getItemLineActualForShade(eachRoll.id, unitCode, companyCode, username, 0);
                shadeDetails.remarks = eachRoll.remarks;
                shadeDetails.rollInsResult = eachRoll.inspectionResult;
                shadeDetails.rollFinalInsResult = eachRoll.finalInspectionStatus;
                shadeInsInfo.inspectionRollDetails.push(shadeDetails);
            }
        }
        if (inspectDetails.insType == InsTypesEnum.SHRINKAGE) {
            shrinkageInfo = new InsShrinkageInspectionRequest();
            shrinkageInfo.inspectionHeader = inspHeaderInfo;
            shrinkageInfo.inspectionRollDetails = [];
            for (const eachRoll of inspectedRolls) {
                const shrinkageDetails = await this.getItemLineActualForShrinkage(eachRoll.id, eachRoll.insRequestLineId, unitCode, companyCode, username, 0);
                shrinkageDetails.rollInfo.rollFinalInsResult = eachRoll.finalInspectionStatus;
                shrinkageDetails.rollInfo.rollInsResult = eachRoll.inspectionResult;
                shrinkageInfo.inspectionRollDetails.push(shrinkageDetails);
            }
        }
        const rollInfo = new InsRollInspectionInfo(shadeInsInfo, basicInsInfo, labInsInfo, shrinkageInfo, relaxationInfo);
        return new InsGetInspectionHeaderRollInfoResp(true, 1041, 'Inspection header and object info received successfully', rollInfo)
    }


    async getCheckListPrintData(req: InsPhIdRequest): Promise<RollsCheckListResponse> {
        const allRequestHeaders: RollReqHeaderModel[] = [];

        // Step 1: Collect all rollIds
        const allRollIds: number[] = [];
        let date = '';
        for (const phId of req.phId) {
            const rolls = await this.inspReqItemsRepo.find({ where: { 'insRequestId': req.insId } });
            for (const roll of rolls) {
                allRollIds.push(Number(roll.refIdL1));
            }
        }
        const rollIdsReq = new RollIdsRequest(req.username, req.unitCode, req.companyCode, 0, allRollIds);
        // Step 2: Get roll locations via API/service
        const locationResponse: RollLocationsResponse = await this.locationAllocationService.getLocationDetailsForRollIds(rollIdsReq);
        if (!locationResponse.status) {
            throw new ErrorResponse(locationResponse.errorCode, locationResponse.internalMessage);
        }
        const rollLocMap = new Map<string, RollLocationModel>();
        if (locationResponse?.data) {
            locationResponse.data.forEach(loc => rollLocMap.set(loc.rollId, loc));
        }
        console.log('rollLocMap', rollLocMap);

        // Step 3: Proceed with checklist generation
        for (const phId of req.phId) {
            let packListId = phId;
            const inspReqRec = await this.inspReqRepo.find({ where: { refIdL1: phId.toString() } });
            date = inspReqRec[0].insCreationTime?.toString();
            if (!inspReqRec.length) {
                throw new ErrorResponse(1038, 'Inspection details not found for given inspection header Id');
            }

            const whReqItems: RollsReqItemsModel[] = [];
            const rolls = await this.inspReqItemsRepo.find({ where: { refIdL1: phId.toString() } });

            const rollsGroupedByPackListId = new Map<string, RollsReqSubItemModel[]>();
            const attrMap = await this.getAttributesMapByRequestId(inspReqRec[0].id);

            // Adjusted whReqItemAttrs to match expected field names
            const whReqItemAttrs = new RollsReqItemAttrs(
                attrMap.get(InsInspectionHeaderAttributes.CUSTOMER_STYLE),         // moNo
                [attrMap.get(InsInspectionHeaderAttributes.FABRIC_DESCRIPTION)], // prodNames
                [attrMap.get(InsInspectionHeaderAttributes.STYLE_NO)],          // styles
                [attrMap.get(InsInspectionHeaderAttributes.PO_NO)],              // poNo
                [attrMap.get(InsInspectionHeaderAttributes.BUYER)],                // buyers
                [attrMap.get(InsInspectionHeaderAttributes.DESTINATION)],           // destinations
                [attrMap.get(InsInspectionHeaderAttributes.DELIVARYDATE)]   // delDates
            );

            for (const eachRoll of rolls) {
                // Get updated location from API response (tray -> pallet -> trolley -> bin)
                const locationInfo = rollLocMap.get(eachRoll.refIdL1);
                const location = locationInfo?.trayInfo?.trolleyInfo.binId || 'Unmapped';

                // Make loadedInfo dynamic (e.g., based on some roll property, assuming it exists)
                // const loadedInfo = eachRoll.loadedInfo !== undefined ? eachRoll.loadedInfo : true; // Fallback to true if not present
                const loadedInfo = true; // Assuming loadedInfo is always true for this example

                const rollModel = new RollsReqSubItemModel(
                    eachRoll.refNoL1,        // barcode
                    eachRoll.insQuantity,    // rollQty
                    location,                // location
                    loadedInfo,              // loadedInfo (dynamic)
                    Number(eachRoll.refIdL1) // rollId
                );

                if (!rollsGroupedByPackListId.has(packListId)) {
                    rollsGroupedByPackListId.set(packListId, []);
                }
                rollsGroupedByPackListId.get(packListId).push(rollModel);
            }

            for (const [packListId, rollList] of rollsGroupedByPackListId.entries()) {
                const totalRolls = rollList.length;
                const locMapRolls = rollList.filter(r => r.location !== 'Unmapped').length;
                const locUnMapRolls = totalRolls - locMapRolls;
                const fgInRolls = rollList.filter(r => r.loadedInfo === true).length;
                const fgOutRolls = totalRolls - fgInRolls;

                const rollsAbstract = new RollsReqItemAbstract(
                    totalRolls,
                    locMapRolls,
                    locUnMapRolls,
                    fgInRolls,
                    fgOutRolls
                );

                const itemModel = new RollsReqItemsModel(
                    packListId,
                    rollsAbstract,
                    whReqItemAttrs,
                    rollList.map(roll => ({
                        barcode: roll.barcode,
                        rollQty: roll.rollQty,
                        location: roll.location,
                        loadedInfo: roll.loadedInfo,
                        rollId: roll.rollId
                    })),
                    null
                );

                whReqItems.push(itemModel);
            }

            const fgWhHeader = new RollReqHeaderModel(packListId, whReqItems, date);
            allRequestHeaders.push(fgWhHeader);
        }

        return new RollsCheckListResponse(true, 200, "Checklist data fetched successfully", allRequestHeaders);
    }



    async getAttributesMapByRequestId(insRequestId: number): Promise<Map<string, string>> {
        const attributes = await this.inspAttributesRepo.find({
            where: { insRequestId }
        });
        const attrMap = new Map<string, string>();
        for (const attr of attributes) {
            attrMap.set(attr.attributeName, attr.attributeValue);
        }
        return attrMap;
    }

    async checkForShowInInventoryUpdate(req: InsPhIdRequest): Promise<CommonResponse> {
        try {
            const phId = req.phId[0];
            const inspReqRec = await this.inspReqRepo.find({ where: { refIdL1: phId } });
            if (!inspReqRec.length) {
                throw new ErrorResponse(1038, 'Inspection details not found for given inspection header Id');
            }
            const inspections = await this.inspReqRepo.find({ where: { refIdL1: phId } });
            const allPass =
                req.InspectionTypes.every((type) => {
                    const matching = inspections.filter((item) => item.insType === type);
                    return (
                        matching.length > 0 &&
                        matching.every(
                            (item) =>
                                item.finalInspectionStatus === InsInspectionFinalInSpectionStatusEnum.PASS &&
                                item.insActivityStatus === InsInspectionActivityStatusEnum.COMPLETED
                        )
                    );
                });
            if (allPass) {
                return new CommonResponse(true, 200, 'All Types Inspections are passed and inspection is completed.', true)
            }
            return new CommonResponse(true, 200, 'All  Types Inspections are not passed and inspection is not completed.', false)

        } catch (error) {
            throw new ErrorResponse(1038, 'Error occurred while updating ShowInInventory',);
        }

    }

    // async getEligibleRollInfoForInspectionTypeForLot(lotNumber: string, inspectionType: InsFabricInspectionRequestCategoryEnum, unitCode: string, companyCode: string): Promise<PackingListInfoResponse> {
    // const inspectionHeaderInfo = await this.insReqRepo.findOne({ where: { lotNumber, requestCategory: inspectionType, parentRequestId: null } });
    // if (!inspectionHeaderInfo) {
    // throw new ErrorResponse(1058, 'Inspection Request not found for the given lot number and inspection category.')
    // }
    // const alreadySelectedRollInfo: number[] = await this.insItemRepo.getSelectedRollInfoForLotReqType(lotNumber, inspectionType, unitCode, companyCode);
    // if (!alreadySelectedRollInfo.length) {
    // throw new ErrorResponse(1057, 'Objects Not found for the re request.');
    // };
    // const reqObj = new PhBatchLotRollRequest(inspectionHeaderInfo.createdUser, unitCode, companyCode, 0, inspectionHeaderInfo.phId, null, inspectionHeaderInfo.lotNumber, null, null);
    // const packingListWithRollsInfo: PackingListInfoResponse = await this.packingListService.getPackListInfo(reqObj);
    // if (!packingListWithRollsInfo.status) {
    // throw new ErrorResponse(packingListWithRollsInfo.errorCode, packingListWithRollsInfo.internalMessage);
    // }
    // for (const packingListHead of packingListWithRollsInfo.data) {
    // for (const phBatchInfo of packingListHead.batchInfo) {
    // for (const lotInfo of phBatchInfo.lotInfo) {
    // for (const eachRoll of lotInfo.rollInfo) {
    // if (alreadySelectedRollInfo.includes(eachRoll.id)) {
    // eachRoll.inspCompleted = true;
    // }
    // }
    // }
    // }
    // }
    // return packingListWithRollsInfo;
    // }

    // async getRollsToInspectionRequestIdMappingEntities(rollIds: number[], batchNo: string, inspReqId: number, itemCode: string, lotNumber: string, unitCode: string, companyCode: string, username: string): Promise<InsRequestItemEntity[]> {
    // const codes: RollSoAbtractInfoQueryResponse[] = await this.phItemLinesRepo.getSoAbstractInfoForRollIds(unitCode, companyCode, rollIds);

    // const styleCodesAndRollIds = codes.reduce((acc, code) => {
    // acc[code.rollId] = code.style;
    // return acc;
    // }, {} as Record<string, string>);
    // const mappingEntities: InsRequestItemEntity[] = [];
    // for (const eachRoll of rollIds) {
    // const inspReqItem = new InsRequestItemEntity();
    // inspReqItem.acceptance = null;
    // inspReqItem.acceptedQuantity = 0;
    // inspReqItem.batchNumber = batchNo;
    // inspReqItem.companyCode = companyCode;
    // inspReqItem.createdUser = username;
    // inspReqItem.insCompletedAt = null;
    // inspReqItem.insRequestId = inspReqId;
    // inspReqItem.insStartedAt = null;
    // inspReqItem.inspectionPerson = null;
    // // inspReqItem.inspectionResult = InspectionResultEnum.OPEN;
    // inspReqItem.inspectionResult = InspectionFinalInSpectionStatusEnum.OPEN;
    // inspReqItem.finalInspectionResult = InspectionFinalInSpectionStatusEnum.OPEN;

    // inspReqItem.itemCode = itemCode;
    // inspReqItem.lotNumber = lotNumber;
    // inspReqItem.objectType = PhItemLinesObjectTypeEnum.ROLL;
    // // inspReqItem.phItemLineSampleId = reqModel.requestCategory == InspectionRequestCategoryEnum.SHRINKAGE ? (await this.packingListService.getSampleRollIdByRollId(eachRoll, unitCode, companyCode)).sample_roll_id : null;
    // inspReqItem.phItemLineSampleId = null;
    // inspReqItem.phItemLinesId = eachRoll;
    // inspReqItem.quantity = await this.packingListService.getRollQtyByRollId(eachRoll, unitCode, companyCode);
    // inspReqItem.remarks = null;
    // inspReqItem.unitCode = unitCode;
    // inspReqItem.workstationCode = null;
    // inspReqItem.styleNumber = styleCodesAndRollIds[eachRoll] || "";
    // mappingEntities.push(inspReqItem);
    // }
    // return mappingEntities;
    // }

    // async mapRollIdsToInspectionRequest(insRequestId: number, unitCode: string, companyCode: string, userName: string, rollIds: number[]): Promise<GlobalResponseObject> {
    // const manager = new GenericTransactionManager(this.dataSource);
    // try {
    // // check inspection request exists or not
    // const headerDetail: InsRequestEntity = await this.inspReqRepo.findOne({ where: { id: insRequestId, unitCode, companyCode } });
    // if (!headerDetail) {
    // throw new ErrorResponse(1048, 'Inspection Request details not found for given request Id, Please verify')
    // }
    // if (headerDetail.insActivityStatus != InsInspectionActivityStatusEnum.OPEN) {
    // throw new ErrorResponse(1052, 'Inspection not yet started, Please start the inspection in the board.')
    // }
    // const headerItems = await this.inspReqItemsRepo.find({ where: { insRequestId: insRequestId, unitCode, companyCode } });
    // if (headerItems.length) {
    // throw new ErrorResponse(1055, 'Rolls already mapped to the inspection request, Please check');
    // }
    // const itemInfo = await this.packingListInfoService.getItemInfoByLotNumber(headerDetail.lotNumber, unitCode, companyCode)
    // await manager.startTransaction();
    // const rollMapping: InsRequestItemEntity[] = await this.getRollsToInspectionRequestIdMappingEntities(rollIds, headerDetail.batchNumber, insRequestId, itemInfo.item_code, headerDetail.lotNumber, unitCode, companyCode, userName);
    // await manager.getRepository(InsRequestItemEntity).save(rollMapping);
    // const date = moment(new Date()).format('YYYY-MM-DD');
    // const reqObj = new IrActivityChangeRequest(userName, unitCode, companyCode, 0, insRequestId, date, InspectionInsActivityStatusEnum.MATERIAL_RECEIVED, '');
    // await this.inspectionInfoService.updateInspectionActivityStatus(reqObj);
    // await manager.completeTransaction();

    // return new GlobalResponseObject(true, 1056, 'Rolls successfully mapped to inspection request');


    // } catch (err) {
    // await manager.releaseTransaction();
    // throw err;
    // }


    // }


}
