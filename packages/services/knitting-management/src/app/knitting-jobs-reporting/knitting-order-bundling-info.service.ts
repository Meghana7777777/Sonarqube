import { Injectable } from '@nestjs/common';
import { ErrorResponse } from '@xpparel/backend-utils';
import { KMS_C_KnitOrderBundlingConfirmationIdRequest, KMS_R_KnitBundlingProductColorBundlingSummaryModel, KMS_R_KnitBundlingProductColorBundlingSummaryRequest, KMS_R_KnitBundlingProductColorBundlingSummaryResponse, KMS_R_KnitBundlingProductColorSizeJobGenQtyModel, KMS_R_KnitBundlingProductColorSizeKnitGroupJobGenQtyModel, KMS_R_KnitBundlingProductColorSizeQtyModel, KMS_R_KnitJobBundlingMapModel, KMS_R_KnitJobBundlingMapResponse, KMS_R_KnitOrderConfirmedBundleModel, MOC_OpRoutingSubProcessList, poBundlingDepMapModel, ProcessTypeEnum } from '@xpparel/shared-models';
import { DataSource, In, MoreThan } from 'typeorm';
import { PoBundlingDepMapRepository } from '../common/repository/po-bundling-dep-map.repository';
import { PoBundlingRepository } from '../common/repository/po-bundling.repo';
import { PoKnitGroupRepository } from '../common/repository/po-knit-group.repo';
import { PoKnitJobLineRepository } from '../common/repository/po-knit-job-line.repo';
import { PoKnitJobPlanRepository } from '../common/repository/po-knit-job-plan.repo';
import { PoKnitJobPslRepository } from '../common/repository/po-knit-job-psl.repo';
import { PoKnitJobRatioRepository } from '../common/repository/po-knit-job-ratio.repo';
import { PoKnitJobRepLogRepository } from '../common/repository/po-knit-job-rep-log.repo';
import { PoKnitJobSubLineRepository } from '../common/repository/po-knit-job-sub-line.repo';
import { PoKnitJobRepository } from '../common/repository/po-knit-job.repo';
import { PoProductRepository } from '../common/repository/po-product.repo';
import { PoSubLineBundleRepository } from '../common/repository/po-sub-line-bundle.repo';
import { PoSubLineRepository } from '../common/repository/po-sub-line.repo';
import { KnittingJobsReportingHelperService } from './knitting-job-rep-helper.service';

@Injectable()
export class KnittingOrderBundlingInfoService {

    constructor(
        private dataSource: DataSource,
        private knitJobPslRepo: PoKnitJobPslRepository,
        private knitJobRepLogRepo: PoKnitJobRepLogRepository,
        private poBundleRepo: PoSubLineBundleRepository,
        private knitGroupsRepo: PoKnitGroupRepository,
        private pslPropsRepo: PoSubLineRepository,
        private knitOrderProductRepo: PoProductRepository,
        private repHelperService: KnittingJobsReportingHelperService,
        private poBundlingRepo: PoBundlingRepository,
        private knitJobLineRepo: PoKnitJobLineRepository,
        private knitJobSubLineRepo: PoKnitJobSubLineRepository,
        private knitJobRepo: PoKnitJobRepository,
        private knitRatioRepo: PoKnitJobRatioRepository,
        private poProdRepo: PoProductRepository,
        private poBundlingDepMapRepository: PoBundlingDepMapRepository,
        private poKnitJobPlanRepository: PoKnitJobPlanRepository,
    ) {

    }

