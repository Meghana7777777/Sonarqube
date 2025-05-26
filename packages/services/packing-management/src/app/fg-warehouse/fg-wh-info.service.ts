import { Inject, Injectable } from "@nestjs/common";
import { ErrorResponse } from "@xpparel/backend-utils";
import { CartonBarCodesReqDto, CartonBarcodeRequest, CartonIdsRequest, CartonScanReqNoDto, CommonResponse, FGWhRequestsInfoAbstract, FgWhReqHeaderModel, FgWhReqItemAbstract, FgWhReqItemAttrs, FgWhReqItemModel, FgWhReqSubItemModel, FgWhSrIdPlIdsRequest, GlobalResponseObject, PKMSReqItemTruckMapCreateDto, PackingListData, PkmsFgWhCurrStageEnum, PkmsFgWhReqApprovalEnum, PkmsFgWhReqTypeEnum, ProgressWiseRequestsCount, StatusWisePackListCount, StatusWiseRequestsCount, WarehouseGroup, WhBasicInfoModel, WhFloorPackListResp, WhFloorRequest, WhPackListCountInfo, WhRequestDashboardInfoModel, WhRequestDashboardInfoResp, WhRequestHeadResponse, WhRequestsApprovalCount, WhRequestsArrivalInfoAbstractForWhAndFloor, WhRequestsRejectionPercentage } from "@xpparel/shared-models";
import moment from "moment";
import { FgWhRequestStatusEnum } from "packages/libs/shared-models/src/pkms/enum/fg-wh-reqstatus.enum";
import { DataSource, In } from "typeorm";
import { FGMWareHouseEntity } from "../__masters__/warehouse-masters/entities/fg-m-warehouse.entity";
import { PkmsRequestItemTruckMapEntity } from "./entity/pkms-req-item-truck-map.entity";
import { FgWhReqHeaderRepo } from "./repository/fg-wh-req-header.repo";
import { FgWhReqLineAttrRepo } from "./repository/fg-wh-req-line-attr.repo";
import { FgWhReqLineRepo } from "./repository/fg-wh-req-line.repo";
import { FgWhReqSecurityInRepo } from "./repository/fg-wh-req-security-in.repo";
import { FgWhReqSubLineRepo } from "./repository/fg-wh-req-sub-line.repo";
import { PkmsRequestItemTruckMapRepoInterface } from "./repository/pkms-req-item-truck-map.repo-interface";

@Injectable()
export class FgWarehouseInfoService {
    constructor(
        @Inject('FgWhReqHeaderRepoInterface')
        private readonly fgHeaderRepository: FgWhReqHeaderRepo,
        @Inject('FgWhReqLineAttrRepoInterface')
        private readonly fgLineAttrRepository: FgWhReqLineAttrRepo,
        @Inject('FgWhReqLineRepoInterface')
        private readonly fgLineRepository: FgWhReqLineRepo,
        @Inject('FgWhReqSecurityInRepoInterface')
        private readonly fgSecurityRepository: FgWhReqSecurityInRepo,
        @Inject('FgWhReqSubLineRepoInterface')
        private readonly fgSubRepository: FgWhReqSubLineRepo,
        @Inject('PkmsRequestItemTruckMapRepoInterface')
        private readonly PkmsReqItemTruckMapRepo: PkmsRequestItemTruckMapRepoInterface,
        private readonly dataSource: DataSource,

    ) {

    }


