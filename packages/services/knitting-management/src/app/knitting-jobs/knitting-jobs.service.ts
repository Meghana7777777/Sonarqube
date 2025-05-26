import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { KC_KnitRatioPoSerialRequest, GlobalResponseObject, ProcessingSerialProdCodeRequest, KC_KnitOrderJobsResponse, KC_KnitJobIdRequest, JobsGenStatusEnum, MC_ProductSubLineQtyModel, KC_KnitOrderJobsModel, KC_KnitJobModel, KC_ProductSku, KC_KnitJobColorSizeModel, KC_KnitJobRmModel, KC_KnitJobBarcodeModel, KC_KnitJobBarcodeFeatureModel, KC_KnitJobFeatures, ProcessTypeEnum, MOC_OpRoutingModel, TrimStatusEnum, KJ_MaterialStatusEnum, MOC_MoProductFabConsumptionModel, PhItemCategoryEnum, SewingJobPlanStatusEnum, KC_KnitJobConfStatusEnum, KC_KnitJobGenStatusEnum, SubLine, BomItemTypeEnum, ItemModel, ItemIdRequest, MOC_MoProductFabSizeCons, KnitJobObjectResponse, KnitJobNumberRequest, KnitJobConsumptionRequest, KnitJobSizeWiseConsumptionResponse, KnitIdsRequest, PoWhRequestDataResponse, PoWhRequestData, PoWhRequestLinesDataResponse, PoWhRequestLinesData, PoWhRequestMaterialData, PoWhRequestMaterialDataResponse, MoPslIdProcessTypeReq, MoOperationReportedQtyInfoResponse, MoOperationReportedQtyInfoModel } from '@xpparel/shared-models';
import { DataSource, In } from 'typeorm';
import { PoKnitJobRatioRepository } from '../common/repository/po-knit-job-ratio.repo';
import { PoKnitJobRatioLineRepository } from '../common/repository/po-knit-job-ratio-line.repo';
import { PoKnitJobRatioSubLineRepository } from '../common/repository/po-knit-job-ratio-sub-line.repo';
import { PoLineRepository } from '../common/repository/po-line.repo';
import { PoProductRepository } from '../common/repository/po-product.repo';
import { PoSubLineRepository } from '../common/repository/po-sub-line.repo';
import { ProcessingOrderRepository } from '../common/repository/processing-order.repo';
import { PoKnitJobRepository } from '../common/repository/po-knit-job.repo';
import { PoKnitJobLineRepository } from '../common/repository/po-knit-job-line.repo';
import { PoKnitJobSubLineRepository } from '../common/repository/po-knit-job-sub-line.repo';
import { PoKnitJobQtyRepository } from '../common/repository/po-knit-job-quantity.repo';
import { GenericTransactionManager } from '../../database/typeorm-transactions';
import { ErrorResponse } from '@xpparel/backend-utils';
import { PoKnitJobEntity } from '../common/entities/po-knit-job-entity';
import { PoKnitJobLineEntity } from '../common/entities/po-knit-job-line-entity';
import { PoKnitJobSubLineEntity } from '../common/entities/po-knit-job-sub-line-entity';
import { ProductSubLineFeaturesRepository } from '../common/repository/product-sub-line-features.repo';
import { PoJobPslMapRepository } from '../common/repository/po-job-psl-map.repo';
import { ProcessingOrderEntity } from '../common/entities/processing-order-entity';
import { PoKnitJobRatioEntity } from '../common/entities/po-knit-job-ratio-entity';
import { PoKnitJobRatioLineEntity } from '../common/entities/po-knit-job-ratio-line-entity';
import { PoProductEntity } from '../common/entities/po-product-entity';
import { PoKnitJobRatioSubLineEntity } from '../common/entities/po-knit-job-ratio-sub-line-entity';
import { PoJobPslMapEntity } from '../common/entities/po-job-psl-map-entity';
import { KnittingConfigurationService } from '../knitting-configuration/knitting-configuration.service';
import { PoKnitJobPlanRepository } from '../common/repository/po-knit-job-plan.repo';
import { PoKnitJobPlanEntity } from '../common/entities/po-knit-job-plan-entity';
import { PoKnitJobQtyEntity } from '../common/entities/po-knit-job-quantity-entity';
import { PoWhKnitJobMaterialEntity } from '../common/entities/po-wh-job-material-entity';
import { PoKnitJobPslEntity } from '../common/entities/po-knit-job-psl-entity';
import { ItemSharedService } from '@xpparel/shared-services';
import { PoWhKnitJobMaterialRepository } from '../common/repository/po-wh-knit-job-material.repo';
import { PoWhRequestLineRepository } from '../common/repository/po-wh-request-line.repo';
import { PoWhRequestRepository } from '../common/repository/po-wh-request.repo';
import { PoWhRequestMaterialItemRepository } from '../common/repository/po-wh-request-material-item.repo';

@Injectable()
export class KnittingJobsService {
    constructor(
        private dataSource: DataSource,
        private knitJobRatioRepo: PoKnitJobRatioRepository,
        private knitJobRatioLineRepo: PoKnitJobRatioLineRepository,
        private knitJobRatioSubLineRepo: PoKnitJobRatioSubLineRepository,
        private poRepo: ProcessingOrderRepository,
        private poLineRepo: PoLineRepository,
        private poSubLineRepo: PoSubLineRepository,
        private poProductRepo: PoProductRepository,
        private poKnitJobRepo: PoKnitJobRepository,
        private poKnitJobLineRepo: PoKnitJobLineRepository,
        private poKnitJobSubLineRepo: PoKnitJobSubLineRepository,
        private poKnitJobQuantityRepo: PoKnitJobQtyRepository,
        private poSubLineFeatures: ProductSubLineFeaturesRepository,
        private poSubLinePslMapRepo: PoJobPslMapRepository,
        @Inject(forwardRef(() => KnittingConfigurationService)) private knitConfigService: KnittingConfigurationService,
        private knitJobPlanRepo: PoKnitJobPlanRepository,
        private itemSharedService: ItemSharedService,
        private poWhKnitJobMaterialRepository: PoWhKnitJobMaterialRepository,
        private poWhRequestLineRepository: PoWhRequestLineRepository,
        private poWhRequestRepository: PoWhRequestRepository,
        private poWhRequestMaterialItemRepository: PoWhRequestMaterialItemRepository

    ) { }


    /**
     * Service to create Knitting Jobs for knitting group ratio
     * Step 1: Need to get the knit job ratio information for the given knit ratio id and po serial and process type using (PoKnitJobRatioRepository)
     * Step 2: Need to get the product code + fg Color + size  wise ratio details using (PoKnitJobRatioLineRepository, PoKnitJobRatioSubLineRepository)
     * Step 3: Need to get the maxJobQty , quantity for the above combination to generate the jobs based on below logic
     * Step 4: For every above combination we need to generate the jobs
     * Step 5: Where one job max quantity is maxJobQty for that combination up to the quantity for that combination (Job Number format is : groupCode + processingSerial + total existing jobs for that processingSerial + 1);
     * Step 6: Need to save the job details in the tables using (PoKnitJobRepository, PoKnitJobLineRepository, PoKnitJobSubLineRepository)
     * @param reqObj 
     * @param config 
     * @returns 
    */
    async createJobsForKnitGroupRatio(reqObj: KC_KnitRatioPoSerialRequest): Promise<GlobalResponseObject> {
        const { unitCode, companyCode, processType, processingSerial, username } = reqObj;
        const transactionalEntityManager: GenericTransactionManager = new GenericTransactionManager(this.dataSource);
        try {
            const jobsGenStatusInfo: ProcessingOrderEntity | null = await this.poRepo.findOne({ where: { processingSerial, processType, unitCode, companyCode, isActive: true }, select: ['jobsGenStatus', 'id'] });
            if (!jobsGenStatusInfo) {
                throw new ErrorResponse(0, 'Processing Order details not found. Please check and try again');
            }
            const knitJobRatio: PoKnitJobRatioEntity | null = await this.knitJobRatioRepo.findOne({ where: { id: reqObj.knitRatioId, processingSerial, processType, isActive: true }, select: ['id', 'groupCode', 'jobsGenStatus'] });
            if (!knitJobRatio) {
                throw new ErrorResponse(0, "Knit job ratio information not found");
            }
            if (knitJobRatio.jobsGenStatus !== KC_KnitJobGenStatusEnum.OPEN) {
                throw new ErrorResponse(0, 'Jobs generation Under progress, please wait and try again');
            }
            await this.knitJobRatioRepo.update({ id: reqObj.knitRatioId, unitCode, companyCode }, { jobsGenStatus: KC_KnitJobGenStatusEnum.IN_PROGRESS, updatedUser: reqObj.username });
            const groupCode: string = knitJobRatio.groupCode;
            const ratioLines: PoKnitJobRatioLineEntity[] = await this.knitJobRatioLineRepo.find({ where: { poKnitJobRatioId: knitJobRatio.id, unitCode, companyCode, isActive: true }, select: ['id', 'productRef'] });
            const existingJobs: number = await this.poKnitJobRepo.count({ where: { processingSerial, unitCode, companyCode, processType, isActive: true } });
            let bundleCounter: number = 0;
            await transactionalEntityManager.startTransaction();
            const productRefColorSizeWiseJobsMap = new Map<string, Map<string, Map<string, string[]>>>();
            for (const ratioLine of ratioLines) {
                const productDetails: PoProductEntity | null = await this.poProductRepo.findOne({ where: { productRef: ratioLine.productRef, unitCode, companyCode, processingSerial, processType, isActive: true }, select: ['productCode', 'productRef'] });
                if (!productDetails) continue;
                const subLines: PoKnitJobRatioSubLineEntity[] = await this.knitJobRatioSubLineRepo.find({ where: { poKnitJobRatioLineId: ratioLine.id, unitCode, companyCode, isActive: true } });
                let jobCounter: number = 0;
                for (const subLine of subLines) {
                    if (!productRefColorSizeWiseJobsMap.has(productDetails.productRef)) {
                        productRefColorSizeWiseJobsMap.set(productDetails.productRef, new Map<string, Map<string, string[]>>());
                    }
                    if (!productRefColorSizeWiseJobsMap.get(productDetails.productRef).has(subLine.fgColor)) {
                        productRefColorSizeWiseJobsMap.get(productDetails.productRef).set(subLine.fgColor, new Map<string, string[]>());
                    }
                    if (!productRefColorSizeWiseJobsMap.get(productDetails.productRef).get(subLine.fgColor).has(subLine.size)) {
                        productRefColorSizeWiseJobsMap.get(productDetails.productRef).get(subLine.fgColor).set(subLine.size, [])
                    }
                    let remainingQty: number = subLine.quantity;
                    const maxJobQty: number = subLine.maxJobQty;
                    while (remainingQty > 0) {
                        const jobQty: number = Math.min(maxJobQty, remainingQty);
                        jobCounter++;
                        const jobNumber: string = `${groupCode}-${processingSerial}-${existingJobs + 1}-${jobCounter}`;
                        remainingQty -= jobQty;
                        const knitJobEntity: PoKnitJobEntity = new PoKnitJobEntity();
                        Object.assign(knitJobEntity, { companyCode, createdUser: username, groupCode, knitJobNumber: jobNumber, poKnitJobRatioId: knitJobRatio.id, processType, processingSerial, unitCode, quantity: jobQty });
                        const knitJobDetails: PoKnitJobEntity = await transactionalEntityManager.getRepository(PoKnitJobEntity).save(knitJobEntity);
                        productRefColorSizeWiseJobsMap.get(productDetails.productRef).get(subLine.fgColor).get(subLine.size).push(knitJobDetails.knitJobNumber)
                        let knitJobLineEntity: PoKnitJobLineEntity = new PoKnitJobLineEntity();
                        Object.assign(knitJobLineEntity, { companyCode, createdUser: username, poKnitJobId: knitJobDetails.id, processType, processingSerial, unitCode, quantity: jobQty, knitJobNumber: jobNumber, groupCode });
                        knitJobLineEntity = await transactionalEntityManager.getRepository(PoKnitJobLineEntity).save(knitJobLineEntity);
                        let remainingBundleQty: number = jobQty;
                        while (remainingBundleQty > 0) {
                            const bundleQty: number = Math.min(remainingBundleQty, subLine.logicalBundleQty);
                            remainingBundleQty -= bundleQty;
                            const knitJobSubLineEntity: PoKnitJobSubLineEntity = new PoKnitJobSubLineEntity();
                            Object.assign(knitJobSubLineEntity, {
                                bundleNumber: `${groupCode}-${existingJobs + 1}-${bundleCounter++}`,
                                bundleSequence: bundleCounter,
                                companyCode,
                                createdUser: username,
                                fgColor: subLine.fgColor,
                                size: subLine.size,
                                quantity: bundleQty,
                                processType,
                                processingSerial,
                                productRef: ratioLine.productRef,
                                poKnitJobLineId: knitJobLineEntity.id,
                                unitCode: unitCode,
                                knitJobNumber: knitJobDetails.knitJobNumber,
                                groupCode: knitJobDetails.groupCode
                            });
                            const knitJobSubLineDetails: PoKnitJobSubLineEntity = await transactionalEntityManager.getRepository(PoKnitJobSubLineEntity).save(knitJobSubLineEntity);
                        }
                    }
                }
            }
            for (const [product, productDetails] of productRefColorSizeWiseJobsMap) {
                for (const [fgColor, colorDetails] of productDetails) {
                    for (const [size, jobs] of colorDetails) {
                        await this.assignProductSubLinesToBundles(jobs, unitCode, companyCode, groupCode, processingSerial, processType, username, reqObj.knitRatioId, transactionalEntityManager, product, fgColor, size);
                    }
                }
            }
            await transactionalEntityManager.completeTransaction();
            await this.knitJobRatioRepo.update({ id: reqObj.knitRatioId, unitCode, companyCode }, { jobsGenStatus: KC_KnitJobGenStatusEnum.COMPLETED, updatedUser: reqObj.username });
            return new GlobalResponseObject(true, 0, 'Jobs Generated Successfully for given Ratio');
        } catch (error) {
            await transactionalEntityManager.releaseTransaction();
            await this.knitJobRatioRepo.update({ id: reqObj.knitRatioId, unitCode, companyCode }, { jobsGenStatus: KC_KnitJobGenStatusEnum.OPEN, updatedUser: reqObj.username });
            throw error;
        }
    }

