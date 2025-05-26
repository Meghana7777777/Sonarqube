import { Inject, Injectable, LoggerService } from "@nestjs/common";
import { CommonResponse, ErrorResponse } from "@xpparel/backend-utils";
import { DSetReqIdDto, FgWhHeaderIdReqDto, FgWhLinesResDto, FgWhLinesResponseModel, FgWhReqHeaderDetailsResponse, FgWhReqHeaderFilterReq, FgWhStageReq, FgWhStatusReq, FgwhPackListIdsModel, FgwhPackListIdsResponse, FgwhSecurityUpdateReq, GlobalResponseObject, LocationFromTypeEnum, LocationToTypeEnum, PKMSCartonInfoModel, PKMSFgWhReqNoResponseModel, PKMSFgWhereHouseCreateDto, PKMSInsStatusReqDto, PKMSPackJobIdReqDto, PKMSPackListIdsRequest, PackFabricInspectionRequestCategoryEnum, PkmsFgWhCurrStageEnum, PkmsFgWhReqTypeEnum, UpdateFgWhOurReqDto, VehicleINRDto } from "@xpparel/shared-models";
import { FgInspectionCreationService, GatexService, InspectionPreferenceService, PkDispatchSetService } from "@xpparel/shared-services";
import dayjs from "dayjs";
import { FgWhRequestStatusEnum } from "packages/libs/shared-models/src/pkms/enum/fg-wh-reqstatus.enum";
import { DataSource, In } from "typeorm";
import { TransactionalBaseService } from "../../base-services";
import { GenericTransactionManager, ITransactionManager } from "../../database/typeorm-transactions";
import { SequenceHandlingService } from "../__common__/sequence-handling/sequence-handling.service";
import { PackListService } from "../packing-list/packing-list.service";
import { FgWhReqHeaderEntity } from "./entity/fg-wh-req-header.entity";
import { FgWhReqLinesEntity } from "./entity/fg-wh-req-lines.entity";
import { FgWhReqSubLinesEntity } from "./entity/fg-wh-req-sub-lines.entity";
import { FgWhSecurityTrackEntity } from "./entity/fg-wh-security-in.entity";
import { FgWhReqLineAttrsEntity } from "./entity/fg-wh_req_line_attr.entity";
import { FgWhReqHeaderRepoInterface } from "./repository/fg-wh-req-header.repo.interface";
import { FgWhReqLineAttrRepoInterface } from "./repository/fg-wh-req-line-attr.repo.interface";
import { FgWhReqLineRepoInterface } from "./repository/fg-wh-req-line-repo-interface";
import { FgWhReqSecurityInRepoInterface } from "./repository/fg-wh-req-security-in-repo-interface";
import { FgWhReqSubLineRepoInterface } from "./repository/fg-wh-req-sub-line.repo.interface";

@Injectable()
export class FgWarehouseReqService extends TransactionalBaseService {
    constructor(
        @Inject('FgWhReqHeaderRepoInterface')
        private readonly fgWhHeadRepo: FgWhReqHeaderRepoInterface,
        @Inject('FgWhReqLineAttrRepoInterface')
        private readonly fgWhLineAttributeRepo: FgWhReqLineAttrRepoInterface,
        @Inject('FgWhReqLineRepoInterface')
        private readonly fgWhLine: FgWhReqLineRepoInterface,
        @Inject('FgWhReqSecurityInRepoInterface')
        private readonly fhWhSecurity: FgWhReqSecurityInRepoInterface,
        @Inject('FgWhReqSubLineRepoInterface')
        private readonly fgWhSubLineRepo: FgWhReqSubLineRepoInterface,
        @Inject('TransactionManager')
        transactionManager: ITransactionManager,
        @Inject('LoggerService')
        logger: LoggerService,
        public sequenceHandlingService: SequenceHandlingService,
        public dataSource: DataSource,
        public packListService: PackListService,
        public gatexService: GatexService,
        private readonly inspectionPreferenceService: InspectionPreferenceService,
        private readonly fgInspectionCreationService: FgInspectionCreationService,
        private readonly pkDispatchSetService: PkDispatchSetService

    ) {
        super(transactionManager, logger)
    }

