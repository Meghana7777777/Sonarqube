import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ErrorResponse } from '@xpparel/backend-utils';
import { DataSource, In } from 'typeorm';
import { BomItemTypeEnum, FixedOpCodeEnum, GlobalResponseObject, PTS_C_TranLogIdRequest, SewingJobPlanStatusEnum, SPS_C_JobNumbersForReconciliationRequest } from '@xpparel/shared-models';
import { SJobTranLogRefEntity } from '../entities/s-job-tran-log-ref.entity';
import { GenericTransactionManager } from '../../database/typeorm-transactions';
import { SJobLineOperationsRepo } from '../entities/repository/s-job-line-operations';
import { SJobTranLogRefRepository } from '../entities/repository/s-job-tran-log-ref.repository';
import { SJobLineOperationsEntity } from '../entities/s-job-line-operations';
import { ProcessingJobHelperService } from './processing-job-helper.service';
import { SJobLinePlanRepo } from '../entities/repository/s-job-line-plan.repository';
import { SJobLineRepo } from '../entities/repository/s-job-line.repository';
import { PoWhRequestMaterialItemRepository } from '../entities/repository/po-wh-request-item.repo';
import { PoWhJobMaterialRepository } from '../entities/repository/po-wh-job-material-repo';
import { PoWhJobMaterialEntity } from '../entities/po-wh-job-material-entity';
import { SJobLineOperationsHistoryRepo } from '../entities/repository/s-job-line-operations-history.repo';
import { SJobLineOperationsHistoryEntity } from '../entities/s-job-line-operations-history';
const util = require('util');

@Injectable()
export class ProcessingJobRepService {

    constructor(
        private dataSource: DataSource,
        private sJobOpRepo: SJobLineOperationsRepo,
        private tranLogRefRepo: SJobTranLogRefRepository,
        private jobPlanRepo: SJobLinePlanRepo,
        private sJobLineRepo: SJobLineRepo,
        private sJobMaterialRepo: PoWhJobMaterialRepository,
        private sJobLineOperationsHistoryRepo: SJobLineOperationsHistoryRepo,
        @Inject(forwardRef(() => ProcessingJobHelperService)) private sewJobHelperService: ProcessingJobHelperService
    ) {

    }