    /**
     * Helper service to mo product sub line ids to job bundles
     * @param knitJobNumbers 
     * @param unitCode 
     * @param companyCode 
     * @param groupCode 
     * @param processingSerial 
     * @param processType 
     * @param username 
     * @param knitRatioId 
     * @param transactionalEntityManager 
     * @param productRef 
     * @param fgColor 
     * @param size 
     * @returns 
    */
    async assignProductSubLinesToBundles(knitJobNumbers: string[], unitCode: string, companyCode: string, groupCode: string, processingSerial: number, processType: ProcessTypeEnum, username: string, knitRatioId: number, transactionalEntityManager: GenericTransactionManager, productRef: string, fgColor: string, size: string): Promise<boolean> {
        const jobBundles = await transactionalEntityManager.getRepository(PoKnitJobSubLineEntity).find({ where: { knitJobNumber: In(knitJobNumbers), unitCode, companyCode } });
        if (!jobBundles.length) {
            throw new ErrorResponse(0, 'Bundles Not found for the given jobs');
        }
        try {
            const productDetails: PoProductEntity | null = await this.poProductRepo.findOne({ where: { productRef: productRef, unitCode, companyCode, processingSerial, processType, isActive: true }, select: ['productCode', 'productRef'] });
            const availableQuantities = await this.getMoProductSubLineWiseAvailableQuantity(groupCode, processingSerial, productDetails.productCode, fgColor, size, 0, unitCode, companyCode);
            // console.log(availableQuantities);
            if (availableQuantities.length === 0) {
                throw new ErrorResponse(0, 'No available quantities found for job assignment');
            };
            const pslbOccupiedQtyMap = new Map<number, number>();
            const jobPslbMapObjects: PoKnitJobPslEntity[] = [];
            let totalBundledQty = 0;
            // console.log(jobBundles);
            for (const subLine of jobBundles) {
                let bundledQty = subLine.quantity;
                while (bundledQty > 0) {
                    for (let { moProductSubLineId, quantity } of availableQuantities) {
                        if (bundledQty <= 0) break;
                        const actAvailableQty = quantity - (pslbOccupiedQtyMap.get(moProductSubLineId) ? pslbOccupiedQtyMap.get(moProductSubLineId) : 0);
                        if (actAvailableQty == 0) {
                            continue;
                        }
                        const assignQty: number = Math.min(bundledQty, actAvailableQty);
                        if (assignQty > 0) {
                            quantity -= assignQty;
                            bundledQty -= assignQty;
                            if (!pslbOccupiedQtyMap.has(moProductSubLineId)) {
                                pslbOccupiedQtyMap.set(moProductSubLineId, 0);
                            }
                            const preQty = pslbOccupiedQtyMap.get(moProductSubLineId);
                            pslbOccupiedQtyMap.set(moProductSubLineId, preQty + Number(assignQty));
                            totalBundledQty += assignQty;
                            const poJobPslMapEntity: PoJobPslMapEntity = new PoJobPslMapEntity();
                            Object.assign(poJobPslMapEntity, {
                                moProductSubLineId,
                                poJobSubLineId: subLine.id,
                                quantity: assignQty,
                                companyCode,
                                unitCode,
                                processType,
                                processingSerial,
                                jobNumber: subLine.knitJobNumber,
                                groupCode: groupCode,
                                poKnitJobRatioId: knitRatioId,
                                productRef: productDetails.productRef,
                                bundleNumber: subLine.bundleNumber,
                                fgColor: subLine.fgColor,
                                size: subLine.size
                            });
                            await transactionalEntityManager.getRepository(PoJobPslMapEntity).save(poJobPslMapEntity, { reload: false });
                            const existingPslbObj = jobPslbMapObjects.find(job => job.jobNumber == subLine.knitJobNumber && job.moProductSubLineId == moProductSubLineId);
                            if (existingPslbObj) {
                                existingPslbObj.quantity += assignQty;
                            } else {
                                const jobPslEntity = new PoKnitJobPslEntity();
                                jobPslEntity.bundledQuantity = bundledQty;
                                jobPslEntity.companyCode = companyCode;
                                jobPslEntity.createdUser = username;
                                jobPslEntity.groupCode = groupCode;
                                jobPslEntity.jobNumber = subLine.knitJobNumber;
                                jobPslEntity.moProductSubLineId = moProductSubLineId;
                                jobPslEntity.processType = processType;
                                jobPslEntity.processingSerial = processingSerial;
                                jobPslEntity.quantity = assignQty;
                                jobPslEntity.rejQuantity = 0;
                                jobPslEntity.unitCode = unitCode;
                                jobPslbMapObjects.push(jobPslEntity);
                            }

                        }
                    }
                    if (bundledQty > 0) {
                        throw new ErrorResponse(0, 'No Sufficient product sub lines for the given bundle' + subLine.bundleNumber)
                    }
                }
            }
            await transactionalEntityManager.getRepository(PoKnitJobPslEntity).save(jobPslbMapObjects, { reload: false })
            return true;
        } catch (err) {
            throw err;
        }
    }


