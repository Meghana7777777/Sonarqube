import { Inject, Injectable, LoggerService } from "@nestjs/common";
import { GlobalResponseObject, PackListMrnStatusEnum, PackMAterialRequest, PackMaterialResponse, PackMaterialSummaryResponse, PackMatReqID, PackMatReqModel, PackMatReqStatusEnum, PackMatSummaryModel, PKMS_C_JobTrimReqIdRequest, WMS_C_IssuanceIdRequest, WMS_R_IssuanceIdItemsModel, WMS_R_IssuanceIdItemsResponse } from "@xpparel/shared-models";
import { TransactionalBaseService } from "../../base-services";
import { ITransactionManager } from "../../database/typeorm-transactions";
import { SequenceHandlingService } from "../__common__/sequence-handling/sequence-handling.service";
import { JobHeaderEntity } from "../packing-list/entities/job-header.entity";

import { ErrorResponse } from "@xpparel/backend-utils";
import { PackingListService, WmsPackTrimRequestService } from "@xpparel/shared-services";
import { PackMAterialsForPackLists } from "packages/libs/shared-models/src/pkms/packing-material-request/pack-mat-req-response.model";
import { In } from "typeorm";
import { ItemsRepo } from "../__masters__/items/repositories/items.repo";
import { CartonRepo } from "../packing-list/repositories/carton-repo";
import { PLConfigRepo } from "../packing-list/repositories/config.repo";
import { JobHeaderRepo } from "../packing-list/repositories/job-header.repo";
import { PackMaterialRequestEntity } from "./entities/material-request.entity";
import { PackMatReqLinesEntity } from "./entities/pack-mat-req-lines.entity";
import { PackMatReqWhItemEntity } from "./entities/pack-material-req-wh-item.entity";
import { PackWhJobMaterialIssuanceEntity } from "./entities/pack-wh-job-material-issuance.entity";
import { PAckingMaterialReqInfoService } from "./packing-material-info-service";
import { PackMatReqLinesRepo } from "./repositories/pack-mat-req-lines.repo";
import { PackWhJobMaterialIssuanceRepoInterface } from "./repositories/pack-wh-job-material-issuance.interface";
import { PackingMaterialReqRepo } from "./repositories/packing-material-req.repo";

@Injectable()
export class PackingMaterialReqService extends TransactionalBaseService {
    constructor(
        @Inject('LoggerService')
        logger: LoggerService,
        @Inject('PackingMaterialReqRepoInterface')
        private readonly pmrRepo: PackingMaterialReqRepo,
        @Inject('PLConfigRepoInterface')
        private readonly plRepo: PLConfigRepo,
        @Inject('CartonRepoInterFace')
        private readonly cartonRepo: CartonRepo,
        @Inject('PackMatReqLinesRepoInterface')
        private readonly pmrLineRepo: PackMatReqLinesRepo,
        @Inject('PackWhJobMaterialIssuanceRepoInterface')
        private whMaterialIssuance: PackWhJobMaterialIssuanceRepoInterface,
        private readonly itemRepo: ItemsRepo,
        private readonly jobHeader: JobHeaderRepo,
        @Inject('TransactionManager')
        transactionManager: ITransactionManager,
        private readonly pmInfoService: PAckingMaterialReqInfoService,
        public sequenceHandlingService: SequenceHandlingService,
        private packListService: PackingListService,
        private wmsPackTrimService: WmsPackTrimRequestService
    ) {
        super(transactionManager, logger)
    }

