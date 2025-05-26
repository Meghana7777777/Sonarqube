import { Inject, Injectable, LoggerService } from "@nestjs/common";
import { ErrorResponse } from "@xpparel/backend-utils";
import { CommonResponse, GlobalResponseObject, InsStatusEnum, PKMSAttributesNamesAndValues, PKMSInsCartonsDto, PKMSInsDetailsResponseDto, PKMSInsReqIdDto, PKMSInsStatusReqDto, PKMSInsSummeryCartonsDto, PKMSInspectionHeaderAttributesEnum, PKMSInspectionHeaderDto, PKMSIrActivityChangeRequest, PKMSPendingMaterialResponse, PKMSUploadedFiles, PackActivityStatusEnum, PackFinalInspectionStatusEnum, PackInsMaterialEnum, PackInsMaterialTypeEnum, PackInspectionCreateRequest, PackFabricInspectionRequestCategoryEnum, PackLinesObjectTypeEnum, PackListAndPoIdsReqDto, PackListIdRequest, PkInsRatioModel, PoReqModel, ReferenceFeaturesEnum, SystematicPreferenceModel, SystematicPreferenceReqModel, SystematicPreferenceResponse } from "@xpparel/shared-models";
import moment from 'moment';
import { DataSource, In, Not } from "typeorm";
import { TransactionalBaseService } from "../../../base-services";
import { ITransactionManager } from "../../../database/typeorm-transactions";
import { FileMetadataDTO } from "../../__common__/dto/file-meta-data-dto";
import { SequenceHandlingService } from "../../__common__/sequence-handling/sequence-handling.service";
import { CartonParentHierarchyEntity } from "../../packing-list/entities/carton-config-parent-hierarchy.entity";
import { ConfigLeastChildEntity } from "../../packing-list/entities/config-least-child.entity";
import { CrtnEntity } from "../../packing-list/entities/crtns.entity";
import { JobHeaderEntity } from "../../packing-list/entities/job-header.entity";
import { PLConfigEntity } from "../../packing-list/entities/pack-list.entity";
import { PLConfigRepoInterface } from "../../packing-list/repositories/config-repo.interface";
import { PackInsRequestItemEntity } from "../entites/ins-request-items.entity";
import { PackInsRequestAttributeEntity } from "../entites/pkms-ins-request-attributes.entity";
import { PackInsRequestEntity } from "../entites/request.entity";
import { ItemsEntity } from "../items/entities/items.entity";
import { InspectionPreferenceEntity } from "./entites/inspection-preference.entity";
import { InspectionPreferenceRepoInterface } from "./repository/inspection-preference-repo-interface";
import { PackInsReqRepository } from "./repository/pack-ins-req-repository";
import { PKReqAttributesRepository } from "./repository/pk-ins-req-attributes-repository";
import { PKReqItemsRepository } from "./repository/pk-req-items-repository";

import * as fs from 'fs';
import path from "path";
import { RejectedReasonsEntity } from "../rejected-reasons/entities/rejected-reasons.entity";
import { ContainerGroupCreationService } from "../../location-allocation/container-group-creation.service";
import dayjs from "dayjs";
import { FileUploadEntity } from "../../__common__/file-upload/entity/file-upload.entity";
import { PKMSProcessingOrderEntity } from "../../pre-integrations/pkms-po-entities/pkms-processing-order-entity";

const fileDestination = path.join(__dirname, '../../../../packages/services/packing-management/upload_files')

@Injectable()
export class InspectionPreferenceService extends TransactionalBaseService {


    constructor(
        @Inject('InspectionPreferenceRepoInterface')
        private readonly ipRepo: InspectionPreferenceRepoInterface,
        @Inject('PLConfigRepoInterface')
        private readonly plRepo: PLConfigRepoInterface,
        @Inject('PackInsReqRepoInterface')
        private readonly pkInsRepo: PackInsReqRepository,
        @Inject('PkReqItemsRepoInterface')
        private readonly pkInsReqItemsRepo: PKReqItemsRepository,
        @Inject('PkReqAttributesRepoInterface')
        private readonly pkAttributesReqRepo: PKReqAttributesRepository,
        @Inject('LoggerService')
        logger: LoggerService,
        @Inject('TransactionManager')
        transactionManager: ITransactionManager,
        public sequenceHandlingService: SequenceHandlingService,
        private containerGroupCreation: ContainerGroupCreationService,
        public dataSource: DataSource
    ) {
        super(transactionManager, logger)
    }

