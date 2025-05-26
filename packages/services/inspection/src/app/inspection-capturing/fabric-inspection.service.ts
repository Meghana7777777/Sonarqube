import { Injectable } from "@nestjs/common";
import { ErrorResponse } from "@xpparel/backend-utils";
import { GlobalResponseObject, InsBasicInspectionRequest, InsFourPointsInspectionRollDetails, InsInspectionActivityStatusEnum, InsInspectionFinalInSpectionStatusEnum, InsLabInspectionRequest, InsLabInspectionRollDetails, InsPhIdRequest, InsRelaxationInspectionRequest, InsRelaxationInspectionRollDetails, InsShadeInspectionRequest, InsShadeInspectionRollDetails, InsShrinkageInspectionRequest, InsShrinkageRollInfo, InsUomEnum, MeasuredRefEnum, RollNumberRequest, ShadeDetails } from "@xpparel/shared-models";
import { BullQueueJobService, InspectionHelperService } from "@xpparel/shared-services";
import { DataSource, In } from "typeorm";
import { GenericTransactionManager } from "../../database/typeorm-transactions";
import { InsFpDefectEntity } from "../entities/ins-fp-defect.entity";
import { InsGsmEntity } from "../entities/ins-gsm.entity";
import { InsRequestItemEntity } from "../entities/ins-request-items.entity";
import { InsRequestEntity } from "../entities/ins-request.entity";
import { InsShadeEntity } from "../entities/ins-shade.entity";
import { InsShrinkageEntity } from "../entities/ins-shrinkage.entity";
import { InsRelaxationEntity } from "../entities/ins_relaxation.entity";
import { InsRollsActualInfoEntity } from "../entities/ins_rolls_actual_info.entity";
import { InsRequestEntityRepo } from "../inspection/repositories/ins-request.repository";

@Injectable()
export class FabricInspectionService {
    constructor(
        private dataSource: DataSource,
        private inspReqRepo: InsRequestEntityRepo,
        private inspectionHelperService: InspectionHelperService,
        private bullQueueJobService:BullQueueJobService,
    ) { }

    /**
   * Service to save found point inspection details for a roll
   * @param rollId 
   * @param inspDetails 
   * @param unitCode 
   * @param companyCode 
   * @param userName 
   * @param manager 
   * @returns 
  */
    async saveFourPointInspectionDetailsForRoll(rollId: number, fourPointsWidth: number, fourPointsLength: number, inspDetails: InsFourPointsInspectionRollDetails[], unitCode: string, companyCode: string, userName: string, manager: GenericTransactionManager, phId: string): Promise<boolean> {
        const pointInspectDetails: InsFpDefectEntity[] = [];
        // const phItemIdRequest = new RollNumberRequest(userName, unitCode, companyCode, 5000, rollId)
        // const phItemId = await this.inspectionHelperService.getPhItemIdByPhItemLineId(phItemIdRequest);
        // delete the old items and recreate new ones
        const existingIsnRecs = await manager.getRepository(InsFpDefectEntity).find({ select: ['id'], where: { phItemLinesId: rollId, unitCode: unitCode, companyCode: companyCode } });
        const oldIds = [];
        existingIsnRecs.forEach(record => {
            oldIds.push(Number(record.id));
        });
        if (oldIds.length > 0) {
            await manager.getRepository(InsFpDefectEntity).delete({ id: In(oldIds) })
        }
        // update the four point shade to the roll actual table
        await manager.getRepository(InsRollsActualInfoEntity).update({ insRequestItemsId: rollId, unitCode: unitCode, companyCode: companyCode },
            { fourPointsWidth: fourPointsWidth, fourPointsWidthUom: InsUomEnum.CM, fourPointsLength: fourPointsLength, fourPointsLengthUom: InsUomEnum.YRD })
        for (const eachInsp of inspDetails) {
            const defectObj = new InsFpDefectEntity();
            defectObj.companyCode = companyCode;
            defectObj.createdUser = userName;
            defectObj.phItemLinesId = rollId;
            defectObj.phItemsId = Number(phId);
            defectObj.pointLength = eachInsp.atMeter;
            defectObj.pointValue = eachInsp.points;
            defectObj.reason = eachInsp.reason;
            defectObj.reasonId = eachInsp.reasonId;
            defectObj.remarks = eachInsp.remarks;
            defectObj.unitCode = unitCode;
            defectObj.pointPosition = eachInsp.pointPosition;
            pointInspectDetails.push(defectObj);
        }
        await manager.getRepository(InsFpDefectEntity).save(pointInspectDetails)
        return true;
    }

