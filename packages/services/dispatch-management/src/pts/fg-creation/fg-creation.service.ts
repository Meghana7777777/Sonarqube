import { Body, Controller, Injectable, Post } from '@nestjs/common';
import { ErrorResponse, returnException } from '@xpparel/backend-utils';
import { BundleFgModel, GlobalResponseObject, JobNumberRequest, ProcessTypeEnum, OpFormEnum, OslRefIdRequest, SewSerialRequest } from '@xpparel/shared-models';
import { DataSource, In } from 'typeorm';
import { GenericTransactionManager } from '../../database/typeorm-transactions';
import { FgCreationHelperService } from './fg-creation-helper.service';
import { FgRepository } from '../repository/fg.repository';
import { FgOpRepository } from '../repository/fg-op.repository';
import { FgEntity } from '../entity/fg.entity';
import { OpSequenceRepository } from '../repository/op-sequence.repository';
import { FgOpEntity } from '../entity/fg-operation.entity';
import { BundleFgEntity } from '../entity/bundle-fg.entity';
import { FgOpDepEntity } from '../entity/fg-op-dep.entity';
import { OpSequenceEntity } from '../entity/op-sequence.entity';
import { JobOpEntity } from '../entity/job-op.entity';
import { JobDepEntity } from '../entity/job-dep.entity';
import { JobOpRepository } from '../repository/job-op.repository';
import { JobDepRepository } from '../repository/job-dep.repository';
import { BundleFgRepository } from '../repository/bundle-fg.repository';
import { FgOpDepRepository } from '../repository/fg-op-dep.repository';



@Injectable()
export class FgCreationService {
    constructor(
        private dataSource: DataSource,
        private helperService: FgCreationHelperService,
        private fgRepo: FgRepository,
        private fgOpRepo: FgOpRepository,
        private opSeqRepo: OpSequenceRepository,
        private jobOpRepo: JobOpRepository,
        private jobDepRepo: JobDepRepository,
        private bundleFgRepo: BundleFgRepository,
        private fgOpDepRepo: FgOpDepRepository,
    ) {

    }

    async createFgsForOslRefId(@Body() req: OslRefIdRequest): Promise<GlobalResponseObject> {
        const transManager = new GenericTransactionManager(this.dataSource);
        try {
            await transManager.startTransaction();
            // check if the osl id is alreay populated
            for (const oslId of req.oslRefId) {
                const recs = await this.fgRepo.findOne({ where: { companyCode: req.companyCode, unitCode: req.unitCode, oslId: oslId } });
                if (recs) {
                    return new GlobalResponseObject(true, 0, `Fgs already created for the osl id : ${oslId}`);
                }
                // get the FGs from the SPS
                const fgsForOslRefId = await this.helperService.getFgsForOslRefIdFromSps(oslId, req.companyCode, req.unitCode);
                const fgNums = fgsForOslRefId.fgNums;
                const fgOps = await this.opSeqRepo.find({ select: ['opCode'] })

                const fgEnts: FgEntity[] = [];
                fgNums.forEach(r => {
                    const fgEnt = new FgEntity();
                    fgEnt.companyCode = req.companyCode;
                    fgEnt.unitCode = req.unitCode;
                    fgEnt.createdUser = req.username;
                    fgEnt.oslId = oslId;
                    fgEnt.fgNumber = r;
                    fgEnt.sewSerial = fgsForOslRefId.sewSerial;
                    fgEnts.push(fgEnt);
                });

                const fgOpEnts: FgOpEntity[] = [];
                // construct the fg op entities
                fgOps.forEach(o => {
                    fgNums.forEach(r => {
                        const fgOpEnt = new FgOpEntity();
                        fgOpEnt.companyCode = req.companyCode;
                        fgOpEnt.unitCode = req.unitCode;
                        fgOpEnt.createdUser = req.username;
                        fgOpEnt.oslId = oslId;
                        fgOpEnt.fgNumber = r;
                        fgOpEnt.sewSerial = fgsForOslRefId.sewSerial;
                        fgOpEnt.opCode = o.opCode;
                        fgOpEnts.push(fgOpEnt);
                    });
                });
                // create the FGs here in PTS
                await transManager.getRepository(FgEntity).save(fgEnts, { reload: false });
                await transManager.getRepository(FgOpEntity).save(fgOpEnts, { reload: false });
            }
            await transManager.completeTransaction();

            // update the status back to SPS
            return new GlobalResponseObject(true, 0, `FGs populates for the osl id : ${req.oslRefId}`);
        } catch (error) {
            await transManager.releaseTransaction();
            throw error;
        }
    }