    async createMaterialRequest(req: PackMatReqModel): Promise<GlobalResponseObject> {
        const { unitCode, companyCode, username, userId } = req;
        const jobIdSet = new Set<number>();
        const itemCodes = new Set<string>();
        const itemCdeToItemIdMap = new Map<string, number>();
        const allocationMap = new Map<string, Map<string, number>>();//itemCode, objectCode,  allocatedQuantity
        req.allocatedObjects.forEach(obj => {
            obj.objectWiseDetail.forEach(objDetail => {
                if (allocationMap.has(obj.itemCode)) {
                    allocationMap.get(obj.itemCode).set(objDetail.objectCode, objDetail.allocatingQuantity);
                } else {
                    const map = new Map<string, number>();
                    map.set(objDetail.objectCode, objDetail.allocatingQuantity);
                    allocationMap.set(obj.itemCode, map);
                }
            })
        });
        const qtyObjectMap = new Map<string, Map<number, { qty: number, jobs: { packJobId: number; packJobQty: number; isNonCartonItem: boolean }[], }>>();//itemCode, jobId, qty
        req.packJobItems.forEach(job => {
            jobIdSet.add(job.packJobId);
            job.itemsData.forEach(item => {
                itemCdeToItemIdMap.set(item.itemCode, item.itemsId);
                itemCodes.add(item.itemCode);
                if (qtyObjectMap.has(item.itemCode)) {
                    qtyObjectMap.get(item.itemCode).set(job.packJobId, {
                        qty: item.qty, jobs: [
                            {
                                packJobId: job.packJobId,
                                packJobQty: item.qty,
                                isNonCartonItem: false
                            }
                        ]
                    });
                } else {
                    if (!qtyObjectMap.get(item.itemCode)) {
                        qtyObjectMap.set(item.itemCode, new Map<number, { qty: number, jobs: { packJobId: number; packJobQty: number; isNonCartonItem: boolean }[] }>());//itemCode, jobId, qty
                    }
                    if (!qtyObjectMap.get(item.itemCode).has(job.packJobId)) {
                        qtyObjectMap.get(item.itemCode).set(job.packJobId, {
                            qty: 0, jobs: []
                        });
                    }
                    qtyObjectMap.get(item.itemCode).set(job.packJobId, {
                        qty: qtyObjectMap.get(item.itemCode).get(job.packJobId).qty + item.qty, jobs: [...qtyObjectMap.get(item.itemCode).get(job.packJobId).jobs, {
                            packJobId: job.packJobId, packJobQty: item.qty, isNonCartonItem: false
                        }]
                    });
                }
            })
        });
        const jobIds = Array.from(jobIdSet);
        req.extraItems.forEach(item => {
            itemCodes.add(item.itemCode);
            if (!qtyObjectMap.has(item.itemCode)) {
                qtyObjectMap.get(item.itemCode).set(req.packJobItems[0].packJobId, {
                    qty: item.qty, jobs: [
                        {
                            packJobId: req.packJobItems[0].packJobId,
                            packJobQty: item.qty, isNonCartonItem: true
                        }
                    ]
                });
            } else {
                if (!qtyObjectMap.get(item.itemCode).has(req.packJobItems[0].packJobId)) {
                    qtyObjectMap.get(item.itemCode).set(req.packJobItems[0].packJobId, {
                        qty: 0, jobs: []
                    });
                }
                qtyObjectMap.get(item.itemCode).set(req.packJobItems[0].packJobId, {
                    qty: qtyObjectMap.get(item.itemCode).get(req.packJobItems[0].packJobId).qty + item.qty, jobs: [...qtyObjectMap.get(item.itemCode).get(req.packJobItems[0].packJobId).jobs, {
                        packJobId: req.packJobItems[0].packJobId, packJobQty: item.qty, isNonCartonItem: true
                    }]
                });
            }
        });

        const moNumbersForJobs = await this.pmInfoService.getMoNumbersForJobNumber(jobIds, req.unitCode, req.companyCode);
        const bomInfoForPackJobs = await this.pmInfoService.getStockInfoForGivenItems(req.unitCode, req.companyCode, moNumbersForJobs, Array.from(itemCodes));
        const itemCodeDetailMap = new Map<string, Map<string, { objectCode: string, locationCode: string, supplierCode: string, vpo: string, objectType: string }>>();
        for (const [itemCode, stockDetails] of bomInfoForPackJobs) {
            const allocatedObject = Array.from(new Set(allocationMap.get(itemCode).keys()));
            for (const stock of stockDetails) {
                if (!allocatedObject.includes(stock.barcode)) {
                    continue;
                }
                if (!itemCodeDetailMap.has(stock.itemCode)) {
                    const map = new Map<string, { objectCode: string, locationCode: string, supplierCode: string, vpo: string, objectType: string }>();
                    map.set(stock.barcode, {
                        objectCode: stock.barcode,
                        locationCode: stock.locationCode,
                        supplierCode: stock.supplierCode,
                        vpo: stock.vpo,
                        objectType: stock.objectType
                    })
                    itemCodeDetailMap.set(stock.itemCode, map);
                }
                if (allocationMap.get(itemCode).get(stock.barcode) > stock.leftOverQuantity) {
                    throw new ErrorResponse(36033, 'Allocated quantity is greater than left over quantity');
                }
            }
        }

        //object code mapping

        let savedMaterialRequestId = null;
        const res = await this.executeWithTransaction(async (transactionManager) => {
            const matReqEntity = new PackMaterialRequestEntity();

            matReqEntity.packList = req.packListId;
            matReqEntity.matReqBy = req.username;
            const matReqOn: any = new Date();
            matReqEntity.matReqOn = matReqOn;
            const preFix = 'RM:' + Number(req.poId).toString(16) + '-' + Number(req.packListId);
            const countData = await this.sequenceHandlingService.getSequenceNumber(preFix, transactionManager);
            matReqEntity.requestNo = `${preFix}-${countData}`;

            matReqEntity.matFulfillmentDateTime = req.planCloseDate;
            matReqEntity.companyCode = req.companyCode;
            matReqEntity.createdUser = req.username;
            matReqEntity.unitCode = req.unitCode;
            const savedMatReqEntity = await transactionManager.getRepository(PackMaterialRequestEntity).save(matReqEntity);
            for (const [itemCode, jobDataMap] of qtyObjectMap) {
                for (const [jobNumber, jobData] of jobDataMap) {
                    for (const job of jobData.jobs) {
                        const pkMatItem = new PackMatReqLinesEntity();
                        pkMatItem.packList = req.packListId;
                        pkMatItem.pkMatReqId = savedMatReqEntity.id;
                        pkMatItem.pkJobId = job.packJobId;
                        pkMatItem.requiredQty = jobData.qty;
                        pkMatItem.items = itemCdeToItemIdMap.get(itemCode);
                        pkMatItem.packList = req.packListId;
                        pkMatItem.companyCode = req.companyCode;
                        pkMatItem.createdUser = req.username;
                        pkMatItem.unitCode = req.unitCode;
                        pkMatItem.isNonCartonItem = job.isNonCartonItem;//extra items are no carton items saved to the first job in the material request
                        const reqLine = await transactionManager.getRepository(PackMatReqLinesEntity).save(pkMatItem);
                        let packJobQty = job.packJobQty;
                        while (packJobQty > 0) {
                            for (const [objectCode, allocationData] of allocationMap.get(itemCode)) {
                                if (allocationData > 0) {
                                    const eligibleToOccupy = Math.min(packJobQty, allocationData);
                                    const packWhMatItem = new PackMatReqWhItemEntity();
                                    packWhMatItem.packWhRequestLineId = reqLine.id;
                                    packWhMatItem.items = itemCdeToItemIdMap.get(itemCode);
                                    packWhMatItem.objectCode = objectCode;
                                    packWhMatItem.requiredQty = eligibleToOccupy;
                                    packWhMatItem.allocatedQty = eligibleToOccupy;
                                    packWhMatItem.issuedQty = 0;
                                    packWhMatItem.locationCode = itemCodeDetailMap.get(itemCode).get(objectCode).locationCode;
                                    packWhMatItem.supplierCode = itemCodeDetailMap.get(itemCode).get(objectCode).supplierCode;
                                    packWhMatItem.vpo = itemCodeDetailMap.get(itemCode).get(objectCode).vpo;
                                    packWhMatItem.objectType = itemCodeDetailMap.get(itemCode).get(objectCode).objectType;
                                    packWhMatItem.companyCode = req.companyCode;
                                    packWhMatItem.createdUser = req.username;
                                    packWhMatItem.unitCode = req.unitCode;
                                    await transactionManager.getRepository(PackMatReqWhItemEntity).save(packWhMatItem);
                                    packJobQty = packJobQty - eligibleToOccupy;
                                }
                            }
                        }
                    }
                }
            }
            await transactionManager.getRepository(JobHeaderEntity).update({ id: In(jobIds), companyCode: req.companyCode, unitCode: req.unitCode }, { pkMatReqId: savedMatReqEntity.id, pkMatReqNo: savedMatReqEntity.requestNo });
            savedMaterialRequestId = savedMatReqEntity.id;
            return new GlobalResponseObject(true, 36031, 'Pack List saved successfully');
        });
        // Need to send the request details to WMS
        const reqIdObj = new PKMS_C_JobTrimReqIdRequest(username, unitCode, companyCode, userId, savedMaterialRequestId);
        await this.wmsPackTrimService.allocatePackTrimsByRequestId(reqIdObj);
        return res;
    }