    async saveSystematicPreference(req: SystematicPreferenceReqModel): Promise<GlobalResponseObject> {
        const packLists = await this.plRepo.find({ where: { poId: req.po } })
        if (!packLists.length) {
            throw new ErrorResponse(36039, 'PackList not found');
        }
        return this.executeWithTransaction(async (transactionManager) => {
            const isExist = await transactionManager.getRepository(InspectionPreferenceEntity).findOne({ select: ['id'], where: { po: req.po } })
            const insEntity = new InspectionPreferenceEntity()
            if (isExist) {
                insEntity.id = isExist.id
            }
            insEntity.companyCode = req.companyCode
            insEntity.unitCode = req.unitCode;
            // insEntity.insSelectionType = req.insSelectionType
            insEntity.pickPercentage = req.pickPercentage
            insEntity.po = req.po
            insEntity.packJobId = null
            insEntity.ipStatus = InsStatusEnum.OPEN
            insEntity.remarks = req.remarks
            insEntity.inspections = req.inspectionType.toString()
            await transactionManager.getRepository(InspectionPreferenceEntity).save(insEntity);
            return new GlobalResponseObject(true, 36040, 'Saved Successfully')
        })
    }

    async getSystemPreferences(req: PoReqModel): Promise<SystematicPreferenceResponse> {
        const preferences = await this.ipRepo.getSystemPreferences(req);
        if (preferences) {
            const data = new SystematicPreferenceModel(preferences?.po, null, preferences.pick_percentage, preferences.remarks, preferences.inspections.split(','))
            return new SystematicPreferenceResponse(true, 254, '', data)
        } else {
            throw new ErrorResponse(924, 'No data found')
        }
    }


