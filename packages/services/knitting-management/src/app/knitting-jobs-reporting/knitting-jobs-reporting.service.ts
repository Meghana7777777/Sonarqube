import { Injectable } from '@nestjs/common';
import { GlobalResponseObject, KJ_C_KnitJobReportingRequest, KJ_C_KnitJobNumberRequest, KJ_R_KnitJobReportedQtyModel, KJ_R_KnitJobReportedQtyResponse, KJ_R_LocationKnitJobsSummaryRequest, KJ_R_LocationKnitJobsSummaryResponse, KMS_ELGBUN_C_KnitProcSerialRequest, KMS_R_KnitOrderElgBundleModel, SewingJobPlanStatusEnum, KJ_R_LocationKnitJobsSummaryModel, KJ_MaterialStatusEnum } from '@xpparel/shared-models';
import { GenericTransactionManager } from '../../database/typeorm-transactions';
import { DataSource, In, Raw } from 'typeorm';
import { PoKnitJobQtyEntity } from '../common/entities/po-knit-job-quantity-entity';
import { PoKnitJobQtyRepository } from '../common/repository/po-knit-job-quantity.repo';
import { PoKnitJobPslRepository } from '../common/repository/po-knit-job-psl.repo';
import { PoKnitJobPslEntity } from '../common/entities/po-knit-job-psl-entity';
import { PoKnitJobRepLogEntity } from '../common/entities/po-knit-job-rep-log.entity';
import { PoKnitJobRepLogRepository } from '../common/repository/po-knit-job-rep-log.repo';
import { log, timeStamp } from 'console';
import { PoJobPslMapEntity } from '../common/entities/po-job-psl-map-entity';
import { PoSubLineBundleRepository } from '../common/repository/po-sub-line-bundle.repo';
import { KnitOrderProductBundleStateEnum } from '../common/entities/po-sub-line-bundle.entity';
import { ErrorResponse } from '@xpparel/backend-utils';
import { PoKnitGroupRepository } from '../common/repository/po-knit-group.repo';
import { PoSubLineRepository } from '../common/repository/po-sub-line.repo';
import { PoProductRepository } from '../common/repository/po-product.repo';
import { PoKnitJobPlanRepository } from '../common/repository/po-knit-job-plan.repo';
import { PoKnitJobLineEntity } from '../common/entities/po-knit-job-line-entity';
import { PoKnitJobLineRepository } from '../common/repository/po-knit-job-line.repo';
import { PoKnitJobRepository } from '../common/repository/po-knit-job.repo';
import { PoJobPslMapRepository } from '../common/repository/po-job-psl-map.repo';

@Injectable()
export class KnittingJobsReportingService {

    constructor(
        private dataSource: DataSource, 
        private knitJobPslRepo: PoKnitJobPslRepository,
        private knitJobRepLogRepo: PoKnitJobRepLogRepository,
        private knitOrderMoBundleRepo: PoJobPslMapRepository,
        private knitOrderBundleRepo: PoSubLineBundleRepository,
        private knitGroupsRepo: PoKnitGroupRepository,
        private pslPropsRepo: PoSubLineRepository,
        private knitOrderProductRepo: PoProductRepository,
        private knitJobPlanRepo: PoKnitJobPlanRepository,
        private knitJobRepo: PoKnitJobRepository,
        private knitJobLineRepo: PoKnitJobLineRepository,
        private poKnitJobQtyRepo: PoKnitJobQtyRepository
    ) {

    }