    async getPAckMaterialsByPackListID(req: PackMAterialRequest): Promise<PackMaterialResponse> {
        const data: PackMAterialsForPackLists[] = []
        const packMAterials = await this.pmrRepo.getPackMaterialsByPkMrnStatus(req)
        if (!packMAterials.length) {
            throw new ErrorResponse(36032, 'material req are not found')
        }
        for (const rec of packMAterials) {
            const mrnRecords = new PackMAterialsForPackLists(rec.req_id, rec.request_no, rec.request_status, rec.mat_request_on, rec.mat_request_by, rec.mat_fulfill_date_time)
            data.push(mrnRecords)
        }
        return new PackMaterialResponse(true, 36033, 'Pack Materials retrieved Successfully', data)
    }

    async getPackMaterialSummaryDataById(req: PackMatReqID): Promise<PackMaterialSummaryResponse> {
        const data = []
        const mrnSummaryData = await this.pmrLineRepo.getPackMaterialSummaryDataById(req);
        if (!mrnSummaryData.length) {
            throw new ErrorResponse(36034, 'There Is No Items Mapped');
        }
        for (const rec of mrnSummaryData) {
            const mrnSumRec = new PackMatSummaryModel(rec.pack_jobs, rec.item_id, rec.item_code, Number(rec.qty), rec.item_category, rec.map_id, Number(rec.issued_qty));
            data.push(mrnSumRec);
        }
        return new PackMaterialSummaryResponse(true, 36035, 'Pack Material Summary Retrieved', data);
    };



