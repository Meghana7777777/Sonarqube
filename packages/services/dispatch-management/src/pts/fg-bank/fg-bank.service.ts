import { Body, Controller, Injectable, Post } from '@nestjs/common';
import { ErrorResponse, returnException } from '@xpparel/backend-utils';
import { GlobalResponseObject, ProcessTypeEnum, PtsBankRequestBundleTrackModel, PtsBankRequestCreateRequest, PtsBankRequestDepJobModel, PtsBundelInfoBasicModel, PtsJobNumberDepJgRequest } from '@xpparel/shared-models';
import { DataSource, In } from 'typeorm';
import { BankRequestHeaderRepository } from './repository/bank-request.repository';
import { BankRequestLineRepository } from './repository/bank-request-line.repository';
import { BankRequestDepJobRepository } from './repository/bank-request-dep-job.repository';
import { GenericTransactionManager } from '../../database/typeorm-transactions';
import { FgOpDepRepository } from '../repository/fg-op-dep.repository';
import { JobOpEntity } from '../entity/job-op.entity';
import { FgOpRepository } from '../repository/fg-op.repository';
import { OpSequenceRepository } from '../repository/op-sequence.repository';
import { FgRepository } from '../repository/fg.repository';
import { JobOpRepository } from '../repository/job-op.repository';
import { JobDepRepository } from '../repository/job-dep.repository';
import { BundleFgRepository } from '../repository/bundle-fg.repository';
import { FgOpDepEntity } from '../entity/fg-op-dep.entity';
import { MoInfoRepository } from '../repository/mo-info.repository';
import { FgBankHelperService } from './fg-bank-helper.service';
import { BankRequestDepJobEntity } from './entity/bank-request-dep-job.entity';
import { BankRequestHeaderEntity } from './entity/bank-request-header.entity';
import { BankRequestLineEntity } from './entity/bank-request-line.entity';
import { BankRequestBundleTrackEntity } from './entity/bank-request-bundle-track.entity';
import { OpSequenceEntity } from '../entity/op-sequence.entity';



@Injectable()
export class FgBankService {
    constructor(
        private dataSource: DataSource,
        private bankHeaderRepo: BankRequestHeaderRepository,
        private bankLineRepo: BankRequestLineRepository,
        private bankDepJobRepo: BankRequestDepJobRepository,
        private fgDepRepo: FgOpDepRepository,
        private fgRepo: FgRepository,
        private fgOpRepo: FgOpRepository,
        private opSeqRepo: OpSequenceRepository,
        private jobOpRepo: JobOpRepository,
        private jobDepRepo: JobDepRepository,
        private bundleFgRepo: BundleFgRepository,
        private moInfoRepo: MoInfoRepository,
        private helperService: FgBankHelperService
    ) {
        
    }