    async createDefaultInspReqForInspCategories(inspReqDetails: PackInspectionCreateRequest[]): Promise<GlobalResponseObject> {
        return this.executeWithTransaction(async (transactionManager) => {
            const unitCode: string = inspReqDetails[0].unitCode;
            const companyCode: string = inspReqDetails[0].companyCode;
            const poId = inspReqDetails[0].poId;
            const cartonBarCodes = new Set<string>();
            for (const inspReqDetail of inspReqDetails) {
                for (const rollInfo of inspReqDetail.cartonBarCodes) {
                    cartonBarCodes.add(rollInfo);
                }
            }
            for (const inspReqDetail of inspReqDetails) {
                const prefInspections = await this.ipRepo.findOne({ select: ['inspections', 'pickPercentage'], where: { po: poId, unitCode, companyCode } })
                //   const allRollsOfPh = await this.packingListInfoService.getRollIdsByPhId(phId, inspReqDetail.refNumber, unitCode, companyCode);
                const attributes = [];
                const style = new Set<string>();
                const packListNo = new Set<string>();
                const po = new Set<string>();
                const buyerAddress = new Set<string>();
                for (const ins of prefInspections.inspections.split(',')) {
                    const findExistedInsReq = await this.dataSource.getRepository(PackInsRequestEntity).findOne({ where: { requestCategory: PackFabricInspectionRequestCategoryEnum[ins], packListId: inspReqDetail.packListId } })
                    if (findExistedInsReq && findExistedInsReq.pickPercentage === prefInspections.pickPercentage) {
                        continue
                    } else {
                        //TODO:
                    }
                    if (PackFabricInspectionRequestCategoryEnum[ins] === PackFabricInspectionRequestCategoryEnum.PRE_INSPECTION) {
                        const req: PackListIdRequest = new PackListIdRequest(inspReqDetail.username, inspReqDetail.unitCode, inspReqDetail.companyCode, inspReqDetail.userId, inspReqDetail.packListId);
                        await this.containerGroupCreation.createContainerGroupsForPackList(req, true);
                    }
                    const unitCode = inspReqDetail.unitCode;
                    const companyCode = inspReqDetail.companyCode;
                    // checking packing list exists or not for PO
                    // const poOrderE = new PackOrderEntity();
                    // poOrderE.id = inspReqDetail.poId
                    const phDetails = await transactionManager.getRepository(PLConfigEntity).findOne({ where: { poId: inspReqDetail.poId, companyCode, unitCode } });
                    if (!phDetails) {
                        throw new ErrorResponse(36041, 'Packing list header not found. Please check.');
                    }
                    // need to get ph line Id
                    // getting last request number for a packing list number
                    const lastReqNum = await this.sequenceHandlingService.getSequenceNumber(`${inspReqDetail.poId}-ins-`, transactionManager);
                    const preFix = 'R';
                    const reqCode = `${preFix}-${unitCode}-${inspReqDetail.packListId}-${lastReqNum}`;
                    // need to create the inspection header and assign rolls to the inspection header
                    const inspHeaderEntityObj = new PackInsRequestEntity();
                    inspHeaderEntityObj.companyCode = companyCode;
                    inspHeaderEntityObj.createdUser = inspReqDetail.username;
                    inspHeaderEntityObj.finalInspectionStatus = PackFinalInspectionStatusEnum.OPEN;
                    inspHeaderEntityObj.insActivityStatus = PackActivityStatusEnum.OPEN;
                    inspHeaderEntityObj.insCode = reqCode;
                    inspHeaderEntityObj.pickPercentage = prefInspections.pickPercentage;
                    inspHeaderEntityObj.insCompletedAt = null;
                    inspHeaderEntityObj.insCreationTime = moment(Date.now()).toDate();
                    // TODO : get inspection material type AND material
                    inspHeaderEntityObj.insMaterial = PackInsMaterialEnum.Carton;
                    inspHeaderEntityObj.insMaterialType = PackInsMaterialTypeEnum.FG;
                    inspHeaderEntityObj.insStartedAt = null;
                    inspHeaderEntityObj.materialReceiveAt = null;
                    inspHeaderEntityObj.requestCategory = PackFabricInspectionRequestCategoryEnum[ins]
                    // If request fails need to insert another request
                    // inspHeaderEntityObj.parentRequestId = parentRequestId ? parentRequestId : null;
                    // inspHeaderEntityObj.insRequestRevision = insRequestRevisionId ? insRequestRevisionId : null;
                    inspHeaderEntityObj.poId = inspReqDetail.poId;

                    inspHeaderEntityObj.packListId = inspReqDetail.packListId;
                    inspHeaderEntityObj.inspectionLevel = inspReqDetail.inspectionLevel;
                    inspHeaderEntityObj.refNumber = inspReqDetail.refNumber;
                    // TODO: Need to develop a logic for priority
                    inspHeaderEntityObj.priority = 0;
                    inspHeaderEntityObj.remarks = null;
                    inspHeaderEntityObj.sla = inspReqDetail.sla;
                    inspHeaderEntityObj.unitCode = unitCode;
                    // NEED TO INSERT INSPECTION ATTRIBUTES BASED ON THE INSPECTION CATEGORY
                    // GETTING INSPECTION HEADER ATTRIBUTES

                    const inspReqId = await transactionManager.getRepository(PackInsRequestEntity).save(inspHeaderEntityObj);
                    const mappingEntities = [];
                    for (const eachRoll of inspReqDetail.cartonBarCodes) {
                        const inspReqItem = new PackInsRequestItemEntity();
                        inspReqItem.acceptance = null;
                        inspReqItem.acceptedQuantity = 0;
                        inspReqItem.packListId = inspReqDetail.packListId;
                        inspReqItem.companyCode = companyCode;
                        inspReqItem.createdUser = inspReqDetail.username;
                        inspReqItem.insCompletedAt = null;
                        inspReqItem.insRequestId = inspReqId.id;
                        inspReqItem.insStartedAt = null;
                        inspReqItem.inspectionPerson = null;
                        // inspReqItem.inspectionResult = InspectionResultEnum.OPEN;
                        inspReqItem.inspectionResult = PackFinalInspectionStatusEnum.OPEN;
                        inspReqItem.finalInspectionResult = PackFinalInspectionStatusEnum.OPEN;
                        inspReqItem.objectType = PackLinesObjectTypeEnum.Carton;
                        // inspReqItem.phItemLineSampleId = reqModel.requestCategory == FabricInspectionRequestCategoryEnum.SHRINKAGE ? (await this.packingListService.getSampleRollIdByRollId(eachRoll, unitCode, companyCode)).sample_roll_id : null;
                        inspReqItem.phItemLineSampleId = null;
                        const crtn = await transactionManager.getRepository(CrtnEntity).findOne({ where: { barcode: eachRoll } });
                        const crtnProto = await transactionManager.getRepository(CartonParentHierarchyEntity).findOne({ where: { id: crtn.cartonProtoId } });
                        const itemCode = await transactionManager.getRepository(ItemsEntity).findOne({ where: { id: crtnProto.itemId } })
                        inspReqItem.phItemLinesId = crtn.id;
                        inspReqItem.quantity = crtn.requiredQty;
                        inspReqItem.remarks = null;
                        inspReqItem.unitCode = unitCode;
                        inspReqItem.workstationCode = null;
                        inspReqItem.styleNumber = crtn.style;
                        inspReqItem.poId = inspReqDetail.poId;
                        inspReqItem.itemCode = itemCode.code;
                        mappingEntities.push(inspReqItem);

                        //TODO: need to add poNumber,address,orderRefNo,destination
                        // const poNumber = await this.dataSource.getRepository(PKMSProcessingOrderEntity).findOne({ select: ['poNumber'], where: { id: inspReqDetail.poId } })
                        const pkListId = await this.dataSource.getRepository(PLConfigEntity).findOne({ select: ['plConfigNo'], where: { id: inspReqDetail.packListId } })
                        // po.add(poNumber.poNumber);
                        style.add(crtn.style);
                        packListNo.add(pkListId.plConfigNo)
                        // buyerAddress.add(crtn.buyerAddress)
                    }
                    // attributes.push(this.getAttributesEntity(PKMSInspectionHeaderAttributes.COLOR, crtn.colors.toString(), unitCode, companyCode, inspReqDetail.username, inspReqId.id));

                    attributes.push(this.getAttributesEntity(PKMSInspectionHeaderAttributesEnum.STYLE_NO, [...style].join(','), unitCode, companyCode, inspReqDetail.username, inspReqId.id));
                    attributes.push(this.getAttributesEntity(PKMSInspectionHeaderAttributesEnum.BUYER, [...buyerAddress].join(','), unitCode, companyCode, inspReqDetail.username, inspReqId.id));
                    attributes.push(this.getAttributesEntity(PKMSInspectionHeaderAttributesEnum.PO_NO, [...po].join(','), unitCode, companyCode, inspReqDetail.username, inspReqId.id));
                    attributes.push(this.getAttributesEntity(PKMSInspectionHeaderAttributesEnum.PACKING_LIST_NUMBER, [...packListNo].join(','), unitCode, companyCode, inspReqDetail.username, inspReqId.id));
                    await transactionManager.getRepository(PackInsRequestItemEntity).save(mappingEntities);

                    await transactionManager.getRepository(PackInsRequestAttributeEntity).save(attributes);
                }

            }
            for (const cartonBarCode of cartonBarCodes) {
                await transactionManager.getRepository(CrtnEntity).update({ barcode: cartonBarCode }, { inspectionPick: true });
            }
            return new GlobalResponseObject(true, 36042, 'Inspection Confirmed successfully.');
        })

    }