    /**
       * Service to capture inspection results for basic inspection (4 pint)
       * @param reqObj 
       * @returns 
      */
    async captureInspectionResultsForBasicInspection(reqObj: InsBasicInspectionRequest): Promise<GlobalResponseObject> {
        const manager = new GenericTransactionManager(this.dataSource);
        try {
            await manager.startTransaction();
            if (!reqObj.inspectionHeader.inspectionReqId) {
                throw new ErrorResponse(6052, 'Please provide inspection Request Id')
            }

            const headerDetail: InsRequestEntity = await this.inspReqRepo.findOne({ where: { id: reqObj.inspectionHeader.inspectionReqId } });
            if (!headerDetail) {
                throw new ErrorResponse(6053, 'Inspection Request details not found for given request Id, Please verify')
            }

            if (headerDetail.finalInspectionStatus != InsInspectionFinalInSpectionStatusEnum.OPEN) {
                throw new ErrorResponse(6054, 'Inspection header already been inspected. Please verify.');
            }

            const unitCode = reqObj.unitCode;
            const companyCode = reqObj.companyCode;
            await manager.getRepository(InsRequestEntity).update({ id: headerDetail.id }, { insStartedAt: reqObj.inspectionHeader.inspectionStart, insCompletedAt: reqObj.inspectionHeader.inspectionCompleteAt, inspector: reqObj.inspectionHeader.inspector, finalInspectionStatus: reqObj.inspectionHeader.inspectionStatus, lab: reqObj.inspectionHeader.lab, expInsCompletedAt: reqObj.inspectionHeader.expInspectionCompleteAt });
            for (const eachRoll of reqObj.inspectionRollDetails) {
                console.log('each roll', eachRoll);
                await manager.getRepository(InsRequestItemEntity).update({ refIdL1: eachRoll.rollId?.toString(), insRequestId: reqObj.inspectionHeader.inspectionReqId, unitCode, companyCode }, {
                    remarks: eachRoll.remarks, inspectionResult: eachRoll.rollInsResult,
                    finalInspectionStatus: eachRoll.rollFinalInsResult,
                });

                await this.saveFourPointInspectionDetailsForRoll(eachRoll.rollId, eachRoll.measuredRollWidth, eachRoll.measuredRollLength, eachRoll.fourPointInspection, unitCode, companyCode, reqObj.userName, manager, headerDetail.refIdL1);
            }
            //if the inspection is passed or failed, then move it to the completed state
            const finalInsStaus = reqObj.inspectionHeader.inspectionStatus;
            const insCatefory=reqObj?.inspectionHeader?.inspRequestCategory || null;
            if (finalInsStaus == InsInspectionFinalInSpectionStatusEnum.PASS || finalInsStaus == InsInspectionFinalInSpectionStatusEnum.FAIL) {
                await manager.getRepository(InsRequestEntity).update({ id: headerDetail.id }, { insActivityStatus: InsInspectionActivityStatusEnum.COMPLETED });
                await manager.getRepository(InsRequestItemEntity).update({ insRequestId: headerDetail.id }, { insActivityStatus: InsInspectionActivityStatusEnum.COMPLETED, insCompletedAt: reqObj.inspectionHeader.expInspectionCompleteAt });
            }
            if (finalInsStaus == InsInspectionFinalInSpectionStatusEnum.PASS) {
                const phidReq = new InsPhIdRequest(reqObj.userName, unitCode, companyCode, 0, [headerDetail.refIdL1],[insCatefory]);
                this.bullQueueJobService.addShownInInventoryQueue(phidReq)
            }
            // logic for re request creation
            // if (reqObj.inspectionHeader.inspectionStatus == InspectionFinalInSpectionStatusEnum.FAIL && reqObj.inspectionHeader.createReRequest) {
            //     await this.createReRequestHeaderForGivenRequestId(reqObj.inspectionHeader.inspectionReqId, unitCode, companyCode, headerDetail.createdUser, manager);
            // }
            await manager.completeTransaction();
            return new GlobalResponseObject(true, 6055, 'Inspection Results Updated Successfully')
        } catch (err) {
            manager ? await manager.releaseTransaction() : null;
            throw err;
        }
    }