    async getFgWhInfoForGivenPackListIds(reqObj: FgWhSrIdPlIdsRequest): Promise<WhRequestHeadResponse> {
        const { unitCode, companyCode, plIds, iNeedWhLocationAbstract, iNeedWhReqItemAbstract, iNeedWhReqItemAttrs, iNeedWhReqItems, iNeedWhReqSubItems } = reqObj;
        let whReqHeadIds: number[] = [];
        if (reqObj.fgWhHeaderIds && reqObj?.fgWhHeaderIds?.length) {
            whReqHeadIds = reqObj.fgWhHeaderIds
        } else {
            whReqHeadIds = await this.fgLineRepository.getWhHeaderIdsForPackListIds(reqObj);
        }
        if (!whReqHeadIds.length) {
            throw new ErrorResponse(4037, 'Warehouse requests not found for the given pack list ids')
        }
        const allRequestHeaders: FgWhReqHeaderModel[] = [];
        const whReqHeadInfo = await this.fgHeaderRepository.find({ where: { id: In(whReqHeadIds), unitCode, companyCode, reqType: In(reqObj.reqType) } });
        const whReqItems: FgWhReqItemModel[] = [];
        for (const eachWhReqHead of whReqHeadInfo) {
            if (iNeedWhReqItems) {
                const whReqItemsInfo = await this.fgLineRepository.find({ where: { fgWhRhId: eachWhReqHead.id, unitCode, companyCode } });
                for (const eachPackList of whReqItemsInfo) {
                    let cartonAbstract: FgWhReqItemAbstract = null;
                    let cartonAttributes = null;
                    const cartonsInfo: FgWhReqSubItemModel[] = [];
                    let whBasicInfo: WhBasicInfoModel[] = [];
                    if (iNeedWhLocationAbstract) {
                        const whLineItemsInfo = await this.fgSubRepository.find({ where: { fgWhRlId: eachPackList.id, unitCode, companyCode } });
                        const whCodeFloorCartonsCountMap = new Map<string, Map<string, number>>();
                        for (const eachCarton of whLineItemsInfo) {
                            if (!whCodeFloorCartonsCountMap.has(eachWhReqHead.toWhCode)) {
                                whCodeFloorCartonsCountMap.set(eachWhReqHead.toWhCode, new Map<string, number>());
                            }
                            if (!whCodeFloorCartonsCountMap.get(eachWhReqHead.toWhCode).has(eachPackList.floor)) {
                                whCodeFloorCartonsCountMap.get(eachWhReqHead.toWhCode).set(eachPackList.floor, 0)
                            }
                            let preQty = whCodeFloorCartonsCountMap.get(eachWhReqHead.toWhCode).get(eachPackList.floor);
                            whCodeFloorCartonsCountMap.get(eachWhReqHead.toWhCode).set(eachPackList.floor, preQty++);
                            if (iNeedWhReqSubItems) {
                                const isLoadedCartonBox = await this.dataSource.getRepository(PkmsRequestItemTruckMapEntity).exist({ where: { refId: eachCarton.refNo, unitCode: reqObj.unitCode, companyCode: reqObj.companyCode } })
                                const cartonInfo = new FgWhReqSubItemModel(eachCarton.barcode, eachCarton.qty, eachCarton.location, isLoadedCartonBox);
                                cartonsInfo.push(cartonInfo);
                            }

                        }
                        for (const [wh, floorDetail] of whCodeFloorCartonsCountMap) {
                            for (const [floor, qty] of floorDetail) {
                                const findWhMAsterData = await this.dataSource.getRepository(FGMWareHouseEntity).findOne({ select: ['id', 'address'], where: { wareHouseCode: wh, companyCode: reqObj.companyCode, unitCode: reqObj.unitCode } });
                                const cartonCountInfo = new WhBasicInfoModel(wh, findWhMAsterData?.id, floor, qty, findWhMAsterData?.address);
                                whBasicInfo.push(cartonCountInfo);
                            }
                        }
                    }
                    if (iNeedWhReqItemAbstract) {
                        const attributeInfo = await this.fgSubRepository.getStatusWiseCartonCount(eachPackList.id, unitCode, companyCode);
                        let totalCartons = 0;
                        let locMapCartons: number = 0;
                        let locUnMapCartons: number = 0;
                        let fgInCartons: number = 0;
                        let fgOutCartons: number = 0;
                        for (const eachStatus of attributeInfo) {
                            totalCartons += Number(eachStatus.cartonCount);
                            if (eachStatus.status == FgWhRequestStatusEnum.FG_IN) {
                                fgInCartons += Number(eachStatus.cartonCount);
                            }
                            if (eachStatus.status == FgWhRequestStatusEnum.FG_Out) {
                                fgOutCartons += Number(eachStatus.cartonCount);
                            }
                            if (eachStatus.status == FgWhRequestStatusEnum.LOCATION_IN) {
                                locMapCartons += Number(eachStatus.cartonCount);
                            }
                            if (eachStatus.status == FgWhRequestStatusEnum.LOCATION_OUT) {
                                locUnMapCartons += Number(eachStatus.cartonCount);
                            }
                        }
                        cartonAbstract = new FgWhReqItemAbstract(totalCartons, locMapCartons, locUnMapCartons, fgInCartons, fgOutCartons);
                    }
                    if (iNeedWhReqItemAttrs) {
                        const attributes = await this.fgLineAttrRepository.findOne({ where: { id: eachPackList.id, unitCode, companyCode } })
                        cartonAttributes = new FgWhReqItemAttrs(attributes?.moNo, attributes?.productName?.split(','), attributes?.po?.split(','), attributes?.style?.split(','), attributes?.buyer?.split(','), attributes?.destination?.split(','), attributes?.delDate?.split(','));
                    }
                    const whReqLineInfo = new FgWhReqItemModel(eachPackList.packListId, eachPackList.currentStage, cartonAbstract, cartonAttributes, cartonsInfo, whBasicInfo);
                    whReqItems.push(whReqLineInfo);
                }
            }
            const whRequestHeaderInfo = new FgWhReqHeaderModel(eachWhReqHead.requestNo, moment(eachWhReqHead.createdAt).format('YYYY-MM-DD HH:MM'), eachWhReqHead.remarks, null, null, eachWhReqHead.requestApprovalStatus, eachWhReqHead.currentStage, whReqItems, moment(eachWhReqHead.requestedDate).format('YYYY-MM-DD'));
            allRequestHeaders.push(whRequestHeaderInfo);
        }

        return new WhRequestHeadResponse(true, 46038, 'Warehouse Request details retrieved successfully', allRequestHeaders);
    }