    // report the knit job
    async reportKnitJob(req: KJ_C_KnitJobReportingRequest): Promise<GlobalResponseObject> {
        const transManager = new GenericTransactionManager(this.dataSource);
        try {
            const {companyCode, unitCode, username, knitJobNumber} = req;
            const knitJobPslRecs = await this.knitJobPslRepo.find({select: ['repQuantity', 'moProductSubLineId', 'quantity', 'rejQuantity', 'processingSerial', 'processType'], where: { companyCode: companyCode, unitCode: unitCode, jobNumber: knitJobNumber }});
            if(knitJobPslRecs.length == 0) {
                throw new ErrorResponse(0, `Knit job PSL mapping not found for the job number : ${knitJobNumber}`);
            }
            const procSerial = knitJobPslRecs[0].processingSerial;
            const procType = knitJobPslRecs[0].processType;
            // add validations
            const knitJobPlanRec = await this.knitJobPlanRepo.findOne({select: ['locationCode', 'rawMaterialStatus', 'status'], where: {companyCode, unitCode, jobNumber: knitJobNumber, isActive: true}});
            if(!knitJobPlanRec) {
                throw new ErrorResponse(0, `Knit job record is not identified in the planning table`);
            }
            if(knitJobPlanRec.status == SewingJobPlanStatusEnum.OPEN) {
                throw new ErrorResponse(0, `Knit job is not yet planned`);
            }
            if(knitJobPlanRec.rawMaterialStatus != KJ_MaterialStatusEnum.COMPLETELY_ISSUED) {
                throw new ErrorResponse(0, `Knit job material is not yet issued. Current state : ${knitJobPlanRec.rawMaterialStatus}`);
            }
            let randomPslId = 0;
            const elgQtysMap = new Map<number, {elgQty: number, orgQty: number, currGood: number, currRej: number}>();
            knitJobPslRecs.forEach(r => {
                const pending = r.quantity - (r.rejQuantity + r.repQuantity);
                if(pending > 0) {
                    elgQtysMap.set(r.moProductSubLineId, {elgQty: pending, orgQty: r.quantity, currGood: 0, currRej: 0});
                }
                randomPslId = r.moProductSubLineId;
            });
            // For now a knit job will only have 1 color and 1 size but can have many PSL ids
            const size = req.sizeQtys.size;
            const reportingWt = req.sizeQtys.weight;
            let finalReportingQty = req.sizeQtys.goodQty;
            let finalRejectingQty = req.sizeQtys.rejQty;
            let reportingQty = req.sizeQtys.goodQty;
            let rejectingQty = req.sizeQtys.rejQty;
            // for good reporting
            if(reportingQty > 0){
                elgQtysMap.forEach((qtys, pslId) => {
                    let pending = qtys.elgQty;
                    // if the pending qty is avl then do the following
                    if(pending > 0 && reportingQty > 0) {
                        const _rpQty = Math.min(pending, reportingQty);
                        elgQtysMap.get(pslId).currGood = _rpQty;
                        pending -= _rpQty;
                        reportingQty -= _rpQty;
                        // reduce the elg qty from the ref map so when referred in the rejections it will give correct avl qty
                        elgQtysMap.get(pslId).elgQty -= _rpQty;
                    }
                });
            }
            // for rejection reporting
            if(rejectingQty > 0) {
                elgQtysMap.forEach((qtys, pslId) => {
                    let pending = qtys.elgQty;
                    // if the pending qty is avl then do the following
                    if(pending > 0 && rejectingQty > 0) {
                        const _rpQty = Math.min(pending, rejectingQty);
                        elgQtysMap.get(pslId).currRej = _rpQty;
                        pending -= _rpQty;
                        rejectingQty -= _rpQty;
                        elgQtysMap.get(pslId).elgQty -= _rpQty;
                    }
                });
            }
            if(reportingQty > 0) {
                throw new ErrorResponse(0, `Given reporting qty is : ${finalReportingQty}. But still ${finalReportingQty-reportingQty} is still pending after filling`);
            }
            if(rejectingQty > 0) {
                throw new ErrorResponse(0, `Given rejecting qty is : ${finalRejectingQty}. But still ${finalReportingQty-reportingQty} is still pending after filling`);
            }

            // get the props of the psl
            const pslInfo = await this.pslPropsRepo.findOne({select: ['fgColor', 'size'], where: { companyCode: companyCode, unitCode: unitCode, moProductSubLineId: randomPslId }});

            const tranLogEnts: PoKnitJobRepLogEntity[] = [];
            await transManager.startTransaction();
            // now finally iterate the map and save the good and rej qtys
            elgQtysMap.forEach(async (qtys, pslId) => {
                await transManager.getRepository(PoKnitJobPslEntity).update({companyCode: companyCode, unitCode: unitCode, jobNumber: knitJobNumber, moProductSubLineId: pslId}, { repQuantity: ()=>`rep_quantity + ${qtys.currGood}`, rejQuantity: ()=>`rej_quantity + ${qtys.currRej}`});
            });
            const kniJobLogEnt = new PoKnitJobRepLogEntity();
            kniJobLogEnt.unitCode = unitCode;
            kniJobLogEnt.companyCode = companyCode;
            kniJobLogEnt.jobNumber = req.knitJobNumber;
            kniJobLogEnt.goodQty = finalReportingQty ?? 0;
            kniJobLogEnt.rejectedQty = finalRejectingQty ?? 0;
            kniJobLogEnt.reportedWeight = reportingWt;
            kniJobLogEnt.fgColor = pslInfo.fgColor;
            kniJobLogEnt.size = pslInfo.size;
            kniJobLogEnt.date = req.datetime;
            kniJobLogEnt.processingSerial = procSerial;
            kniJobLogEnt.processType = procType;
            kniJobLogEnt.createdUser = username;
    
            tranLogEnts.push(kniJobLogEnt);
            // insert the tran log record
            await transManager.getRepository(PoKnitJobRepLogEntity).save(tranLogEnts, { reload: false });

            // update the job level table
            await transManager.getRepository(PoKnitJobQtyEntity).update({companyCode: companyCode, unitCode: unitCode, jobNumber: knitJobNumber}, {goodQty: ()=>`good_qty + ${finalReportingQty}`, rejectedQty: ()=>`rejected_qty + ${finalRejectingQty}`, reportedWeight: ()=>`reported_weight + ${reportingWt}`});

            // check if the job is completely reported.
            const knitJobRec = await transManager.getRepository(PoKnitJobQtyEntity).findOne({select: ['jobNumber', 'goodQty', 'inputQty', 'rejectedQty'], where: {companyCode, unitCode, jobNumber: knitJobNumber}});
            const reconciled = Number(knitJobRec.inputQty) == Number(knitJobRec.goodQty) + Number(knitJobRec.rejectedQty)
            const status = reconciled ? SewingJobPlanStatusEnum.COMPLETED : SewingJobPlanStatusEnum.IN_PROGRESS;
            // update the plan record to completed
            await this.knitJobPlanRepo.update({companyCode, unitCode, jobNumber: knitJobNumber}, {status: status});
            await transManager.completeTransaction();
            return new GlobalResponseObject(true, 0, 'Knit job reported successfully');
        } catch (error) {
            await transManager.releaseTransaction();
            throw error;
        }
    }

