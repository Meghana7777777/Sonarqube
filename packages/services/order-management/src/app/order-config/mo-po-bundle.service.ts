import { GlobalResponseObject, MC_MoProcessTypeModel, MC_PoPslbBundleDetailModel, MOC_BundleDetail, MOC_OpRoutingRetrievalRequest, MC_MoNumberRequest, MoProductSubLineIdsRequest, ProcessTypeEnum, ProductSubLineAndBundleDetailModel, ProductSubLineAndBundleDetailResponse, RoutingGroupDetail, MC_StyleMoNumbersRequest, ProcessingOrderSerialRequest, SI_MoNumberRequest, PlannedBundleResponseModel } from "@xpparel/shared-models";
import { MoPoBundleRepository } from "../repository/mo-po-bundle.repository";
import { MoProductSubLineRepository } from "../repository/mo-product-sub-line.repository";
import { MoOpProcessTypeRepository } from "./repository/mo-op-proc-type.repository";
import { MoOpRoutingService } from "./mo-op-routing.service";
import { DataSource, In } from "typeorm";
import { GenericTransactionManager } from "../../database/typeorm-transactions";
import { MoPoBundleEntity } from "../entity/mo-po-bundle.entity";
import { ErrorResponse } from "@xpparel/backend-utils";
import { Injectable } from "@nestjs/common";
import { FgSkuEntity } from "../style-management/entity/fg-sku.entity";
import { MoInfoRepository } from "../repository/mo-info.repository";
import { OrderConfigHelperService } from "./order-config-helper.service";
import { PKMSBullQueueService } from "@xpparel/shared-services";
@Injectable()
export class MoPoBundleService {
    constructor(
        private dataSource: DataSource,
        private moProductSubLineRepo: MoProductSubLineRepository,
        private moOpRoutingService: MoOpRoutingService,
        private moPoBundleRepo: MoPoBundleRepository,
        private moInfoRepo: MoInfoRepository,
        private orderConfigHelperService: OrderConfigHelperService,
        private pkmsBullQueueService: PKMSBullQueueService
    ) { }