    async saveFgWhereHouseReq(req: PKMSFgWhereHouseCreateDto): Promise<CommonResponse> {
        return this.executeWithTransaction(async (transactionManager) => {
            const whHeaderE = new FgWhReqHeaderEntity();
            const requestNo = await this.sequenceHandlingService.getSequenceNumber(`FG-${req.reqType}`, transactionManager)
            whHeaderE.requestNo = `FG-${req.reqType}-${String(requestNo).padStart(5, '0')}`;
            whHeaderE.approvedBy = req.username;
            whHeaderE.toWhCode = req.toWhCode;
            whHeaderE.reqType = req.reqType;
            whHeaderE.companyCode = req.companyCode;
            whHeaderE.unitCode = req.unitCode;
            whHeaderE.createdUser = req.username;
            whHeaderE.fromWhCode = req.unitCode;
            whHeaderE.requestedDate = req.requestedDate;
            const cartonIds = new Set<number>();
            const packListIds = new Set<number>();
            req.plCartonIds.forEach(rec => {
                packListIds.add(rec.packListId)
                rec.cartonIds.forEach(c => cartonIds.add(c))
            });
            const headerSave = await transactionManager.getRepository(FgWhReqHeaderEntity).save(whHeaderE);
            for (const pkLists of req.plCartonIds) {
                const pkListReq = new PKMSPackListIdsRequest(req.username, req.unitCode, req.companyCode, req.userId, [pkLists.packListId], true, true, true, true, true);
                const packListData = await this.packListService.getPackListInfoByPackListId(pkListReq);
                const pkList = packListData.data[0];
                const fgWhReqLinesEntity = new FgWhReqLinesEntity();
                fgWhReqLinesEntity.fgWhRhId = headerSave.id;
                fgWhReqLinesEntity.packList = pkList.packListDesc;
                fgWhReqLinesEntity.packListId = pkList.packListId;
                fgWhReqLinesEntity.packListNo = pkList.packListDesc;
                fgWhReqLinesEntity.packOrderId = pkList.packOrderId;
                fgWhReqLinesEntity.packOrderNo = pkList.packListAttrs.vpos[0];
                fgWhReqLinesEntity.moNo = pkList.packListAttrs.moNos[0];
                fgWhReqLinesEntity.floor = req.floor;
                fgWhReqLinesEntity.toWhCode = req.toWhCode;
                fgWhReqLinesEntity.companyCode = req.companyCode;
                fgWhReqLinesEntity.unitCode = req.unitCode;
                fgWhReqLinesEntity.createdUser = req.username;
                const saveWhLines = await transactionManager.getRepository(FgWhReqLinesEntity).save(fgWhReqLinesEntity);
                const findSavedReqLineIds = await transactionManager.getRepository(FgWhReqLinesEntity).find({ select: ['id'], where: { packListId: pkList.packListId } });
                const reqLineIds = findSavedReqLineIds.map(rec => rec.id)
                const findReqSubLineCartonsCount = await transactionManager.getRepository(FgWhReqSubLinesEntity).count({ where: { fgWhRlId: In(reqLineIds) } });
                const cartonsCount = pkList.packJobs.flatMap((rec) => rec.cartonsList).length;
                if ((findReqSubLineCartonsCount + pkLists?.cartonIds?.length) === cartonsCount) {
                    await transactionManager.getRepository(FgWhReqLinesEntity).update({ packListId: pkList.packListId }, { fgCompletedStatus: true })
                }
                // }
                const subLines: FgWhReqSubLinesEntity[] = [];
                const crtnMap = new Map<number, PKMSCartonInfoModel>();
                pkList.packJobs.forEach(pkJob => {
                    pkJob.cartonsList.forEach(crtn => {
                        crtnMap.set(crtn.cartonId, crtn)
                    })
                })
                for (const carton of pkLists.cartonIds) {
                    const whSubLineE = new FgWhReqSubLinesEntity();
                    whSubLineE.fgWhRhId = headerSave.id;
                    whSubLineE.fgWhRlId = saveWhLines.id;
                    whSubLineE.barcode = crtnMap.get(carton).barcode;
                    whSubLineE.refNo = carton;
                    whSubLineE.qty = crtnMap.get(carton)?.qty;
                    whSubLineE.toWhCode = req.toWhCode;
                    whSubLineE.companyCode = req.companyCode;
                    whSubLineE.unitCode = req.unitCode;
                    whSubLineE.createdUser = req.username;
                    whSubLineE.status = FgWhRequestStatusEnum.OPEN;
                    subLines.push(whSubLineE)
                }
                await this.dataSource.getRepository(FgWhReqSubLinesEntity).save(subLines, { reload: false });
                const fgWhReqLineAttrsEntity = new FgWhReqLineAttrsEntity();
                fgWhReqLineAttrsEntity.companyCode = req.companyCode;
                fgWhReqLineAttrsEntity.unitCode = req.unitCode;
                fgWhReqLineAttrsEntity.createdUser = req.username;
                fgWhReqLineAttrsEntity.fgWhRhId = headerSave.id;
                fgWhReqLineAttrsEntity.fgWhRlId = saveWhLines.id;
                fgWhReqLineAttrsEntity.moNo = pkList?.packListAttrs?.moNos?.toString();
                fgWhReqLineAttrsEntity.po = pkList?.packListAttrs?.vpos?.toString();
                fgWhReqLineAttrsEntity.productName = pkList?.packListAttrs?.prodNames?.toString();
                fgWhReqLineAttrsEntity.destination = pkList?.packListAttrs?.destinations?.toString();
                fgWhReqLineAttrsEntity.style = pkList?.packListAttrs?.styles?.toString();
                fgWhReqLineAttrsEntity.buyer = pkList?.packListAttrs?.buyers?.toString();
                fgWhReqLineAttrsEntity.delDate = pkList?.packListAttrs?.delDates?.toString();
                await transactionManager.getRepository(FgWhReqLineAttrsEntity).save(fgWhReqLineAttrsEntity, { reload: false })
            };
            if (req.reqType === PkmsFgWhReqTypeEnum.IN) {
                const obj = new VehicleINRDto(undefined, String(headerSave.id), headerSave.requestNo, undefined, undefined, undefined, LocationFromTypeEnum.PKMS, LocationToTypeEnum.FGWH, 1, 1, undefined, true, undefined, req.username, undefined, req.username, undefined)
                const createVehicleReq = await this.gatexService.createVINR([obj]);
                if (!createVehicleReq.status) {
                    throw new ErrorResponse(985461, createVehicleReq.internalMessage)
                }
            }
            if (req.reqType === PkmsFgWhReqTypeEnum.OUT) {
                const dispatchReq = new DSetReqIdDto(req.username, req.unitCode, req.companyCode, req.userId, req.dispatchReqId, String(headerSave.id))
                const dispatch = await this.pkDispatchSetService.updateFgOutReqForDispatch(dispatchReq);
                if (!dispatch.status) {
                    throw new ErrorResponse(6845, dispatch.internalMessage)
                }
            }
            return new CommonResponse(true, 46024, "Created Successfully")
        })

    }




