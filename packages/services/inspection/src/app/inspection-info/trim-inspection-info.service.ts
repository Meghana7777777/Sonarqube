import { Injectable } from "@nestjs/common";
import { ErrorResponse } from "@xpparel/backend-utils";
import { BarcodeTypesEnum, HeaderDetailsResponse, InsAttributeNameValueModel, InsBasicRollInfoRequest, InsInspectionActivityStatusEnum, InsInspectionHeaderAttributes, InsInspectionResultEnum, InsIrIdRequest, InsIrRollModel, InsPhIdRequest, InsTypesEnum, InsTypesEnumType, RollIdRequest, RollIdsRequest, RollNumberRequest, TrimInsBasicInspectionRequest, TrimInsBasicInspectionRollDetails, TrimInsCommonInspectionHeaderInfo, TrimInsInspectionConeDetails, TrimInsInspectionRequestsFilterRequest, TrimInsIrRollsModel, TrimInsIrRollsResponse, TrimInspectionBasicInfoModel, TrimInspectionBasicInfoResponse, TrimInspectionHeaderRollInfoResp, TrimInspectionTypeRequest, TrimInsRollInspectionInfo, TrimTypeEnum } from "@xpparel/shared-models";
import { InspectionHelperService, PackingListService } from "@xpparel/shared-services";
import { DataSource, In } from "typeorm";
import { InsRequestEntity } from "../entities/ins-request.entity";
import { InsRollsActualInfoEntity } from "../entities/ins_rolls_actual_info.entity";
import { InsRequestAttributeRepo } from "../inspection/repositories/ins-request-attributes.repository";
import { InsRequestItemRepo } from "../inspection/repositories/ins-request-items.repository";
import { InsRequestEntityRepo } from "../inspection/repositories/ins-request.repository";
import { InsRollActualRepo } from "../inspection/repositories/ins-roll-actual.repo";
import { InsTrimsDefectsRepo } from "../inspection/repositories/ins-trims-defects.repository";
import { InsTrimsRepo } from "../inspection/repositories/ins-trims.repository";
import { BasicRollInfoQryResp } from "../inspection/repositories/query-response/roll-basic-info.qry.resp";

@Injectable()
export class TrimInspectionInfoService {
    constructor(
        private dataSource: DataSource,
        private inspReqRepo: InsRequestEntityRepo,
        private inspAttributesRepo: InsRequestAttributeRepo,
        private inspReqItemsRepo: InsRequestItemRepo,
        private inspectionHelperService: InspectionHelperService,
        private packingListService: PackingListService,
        private insRollActualRepo: InsRollActualRepo,
        private insTrimsRepo: InsTrimsRepo,
        private insTrimsDefectsRepo: InsTrimsDefectsRepo,


    ) { }



    async getInspectionMaterialPendingData(req: TrimInspectionTypeRequest): Promise<TrimInspectionBasicInfoResponse> {
        let insRes: TrimInspectionBasicInfoModel[] = [];
        switch (req.inspectionType) {
            case TrimTypeEnum.TRIMINS: insRes = await this.getInitialIRBasicInfo(req);
                break;
            default: throw new ErrorResponse(0, 'Inspection request is not found');
        }
        return new TrimInspectionBasicInfoResponse(true, 0, 'Inspection requests info retrieved successfully', insRes);
    }