    /**
     * TODO: Need to create a bull queue for this after the MO has been confirmed for next proceedings
     * Creates processing bundles for a given Manufacturing Order (MO).
     * @param moNumber - Manufacturing Order number
     * @param unitCode - Unit identifier
     * @param companyCode - Company identifier
     * @returns Promise<GlobalResponseObject>
     */
    async createProcessingBundlesForMO(reqObj: MC_MoNumberRequest): Promise<GlobalResponseObject> {
        const { moNumber, unitCode, companyCode, username } = reqObj;
        const manager = new GenericTransactionManager(this.dataSource);
        try {
            await manager.startTransaction();
            const transactionalEntityManager = manager.getRepository(MoPoBundleEntity);
            // Fetch product sub-lines associated with the given MO number
            const productSubLines = await this.moProductSubLineRepo.find({ where: { moNumber, unitCode, companyCode } });
            if (!productSubLines.length) {
                throw new Error("No product sub lines found for the given MO number");
            };
            const moInfoDetail = await this.moInfoRepo.findOne({ where: { moNumber, unitCode, companyCode }, select: ['id'] });
            if (!moInfoDetail) {
                throw new ErrorResponse(0, 'Mo Info not found. Please check and try again')
            }
            const hexaDecimalOfMoId = moInfoDetail.id.toString(16).toUpperCase();           // Cache to store routing details for unique styleCode-productCode-fgColor combinations
            const routingCache = new Map<string, RoutingGroupDetail[]>();
            let runningNumber = 0;
            for (const subLine of productSubLines) {
                const { id, styleCode, productCode, fgColor, quantity } = subLine;
                const cacheKey = `${styleCode}-${productCode}-${fgColor}`;
                let routingDetails = routingCache.get(cacheKey);
                if (!routingDetails) {
                    // Create request model to fetch routing details
                    const requestModel = new MOC_OpRoutingRetrievalRequest(null, unitCode, companyCode, 0, moNumber, styleCode, productCode, fgColor, false, false);
                    routingDetails = await this.moOpRoutingService.getRoutingGroupDetailForGivenMoProductAndFgColor(requestModel);
                    routingCache.set(cacheKey, routingDetails);
                };
                const routingGroupCharMap = new Map<string, RoutingGroupDetail[]>();
                for (const routingGroup of routingDetails) {
                    if (!routingGroupCharMap.has(routingGroup.routingGroup)) {
                        routingGroupCharMap.set(routingGroup.routingGroup, [])
                    };
                    routingGroupCharMap.get(routingGroup.routingGroup).push(routingGroup);
                }
                for (const [rg, rgDetail] of routingGroupCharMap) {
                    const bundles: MoPoBundleEntity[] = [];
                    const totalPslbQty = quantity;
                    let remainingQty = totalPslbQty;
                    const processingTypeFirstCharsString: string = rgDetail.reduce((prev, curr) => {
                        return prev + `${curr.procType[0]}`
                    }, '');
                    while (remainingQty > 0) {
                        runningNumber++;
                        for (const detail of rgDetail) {
                            const { procType, bundleQty, outPutSku } = detail;
                            const currentBundleQty = Math.min(bundleQty, remainingQty);
                            const itemSku = outPutSku;
                            const bundle = new MoPoBundleEntity();
                            bundle.moNumber = moNumber;
                            bundle.bundleNumber = `${hexaDecimalOfMoId}-${processingTypeFirstCharsString}-${runningNumber}`;
                            bundle.moProductSubLineId = id;
                            bundle.procType = procType;
                            bundle.processingSerial = 0; // Initial processing serial set to 0
                            bundle.quantity = currentBundleQty;
                            bundle.companyCode = companyCode;
                            bundle.unitCode = unitCode;
                            bundle.itemSku = itemSku;
                            bundle.createdUser = username;
                            bundles.push(bundle);
                        }
                        remainingQty -= rgDetail[0].bundleQty;
                    }
                    await transactionalEntityManager.save(bundles, { reload: false });
                }
            }
            await manager.completeTransaction();
            // call the PTS API to populate the mo details out there
            this.orderConfigHelperService.sendMoConfirmationStatusToPTS(moNumber, companyCode, unitCode, username);
            this.orderConfigHelperService.sendMoConfirmationStatusToCPS(moNumber, companyCode, unitCode, username);
            // call the PTS API to populate the mo details out there
            await this.pkmsBullQueueService.sendMoConfirmationStatusToPKMS(new SI_MoNumberRequest(username, unitCode, companyCode, 0, moNumber, 0, false, false, false, false, false, false, false, false, false, false, false, null));
            return new GlobalResponseObject(true, 0, 'Bundles Created Successfully for Given MO');
        } catch (Err) {
            await manager.releaseTransaction();
            throw Err;
        }
    }


    /**
     * Service to get Eligible bundle information to create a processing order.
     * Step 1: Fetch necessary bundle data using MoPoBundleRepository where processing serial is 0.
     * Step 2: Format and return the eligible bundle information.
     * @param moNumber - Manufacturing Order Number
     * @param procType - Process Type
     * @param unitCode - Unit Code
     * @param companyCode - Company Code
     */
    async getEligibleBundleInfoToCreatePO(reqObj: MC_MoProcessTypeModel): Promise<ProductSubLineAndBundleDetailResponse> {
        const { moNumber, procType, unitCode, companyCode } = reqObj;
        try {
            // Fetch eligible bundles for the given parameters
            const eligibleBundles = await this.moPoBundleRepo.find({
                where: { moNumber, procType, unitCode, companyCode, processingSerial: 0 },
                select: ["moProductSubLineId", "bundleNumber", "quantity"]
            });
            // Group bundles by moProductSubLineId
            const groupedBundles = new Map<number, MOC_BundleDetail[]>();

            for (const bundle of eligibleBundles) {
                const { moProductSubLineId, bundleNumber, quantity } = bundle;

                if (!groupedBundles.has(moProductSubLineId)) {
                    groupedBundles.set(moProductSubLineId, []);
                }

                groupedBundles.get(moProductSubLineId)!.push(new MOC_BundleDetail(bundleNumber, quantity, bundle.itemSku, bundle.moProductSubLineId));
            }

            // Format response
            const responseData: ProductSubLineAndBundleDetailModel[] = Array.from(
                groupedBundles,
                ([moProductSubLineId, bundleDetails]) => new ProductSubLineAndBundleDetailModel(moProductSubLineId, bundleDetails)
            );
            return new ProductSubLineAndBundleDetailResponse(true, 0, "Eligible bundles fetched successfully", responseData);
        } catch (error) {
            throw error;
        }
    }