    async createBankRequest(@Body() req: PtsBankRequestCreateRequest): Promise<GlobalResponseObject> {
        const transManager = new GenericTransactionManager(this.dataSource);
        try {
            const { companyCode, unitCode, username } = req;
            const jobReqInfo = req.mainJobs[0];

            const colorSizePendingFgsForAllocMap = new Map<string, Map<string, number[]>>();
            const colSizeOslIdsMap = await this.getOslRefIdsBasedOnColSizeForSewSerial(req.sewSerial, companyCode, unitCode);
            const firstOpOfMainJob = await this.getFirstOperationRecOfJob(jobReqInfo.mainJob, companyCode, unitCode);

            
            await transManager.startTransaction();

            jobReqInfo.dependentJobs.forEach(async preJob => {
                const lastOpOfPreJob = await this.getLastOperationRecOfJob(preJob.depJobNumber, companyCode, unitCode);
                
                // for each bundle.. in the dependent job group, get the eligble and pending FGs and map then to the fg-component
                preJob.bundles.forEach(async b => {
                    const colorAndSizeOfBundle = await this.bundleFgRepo.getColSizeForBundle(b.brcd, companyCode, unitCode);
                    const color = colorAndSizeOfBundle.color;
                    const size = colorAndSizeOfBundle.size;
                    // const preUtilizedFgs = await this.getAlreadyIssuedFgsForPreJgBundle(preJob.depJobNumber, b.brcd, companyCode, unitCode);
                    // now filter the eligible FGs
                    let currOpCompFgsForBundle: number[] = [];
                    if(lastOpOfPreJob.opCategory == ProcessTypeEnum.CUT) {
                        currOpCompFgsForBundle = await this.helperService.getFgsCompletedForCutBundle(b.brcd, lastOpOfPreJob.opCode, companyCode, unitCode); // get from the CPS 
                    } else {
                        currOpCompFgsForBundle = await this.getOpCompletedFgsForSewBundleAndOp(b.brcd, req.sewSerial, lastOpOfPreJob.opCode, companyCode, unitCode);
                    }
                    if(currOpCompFgsForBundle.length == 0) {
                        throw new ErrorResponse(0, `No pre op FGs found for the operation and bundle : ${b.brcd}`);
                    }
                    const bundleFgsThatAlreadyMappedToNextOp = await this.getAlreadyMappedPreFgsForBundleAndCurrOp(b.brcd, req.sewSerial, firstOpOfMainJob.opCode, companyCode, unitCode);
                    const pendingFgsCanBeMapped = currOpCompFgsForBundle.filter(r => !bundleFgsThatAlreadyMappedToNextOp.includes(r));
                    if(pendingFgsCanBeMapped.length < b.rQty) {
                        throw new ErrorResponse(0, `Requested ${b.rQty} from bundle : ${b.brcd} from last op : ${lastOpOfPreJob}. But found only ${pendingFgsCanBeMapped.length} qty`);
                    }
                    // now based on the qty, map the FGs to the fg op dep table
                    const sufficientFgs = pendingFgsCanBeMapped.slice(0, b.rQty);
                    const oslIdsForColSize = colSizeOslIdsMap.get(color).get(size);

                    // now get the curr job related FGs that were not yet mapped for the pre operation
                    const jobPendingFgsForPreJg = await this.fgDepRepo.find({select: ['fgNumber'], where: { companyCode: companyCode, unitCode: unitCode, oslId: In(oslIdsForColSize), extFgNumber: 0, depJobGroup: lastOpOfPreJob.jobGroup, depJobType: lastOpOfPreJob.opCategory}, order: { fgNumber: 'ASC'} });
                    // but we have to update this bundle only for the sufficient FGs

                    if(jobPendingFgsForPreJg.length < sufficientFgs.length) {
                        throw new ErrorResponse(0, `Pending FGs to fulfill for job group : ${lastOpOfPreJob.jobGroup} is less than the incoming request quantity. current : ${jobPendingFgsForPreJg.length} incoming: ${sufficientFgs.length}`);
                    }

                    let index = 0;
                    // update the dep op fg for every FG
                    for(const r of jobPendingFgsForPreJg) {
                        // this will map the first FG in the eligible FGs list based on the filling logic
                        // NOTE: This records will be updated only for the first operation of the job group. For the last operation in the job group, the dependency is only on the first operation of the job group
                        const extFgNumber = sufficientFgs[index];
                        await transManager.getRepository(FgOpDepEntity).update({ companyCode: companyCode, unitCode: unitCode, sewSerial: req.sewSerial, fgNumber: r.fgNumber,opCode: firstOpOfMainJob.opCode, depJobGroup: lastOpOfPreJob.jobGroup }, {depJob: preJob.depJobNumber, depBundle: b.brcd, extFgNumber: extFgNumber});
                        index++;
                    }
                });
            });

            const bankHeader = new BankRequestHeaderEntity();
            bankHeader.approvalStatus = 1;
            bankHeader.companyCode = companyCode;
            bankHeader.unitCode = unitCode;
            bankHeader.issuanceStatus = 1;
            bankHeader.readinessStatus = 1;
            // bankHeader.reqNo = req.sewSerial+'-'+; this is an auto inc value
            bankHeader.requestedBy = username;
            bankHeader.sewSerial = req.sewSerial;
            const savedHeader = await transManager.getRepository(BankRequestHeaderEntity).save(bankHeader);
            const savedHeaderId = savedHeader.id;

            // only 1 main job per request
            const bankReqLine = new BankRequestLineEntity();
            bankReqLine.companyCode = companyCode;
            bankReqLine.unitCode = unitCode;
            bankReqLine.jobNumber = jobReqInfo.mainJob;
            bankReqLine.opCategory = firstOpOfMainJob.opCategory;
            bankReqLine.readinessStatus = 1;
            bankReqLine.sewSerial = req.sewSerial;
            bankReqLine.issuanceStatus = 1;
            bankReqLine.createdUser = username;
            const savedBl = await transManager.getRepository(BankRequestLineEntity).save(bankReqLine);

            jobReqInfo.dependentJobs.forEach(async preJob => {
                let reqQty = 0;
                preJob.bundles.forEach(b => {
                    reqQty += b.rQty;
                });
                // finally save the bank dep info
                const bankDepJobEnt = new BankRequestDepJobEntity();
                bankDepJobEnt.brId = savedHeaderId;
                bankDepJobEnt.companyCode = companyCode;
                bankDepJobEnt.unitCode = unitCode;
                bankDepJobEnt.createdUser = username;
                bankDepJobEnt.currJob = jobReqInfo.mainJob;
                bankDepJobEnt.preJg = preJob.depJobGroup;
                bankDepJobEnt.issQty = 0;
                bankDepJobEnt.reqQty = reqQty;
                bankDepJobEnt.sewSerial = req.sewSerial;
                const savedBankDepJob = await transManager.getRepository(BankRequestDepJobEntity).save(bankDepJobEnt);

                const bundleEnts: BankRequestBundleTrackEntity[] = [];
                preJob.bundles.forEach(b => {
                    const bankBundleTrack = new BankRequestBundleTrackEntity();
                    bankBundleTrack.companyCode = companyCode;
                    bankBundleTrack.unitCode = unitCode;
                    bankBundleTrack.createdUser = username;
                    bankBundleTrack.brId = savedHeaderId;
                    bankBundleTrack.brjId = savedBankDepJob.id;
                    bankBundleTrack.brlId = savedBl.id;
                    bankBundleTrack.bundle = b.brcd;
                    bankBundleTrack.preJg = preJob.depJobGroup;
                    bankBundleTrack.rQty = b.rQty;
                    bankBundleTrack.isPanel = preJob.opCategory == ProcessTypeEnum.CUT;
                    bankBundleTrack.currJob = preJob.depJobNumber;
                    bundleEnts.push(bankBundleTrack);
                });
                await transManager.getRepository(BankRequestBundleTrackEntity).save(bundleEnts,{reload: false});
            });
            
            await transManager.completeTransaction();
            return new GlobalResponseObject(true, 0, 'Bank allocation completed');
        } catch (error) {
            await transManager.releaseTransaction();
            throw error;
        }
    }