    async saveInspectionDetailsForGSM(rollId: number, inspDetails: InsLabInspectionRollDetails, unitCode: string, companyCode: string, userName: string, manager: GenericTransactionManager, insReqId: number): Promise<boolean> {
        const repo = manager.getRepository(InsRollsActualInfoEntity);
        const existingRecord = await repo.findOne({ where: { insRequestItemsId: rollId, unitCode: unitCode, companyCode: companyCode } });
        if (existingRecord) {
            await repo.update({ insRequestItemsId: rollId, unitCode, companyCode }, { aGsm: inspDetails.gsm, toleranceFrom: inspDetails.toleranceFrom, toleranceTo: inspDetails.toleranceTo, adjustment: inspDetails.adjustment, adjustmentValue: inspDetails.adjustmentValue });
        } else {
            const insRollsActualInfoEntity = new InsRollsActualInfoEntity();
            insRollsActualInfoEntity.insRequestItemsId = rollId;
            insRollsActualInfoEntity.unitCode = unitCode;
            insRollsActualInfoEntity.companyCode = companyCode;
            insRollsActualInfoEntity.aGsm = inspDetails.gsm;
            insRollsActualInfoEntity.toleranceFrom = inspDetails.toleranceFrom;
            insRollsActualInfoEntity.toleranceTo = inspDetails.toleranceTo;
            insRollsActualInfoEntity.adjustment = inspDetails.adjustment;
            insRollsActualInfoEntity.adjustmentValue = inspDetails.adjustmentValue || 0;
            insRollsActualInfoEntity.createdUser = userName;
            insRollsActualInfoEntity.createdAt = new Date();
            insRollsActualInfoEntity.updatedUser = userName;
            insRollsActualInfoEntity.updatedAt = new Date();
            insRollsActualInfoEntity.insRequestId = insReqId;
            insRollsActualInfoEntity.insRequestLineId = 0;
            insRollsActualInfoEntity.grnQuantity = 0;
            insRollsActualInfoEntity.noOfJoins = 0;
            insRollsActualInfoEntity.aWidth = 0;
            insRollsActualInfoEntity.fourPointsWidth = 0;
            insRollsActualInfoEntity.aLength = 0;
            insRollsActualInfoEntity.aWidth = 0;
            insRollsActualInfoEntity.aWeight = 0;

            await manager.getRepository(InsRollsActualInfoEntity).save(insRollsActualInfoEntity);
        }
        return true;

    }

    /**
       * Service to capture inspection results for lab inspection 
       * @param reqObj 
       * @returns 
      */
    async captureInspectionResultsForLabInspection(reqObj: InsLabInspectionRequest): Promise<GlobalResponseObject> {
        const manager = new GenericTransactionManager(this.dataSource);
        try {
            await manager.startTransaction();
            if (!reqObj.inspectionHeader.inspectionReqId) {
                throw new ErrorResponse(6052, 'Please provide inspection Request Id')
            }
            const headerDetail: InsRequestEntity = await this.inspReqRepo.findOne({ where: { id: reqObj.inspectionHeader.inspectionReqId } });
            if (!headerDetail) {
                throw new ErrorResponse(6053, 'Inspection Request details not found for given request Id, Please verify')
            }
            if (headerDetail.finalInspectionStatus != InsInspectionFinalInSpectionStatusEnum.OPEN) {
                throw new ErrorResponse(6054, 'Inspection header already been inspected. Please verify.');
            }
            const unitCode = headerDetail.unitCode;
            const companyCode = headerDetail.companyCode;
            await manager.getRepository(InsRequestEntity).update({ id: headerDetail.id }, { insStartedAt: reqObj.inspectionHeader.inspectionStart, insCompletedAt: reqObj.inspectionHeader.inspectionCompleteAt, inspector: reqObj.inspectionHeader.inspector, finalInspectionStatus: reqObj.inspectionHeader.inspectionStatus, lab: reqObj.inspectionHeader.lab, expInsCompletedAt: reqObj.inspectionHeader.expInspectionCompleteAt });
            for (const eachRoll of reqObj.inspectionRollDetails) {
                const res = await manager.getRepository(InsRequestItemEntity).update({ refIdL1: eachRoll.rollId?.toString(), insRequestId: reqObj.inspectionHeader.inspectionReqId, unitCode, companyCode }, {
                    remarks: eachRoll.remarks, inspectionResult: eachRoll.rollInsResult,
                    finalInspectionStatus: eachRoll.rollFinalInsResult,
                });

                // const insRequestItem = await manager.getRepository(InsRequestItemEntity).findOne({
                //     where: { id: eachRoll.rollId },
                //     select: ['refIdL1']
                // });
                // console.log('insRequestItem345',insRequestItem);
                const gsmData = new InsGsmEntity()
                gsmData.companyCode = companyCode;
                gsmData.createdUser = reqObj.userName;
                gsmData.unitCode = unitCode;
                gsmData.aGsm = eachRoll.gsm || 0,
                    gsmData.refId = eachRoll.rollId?.toString(),
                    gsmData.insReqItemId = eachRoll.rollId,
                    gsmData.adjustment = eachRoll.adjustment || '',
                    gsmData.adjustmentValue = eachRoll.adjustmentValue || 0,
                    gsmData.capturedBy = reqObj.userName,
                    gsmData.capturedDate = new Date(),
                    gsmData.toleranceFrom = eachRoll.toleranceFrom || 0,
                    gsmData.toleranceTo = eachRoll.toleranceTo || 0,
                    await manager.getRepository(InsGsmEntity).save(gsmData)
                await this.saveInspectionDetailsForGSM(eachRoll.rollId, eachRoll, unitCode, companyCode, reqObj.userName, manager, headerDetail.id)
            }
            //if the inspection is passed or failed, then move it to the completed state
            const finalInsStaus = reqObj?.inspectionHeader?.inspectionStatus;
            const insCatefory=reqObj?.inspectionHeader?.inspRequestCategory || null;
            console.log('final status124', finalInsStaus);
            if (finalInsStaus == InsInspectionFinalInSpectionStatusEnum.PASS || finalInsStaus == InsInspectionFinalInSpectionStatusEnum.FAIL) {
                await manager.getRepository(InsRequestEntity).update({ id: headerDetail.id }, { insActivityStatus: InsInspectionActivityStatusEnum.COMPLETED });
                await manager.getRepository(InsRequestItemEntity).update({ insRequestId: headerDetail.id }, { insActivityStatus: InsInspectionActivityStatusEnum.COMPLETED, insCompletedAt: reqObj.inspectionHeader.expInspectionCompleteAt });

            }
            if (finalInsStaus == InsInspectionFinalInSpectionStatusEnum.PASS) {
                const phidReq = new InsPhIdRequest(reqObj.userName, unitCode, companyCode, 0, [headerDetail.refIdL1],[insCatefory]);
                this.bullQueueJobService.addShownInInventoryQueue(phidReq)
            }
            // logic for re request creation
            // if (reqObj.inspectionHeader.inspectionStatus == InspectionFinalInSpectionStatusEnum.FAIL && reqObj.inspectionHeader.createReRequest) {
            //     await this.createReRequestHeaderForGivenRequestId(reqObj.inspectionHeader.inspectionReqId, unitCode, companyCode, headerDetail.createdUser, manager);
            // }
            await manager.completeTransaction();
            return new GlobalResponseObject(true, 6055, 'Inspection Results Updated Successfully')
        } catch (err) {
            manager ? await manager.releaseTransaction() : null;
            throw err;
        }
    }