    /**
    * Service to create Knitting Jobs for knitting group ratio
    * 
    * @param reqObj 
    * @param config 
    * @returns 
   */
    async deleteJobsForKnitGroupRatio(reqObj: KC_KnitRatioPoSerialRequest): Promise<GlobalResponseObject> {
        const { unitCode, companyCode, processType, processingSerial, username, userId, knitRatioId } = reqObj;
        const transactionManager = new GenericTransactionManager(this.dataSource);
        let checkFlag = false;
        try {
            if (!processingSerial) {
                throw new ErrorResponse(0, 'Processing Serial is mandatory')
            }
            const jobsGenStatusInfo = await this.poRepo.findOne({ where: { processingSerial, processType, unitCode, companyCode, isActive: true }, select: ['jobsGenStatus', 'id'] });
            if (!jobsGenStatusInfo) {
                throw new ErrorResponse(0, 'Processing Order details not found. Please check and try again');
            }
            const knitJobRatio: PoKnitJobRatioEntity | null = await this.knitJobRatioRepo.findOne({ where: { id: reqObj.knitRatioId, processingSerial, processType, isActive: true }, select: ['id', 'groupCode', 'jobsGenStatus'] });
            if (!knitJobRatio) {
                throw new ErrorResponse(0, "Knit job ratio information not found");
            }
            if (knitJobRatio.jobsGenStatus !== KC_KnitJobGenStatusEnum.COMPLETED) {
                throw new ErrorResponse(0, 'Jobs generation or deletion Under progress, please wait and try again');
            }
            await this.knitJobRatioRepo.update({ id: reqObj.knitRatioId, unitCode, companyCode }, { jobsGenStatus: KC_KnitJobGenStatusEnum.IN_PROGRESS, updatedUser: reqObj.username });
            checkFlag = true;
            // Retrieve all jobs related to the given processing serial
            const knitJobs = await this.poKnitJobRepo.find({ where: { processingSerial, unitCode, companyCode, processType, isActive: true, poKnitJobRatioId: knitRatioId }, select: ['id'] });
            if (!knitJobs.length) {
                throw new ErrorResponse(0, 'No jobs found to delete');
            };
            const confirmedKnitJobs = await this.poKnitJobRepo.find({ where: { processingSerial, unitCode, companyCode, processType, isActive: true, isConfirmed: true, poKnitJobRatioId: knitRatioId }, select: ['id'] });
            if (confirmedKnitJobs.length) {
                throw new ErrorResponse(0, 'Some Knit Jobs already confirmed. You cannot delete the knit jobs')
            }
            const knitJobIds = knitJobs.map(job => job.id);
            const knitJobLines = await this.poKnitJobLineRepo.find({ where: { poKnitJobId: In(knitJobIds), unitCode, companyCode, isActive: true }, select: ['id', 'knitJobNumber'] });
            const knitJobLineIds = knitJobLines.map(job => job.id);
            const knitJobNumbers = knitJobLines.map(job => job.knitJobNumber);
            // Delete sub-lines first
            await transactionManager.startTransaction();
            await transactionManager.getRepository(PoKnitJobSubLineEntity).delete({ poKnitJobLineId: In(knitJobLineIds), unitCode, companyCode, isActive: true });
            // Delete job lines
            await transactionManager.getRepository(PoKnitJobLineEntity).delete({ poKnitJobId: In(knitJobIds), unitCode, companyCode, isActive: true });
            // Delete jobs
            await transactionManager.getRepository(PoKnitJobEntity).delete({ id: In(knitJobIds), unitCode, companyCode, isActive: true });
            await transactionManager.getRepository(PoKnitJobPslEntity).delete({ jobNumber: In(knitJobNumbers), unitCode, companyCode, isActive: true });
            await transactionManager.getRepository(PoJobPslMapEntity).delete({ jobNumber: In(knitJobNumbers), unitCode, companyCode, isActive: true });
            await transactionManager.completeTransaction();
            await this.knitJobRatioRepo.update({ id: reqObj.knitRatioId, unitCode, companyCode }, { jobsGenStatus: KC_KnitJobGenStatusEnum.OPEN, updatedUser: reqObj.username });
            return new GlobalResponseObject(true, 0, 'Jobs deleted successfully');
        } catch (error) {
            await transactionManager.releaseTransaction();
            checkFlag ? await this.knitJobRatioRepo.update({ id: reqObj.knitRatioId, unitCode, companyCode }, { jobsGenStatus: KC_KnitJobGenStatusEnum.COMPLETED, updatedUser: reqObj.username }) : null;
            throw error;
        }
    };


    /**
     * Service to create knit jobs by PO and product code
     * @param reqObj 
     * @param config 
     * @returns 
     */
    async getKnitJobsByPoAndProductCode(reqObj: ProcessingSerialProdCodeRequest): Promise<KC_KnitOrderJobsResponse> {
        const { unitCode, companyCode, processType, processingSerial, username, userId, productCode } = reqObj;
        const knitOrderJobsInfo: KC_KnitOrderJobsModel[] = [];
        const product = await this.poProductRepo.findOne({ where: { processingSerial, productCode, processType, unitCode, companyCode, }, select: ['productRef', 'productCode', 'productType', 'productName'] });
        if (!product) {
            throw new ErrorResponse(0, 'Product code not found for the given Po. Please check and try again');
        }
        const knitGroupWiseDetailModel = new Map<string, KC_KnitJobModel[]>();
        const productKnitGroupInfo = new Map<string, Map<string, MOC_OpRoutingModel>>();
        const knitJobsInfo = await this.poKnitJobRepo.find({ where: { processingSerial, processType, unitCode, companyCode, isActive: true } });
        const prodCompSet = new Map<string, number[]>();
        for (const eachKnitJob of knitJobsInfo) {
            let fgColor = reqObj.fgColor ?? null;
            const colorSizeModel: KC_KnitJobColorSizeModel[] = [];
            const kniJobBarcodeModel: KC_KnitJobBarcodeModel[] = [];
            let subLineCheck = false;
            const knitJobLineInfo = await this.poKnitJobLineRepo.find({ where: { poKnitJobId: eachKnitJob.id, processingSerial, processType, unitCode, companyCode, isActive: true } });
            for (const eachKnitJobLine of knitJobLineInfo) {
                const knitJobSubLineInfo = await this.poKnitJobSubLineRepo.find({ where: { poKnitJobLineId: eachKnitJobLine.id, unitCode, companyCode, processingSerial, processType, isActive: true, productRef: product.productRef, fgColor: fgColor } });
                if (knitJobSubLineInfo.length > 0) {
                    subLineCheck = true;
                }
                for (const eachJobSubLine of knitJobSubLineInfo) {
                    fgColor = eachJobSubLine.fgColor;
                    const moProductSubLineIds = new Set<number>();
                    const fgColorObj = colorSizeModel.find(colorSize => colorSize.fgColor == eachJobSubLine.fgColor);
                    if (!fgColorObj) {
                        const fgColorDetails = new KC_KnitJobColorSizeModel(eachJobSubLine.fgColor, []);
                        colorSizeModel.push(fgColorDetails);
                    };
                    const fgColorActualObj = colorSizeModel.find(colorSize => colorSize.fgColor == eachJobSubLine.fgColor);
                    const fgColorSizeActObj = fgColorActualObj.sizeQtys.find(size => size.size == eachJobSubLine.size);
                    if (fgColorSizeActObj) {
                        fgColorSizeActObj.qty += eachJobSubLine.quantity;
                    } else {
                        fgColorActualObj.sizeQtys.push({
                            size: eachJobSubLine.size,
                            qty: eachJobSubLine.quantity
                        });
                    }
                    if (reqObj.iNeedBarcodeDetails) {
                        const knitJobBarcodeFeature = await this.getFeaturesForGivenBarcode(eachJobSubLine.bundleNumber, processingSerial, processType, unitCode, companyCode);
                        const knitJobBarcode = new KC_KnitJobBarcodeModel(eachKnitJob.knitJobNumber, eachJobSubLine.bundleNumber, eachJobSubLine.fgColor, eachJobSubLine.size, eachJobSubLine.quantity, eachJobSubLine.bundleNumber, knitJobBarcodeFeature);
                        kniJobBarcodeModel.push(knitJobBarcode);
                    }
                    const prodComp = `${product.productCode}&&${eachJobSubLine.fgColor}`;
                    if (!prodCompSet.has(prodComp)) {
                        prodCompSet.set(prodComp, []);
                    }
                    // if (reqObj.iNeedJobFeatures) {
                    const moProductSubLineMap = await this.poSubLinePslMapRepo.find({ where: { poJobSubLineId: eachJobSubLine.id, unitCode, companyCode, isActive: true }, select: ['moProductSubLineId'] });
                    for (const eachMoProductSubLine of moProductSubLineMap) {
                        moProductSubLineIds.add(eachMoProductSubLine.moProductSubLineId);
                    };
                    prodCompSet.get(prodComp).push(...Array.from(moProductSubLineIds));
                    // }

                }
            }
            if (subLineCheck) {
                let knitJobFeatures: KC_KnitJobFeatures = null;
                const knitJobRm: KC_KnitJobRmModel[] = []
                if (!knitGroupWiseDetailModel.has(eachKnitJob.groupCode)) {
                    knitGroupWiseDetailModel.set(eachKnitJob.groupCode, []);
                }
                if (reqObj.iNeedJobFeatures) {
                    knitJobFeatures = await this.getFeaturesForGivenJobNumber(eachKnitJob.knitJobNumber, processingSerial, processType, unitCode, companyCode);
                }
                if (reqObj.iNeedRmDetails && subLineCheck) {
                    for (const [eachProdComp, moProductSubLineIds] of prodCompSet) {
                        const prodSplit = eachProdComp.split('&&');
                        const productCode = prodSplit[0];
                        const fgColor = prodSplit[1];
                        if (!productKnitGroupInfo.has(productCode)) {
                            productKnitGroupInfo.set(productCode, new Map<string, MOC_OpRoutingModel>());
                        }
                        if (!productKnitGroupInfo.get(productCode).has(fgColor)) {
                            const routingDetails = await this.knitConfigService.getKnitGroupInfoForMOProductCodeAndFgColor(processType, moProductSubLineIds, productCode, fgColor, unitCode, companyCode);
                            productKnitGroupInfo.get(productCode).set(fgColor, routingDetails);
                        }
                    };
                    const knitGroupInfo = productKnitGroupInfo.get(productCode).get(fgColor);
                    const itemCodesOfJob = new Set<string>();
                    const componentsOfJob = new Set<string>();
                    // for (const [prodCode, prodInfo] of knitGroupInfo) {
                    // for (const [fgColor, routingInfo] of prodInfo) {
                    for (const eachProcessType of knitGroupInfo.processTypesList) {
                        for (const eachSubProcess of eachProcessType.subProcessList) {
                            if (eachSubProcess.subProcessName == eachKnitJob.groupCode) {
                                for (const eachComp of eachSubProcess.components) {
                                    componentsOfJob.add(eachComp.compName)
                                }
                                for (const eachBom of eachSubProcess.bomList) {
                                    itemCodesOfJob.add(eachBom.bomItemCode);
                                    knitJobRm.push(new KC_KnitJobRmModel(eachBom.bomItemCode, eachBom.bomItemDesc, eachBom.bomItemDesc, eachBom.itemType, Array.from(componentsOfJob)))
                                }
                            }
                        }
                    }
                }
                const productSpecs = new KC_ProductSku(product.productRef, product.productName, product.productType, product.productCode);
                let materialStatus: KJ_MaterialStatusEnum = null;
                if (reqObj.iNeedRmDetails) {
                    const rawMaterialStatus = await this.getRmAndBomStatusForJobNumber(eachKnitJob.knitJobNumber, processingSerial, processType, unitCode, companyCode);
                    materialStatus = rawMaterialStatus.rawMaterialStatus;
                }
                const jobPlanDetails = await this.knitJobPlanRepo.findOne({ where: { jobNumber: eachKnitJob.knitJobNumber, unitCode, companyCode } });
                let isPlanned = false
                if (jobPlanDetails && jobPlanDetails.locationCode) {
                    isPlanned = true
                }
                const knitOrderJobObj = new KC_KnitJobModel(eachKnitJob.groupCode, eachKnitJob.knitJobNumber, eachKnitJob.quantity, productSpecs, processingSerial, colorSizeModel, kniJobBarcodeModel, knitJobFeatures, null, materialStatus, knitJobRm, isPlanned);
                knitGroupWiseDetailModel.get(eachKnitJob.groupCode).push(knitOrderJobObj);
            }
        }
        for (const [groupCode, groupDetail] of knitGroupWiseDetailModel) {
            const knitGroupInfo = new KC_KnitOrderJobsModel(groupCode, groupDetail);
            knitOrderJobsInfo.push(knitGroupInfo);
        }
        return new KC_KnitOrderJobsResponse(true, 0, 'Knit Jobs Information Retrieved Successfully for Given Po and Product Code', knitOrderJobsInfo);
    }

