import { Injectable } from "@nestjs/common";
import { ErrorResponse } from "@xpparel/backend-utils";
import { GlobalResponseObject, InsBatchNosRequest, InsFabInsSelectedBatchModelAttrs, InsFabInsSelectedBatchResponse, InsInspectionActivityStatusEnum, InsInspectionFinalInSpectionStatusEnum, InsInspectionHeaderAttributes, InsInspectionLevelEnum, InsInspectionMaterialEnum, InsInspectionMaterialTypeEnum, InsIrActivityChangeRequest, InsTypesEnum, InsUomEnum, TrimInsCreateExtRefRequest, YarnInsCreateExtRefRequest } from "@xpparel/shared-models";
import { InspectionHelperService } from "@xpparel/shared-services";
import { DataSource, In } from "typeorm";
import { GenericTransactionManager } from "../../database/typeorm-transactions";
import { InsRequestAttributeEntity } from "../entities/ins-request-attributes.entity";
import { InsRequestHistoryEntity } from "../entities/ins-request-history.entity";
import { InsRequestItemEntity } from "../entities/ins-request-items.entity";
import { InsRequestEntity } from "../entities/ins-request.entity";
import { InsRequestLinesEntity } from "../entities/ins_request_lines.entity";
import { InsRollsActualInfoEntity } from "../entities/ins_rolls_actual_info.entity";
import { InsRequestHistoryRepo } from "../inspection/repositories/ins-request-history.repository";
import { InsRequestItemRepo } from "../inspection/repositories/ins-request-items.repository";
import { InsRequestEntityRepo } from "../inspection/repositories/ins-request.repository";


@Injectable()
export class TrimInspectionCreationService {
    constructor(
        private dataSource: DataSource,
        private inspReqRepo: InsRequestEntityRepo,
        private inspReqItemsRepo: InsRequestItemRepo,
        private inspectionHelperService: InspectionHelperService,
        private insRequestHistoryRepo: InsRequestHistoryRepo,
    ) { }