    getAttributesEntity(attName: PKMSInspectionHeaderAttributesEnum, attValue: string, unitCode: string, companyCode: string, userName: string, inspId: number) {
        const inspReqAttributes = new PackInsRequestAttributeEntity();
        inspReqAttributes.attributeName = attName;
        inspReqAttributes.attributeValue = attValue;
        inspReqAttributes.companyCode = companyCode;
        inspReqAttributes.createdUser = userName;
        inspReqAttributes.insRequestId = inspId;
        inspReqAttributes.unitCode = unitCode;
        return inspReqAttributes;
    }



    async getInspectionMaterialPendingData(req: PackListAndPoIdsReqDto): Promise<CommonResponse> {
        const whereClause = new PackInsRequestEntity();
        if (req.poId) {
            whereClause.poId = req.poId;
        }
        if (req.packListId) {
            whereClause.packListId = req.packListId;
        }
        whereClause.insActivityStatus = req.insActivityStatus;
        whereClause.companyCode = req.companyCode;
        whereClause.unitCode = req.unitCode;
        whereClause.requestCategory = req.inspectionType
        const insReqData = await this.pkInsRepo.find({ where: { ...whereClause } });
        const data: PKMSPendingMaterialResponse[] = [];
        for (const rec of insReqData) {
            const buyer = await this.pkAttributesReqRepo.findOne({ select: ['attributeValue'], where: { insRequestId: rec.id, attributeName: PKMSInspectionHeaderAttributesEnum.BUYER } });
            const style = await this.pkAttributesReqRepo.findOne({ select: ['attributeValue'], where: { insRequestId: rec.id, attributeName: PKMSInspectionHeaderAttributesEnum.STYLE_NO } });
            const poNumber = await this.pkAttributesReqRepo.findOne({ select: ['attributeValue'], where: { insRequestId: rec.id, attributeName: PKMSInspectionHeaderAttributesEnum.PO_NO } });
            const packListNo = await this.pkAttributesReqRepo.findOne({ select: ['attributeValue'], where: { insRequestId: rec.id, attributeName: PKMSInspectionHeaderAttributesEnum.PACKING_LIST_NUMBER } });
            const items = await this.pkInsReqItemsRepo.find({ select: ['phItemLinesId'], where: { insRequestId: rec.id } });
            let crtnsQty: number = 0;
            let totalPassed = 0;
            let totalFail = 0;
            for (const item of items) {
                const carton = await this.dataSource.getRepository(CrtnEntity).findOne({ where: { id: item.phItemLinesId } })
                crtnsQty += carton.requiredQty;
                if (item.inspectionResult === PackFinalInspectionStatusEnum.PASS) totalPassed++
                if (item.inspectionResult === PackFinalInspectionStatusEnum.FAIL) totalFail++
            }
            data.push(new PKMSPendingMaterialResponse(rec.insCode, rec.id, rec.finalInspectionStatus, undefined, buyer?.attributeValue, style?.attributeValue, poNumber?.attributeValue, packListNo?.attributeValue, rec.insCreationTime, rec.createReRequest, crtnsQty, rec.requestCategory, rec.materialReceiveAt, String(rec.insCreationTime), rec.insStartedAt, rec.insCompletedAt, rec.insActivityStatus === PackActivityStatusEnum.RECEIVED, rec.insActivityStatus === PackActivityStatusEnum.INPROGRESS, rec.insActivityStatus === PackActivityStatusEnum.COMPLETED, totalFail, '', [], totalPassed))

        }
        if (!data.length) {
            throw new ErrorResponse(965, "Data Not Found")
        }
        return new CommonResponse(true, 36043, "Ins Pending Materials Retrieved Successfully", data)
    }



