import { Injectable } from "@nestjs/common";
import { ErrorResponse } from "@xpparel/backend-utils";
import { BarcodeTypesEnum, HeaderDetailsResponse, InsAttributeNameValueModel, InsBasicRollInfoRequest, InsInspectionActivityStatusEnum, InsInspectionHeaderAttributes, InsInspectionResultEnum, InsIrIdRequest, InsIrRollModel, InsPhIdRequest, InsTypesEnum, InsTypesEnumType, RollIdRequest, RollIdsRequest, RollNumberRequest, ThreadInsBasicInspectionRequest, ThreadInsBasicInspectionRollDetails, ThreadInsCommonInspectionHeaderInfo, ThreadInsInspectionConeDetails, ThreadInsInspectionRequestsFilterRequest, ThreadInsIrRollsModel, ThreadInsIrRollsResponse, ThreadInspectionBasicInfoModel, ThreadInspectionBasicInfoResponse, ThreadInspectionHeaderRollInfoResp, ThreadInspectionTypeRequest, ThreadInsRollInspectionInfo, ThreadTypeEnum } from "@xpparel/shared-models";
import { InspectionHelperService, PackingListService } from "@xpparel/shared-services";
import { DataSource, In } from "typeorm";
import { InsRequestEntity } from "../entities/ins-request.entity";
import { InsRollsActualInfoEntity } from "../entities/ins_rolls_actual_info.entity";
import { InsRequestAttributeRepo } from "../inspection/repositories/ins-request-attributes.repository";
import { InsRequestItemRepo } from "../inspection/repositories/ins-request-items.repository";
import { InsRequestEntityRepo } from "../inspection/repositories/ins-request.repository";
import { InsRollActualRepo } from "../inspection/repositories/ins-roll-actual.repo";
import { BasicRollInfoQryResp } from "../inspection/repositories/query-response/roll-basic-info.qry.resp";

@Injectable()
export class ThreadInspectionInfoService {
    constructor(
        private dataSource: DataSource,
        private inspReqRepo: InsRequestEntityRepo,
        private inspAttributesRepo: InsRequestAttributeRepo,
        private inspReqItemsRepo: InsRequestItemRepo,
        private inspectionHelperService: InspectionHelperService,
        private packingListService: PackingListService,
        private insRollActualRepo: InsRollActualRepo,


    ) { }



    async getThreadInspectionMaterialPendingData(req: ThreadInspectionTypeRequest): Promise<ThreadInspectionBasicInfoResponse> {
        let insRes: ThreadInspectionBasicInfoModel[] = [];
        switch (req.inspectionType) {
            case ThreadTypeEnum.THREADINS: insRes = await this.getInitialIRBasicInfo(req);
                break;
            default: throw new ErrorResponse(0, 'Inspection request is not found');
        }
        return new ThreadInspectionBasicInfoResponse(true, 0, 'Inspection requests info retrieved successfully', insRes);
    }