    async saveInspectionDetailsForRelaxation(rollId: number, inspDetails: InsRelaxationInspectionRollDetails, unitCode: string, companyCode: string, userName: string, manager: GenericTransactionManager): Promise<boolean> {
        const phItemIdRequest = new RollNumberRequest(userName, unitCode, companyCode, 5000, rollId)
        const phItemId = await this.inspectionHelperService.getPhItemIdByPhItemLineId(phItemIdRequest);
        const rese = await manager.getRepository(InsRollsActualInfoEntity).update({ insRequestItemsId: rollId, unitCode, companyCode }, { noOfJoins: Number(inspDetails.noOfJoins), aWidth: Number(inspDetails.aWidth), aLength: Number(inspDetails.aLength) });
        console.log('rese', rese);
        const relaxationEnds: InsRelaxationEntity[] = [];
        const relaxationRepository = manager.getRepository(InsRelaxationEntity);

        const widthRefs = [
            { ref: MeasuredRefEnum.START, width: inspDetails.startWidth },
            { ref: MeasuredRefEnum.END, width: inspDetails.endWidth },
            { ref: MeasuredRefEnum.MID, width: inspDetails.midWidth }
        ];

        for (const { ref, width } of widthRefs) {
            const existing = await relaxationRepository.findOne({
                where: {
                    insReqItemId: rollId,
                    measuredRef: ref
                }
            });

            if (existing) {
                existing.width = width;
                await relaxationRepository.save(existing);
            } else {
                const newRelaxation = new InsRelaxationEntity();
                newRelaxation.insReqItemId = rollId;
                newRelaxation.measuredRef = ref;
                newRelaxation.width = width;
                newRelaxation.companyCode = companyCode;
                newRelaxation.unitCode = unitCode;
                newRelaxation.createdUser = userName;
                newRelaxation.measuredAt = 0;
                newRelaxation.order = 0;
                newRelaxation.refId = phItemId.data.phItemId;
                relaxationEnds.push(newRelaxation);
                await relaxationRepository.save(newRelaxation);
            }
        }

        console.log('inspDetails.widthAtPoints', inspDetails.widthAtPoints);
        for (const eachEnd of inspDetails.widthAtPoints) {
            const endPoint = new InsRelaxationEntity();
            endPoint.companyCode = companyCode;
            endPoint.createdUser = userName;
            endPoint.measuredAt = eachEnd.atMeter;
            endPoint.measuredRef = eachEnd.measuredRef;
            endPoint.order = eachEnd.order;
            endPoint.insReqItemId = rollId;
            endPoint.refId = phItemId.data.phItemId;
            endPoint.remarks = eachEnd.remarks;
            relaxationEnds.push(endPoint);
        }
        console.log('relaxation ends', relaxationEnds);
        const res = await manager.getRepository(InsRelaxationEntity).save(relaxationEnds);
        console.log('relaxation ends res', res);
        return true;
    }