    async createTrimInspectionRequest(req: TrimInsCreateExtRefRequest): Promise<GlobalResponseObject> {
        const manager = new GenericTransactionManager(this.dataSource);
        try {
            console.log("trimInsCreateExtRefRequest345", req);
            // Fetch selected inspection items from WMS
            const insItemsRes: InsFabInsSelectedBatchResponse = await this.inspectionHelperService.getFabricInspectionSelectedItems(req);

            // const insItemsRes: InsFabInsSelectedBatchResponse = await this.inspectionHelperService.getFabricInspectionSelectedItems(req);

            if (!insItemsRes?.data?.length) {
                throw new Error('No inspection items found');
            }
            const unitCode: string = req.unitCode;
            const companyCode: string = req.companyCode;
            const userName: string = req.username;
            const phId: number[] = req.packListIds;
            let insReqId: number = 0;

            await manager.startTransaction();
            // Save Parent Inspection Request
            const lastReqNum = await this.inspReqRepo.getLastRequestNumberForPackList(phId[0], unitCode, companyCode);
            const preFix = ` ${phId[0]}` ? 'RR' : 'R';
            const reqCode = ` ${preFix}-${unitCode} -${phId[0]} -${lastReqNum}`;
            // need to create the inspection header and assign conesss to the inspection header
            for (const batch of insItemsRes.data) {
                const inspHeaderEntityObj = new InsRequestEntity();
                inspHeaderEntityObj.companyCode = companyCode;
                inspHeaderEntityObj.createdUser = userName;
                inspHeaderEntityObj.unitCode = unitCode;
                inspHeaderEntityObj.insCode = reqCode;
                inspHeaderEntityObj.insMaterialType = InsInspectionMaterialTypeEnum.TRIM;
                inspHeaderEntityObj.insMaterial = InsInspectionMaterialEnum.BOX;
                inspHeaderEntityObj.insType = InsTypesEnum.TRIMINS;
                inspHeaderEntityObj.refIdL1 = String(phId);
                inspHeaderEntityObj.refIdL2 = batch.packListId?.toString();
                inspHeaderEntityObj.refIdL3 = '';
                inspHeaderEntityObj.refJobL1 = batch.batchNo;
                inspHeaderEntityObj.refJobL2 = batch.lotInfo[0].lotNo;
                inspHeaderEntityObj.refJobL3 = '';
                inspHeaderEntityObj.finalInspectionStatus = InsInspectionFinalInSpectionStatusEnum.OPEN;
                inspHeaderEntityObj.insCreationTime = new Date();
                // inspHeaderEntityObj.insActivityStatus = req.requestCategory == FabricInspectionRequestCategoryEnum.RELAXATION ? InspectionInsActivityStatusEnum.INPROGRESS : InspectionInsActivityStatusEnum.OPEN;
                inspHeaderEntityObj.insActivityStatus = InsInspectionActivityStatusEnum.OPEN;
                // TODO : get inspection material type AND material
                // If request fails need to insert another request
                inspHeaderEntityObj.parentRequestId = null;
                inspHeaderEntityObj.createReRequest = false;
                inspHeaderEntityObj.inspectionLevel = InsInspectionLevelEnum.LOT;
                // inspHeaderEntityObj.requestCategory = PackFabricInspectionRequestCategoryEnum.NONE

                // TODO: Need to develop a logic for priority
                inspHeaderEntityObj.priority = 0;

                // NEED TO INSERT INSPECTION ATTRIBUTES BASED ON THE INSPECTION CATEGORY
                // GETTING INSPECTION HEADER ATTRIBUTES
                const savedInsRequest = await manager.getRepository(InsRequestEntity).save(inspHeaderEntityObj);
                const existingAttributes = await manager.getRepository(InsRequestAttributeEntity).find({ where: { insRequestId: savedInsRequest.id } });
                if (existingAttributes.length === 0) {
                    await this.saveBatchAttributes(batch.attrs, savedInsRequest.id, manager, companyCode, unitCode, req.username);
                }
                insReqId = savedInsRequest.id;
                for (const lot of batch.lotInfo) {
                    const insRequestLine = new InsRequestLinesEntity();
                    insRequestLine.companyCode = companyCode;
                    insRequestLine.createdUser = userName;
                    insRequestLine.unitCode = unitCode;
                    insRequestLine.insRequestId = savedInsRequest.id;
                    insRequestLine.refIdL1 = lot.packListId?.toString() || '';
                    insRequestLine.refJobL1 = batch.batchNo || '';
                    insRequestLine.inspectionOwner = '';
                    insRequestLine.refJobL3 = '';
                    insRequestLine.insMaterial = InsInspectionMaterialEnum.BOX;
                    insRequestLine.insMaterialType = InsInspectionMaterialTypeEnum.TRIM;
                    insRequestLine.insType = InsTypesEnum.TRIMINS;
                    insRequestLine.refJobL2 = lot.lotNo;
                    insRequestLine.refJobL3 = '';
                    insRequestLine.inspectionAreaI1 = '';
                    insRequestLine.inspectionAreaI2 = '';
                    const savedInsRequestLine = await manager.getRepository(InsRequestLinesEntity).save(insRequestLine)
                    // for (const lot of batch.lotInfo || []) {
                    // Save Lot-Level Data
                    for (const cone of lot.rolls || []) {
                        // Save Inspection Request Items
                        const insRequestItem = new InsRequestItemEntity();
                        insRequestItem.companyCode = companyCode;
                        insRequestItem.createdUser = userName;
                        insRequestItem.unitCode = unitCode;
                        insRequestItem.insRequestId = savedInsRequest.id;
                        insRequestItem.insRequestLineId = savedInsRequestLine.id;
                        insRequestItem.refIdL1 = cone.rollId?.toString() || '';
                        insRequestItem.refNoL1 = cone.rollBarocde || '';
                        insRequestItem.insQuantity = cone.rollQty || 0;
                        insRequestItem.insActivityStatus = InsInspectionActivityStatusEnum.OPEN;
                        insRequestItem.finalInspectionStatus = InsInspectionFinalInSpectionStatusEnum.OPEN;
                        insRequestItem.inspectionOwner = '';
                        insRequestItem.inspectionResult = InsInspectionFinalInSpectionStatusEnum.OPEN;
                        insRequestItem.insFailQuantity = null;
                        insRequestItem.insPassQuantity = null;
                        insRequestItem.inspectionAreaI1 = '';
                        insRequestItem.inspectionAreaI2 = '';
                        insRequestItem.rejectedReasonId = 0;
                        insRequestItem.styleNumber = '';
                        insRequestItem.insCompletedAt = null;
                        insRequestItem.itemCode=lot?.itemCode;
                        const savedInsRequestItem = await this.inspReqItemsRepo.save(insRequestItem);

                        // Save Roll Actual Info
                        const insRollsActualInfo = new InsRollsActualInfoEntity();
                        insRollsActualInfo.companyCode = companyCode;
                        insRollsActualInfo.createdUser = userName;
                        insRollsActualInfo.unitCode = unitCode;
                        insRollsActualInfo.insRequestId = savedInsRequest.id;
                        insRollsActualInfo.insRequestLineId = savedInsRequestLine.id;
                        insRollsActualInfo.insRequestItemsId = savedInsRequestItem.id;
                        insRollsActualInfo.grnQuantity = 0;
                        insRollsActualInfo.noOfJoins = 0;
                        insRollsActualInfo.aWidth = 0;
                        insRollsActualInfo.fourPointsWidth = 0;
                        insRollsActualInfo.fourPointsWidthUom = InsUomEnum.CM;
                        insRollsActualInfo.fourPointsLength = 0;
                        insRollsActualInfo.fourPointsLengthUom = InsUomEnum.YRD;
                        insRollsActualInfo.aLength = 0;
                        insRollsActualInfo.aShade = '';
                        insRollsActualInfo.aShadeGroup = '';
                        insRollsActualInfo.aGsm = 0;
                        insRollsActualInfo.toleranceFrom = 0;
                        insRollsActualInfo.toleranceTo = 0;
                        insRollsActualInfo.aWeight = 0;
                        insRollsActualInfo.remarks = '';
                        insRollsActualInfo.adjustmentValue = 0;
                        insRollsActualInfo.gsm = 0;
                        await manager.getRepository(InsRollsActualInfoEntity).save(insRollsActualInfo);
                        // Save Inspection Request Attributes
                        const coneAttrs = cone.attrs;
                        // const attributesToSave = [
                        // 	{ key: 'sWidth', value: coneAttrs?.sWidth?.toString() || '' },
                        // 	{ key: 'mWidth', value: coneAttrs?.mWidth?.toString() || '' },
                        // 	{ key: 'sLength', value: coneAttrs?.sLength?.toString() || '' }
                        // ];

                        // for (const attr of attributesToSave) {
                        // 	const insRequestAttribute = new InsRequestAttributeEntity();
                        // 	insRequestAttribute.companyCode = companyCode;
                        // 	insRequestAttribute.createdUser = userName;
                        // 	insRequestAttribute.unitCode = unitCode;
                        // 	insRequestAttribute.insRequestId = savedInsRequest.id;
                        // 	insRequestAttribute.attributeName = InsInspectionHeaderAttributes.PO_NO;
                        // 	insRequestAttribute.finalInspectionStatus = InsUomEnum.CM
                        // 	insRequestAttribute.attributeValue = attr.value;
                        // 	await manager.getRepository(InsRequestAttributeEntity).save(insRequestAttribute)
                        // }
                    }
                    // }
                }
            }
            const history = new InsRequestHistoryEntity();
            history.companyCode = req.companyCode;
            history.createdUser = req.username;
            history.unitCode = req.unitCode;
            history.createdAt = new Date();
            history.InsRedId = insReqId;
            history.oldStatus = InsInspectionActivityStatusEnum.OPEN;
            history.newStatus = InsInspectionActivityStatusEnum.OPEN;
            history.inspectionPerson = req.username;
            history.insRequestItemId = 0;
            history.inspectionAreaI1 = '';
            history.inspectionAreaI2 = '';
            // history.FabInsType = InsFabricInspectionRequestCategoryEnum.NONE;
            // history.FgInsType = PackFabricInspectionRequestCategoryEnum.NONE;
            history.insType = InsTypesEnum.TRIMINS;
            await this.insRequestHistoryRepo.save(history);

            await manager.completeTransaction();
            return new GlobalResponseObject(true, 1, 'Inspection Confirmed successfully!')
        } catch (error) {
            await manager.releaseTransaction();
            throw new Error(`Error creating Fabric Inspection Request: ${error.message}`);
        }
    }