    async getInitialIRBasicInfo(req: ThreadInspectionTypeRequest): Promise<ThreadInspectionBasicInfoModel[]> {
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
    async getInsInfoModelForInsHeaders(insHeaders: InsRequestEntity[], companyCode: string, unitCode: string): Promise<ThreadInspectionBasicInfoModel[]> {
        const insRes: ThreadInspectionBasicInfoModel[] = [];
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
                const insInfoModel = new ThreadInspectionBasicInfoModel(rec.id, Number(rec.refIdL1), phRec.data?.packListCode, phRec.data.supplierCode, rec.refJobL2, null, rec.insCode, totalItemsForIns, totalPassItems, rollIdsReq, rec.insType as any, rec.materialReceiveAt?.toString(), rec.createdAt?.toString(), rec.insStartedAt?.toString(), null, materialReceived, insProgress, insComplete, rec.finalInspectionStatus, totalFailItems, [rec.refJobL1], isReRequest, styleNo?.attributeValue);
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
    async getInspectionRequestSpollsInfo(req: InsIrIdRequest): Promise<ThreadInsIrRollsResponse> {
        let irRollsModel: ThreadInsIrRollsModel;
        const insReqRec = await this.inspReqRepo.findOne({ select: ['insType'], where: { id: req.irId } });
        const inspectionType = insReqRec.insType;
        switch (inspectionType) {
            case InsTypesEnum.THREADINS: irRollsModel = await this.getInitialIRRollsInfo(req);
                break;
            default: throw new ErrorResponse(0, 'Inspection request is not found');
        }
        console.log('irRollsModel232', irRollsModel);
        return new ThreadInsIrRollsResponse(true, 0, 'Inspection requests info retrieved successfully', irRollsModel);
    }


    async getInitialIRRollsInfo(req: InsIrIdRequest): Promise<ThreadInsIrRollsModel> {
        return await this.getInitialRolls(req);
    }


    async getInitialRolls(req: InsIrIdRequest): Promise<ThreadInsIrRollsModel> {
        const rollIds = [];
        const irRollModels: InsIrRollModel[] = [];
        const rollsInIr = await this.inspReqItemsRepo?.find({ select: ['refIdL1'], where: { companyCode: req.companyCode, unitCode: req.unitCode, insRequestId: req.irId, isActive: true } });
        rollsInIr?.forEach(r => {
            rollIds.push(r.refIdL1)
        });
        const rollsBasicInfoReq = new InsBasicRollInfoRequest(req.username, req.unitCode, req.companyCode, 0, rollIds, false)
        const rollsBasicInfo = (await this.inspectionHelperService.getBasicRollInfoForInspection(rollsBasicInfoReq)).data;
        // const rollsBasicInfo: InsRollBasicInfoResponse[] = [{
        //     "status": true,
        //     "errorCode": 0,
        //     "internalMessage": "Data fetched successfully",
        //     "data": [
        //         {
        //             "rollId": 101,
        //             "barcode": "ABC123456789",
        //             "packListId": 5001,
        //             "originalQty": 100,
        //             "leftOverQuantity": 10,
        //             "phLinesId": 3001,
        //             "batch": "BATCH2025A",
        //             "lot": "LOT5678",
        //             "width": "58 inches",
        //             "inspectionPick": true,
        //             "issuedQuantity": 40,
        //             "inputQuantity": 90,
        //             "sShade": "Light Blue",
        //             "shrinkageGroup": 2,
        //             "itemCode": "FAB123",
        //             "itemDesc": "Cotton Fabric",
        //             "aShade": "Sky Blue",
        //             "sWidth": 58,
        //             "sQuantity": 85,
        //             "inputQtyUom": "Meters",
        //             "inputWidthUom": "Inches",
        //             "grnDate": new Date("2025-03-30T00:00:00Z"),
        //             "measuredWidth": 57.5,
        //             "measuredWeight": 150,
        //             "relaxWidth": "57 inches",
        //             "allocatedQty": 30,
        //             "externalRollNumber": "EXT789012",
        //             "itemCategory": PhItemCategoryEnum.YARN,
        //             "itemColor": "Blue",

        //         },
        //         {
        //             "rollId": 102,
        //             "barcode": "XYZ987654321",
        //             "packListId": 5002,
        //             "originalQty": 120,
        //             "leftOverQuantity": 20,
        //             "phLinesId": 3002,
        //             "batch": "BATCH2025B",
        //             "lot": "LOT9876",
        //             "width": "60 inches",
        //             "inspectionPick": false,
        //             "issuedQuantity": 50,
        //             "inputQuantity": 100,
        //             "sShade": "Dark Grey",
        //             "shrinkageGroup": 3,
        //             "itemCode": "FAB456",
        //             "itemDesc": "Polyester Fabric",
        //             "aShade": "Steel Grey",
        //             "sWidth": 60,
        //             "sQuantity": 100,
        //             "inputQtyUom": "Meters",
        //             "inputWidthUom": "Inches",
        //             "grnDate": new Date("2025-03-30T00:00:00Z"),
        //             "measuredWidth": 59.8,
        //             "measuredWeight": 160,
        //             "relaxWidth": "59 inches",
        //             "allocatedQty": 40,
        //             "externalRollNumber": "EXT654321",
        //             "itemCategory": PhItemCategoryEnum.YARN,
        //             "itemColor": "Grey",

        //         }
        //     ]
        // }] 
        rollsBasicInfo?.forEach(r => {
            const insIrRollsModel = new InsIrRollModel(r?.rollId, r?.barcode, r);
            irRollModels.push(insIrRollsModel);
        });
        return new ThreadInsIrRollsModel(null, irRollModels);
    }

    async getThreadInspectionDetailsForRequestId(inspReqId: number, unitCode: string, companyCode: string, rollId?: number, rollSampleId?: number, isReport?: boolean): Promise<ThreadInspectionHeaderRollInfoResp> {
        const inspectDetails = await this.inspReqRepo.findOne({ where: { id: inspReqId, unitCode, companyCode } });
        if (!inspectDetails) {
            throw new ErrorResponse(1038, 'Inspection details not found for given inspection header Id');
        }
        if (!isReport) {
            if (inspectDetails.insActivityStatus != InsInspectionActivityStatusEnum.INPROGRESS) {
                throw new ErrorResponse(1052, 'Inspection not yet started, Please start the inspection in the board.')
            }
        }

        const inspectedResults = await this.inspReqItemsRepo.getInspectedQtyByInspReqId(inspectDetails.id, unitCode, companyCode);
        const inspectionAttributes = await this.inspAttributesRepo.find({ where: { insRequestId: inspReqId, unitCode, companyCode } });
        const attributeInfo = inspectionAttributes.map((att) => {
            return new InsAttributeNameValueModel(att.attributeName, att.attributeValue);
        });

        console.log('attributes125', attributeInfo);

        const totalNoOfRequestRolls: number = (await this.inspReqItemsRepo.getInspectionQtyByInspReqId(inspReqId, unitCode, companyCode)).no_of_rolls;

        const totalNoOfBatchRolls: number = await this.getRollCountByBatchNoForIns(inspectDetails.refJobL1, unitCode, companyCode);

        const totalNoOfInspectedRolls: number = inspectedResults.no_of_rolls;

        // const inspectionPercentage: number = sysPerf.data.rollsPickPercentage;
        const req = new InsPhIdRequest('', unitCode, companyCode, 0, [inspectDetails.refIdL1], [inspectDetails.insType])
        const inspectionDet: HeaderDetailsResponse = await this.inspectionHelperService.getHeaderDetailsForInspection(req);

        const inspectionQty = (await this.inspReqItemsRepo.getInspectionQtyByInspReqId(inspReqId, unitCode, companyCode)).inspected_qty;

        const inspHeaderInfo = new ThreadInsCommonInspectionHeaderInfo(inspectDetails.id, inspectDetails.insType as unknown as ThreadTypeEnum, inspectDetails.refJobL1, totalNoOfBatchRolls, totalNoOfRequestRolls, totalNoOfInspectedRolls, inspectionDet?.data?.percentage,
            inspectDetails.refJobL2, inspectionQty, inspectedResults.inspected_qty, inspectDetails.insCreationTime, inspectDetails.materialReceiveAt, inspectDetails.insCompletedAt, inspectDetails.inspector, inspectDetails.finalInspectionStatus,
            // inspectDetails.fabricComposition
            '',
            attributeInfo, inspectDetails.createReRequest,);

        let basicInsInfo: ThreadInsBasicInspectionRequest = null;


        const inspectedRolls = rollId ? await this.inspReqItemsRepo.find({ where: { insRequestId: inspectDetails.id, unitCode, companyCode, refIdL1: rollId?.toString() } }) : await this.inspReqItemsRepo.find({ where: { insRequestId: inspectDetails.id, unitCode, companyCode } });
        if (!inspectedRolls.length) {
            throw new ErrorResponse(1039, 'Inspection objects not found for given inspection header Id');
        }
        console.log('inspectedrools', inspectedRolls);
        if (inspectDetails.insType == InsTypesEnum.THREADINS) {
            console.log('inside the iff');
            basicInsInfo = new ThreadInsBasicInspectionRequest();
            basicInsInfo.inspectionHeader = inspHeaderInfo;
            basicInsInfo.inspectionRollDetails = [];
            for (const eachRoll of inspectedRolls) {
                const fourPointInfo = await this.getFourPointDetailsForRoll(eachRoll.id, unitCode, companyCode);
                // get the actual four points width
                const atualRollInfo = await this.getInsRollActualRecords(eachRoll.id, unitCode, companyCode);
                const atualRollInfoReq = new RollNumberRequest('admin', unitCode, companyCode, 0, Number(eachRoll.id));
                console.log(atualRollInfoReq, 'atualRollInfoReq-----------')
                const rollBasicInfo: BasicRollInfoQryResp = await this.inspReqItemsRepo.getInsBasicRollInfoForRollId(Number(eachRoll.refIdL1), unitCode, companyCode);
                console.log('rollBasicInfo1234', rollBasicInfo);
                const inspectionDetails = new ThreadInsBasicInspectionRollDetails(Number(eachRoll.id), rollBasicInfo?.object_ext_no, rollBasicInfo.barcode, rollBasicInfo.qr_code, rollBasicInfo.lot_number, eachRoll.insQuantity, rollBasicInfo.s_width, eachRoll.inspectionResult, eachRoll.finalInspectionStatus, fourPointInfo, eachRoll.remarks, atualRollInfo?.fourPointsWidth, atualRollInfo?.fourPointsLength, rollBasicInfo.s_shade, 0, 0, 0, 0, 0, 0);
                basicInsInfo.inspectionRollDetails.push(inspectionDetails);
            }
        }

        const rollInfo = new ThreadInsRollInspectionInfo(basicInsInfo);
        console.log('rollinfo', rollInfo);
        return new ThreadInspectionHeaderRollInfoResp(true, 1041, 'Inspection header and object info received successfully', rollInfo)
    }

    async getRollCountByBatchNoForIns(batchNo: string, unitCode: string, companyCode: string): Promise<number> {
        return await this.inspReqItemsRepo.getRollCountByBatchNoForIns(batchNo, unitCode, companyCode);
    }


    async getFourPointDetailsForRoll(rollId: number, unitCode: string, companyCode: string): Promise<ThreadInsInspectionConeDetails[]> {
        // const qryResp: YarnDefectCapturingDetailsResp[] = await this.insFpDefectCapturingRepo.getFourPointDetailsForRoll(rollId, unitCode, companyCode);
        // return qryResp.map((eachPoint) => {
        //     const fountPointObj = new YarnInsInspectionConeDetails();
        //     fountPointObj.slubs = eachPoint.slubs;
        //     fountPointObj.neps = eachPoint.neps;
        //     fountPointObj.yarnBreaks = eachPoint.yarnBreaks;
        //     fountPointObj.contamination = eachPoint.contamination;
        //     fountPointObj.remarks = eachPoint.remarks;
        //     fountPointObj.id = eachPoint.id;

        //     return fountPointObj
        // }) 
        return null;
    }

    async getInsRollActualRecords(rollId: number, unitCode: string, companyCode: string): Promise<InsRollsActualInfoEntity> {
        return await this.insRollActualRepo.findOne({ where: { insRequestItemsId: rollId, unitCode: unitCode, companyCode: companyCode } });
    }



    /**
          * SERVICE TO GET INSPECTION DETAILS FOR Cone ID AND INSPECTION CATEGORY
          * @param barcode 
          * @param inspCategory 
          * @param unitCode 
          * @param companyCode 
          * @returns 
          */
    async getInspectionDetailForSpoolIdAndInspCategory(barcode: string, inspCategory: ThreadTypeEnum, unitCode: string, companyCode: string): Promise<ThreadInspectionHeaderRollInfoResp> {
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


        return await this.getThreadInspectionDetailsForRequestId(data[0]?.id, unitCode, companyCode, result?.rollid[0], rollSampleId);
    }

    async getThreadInspectionRequestBasicInfoByLotCode(req: ThreadInsInspectionRequestsFilterRequest): Promise<ThreadInspectionBasicInfoResponse> {
        let insRes: ThreadInspectionBasicInfoModel[] = [];
        switch (req.inspectionType) {
            case ThreadTypeEnum.THREADINS: insRes = await this.getInitialIRBasicInfoFilterByLotCode(req);
                break;
            default: throw new ErrorResponse(0, 'Inspection request is not found');
        }
        return new ThreadInspectionBasicInfoResponse(true, 0, 'Inspection requests info retrieved successfully', insRes);
    }

    async getInitialIRBasicInfoFilterByLotCode(req: ThreadInsInspectionRequestsFilterRequest): Promise<ThreadInspectionBasicInfoModel[]> {
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








}