    /**
     * Service to update the process serial to the given bundle numbers
     * @param reqObj 
    */
    async updateProcessSerialToBundles(reqObj: MC_PoPslbBundleDetailModel): Promise<GlobalResponseObject> {
        const manager = new GenericTransactionManager(this.dataSource);
        try {
            await manager.startTransaction();
            const transactionalEntityManager = manager.getRepository(MoPoBundleEntity);
            for (const subLine of reqObj.pslbBundleInfo) {
                for (const bundle of subLine.bundleDetails) {
                    const existingRecord = await transactionalEntityManager.findOne({
                        where: {
                            bundleNumber: bundle.bundleNumber,
                            moProductSubLineId: subLine.moProductSubLineId,
                            unitCode: reqObj.unitCode,
                            companyCode: reqObj.companyCode,
                            procType: reqObj.procType,
                            processingSerial: 0
                        }
                    });

                    if (!existingRecord) {
                        throw new ErrorResponse(0, `No matching record found for Bundle: ${bundle.bundleNumber}, SubLine: ${subLine.moProductSubLineId}`);
                    }

                    await transactionalEntityManager.update(
                        { id: existingRecord.id },
                        { processingSerial: reqObj.processingSerial, updatedUser: reqObj.username }
                    );
                }
            }
            await manager.completeTransaction();
            return new GlobalResponseObject(true, 0, 'Processing Serial Updated Successfully');
        } catch (err) {
            await manager.releaseTransaction();
            throw err;
        }
    }


    async getEligibleBundleInfoForGivenSubLineIds(reqObj: MoProductSubLineIdsRequest): Promise<ProductSubLineAndBundleDetailResponse> {
        const { moNumber, processType, unitCode, companyCode, productSubLineIds } = reqObj;
        try {
            // Fetch eligible bundles for the given parameters
            const eligibleBundles = await this.moPoBundleRepo.find({
                where: { moNumber, procType: processType, unitCode, companyCode, processingSerial: 0, moProductSubLineId: In(reqObj.productSubLineIds) }, select: ["moProductSubLineId", "bundleNumber", "quantity", "itemSku"]
            });

            // Group bundles by moProductSubLineId
            const groupedBundles = new Map<number, MOC_BundleDetail[]>();

            for (const bundle of eligibleBundles) {
                const { moProductSubLineId, bundleNumber, quantity } = bundle;

                if (!groupedBundles.has(moProductSubLineId)) {
                    groupedBundles.set(moProductSubLineId, []);
                }

                groupedBundles.get(moProductSubLineId)!.push(new MOC_BundleDetail(bundleNumber, quantity, bundle.itemSku, bundle.moProductSubLineId));
            }

            // Format response
            const responseData: ProductSubLineAndBundleDetailModel[] = Array.from(
                groupedBundles,
                ([moProductSubLineId, bundleDetails]) => new ProductSubLineAndBundleDetailModel(moProductSubLineId, bundleDetails)
            );
            return new ProductSubLineAndBundleDetailResponse(true, 0, "Eligible bundles fetched successfully", responseData);
        } catch (error) {
            throw error;
        }
    }


    /**
     * methos to 
     * @param req 
     * @returns 
     */
    async unMapProcessingSerialsToBundles(req: ProcessingOrderSerialRequest): Promise<GlobalResponseObject> {
        const res = await this.moPoBundleRepo.update({ processingSerial: In(req.processingSerial), procType: req.processType, companyCode: req.companyCode, unitCode: req.unitCode }, { processingSerial: 0, updatedUser: req.username })
        if (res.affected > 0) {
            return new GlobalResponseObject(true, 1, 'Processing Serials Unmapped Successfully')
        } else {
            return new GlobalResponseObject(false, 0, 'No Processing Serials Found')
        }
    }

    async getMoPlannedBundlesFromRequest(req: MC_MoNumberRequest): Promise<PlannedBundleResponseModel> {
        const { moNumber } = req;   
        try {
          const bundles = await this.moPoBundleRepo.getMoPlannedBundles(moNumber);
          return new PlannedBundleResponseModel( true, 0, 'Planned bundles fetched successfully.', bundles);
        } catch (error) {
          return new PlannedBundleResponseModel( false, 500, 'Failed to fetch planned bundles.', [] );
        }
      }
      
};