    async getWhFloorInfoForPackListIds(reqObj: FgWhSrIdPlIdsRequest): Promise<WhFloorPackListResp> {
        const whFloorInfo = await this.fgLineRepository.getWhFloorInfoForPackListIds(reqObj);
        const whFloorMap = new Map<string, { cartonCount: number; warehouse_code: string; floor: string; pack_list_no: string; pack_list_id: number; quantity: number, cartonIds: string }[]>();
        for (const eachFloorDetail of whFloorInfo) {
            const key = `${eachFloorDetail.warehouse_code}-${eachFloorDetail.floor}`;
            if (!whFloorMap.has(key)) {
                whFloorMap.set(key, []);
            }
            whFloorMap.get(key).push(eachFloorDetail);
        }
        const whGroupInfo = [];
        for (const [key, floorInfo] of whFloorMap) {
            const whCode = floorInfo[0].warehouse_code;
            const floor = floorInfo[0].floor;
            const floorObj = floorInfo.map((eachFloor) => {
                const cartonIds = eachFloor.cartonIds.split(',').map(rec => Number(rec))
                return new PackingListData(eachFloor.pack_list_id, eachFloor.pack_list_no, eachFloor.pack_list_no, eachFloor.quantity, eachFloor.cartonCount, cartonIds)
            })
            const warehouseGroup = new WarehouseGroup(whCode, floor, floorObj);
            whGroupInfo.push(warehouseGroup);
        }
        return new WhFloorPackListResp(true, 46039, 'Warehouse Group Info Received successfully', whGroupInfo)
    }