    async createFgCompsForJob(@Body() req: JobNumberRequest): Promise<GlobalResponseObject> {
        const transManager = new GenericTransactionManager(this.dataSource);
        try {
            const { companyCode, unitCode, username } = req;
            const jobInfo = await this.helperService.getJobDetailsForJobNumber(req.jobNumber, req.sewSerial, req.companyCode, req.unitCode);

            // save the records into the bundle fg and the job operations
            const bundleFgs: BundleFgEntity[] = [];
            const bundles = jobInfo.bundlesInfo;
            bundles?.forEach(b => {
                b?.oslIdFgsModel?.forEach(o => {
                    o.fgNums.forEach(f => {
                        const bEnt = new BundleFgEntity();
                        bEnt.bundleBarcode = b.bundleBarcode;
                        bEnt.companyCode = req.companyCode;
                        bEnt.unitCode = req.unitCode;
                        bEnt.fgNumber = f;
                        bEnt.oslId = o.oslRefId;
                        bEnt.jobNumber = jobInfo.jobNumber;
                        bEnt.sewSerial = jobInfo.sewSerial;
                        bEnt.jobGroup = jobInfo.jobGroup.toString();
                        bundleFgs.push(bEnt);
                    });
                });
            });

            const jobOps = await this.opSeqRepo.find({ where: { sewSerial: jobInfo.sewSerial, companyCode: req.companyCode, unitCode: req.unitCode, jobGroup: jobInfo.jobGroup } });
            if (jobOps.length == 0) {
                throw new ErrorResponse(0, 'Operations not found');
            }
            const opInfoMap = new Map<string, OpSequenceEntity>();
            const allOps = await this.opSeqRepo.find({ where: { sewSerial: jobInfo.sewSerial, companyCode: req.companyCode, unitCode: req.unitCode } });
            allOps.forEach(o => {
                opInfoMap.set(o.opCode, o);
            });

            const fgComps: FgOpDepEntity[] = [];
            // now save the fg_comps
            bundles?.forEach(b => {
                b?.oslIdFgsModel?.forEach(o => {
                    o.fgNums.forEach(f => {
                        let index = 0;
                        jobOps.forEach(r => {
                            const preOps = opInfoMap?.get(r.opCode)?.preOps.split(',');
                            // do this activity only for the previous operation
                            if (index == 0) {
                                preOps.forEach(pOp => {
                                    const preOpInfo = opInfoMap.get(pOp);
                                    const fgDepOp = new FgOpDepEntity();
                                    fgDepOp.companyCode = companyCode;
                                    fgDepOp.unitCode = unitCode;
                                    fgDepOp.createdUser = username;
                                    fgDepOp.fgNumber = f;
                                    fgDepOp.currJob = jobInfo.jobNumber;
                                    fgDepOp.depJobGroup = preOpInfo.jobGroup;
                                    fgDepOp.depJobType = preOpInfo.opCategory;
                                    fgDepOp.extFgNumber = 0;
                                    fgDepOp.issued = false;
                                    fgDepOp.opCode = r.opCode;
                                    fgDepOp.oslId = o.oslRefId;
                                    fgDepOp.sewSerial = jobInfo.sewSerial;
                                    fgDepOp.depOpCode = pOp;

                                    fgComps.push(fgDepOp);
                                });
                            } else {
                                const currOpInfo = opInfoMap.get(r.opCode);
                                const fgDepOp = new FgOpDepEntity();
                                fgDepOp.companyCode = companyCode;
                                fgDepOp.unitCode = unitCode;
                                fgDepOp.createdUser = username;
                                fgDepOp.fgNumber = f;
                                fgDepOp.currJob = jobInfo.jobNumber;
                                fgDepOp.depJobGroup = currOpInfo.jobGroup;
                                fgDepOp.depJobType = currOpInfo.opCategory;
                                fgDepOp.extFgNumber = f; // for the 2nd and next operations under a job group, the ext fg number will be the same as the fg number. since it is dependent on the same FG
                                fgDepOp.issued = false;
                                fgDepOp.opCode = r.opCode;
                                fgDepOp.oslId = o.oslRefId;
                                fgDepOp.sewSerial = jobInfo.sewSerial;
                                fgDepOp.depOpCode = r.preOps;

                                fgComps.push(fgDepOp);
                            }
                            index++;
                        });
                    });
                });
            });

            const jobOpEnts: JobOpEntity[] = [];
            // constrcut the job operations
            jobOps.forEach(o => {
                const jobOpEnt = new JobOpEntity();
                jobOpEnt.companyCode = companyCode;
                jobOpEnt.unitCode = unitCode;
                jobOpEnt.preOps = o.opCategory;
                jobOpEnt.opCode = o.opCode;
                jobOpEnt.sewSerial = jobInfo.sewSerial;
                jobOpEnt.jobGroup = jobInfo.jobGroup;
                jobOpEnt.jobNumber = jobInfo.jobNumber;
                jobOpEnt.orgQty = jobInfo.jobQty;
                jobOpEnt.rQty = 0;
                jobOpEnt.createdUser = username;
                jobOpEnt.opOrder = o.opOrder;
                jobOpEnt.opCategory = o.opCategory;
                jobOpEnts.push(jobOpEnt);
            });

            // construct the job dep objects
            const firstSewOpInfo = jobOps[0];
            const firstSewOpPreOps = opInfoMap?.get(firstSewOpInfo.opCode)?.preOps.split(',');
            const currJgComps = new Set<string>(firstSewOpInfo.components.split(','));
            firstSewOpPreOps.forEach(p => {
                const preOpInfo = opInfoMap.get(p);
                const preOpIsCut = preOpInfo.opCategory == ProcessTypeEnum.CUT ? OpFormEnum.PF : OpFormEnum.SGF;
                // filter out the components that were not coming from cut first
                if (!preOpIsCut) {
                    const comps = preOpInfo.components.split(',');
                    comps.forEach(c => currJgComps.delete(c));
                }
            });
            const compsThatMustComeFromCut = currJgComps;

            const jgLastOpInfo = await this.getJgLevelLastOps(jobInfo.sewSerial, companyCode, unitCode);
            const jobDepEnts: JobDepEntity[] = [];
            firstSewOpPreOps.forEach(p => {
                let components = ['NA'];
                const preOpInfo = opInfoMap.get(p);
                const preOpIsCut = preOpInfo.opCategory == ProcessTypeEnum.CUT ? OpFormEnum.PF : OpFormEnum.SGF;
                if (preOpIsCut) {
                    // remove the 
                    const compsFromCut = preOpInfo.components.split(',');
                    const pendingCompsInCutNotPartOfSg = compsFromCut.filter(c => compsThatMustComeFromCut.has(c));
                    components = pendingCompsInCutNotPartOfSg;
                }
                components.forEach(c => {
                    const jobDepEnt = new JobDepEntity();
                    jobDepEnt.opCategory = firstSewOpInfo.opCategory;
                    jobDepEnt.opCode = firstSewOpInfo.opCode;
                    jobDepEnt.preJobGroup = preOpInfo.jobGroup;
                    jobDepEnt.jobNumber = jobInfo.jobNumber;
                    jobDepEnt.jobGroup = firstSewOpInfo.jobGroup;
                    jobDepEnt.preJgLastOp = jgLastOpInfo?.get(preOpInfo?.jobGroup)?.opCode;
                    jobDepEnt.sewSerial = jobInfo.sewSerial;
                    jobDepEnt.depJobGroupType = preOpInfo.opCategory == ProcessTypeEnum.CUT ? OpFormEnum.PF : OpFormEnum.SGF;
                    jobDepEnt.componentName = c;
                    jobDepEnt.orgQty = jobInfo.jobQty;
                    jobDepEnt.companyCode = companyCode;
                    jobDepEnt.unitCode = unitCode;
                    jobDepEnt.createdUser = username;
                    jobDepEnts.push(jobDepEnt);
                });
            });

            await transManager.startTransaction();
            // create the FGs here in PTS
            await transManager.getRepository(BundleFgEntity).save(bundleFgs, { reload: false });
            await transManager.getRepository(FgOpDepEntity).save(fgComps, { reload: false });
            await transManager.getRepository(JobOpEntity).save(jobOpEnts, { reload: false });
            await transManager.getRepository(JobDepEntity).save(jobDepEnts, { reload: false });
            await transManager.completeTransaction();

            return new GlobalResponseObject(true, 0, 'Created the FG comps for the job and bundles');
        } catch (error) {
            await transManager.releaseTransaction();
            throw error;
        }
    }