    /**
     * Service to get Features of the given barcode
     * Helper function 
     * @param bundleNumber 
     * @param processingSerial 
     * @param processingType 
     * @param unitCode 
     * @param companyCode 
     * @returns 
    */
    async getFeaturesForGivenBarcode(bundleNumber: string, processingSerial: number, processingType: ProcessTypeEnum, unitCode: string, companyCode: string): Promise<KC_KnitJobBarcodeFeatureModel> {
        const barcodeDetails = await this.poSubLinePslMapRepo.find({ where: { bundleNumber: bundleNumber, unitCode, companyCode, isActive: true } });
        if (!barcodeDetails.length) {
            throw new ErrorResponse(0, 'Barcode Details not found for the given barcode. Please check and try again')
        }
        const moProductSubLineIdsForBarcode = new Set<number>();
        barcodeDetails.forEach((eachLine) => {
            moProductSubLineIdsForBarcode.add(eachLine.moProductSubLineId);
        });
        // console.log(moProductSubLineIdsForBarcode);
        // console.log(processingSerial, processingType, unitCode, companyCode)
        const featuresOfSubLine = await this.poSubLineFeatures.getFeaturesForGivenMoSubLineIds(Array.from(moProductSubLineIdsForBarcode), processingSerial, processingType, unitCode, companyCode);
        // console.log(featuresOfSubLine);
        return new KC_KnitJobBarcodeFeatureModel(featuresOfSubLine.moNumber, featuresOfSubLine.moLineNumber, featuresOfSubLine.moOrderSubLineNumber, featuresOfSubLine.coNumber, featuresOfSubLine.styleName, featuresOfSubLine.styleDescription, featuresOfSubLine.exFactoryDate, featuresOfSubLine.schedule, featuresOfSubLine.zFeature, featuresOfSubLine.styleCode, featuresOfSubLine.customerName);
    }


    /**
     * Service to get Features of the given knit job number
     * Helper function 
     * @param bundleNumber 
     * @param processingSerial 
     * @param processingType 
     * @param unitCode 
     * @param companyCode 
     * @returns 
    */
    async getFeaturesForGivenJobNumber(jobNumber: string, processingSerial: number, processingType: ProcessTypeEnum, unitCode: string, companyCode: string): Promise<KC_KnitJobFeatures> {
        const barcodeDetails = await this.poSubLinePslMapRepo.find({ where: { jobNumber: jobNumber, unitCode, companyCode, isActive: true } });
        if (!barcodeDetails.length) {
            throw new ErrorResponse(0, 'Barcode Details not found for the given barcode. Please check and try again')
        }
        const moProductSubLineIdsForBarcode = new Set<number>();
        barcodeDetails.forEach((eachLine) => {
            moProductSubLineIdsForBarcode.add(eachLine.moProductSubLineId);
        });
        const featuresOfSubLine = await this.poSubLineFeatures.getFeaturesForGivenMoSubLineIds(Array.from(moProductSubLineIdsForBarcode), processingSerial, processingType, unitCode, companyCode);
        return new KC_KnitJobFeatures(featuresOfSubLine.moNumber, featuresOfSubLine.moLineNumber, featuresOfSubLine.moOrderSubLineNumber, featuresOfSubLine.coNumber, featuresOfSubLine.styleName, featuresOfSubLine.styleDescription, featuresOfSubLine.exFactoryDate, featuresOfSubLine.schedule, featuresOfSubLine.zFeature, featuresOfSubLine.styleCode, featuresOfSubLine.customerName);
    }


    /**
    * Service to get the jobs details for given knit job id
    * @param reqObj 
    * @param config 
    * @returns 
   */
    async getKnitJobDetailsForKnitJobId(reqObj: KC_KnitJobIdRequest): Promise<KC_KnitOrderJobsResponse> {
        const { unitCode, companyCode, username, userId, knitJobNumber } = reqObj;
        const knitOrderJobsInfo: KC_KnitOrderJobsModel[] = [];
        const knitGroupWiseDetailModel = new Map<string, KC_KnitJobModel[]>();
        const productKnitGroupInfo = new Map<string, Map<string, MOC_OpRoutingModel>>();
        const knitJobsInfo = await this.poKnitJobRepo.find({ where: { unitCode, companyCode, isActive: true, knitJobNumber } });
        if (!knitJobsInfo) {
            throw new ErrorResponse(0, 'Knit job info not found');
        }
        const processingSerial = knitJobsInfo[0].processingSerial;
        const processType = knitJobsInfo[0].processType;
        const prodCompSet = new Map<string, number[]>();
        for (const eachKnitJob of knitJobsInfo) {
            const colorSizeModel: KC_KnitJobColorSizeModel[] = [];
            const kniJobBarcodeModel: KC_KnitJobBarcodeModel[] = [];
            let productSpecs = null;
            let subLineCheck = false;
            const knitJobLineInfo = await this.poKnitJobLineRepo.find({ where: { poKnitJobId: eachKnitJob.id, processingSerial, processType, unitCode, companyCode, isActive: true } });
            for (const eachKnitJobLine of knitJobLineInfo) {
                const knitJobSubLineInfo = await this.poKnitJobSubLineRepo.find({ where: { poKnitJobLineId: eachKnitJobLine.id, unitCode, companyCode, processingSerial, processType, isActive: true } });
                if (knitJobSubLineInfo.length > 0) {
                    subLineCheck = true;
                }
                for (const eachJobSubLine of knitJobSubLineInfo) {
                    const product = await this.poProductRepo.findOne({ where: { processingSerial, processType, unitCode, companyCode, productRef: eachJobSubLine.productRef } })
                    const moProductSubLineIds = new Set<number>();
                    const fgColorObj = colorSizeModel.find(colorSize => colorSize.fgColor == eachJobSubLine.fgColor);
                    if (!fgColorObj) {
                        const fgColorDetails = new KC_KnitJobColorSizeModel(eachJobSubLine.fgColor, []);
                        colorSizeModel.push(fgColorDetails);
                    };
                    const fgColorActualObj = colorSizeModel.find(colorSize => colorSize.fgColor == eachJobSubLine.fgColor);
                    const fgColorSizeActObj = fgColorActualObj.sizeQtys.find(size => size.size == eachJobSubLine.size);
                    if (fgColorSizeActObj) {
                        fgColorSizeActObj.qty += eachJobSubLine.quantity;
                    } else {
                        fgColorActualObj.sizeQtys.push({
                            size: eachJobSubLine.size,
                            qty: eachJobSubLine.quantity
                        });
                    }
                    if (reqObj.iNeedBarcodeDetails) {
                        const knitJobBarcodeFeature = await this.getFeaturesForGivenBarcode(eachJobSubLine.bundleNumber, processingSerial, processType, unitCode, companyCode);
                        const knitJobBarcode = new KC_KnitJobBarcodeModel(eachKnitJob.knitJobNumber, eachJobSubLine.bundleNumber, eachJobSubLine.fgColor, eachJobSubLine.size, eachJobSubLine.quantity, eachJobSubLine.bundleNumber, knitJobBarcodeFeature);
                        kniJobBarcodeModel.push(knitJobBarcode);
                    }
                    const prodComp = `${product.productCode}&&${eachJobSubLine.fgColor}`;
                    if (!prodCompSet.has(prodComp)) {
                        prodCompSet.set(prodComp, []);
                    }
                    // if (reqObj.iNeedJobFeatures) {
                    const moProductSubLineMap = await this.poSubLinePslMapRepo.find({ where: { poJobSubLineId: eachJobSubLine.id, unitCode, companyCode, isActive: true }, select: ['moProductSubLineId'] });
                    for (const eachMoProductSubLine of moProductSubLineMap) {
                        moProductSubLineIds.add(eachMoProductSubLine.moProductSubLineId);
                    };
                    productSpecs = new KC_ProductSku(product.productRef, product.productName, product.productType, product.productCode);
                    prodCompSet.get(prodComp).push(...Array.from(moProductSubLineIds));
                    // }

                }
            }
            let knitJobFeatures: KC_KnitJobFeatures = null;
            const knitJobRm: KC_KnitJobRmModel[] = []
            if (!knitGroupWiseDetailModel.has(eachKnitJob.groupCode)) {
                knitGroupWiseDetailModel.set(eachKnitJob.groupCode, []);
            }
            if (reqObj.iNeedJobFeatures) {
                knitJobFeatures = await this.getFeaturesForGivenJobNumber(eachKnitJob.knitJobNumber, processingSerial, processType, unitCode, companyCode);
            }
            if (reqObj.iNeedRmDetails && subLineCheck) {
                for (const [eachProdComp, moProductSubLineIds] of prodCompSet) {
                    const prodSplit = eachProdComp.split('&&');
                    const productCode = prodSplit[0];
                    const fgColor = prodSplit[1];
                    const routingDetails = await this.knitConfigService.getKnitGroupInfoForMOProductCodeAndFgColor(processType, moProductSubLineIds, productCode, fgColor, unitCode, companyCode);
                    if (!productKnitGroupInfo.has(productCode)) {
                        productKnitGroupInfo.set(productCode, new Map<string, MOC_OpRoutingModel>());
                    }
                    if (!productKnitGroupInfo.get(productCode).has(fgColor)) {
                        productKnitGroupInfo.get(productCode).set(fgColor, routingDetails);
                    }
                }
                const itemCodesOfJob = new Set<string>();
                const componentsOfJob = new Set<string>();
                for (const [prodCode, prodInfo] of productKnitGroupInfo) {
                    for (const [fgColor, routingInfo] of prodInfo) {
                        for (const eachProcessType of routingInfo.processTypesList) {
                            for (const eachSubProcess of eachProcessType.subProcessList) {
                                if (eachSubProcess.subProcessName == eachKnitJob.groupCode) {
                                    for (const eachComp of eachSubProcess.components) {
                                        componentsOfJob.add(eachComp.compName)
                                    }
                                    for (const eachBom of eachSubProcess.bomList) {
                                        itemCodesOfJob.add(eachBom.bomItemCode);
                                        knitJobRm.push(new KC_KnitJobRmModel(eachBom.bomItemCode, eachBom.bomItemDesc, eachBom.bomItemDesc, eachBom.itemType, Array.from(componentsOfJob)))
                                    }
                                }
                            }
                        }

                    }
                }
            }
            let materialStatus: KJ_MaterialStatusEnum = null;
            if (reqObj.iNeedRmDetails) {
                const rawMaterialStatus = await this.getRmAndBomStatusForJobNumber(eachKnitJob.knitJobNumber, processingSerial, processType, unitCode, companyCode);
                materialStatus = rawMaterialStatus.rawMaterialStatus;
            };
            const jobPlanDetails = await this.knitJobPlanRepo.findOne({ where: { jobNumber: eachKnitJob.knitJobNumber, unitCode, companyCode } });
            // if (!jobPlanDetails) {
            //     throw new ErrorResponse(0, 'Job plan details not found for the job ' + eachKnitJob.knitJobNumber);
            // }
            let isPlanned = false
            if (jobPlanDetails && jobPlanDetails.locationCode) {
                isPlanned = true
            }
            const knitOrderJobObj = new KC_KnitJobModel(eachKnitJob.groupCode, eachKnitJob.knitJobNumber, eachKnitJob.quantity, productSpecs, processingSerial, colorSizeModel, kniJobBarcodeModel, knitJobFeatures, null, materialStatus, knitJobRm, isPlanned);
            knitGroupWiseDetailModel.get(eachKnitJob.groupCode).push(knitOrderJobObj);
        }
        for (const [groupCode, groupDetail] of knitGroupWiseDetailModel) {
            const knitGroupInfo = new KC_KnitOrderJobsModel(groupCode, groupDetail);
            knitOrderJobsInfo.push(knitGroupInfo);
        }
        return new KC_KnitOrderJobsResponse(true, 0, 'Knit Jobs Information Retrieved Successfully for Given Po and Product Code', knitOrderJobsInfo);
    }