    // called from Knit Bundling UI directly
    // gets the knit order bundles for the given knit order + product + fg color
    async getKnitOrderBundlingSummaryForProductCodeAndColor(req: KMS_R_KnitBundlingProductColorBundlingSummaryRequest): Promise<KMS_R_KnitBundlingProductColorBundlingSummaryResponse> {
        const {companyCode, unitCode, procSerial, productCode, fgColor, iNeedInvMovedBundles, iNeedPlannedBundles, iNeedSizeWiseBundlesSummary} = req;
        const productRefRecs = await this.poProdRepo.find({select: ['productCode', 'productCode', 'processType', 'productRef'], where: { companyCode, unitCode, processingSerial: procSerial, productCode: productCode }});
        if(!productRefRecs) {
            throw new ErrorResponse(0, `No product refs found for the processing serial : ${procSerial} and product code : ${productCode}`);
        }
        const prodRefs: string[] = productRefRecs.map(r => r.productRef);
        const kgWiseRatios = await this.knitRatioRepo.getKgWiseColorSizeWiseTotalRatioForProcSerialProductRefAndColor(procSerial, prodRefs, [fgColor], unitCode, companyCode);
        if(kgWiseRatios.length == 0) {
            throw new ErrorResponse(0, `No ratios found for the processing serial : ${procSerial} and product code : ${productCode}`);
        }
        // get the PSL ids for the proc type and the prod ref
        const pslIdsForProdRefRecs = await this.pslPropsRepo.find({select: ['moProductSubLineId'], where: {companyCode: companyCode, unitCode: unitCode, productRef: prodRefs[0], fgColor: fgColor, processingSerial: procSerial}});
        const requiredPslIds = pslIdsForProdRefRecs.map(r => r.moProductSubLineId);
        // get all the knit groups
        const knitGroupsInfo = await this.repHelperService.getKnitSubProcessesForProcSerial(companyCode, unitCode, procSerial, ProcessTypeEnum.KNIT, productRefRecs[0].productCode, requiredPslIds, fgColor);
        const knitGroups: MOC_OpRoutingSubProcessList[] = [];
        knitGroupsInfo.subProcessList.forEach(s => knitGroups.push(s));
        if(knitGroups.length == 0) {
            throw new ErrorResponse(0, `No knit groups found for the processing serial : ${procSerial} and product code : ${productCode}. psl ids: ${requiredPslIds.toString()}`);
        }
        
        const kgModels: KMS_R_KnitBundlingProductColorSizeKnitGroupJobGenQtyModel[] = [];
        for(const kg of knitGroups) {
            const procJobs = await this.knitJobRepo.find({select: ['knitJobNumber', 'poKnitJobRatioId', 'groupCode', 'id', 'quantity'], where: {companyCode, unitCode, processingSerial: procSerial, processType: ProcessTypeEnum.KNIT, isActive: true, groupCode: kg.subProcessName }});
            const knitJobs = procJobs.map(r => r.knitJobNumber);
            const comps: string[] = kg.components.map(c => c.compName );
            const itemCodes: string[] = kg.bomList.map(c => c.bomItemCode );
            const csModels: KMS_R_KnitBundlingProductColorSizeJobGenQtyModel[] = [];
            if(knitJobs.length > 0) {
                const jobColSizeQtys = await this.knitJobSubLineRepo.getAccumulatedColSizeQtysForKnitJobNumbers(knitJobs, companyCode, unitCode);
                jobColSizeQtys.forEach(r => {
                    csModels.push(new KMS_R_KnitBundlingProductColorSizeJobGenQtyModel(r.size, r.qty));
                });
            }
            const m1 = new KMS_R_KnitBundlingProductColorSizeKnitGroupJobGenQtyModel(kg.subProcessName, comps, itemCodes, csModels);
            kgModels.push(m1);
            // console.log(kgModels);
        }
        
        const sbModels: KMS_R_KnitBundlingProductColorSizeQtyModel[]= []; 
        if(iNeedSizeWiseBundlesSummary) {
            // get all the bundles from the po bundle repo based on the psl ids
            const colSizeAccQtys = await this.poBundleRepo.getAccumulatedColSizeQtysForPslIdsAndProcSerial(procSerial, requiredPslIds, companyCode, unitCode);
            colSizeAccQtys.forEach(r => {
                sbModels.push(new KMS_R_KnitBundlingProductColorSizeQtyModel(r.size, r.qty, Number(r.total_bundles), Number(r.confirmed_bundles), Number(r.confirmed_qty)));
            });
            // console.log(sbModels);
        }
        const invBunModles: KMS_R_KnitOrderConfirmedBundleModel[] = [];
        // get the jobs for the proc serial
        if(iNeedInvMovedBundles) {
            const pslProps = await this.repHelperService.getPslProsForPslIds(companyCode, unitCode, requiredPslIds);
            const movedBundles = await this.poBundleRepo.find({select: ['moProductSubLineId', 'quantity', 'finalizedQuantity', 'bundleNumber', 'fgSku'], where: {companyCode, unitCode, moProductSubLineId: In(requiredPslIds), confirmationId: MoreThan(0)}});
            movedBundles.forEach(b => {
                const oslInfo = pslProps.get(b.moProductSubLineId);
                invBunModles.push(new KMS_R_KnitOrderConfirmedBundleModel(b.fgSku, b.moProductSubLineId, b.bundleNumber, b.bundleNumber, b.quantity, b.finalizedQuantity, oslInfo.fgColor, oslInfo.size));
            });
            // console.log(invBunModles);
        }
        const pbBunModles: KMS_R_KnitOrderConfirmedBundleModel[] = [];
        if(iNeedPlannedBundles) {
            const pslProps = await this.repHelperService.getPslProsForPslIds(companyCode, unitCode, requiredPslIds);
            const movedBundles = await this.poBundleRepo.find({select: ['moProductSubLineId', 'quantity', 'finalizedQuantity', 'bundleNumber', 'fgSku'], where: {companyCode, unitCode, moProductSubLineId: In(requiredPslIds)}});
            movedBundles.forEach(b => {
                const oslInfo = pslProps.get(b.moProductSubLineId);
                pbBunModles.push(new KMS_R_KnitOrderConfirmedBundleModel(b.fgSku, b.moProductSubLineId, b.bundleNumber, b.bundleNumber, b.quantity, b.finalizedQuantity, oslInfo.fgColor, oslInfo.size));
            });
            // console.log(pbBunModles);
        }
        const finalModel = new KMS_R_KnitBundlingProductColorBundlingSummaryModel(productCode, fgColor, kgModels, sbModels, invBunModles, pbBunModles);
        return new KMS_R_KnitBundlingProductColorBundlingSummaryResponse(true, 0, 'Bundling summary retrieved', finalModel);
    }