    /**
     * Service to capture inspection results for lab relaxation inspection
     * @param reqObj 
     * @returns 
    */
    async captureInspectionResultsForLabRelaxation(reqObj: InsRelaxationInspectionRequest): Promise<GlobalResponseObject> {
        const manager = new GenericTransactionManager(this.dataSource);
        try {
            await manager.startTransaction();
            if (!reqObj.inspectionHeader.inspectionReqId) {
                throw new ErrorResponse(6052, 'Please provide inspection Request Id')
            }
            const headerDetail: InsRequestEntity = await this.inspReqRepo.findOne({ where: { id: reqObj.inspectionHeader.inspectionReqId } });
            if (!headerDetail) {
                throw new ErrorResponse(6053, 'Inspection Request details not found for given request Id, Please verify')
            }
            if (headerDetail.finalInspectionStatus != InsInspectionFinalInSpectionStatusEnum.OPEN) {
                throw new ErrorResponse(6054, 'Inspection header already been inspected. Please verify.');
            }
            const unitCode = headerDetail.unitCode;
            const companyCode = headerDetail.companyCode;
            await manager.getRepository(InsRequestEntity).update({ id: headerDetail.id }, { insStartedAt: reqObj.inspectionHeader.inspectionStart, insCompletedAt: reqObj.inspectionHeader.inspectionCompleteAt, inspector: reqObj.inspectionHeader.inspector, finalInspectionStatus: reqObj.inspectionHeader.inspectionStatus, lab: reqObj.inspectionHeader.lab, expInsCompletedAt: reqObj.inspectionHeader.expInspectionCompleteAt });
            for (const eachRoll of reqObj.inspectionRollDetails) {
                await manager.getRepository(InsRequestItemEntity).update({ refIdL1: eachRoll.rollId?.toString(), insRequestId: reqObj.inspectionHeader.inspectionReqId, unitCode, companyCode }, {
                    remarks: eachRoll.remarks, inspectionResult: eachRoll.rollInsResult,
                    finalInspectionStatus: eachRoll.rollFinalInsResult
                });
                console.log('eachroll2343', eachRoll);
                await this.saveInspectionDetailsForRelaxation(eachRoll.rollId, eachRoll, unitCode, companyCode, reqObj.userName, manager)
            }
            //if the inspection is passed or failed, then move it to the completed state
            const finalInsStaus = reqObj.inspectionHeader.inspectionStatus;
            const insCatefory=reqObj?.inspectionHeader?.inspRequestCategory || null;
            if (finalInsStaus == InsInspectionFinalInSpectionStatusEnum.PASS || finalInsStaus == InsInspectionFinalInSpectionStatusEnum.FAIL) {
                await manager.getRepository(InsRequestEntity).update({ id: headerDetail.id }, { insActivityStatus: InsInspectionActivityStatusEnum.COMPLETED });
                await manager.getRepository(InsRequestItemEntity).update({ insRequestId: headerDetail.id }, { insActivityStatus: InsInspectionActivityStatusEnum.COMPLETED, insCompletedAt: reqObj.inspectionHeader.expInspectionCompleteAt });
            }
            if (finalInsStaus == InsInspectionFinalInSpectionStatusEnum.PASS) {
                const phidReq = new InsPhIdRequest(reqObj.userName, unitCode, companyCode, 0, [headerDetail.refIdL1],[insCatefory]);
                this.bullQueueJobService.addShownInInventoryQueue(phidReq)
            }
            // logic for re request creation
            // if (reqObj.inspectionHeader.inspectionStatus == InspectionFinalInSpectionStatusEnum.FAIL && reqObj.inspectionHeader.createReRequest) {
            //     await this.createReRequestHeaderForGivenRequestId(reqObj.inspectionHeader.inspectionReqId, unitCode, companyCode, headerDetail.createdUser, manager);
            // }
            await manager.completeTransaction();
            return new GlobalResponseObject(true, 6055, 'Inspection Results Updated Successfully')
        } catch (err) {
            manager ? await manager.releaseTransaction() : null;
            throw err;
        }
    }

    async saveInspectionDetailsForShade(rollId: number, inspDetails: InsShadeInspectionRollDetails, unitCode: string, companyCode: string, userName: string, manager: GenericTransactionManager, insReqId: number): Promise<boolean> {
        const repo = manager.getRepository(InsRollsActualInfoEntity);
        const existingRecord = await repo.findOne({ where: { insRequestItemsId: rollId, unitCode: unitCode, companyCode: companyCode } });

        if (existingRecord) {
            repo.update({ insRequestItemsId: rollId, unitCode, companyCode }, { aShade: inspDetails.shade, aShadeGroup: inspDetails.actualWidthGroup });
        }
        else {
            const insRollsActualInfoEntity = new InsRollsActualInfoEntity();
            insRollsActualInfoEntity.insRequestItemsId = rollId;
            insRollsActualInfoEntity.unitCode = unitCode;
            insRollsActualInfoEntity.companyCode = companyCode;
            insRollsActualInfoEntity.aGsm = 0;
            insRollsActualInfoEntity.toleranceFrom = 0;
            insRollsActualInfoEntity.toleranceTo = 0;
            insRollsActualInfoEntity.adjustment = '';
            insRollsActualInfoEntity.adjustmentValue = 0;
            insRollsActualInfoEntity.createdUser = userName;
            insRollsActualInfoEntity.createdAt = new Date();
            insRollsActualInfoEntity.updatedUser = userName;
            insRollsActualInfoEntity.updatedAt = new Date();
            insRollsActualInfoEntity.insRequestId = insReqId;
            insRollsActualInfoEntity.insRequestLineId = 0;
            insRollsActualInfoEntity.grnQuantity = 0;
            insRollsActualInfoEntity.noOfJoins = 0;
            insRollsActualInfoEntity.aWidth = 0;
            insRollsActualInfoEntity.fourPointsWidth = 0;
            insRollsActualInfoEntity.aLength = 0;
            insRollsActualInfoEntity.aWidth = 0;
            insRollsActualInfoEntity.aWeight = 0;
            insRollsActualInfoEntity.adjustmentValue = 0;
            insRollsActualInfoEntity.aShade = inspDetails.shade;
            insRollsActualInfoEntity.aShadeGroup = inspDetails.actualWidthGroup;


            await manager.getRepository(InsRollsActualInfoEntity).save(insRollsActualInfoEntity);
        }







        return true;
    }