    /**
     * TODO : need to implement item related things from Master  -- DONE
    * Service to create Knitting Jobs for knitting group ratio
    * Usually calls from UI
    * Once user confirms the jobs for a knit group , Need to update the confirmation status to true and need to populate rows in the po_knit_job_plan , po_knit_job_qty
    * @param reqObj 
    * @param config 
    * @returns 
   */
    async confirmJobsForPoAndProduct(reqObj: ProcessingSerialProdCodeRequest): Promise<GlobalResponseObject> {
        const manager = new GenericTransactionManager(this.dataSource);
        try {
            const { unitCode, companyCode, processType, processingSerial, username, userId, productCode, fgColor } = reqObj;
            const product = await this.poProductRepo.findOne({ where: { processingSerial, productCode, processType, unitCode, companyCode }, select: ['productRef', 'productCode'] });
            if (!product) {
                throw new ErrorResponse(0, 'Product code not found for the given Po. Please check and try again');
            };
            let priority = 0;
            const knitJobsInfo = await this.poKnitJobRepo.find({ where: { processingSerial, processType, unitCode, companyCode, isActive: true, isConfirmed: false } });
            if (!knitJobsInfo.length) {
                throw new ErrorResponse(0, 'No Knit jobs found to confirm . Please check and try again')
            }
            const ratioIds = knitJobsInfo.map(ratio => ratio.poKnitJobRatioId);
            await this.knitJobRatioRepo.update({ id: In(ratioIds) }, { jobsConfirmStatus: KC_KnitJobConfStatusEnum.IN_PROGRESS });
            const consumptionDetailsForProductAndFgColor = new Map<string, Map<string, MOC_MoProductFabSizeCons[]>>();
            await manager.startTransaction();
            const uniqueItemCodes = new Map<string, ItemModel>();
            for (const eachKnitJob of knitJobsInfo) {
                let subLineCheck = false;
                const sizesInvolved = new Set<string>();
                const knitJobLineInfo = await this.poKnitJobLineRepo.find({ where: { poKnitJobId: eachKnitJob.id, processingSerial, processType, unitCode, companyCode, isActive: true } });
                for (const eachKnitJobLine of knitJobLineInfo) {
                    const knitJobSubLineInfo = await this.poKnitJobSubLineRepo.find({ where: { poKnitJobLineId: eachKnitJobLine.id, unitCode, companyCode, processingSerial, processType, isActive: true, productRef: product.productRef, fgColor } });
                    if (knitJobSubLineInfo.length == 0) {
                        throw new ErrorResponse(0, 'No Knit jobs found to confirm. Please check and try again')
                    };
                    for (const eachSubLine of knitJobSubLineInfo) {
                        sizesInvolved.add(eachSubLine.size);
                    };

                    if (!consumptionDetailsForProductAndFgColor.has(product.productCode)) {
                        consumptionDetailsForProductAndFgColor.set(product.productCode, new Map<string, MOC_MoProductFabSizeCons[]>());
                    }
                    if (!consumptionDetailsForProductAndFgColor.get(product.productCode).has(fgColor)) {
                        const itemCodeWiseConsumptionDetails = await this.getItemAndComponentWiseConsumptionForJobNumber(eachKnitJob.knitJobNumber, processingSerial, processType, unitCode, companyCode, product.productCode, fgColor, eachKnitJob.groupCode);
                        consumptionDetailsForProductAndFgColor.get(product.productCode).set(fgColor, itemCodeWiseConsumptionDetails);
                    }
                    const consumptionDetailsOfProducts = consumptionDetailsForProductAndFgColor.get(product.productCode).get(fgColor);
                    let requiredWeight = 0;
                    const itemCodesInvolved = new Set<string>();
                    consumptionDetailsOfProducts.forEach((consumptionDetailsOfProduct) => {
                        // consumptionDetailsOfProduct.fabCons.forEach((eachItem) => {
                        itemCodesInvolved.add(consumptionDetailsOfProduct.itemCode);
                        for (const eachSize of consumptionDetailsOfProduct.sizeCons) {
                            if (sizesInvolved.has(eachSize.size)) {
                                requiredWeight = requiredWeight + Number(eachSize.cons);
                            }

                        }
                        // });
                    })

                    for (const eachItemCode of itemCodesInvolved) {
                        let eachItemData: ItemModel = null;
                        if (uniqueItemCodes.has(eachItemCode)) {
                            eachItemData = uniqueItemCodes.get(eachItemCode);
                        }
                        else {
                            const req = new ItemIdRequest(reqObj.username, reqObj.unitCode, reqObj.companyCode, reqObj.userId, null, null, eachItemCode);
                            const itemData = await this.itemSharedService.getBomItemByItemCode(req);
                            if (!itemData.status) {
                                throw new ErrorResponse(itemData.errorCode, itemData.internalMessage)
                            }
                            uniqueItemCodes.set(eachItemCode, itemData?.data[0]);
                            eachItemData = itemData?.data[0];
                        }
                        const knitJobMaterialReq = new PoWhKnitJobMaterialEntity()
                        knitJobMaterialReq.companyCode = companyCode;
                        knitJobMaterialReq.createdUser = username;
                        knitJobMaterialReq.groupCode = eachKnitJob.groupCode;
                        knitJobMaterialReq.itemCode = eachItemCode;
                        knitJobMaterialReq.itemColor = eachItemData?.itemColor;
                        knitJobMaterialReq.itemDescription = eachItemData?.itemDescription;
                        knitJobMaterialReq.itemName = eachItemData?.itemName;
                        knitJobMaterialReq.itemType = PhItemCategoryEnum.FABRIC;
                        knitJobMaterialReq.jobNumber = eachKnitJob.knitJobNumber;
                        knitJobMaterialReq.processType = processType;
                        knitJobMaterialReq.processingSerial = processingSerial;
                        knitJobMaterialReq.unitCode = unitCode;
                        knitJobMaterialReq.requiredQty = requiredWeight * eachKnitJobLine.quantity;
                        knitJobMaterialReq.allocatedQty = 0;
                        knitJobMaterialReq.reportedWeight = 0;
                        knitJobMaterialReq.issuedQty = 0;
                        await manager.getRepository(PoWhKnitJobMaterialEntity).save(knitJobMaterialReq);
                    }
                    const knitJobPlan = new PoKnitJobPlanEntity();
                    knitJobPlan.companyCode = companyCode;
                    knitJobPlan.createdUser = username;
                    knitJobPlan.jobNumber = eachKnitJob.knitJobNumber;
                    knitJobPlan.jobPriority = priority++;
                    knitJobPlan.locationCode = null;
                    knitJobPlan.planInputDate = null;
                    knitJobPlan.processType = processType;
                    knitJobPlan.processingSerial = processingSerial;
                    knitJobPlan.unitCode = unitCode;
                    knitJobPlan.status = SewingJobPlanStatusEnum.OPEN;
                    await manager.getRepository(PoKnitJobPlanEntity).save(knitJobPlan, { reload: false });

                    const knitJobQtyEntity = new PoKnitJobQtyEntity();
                    knitJobQtyEntity.companyCode = companyCode;
                    knitJobQtyEntity.createdUser = username;
                    knitJobQtyEntity.goodQty = 0;
                    knitJobQtyEntity.inputQty = eachKnitJobLine.quantity;
                    knitJobQtyEntity.jobNumber = eachKnitJob.knitJobNumber;
                    knitJobQtyEntity.originalQty = eachKnitJobLine.quantity;
                    knitJobQtyEntity.originalWeight = requiredWeight * eachKnitJobLine.quantity;
                    knitJobQtyEntity.rejectedQty = 0;
                    knitJobQtyEntity.unitCode = unitCode;
                    knitJobQtyEntity.processingSerial = processingSerial;
                    knitJobQtyEntity.processType = processType;
                    knitJobQtyEntity.rejectedQty = 0;
                    knitJobQtyEntity.goodQty = 0;
                    knitJobQtyEntity.reportedWeight = 0;
                    await manager.getRepository(PoKnitJobQtyEntity).save(knitJobQtyEntity, { reload: false });
                }
                await manager.getRepository(PoKnitJobEntity).update({ id: eachKnitJob.id, unitCode, companyCode }, { isConfirmed: true, updatedUser: username })
            }
            await manager.completeTransaction();
            await this.knitJobRatioRepo.update({ id: In(ratioIds) }, { jobsConfirmStatus: KC_KnitJobConfStatusEnum.COMPLETED });
            return new GlobalResponseObject(true, 0, 'Jobs Confirmed Successfully.')
        } catch (err) {
            await manager.releaseTransaction();
            throw err;
        }
    }