    async approvePMRNo(req: PackMatReqID): Promise<GlobalResponseObject> {
        const userReq = { companyCode: req.companyCode, unitCode: req.unitCode }
        const findExistedRecord = await this.pmrRepo.findOne({ where: { id: req.mrnID, ...userReq } });
        if (!findExistedRecord) {
            throw new ErrorResponse(36036, "Please Provide Valid Material Request Id")
        }

        const statusObj = {
            [PackListMrnStatusEnum['OPEN']]: { status: PackListMrnStatusEnum.OPEN, message: 'OPEN' },
            [PackListMrnStatusEnum['APPROVED']]: { status: PackListMrnStatusEnum.APPROVED, message: 'APPROVED' },
            [PackListMrnStatusEnum['REJECTED']]: { status: PackListMrnStatusEnum.REJECTED, message: 'REJECTED' },
            [PackListMrnStatusEnum['ISSUED']]: { status: PackListMrnStatusEnum.ISSUED, message: 'ISSUED' },
        }
        const en = new PackMaterialRequestEntity();
        en.requestStatus = statusObj[req.status]['status'];
        return this.executeWithTransaction(async (transactionManager) => {
            const fullyIssued = new Set<boolean>();
            if (req.status === PackListMrnStatusEnum.ISSUED) {
                en.matStatus = PackMatReqStatusEnum.MATERIAL_ISSUED
                for (const qty of req.issuedQty) {
                    fullyIssued.add(qty.issuedQty >= qty.requiredQty)
                    const entity = new PackMatReqLinesEntity();
                    entity.issuedQty = qty.issuedQty;
                    entity.updatedUser = req.username;
                    await transactionManager.getRepository(PackMatReqLinesEntity).update({ id: qty.mapId, companyCode: req.companyCode, unitCode: req.unitCode }, entity)
                }
            };
            if (!fullyIssued.has(false))
                await transactionManager.getRepository(PackMaterialRequestEntity).update({ id: req.mrnID, ...userReq }, en)
            return new GlobalResponseObject(true, 36037, `Material Has Been ${statusObj[req.status]['message']} Successfully`)

        })

    }