    async getAlreadyIssuedFgsForPreJgBundle(depJobNo: string, depBundle: string, companyCode: string, unitCode: string): Promise<number[]> {
        const recs = await this.fgDepRepo.find({select: ['fgNumber'], where: { companyCode: companyCode, unitCode: unitCode, depJob: depJobNo, depBundle: depBundle} });
        return recs.map(r => r.fgNumber);
    }

    async getLastOperationRecOfJob(jobNum: string, companyCode: string, unitCode: string): Promise<JobOpEntity> {
        const rec = await this.jobOpRepo.findOne({ where: { jobNumber: jobNum, companyCode: companyCode, unitCode: unitCode}, order:{opOrder: 'DESC'}});
        return rec;
    }

    async getFirstOperationRecOfJob(jobNum: string, companyCode: string, unitCode: string): Promise<JobOpEntity> {
        const rec = await this.jobOpRepo.findOne({ where: { jobNumber: jobNum, companyCode: companyCode, unitCode: unitCode}, order:{opOrder: 'ASC'}});
        return rec;
    }

    // to get the fg numbers that were already completed for the curr operation
    async getOpCompletedFgsForSewBundleAndOp(bundle: string, sewSerial: number, opCode: string, companyCode: string, unitCode: string): Promise<number[]> {       
        const fgsForBundle = await this.bundleFgRepo.find({select: ['fgNumber'], where: { companyCode: companyCode, unitCode: unitCode, bundleBarcode: bundle}});
        const bundleFgs = fgsForBundle.map(r => r.fgNumber);
        const recs = await this.fgDepRepo.find({select: ['fgNumber'], where: { opCompleted: true, companyCode: companyCode, unitCode: unitCode, sewSerial: sewSerial, fgNumber: In(bundleFgs), opCode: opCode  }, order: {fgNumber: 'ASC'}});
        return recs.map(r => r.fgNumber);
    }