    // This will handle only 1 tran log id record per API call
    // Has to be changed, This will only get the direct transaction info instead of the tran log id
    // Called after the bundle / job reporting for any given job under whole SPS
    async updateJobRepQtysByTransId(req: PTS_C_TranLogIdRequest): Promise<GlobalResponseObject> {
        const transManager = new GenericTransactionManager(this.dataSource);
        try {
            const { companyCode, unitCode, username, tranIds } = req;
            if (!tranIds?.length) {
                throw new ErrorResponse(0, 'Trans ids are not provided');
            }
            const uniqueTranIds = new Set(tranIds);
            const handledTranIds = [];
            // get the tran log info from the PTS
            const tranLogInfo = await this.sewJobHelperService.getTranLogInfoForTranIds([...uniqueTranIds], companyCode, unitCode);
            const tranRefEnts: SJobTranLogRefEntity[] = [];
            const jobNumbers = new Set<string>();

            const _jobNumbersSet = new Set<string>();
            tranLogInfo.map(r => _jobNumbersSet.add(r.job));
            const jobLineRecs = await this.sJobLineRepo.find({ select: ['sJobHeaderId', 'jobNumber'], where: { companyCode, unitCode, jobNumber: In([..._jobNumbersSet]) } });
            const jobJhIdMap = new Map<string, number>();
            jobLineRecs.map(r => jobJhIdMap.set(r.jobNumber, r.sJobHeaderId));

            await transManager.startTransaction();
            // now save the ref ids in SPS and update the job ops
            for (const rec of tranLogInfo) {
                // check if the tran log is already handled
                const tranRec = await this.tranLogRefRepo.findOne({ select: ['id'], where: { tranLogRefId: rec.tranId } });
                if (!tranRec) {
                    const jhId = jobJhIdMap.get(rec.job);
                    const m1 = new SJobTranLogRefEntity();
                    m1.companyCode = companyCode;
                    m1.unitCode = unitCode;
                    m1.createdUser = username;
                    m1.tranLogRefId = rec.tranId;
                    tranRefEnts.push(m1);
                    rec.gQty = rec.gQty ?? 0;
                    rec.rQty = rec.rQty ?? 0;
                    jobNumbers.add(rec.job);
                    const jobOpRec = await this.sJobOpRepo.findOne({ where: { companyCode: companyCode, unitCode: unitCode, jobNumber: rec.job, operationCode: rec.opCode, operationGroup: rec.opGroup } });
                    const logEntry = this.sJobLineOperationsHistoryRepo.create({
                        processingSerial: jobOpRec.processingSerial,
                        processType: jobOpRec.processType,
                        jobNumber: jobOpRec.jobNumber,
                        operationGroup: jobOpRec.operationGroup,
                        operationCodes: jobOpRec.operationCodes,
                        operationCode: jobOpRec.operationCode,
                        originalQty: jobOpRec.originalQty,
                        inputQty: jobOpRec.inputQty ?? 0,
                        goodQty: rec.gQty,
                        rejectionQty: rec.rQty,
                        openRejections: jobOpRec.openRejections,
                        operationSequence: jobOpRec.operationSequence,
                        smv: jobOpRec.smv,
                        companyCode: companyCode,
                        unitCode: unitCode
                    });
                    await transManager.getRepository(SJobLineOperationsHistoryEntity).save(logEntry);
                    await transManager.getRepository(SJobLineOperationsEntity).update({ companyCode, unitCode, jobNumber: rec.job, operationCode: rec.opCode, operationGroup: rec.opGroup }, { goodQty: () => `good_qty + ${rec.gQty}`, rejectionQty: () => `rejection_qty + ${rec.rQty}` });

                    if (rec.opCode == FixedOpCodeEnum.OUT && rec.outPutSubSku) {
                        await transManager.getRepository(PoWhJobMaterialEntity).update({ companyCode, unitCode, sJobHeaderId: jhId, itemCode: rec.outPutSubSku, bomItemType: BomItemTypeEnum.SFG, size: rec.size, fgColor: rec.color }, { issuedQty: () => `issued_qty + ${Number(rec.gQty)}` });
                    }
                }
                handledTranIds.push(rec.tranId);
            }
            await transManager.getRepository(SJobTranLogRefEntity).save(tranRefEnts, { reload: false });
            // send back an API back to PTS saying this is has been handled
            await transManager.completeTransaction();
            if (jobNumbers.size > 0) {
                const m1 = new SPS_C_JobNumbersForReconciliationRequest(username, unitCode, companyCode, 0, [...jobNumbers]);
                await this.updateJobReconciliationStatus(m1);
            }
            await this.sewJobHelperService.sendTranIdProcessedAckToPts(handledTranIds, companyCode, unitCode, 'SYSTEM');
            return new GlobalResponseObject(true, 0, 'Job quantities updated');
        } catch (error) {
            await transManager.releaseTransaction();
            throw error;
        }
    }

    async updateJobReconciliationStatus(req: SPS_C_JobNumbersForReconciliationRequest): Promise<GlobalResponseObject> {
        const { companyCode, unitCode, username, jobNumbers } = req;
        if (!jobNumbers.length) {
            throw new ErrorResponse(0, 'Job numbers not provided for reconciliation');
        }
        for (const job of jobNumbers) {
            const jobRec = await this.sJobOpRepo.findOne({ select: ['goodQty', 'inputQty', 'rejectionQty', 'jobNumber'], where: { companyCode, unitCode, operationCode: FixedOpCodeEnum.OUT, jobNumber: job } });
            if (!jobRec) {
                continue;
            }
            const jobPlanRec = await this.jobPlanRepo.findOne({ select: ['status'], where: { companyCode, unitCode, jobNumber: job } });
            if (jobPlanRec) {
                const finalStatus = Number(jobRec.inputQty) == (Number(jobRec.goodQty) + Number(jobRec.rejectionQty)) ? SewingJobPlanStatusEnum.COMPLETED : SewingJobPlanStatusEnum.IN_PROGRESS; // jobPlanRec.status;
                if (finalStatus != jobPlanRec.status) {
                    await this.jobPlanRepo.update({ companyCode, unitCode, jobNumber: job }, { status: finalStatus });
                }
            }
        }
        return new GlobalResponseObject(true, 0, 'Job reconciliation updated');
    }

}
