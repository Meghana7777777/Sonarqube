import { Body, Controller, Injectable, Post } from '@nestjs/common';
import { ErrorResponse, returnException } from '@xpparel/backend-utils';
import { BarcodeDetailsForBundleScanning, BarcodeDetailsResponse, BundleScanningRequest, ColorAndSizeDetails, ColorSizeCompModel, CompWiseBundleInfo, GlobalResponseObject, JobNumberRequest, MoPropsModel, ProcessTypeEnum, PtsBankRequestBundleTrackModel, PtsBankRequestCreateRequest, PtsBankRequestDepJobModel, PtsBundelInfoBasicModel, PtsJobNumberDepJgRequest, SizeDetails } from '@xpparel/shared-models';
import { DataSource, In } from 'typeorm';
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
import { OpSequenceEntity } from '../entity/op-sequence.entity';
import { BankRequestLineRepository } from '../fg-bank/repository/bank-request-line.repository';
import { BankRequestHeaderRepository } from '../fg-bank/repository/bank-request.repository';
import { BankRequestDepJobRepository } from '../fg-bank/repository/bank-request-dep-job.repository';
import { FgOpEntity } from '../entity/fg-operation.entity';
import { TransLogEntity } from '../entity/transaction-log.entity';



@Injectable()
export class FgReportingService {
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
        private moInfoRepo: MoInfoRepository
    ) {
        
    }

    async getLastOperationRecOfJob(jobNum: string, companyCode: string, unitCode: string): Promise<JobOpEntity> {
        const rec = await this.jobOpRepo.findOne({ where: { jobNumber: jobNum, companyCode: companyCode, unitCode: unitCode}, order:{opOrder: 'DESC'}});
        return rec;
    }

    async getFirstOperationRecOfJob(jobNum: string, companyCode: string, unitCode: string): Promise<JobOpEntity> {
        const rec = await this.jobOpRepo.findOne({ where: { jobNumber: jobNum, companyCode: companyCode, unitCode: unitCode}, order:{opOrder: 'ASC'}});
        return rec;
    }

    getTransactionLogEntity(brcd: string, job: string, opCode: string, gQty: number, rQty: number, oslId: number, sewSerial: number, companyCode: string, unitCode: string, username: string): TransLogEntity {
        const ent = new TransLogEntity();
        ent.bundleBarcode = brcd;
        ent.companyCode = companyCode;
        ent.createdUser = username
        ent.unitCode = unitCode;
        ent.gQty = gQty;
        ent.jobNumber = job;
        ent.oslId = oslId;
        ent.bundleBarcode = brcd;
        ent.sewSerial = sewSerial;
        ent.rQty = rQty;
        return ent;
    }

    async updateReportedQtyOfJobAndOp(jobNumber: string, opCode: string, gQty: number, rQty: number, companyCode: string, unitCode: string, transManager: GenericTransactionManager): Promise<boolean> {
        const jobOpRec = await this.jobOpRepo.findOne({ where: { companyCode: companyCode, unitCode: unitCode, jobNumber: jobNumber, opCode: opCode }});
        const orgQty = jobOpRec.orgQty;
        const preQty = jobOpRec.gQty + jobOpRec.rQty;
        let reconciled = false;
        if((preQty + gQty + rQty) == orgQty) {
            // then the job reconciliation will be true
            reconciled = true;
        }
        await transManager.getRepository(JobOpEntity).update({jobNumber: jobNumber, companyCode: companyCode, unitCode: unitCode, opCode: opCode}, { gQty: ()=>`g_qty + ${gQty}`, rQty:  ()=>`r_qty + ${rQty}`, reconciled: reconciled });
        return true;
    }

    async reportOpForBarcode(req: BundleScanningRequest): Promise<GlobalResponseObject> {
        const transManager = new GenericTransactionManager(this.dataSource);
        try {
            const { companyCode, unitCode, username } = req;
            const bundleBarcode = req.barcode;
            const bundleRec = await this.bundleFgRepo.findOne({select: ['jobNumber'], where: { companyCode: companyCode, unitCode: unitCode, bundleBarcode: bundleBarcode }});
            const mainJob = bundleRec.jobNumber;
            const opCode = req.operationCode;
            const sewSerial = bundleRec.sewSerial;
            const reportingQty = req.reportingQty > 0 ? req.reportingQty : 0;

            const bundleColorSizeQtys = await this.getColorSizeWiseFgsForBundle(bundleBarcode, companyCode, unitCode);
            const oslIdsForBundle = await this.bundleFgRepo.getOslRefIdsForBundle(sewSerial, bundleBarcode, companyCode, unitCode);

            let totalQtyScanned = 0;
            await transManager.startTransaction();
            for( const [color, sizeFgs] of bundleColorSizeQtys ) {
                const sizeModels: SizeDetails[] = [];
                for(const [size, fgs] of sizeFgs ) {
                    // try to check if any eligible FGs are present and report them
                    const alreadyRepFgRecs = await this.fgOpRepo.find({select: ['fgNumber'], where: { companyCode: companyCode, unitCode: unitCode, fgNumber: In(fgs), opCode: opCode, opCompleted: true }});
                    const alreadyRepFgs = new Set<number>();
                    alreadyRepFgRecs.map(r => alreadyRepFgs.add(r.fgNumber));
                    const unReportedFgs = fgs.filter(f => !alreadyRepFgs.has(f));

                    const unElgFgRecs = await this.fgDepRepo.find({select: ['fgNumber'], where: { companyCode: companyCode, unitCode: unitCode, fgNumber: In(unReportedFgs), opCompleted: false, extFgNumber: 0, issued: false, opCode: opCode}});
                    const unElgFgs = new Set<number>();
                    unElgFgRecs.forEach(r => unElgFgs.add(r.fgNumber));

                    const totalElgFgs = unReportedFgs.filter(r => !unElgFgs.has(r));

                    const toConsiderFgs = reportingQty ? totalElgFgs.splice(0, reportingQty) : totalElgFgs;

                    if(toConsiderFgs.length > 0) {
                        totalQtyScanned = toConsiderFgs.length;
                        // perform the transaction and update the fg op and fg comp tables
                        await transManager.getRepository(FgOpEntity).update({sewSerial: sewSerial, companyCode: companyCode, unitCode: unitCode, opCode: opCode, fgNumber: In(toConsiderFgs)}, {opCompleted: true});
                        await transManager.getRepository(FgOpDepEntity).update({sewSerial: sewSerial, companyCode: companyCode, unitCode: unitCode, opCode: opCode, fgNumber: In(toConsiderFgs)}, {opCompleted: true});
                        // insert the records into the transaction log table
                        const oslId = oslIdsForBundle[0];
                        const transLogEnt = this.getTransactionLogEntity(bundleBarcode, mainJob, opCode, toConsiderFgs.length, 0, oslId, sewSerial, companyCode, unitCode, username);
                        await transManager.getRepository(TransLogEntity).save(transLogEnt, { reload: false });
                        // update the op rep qty for the job
                        await this.updateReportedQtyOfJobAndOp(mainJob, opCode, toConsiderFgs.length, 0, companyCode, unitCode, transManager);
                    }
                }
            }
            await transManager.completeTransaction();
            return new GlobalResponseObject(true, 0, `Operation reported for the bundle. Total ${totalQtyScanned} are scanned`);
        } catch (error) {
            await transManager.releaseTransaction();
            throw error;
        }
    }


    async reportOpForJob(req: BarcodeDetailsForBundleScanning): Promise<GlobalResponseObject> {
        const transManager = new GenericTransactionManager(this.dataSource);
        try {
            const { companyCode, unitCode, username } = req;
            const mainJob = req.barcode;
            const opCode = req.operationCode;
            const jobRec = await this.bundleFgRepo.findOne({select: ['jobNumber'], where: { companyCode: companyCode, unitCode: unitCode, jobNumber: mainJob }});
            const sewSerial = jobRec.sewSerial;
            const sewJobColorSizeQtys = await this.getColorSizeWiseFgsForJob(mainJob, companyCode, unitCode);
            const oslIdsForJob = await this.bundleFgRepo.getOslRefIdsForSewJob(sewSerial, mainJob, companyCode, unitCode);
            const jobOpRec = await this.jobOpRepo.findOne({where: { companyCode: companyCode, unitCode: unitCode, jobNumber: mainJob }});

            const incomingRepQtysForJob = new Map<string, Map<string, {gQty: number, rQty: number}>>();
            req.colorAndSizeDetails.forEach(r => {
                incomingRepQtysForJob.set(r.color, new Map<string, {gQty: number, rQty: number}>());
                r.sizesDetails.forEach(s => {
                    let rQty = 0;
                    s.rejectionDetails.forEach(rj => rQty += rj.rejectedQty);
                    incomingRepQtysForJob.get(r.color).set(s.size, {gQty: s.reportingGoodQty, rQty: rQty});
                });
            })
            await transManager.startTransaction();
            for( const [color, sizeFgs] of sewJobColorSizeQtys ) {
                const sizeModels: SizeDetails[] = [];
                for(const [size, fgs] of sizeFgs ) {
                    // check the eligible FGs for the current op
                    const alreadyRepFgRecs = await this.fgOpRepo.find({select: ['fgNumber'], where: { companyCode: companyCode, unitCode: unitCode, fgNumber: In(fgs), opCode: opCode, opCompleted: true }});
                    const alreadyRepFgs = new Set<number>();
                    alreadyRepFgRecs.map(r => alreadyRepFgs.add(r.fgNumber));
                    const unReportedFgs = fgs.filter(f => !alreadyRepFgs.has(f));

                    const unElgFgRecs = await this.fgDepRepo.find({select: ['fgNumber'], where: { companyCode: companyCode, unitCode: unitCode, fgNumber: In(unReportedFgs), opCompleted: false, extFgNumber: 0, issued: false, opCode: opCode}});
                    const unElgFgs = new Set<number>();
                    unElgFgRecs.forEach(r => unElgFgs.add(r.fgNumber));

                    const totalElgFgs = unReportedFgs.filter(r => !unElgFgs.has(r));
                    const incomingQty = incomingRepQtysForJob.get(color).get(size);
                    const iQQty = incomingQty.gQty;
                    const iRQty = incomingQty.rQty;
                    const totalIQty = iQQty + iRQty;
                    if(totalElgFgs.length < (totalIQty)) {
                        throw new ErrorResponse(0, `Incoming to report qty : ${totalIQty} for size : ${size}. But only ${totalElgFgs.length} are available`);
                    }
                    const requiredElgFgs = totalElgFgs.splice(0, totalIQty);
                    if(totalElgFgs.length > 0) {
                        // get the bundle wise FGs for the eligible FGs
                        const bundles = await this.bundleFgRepo.getBundlesForFgNumbersAndJob(sewSerial, requiredElgFgs, mainJob, companyCode, unitCode);
                        
                        for(const bundle of bundles) {
                            const bundleFgs = bundle.fgs.split(',');
                            // perform the transaction and update the fg op and fg comp tables
                            await transManager.getRepository(FgOpEntity).update({sewSerial: sewSerial, companyCode: companyCode, unitCode: unitCode, opCode: opCode, fgNumber: In(bundleFgs)}, {opCompleted: true});
                            await transManager.getRepository(FgOpDepEntity).update({sewSerial: sewSerial, companyCode: companyCode, unitCode: unitCode, opCode: opCode, fgNumber: In(bundleFgs)}, {opCompleted: true});

                            // insert the records into the transaction log table
                            const oslId = bundle.osl_id;
                            const transLogEnt = this.getTransactionLogEntity(bundle.bundle_barcode, mainJob, opCode, bundleFgs.length, 0, oslId, sewSerial, companyCode, unitCode, username);
                            await transManager.getRepository(TransLogEntity).save(transLogEnt, { reload: false });
                            // update the op rep qty for the job
                            await this.updateReportedQtyOfJobAndOp(mainJob, opCode, bundleFgs.length, 0, companyCode, unitCode, transManager);
                        }
                    }
                }
            }
            await transManager.completeTransaction();
            return new GlobalResponseObject(true, 0, 'Job reported successfully');
        } catch (error) {
            await transManager.releaseTransaction();
            throw error;
        }
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

    async getColorSizeWiseFgsForBundle(bundleBrcd: string, companyCode: string, unitCode: string): Promise<Map<string, Map<string, number[]>>> {
        const fgsMap = new Map<string, Map<string, number[]>>();
        const fgsForSewJob = await this.bundleFgRepo.getColSizeFgsForBundle(bundleBrcd, companyCode, unitCode);
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
    
    async getOslRefIdsBasedOnColSizeForSewJob(sewSerial: number, companyCode: string, unitCode: string): Promise<Map<string, Map<string, number[]>>> {
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
        return colSizeRefIdsMap;
    }

    async getOslIdProperties(oslIds: number[], companyCode: string, unitCode: string): Promise<MoPropsModel> {
        const moNos = new Set<string>();
        const styles = new Set<string>();
        const moLineNos = new Set<string>();
        const destinations = new Set<string>();
        const plannedDelDates = new Set<string>();
        const planProdDates = new Set<string>();
        const planCutDates = new Set<string>();
        const coLines = new Set<string>();
        const buyerPos = new Set<string>();
        const productNames = new Set<string>();
        const fgColors = new Set<string>();
        const sizes = new Set<string>();
        const mos = new Set<string>();
        const oslProps = await this.moInfoRepo.find({ where: { companyCode: companyCode, unitCode: unitCode, oslId: In(oslIds) }});
        oslProps.forEach(r => {
            moNos.add(r.moNo);
            styles.add(r.style);
            moLineNos.add(r.moLineNo);
            destinations.add(r.destination);
            plannedDelDates.add(r.delDate);
            planProdDates.add(r.pcd);
            planCutDates.add(r.pcd);
            coLines.add(r.co);
            buyerPos.add(r.buyerPo);
            productNames.add(r.productName);
            fgColors.add(r.color);
            sizes.add(r.size);
            mos.add(r.moNumber);
        });
        const moPropsModel = new MoPropsModel();
        moPropsModel.buyerPo = Array.from(buyerPos).toString();
        moPropsModel.coLine = Array.from(coLines).toString();
        moPropsModel.destination = Array.from(destinations).toString();
        moPropsModel.fgColor = Array.from(fgColors).toString();
        moPropsModel.moNumbers = Array.from(mos).toString();
        moPropsModel.planCutDate = Array.from(planCutDates).toString();
        moPropsModel.planProdDate = Array.from(planCutDates).toString();
        moPropsModel.plannedDelDate = Array.from(plannedDelDates).toString();
        moPropsModel.productName = Array.from(productNames).toString();
        moPropsModel.size = Array.from(sizes).toString();
        moPropsModel.moLineNo = Array.from(moLineNos).toString();
        moPropsModel.moNumber = Array.from(moNos).toString();
        moPropsModel.style = Array.from(styles).toString();
        return moPropsModel;
    }

    // Sewing job retrieving by job
    async getJobDetailsByJobNumber(@Body() req: BundleScanningRequest): Promise<BarcodeDetailsResponse> {
        const transManager = new GenericTransactionManager(this.dataSource);
        try {
            const { companyCode, unitCode, username } = req;
            const mainJob = req.jobNo;
            const opCode = req.operationCode;

            const sewJobColorSizeQtys = await this.getColorSizeWiseFgsForJob(mainJob, companyCode, unitCode);
            const jobOpRec = await this.jobOpRepo.findOne({where: { companyCode: companyCode, unitCode: unitCode, jobNumber: mainJob }});

            const oslIdsForJob = await this.bundleFgRepo.getOslRefIdsForSewJob(jobOpRec.sewSerial, mainJob, companyCode, unitCode);
            // now get the properties of the OSL ref ids
            const oslProps = await this.getOslIdProperties(oslIdsForJob, companyCode, unitCode);

            const colorWiseModels: ColorAndSizeDetails[] = [];
            for( const [color, sizeFgs] of sewJobColorSizeQtys ) {
                const sizeModels: SizeDetails[] = [];
                for(const [size, fgs] of sizeFgs ) {
                    // check the eligible FGs for the current op
                    const alreadyRepFgRecs = await this.fgOpRepo.find({select: ['fgNumber'], where: { companyCode: companyCode, unitCode: unitCode, fgNumber: In(fgs), opCode: opCode, opCompleted: true }});
                    const alreadyRepFgs = new Set<number>();
                    alreadyRepFgRecs.map(r => alreadyRepFgs.add(r.fgNumber));
                    const unReportedFgs = fgs.filter(f => !alreadyRepFgs.has(f));

                    const unElgFgRecs = await this.fgDepRepo.find({select: ['fgNumber'], where: { companyCode: companyCode, unitCode: unitCode, fgNumber: In(unReportedFgs), opCompleted: false, extFgNumber: 0, issued: false, opCode: opCode}});
                    const unElgFgs = new Set<number>();
                    unElgFgRecs.forEach(r => unElgFgs.add(r.fgNumber));

                    const totalElgFgs = unReportedFgs.filter(r => !unElgFgs.has(r));

                    // now construct the color and size wise bundles
                    sizeModels.push(new SizeDetails(size, fgs.length, alreadyRepFgs.size, totalElgFgs.length, 0, []));
                }
                const colorSizeModel = new ColorAndSizeDetails(color, sizeModels);
                colorWiseModels.push(colorSizeModel);
            }

            const elgInfoModel = new BarcodeDetailsForBundleScanning(req.barcode, null, oslProps, colorWiseModels, req.operationCode, jobOpRec.opCategory)
           
            return new BarcodeDetailsResponse(true, 0, 'Bank allocation completed', elgInfoModel);
        } catch (error) {
            await transManager.releaseTransaction();
            throw error;
        }
    }


    // Sewing job retrieving by bundle
    async getJobDetailsByBundle(@Body() req: BundleScanningRequest): Promise<BarcodeDetailsResponse> {
        const transManager = new GenericTransactionManager(this.dataSource);
        try {
            const { companyCode, unitCode, username } = req;
            const opCode = req.operationCode;
            const bundleBarcode = req.barcode;

            const sewJobColorSizeQtys = await this.getColorSizeWiseFgsForBundle(bundleBarcode, companyCode, unitCode);
            const bundleRec = await this.bundleFgRepo.findOne({select: ['jobNumber'], where: { companyCode: companyCode, unitCode: unitCode, bundleBarcode: bundleBarcode }});
            const mainJob = bundleRec.jobNumber;

            const jobOpRec = await this.jobOpRepo.findOne({where: { companyCode: companyCode, unitCode: unitCode, jobNumber: mainJob }});

            const oslIdsForBundle = await this.bundleFgRepo.getOslRefIdsForBundle(jobOpRec.sewSerial, bundleBarcode, companyCode, unitCode);
            // now get the properties of the OSL ref ids
            const oslProps = await this.getOslIdProperties(oslIdsForBundle, companyCode, unitCode);

            const colorWiseModels: ColorAndSizeDetails[] = [];
            for( const [color, sizeFgs] of sewJobColorSizeQtys ) {
                const sizeModels: SizeDetails[] = [];
                for(const [size, fgs] of sizeFgs ) {
                    // check the eligible FGs for the current op
                    const alreadyRepFgRecs = await this.fgOpRepo.find({select: ['fgNumber'], where: { companyCode: companyCode, unitCode: unitCode, fgNumber: In(fgs), opCode: opCode, opCompleted: true }});
                    const alreadyRepFgs = new Set<number>();
                    alreadyRepFgRecs.map(r => alreadyRepFgs.add(r.fgNumber));
                    const unReportedFgs = fgs.filter(f => !alreadyRepFgs.has(f));

                    const unElgFgRecs = await this.fgDepRepo.find({select: ['fgNumber'], where: { companyCode: companyCode, unitCode: unitCode, fgNumber: In(unReportedFgs), opCompleted: false, extFgNumber: 0, issued: false, opCode: opCode}});
                    const unElgFgs = new Set<number>();
                    unElgFgRecs.forEach(r => unElgFgs.add(r.fgNumber));

                    const totalElgFgs = unReportedFgs.filter(r => !unElgFgs.has(r));

                    // now construct the color and size wise bundles
                    sizeModels.push(new SizeDetails(size, fgs.length, alreadyRepFgs.size, totalElgFgs.length, 0, []));
                }
                const colorSizeModel = new ColorAndSizeDetails(color, sizeModels);
                colorWiseModels.push(colorSizeModel);
            }

            const elgInfoModel = new BarcodeDetailsForBundleScanning(req.barcode, null, oslProps, colorWiseModels, req.operationCode, jobOpRec.opCategory)
           
            return new BarcodeDetailsResponse(true, 0, 'Bank allocation completed', elgInfoModel);
        } catch (error) {
            await transManager.releaseTransaction();
            throw error;
        }
    }



}