    async saveBatchAttributes(batchModelAttrs: InsFabInsSelectedBatchModelAttrs, insRequestId: number, manager: GenericTransactionManager, companyCode: string, unitCode: string, createdUser: string) {
        const attributes: Partial<InsRequestAttributeEntity>[] = [];
        const pushAttributes = (
            name: InsInspectionHeaderAttributes,
            values: string[],
            uom: InsUomEnum
        ) => {
            values.forEach((value) => {
                attributes.push({
                    insRequestId,
                    companyCode: companyCode,
                    createdUser: createdUser,
                    unitCode: unitCode,
                    createdAt: new Date(),
                    attributeName: name,
                    attributeValue: value || '',
                    finalInspectionStatus: uom
                });
            });
        };
        //type of uom
        const DEFAULT_UOM = InsUomEnum.YRD;

        // Map all fields
        pushAttributes(InsInspectionHeaderAttributes.STYLE_NO, batchModelAttrs?.style, DEFAULT_UOM);
        pushAttributes(InsInspectionHeaderAttributes.COLOR, batchModelAttrs?.color, DEFAULT_UOM);
        pushAttributes(InsInspectionHeaderAttributes.SIZE, batchModelAttrs?.size, DEFAULT_UOM);
        pushAttributes(InsInspectionHeaderAttributes.FABRIC_DESCRIPTION, batchModelAttrs?.descriptions, DEFAULT_UOM);
        pushAttributes(InsInspectionHeaderAttributes.SUPPLIER, batchModelAttrs?.supplier, DEFAULT_UOM);
        pushAttributes(InsInspectionHeaderAttributes.DELIVARYDATE, batchModelAttrs?.delDate, DEFAULT_UOM);
        pushAttributes(InsInspectionHeaderAttributes.DESTINATION, batchModelAttrs?.destination, DEFAULT_UOM);
        pushAttributes(InsInspectionHeaderAttributes.PO_NO, [batchModelAttrs?.poNumber], DEFAULT_UOM);
        pushAttributes(InsInspectionHeaderAttributes.INVOICE_NO, [batchModelAttrs?.invoiceNo], DEFAULT_UOM);
        pushAttributes(InsInspectionHeaderAttributes.PACKLIST_CODE, [batchModelAttrs?.packListCode], DEFAULT_UOM);

        // Save using repository
        await manager.getRepository(InsRequestAttributeEntity).save(attributes);
    }