    // to get the fg numbers that were already completed for the cut operation
    async getOpCompletedFgsForCutBundleAndOp(bundle: string, sewSerial: number, opCode: string, companyCode: string, unitCode: string): Promise<number[]> {       
       return [];
    }

    // to get the fg numbers that were already mapped for another FG
    async getAlreadyMappedPreFgsForBundleAndCurrOp(depBundle: string, sewSerial: number, opCode: string, companyCode: string, unitCode: string): Promise<number[]> {
        const recs = await this.fgDepRepo.find({select: ['extFgNumber'], where: { companyCode: companyCode, unitCode: unitCode, sewSerial: sewSerial, depBundle: depBundle, opCode: opCode }, order: {extFgNumber: 'ASC'}});
        return recs.map(r => r.fgNumber);
    }

    // to get the fg numbers that were already mapped for another FG
    async getAlreadyMappedPreFgsForSewSerialAndNextOp(sewSerial: number, opCode: string, companyCode: string, unitCode: string): Promise<number[]> {
        const recs = await this.fgDepRepo.find({select: ['extFgNumber'], where: { companyCode: companyCode, unitCode: unitCode, sewSerial: sewSerial, depOpCode: opCode, issued: true }, order: {extFgNumber: 'ASC'}});
        return recs.map(r => r.fgNumber);
    }

    // to get the fg numbers that were already mapped for another FG
    async getAlreadyMappedPreFgsForGivenFgsAndPreOp(sewSerial: number, fgNums: number[], opCode: string, companyCode: string, unitCode: string): Promise<number[]> {
        const recs = await this.fgDepRepo.find({select: ['extFgNumber'], where: { companyCode: companyCode, unitCode: unitCode, sewSerial: sewSerial, depOpCode: opCode, issued: true, extFgNumber: In(fgNums) }, order: {extFgNumber: 'ASC'}});
        return recs.map(r => r.fgNumber);
    }


    async getOslRefIdsBasedOnColSizeForSewSerial(sewSerial: number, companyCode: string, unitCode: string): Promise<Map<string, Map<string, number[]>>> {
        const colSizeRefIdsMap = new Map<string, Map<string, number[]>>();
        const recs = await this.moInfoRepo.find({select: ['oslId', 'color', 'size'], where: {unitCode: unitCode, companyCode: companyCode, sewSerial: sewSerial}});
        recs.forEach(r => {
            if(!colSizeRefIdsMap.has(r.color)) {
                colSizeRefIdsMap.set(r.color, new Map<string, number[]>());
            }
            if(!colSizeRefIdsMap.get(r.color).has(r.size)) {
                colSizeRefIdsMap.get(r.color).set(r.size, []);
            }
            colSizeRefIdsMap.get(r.color).get(r.size).push(r.oslId);
        });
        return colSizeRefIdsMap
    }