    async updatePMSInspectionActivityStatus(req: PKMSIrActivityChangeRequest): Promise<GlobalResponseObject> {
        // check if the inspection status is not the same or it is higher in the hierarchy
        const userReq = { companyCode: req.companyCode, unitCode: req.unitCode }

        // const irRecord = await this.pkInsRepo.findOne({ select: ['id', 'insActivityStatus'], where: { id: req.insReqId, companyCode: req.companyCode, unitCode: req.unitCode } });
        // if (!irRecord) {
        //     throw new ErrorResponse(36044, 'Inspection request is invalid');
        // }
        // const inComingActivity = req.insCurrentActivity;
        // const currentActivity = irRecord.insActivityStatus;
        // const date = req.changeDateTime;
        // // Validation
        // if (inComingActivity == PackActivityStatusEnum.RECEIVED) {
        //     // if the incoming is open, then the pre has to be open
        //     if (currentActivity != PackActivityStatusEnum.OPEN) {
        //         throw new ErrorResponse(36045, 'The Inspection flow is incorrect. PENDING -> MATERIAL RECEIVED -> PROGRESS -> COMPLETED ');
        //     }
        //     await this.pkInsRepo.update({ id: req.insReqId, companyCode: req.companyCode, unitCode: req.unitCode }, { insActivityStatus: inComingActivity, remarks: req.remarks, materialReceiveAt: date });
        //     return new GlobalResponseObject(true, 0, 'Inspection request status changed successfully');
        // } else if (inComingActivity == PackActivityStatusEnum.INPROGRESS) {
        //     if (currentActivity != PackActivityStatusEnum.RECEIVED) {
        //         throw new ErrorResponse(36045, 'The Inspection flow is incorrect. PENDING -> MATERIAL RECEIVED -> PROGRESS -> COMPLETED ');
        //     }
        // } else if (inComingActivity == PackActivityStatusEnum.COMPLETED) {
        //     if (currentActivity != PackActivityStatusEnum.INPROGRESS) {
        //         throw new ErrorResponse(36045, 'The Inspection flow is incorrect. PENDING -> MATERIAL RECEIVED -> PROGRESS -> COMPLETED ');
        //     }
        // }
        // // now change the status 
        // const pkInsE = new PackInsRequestEntity();
        // pkInsE.insActivityStatus = inComingActivity
        // pkInsE.remarks = req.remarks
        // pkInsE.materialReceiveAt = date
        // if (inComingActivity === PackActivityStatusEnum.INPROGRESS) {
        //     pkInsE.insStartedAt = dayjs().format('YYYY-MM-DD H:mm:ss');
        //     await this.pkInsReqItemsRepo.update({ insRequestId: req.insReqId, ...userReq }, { insStartedAt: dayjs().format('YYYY-MM-DD H:mm:ss') });

        // }

        // await this.pkInsRepo.update({ id: req.insReqId, companyCode: req.companyCode, unitCode: req.unitCode }, pkInsE)
        return new GlobalResponseObject(true, 36046, 'Inspection request status changed successfully');
    }