    async deleteTrimInspectionRequest(req: InsBatchNosRequest): Promise<GlobalResponseObject> {
        let insRequestIds: number[] = [];
        const manager = new GenericTransactionManager(this.dataSource);
        await manager.startTransaction();

        try {
            // getting the related inspection request IDs
            const insReqLines = await manager.getRepository(InsRequestLinesEntity).find({
                where: { refJobL1: In(req.batches) },
            });

            // Extract unique `insRequestId`s
            insRequestIds = [...new Set(insReqLines.map(line => line.insRequestId))];

            if (insRequestIds.length === 0) {
                return new GlobalResponseObject(false, 0, "No inspection requests found for deletion.");
            }

            // Delete related records in a transaction
            await manager.getRepository(InsRequestLinesEntity).delete({ insRequestId: In(insRequestIds) });
            await manager.getRepository(InsRequestItemEntity).delete({ insRequestId: In(insRequestIds) });
            await manager.getRepository(InsRequestAttributeEntity).delete({ insRequestId: In(insRequestIds) });
            await manager.getRepository(InsRequestEntity).delete({ id: In(insRequestIds) });

            // Commit transaction
            await manager.completeTransaction();

            return new GlobalResponseObject(true, 1, "Fabric inspection request deleted successfully.");
        } catch (error) {
            await manager.releaseTransaction();
            return new GlobalResponseObject(false, 0, `Failed to delete fabric inspection request: ${error.message}`);
        }
    }