    async getPoBundlingDepMapForCoonfirmationIds(req: KMS_C_KnitOrderBundlingConfirmationIdRequest): Promise<KMS_R_KnitJobBundlingMapResponse> {
        const { companyCode, unitCode, confirmationId } = req;
        const poSubLineBundleData = await this.poBundleRepo.find({ select: ['bundleNumber', 'quantity'], where: { companyCode, unitCode, confirmationId } });

        if (poSubLineBundleData.length === 0) {
            throw new ErrorResponse(768, `No Bundles found for the confirmation id: ${confirmationId}`);
        }
        const knitJobBundlingModels: KMS_R_KnitJobBundlingMapModel[] = [];
        for (const bundle of poSubLineBundleData) {
            const depJobRecords = await this.poBundlingDepMapRepository.find({ select: ['subProcessName', 'jobNumber', 'quantity'], where: { companyCode, unitCode, depSerial: bundle.bundleNumber } });

            const depJobs: poBundlingDepMapModel[] = [];

            for (const record of depJobRecords) {
                const locationData = await this.poKnitJobPlanRepository.find({ select: ['locationCode'], where: { companyCode, unitCode, jobNumber: record.jobNumber } });

                const locationCode = locationData.length > 0 ? locationData[0].locationCode : '';

                const depJob = new poBundlingDepMapModel(record.subProcessName, locationCode, record.jobNumber, record.quantity?.toString() || '0');

                depJobs.push(depJob);
            }

            const bundlingModel = new KMS_R_KnitJobBundlingMapModel(bundle.bundleNumber, depJobs, bundle.quantity);

            knitJobBundlingModels.push(bundlingModel);
        }

        if(knitJobBundlingModels.length === 0) {
            throw new ErrorResponse(7689, `No Bundles found for the confirmation id: ${confirmationId}`);
        }
        return new KMS_R_KnitJobBundlingMapResponse(true, 0, 'Bundles and Dependent Jobs fetched successfully', knitJobBundlingModels);
    }



}