    async getPKMSInsCartonsData(req: PKMSInsReqIdDto): Promise<CommonResponse> {
        const userReq = { companyCode: req.companyCode, unitCode: req.unitCode }
        const insReqWhereClause: any = { ...userReq };
        if (req?.cartonNo) {
            const findCartonId = await this.dataSource.getRepository(CrtnEntity).findOne({ select: ['id'], where: { barcode: req.cartonNo, ...userReq } })
            insReqWhereClause.phItemLinesId = findCartonId?.id;
        }
        insReqWhereClause.insRequestId = req.insReqId;
        const findInsItemsReqData = await this.pkInsReqItemsRepo.find({ where: { ...insReqWhereClause } });
        const findInsReqData = await this.pkInsRepo.findOne({ where: { id: req.insReqId } });
        const packListData = await this.dataSource.getRepository(PLConfigEntity).findOne({ where: { id: findInsReqData.packListId, ...userReq } })
        const data: PKMSInsCartonsDto[] = [];
        const attributes: PKMSAttributesNamesAndValues[] = [];
        const findAttributes = await this.pkAttributesReqRepo.find({ where: { insRequestId: req.insReqId, ...userReq } });
        for (const rec of findAttributes) {
            attributes.push(new PKMSAttributesNamesAndValues(rec.attributeName, rec.attributeValue))
        };
        for (const items of findInsItemsReqData) {
            const findCartons = await this.dataSource.getRepository(CrtnEntity).findOne({ where: { id: items.phItemLinesId, ...userReq } })
            const findPackJob = await this.dataSource.getRepository(JobHeaderEntity).findOne({ where: { id: findCartons.pkJobId, ...userReq } })
            // const poOrderE = new PackOrderEntity();
            // poOrderE.id = findInsReqData.poId
            const cLeastChild = await this.dataSource.getRepository(ConfigLeastChildEntity).find({ select: ['ratio', 'size', 'color'], where: { poId: findInsReqData.poId } });
            const colors = [];
            const mapForCLeastChild = new Map<string, PkInsRatioModel>();
            for (const rec of cLeastChild) {
                if (!mapForCLeastChild.get(rec.size + rec.color)) {
                    mapForCLeastChild.set(rec.size + rec.color, new PkInsRatioModel(rec.size, rec.ratio))
                } else {
                    mapForCLeastChild.get(rec.size + rec.color).ratio += rec.ratio;
                }
                colors.push(rec.color);
            }
            const removeDuplicates = [...new Set(colors)];
            const findFiles = await this.dataSource.getRepository(FileUploadEntity).findOne({ where: { featuresRefNo: items?.id, featuresRefName: ReferenceFeaturesEnum.INS_CARTONS, ...userReq } });

            //TODO: need to add poNumber,address,orderRefNo,destination
            const result = new PKMSInsCartonsDto(findCartons.barcode, undefined, findCartons.style, removeDuplicates.join(','), Array.from(mapForCLeastChild.values()), findCartons.requiredQty, undefined, findCartons.exfactory, packListData.plConfigNo, undefined, findPackJob.jobNumber, [], new PKMSUploadedFiles(findFiles?.fileName, findFiles?.id), items.inspectionResult, items.grossWeight, items.netWeight, items.finalInspectionResult, packListData.id);
            data.push(result)
        };
        if (attributes.length) {
            data[0].attributes = attributes;
        }

        return new CommonResponse(true, 967, "Data Retrieved Successfully", data);
    };