    async getFgWhHeaderReqDetails(req: FgWhReqHeaderFilterReq): Promise<FgWhReqHeaderDetailsResponse> {
        const fgWhReqHeaderDetailsModel = await this.fgWhHeadRepo.getFgWhHeaderReqDetails(req)
        return new FgWhReqHeaderDetailsResponse(true, 808, "Data found", fgWhReqHeaderDetailsModel)
    }


    async updateFgWhReqStage(req: FgWhStageReq): Promise<CommonResponse> {
        const headRes = await this.fgWhHeadRepo.update({ id: req.requestId }, { currentStage: req.currentStage, companyCode: req.companyCode, unitCode: req.unitCode, updatedUser: req.username })
        // extra columns to be updated along with currentstage in the req lines tables
        let additionalColumnUpdates = {}
        if (req.currentStage == PkmsFgWhCurrStageEnum.PRINT) {
            additionalColumnUpdates = { printAt: dayjs().date().toLocaleString(), printStatus: true }
        }
        await this.fgWhLine.update({ fgWhRhId: req.requestId }, { currentStage: req.currentStage, ...additionalColumnUpdates })
        if (headRes.affected) {
            return new CommonResponse(true, 46087, "Updated Successfully")
        }
        return new CommonResponse(false, 46088, "No data found to update")
    }

    async updateFgWhReqApprovalStatus(req: FgWhStatusReq): Promise<CommonResponse> {
        const res = await this.fgWhHeadRepo.update({ id: req.requestId }, { requestApprovalStatus: req.requestApprovalStatus, approvedBy: req.username, companyCode: req.companyCode, unitCode: req.unitCode, updatedUser: req.username, currentStage: PkmsFgWhCurrStageEnum.APPROVED })
        if (res.affected) {
            return new CommonResponse(true, 46087, "Updated Successfully")
        }
        return new CommonResponse(false, 46088, "No data found to update")
    };

    async updateFgWhReqRejectedStatus(req: FgWhStatusReq): Promise<CommonResponse> {
        const res = await this.fgWhHeadRepo.update({ id: req.requestId }, { requestApprovalStatus: req.requestApprovalStatus, approvedBy: req.username, companyCode: req.companyCode, unitCode: req.unitCode, updatedUser: req.username, currentStage: PkmsFgWhCurrStageEnum.REJECTED })
        if (res.affected) {
            return new CommonResponse(true, 46087, "Rejected Successfully")
        }
        return new CommonResponse(false, 46088, "No data found to update")
    };




    async getFgWhReqLines(req: FgWhHeaderIdReqDto): Promise<FgWhLinesResponseModel> {
        const getLines = await this.fgWhLine.find({ where: { fgWhRhId: req.fgWhHeaderId, companyCode: req.companyCode, unitCode: req.unitCode } });
        const data: FgWhLinesResDto[] = [];
        if (getLines.length == 0) {
            throw new ErrorResponse(46026, "There Is No Lines To This Header");
        }
        for (const rec of getLines) {
            const subline = await this.fgWhSubLineRepo.find({ where: { fgWhRlId: rec.id, companyCode: req.companyCode, unitCode: req.unitCode } })
            for (const line of subline) {
                data.push(new FgWhLinesResDto(rec.fgWhRhId, rec.id, rec.packListId, rec.packListNo, rec.packOrderId, rec.packListNo, rec.floor, rec.moNo, line.barcode, line.qty, line.status))
            }
        }
        return new FgWhLinesResponseModel(true, 46027, "Fg Where House Lines Retrieved Successfully", data)
    }