    async getJgLevelLastOps(sewSerial: number, companyCode: string, unitCode: string): Promise<Map<number, OpSequenceEntity>> {
        const jgLastOpMap = new Map<number, OpSequenceEntity>();
        const allOps = await this.opSeqRepo.find({ where: { sewSerial: sewSerial, companyCode: companyCode, unitCode: unitCode }, order: { opOrder: 'ASC' } });
        allOps.forEach(o => {
            // since we are looping, the last operation info swill be obviously set to the job group
            jgLastOpMap.set(o.jobGroup, o);
        });
        return jgLastOpMap;
    }


    // when the sew serial is deleted in the SPS
    async deleteFgsForOslRefId(req: OslRefIdRequest): Promise<GlobalResponseObject> {
        try {
            const recs = await this.fgRepo.findOne({ where: { companyCode: req.companyCode, unitCode: req.unitCode, oslId: In(req.oslRefId) } });
            if (!recs) {
                return new GlobalResponseObject(true, 0, `Fgs not found for the osl id : ${req.oslRefId}`);
            }
            await this.fgRepo.delete({ oslId: In(req.oslRefId), companyCode: req.companyCode, unitCode: req.unitCode });
            await this.fgOpRepo.delete({ oslId: In(req.oslRefId), companyCode: req.companyCode, unitCode: req.unitCode });
            return new GlobalResponseObject(true, 0, `FGs and FG OPs deleted for the osl ref id : ${req.oslRefId}`);
        } catch (error) {
            throw error;
        }
    }