    /**
     * 
     * @param processingSerial 
     * @param productCode 
     * @param fgColor 
     * @param size 
     * @param quantity 
     * @returns 
    */
    async getMoProductSubLineWiseAvailableQuantity(groupCode: string, processingSerial: number, productCode: string, fgColor: string, size: string, quantity: number, unitCode: string, companyCode: string): Promise<MC_ProductSubLineQtyModel[]> {
        // Get productRef from productCode
        const product = await this.poProductRepo.findOne({ where: { processingSerial, productCode, unitCode, companyCode }, select: ['productRef'] });
        if (!product) return [];
        const productRef = product.productRef;
        // Get total quantities from PoSubLineEntity
        const subLineData = await this.poSubLineRepo.getSubLineWiseQuantitiesForPo(processingSerial, productRef, fgColor, size);
        // Get allocated quantities from PoKnitJobSubLineEntity
        const allocatedData = await this.poSubLinePslMapRepo.getSubLineWiseQuantitiesForPoJob(processingSerial, productRef, fgColor, size, groupCode)
        // Convert allocated data into a map for quick lookup
        const allocatedMap = new Map<number, number>();
        allocatedData.forEach(({ moProductSubLineId, quantity }) => {
            allocatedMap.set(moProductSubLineId, Number(quantity) || 0);
        });
        // console.log(allocatedMap);
        // Calculate available quantities
        return subLineData.map(({ moProductSubLineId, quantity }) => {
            const allocatedQuantity = allocatedMap.get(moProductSubLineId) || 0;
            return {
                moProductSubLineId,
                quantity: Math.max(Number(quantity) - allocatedQuantity, 0),
            };
        });
    };

    /**
     * Service to get Raw material And Dependent BOM status for the given Job Number
     * @param jobNumber 
     * @param processingSerial 
     * @param processType 
     * @param unitCode 
     * @param companyCode 
     * @returns 
    */
    async getRmAndBomStatusForJobNumber(jobNumber: string, processingSerial: number, processType: ProcessTypeEnum, unitCode: string, companyCode: string): Promise<{
        rawMaterialStatus: KJ_MaterialStatusEnum;
        bomSkuStatus: KJ_MaterialStatusEnum;
    }> {
        const rmDetailsForJob = await this.knitJobPlanRepo.findOne({ where: { jobNumber, processingSerial, processType, unitCode, companyCode, isActive: true }, select: ['rawMaterialStatus', 'bomSkuStatus'] });
        // if (!rmDetailsForJob) {
        //     throw new ErrorResponse(0, 'Job Details not found in the job plan. Please check and try again');
        // }
        return {
            rawMaterialStatus: rmDetailsForJob?.rawMaterialStatus || 0,
            bomSkuStatus: rmDetailsForJob?.bomSkuStatus || 0
        }
    }


    async getItemAndComponentWiseConsumptionForJobNumber(jobNumber: string, processingSerial: number, processingType: ProcessTypeEnum, unitCode: string, companyCode: string, productCode: string, fgColor: string, knitGroup: string): Promise<MOC_MoProductFabSizeCons[]> {
        const barcodeDetails = await this.poSubLinePslMapRepo.find({ where: { jobNumber: jobNumber, unitCode, companyCode, isActive: true, processingSerial, processType: processingType } });
        if (!barcodeDetails.length) {
            throw new ErrorResponse(0, 'Barcode Details not found for the given barcode. Please check and try again')
        }
        const moProductSubLineIdsForBarcode = new Set<number>();
        barcodeDetails.forEach((eachLine) => {
            moProductSubLineIdsForBarcode.add(eachLine.moProductSubLineId);
        });
        const knitGroupInfo = await this.knitConfigService.getKnitGroupInfoForMOProductCodeAndFgColor(processingType, Array.from(moProductSubLineIdsForBarcode), productCode, fgColor, unitCode, companyCode);
        const itemCodesOfKnitGroup = new Set<string>();
        const componentsOfKnitGroup = new Set<string>();
        for (const eachProcessType of knitGroupInfo.processTypesList) {
            for (const eachKnitGroup of eachProcessType.subProcessList) {
                for (const eachBom of eachKnitGroup.bomList) {
                    if (eachBom.bomItemType == BomItemTypeEnum.RM && eachKnitGroup.subProcessName == knitGroup) {
                        itemCodesOfKnitGroup.add(eachBom.bomItemCode);
                        for (const eachComp of eachKnitGroup.components) {
                            componentsOfKnitGroup.add(eachComp.compName);
                        }
                    }

                }
            }
        };
        const consumptionDetails = await this.knitConfigService.getSizeWiseComponentConsumptionForPoForProduct(processingType, Array.from(moProductSubLineIdsForBarcode), productCode, fgColor, unitCode, companyCode);
        const actConsumptionInfo: MOC_MoProductFabSizeCons[] = []
        for (const eachCon of consumptionDetails) {
            let found = false;
            for (const fab of eachCon.fabCons) {
                if (itemCodesOfKnitGroup.has(fab.itemCode) && !found) {
                    if (componentsOfKnitGroup.has(fab.component)) {
                        found = true;
                        actConsumptionInfo.push(fab);
                    }
                }
            }
        }
        return actConsumptionInfo;
    }

    /**
    * Service to create Knitting Jobs for knitting group ratio
    * 
    * @param reqObj 
    * @param config 
    * @returns 
   */
    async unConfirmJobsForPoAndProduct(reqObj: ProcessingSerialProdCodeRequest): Promise<GlobalResponseObject> {
        const manager = new GenericTransactionManager(this.dataSource);
        let ratioIds = [];
        let checkFlag = true;
        try {
            const { unitCode, companyCode, processType, processingSerial, username, userId, productCode, fgColor } = reqObj;
            const product = await this.poProductRepo.findOne({ where: { processingSerial, productCode, processType, unitCode, companyCode }, select: ['productRef'] });
            if (!product) {
                throw new ErrorResponse(0, 'Product code not found for the given Po. Please check and try again');
            };
            const knitJobsInfo = await this.poKnitJobRepo.find({ where: { processingSerial, processType, unitCode, companyCode, isActive: true, isConfirmed: true } });
            if (!knitJobsInfo.length) {
                throw new ErrorResponse(0, 'No Knit jobs found to Un Confirm . Please check and try again')
            }
            const knitJobNumbersOfProduct: string[] = [];
            for (const eachKnitJob of knitJobsInfo) {
                const knitJobLineInfo = await this.poKnitJobLineRepo.find({ where: { poKnitJobId: eachKnitJob.id, processingSerial, processType, unitCode, companyCode, isActive: true } });
                for (const eachKnitJobLine of knitJobLineInfo) {
                    const knitJobSubLineInfo = await this.poKnitJobSubLineRepo.find({ where: { poKnitJobLineId: eachKnitJobLine.id, unitCode, companyCode, processingSerial, processType, isActive: true, productRef: product.productRef, fgColor } });
                    if (knitJobSubLineInfo.length > 0) {
                        knitJobNumbersOfProduct.push(eachKnitJob.knitJobNumber);
                    }
                }
            };
            if (!knitJobNumbersOfProduct.length) {
                throw new ErrorResponse(0, 'No Jobs found for the given Product Info')
            }
            const productKnitJobs = await this.poKnitJobRepo.find({ where: { processingSerial, processType, unitCode, companyCode, isActive: true, isConfirmed: true, knitJobNumber: In(knitJobNumbersOfProduct) } });
            if (!productKnitJobs.length) {
                throw new ErrorResponse(0, 'No Knit jobs found to Un Confirm For that Product color. Please check and try again')
            }
            ratioIds = knitJobsInfo.map(ratio => ratio.poKnitJobRatioId);
            await this.knitJobRatioRepo.update({ id: In(ratioIds), unitCode, companyCode }, { jobsConfirmStatus: KC_KnitJobConfStatusEnum.IN_PROGRESS });
            checkFlag = false;
            await manager.startTransaction();
            const knitJobPlanInfo = await this.knitJobPlanRepo.find({ where: { processingSerial, processType, unitCode, companyCode, jobNumber: In(knitJobNumbersOfProduct), isActive: true }, select: ['locationCode', 'jobNumber', 'id'] });
            for (const eachKnitJobPlanInfo of knitJobPlanInfo) {
                if (eachKnitJobPlanInfo.locationCode) {
                    throw new ErrorResponse(0, `Knit Job ${eachKnitJobPlanInfo.jobNumber} is already planned to location, you cannot unConfirm the jobs`);
                }
                await manager.getRepository(PoKnitJobPlanEntity).delete({ id: eachKnitJobPlanInfo.id, unitCode, companyCode })
            }
            await manager.getRepository(PoWhKnitJobMaterialEntity).delete({ processingSerial, processType, unitCode, companyCode, jobNumber: In(knitJobNumbersOfProduct), isActive: true });
            await manager.getRepository(PoKnitJobQtyEntity).delete({ processingSerial, processType, unitCode, companyCode, jobNumber: In(knitJobNumbersOfProduct), isActive: true });
            await manager.getRepository(PoKnitJobPslEntity).delete({ processingSerial, processType, unitCode, companyCode, jobNumber: In(knitJobNumbersOfProduct), isActive: true });
            await manager.completeTransaction();
            await this.knitJobRatioRepo.update({ id: In(ratioIds) }, { jobsConfirmStatus: KC_KnitJobConfStatusEnum.OPEN });
            await this.poKnitJobRepo.update({ knitJobNumber: In(knitJobNumbersOfProduct) }, { isConfirmed: false, updatedUser: reqObj.username })
            return new GlobalResponseObject(true, 0, 'Jobs Un Confirmed Successfully.')
        } catch (err) {
            await manager.releaseTransaction();
            if (!checkFlag) await this.knitJobRatioRepo.update({ id: In(ratioIds) }, { jobsConfirmStatus: KC_KnitJobConfStatusEnum.OPEN });
            throw err;
        }
    }