    async updateTrimInspectionActivityStatus(req: InsIrActivityChangeRequest): Promise<GlobalResponseObject> {
        // Fetch current inspection status
        const manager = new GenericTransactionManager(this.dataSource);
        await manager.startTransaction(); // Start transaction
        try {
            const irRecord = await this.inspReqRepo.findOne({ select: ['id', 'insActivityStatus', 'insType'], where: { id: req.irId, companyCode: req.companyCode, unitCode: req.unitCode } });
            if (!irRecord) {
                throw new ErrorResponse(0, 'Inspection request is invalid');
            }
            const { insActivityStatus: currentActivity, insType } = irRecord;
            const incomingActivity = req.insCurrentActivity;
            const date = req.changeDateTime ? new Date(req.changeDateTime) : null;

            // Define valid transitions
            const validTransitions = {
                [InsInspectionActivityStatusEnum.OPEN]: [InsInspectionActivityStatusEnum.MATERIAL_RECEIVED],
                [InsInspectionActivityStatusEnum.MATERIAL_RECEIVED]: [InsInspectionActivityStatusEnum.INPROGRESS],
                [InsInspectionActivityStatusEnum.INPROGRESS]: [InsInspectionActivityStatusEnum.COMPLETED],
            };

            if (!validTransitions[currentActivity]?.includes(incomingActivity)) {
                throw new ErrorResponse(36045, 'The inspection flow is incorrect. OPEN -> MATERIAL RECEIVED -> IN PROGRESS -> COMPLETED');
            }

            // Prepare update object
            const insReqData = new InsRequestEntity();
            insReqData.insActivityStatus = incomingActivity;
            insReqData.remarks = req.remarks;
            insReqData.materialReceiveAt = date;

            if (incomingActivity === InsInspectionActivityStatusEnum.INPROGRESS) {
                insReqData.insStartedAt = new Date();
            }

            // Update status using transaction manager
            const r = await manager.getRepository(InsRequestEntity).update(
                { id: req.irId, companyCode: req.companyCode, unitCode: req.unitCode },
                insReqData
            );



            const res = await manager.getRepository(InsRequestItemEntity).update(
                { insRequestId: req.irId, companyCode: req.companyCode, unitCode: req.unitCode },
                { insActivityStatus: incomingActivity }
            );

            // Save history
            const history = new InsRequestHistoryEntity();
            Object.assign(history, {
                companyCode: req.companyCode,
                createdUser: req.username,
                unitCode: req.unitCode,
                createdAt: new Date(),
                InsRedId: req.irId,
                oldStatus: currentActivity,
                newStatus: incomingActivity,
                inspectionPerson: req.username,
                insRequestItemId: 0,
                inspectionAreaI1: '',
                inspectionAreaI2: '',
                insType: InsTypesEnum.TRIMINS,
                remarks: req.remarks,
            });

            await manager.getRepository(InsRequestHistoryEntity).save(history);
            await manager.completeTransaction();
            return new GlobalResponseObject(true, 0, `Inspection Request #${req.irId} moved from ${currentActivity} to ${incomingActivity}.`);
        } catch (error) {
            await manager.releaseTransaction();
            throw error;
        } finally {
            await manager.releaseTransaction();
        }
    }  





}