    /**
     * Service to capture inspection results for lab shade inspection
     * @param reqObj 
     * @returns 
    */
    async captureInspectionResultsForLabShade(reqObj: InsShadeInspectionRequest): Promise<GlobalResponseObject> {
        const manager = new GenericTransactionManager(this.dataSource);
        try {
            await manager.startTransaction();
            if (!reqObj.inspectionHeader.inspectionReqId) {
                throw new ErrorResponse(6052, 'Please provide inspection Request Id')
            }
            const headerDetail: InsRequestEntity = await this.inspReqRepo.findOne({ where: { id: reqObj.inspectionHeader.inspectionReqId } });
            if (!headerDetail) {
                throw new ErrorResponse(6053, 'Inspection Request details not found for given request Id, Please verify')
            }
            if (headerDetail.finalInspectionStatus != InsInspectionFinalInSpectionStatusEnum.OPEN) {
                throw new ErrorResponse(6054, 'Inspection header already been inspected. Please verify.');
            }
            const unitCode = headerDetail.unitCode;
            const companyCode = headerDetail.companyCode;
            const shadeData:ShadeDetails[]=[];
            const insReqId = await manager.getRepository(InsRequestEntity).update({ id: headerDetail.id }, { insStartedAt: reqObj.inspectionHeader.inspectionStart, insCompletedAt: reqObj.inspectionHeader.inspectionCompleteAt, inspector: reqObj.inspectionHeader.inspector, finalInspectionStatus: reqObj.inspectionHeader.inspectionStatus, lab: reqObj.inspectionHeader.lab, expInsCompletedAt: reqObj.inspectionHeader.expInspectionCompleteAt });
            for (const eachRoll of reqObj.inspectionRollDetails) {
                const reqData = await manager.getRepository(InsRequestItemEntity).update({ refIdL1: eachRoll.rollId?.toString(), insRequestId: reqObj.inspectionHeader.inspectionReqId, unitCode, companyCode }, {
                    remarks: eachRoll.remarks, inspectionResult: eachRoll.rollInsResult,
                    finalInspectionStatus: eachRoll.rollFinalInsResult
                });
                shadeData.push(new ShadeDetails(eachRoll.rollId,eachRoll.barcode,eachRoll.shade,''));
                const shadeEntity = new InsShadeEntity()
                shadeEntity.companyCode = companyCode;
                shadeEntity.createdUser = reqObj.userName;
                shadeEntity.unitCode = unitCode;
                shadeEntity.refId = eachRoll.rollId?.toString(),
                    shadeEntity.aShade = eachRoll.shade,
                    shadeEntity.aShadeGroup = eachRoll.actualWidthGroup,
                    shadeEntity.capturedDate = new Date,
                    shadeEntity.capturedBy = reqObj.userName,
                    shadeEntity.inItemId = eachRoll.rollId
                shadeEntity.remarks = eachRoll.remarks,

                    await manager.getRepository(InsShadeEntity).save(shadeEntity)
                await this.saveInspectionDetailsForShade(eachRoll.rollId, eachRoll, unitCode, companyCode, reqObj.userName, manager, headerDetail.id)
            }
            //if the inspection is passed or failed, then move it to the completed state
            const finalInsStaus = reqObj.inspectionHeader.inspectionStatus;
            const insCatefory=reqObj?.inspectionHeader?.inspRequestCategory || null;
            if (finalInsStaus == InsInspectionFinalInSpectionStatusEnum.PASS || finalInsStaus == InsInspectionFinalInSpectionStatusEnum.FAIL) {
                await manager.getRepository(InsRequestEntity).update({ id: headerDetail.id }, { insActivityStatus: InsInspectionActivityStatusEnum.COMPLETED });
                await manager.getRepository(InsRequestItemEntity).update({ insRequestId: headerDetail.id }, { insActivityStatus: InsInspectionActivityStatusEnum.COMPLETED, insCompletedAt: reqObj.inspectionHeader.expInspectionCompleteAt });

                //calling bull for updating shade details
               this.bullQueueJobService.updateShadeQueue(shadeData)
                
            }

            if (finalInsStaus == InsInspectionFinalInSpectionStatusEnum.PASS) {
                const phidReq = new InsPhIdRequest(reqObj.userName, unitCode, companyCode, 0, [headerDetail.refIdL1],[insCatefory]);
                this.bullQueueJobService.addShownInInventoryQueue(phidReq)
            }
            // logic for re request creation
            // if (reqObj.inspectionHeader.inspectionStatus == InspectionFinalInSpectionStatusEnum.FAIL && reqObj.inspectionHeader.createReRequest) {
            //     await this.createReRequestHeaderForGivenRequestId(reqObj.inspectionHeader.inspectionReqId, unitCode, companyCode, headerDetail.createdUser, manager);
            // }
            await manager.completeTransaction();
            return new GlobalResponseObject(true, 6055, 'Inspection Results Updated Successfully')
        } catch (err) {
            manager ? await manager.releaseTransaction() : null;
            throw err;
        }
    }

