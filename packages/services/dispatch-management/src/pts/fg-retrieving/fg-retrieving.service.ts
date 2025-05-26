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
    

    // async constructResponseModelBasedOnColSizeFgs(sewSerial: number, color: string, size: string, fgs: number[], currJg: number, companyCode: string, unitCode: string): Promise<ColorSizeCompModel> {
       
    // }

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