    // when the sew serial is deleted in the SPS
    async deleteFgsForSewSerial(req: SewSerialRequest): Promise<GlobalResponseObject> {
        try {
            const recs = await this.fgRepo.findOne({ where: { companyCode: req.companyCode, unitCode: req.unitCode, sewSerial: req.poSerial } });
            if (!recs) {
                return new GlobalResponseObject(true, 0, `Fgs not found for the p serial id : ${req.poSerial}`);
            }
            await this.fgRepo.delete({ sewSerial: req.poSerial, companyCode: req.companyCode, unitCode: req.unitCode });
            await this.fgOpRepo.delete({ sewSerial: req.poSerial, companyCode: req.companyCode, unitCode: req.unitCode });
            return new GlobalResponseObject(true, 0, `FGs and FG OPs deleted for the sew serial id : ${req.poSerial}`);
        } catch (error) {
            throw error;
        }
    }

    // when the jobs are deleted in the SPS
    async deleteJobsByJobNumbers(req: JobNumberRequest): Promise<GlobalResponseObject> {
        try {
            const jobs = [req.jobNumber]; // map from the request
            await this.fgOpDepRepo.delete({ currJob: In(jobs), companyCode: req.companyCode, unitCode: req.unitCode });
            await this.jobOpRepo.delete({ jobNumber: In(jobs), companyCode: req.companyCode, unitCode: req.unitCode });
            await this.jobDepRepo.delete({ jobNumber: In(jobs), companyCode: req.companyCode, unitCode: req.unitCode });
            await this.bundleFgRepo.delete({ jobNumber: In(jobs), companyCode: req.companyCode, unitCode: req.unitCode });
            return new GlobalResponseObject(true, 0, `Jobs info deleted for the jobs : ${jobs.toString()}`);
        } catch (error) {
            throw error;
        }
    }
}