    async saveInspectionDetailsForShrinkage(rollId: number, rollSampleId: number, inspDetails: InsShrinkageRollInfo, unitCode: string, companyCode: string, userName: string, manager: GenericTransactionManager): Promise<boolean> {
        const shrinkageDetails: InsShrinkageEntity[] = [];
        // delete all the old records and then insert the new ones 
        const phItemIdRequest = new RollNumberRequest(userName, unitCode, companyCode, 5000, rollId)
        const phItemId = await this.inspectionHelperService.getPhItemIdByPhItemLineId(phItemIdRequest);
        // delete the old items and recreate new ones
        const existingIsnRecs = await manager.getRepository(InsShrinkageEntity).find({ select: ['id'], where: { insReqItemId: rollId, unitCode: unitCode, companyCode: companyCode } });
        const oldIds = [];
        existingIsnRecs.forEach(record => {
            oldIds.push(Number(record.id));
        });
        if (oldIds.length > 0) {
            await manager.getRepository(InsShrinkageEntity).delete({ id: In(oldIds) })
        }

        for (const inspDetail of inspDetails.shrinkageTypes) {
            const shrinkageObj = new InsShrinkageEntity();
            shrinkageObj.aSkLength = inspDetail.measurementLength;
            shrinkageObj.aSkWidth = inspDetail.measurementWidth;
            shrinkageObj.lengthAfterSk = inspDetail.lengthAfterSk;
            shrinkageObj.widthAfterSk = inspDetail.widthAfterSk;
            shrinkageObj.companyCode = companyCode;
            shrinkageObj.createdUser = userName;
            shrinkageObj.insReqItemId = rollId;
            // shrinkageObj.phItemLinesId = rollId;
            shrinkageObj.refId = rollId || 0;
            shrinkageObj.remarks = inspDetail.remarks;
            shrinkageObj.shrinkageType = inspDetail.shrinkageType;
            shrinkageObj.skGroup = inspDetail.skGroup;
            shrinkageObj.unitCode = unitCode;
            shrinkageObj.uom = inspDetail.uom;
            shrinkageDetails.push(shrinkageObj);
        }
        await manager.getRepository(InsShrinkageEntity).save(shrinkageDetails);
        return true;
    }