    async getInsCartonsSummary(req: PKMSInsReqIdDto): Promise<CommonResponse> {
        const userReq = { companyCode: req.companyCode, unitCode: req.unitCode }
        const findInsReqData = await this.pkInsRepo.findOne({ where: { id: req.insReqId, ...userReq } });
        const attributes: PKMSAttributesNamesAndValues[] = [];
        const findAttributes = await this.pkAttributesReqRepo.find({ where: { insRequestId: req.insReqId, ...userReq } });
        for (const rec of findAttributes) {
            attributes.push(new PKMSAttributesNamesAndValues(rec.attributeName, rec.attributeValue))
        };
        let crtnsQty: number = 0;
        let totalPassed: number = 0;
        let totalFail: number = 0;
        const itemsWhereClause = new PackInsRequestItemEntity();
        itemsWhereClause.insRequestId = req.insReqId;
        itemsWhereClause.companyCode = req.companyCode;
        itemsWhereClause.unitCode = req.unitCode;
        if (req.cartonNo) {
            const findCartonId = await this.dataSource.getRepository(CrtnEntity).findOne({ where: { barcode: req.cartonNo, ...userReq } })
            itemsWhereClause.phItemLinesId = findCartonId.id;
        };
        const items = await this.pkInsReqItemsRepo.find({ where: { ...itemsWhereClause } });
        const crtns: PKMSInsSummeryCartonsDto[] = [];
        for (const item of items) {
            const carton = await this.dataSource.getRepository(CrtnEntity).findOne({ where: { id: item.phItemLinesId } });
            const findFiles = await this.dataSource.getRepository(FileUploadEntity).findOne({ where: { featuresRefNo: item.id, featuresRefName: ReferenceFeaturesEnum.INS_CARTONS, ...userReq } });
            const rejectedReasons = await this.dataSource.getRepository(RejectedReasonsEntity).findOne({ select: ['id', 'reasonName'], where: { id: item.rejectedReason } })
            crtns.push(new PKMSInsSummeryCartonsDto(carton.barcode, carton.id, carton.grossWeight, carton.netWeight, item.inspectionResult, item.grossWeight, item.netWeight, item.finalInspectionResult, item.id, req.insReqId, new PKMSUploadedFiles(findFiles?.fileName, findFiles?.id), rejectedReasons?.id, rejectedReasons?.reasonName));
            crtnsQty += carton.requiredQty;
            if (item.inspectionResult === PackFinalInspectionStatusEnum.PASS) totalPassed++
            if (item.inspectionResult === PackFinalInspectionStatusEnum.FAIL) totalFail++
        };

        const data: PKMSInsDetailsResponseDto = new PKMSInsDetailsResponseDto(attributes, findInsReqData.insCode, findInsReqData.id, findInsReqData.finalInspectionStatus, findInsReqData.insCreationTime, crtnsQty, String(findInsReqData.insStartedAt), String(findInsReqData.insCreationTime), findInsReqData.insCompletedAt, findInsReqData.insActivityStatus === PackActivityStatusEnum.RECEIVED, findInsReqData.insActivityStatus === PackActivityStatusEnum.INPROGRESS, findInsReqData.insActivityStatus === PackActivityStatusEnum.COMPLETED, totalFail, totalPassed, findInsReqData.finalInspectionStatus, findInsReqData.area, findInsReqData.updatedUser, findInsReqData.insMaterialType, findInsReqData.insMaterial, findInsReqData.insStartedAt, findInsReqData.materialReceiveAt, findInsReqData.insCompletedAt, crtns,);

        return new CommonResponse(true, 967, "Data Retrieved Successfully", data)
    }