    // to get the fg numbers that were already completed for the curr operation
    async getOpCompletedFgsForSewSerialAndOp(sewSerial: number, filteringFgNums: number[], opCode: string, companyCode: string, unitCode: string): Promise<number[]> {
        let recs: FgOpDepEntity[] = [];
        if(filteringFgNums.length > 0) {
            recs = await this.fgDepRepo.find({select: ['fgNumber'], where: { opCompleted: true, companyCode: companyCode, unitCode: unitCode, sewSerial: sewSerial, opCode: opCode, fgNumber: In(filteringFgNums) }, order: {fgNumber: 'ASC'}});
        } else {
            recs = await this.fgDepRepo.find({select: ['fgNumber'], where: { opCompleted: true, companyCode: companyCode, unitCode: unitCode, sewSerial: sewSerial, opCode: opCode }, order: {fgNumber: 'ASC'}});
        }
        return recs.map(r => r.fgNumber);
    }

    // when we request the bundles for allocating to the sew job
    async getPreJgElgBundlesForJob(req: PtsJobNumberDepJgRequest): Promise<PtsBankRequestDepJobModel[]> {
        const mainJob = req.jobNumber;
        const preJob = req.depJg;
        const { companyCode, unitCode } = req;

        const jobRec = await this.jobOpRepo.findOne({where: { companyCode: companyCode, unitCode: unitCode, jobNumber: mainJob }});
        if(!jobRec) {
            throw new ErrorResponse(0, `Job $${mainJob} is not found`);
        }
        const lastOpOfMainJob = await this.getLastOperationRecOfJob(mainJob, companyCode, unitCode);
        const firstOpOfMainJob = await this.getFirstOperationRecOfJob(mainJob, companyCode, unitCode);
        const mainOp = firstOpOfMainJob.opCode;
        const preOpsOfMainJobFirstOp = firstOpOfMainJob.preOps.split(',');
        const opIfno = await this.opSeqRepo.find({ where: { opCode: In(preOpsOfMainJobFirstOp), unitCode: unitCode, companyCode: companyCode }});
        // ignore the pre op cutting ones
        const otherOps = [];
        const opCatMap = new Map<string, OpSequenceEntity>();
        opIfno.forEach(o => {
            if(o.opCategory != ProcessTypeEnum.CUT) {
                otherOps.push(o.opCode);
            }
            opCatMap.set(o.opCode, o);
        });
        const finalResArr: PtsBankRequestDepJobModel[] = [];
        const sewJobColorSizeQtys = await this.getColorSizeWiseFgsForJob(mainJob, companyCode, unitCode);
        const fgsMapForSewSerialColSize = await this.getColSizeFgsForSewSerial(req.sewSerial, companyCode, unitCode);
        for( const [color, sizeFgs] of sewJobColorSizeQtys ) {
            for(const [size, fgs] of sizeFgs ) {
                for(const preOp of otherOps) {
                    // NOTE: ------------------- ALL THE BELOW BLOCK IS ONLY UNDER A SIZE -------------------------

                    // check how many FGs are already filled with allcoation by some random job for the operation
                    const pendingSewJobFgsForCurrJobAllocationRecs = await this.fgDepRepo.find({select: ['fgNumber'], where: {fgNumber: In(fgs), companyCode: companyCode, unitCode: unitCode, extFgNumber: 0, depOpCode: preOp, issued: false, opCode: firstOpOfMainJob.opCode }});
                    const pendingSewJobFgsForCurrJobAllocation = pendingSewJobFgsForCurrJobAllocationRecs.map(r => r.fgNumber);
                    // exclude the already allocated current sew job related FGs
                    // const pendingFgsForAllocationForSewJobAndPreOp = fgs.filter(f => pendingSewJobFgsForCurrJobAllocation.includes(f));
                    
                    const colSizeFgs = fgsMapForSewSerialColSize.get(color).get(size);
                    // now get the pre operation completed FGs for the color and size under the sew serial
                    const preOpCompletedFgs = await this.getOpCompletedFgsForSewSerialAndOp(req.sewSerial, colSizeFgs, preOp, companyCode, unitCode);

                    // now out of those completed FGs, remove those FGs that are allocated for some other FGs 
                    const preOpCompletedFgsThatAreAllocatedForNextOpRes = await this.fgDepRepo.find({select: ['extFgNumber'], where: {companyCode: companyCode, unitCode: unitCode, sewSerial: req.sewSerial, extFgNumber: In(preOpCompletedFgs)  }});
                    const preOpCompletedFgsThatAreAllocatedForNextOp = preOpCompletedFgsThatAreAllocatedForNextOpRes.map(r => r.extFgNumber);

                    // filter out the eligible FGs of the pre op
                    const preOpCompletedFgsAndAvlForCurrOpAllocation = preOpCompletedFgs.filter(r => !preOpCompletedFgsThatAreAllocatedForNextOp.includes(r));

                    const avlQty = preOpCompletedFgsAndAvlForCurrOpAllocation.length;
                    const askingQty = pendingSewJobFgsForCurrJobAllocation.length;

                    // now we have to fulfill the asking qty based on the qvl qty
                    let finalFgs = avlQty > askingQty ? preOpCompletedFgsAndAvlForCurrOpAllocation.splice(0, askingQty) : preOpCompletedFgsAndAvlForCurrOpAllocation;

                    const currJg = opCatMap.get(preOp).jobGroup;
                    // now for these final FGs , we have to construct the bundle wise recs

                    const bundles = finalFgs.length ? await this.bundleFgRepo.getBundlesForFgNumbersAndJg(req.sewSerial, finalFgs, currJg, companyCode, unitCode) : [];
                    // CONSTRUC THE RESPONSE


                    const resBunModels: PtsBankRequestBundleTrackModel[] = [];
                    bundles.forEach(b => {
                        const fgArr = b.fgs?.split(',');
                        const bun = new PtsBankRequestBundleTrackModel();
                        bun.brcd = b.bundle_barcode;
                        bun.rQty = fgArr.length;
                        const props = new PtsBundelInfoBasicModel();
                        props.color = b.color;
                        props.size = b.size;
                        props.jobNo = b.job_number;
                        bun.bundleProps = props;
                        resBunModels.push(bun);
                    });

                    const jgAvBunModel = new PtsBankRequestDepJobModel();
                    jgAvBunModel.bundles = resBunModels;
                    jgAvBunModel.depJobGroup = currJg;
                    jgAvBunModel.opCategory = opCatMap.get(preOp).opCategory;
                    jgAvBunModel.iQty = fgs.length - pendingSewJobFgsForCurrJobAllocationRecs.length;
                    finalResArr.push(jgAvBunModel);
                }
            }
        }
        return finalResArr;
    }