    async updateSecurityDetails(req: FgwhSecurityUpdateReq): Promise<CommonResponse> {
        const fgwhsubLines = await this.fgWhLine.find({ select: ['id'], where: { fgWhRhId: req.fgwhReqId } })
        const res = await this.executeWithTransaction(async (transactionalManager) => {
            const headerUpdateRes = await transactionalManager.getRepository(FgWhReqHeaderEntity).update({ id: req.fgwhReqId }, { currentStage: PkmsFgWhCurrStageEnum.SECURITY_IN })
            if (!headerUpdateRes.affected) {
                throw new ErrorResponse(46028, "Request Id Not found to update");
            }
            if (fgwhsubLines.length) {
                for (const subline of fgwhsubLines) {
                    const securityTrackEntity = new FgWhSecurityTrackEntity()
                    securityTrackEntity.companyCode = req.companyCode
                    securityTrackEntity.fgWhRhId = req.fgwhReqId
                    securityTrackEntity.fgWhRlId = subline.id
                    securityTrackEntity.inAt = dayjs().toDate()
                    securityTrackEntity.outAt = dayjs().toDate()
                    securityTrackEntity.securityName = req.securityName
                    securityTrackEntity.status = req.status
                    securityTrackEntity.unitCode = req.unitCode
                    securityTrackEntity.vehicleType = req.vehicleType
                    securityTrackEntity.vehicleCount = 1
                    securityTrackEntity.toWhCode = "1"
                    await transactionalManager.getRepository(FgWhSecurityTrackEntity).save(securityTrackEntity)
                }
            }
            return new CommonResponse(true, 46029, "Security details updates Successfully")
        })

        return res
    }

    async getPackListIdsForHeaderReqId(req: FgWhHeaderIdReqDto): Promise<FgwhPackListIdsResponse> {
        const res = await this.fgWhLine.find({ where: { fgWhRhId: req.fgWhHeaderId, companyCode: req.companyCode, unitCode: req.unitCode }, select: ['packListId', 'createdUser', 'unitCode', 'companyCode'] })
        if (!res.length) {
            throw new ErrorResponse(46030, "No pack lists found for the header request id : " + req.fgWhHeaderId);
        }
        const packListIds = res.map((v) => v.packListId)
        const fgwhPackListIdsModel = new FgwhPackListIdsModel(res[0].createdUser, res[0].unitCode, res[0].companyCode, undefined, packListIds, res[0].fgWhRhId)
        return new FgwhPackListIdsResponse(true, 808, 'Data found', fgwhPackListIdsModel)
    }


    async getCountAgainstCurrentStage(req: FgWhReqHeaderFilterReq): Promise<CommonResponse> {
        const getInfo = await this.fgWhHeadRepo.getCountAgainstCurrentStage(req)
        if (getInfo.length > 0) {
            return new CommonResponse(true, 46025, 'Data retrieved', getInfo)
        } else {
            throw new ErrorResponse(965, "Data Not Found")
        }

    };


    async getFgReqNoAgainstToPackJobNo(req: PKMSPackJobIdReqDto): Promise<PKMSFgWhReqNoResponseModel> {
        const data = await this.fgWhLine.getFgReqNoAgainstToPackJobNo(req)
        if (data.length) {
            return new PKMSFgWhReqNoResponseModel(true, 967, "Data Retrieved Successfully", data)
        } else {
            throw new ErrorResponse(46031, "Please Create Fg Ware House Requests")
        }
    };

    async updateFgWareHouseRejected(req: UpdateFgWhOurReqDto): Promise<GlobalResponseObject> {
        const transactionalManager = new GenericTransactionManager(this.dataSource);
        try {
            await transactionalManager.startTransaction();
            await transactionalManager.getRepository(FgWhReqHeaderEntity).update({ companyCode: req.companyCode, unitCode: req.unitCode, id: req.whOutReqId }, { toWhCode: req.toWhCode, requestedDate: req.requestDate, currentStage: req.currentStage, requestApprovalStatus: req.requestApprovalStatus });
            await transactionalManager.getRepository(FgWhReqLinesEntity).update({ fgWhRhId: req.whOutReqId }, { floor: String(req.floor) });
            await transactionalManager.completeTransaction();
            return new GlobalResponseObject(true, 4651, 'Updated Successfully');
        } catch (error) {
            console.log(error)
            await transactionalManager.releaseTransaction();
            throw new ErrorResponse(645161, error.message);
        }
    }


}