    async saveInspectionDetails(filesData: FileMetadataDTO[], req: PKMSInspectionHeaderDto): Promise<CommonResponse> {
        const userReq = { companyCode: req.companyCode, unitCode: req.unitCode }
        const insReqItems = [];
        const cartons = [];
        const files = [];
        for (const [index, rec] of req.insCartons.entries()) {
            const item = new PackInsRequestItemEntity();
            item.id = rec.insItemId;
            item.grossWeight = rec.grossWeight;
            item.netWeight = rec.netWeight;
            item.finalInspectionResult = rec.finalInspectionResult;
            item.inspectionResult = rec.inspectionResult;
            item.updatedUser = req.username;
            const findInsReqItem = await this.dataSource.getRepository(PackInsRequestItemEntity).findOne({ select: ['insCompletedAt'], where: { id: rec.insItemId, ...userReq } });
            if (!findInsReqItem?.insCompletedAt) {
                item.insCompletedAt = dayjs().format('YYYY-MM-DD H:mm:ss') as any;
            }
            // const reason = new RejectedReasonsEntity();
            // reason.id = rec.rejectedReason;
            // item.rejectedReason = reason
            item.rejectedReason = rec.rejectedReason
            insReqItems.push(item);
            const cartonsE = new CrtnEntity();
            cartonsE.id = rec.cartonId;
            cartonsE.updatedUser = req.username;
            cartons.push(cartonsE);
            if (filesData[index]) {
                const findExistFile = await this.dataSource.getRepository(FileUploadEntity).findOne({ where: { featuresRefNo: rec.insItemId } });
                const filesEntity = new FileUploadEntity();
                if (findExistFile) {
                    fs.unlinkSync(path.join(fileDestination, findExistFile.fileName));
                    filesEntity.id = findExistFile.id;
                    filesEntity.updatedUser = req.username;
                }
                filesEntity.companyCode = req.companyCode;
                filesEntity.createdUser = req.username;
                filesEntity.featuresRefNo = rec.insItemId;
                filesEntity.fileName = filesData[index].filename;
                filesEntity.fileDescription = filesData[index].filename;
                filesEntity.filePath = filesData[index].path;
                filesEntity.originalName = filesData[index].originalname;
                filesEntity.size = String(filesData[index].size);
                filesEntity.unitCode = req.unitCode;
                filesEntity.featuresRefName = ReferenceFeaturesEnum.INS_CARTONS;
                files.push(filesEntity)
            }
        };
        return await this.executeWithTransaction(async (transactionManager) => {
            await transactionManager.getRepository(PackInsRequestItemEntity).save(insReqItems);
            if (req.finalInspectionStatus !== PackFinalInspectionStatusEnum.OPEN) {
                const pkInsReqStatus = await transactionManager.getRepository(PackInsRequestItemEntity).count({ where: { insRequestId: req.insCartons[0].insReqId, inspectionResult: PackFinalInspectionStatusEnum.OPEN } })
                if (pkInsReqStatus) {
                    throw new ErrorResponse(36047, "Please Select All Cartons")
                }
                const insReq = new PackInsRequestEntity();
                insReq.updatedUser = req.username
                insReq.area = req.area
                // insReq.insStartedAt = req.insStartedAt
                insReq.insCompletedAt = dayjs().format('YYYY-MM-DD H:mm:ss')
                insReq.finalInspectionStatus = req.finalInspectionStatus;
                insReq.insActivityStatus = PackActivityStatusEnum.COMPLETED;
                await transactionManager.getRepository(PackInsRequestEntity).update({ id: req.insCartons[0].insReqId, ...userReq }, insReq);
                await transactionManager.getRepository(PackInsRequestItemEntity).update({ insRequestId: req.insCartons[0].insReqId, ...userReq }, { finalInspectionResult: req.finalInspectionStatus, updatedUser: req.username });
            };
            await transactionManager.getRepository(FileUploadEntity).save(files);
            await transactionManager.getRepository(CrtnEntity).save(cartons);

            return new CommonResponse(true, 36048, "Inspection Updated Successfully");
        })
    };



    async getInspectionStatus(req: PKMSInsStatusReqDto): Promise<CommonResponse> {
        const userReq = { companyCode: req.companyCode, unitCode: req.unitCode }
        let status = false
        if (!req.packListIds.length || !req.insPreferenceType) {
            throw new ErrorResponse(36049, 'Req Is Not Valid')
        }
        const insReq = await this.dataSource.getRepository(PackInsRequestEntity).count({ where: { packListId: In(req.packListIds), requestCategory: req.insPreferenceType, ...userReq, finalInspectionStatus: PackFinalInspectionStatusEnum.PASS } });
        status = insReq === req.packListIds.length;
        // if (req.cartonIds && req.cartonIds.length) {
        //     const items = await this.dataSource.getRepository(PackInsRequestItemEntity).count({ where: { phItemLinesId: In(req.cartonIds), finalInspectionResult: PackFinalInspectionStatusEnum.PASS, ...userReq } })
        //     status = items === req.cartonIds.length
        // }
        if (status) {
            return new CommonResponse(status, 36050, "Inspection Completed For Given data", status)
        } else {
            return new CommonResponse(status, 36051, "Inspection Not Completed For Given data", status)

        }
    }


}