    async getColorSizeWiseFgsForJob(jobNumber: string, companyCode: string, unitCode: string): Promise<Map<string, Map<string, number[]>>> {
        const fgsMap = new Map<string, Map<string, number[]>>();
        const fgsForSewJob = await this.bundleFgRepo.getColSizeFgsForJob(jobNumber, companyCode, unitCode);
        fgsForSewJob.forEach(f => {
            if(!fgsMap.has(f.color)) {
                fgsMap.set(f.color, new Map<string, number[]>());
            }
            if(!fgsMap.get(f.color).has(f.size)) {
                const fgs = f?.fgs?.split(',').map(f => Number(f));
                fgsMap.get(f.color).set(f.size, fgs);
            }
        })
        return fgsMap;
    }

    async getColSizeFgsForSewSerial(sewSerial: number, companyCode: string, unitCode: string): Promise<Map<string, Map<string, number[]>>> {
        const fgsMap = new Map<string, Map<string, number[]>>();
        const fgsForSewJob = await this.moInfoRepo.getColSizeFgsForSewSerial(sewSerial, companyCode, unitCode);
        fgsForSewJob.forEach(f => {
            if(!fgsMap.has(f.color)) {
                fgsMap.set(f.color, new Map<string, number[]>());
            }
            if(!fgsMap.get(f.color).has(f.size)) {
                const fgs = f?.fgs?.split(',').map(f => Number(f));
                fgsMap.get(f.color).set(f.size, fgs);
            }
        })
        return fgsMap;
    }



}