    /**
     * TODO : need to implement item related things from Master  -- DONE
    * Service to create Knitting Jobs for knitting group ratio
    * Usually calls from UI
    * Once user confirms the jobs for a knit group , Need to update the confirmation status to true and need to populate rows in the po_knit_job_plan , po_knit_job_qty
    * @param reqObj 
    * @param config 
    * @returns 
   */
    async confirmJobsForRatioId(reqObj: KC_KnitRatioPoSerialRequest): Promise<GlobalResponseObject> {
        const manager = new GenericTransactionManager(this.dataSource);
        let checkFlag = true;
        try {
            const { unitCode, companyCode, processType, processingSerial, username, knitRatioId } = reqObj;
            const ratioDetails = await this.knitJobRatioRepo.findOne({ where: { id: knitRatioId, unitCode, companyCode } });
            if (!ratioDetails) {
                throw new ErrorResponse(0, 'Ratio Details not found. Please check and try again');
            }
            if (ratioDetails.jobsConfirmStatus != KC_KnitJobConfStatusEnum.OPEN) {
                throw new ErrorResponse(0, 'Jobs already confirmed / in progress please check and try again');
            }
            let priority = 0;
            const knitJobsInfo = await this.poKnitJobRepo.find({ where: { processingSerial, processType, unitCode, companyCode, isActive: true, isConfirmed: false, poKnitJobRatioId: knitRatioId } });
            if (!knitJobsInfo.length) {
                throw new ErrorResponse(0, 'No Knit jobs found to confirm . Please check and try again')
            }
            await this.knitJobRatioRepo.update({ id: knitRatioId }, { jobsConfirmStatus: KC_KnitJobConfStatusEnum.IN_PROGRESS });
            checkFlag = false;
            const consumptionDetailsForProductAndFgColor = new Map<string, Map<string, MOC_MoProductFabSizeCons[]>>();
            await manager.startTransaction();
            const uniqueItemCodes = new Map<string, ItemModel>();
            for (const eachKnitJob of knitJobsInfo) {
                const sizesInvolved = new Set<string>();
                const knitJobLineInfo = await this.poKnitJobLineRepo.find({ where: { poKnitJobId: eachKnitJob.id, processingSerial, processType, unitCode, companyCode, isActive: true } });
                for (const eachKnitJobLine of knitJobLineInfo) {
                    const knitJobSubLineInfo = await this.poKnitJobSubLineRepo.find({ where: { poKnitJobLineId: eachKnitJobLine.id, unitCode, companyCode, processingSerial, processType, isActive: true } });
                    if (knitJobSubLineInfo.length == 0) {
                        throw new ErrorResponse(0, 'No Knit jobs found to confirm. Please check and try again')
                    };
                    let productCode = null;
                    let fgColor = null;
                    for (const eachSubLine of knitJobSubLineInfo) {
                        if (!productCode) {
                            const productDetails = await this.poProductRepo.findOne({ where: { processingSerial, productRef: eachSubLine.productRef, unitCode, companyCode } });
                            if (!productDetails) {
                                throw new ErrorResponse(0, 'Product details not found. Please check and try again')
                            }
                            productCode = productDetails.productCode;
                            fgColor = eachSubLine.fgColor;
                        }
                        sizesInvolved.add(eachSubLine.size);
                    };

                    if (!consumptionDetailsForProductAndFgColor.has(productCode)) {
                        consumptionDetailsForProductAndFgColor.set(productCode, new Map<string, MOC_MoProductFabSizeCons[]>());
                    }
                    if (!consumptionDetailsForProductAndFgColor.get(productCode).has(fgColor)) {
                        const itemCodeWiseConsumptionDetails = await this.getItemAndComponentWiseConsumptionForJobNumber(eachKnitJob.knitJobNumber, processingSerial, processType, unitCode, companyCode, productCode, fgColor, eachKnitJob.groupCode);
                        consumptionDetailsForProductAndFgColor.get(productCode).set(fgColor, itemCodeWiseConsumptionDetails);
                    }
                    const consumptionDetailsOfProducts = consumptionDetailsForProductAndFgColor.get(productCode).get(fgColor);
                    const requiredWeightOfItemCode = new Map<string, number>();
                    const itemCodesInvolved = new Set<string>();
                    consumptionDetailsOfProducts.forEach((consumptionDetailsOfProduct) => {
                        if (!requiredWeightOfItemCode.has(consumptionDetailsOfProduct.itemCode)) {
                            requiredWeightOfItemCode.set(consumptionDetailsOfProduct.itemCode, 0);
                        }
                        itemCodesInvolved.add(consumptionDetailsOfProduct.itemCode);
                        for (const eachSize of consumptionDetailsOfProduct.sizeCons) {
                            if (sizesInvolved.has(eachSize.size)) {
                                const preQty = requiredWeightOfItemCode.get(consumptionDetailsOfProduct.itemCode);
                                const requiredWeight = preQty + Number(eachSize.cons);
                                requiredWeightOfItemCode.set(consumptionDetailsOfProduct.itemCode, requiredWeight);
                            }

                        }
                    });
                    for (const eachItemCode of itemCodesInvolved) {
                        let eachItemData: ItemModel = null;
                        if (uniqueItemCodes.has(eachItemCode)) {
                            eachItemData = uniqueItemCodes.get(eachItemCode);
                        }
                        else {
                            const req = new ItemIdRequest(reqObj.username, reqObj.unitCode, reqObj.companyCode, reqObj.userId, null, null, eachItemCode);
                            const itemData = await this.itemSharedService.getBomItemByItemCode(req);
                            if (!itemData.status) {
                                throw new ErrorResponse(itemData.errorCode, itemData.internalMessage)
                            }
                            uniqueItemCodes.set(eachItemCode, itemData?.data[0]);
                            eachItemData = itemData?.data[0];
                        }
                        const knitJobMaterialReq = new PoWhKnitJobMaterialEntity()
                        knitJobMaterialReq.companyCode = companyCode;
                        knitJobMaterialReq.createdUser = username;
                        knitJobMaterialReq.groupCode = eachKnitJob.groupCode;
                        knitJobMaterialReq.itemCode = eachItemCode;
                        knitJobMaterialReq.itemColor = eachItemData?.itemColor;
                        knitJobMaterialReq.itemDescription = eachItemData?.itemDescription;
                        knitJobMaterialReq.itemName = eachItemData?.itemName;
                        knitJobMaterialReq.itemType = PhItemCategoryEnum.FABRIC;
                        knitJobMaterialReq.jobNumber = eachKnitJob.knitJobNumber;
                        knitJobMaterialReq.processType = processType;
                        knitJobMaterialReq.processingSerial = processingSerial;
                        knitJobMaterialReq.unitCode = unitCode;
                        knitJobMaterialReq.requiredQty = (requiredWeightOfItemCode.get(eachItemCode) ?? 0) * (eachKnitJob.quantity);
                        knitJobMaterialReq.allocatedQty = 0;
                        knitJobMaterialReq.reportedWeight = 0;
                        knitJobMaterialReq.issuedQty = 0;
                        await manager.getRepository(PoWhKnitJobMaterialEntity).save(knitJobMaterialReq);
                    };
                    let totalWeight = 0;
                    for (const [itemCode, qty] of requiredWeightOfItemCode) {
                        totalWeight += qty * eachKnitJobLine.quantity;
                    }
                    const knitJobPlan = new PoKnitJobPlanEntity();
                    knitJobPlan.companyCode = companyCode;
                    knitJobPlan.createdUser = username;
                    knitJobPlan.jobNumber = eachKnitJob.knitJobNumber;
                    knitJobPlan.jobPriority = priority++;
                    knitJobPlan.locationCode = null;
                    knitJobPlan.planInputDate = null;
                    knitJobPlan.processType = processType;
                    knitJobPlan.processingSerial = processingSerial;
                    knitJobPlan.unitCode = unitCode;
                    knitJobPlan.status = SewingJobPlanStatusEnum.OPEN;
                    await manager.getRepository(PoKnitJobPlanEntity).save(knitJobPlan, { reload: false });
                    const knitJobQtyEntity = new PoKnitJobQtyEntity();
                    knitJobQtyEntity.companyCode = companyCode;
                    knitJobQtyEntity.createdUser = username;
                    knitJobQtyEntity.goodQty = 0;
                    knitJobQtyEntity.inputQty = eachKnitJobLine.quantity;
                    knitJobQtyEntity.jobNumber = eachKnitJob.knitJobNumber;
                    // console.log(requiredWeight,'job line qty')
                    knitJobQtyEntity.originalQty = eachKnitJobLine.quantity;
                    knitJobQtyEntity.originalWeight = totalWeight;
                    knitJobQtyEntity.rejectedQty = 0;
                    knitJobQtyEntity.unitCode = unitCode;
                    knitJobQtyEntity.processingSerial = processingSerial;
                    knitJobQtyEntity.processType = processType;
                    knitJobQtyEntity.rejectedQty = 0;
                    knitJobQtyEntity.goodQty = 0;
                    knitJobQtyEntity.reportedWeight = 0;
                    await manager.getRepository(PoKnitJobQtyEntity).save(knitJobQtyEntity, { reload: false });
                }
                await manager.getRepository(PoKnitJobEntity).update({ id: eachKnitJob.id, unitCode, companyCode }, { isConfirmed: true, updatedUser: username })
            }
            await manager.completeTransaction();
            await this.knitJobRatioRepo.update({ id: knitRatioId }, { jobsConfirmStatus: KC_KnitJobConfStatusEnum.COMPLETED });
            return new GlobalResponseObject(true, 0, 'Jobs Confirmed Successfully.')
        } catch (err) {
            if (!checkFlag) await this.knitJobRatioRepo.update({ id: reqObj.knitRatioId }, { jobsConfirmStatus: KC_KnitJobConfStatusEnum.OPEN });
            await manager.releaseTransaction();
            throw err;
        }
    }