    async getWarehouseArrivalsAndDispatchInfo(req: WhFloorRequest): Promise<WhRequestDashboardInfoResp> {
        const stageWiseWhRewInfo = await this.fgHeaderRepository.getWhRequestsCountInfoForWhCodeAndFloor(req);
        const whFloorWiseMap = new Map<string, {
            requestsCount: number;
            warehouse_code: string;
            floor: string;
            current_stage: PkmsFgWhCurrStageEnum;

        }[]>();
        for (const eachStageInfo of stageWiseWhRewInfo) {
            const key = `${eachStageInfo.warehouse_code}-${eachStageInfo.floor}`
            if (!whFloorWiseMap.has(key)) {
                whFloorWiseMap.set(key, []);
            }
            whFloorWiseMap.get(key).push(eachStageInfo);
        }
        let totalRequestsForTodo: number = 0;
        let noOfRequestsForToDoApproval: number = 0;
        let noOfRequestsForToDoFgIn: number = 0;
        let noOfRequestsForToDoFgOut: number = 0;
        let noOfRequestsForToDoLocationIn: number = 0;
        let noOfRequestsForToDoLocationOut: number = 0;

        let totalRequestsForInprogress: number = 0;
        let noOfRequestsForInprogressApproval: number = 0;
        let noOfRequestsForInprogressFgIn: number = 0;
        let noOfRequestsForInprogressFgOut: number = 0;
        let noOfRequestsForInprogressLocationIn: number = 0;
        let noOfRequestsForInprogressLocationOut: number = 0;

        let totalRequestsForCompleted: number = 0;
        let noOfRequestsForCompletedApproval: number = 0;
        let noOfRequestsForCompletedFgIn: number = 0;
        let noOfRequestsForCompletedFgOut: number = 0;
        let noOfRequestsForCompletedLocationIn: number = 0;
        let noOfRequestsForCompletedLocationOut: number = 0;

        for (const [key, stageInfo] of whFloorWiseMap) {
            for (const eachStage of stageInfo) {
                if (eachStage.current_stage == PkmsFgWhCurrStageEnum.FG_IN_COMPLETE) {
                    noOfRequestsForCompletedFgIn += Number(eachStage.requestsCount);
                    noOfRequestsForToDoFgOut += Number(eachStage.requestsCount);
                    totalRequestsForTodo += Number(eachStage.requestsCount);
                    totalRequestsForCompleted += Number(eachStage.requestsCount);
                    noOfRequestsForToDoLocationIn += Number(eachStage.requestsCount);
                }
                if (eachStage.current_stage == PkmsFgWhCurrStageEnum.FG_IN_PROGRESS) {
                    noOfRequestsForInprogressFgIn += Number(eachStage.requestsCount);
                    totalRequestsForInprogress += Number(eachStage.requestsCount);
                }
                if (eachStage.current_stage == PkmsFgWhCurrStageEnum.FG_OUT_COMPLETE) {
                    noOfRequestsForCompletedFgOut += Number(eachStage.requestsCount);
                    noOfRequestsForInprogressLocationOut += Number(eachStage.requestsCount);
                    totalRequestsForCompleted += Number(eachStage.requestsCount);
                    noOfRequestsForCompletedLocationOut += Number(eachStage.requestsCount);
                }
                if (eachStage.current_stage == PkmsFgWhCurrStageEnum.FG_OUT_PROGRESS) {
                    noOfRequestsForInprogressFgOut += Number(eachStage.requestsCount);
                    noOfRequestsForToDoLocationOut += Number(eachStage.requestsCount);
                    totalRequestsForInprogress += Number(eachStage.requestsCount);
                }
                if (eachStage.current_stage == PkmsFgWhCurrStageEnum.LOC_MAP_COMPLETED) {
                    noOfRequestsForCompletedLocationIn += Number(eachStage.requestsCount);
                    totalRequestsForCompleted += Number(eachStage.requestsCount);
                }
                if (eachStage.current_stage == PkmsFgWhCurrStageEnum.LOC_MAP_PROGRESS) {
                    noOfRequestsForInprogressLocationIn += Number(eachStage.requestsCount);
                    totalRequestsForInprogress += Number(eachStage.requestsCount);
                }
                if (eachStage.current_stage == PkmsFgWhCurrStageEnum.OPEN) {
                    noOfRequestsForToDoApproval += Number(eachStage.requestsCount);
                }
                if (eachStage.current_stage == PkmsFgWhCurrStageEnum.APPROVED) {
                    noOfRequestsForToDoFgIn += Number(eachStage.requestsCount);
                    noOfRequestsForCompletedApproval += Number(eachStage.requestsCount);
                }
            }
        }
        const toDoList = new StatusWiseRequestsCount(totalRequestsForTodo, noOfRequestsForToDoApproval, noOfRequestsForToDoFgIn, noOfRequestsForToDoFgOut, noOfRequestsForToDoLocationIn, noOfRequestsForToDoLocationOut);
        const inprogressList = new StatusWiseRequestsCount(totalRequestsForInprogress, noOfRequestsForInprogressApproval, noOfRequestsForInprogressFgIn, noOfRequestsForInprogressFgOut, noOfRequestsForInprogressLocationIn, noOfRequestsForInprogressLocationOut);
        const completedLis = new StatusWiseRequestsCount(totalRequestsForCompleted, noOfRequestsForCompletedApproval, noOfRequestsForCompletedFgIn, noOfRequestsForCompletedFgOut, noOfRequestsForCompletedLocationIn, noOfRequestsForInprogressLocationOut);
        const progressWiseCountInfo = new ProgressWiseRequestsCount(toDoList, inprogressList, completedLis);

        const whReqArrivalInfo = await this.fgHeaderRepository.getWhRequestsDetailsInfoForWhCodeAndFloorForArrivals(req);
        const whFloorReqArrivalInfo = new Map<string, FGWhRequestsInfoAbstract[]>();
        for (const eachReqInfo of whReqArrivalInfo) {
            const key = `${eachReqInfo.whCode}-${eachReqInfo.floor}`;
            if (!whFloorReqArrivalInfo.has(key)) {
                whFloorReqArrivalInfo.set(key, []);
            }
            whFloorReqArrivalInfo.get(key).push(eachReqInfo);
        }
        const arrivalsInfo: WhRequestsArrivalInfoAbstractForWhAndFloor[] = [];
        for (const [whFloor, arrivalInfo] of whFloorReqArrivalInfo) {
            const whFloorInfo = new WhFloorRequest(null, req.unitCode, req.companyCode, 0, arrivalInfo[0].whCode, arrivalInfo[0].floor);
            const reqArrivalInfo = new WhRequestsArrivalInfoAbstractForWhAndFloor(whFloorInfo, arrivalInfo);
            arrivalsInfo.push(reqArrivalInfo);
        }


        const whReqDepartureInfo = await this.fgHeaderRepository.getWhRequestsDetailsInfoForWhCodeAndFloorForDepartures(req);
        const whFloorReqDepartureInfo = new Map<string, FGWhRequestsInfoAbstract[]>();
        for (const eachReqInfo of whReqDepartureInfo) {
            const key = `${eachReqInfo.whCode}-${eachReqInfo.floor}`;
            if (!whFloorReqDepartureInfo.has(key)) {
                whFloorReqDepartureInfo.set(key, []);
            }
            whFloorReqDepartureInfo.get(key).push(eachReqInfo);
        }
        const departuresInfo: WhRequestsArrivalInfoAbstractForWhAndFloor[] = [];
        for (const [whFloor, arrivalInfo] of whFloorReqDepartureInfo) {
            const whFloorInfo = new WhFloorRequest(null, req.unitCode, req.companyCode, 0, arrivalInfo[0].whCode, arrivalInfo[0].floor);
            const reqDepartInfo = new WhRequestsArrivalInfoAbstractForWhAndFloor(whFloorInfo, arrivalInfo);
            departuresInfo.push(reqDepartInfo);
        }


        const packListFCountInfo = await this.fgHeaderRepository.getWhPackingListCountInfoForWhCodeAndFloor(req);
        const packListWhFloorMap = new Map<string, {
            packListCount: number;
            warehouse_code: string;
            floor: string;
            noOfCartonsInWh: number;
            totalSOCountInWh: number;
        }[]>();
        for (const eachStageInfo of packListFCountInfo) {
            const key = `${eachStageInfo.warehouse_code}-${eachStageInfo.floor}`
            if (!packListWhFloorMap.has(key)) {
                packListWhFloorMap.set(key, []);
            }
            packListWhFloorMap.get(key).push(eachStageInfo);
        }
        const packListInfoForWhAndFloor: WhPackListCountInfo[] = [];
        for (const [key, packListInfoMap] of packListWhFloorMap) {
            const whFloorInfo = new WhFloorRequest(null, req.unitCode, req.companyCode, 0, packListInfoMap[0].warehouse_code, packListInfoMap[0].floor);
            const whFloorPackInfo: StatusWisePackListCount[] = packListInfoMap.map((eachObj) => {
                return new StatusWisePackListCount(eachObj.packListCount, eachObj.noOfCartonsInWh, eachObj.noOfCartonsInWh)
            })
            const packListInfo = new WhPackListCountInfo(whFloorInfo, whFloorPackInfo);
            packListInfoForWhAndFloor.push(packListInfo);
        }


        const approveStatusWiseWhRewInfo = await this.fgHeaderRepository.getWhApprovalPercentageForWhCodeAndFloor(req);
        const approveStatusWiseMap = new Map<string, {
            request_approval_status: PkmsFgWhReqApprovalEnum;
            count: number;
            warehouse_code: string;
            floor: string;
        }[]>();
        for (const eachStageInfo of approveStatusWiseWhRewInfo) {
            const key = `${eachStageInfo.warehouse_code}-${eachStageInfo.floor}`
            if (!approveStatusWiseMap.has(key)) {
                approveStatusWiseMap.set(key, []);
            }
            approveStatusWiseMap.get(key).push(eachStageInfo);
        }
        const approvalPercentageInfo: WhRequestsRejectionPercentage[] = [];
        for (const [key, stageInfo] of approveStatusWiseMap) {
            const whFloorInfo = new WhFloorRequest(null, req.unitCode, req.companyCode, 0, stageInfo[0].warehouse_code, stageInfo[0].floor);
            let approvedCount = 0;
            let rejectedCount = 0;
            let openCount = 0;
            let totalCount = 0;
            for (const eachInfo of stageInfo) {
                if (eachInfo.request_approval_status == PkmsFgWhReqApprovalEnum.APPROVED) {
                    approvedCount += Number(eachInfo.count);
                }
                if (eachInfo.request_approval_status == PkmsFgWhReqApprovalEnum.REJECT) {
                    rejectedCount += Number(eachInfo.count);
                }
                if (eachInfo.request_approval_status == PkmsFgWhReqApprovalEnum.OPEN) {
                    openCount += Number(eachInfo.count);
                }
                totalCount += Number(eachInfo.count);
            }
            const rejApprovePercentageInfo = new WhRequestsRejectionPercentage(totalCount, rejectedCount, rejectedCount, ((rejectedCount / totalCount) * 100));
            approvalPercentageInfo.push(rejApprovePercentageInfo);
        }

        const dateWiseApprovalInfo = await this.fgHeaderRepository.getWhApprovalPercentageForWhCodeAndFloorByDate(req);
        const WhRequestsApprovalCountInfo: WhRequestsApprovalCount[] = [];
        const dateWiseCountInfo = new Map<string, {
            request_approval_status: PkmsFgWhReqApprovalEnum;
            count: number;
            requested_date: string;
        }[]>();
        for (const eachDateInfo of dateWiseApprovalInfo) {
            if (!dateWiseCountInfo.has(eachDateInfo.requested_date)) {
                dateWiseCountInfo.set(eachDateInfo.requested_date, [])
            }
            dateWiseCountInfo.get(eachDateInfo.requested_date).push(eachDateInfo);
        }

        for (const [date, dateInfo] of dateWiseCountInfo) {
            let totalCount = 0;
            let approvedCount = 0;
            let rejectedCount = 0;
            for (const eachDateInfo of dateInfo) {
                if (eachDateInfo.request_approval_status == PkmsFgWhReqApprovalEnum.APPROVED) {
                    approvedCount += Number(eachDateInfo.count)
                }
                if (eachDateInfo.request_approval_status == PkmsFgWhReqApprovalEnum.REJECT) {
                    rejectedCount += Number(eachDateInfo.count)
                }
                totalCount += Number(eachDateInfo.count);
            }
            const dateInfoReq = new WhRequestsApprovalCount(totalCount, approvedCount, date);
            WhRequestsApprovalCountInfo.push(dateInfoReq);
        }
        const arrivalAndDispatchInfo = new WhRequestDashboardInfoModel(progressWiseCountInfo, arrivalsInfo, departuresInfo, packListInfoForWhAndFloor, approvalPercentageInfo, WhRequestsApprovalCountInfo);
        return new WhRequestDashboardInfoResp(true, 46040, 'Arrival and dispatch details retrieved successfully', arrivalAndDispatchInfo)
    }