    // to get the reported qtys for the knit job
    async getKnitJobRepQtysForKitJobNumber(req: KJ_C_KnitJobNumberRequest): Promise<KJ_R_KnitJobReportedQtyResponse> {
        const {companyCode, unitCode, username, jobNumbers } = req; 
        if(!jobNumbers?.length) {
            throw new ErrorResponse(0, `Job numbers are not provided in the request`);
        }
        const jobRepModels: KJ_R_KnitJobReportedQtyModel[] = [];
        for(const job of jobNumbers) {
            // get the rep qty info from the history table
            const logs = await this.knitJobRepLogRepo.find({ where: { companyCode: companyCode, unitCode: unitCode, jobNumber: job}});
            logs.forEach(l => {
                const obj = new KJ_R_KnitJobReportedQtyModel(null, null, l.goodQty, l.rejectedQty, l.reportedWeight, l.date, l.createdUser);
                jobRepModels.push(obj);
            });
        }
        return new KJ_R_KnitJobReportedQtyResponse(true, 0, 'Knit job rep info retrieved', jobRepModels);
    }


    // Called from UI
    // Used by the knit planning dashboard / reporting dashboard
    async getKnitJobReportedSummaryForJobNumbersUnderALocationId(req: KJ_R_LocationKnitJobsSummaryRequest): Promise<KJ_R_LocationKnitJobsSummaryResponse> {
        const {companyCode, unitCode, username, locationCode, iNeedReportingInfo, iNeedRmStatuses} = req;
        // get all the jobs from the planning table for the location code
        const knitJobsForLocation = await this.knitJobPlanRepo.find({select: ['jobNumber', 'jobPriority', 'bomSkuStatus', 'rawMaterialStatus'], where: { companyCode: companyCode, unitCode: unitCode, locationCode: locationCode, status: SewingJobPlanStatusEnum.IN_PROGRESS }});
        if(knitJobsForLocation.length == 0) {
            throw new ErrorResponse(0, `No in progress jobs found for the location code : ${locationCode}`);
        }
        const kjModels: KJ_R_LocationKnitJobsSummaryModel[] = [];
        // check with the RM statuses for a knit job and assign the RM status
        for(const job of knitJobsForLocation) {
            const jobPslInfo = await this.knitJobPslRepo.find({select: ['moProductSubLineId'], where: { companyCode: companyCode, unitCode: unitCode, jobNumber: job.jobNumber }});
            const pslIds = jobPslInfo.map(r => r.moProductSubLineId);
            const pslIdProps = await this.pslPropsRepo.find({select: ['fgColor', 'size'], where: { companyCode: companyCode, unitCode: unitCode, moProductSubLineId: In(pslIds)}});
            const fgColSizeComps = new Set<string>();
            pslIdProps.forEach(r => fgColSizeComps.add(r.fgColor+'@'+r.size) );
            // now get the components for the knit job
            const components = ''; // will do this later 
            const jobInfo = await this.knitJobRepo.findOne({ select: ['quantity', 'knitJobNumber', 'groupCode', 'processingSerial'], where: {companyCode: companyCode, unitCode: unitCode, knitJobNumber: job.jobNumber }});
            let rmStatus = null;
            if(iNeedRmStatuses) {
                // TODO: If much info is needed when this flag is selected
            }
            const m1 = new KJ_R_LocationKnitJobsSummaryModel(job.jobNumber, jobInfo.quantity, jobInfo.groupCode, components, job.jobPriority, [], jobInfo.processingSerial, job.rawMaterialStatus);

            // if the op reporting is selected
            if(iNeedReportingInfo) {
                const opRepInfo = await this.knitJobRepLogRepo.find({where: { companyCode: companyCode, unitCode: unitCode, jobNumber: job.jobNumber }});
                if(opRepInfo.length == 0) {
                    // There will be only a combination for a knit job
                    fgColSizeComps.forEach(comb => {
                        const colSize = comb.split('@');
                        const m2 = new KJ_R_KnitJobReportedQtyModel(colSize[1], colSize[0], 0, 0, 0, null, null);
                        m1.reportedQtys.push(m2);
                    })
                } else {
                    opRepInfo.forEach(r => {
                        const m2 = new KJ_R_KnitJobReportedQtyModel(r.size, r.fgColor, r.goodQty, r.rejectedQty, r.reportedWeight, r.createdAt.toString(), r.createdUser);
                        m1.reportedQtys.push(m2);
                    })
                }
            }
            kjModels.push(m1);
        }
        return new KJ_R_LocationKnitJobsSummaryResponse(true, 0, 'Knit jobs info retrieved', kjModels);
    }
}