    /**
    * Service to capture inspection results for lab shrinkagr inspection
    * @param reqObj 
    * @returns 
   */
    async captureInspectionResultsForLabShrinkage(reqObj: InsShrinkageInspectionRequest): Promise<GlobalResponseObject> {
        const manager = new GenericTransactionManager(this.dataSource);
        try {
            await manager.startTransaction();
            if (!reqObj.inspectionHeader.inspectionReqId) {
                throw new ErrorResponse(6052, 'Please provide inspection Request Id')
            }
            const headerDetail: InsRequestEntity = await this.inspReqRepo.findOne({ where: { id: reqObj.inspectionHeader.inspectionReqId } });
            if (!headerDetail) {
                throw new ErrorResponse(6053, 'Inspection Request details not found for given request Id, Please verify')
            }
            if (headerDetail.finalInspectionStatus != InsInspectionFinalInSpectionStatusEnum.OPEN) {
                throw new ErrorResponse(6054, 'Inspection header already been inspected. Please verify.');
            }
            const unitCode = headerDetail.unitCode;
            const companyCode = headerDetail.companyCode;
            await manager.getRepository(InsRequestEntity).update({ id: headerDetail.id }, { insStartedAt: reqObj.inspectionHeader.inspectionStart, insCompletedAt: reqObj.inspectionHeader.inspectionCompleteAt, inspector: reqObj.inspectionHeader.inspector, finalInspectionStatus: reqObj.inspectionHeader.inspectionStatus, lab: reqObj.inspectionHeader.lab, expInsCompletedAt: reqObj.inspectionHeader.expInspectionCompleteAt });
            for (const eachRoll of reqObj.inspectionRollDetails) {
                await manager.getRepository(InsRequestItemEntity).update({ refIdL1: eachRoll?.rollInfo?.rollId?.toString(), insRequestId: reqObj.inspectionHeader.inspectionReqId, unitCode, companyCode }, {
                    inspectionResult: eachRoll.rollInfo.rollInsResult, finalInspectionStatus: eachRoll?.rollInfo.rollFinalInsResult,
                });
                await this.saveInspectionDetailsForShrinkage(eachRoll.rollInfo.rollId, eachRoll.rollInfo.rollSampleId, eachRoll, unitCode, companyCode, reqObj.userName, manager)
            }
            //if the inspection is passed or failed, then move it to the completed state
            const finalInsStaus = reqObj.inspectionHeader.inspectionStatus;
            const insCatefory=reqObj?.inspectionHeader?.inspRequestCategory || null;
            if (finalInsStaus == InsInspectionFinalInSpectionStatusEnum.PASS || finalInsStaus == InsInspectionFinalInSpectionStatusEnum.FAIL) {
                await manager.getRepository(InsRequestEntity).update({ id: headerDetail.id }, { insActivityStatus: InsInspectionActivityStatusEnum.COMPLETED });
                await manager.getRepository(InsRequestItemEntity).update({ insRequestId: headerDetail.id }, { insActivityStatus: InsInspectionActivityStatusEnum.COMPLETED, insCompletedAt: reqObj.inspectionHeader.expInspectionCompleteAt });

            }
            if (finalInsStaus == InsInspectionFinalInSpectionStatusEnum.PASS) {
                const phidReq = new InsPhIdRequest(reqObj.userName, unitCode, companyCode, 0, [headerDetail.refIdL1],[insCatefory]);
                this.bullQueueJobService.addShownInInventoryQueue(phidReq)
            }
            // logic for re request creation
            // if (reqObj.inspectionHeader.inspectionStatus == InspectionFinalInSpectionStatusEnum.FAIL && reqObj.inspectionHeader.createReRequest) {
            //     await this.createReRequestHeaderForGivenRequestId(reqObj.inspectionHeader.inspectionReqId, unitCode, companyCode, headerDetail.createdUser, manager);
            // }
            await manager.completeTransaction();
            return new GlobalResponseObject(true, 6055, 'Inspection Results Updated Successfully')
        } catch (err) {
            manager ? await manager.releaseTransaction() : null;
            throw err;
        }
    }

    /**
       * Service to create re request for the request Id
       * @param insRequestId 
       * @param unitCode 
       * @param companyCode 
       * @param userName 
       * @returns 
      */
    // async createReRequestHeaderForGivenRequestId(insRequestId: number, unitCode: string, companyCode: string, userName: string, manager: GenericTransactionManager): Promise<boolean> {
    //     try {
    //       // check inspection request exists or not
    //       const headerDetail: InsRequestEntity = await manager.getRepository(InsRequestEntity).findOne({ where: { id: insRequestId, unitCode, companyCode } });
    //       if (!headerDetail) {
    //         throw new ErrorResponse(6053, 'Inspection Request details not found for given request Id, Please verify')
    //       }
    //       if (headerDetail.finalInspectionStatus != InspectionFinalInSpectionStatusEnum.FAIL) {
    //         throw new ErrorResponse(1053, '"Reinspection requests can only be created for failed inspection requests.');
    //       }
    //       const sysPerf = await this.grnService.getSystemPreferenceForPackListId(headerDetail.phId, unitCode, companyCode);

    //       if (!sysPerf.status) {
    //         throw new ErrorResponse(1037, 'GRN Details not found for the given pack list. Please verify')
    //       }
    //       const revisionEntity = new InsRequestRevisionEntity();
    //       revisionEntity.companyCode = companyCode;
    //       revisionEntity.createdUser = userName;
    //       revisionEntity.insRequestId = insRequestId;
    //       revisionEntity.percentage = sysPerf.data.rollsPickPercentage;
    //       revisionEntity.rollSelectionType = sysPerf.data.rollSelectionType;
    //       revisionEntity.unitCode = unitCode;
    //       const revId = await manager.getRepository(InsRequestRevisionEntity).save(revisionEntity);
    //       const inspCreateReq = new InspectionCreateRequest(userName, unitCode, companyCode, 0, headerDetail.phId, headerDetail.batchNumber, headerDetail.inspectionLevel, headerDetail.refNumber, [], headerDetail.requestCategory, headerDetail.sla, [], headerDetail.lotQty, headerDetail.batchQty);
    //       await this.createFabricInspectionRequest(inspCreateReq, manager, insRequestId, revId.id)
    //       return true;
    //     } catch (err) {
    //       throw err;
    //     }

    //   }


}