    async savePkmsItemRequestTruckMap(dto: PKMSReqItemTruckMapCreateDto) {
        try {
            const cartonId = await this.fgSubRepository.findOne({ select: ['refNo'], where: { barcode: dto.barcode, unitCode: dto.unitCode, companyCode: dto.companyCode } });
            if (!cartonId?.refNo) {
                throw new ErrorResponse(48655, "Please provide a valid carton barcode.");
            }
            const isLoadedCarton = await this.dataSource.getRepository(PkmsRequestItemTruckMapEntity).findOne({ where: { refId: cartonId.refNo, unitCode: dto.unitCode, companyCode: dto.companyCode } })
            if (isLoadedCarton) {
                throw new ErrorResponse(56326, `Carton already on the truck.-${isLoadedCarton?.truckNo}`)
            }
            const en = new PkmsRequestItemTruckMapEntity();
            en.companyCode = dto.companyCode;
            en.unitCode = dto.unitCode;
            en.createdUser = dto.username;
            en.truckNo = dto.truckNo;
            en.whHeaderId = dto.whHeaderId;
            en.barcode = dto.barcode
            en.refId = cartonId.refNo;
            const saveTruckLoadedInfo = await this.PkmsReqItemTruckMapRepo.save(en);
            if (!saveTruckLoadedInfo) {
                throw new ErrorResponse(45163, "Something Went Wrong")
            }
            return new GlobalResponseObject(true, 46098, `Carton ${dto.barcode} has been successfully loaded into truck ${dto.truckNo}.`)
        } catch (error) {
            console.log(error.message);
            throw new ErrorResponse(5454, error.message)
        }
    }


    async getFgWareHouseIdsByCartons(req: CartonBarCodesReqDto): Promise<CommonResponse> {
        const findFgWhBarCodes = await this.fgSubRepository.find({ select: ['fgWhRhId'], where: { barcode: In(req.cartonBarCodes), companyCode: req.companyCode, unitCode: req.unitCode } })
        const whIds = findFgWhBarCodes.map(rec => rec.fgWhRhId)
        const whReqIds = await this.fgHeaderRepository.find({ select: ['id'], where: { id: In(whIds), companyCode: req.companyCode, unitCode: req.unitCode, reqType: PkmsFgWhReqTypeEnum.IN } });
        if (!whReqIds?.length) {
            throw new ErrorResponse(65612, 'Hey! Just make sure to raise an FG WH request for at least one carton.')
        }
        return new CommonResponse(true, 45632, 'Data Retrieved Successfully', whReqIds)
    }

}