    async updateIssuedPackMaterialFromWms(req: WMS_C_IssuanceIdRequest): Promise<GlobalResponseObject> {
        const { issuanceId, unitCode, companyCode, userId, username } = req;

        const issuedInfo: WMS_R_IssuanceIdItemsResponse = await this.wmsPackTrimService.getIssuedItemsUnderIssuanceId(req);
        if (!issuedInfo.status) {
            throw new ErrorResponse(issuedInfo.errorCode, issuedInfo.internalMessage)
        };
        const existingIssuanceInfo: PackWhJobMaterialIssuanceEntity[] = await this.whMaterialIssuance.find({ where: { issuanceId, unitCode, companyCode } });
        if (existingIssuanceInfo.length) {
            throw new ErrorResponse(0, 'Issuance Already done for this id, Please check and try again');
        }
        const actIssuanceData: WMS_R_IssuanceIdItemsModel[] = issuedInfo.data;
        const jobNumbersAdded = new Set<string>();
        const jobItemColorSizeQtyMap = new Map<string, Map<string, number>>();
        const whLineWiseIssuedQty = new Map<number, number>();
        return this.executeWithTransaction(async (manager) => {
            for (const eachIssuance of actIssuanceData) {
                const whReqDetails = await this.pmrRepo.findOne({ where: { id: Number(eachIssuance.extRefId), unitCode, companyCode } });
                if (!whReqDetails) {
                    throw new ErrorResponse(0, 'Warehouse request not found for the given details. Please check and try again')
                }
                const whReqLineInfo = await this.pmrLineRepo.find({ where: { pkMatReqId: whReqDetails.id, unitCode, companyCode }, select: ['id'] });
                if (!whReqLineInfo.length) {
                    throw new ErrorResponse(0, 'Request jobs not found for the given warehouse request id');
                };
                const allLines: number[] = [];
                for (const eachWhReqLine of whReqLineInfo) {
                    allLines.push(eachWhReqLine.id);
                }
                const objectRelatedLines = await manager.getRepository(PackMatReqWhItemEntity).find({ where: { packWhRequestLineId: In(allLines), unitCode, companyCode, objectCode: eachIssuance.barcode } });
                if (!objectRelatedLines.length) {
                    throw new ErrorResponse(0, 'Allocation data not found for the details' + `${eachIssuance.extRefId} - ${eachIssuance.itemCode} - ${eachIssuance.barcode}`);
                };
                let barcodeIssuedQty = eachIssuance.issuedQty;
                let totalAllocatedQty = 0;
                while (barcodeIssuedQty > 0) {
                    for (const eachObjectLine of objectRelatedLines) {
                        const pendingToIssuance = eachObjectLine.allocatedQty - eachObjectLine.issuedQty;
                        const allowableQty = Math.min(barcodeIssuedQty, pendingToIssuance);
                        totalAllocatedQty += allowableQty;
                        if (allowableQty > 0) {
                            const updatedQty = eachObjectLine.allocatedQty + Number(allowableQty);
                            await manager.getRepository(PackMatReqWhItemEntity).update({ id: eachObjectLine.id, unitCode, companyCode }, { issuedQty: updatedQty, updatedUser: req.username });
                            const lineInfo = await this.pmrLineRepo.findOne({ where: { id: eachObjectLine.packWhRequestLineId, unitCode, companyCode } });
                            const jobData = await this.jobHeader.findOne({ where: { id: lineInfo.pkJobId, unitCode, companyCode } });
                            const itemData = await this.itemRepo.findOne({ where: { id: lineInfo.items, unitCode, companyCode } });
                            if (!whLineWiseIssuedQty.has(eachObjectLine.packWhRequestLineId)) {
                                whLineWiseIssuedQty.set(eachObjectLine.packWhRequestLineId, 0);
                            };
                            const preQty = whLineWiseIssuedQty.get(eachObjectLine.packWhRequestLineId);
                            whLineWiseIssuedQty.set(eachObjectLine.packWhRequestLineId, preQty + pendingToIssuance);
                            if (!jobItemColorSizeQtyMap.has(jobData.jobNumber)) {
                                jobItemColorSizeQtyMap.set(jobData.jobNumber, new Map<string, number>());
                            }
                            if (!jobItemColorSizeQtyMap.get(jobData.jobNumber).has(itemData.code)) {
                                jobItemColorSizeQtyMap.get(jobData.jobNumber).set(itemData.code, 0)
                            };
                            const preQtyOfJob = jobItemColorSizeQtyMap.get(jobData.jobNumber).get(itemData.code)
                            jobItemColorSizeQtyMap.get(jobData.jobNumber).set(itemData.code, preQtyOfJob + allowableQty);
                            jobNumbersAdded.add(jobData.jobNumber);
                            const issuanceObj = new PackWhJobMaterialIssuanceEntity();
                            issuanceObj.allocatedQty = eachObjectLine.allocatedQty;
                            issuanceObj.companyCode = companyCode;
                            issuanceObj.createdUser = username;
                            issuanceObj.issuanceId = issuanceId;
                            issuanceObj.issuedQty = eachIssuance.issuedQty;
                            issuanceObj.itemCode = eachIssuance.itemCode;
                            issuanceObj.jobNumber = jobData.jobNumber;
                            issuanceObj.objectCode = eachIssuance.barcode;
                            issuanceObj.unitCode = unitCode;
                            issuanceObj.reportedWeight = 0;
                            await manager.getRepository(PackWhJobMaterialIssuanceEntity).save(issuanceObj);
                            barcodeIssuedQty -= allowableQty;
                        }
                    }
                    if (barcodeIssuedQty > 0) {
                        throw new ErrorResponse(0, `Issued more than the requested qty for the barcode ${eachIssuance.barcode} , Pending for the issuance is : ${totalAllocatedQty} But issued qty is : ${eachIssuance.issuedQty}`);
                    }
                }
                await manager.getRepository(PackMaterialRequestEntity).update({ id: whReqDetails.id }, { requestStatus: PackListMrnStatusEnum.ISSUED, matStatus: PackMatReqStatusEnum.MATERIAL_ISSUED, updatedUser: username });
                // throw null;
            };

            for (const [lineId, qty] of whLineWiseIssuedQty) {
                await manager.getRepository(PackMatReqLinesEntity).update({ id: lineId }, { issuedQty: qty, updatedUser: username });
            }
            return new GlobalResponseObject(true, 0, 'Material Issued Successfully for the jobs')
        })
    }
}