    async getInitialIRBasicInfo(req: TrimInspectionTypeRequest): Promise<TrimInspectionBasicInfoModel[]> {
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
    async getInsInfoModelForInsHeaders(insHeaders: InsRequestEntity[], companyCode: string, unitCode: string): Promise<TrimInspectionBasicInfoModel[]> {
        const insRes: TrimInspectionBasicInfoModel[] = [];
        for (const rec of insHeaders) {
            let styleNo = await this.inspAttributesRepo.findOne({ where: { insRequestId: rec.id, attributeName: InsInspectionHeaderAttributes.STYLE_NO, }, select: ['attributeValue'], });
            const materialReceived = rec.insActivityStatus == InsInspectionActivityStatusEnum.MATERIAL_RECEIVED;
            const insComplete = rec.insActivityStatus == InsInspectionActivityStatusEnum.COMPLETED;
            const insProgress = rec.insActivityStatus == InsInspectionActivityStatusEnum.INPROGRESS;
            const phReq = new InsPhIdRequest('', unitCode, companyCode, 0, [rec.refIdL1])
            const phRec = await this.inspectionHelperService.getPackListRecordDataForPackListId(phReq);
            // get the inspection properties for the current IR
            const insRolls = await this.getInsRollCompletionInfoForIr(companyCode, unitCode, rec.id);
            const rollIds = insRolls.map(r => r.rollId);
            const totalItemsForIns = insRolls.length;
            let totalFailItems = 0;
            let totalPassItems = 0;

            insRolls.forEach(r => {
                if (r.insStatus === InsInspectionResultEnum.PASS) {
                    totalPassItems++;
                } else if (r.insStatus === InsInspectionResultEnum.FAIL) {
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
                const insInfoModel = new TrimInspectionBasicInfoModel(rec.id, Number(rec.refIdL1), phRec.data?.packListCode, phRec.data.supplierCode, rec.refJobL2, null, rec.insCode, totalItemsForIns, totalPassItems, rollIdsReq, rec.insType as unknown as TrimTypeEnum, rec.materialReceiveAt?.toString(), rec.createdAt?.toString(), rec.insStartedAt?.toString(), null, materialReceived, insProgress, insComplete, rec.finalInspectionStatus, totalFailItems, [rec.refJobL1], isReRequest, styleNo?.attributeValue);
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



    async getInspectionRequestSpollsInfo(req: InsIrIdRequest): Promise<TrimInsIrRollsResponse> {
        let irRollsModel: TrimInsIrRollsModel;
        const insReqRec = await this.inspReqRepo.findOne({ select: ['insType'], where: { id: req.irId } });
        const inspectionType = insReqRec.insType;
        switch (inspectionType) {
            case InsTypesEnum.TRIMINS: irRollsModel = await this.getInitialIRRollsInfo(req);
                break;
            default: throw new ErrorResponse(0, 'Inspection request is not found');
        }
        return new TrimInsIrRollsResponse(true, 0, 'Inspection requests info retrieved successfully', irRollsModel);
    }


    async getInitialIRRollsInfo(req: InsIrIdRequest): Promise<TrimInsIrRollsModel> {
        return await this.getInitialRolls(req);
    }


    async getInitialRolls(req: InsIrIdRequest): Promise<TrimInsIrRollsModel> {
        const rollIds = [];
        const irRollModels: InsIrRollModel[] = [];
        const rollsInIr = await this.inspReqItemsRepo?.find({ select: ['refIdL1'], where: { companyCode: req.companyCode, unitCode: req.unitCode, insRequestId: req.irId, isActive: true } });
        rollsInIr?.forEach(r => {
            rollIds.push(r.refIdL1);
        })
        const rollsBasicInfoReq = new InsBasicRollInfoRequest(req.username, req.unitCode, req.companyCode, 0, rollIds, false)
        const rollsBasicInfo = (await this.inspectionHelperService.getBasicRollInfoForInspection(rollsBasicInfoReq)).data;

        rollsBasicInfo?.forEach(r => {
            const insIrRollsModel = new InsIrRollModel(r?.rollId, r?.barcode, r);
            irRollModels.push(insIrRollsModel);
        });
        return new TrimInsIrRollsModel(null, irRollModels);
    }



    async getTrimInspectionDetailsForRequestId(inspReqId: number, unitCode: string, companyCode: string, rollId?: number, rollSampleId?: number, isReport?: boolean): Promise<TrimInspectionHeaderRollInfoResp> {
        const inspectDetails = await this.inspReqRepo.findOne({ where: { id: inspReqId, unitCode, companyCode } });
        if (!inspectDetails) {
            throw new ErrorResponse(1038, 'Inspection details not found for given inspection header Id');
        }
        // if (!isReport) {
        //     if (inspectDetails.insActivityStatus != InsInspectionActivityStatusEnum.INPROGRESS) {
        //         throw new ErrorResponse(1052, 'Inspection not yet started, Please start the inspection in the board.')
        //     }
        // }

        const inspectedResults = await this.inspReqItemsRepo.getInspectedQtyByInspReqId(inspectDetails.id, unitCode, companyCode);
        const inspectionAttributes = await this.inspAttributesRepo.find({ where: { insRequestId: inspReqId, unitCode, companyCode } });
        const attributeInfo = inspectionAttributes.map((att) => {
            return new InsAttributeNameValueModel(att.attributeName, att.attributeValue);
        });


        const totalNoOfRequestRolls: number = (await this.inspReqItemsRepo.getInspectionQtyByInspReqId(inspReqId, unitCode, companyCode)).no_of_rolls;

        const totalNoOfBatchRolls: number = await this.getRollCountByBatchNoForIns(inspectDetails.refJobL1, unitCode, companyCode);

        const totalNoOfInspectedRolls: number = inspectedResults.no_of_rolls;

        // const inspectionPercentage: number = sysPerf.data.rollsPickPercentage;
        const req = new InsPhIdRequest('', unitCode, companyCode, 0, [inspectDetails.refIdL1], [inspectDetails.insType])
        const inspectionDet: HeaderDetailsResponse = await this.inspectionHelperService.getHeaderDetailsForInspection(req);

        const inspectionQty = (await this.inspReqItemsRepo.getInspectionQtyByInspReqId(inspReqId, unitCode, companyCode)).inspected_qty;

        const inspHeaderInfo = new TrimInsCommonInspectionHeaderInfo(inspectDetails.id, inspectDetails.insType as unknown as TrimTypeEnum, inspectDetails.refJobL1, totalNoOfBatchRolls, totalNoOfRequestRolls, totalNoOfInspectedRolls, inspectionDet?.data?.percentage,
            inspectDetails.refJobL2, inspectionQty, inspectedResults.inspected_qty, inspectDetails.insCreationTime, inspectDetails.materialReceiveAt, inspectDetails.insCompletedAt, inspectDetails.inspector, inspectDetails.finalInspectionStatus,
            // inspectDetails.fabricComposition
            '',
            attributeInfo, inspectDetails.createReRequest,);

        let basicInsInfo: TrimInsBasicInspectionRequest = null;


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
        console.log('inspectedrools', inspectedRolls);
        if (inspectDetails.insType == InsTypesEnum.TRIMINS) {
            console.log('inside the iff');
            basicInsInfo = new TrimInsBasicInspectionRequest();
            basicInsInfo.inspectionHeader = inspHeaderInfo;
            basicInsInfo.inspectionRollDetails = [];
            for (const eachRoll of inspectedRolls) {
                const fourPointInfo = await this.getFourPointDetailsForRoll(eachRoll.id, unitCode, companyCode);
                // get the actual four points width
                console.log('fourPointInfo567', fourPointInfo);
                const atualRollInfo = await this.getInsRollActualRecords(eachRoll.id, unitCode, companyCode);
                const atualRollInfoReq = new RollNumberRequest('admin', unitCode, companyCode, 0, Number(eachRoll.id));
                console.log(atualRollInfoReq, 'atualRollInfoReq-----------')
                const rollBasicInfo: BasicRollInfoQryResp = await this.inspReqItemsRepo.getInsBasicRollInfoForRollId(Number(eachRoll.refIdL1), unitCode, companyCode);
                console.log('rollBasicInfo1234', rollBasicInfo);
                const details = await this.insTrimsRepo.find({ where: { 'insReqItemsId': eachRoll.id } })
                // const inspectionDetails = new TrimInsBasicInspectionRollDetails(Number(eachRoll.id), rollBasicInfo?.object_ext_no, rollBasicInfo.barcode, rollBasicInfo.qr_code, rollBasicInfo.lot_number, eachRoll.insQuantity, rollBasicInfo.s_width, eachRoll.inspectionResult, eachRoll.finalInspectionStatus, fourPointInfo, eachRoll.remarks, atualRollInfo?.fourPointsWidth, atualRollInfo?.fourPointsLength, rollBasicInfo.s_shade, 0, 0, 0, 0, 0, 0);
                console.log('54tftyh', details)
                const fdetails = details[0];
                const inspectionDetails = new TrimInsBasicInspectionRollDetails(
                    fourPointInfo,
                    fdetails?.trimName ?? null,
                    fdetails?.trimType ?? null,
                    fdetails?.qualityPassed ?? 0,
                    fdetails?.qualityFailed ?? 0,
                    eachRoll.finalInspectionStatus ?? null,
                    fdetails?.functionalChecks ?? null,
                    fdetails?.visualChecks ?? null,
                    fdetails?.colorChecks ?? null,
                    fdetails?.strengthChecks ?? null,
                    fdetails?.remarks ?? '',
                    Number(eachRoll.id),
                    rollBasicInfo?.object_ext_no ?? null,
                    rollBasicInfo?.barcode ?? '',
                    rollBasicInfo?.qr_code ?? '',
                    rollBasicInfo?.lot_number ?? '',
                    rollBasicInfo?.quantity ?? 0,
                    rollBasicInfo?.s_width ?? 0,
                    eachRoll?.inspectionResult ?? null,
                    eachRoll?.finalInspectionStatus ?? null,
                    rollBasicInfo?.s_shade ?? ''
                );

                basicInsInfo.inspectionRollDetails.push(inspectionDetails);


            }
        }

        const rollInfo = new TrimInsRollInspectionInfo(basicInsInfo);
        console.log('rollinfo', rollInfo);
        return new TrimInspectionHeaderRollInfoResp(true, 1041, 'Inspection header and object info received successfully', rollInfo)
    }

    async getRollCountByBatchNoForIns(batchNo: string, unitCode: string, companyCode: string): Promise<number> {
        return await this.inspReqItemsRepo.getRollCountByBatchNoForIns(batchNo, unitCode, companyCode);
    }




    /**
            * Service to get four point details for the roll
            * @param rollId 
            * @param unitCode 
            * @param companyCode 
            * @returns 
        */
    async getFourPointDetailsForRoll(rollId: number, unitCode: string, companyCode: string): Promise<TrimInsInspectionConeDetails[]> {
        const qryResp = await this.insTrimsDefectsRepo.find({ where: { 'ItemsId': rollId, unitCode: unitCode, companyCode: companyCode } })
        qryResp?.map((eachPoint) => {
            const fountPointObj = new TrimInsInspectionConeDetails();
            fountPointObj.defectType = eachPoint.defectType;
            fountPointObj.defectDescription = eachPoint.defectDescription;
            fountPointObj.defectQuantity = eachPoint.defectQuantity;
            fountPointObj.id = eachPoint.id;
            return fountPointObj
        })
        return null;
    }

    async getInsRollActualRecords(rollId: number, unitCode: string, companyCode: string): Promise<InsRollsActualInfoEntity> {
        return await this.insRollActualRepo.findOne({ where: { insRequestItemsId: rollId, unitCode: unitCode, companyCode: companyCode } });
    }

    async getTrimInspectionRequestBasicInfoByLotCode(req: TrimInsInspectionRequestsFilterRequest): Promise<TrimInspectionBasicInfoResponse> {
        let insRes: TrimInspectionBasicInfoModel[] = [];
        switch (req.inspectionType) {
            case TrimTypeEnum.TRIMINS: insRes = await this.getInitialIRBasicInfoFilterByLotCode(req);
                break;
            default: throw new ErrorResponse(0, 'Inspection request is not found');
        }
        return new TrimInspectionBasicInfoResponse(true, 0, 'Inspection requests info retrieved successfully', insRes);
    }

    async getInitialIRBasicInfoFilterByLotCode(req: TrimInsInspectionRequestsFilterRequest): Promise<TrimInspectionBasicInfoModel[]> {
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

    /**
           * SERVICE TO GET INSPECTION DETAILS FOR ROLL ID AND INSPECTION CATEGORY
           * @param barcode 
           * @param inspCategory 
           * @param unitCode 
           * @param companyCode 
           * @returns 
           */
    async getInspectionDetailForBoxIdAndInspCategory(barcode: string, inspCategory: TrimTypeEnum, unitCode: string, companyCode: string): Promise<TrimInspectionHeaderRollInfoResp> {
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


        return await this.getTrimInspectionDetailsForRequestId(data[0]?.id, unitCode, companyCode, result?.rollid[0], rollSampleId);
    }
}