    /**
    * Service to create Knitting Jobs for knitting group ratio
    * 
    * @param reqObj 
    * @param config 
    * @returns 
   */
    async unConfirmJobsForForRatioId(reqObj: KC_KnitRatioPoSerialRequest): Promise<GlobalResponseObject> {
        const manager = new GenericTransactionManager(this.dataSource);
        const { unitCode, companyCode, processType, processingSerial, username, userId, knitRatioId } = reqObj;
        let checkFlag = true;
        try {
            const ratioDetails = await this.knitJobRatioRepo.findOne({ where: { id: knitRatioId, unitCode, companyCode } });
            if (!ratioDetails) {
                throw new ErrorResponse(0, 'Ratio Details not found. Please check and try again');
            }
            if (ratioDetails.jobsConfirmStatus != KC_KnitJobConfStatusEnum.COMPLETED) {
                throw new ErrorResponse(0, 'Jobs not yet confirmed to un confirm, please check and try again');
            }
            const knitJobsInfo = await this.poKnitJobRepo.find({ where: { processingSerial, processType, unitCode, companyCode, isActive: true, isConfirmed: true, poKnitJobRatioId: knitRatioId } });
            if (!knitJobsInfo.length) {
                throw new ErrorResponse(0, 'No Knit jobs found to Un Confirm . Please check and try again')
            };
            const knitJobNumbersOfProduct = knitJobsInfo.map(job => job.knitJobNumber);
            await this.knitJobRatioRepo.update({ id: knitRatioId, unitCode, companyCode }, { jobsConfirmStatus: KC_KnitJobConfStatusEnum.IN_PROGRESS });
            checkFlag = false;
            await manager.startTransaction();
            const knitJobPlanInfo = await this.knitJobPlanRepo.find({ where: { processingSerial, processType, unitCode, companyCode, jobNumber: In(knitJobNumbersOfProduct), isActive: true }, select: ['locationCode', 'jobNumber', 'id'] });
            for (const eachKnitJobPlanInfo of knitJobPlanInfo) {
                if (eachKnitJobPlanInfo.locationCode) {
                    throw new ErrorResponse(0, `Knit Job ${eachKnitJobPlanInfo.jobNumber} is already planned to location, you cannot unConfirm the jobs`);
                }
                await manager.getRepository(PoKnitJobPlanEntity).delete({ id: eachKnitJobPlanInfo.id, unitCode, companyCode })
            }
            await manager.getRepository(PoWhKnitJobMaterialEntity).delete({ processingSerial, processType, unitCode, companyCode, jobNumber: In(knitJobNumbersOfProduct), isActive: true });
            await manager.getRepository(PoKnitJobQtyEntity).delete({ processingSerial, processType, unitCode, companyCode, jobNumber: In(knitJobNumbersOfProduct), isActive: true });
            // await manager.getRepository(PoKnitJobPslEntity).delete({ processingSerial, processType, unitCode, companyCode, jobNumber: In(knitJobNumbersOfProduct), isActive: true });
            await manager.completeTransaction();
            await this.knitJobRatioRepo.update({ id: knitRatioId }, { jobsConfirmStatus: KC_KnitJobConfStatusEnum.OPEN });
            await this.poKnitJobRepo.update({ knitJobNumber: In(knitJobNumbersOfProduct) }, { isConfirmed: false, updatedUser: reqObj.username })
            return new GlobalResponseObject(true, 0, 'Jobs Un Confirmed Successfully.')
        } catch (err) {
            await manager.releaseTransaction();
            if (!checkFlag) await this.knitJobRatioRepo.update({ id: knitRatioId }, { jobsConfirmStatus: KC_KnitJobConfStatusEnum.COMPLETED });
            throw err;
        }
    }

    async getKnitJobObjectDetailsByJobNumber(reqObj: KnitJobNumberRequest): Promise<KnitJobObjectResponse> {
        try {
            const objectData = await this.poWhRequestLineRepository.getObjectDataByJobNumber(reqObj.knitJobNumber, reqObj.unitCode, reqObj.companyCode);
            return new KnitJobObjectResponse(true, 0, 'Knit Job Object Details', objectData);
        } catch (err) {
            throw err;
        }
    }

    async getSizeWiseConsumptionDataForJobNumber(reqObj: KnitJobConsumptionRequest): Promise<KnitJobSizeWiseConsumptionResponse> {
        try {
            const consumptionData = await this.getItemAndComponentWiseConsumptionForJobNumber(reqObj.jobNumber, reqObj.processingSerial, reqObj.processType, reqObj.unitCode, reqObj.companyCode, reqObj.productCode, reqObj.fgColor, reqObj.knitGroup);
            return new KnitJobSizeWiseConsumptionResponse(true, 0, 'Size wise consumption data', consumptionData);
        } catch (err) {
            throw err.message;
        }
    }
    async getPoWhRequestDataForPoSerial(reqObj: KnitIdsRequest): Promise<PoWhRequestDataResponse> {
        try {
            const poWhRequestData = await this.poWhRequestRepository.find({ where: { 'processingSerial': In(reqObj.knitIds), unitCode: reqObj.unitCode, companyCode: reqObj.companyCode } });
            if (!poWhRequestData.length) {
                throw new ErrorResponse(8769, 'No Po Wh Request Data found for the given Po Serial. Please check and try again')
            }
            const data: PoWhRequestData[] = [];
            if (poWhRequestData.length > 0) {
                poWhRequestData.forEach((eachPoWhRequestData) => {
                    const poWhRequestDataObj = new PoWhRequestData(eachPoWhRequestData.id, eachPoWhRequestData.processingSerial, eachPoWhRequestData.processType, eachPoWhRequestData.requestCode, eachPoWhRequestData.requestedBy, eachPoWhRequestData.planCloseDate, eachPoWhRequestData.sla, eachPoWhRequestData.status, eachPoWhRequestData.createdAt);
                    data.push(poWhRequestDataObj);
                })
            }
            return new PoWhRequestDataResponse(true, 0, 'Po Wh Request Data', data);
        } catch (err) {
            throw err;
        }
    }

    async getPoWhRequestLinesDataForPoWhRequestId(reqObj: KnitIdsRequest): Promise<PoWhRequestLinesDataResponse> {
        try {
            const poWhRequestLinesData = await this.poWhRequestLineRepository.find({ where: { 'poWhRequestId': In(reqObj.knitIds), unitCode: reqObj.unitCode, companyCode: reqObj.companyCode } });
            if (!poWhRequestLinesData.length) {
                throw new ErrorResponse(8769, 'No Po Wh Request Lines Data found for the given Po Serial. Please check and try again')
            }
            const data: PoWhRequestLinesData[] = [];
            if (poWhRequestLinesData.length > 0) {
                poWhRequestLinesData.forEach((eachPoWhRequestLinesData) => {
                    const poWhRequestLinesDataObj = new PoWhRequestLinesData(eachPoWhRequestLinesData.id, eachPoWhRequestLinesData.processingSerial, eachPoWhRequestLinesData.processType, eachPoWhRequestLinesData.jobNumber, eachPoWhRequestLinesData.groupCode, eachPoWhRequestLinesData.itemCode, eachPoWhRequestLinesData.itemType, eachPoWhRequestLinesData.itemName, eachPoWhRequestLinesData.itemColor, eachPoWhRequestLinesData.requiredQty, eachPoWhRequestLinesData.allocatedQty, eachPoWhRequestLinesData.issuedQty,);
                    data.push(poWhRequestLinesDataObj);
                })
            }
            return new PoWhRequestLinesDataResponse(true, 0, 'Po Wh Request Lines Data', data);
        } catch (err) {
            throw err;
        }
    }

    async getPoWhRequestMaterialDataForPoWhRequestLinesId(reqObj: KnitIdsRequest): Promise<PoWhRequestMaterialDataResponse> {
        try {
            const poWhRequestMaterialData = await this.poWhRequestMaterialItemRepository.find({ where: { 'poWhRequestLineId': In(reqObj.knitIds), unitCode: reqObj.unitCode, companyCode: reqObj.companyCode } });
            if (!poWhRequestMaterialData.length) {
                throw new ErrorResponse(8769, 'No Po Wh Request Material Data found for the given Po Serial. Please check and try again')
            }
            const data: PoWhRequestMaterialData[] = [];
            if (poWhRequestMaterialData.length > 0) {
                poWhRequestMaterialData.forEach((eachPoWhRequestMaterialData) => {
                    const poWhRequestMaterialDataObj = new PoWhRequestMaterialData(eachPoWhRequestMaterialData.id, eachPoWhRequestMaterialData.itemCode, eachPoWhRequestMaterialData.itemType, eachPoWhRequestMaterialData.itemName, eachPoWhRequestMaterialData.objectCode, eachPoWhRequestMaterialData.supplierCode, eachPoWhRequestMaterialData.objectType, eachPoWhRequestMaterialData.requiredQty, eachPoWhRequestMaterialData.allocatedQty, eachPoWhRequestMaterialData.issuedQty);
                    data.push(poWhRequestMaterialDataObj);
                })
            }
            return new PoWhRequestMaterialDataResponse(true, 0, 'Po Wh Request Material Data', data);
        } catch (err) {
            throw err;
        }
    }

     async getQtyInfoForGivenPslIdAndProcType(req: MoPslIdProcessTypeReq):Promise<MoOperationReportedQtyInfoResponse>{
        const jobNumbersRes =  await this.poSubLinePslMapRepo.getJobNumbersForMoPsdlIds(req)
        if(jobNumbersRes.length === 0){
            throw new ErrorResponse(0,"Mo jobs found for the given MO")
        }
        const jobNumbers = jobNumbersRes.map((v) => v.jobNumber)
        const knitJobQtys = await this.poKnitJobQuantityRepo.getJobQunatitesForGiveJobNumbers(jobNumbers,req.companyCode,req.unitCode)
        if(knitJobQtys.length === 0){
            throw new ErrorResponse(0,"No Job Qtys found for the given MO")
        }
         const moOperationReportedQtysArr: MoOperationReportedQtyInfoModel[] = []
        for (const eachRec of knitJobQtys) {
            const processType = eachRec.processType as ProcessTypeEnum
            const moReportedQtysObj = new MoOperationReportedQtyInfoModel(processType, Number(eachRec.completedQty), Number(eachRec.rejectedQty))
            moOperationReportedQtysArr.push(moReportedQtysObj)
        }

        return new MoOperationReportedQtyInfoResponse(true,1,"data retreived",moOperationReportedQtysArr)

    }
}
