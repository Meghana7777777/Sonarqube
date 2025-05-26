import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ErrorResponse } from "@xpparel/backend-utils";
import { FGWhRequestsInfoAbstract, FgWhReportResponseDto, FgWhReqHeaderDetailsModel, FgWhReqHeaderFilterReq, PKMSWhCodeReqDto, PkmsFgWhCurrStageEnum, PkmsFgWhReqApprovalEnum, PkmsFgWhReqTypeEnum, WhFloorRequest } from "@xpparel/shared-models";
import { FgWhRequestStatusEnum } from "packages/libs/shared-models/src/pkms/enum/fg-wh-reqstatus.enum";
import { DataSource, Repository } from "typeorm";
import { BaseAbstractRepository } from "../../../database/common-repositories";
import { ConfigLeastChildEntity } from "../../packing-list/entities/config-least-child.entity";
import { CrtnEntity } from "../../packing-list/entities/crtns.entity";
import { PKMSPoSubLineEntity } from "../../pre-integrations/pkms-po-entities/pkms-po-sub-line-entity";
import { FgWhReqLocationReportRawQueryDto } from "../dto/fg-wh-req-loacation-report.dto";
import { FgWhReqHeaderEntity } from "../entity/fg-wh-req-header.entity";
import { FgWhReqLinesEntity } from "../entity/fg-wh-req-lines.entity";
import { FgWhReqSubLinesEntity } from "../entity/fg-wh-req-sub-lines.entity";
import { FgWhReqLineAttrsEntity } from "../entity/fg-wh_req_line_attr.entity";
import { FgWhReqHeaderRepoInterface } from "./fg-wh-req-header.repo.interface";
@Injectable()
export class FgWhReqHeaderRepo extends BaseAbstractRepository<FgWhReqHeaderEntity> implements FgWhReqHeaderRepoInterface {
    constructor(
        @InjectRepository(FgWhReqHeaderEntity)
        private readonly fgwhReqEntity: Repository<FgWhReqHeaderEntity>,
        private readonly dataSource: DataSource
    ) {
        super(fgwhReqEntity);
    }


    async getFgWhHeaderReqDetails(req: FgWhReqHeaderFilterReq): Promise<FgWhReqHeaderDetailsModel[]> {
        const data: any = await this.fgwhReqEntity.createQueryBuilder("fgrh")
            .select([
                "fgrh.approved_by as approvedBy",
                "fgrh.from_wh_code as fromWhCode",
                "fgrh.request_no as requestNo",
                "fgrh.company_code as companyCode",
                "fgrh.id as id",
                "fgrh.req_type as reqType",
                "fgrh.request_approval_status as requestApprovalStatus",
                "fgrh.to_wh_code as toWhCode",
                "fgrh.uuid as uuid",
                "fgrh.created_user as createdUser",
                "fgrh.current_stage as currentStage",
                "fgsl.scan_start_time as scanStartTime",
                "COUNT(fgsl.id) AS totalCartons",
                "GROUP_CONCAT(distinct attr.destination) as destination",
                "GROUP_CONCAT(distinct attr.buyer) as buyer",
                "GROUP_CONCAT(distinct attr.del_date) as deliveryDate",
                "GROUP_CONCAT(distinct attr.style) as style",
                "GROUP_CONCAT(distinct attr.po) as buyerPo",
                "GROUP_CONCAT(distinct attr.mo_no) as moNumber"
            ])
            .leftJoin(FgWhReqLinesEntity, 'fg_wh_line', 'fg_wh_rh_id = fgrh.id AND fg_wh_line.unit_code = fgrh.unit_code AND fg_wh_line.company_code = fgrh.company_code')
            .leftJoin(FgWhReqSubLinesEntity, "fgsl", "fgrh.id = fgsl.fgWhRhId")
            .leftJoin(FgWhReqLineAttrsEntity, "attr", "attr.fg_wh_rl_id = fg_wh_line.id")
            .where("fgrh.reqType = :reqType", { reqType: req.reqType })
            .andWhere("fgrh.currentStage IN (:...currentStage)", { currentStage: req.currentStage })
            .andWhere("fgrh.requestApprovalStatus = :approvalStatus", { approvalStatus: req.approvalStatus })
            .andWhere(`fgrh.unit_code = '${req.unitCode}' and fgrh.company_code = "${req.companyCode}"`)
            .groupBy("fgsl.fgWhRhId")
            .orderBy('fgrh.created_at','DESC')
            .getRawMany();

        if (!data.length) {
            throw new ErrorResponse(924, "No data found")
        }
        const fgWhReqHeaderDetailsModel: FgWhReqHeaderDetailsModel[] = [];
        for (const v of data) {
            let pendingStatus = FgWhRequestStatusEnum.OPEN;
            let completedStatus = FgWhRequestStatusEnum.FG_IN;
            if (v.reqType == PkmsFgWhReqTypeEnum.IN && (v.currentStage == PkmsFgWhCurrStageEnum.PRINT || v.currentStage == PkmsFgWhCurrStageEnum.FG_IN_PROGRESS)) {
                pendingStatus = FgWhRequestStatusEnum.OPEN;
                completedStatus = FgWhRequestStatusEnum.FG_IN;
            }
            if (v.reqType == PkmsFgWhReqTypeEnum.IN && (v.currentStage == PkmsFgWhCurrStageEnum.FG_IN_COMPLETE || v.currentStage == PkmsFgWhCurrStageEnum.PALLET_MAP_PROGRESS)) {
                pendingStatus = FgWhRequestStatusEnum.FG_IN;
                completedStatus = FgWhRequestStatusEnum.PELLETIZED;
            }
            if (v.reqType == PkmsFgWhReqTypeEnum.IN && (v.currentStage == PkmsFgWhCurrStageEnum.PALLET_MAP_COMPLETED || v.currentStage == PkmsFgWhCurrStageEnum.LOC_MAP_PROGRESS)) {
                pendingStatus = FgWhRequestStatusEnum.PELLETIZED;
                completedStatus = FgWhRequestStatusEnum.LOCATION_IN;
            }

            if (v.reqType == PkmsFgWhReqTypeEnum.OUT && (v.currentStage == PkmsFgWhCurrStageEnum.PRINT || v.currentStage == PkmsFgWhCurrStageEnum.LOC_UNMAP_PROGRESS)) {
                pendingStatus = FgWhRequestStatusEnum.OPEN;
                completedStatus = FgWhRequestStatusEnum.LOCATION_OUT;
            }

            if (v.reqType == PkmsFgWhReqTypeEnum.OUT && (v.currentStage == PkmsFgWhCurrStageEnum.LOC_UNMAP_COMPLETED || v.currentStage == PkmsFgWhCurrStageEnum.FG_OUT_PROGRESS)) {
                pendingStatus = FgWhRequestStatusEnum.LOCATION_OUT;
                completedStatus = FgWhRequestStatusEnum.FG_Out;
            }


            const findPendingBarCodes = await this.dataSource.getRepository(FgWhReqSubLinesEntity).find({ select: ['barcode'], where: { fgWhRhId: v.id, unitCode: req.unitCode, companyCode: req.companyCode, status: pendingStatus } });
            const completedCartons = await this.dataSource.getRepository(FgWhReqSubLinesEntity).find({ select: ['barcode'], where: { fgWhRhId: v.id, unitCode: req.unitCode, companyCode: req.companyCode, status: completedStatus } });
            const totalCartons = completedCartons.length + findPendingBarCodes.length
            const fgWhReqHeaderDetailsObj = new FgWhReqHeaderDetailsModel(
                v.createdUser,
                v.unitCode,
                v.companyCode,
                undefined,
                v.requestNo,
                v.fromWhCode,
                v.toWhCode,
                v.approvedBy,
                v.requestApprovalStatus,
                v.reqType,
                v.id,
                v.currentStage,
                totalCartons,
                findPendingBarCodes.length,
                completedCartons.length,
                v.destination,
                v.buyerPo,
                v.buyer,
                v.style,
                v.deliveryDate,
                v.moNumber,
                v.scanStartTime,
                findPendingBarCodes.map(rec => rec.barcode),
                completedCartons.map(rec => rec.barcode),
            );
            fgWhReqHeaderDetailsModel.push(fgWhReqHeaderDetailsObj);
        }
        return fgWhReqHeaderDetailsModel
    }

    /**
         * Repo method to get warehouse request header ids for packing list
         * @param reqObj 
         * @returns 
        */
    async getWhRequestsCountInfoForWhCodeAndFloor(reqObj: WhFloorRequest): Promise<{
        requestsCount: number;
        warehouse_code: string;
        floor: string;
        current_stage: PkmsFgWhCurrStageEnum
    }[]> {
        const { unitCode, companyCode, floor, whCode } = reqObj;
        let qry = this.fgwhReqEntity.createQueryBuilder('wh_head')
            .select('wh_head.to_wh_code as warehouse_code, fg_wh_line.floor, count(wh_head.id)as requestsCount, wh_head.current_stage')
            .leftJoin(FgWhReqLinesEntity, 'fg_wh_line', 'fg_wh_rh_id = wh_head.id AND fg_wh_line.unit_code = wh_head.unit_code AND fg_wh_line.company_code = wh_head.company_code')
            .andWhere(`fg_wh_line.unit_code = '${unitCode}' AND fg_wh_line.company_code = '${companyCode}'`)
            .groupBy(`wh_head.to_wh_code, fg_wh_line.floor, wh_head.current_stage`)
        if (whCode) {
            qry = qry.andWhere(`wh_head.to_wh_code = '${whCode}'`)
        }
        if (floor) {
            qry = qry.andWhere(`fg_wh_line.floor = '${floor}'`)
        }
        return qry.getRawMany();
    }


    async getWhRequestsDetailsInfoForWhCodeAndFloorForArrivals(reqObj: WhFloorRequest): Promise<FGWhRequestsInfoAbstract[]> {
        const { unitCode, companyCode, floor, whCode } = reqObj;
        let qry = this.fgwhReqEntity.createQueryBuilder('wh_head')
            .select('wh_head.to_wh_code as whCode, fg_wh_line.floor, request_no as requestNo, requested_date as plannedDateTime, COUNT(fg_wh_line.id) as packingListCount, COUNT(fg_wh_sub_line.id) as cartonCount, GROUP_CONCAT(DISTINCT destination) as destination, GROUP_CONCAT(DISTINCT del_date) as deliveryDate')
            .leftJoin(FgWhReqLinesEntity, 'fg_wh_line', 'fg_wh_line.id = wh_head.id AND fg_wh_line.unit_code = wh_head.unit_code AND fg_wh_line.company_code = wh_head.company_code')
            .leftJoin(FgWhReqSubLinesEntity, 'fg_wh_sub_line', 'fg_wh_sub_line.fg_wh_rl_id = fg_wh_line.id')
            .leftJoin(FgWhReqLineAttrsEntity, 'attr', 'attr.fg_wh_rl_id = fg_wh_line.id')
            .andWhere(`fg_wh_line.unit_code = '${unitCode}' AND fg_wh_line.company_code = '${companyCode}' AND wh_head.req_type = '${PkmsFgWhReqTypeEnum.IN}'`)
            .groupBy(`request_no`)
        if (whCode) {
            qry = qry.andWhere(`wh_head.to_wh_code = '${whCode}'`)
        }
        if (floor) {
            qry = qry.andWhere(`fg_wh_line.floor = '${floor}'`)
        }
        return qry.getRawMany();
    }

    async getWhRequestsDetailsInfoForWhCodeAndFloorForDepartures(reqObj: WhFloorRequest): Promise<FGWhRequestsInfoAbstract[]> {
        const { unitCode, companyCode, floor, whCode } = reqObj;
        let qry = this.fgwhReqEntity.createQueryBuilder('wh_head')
            .select('wh_head.to_wh_code as whCode, fg_wh_line.floor, request_no as requestNo, requested_date as plannedDateTime, COUNT(fg_wh_line.id) as packingListCount, COUNT(fg_wh_sub_line.id) as cartonCount, GROUP_CONCAT(DISTINCT destination) as destination, GROUP_CONCAT(DISTINCT del_date) as deliveryDate')
            .leftJoin(FgWhReqLinesEntity, 'fg_wh_line', 'fg_wh_line.id = wh_head.id AND fg_wh_line.unit_code = wh_head.unit_code AND fg_wh_line.company_code = wh_head.company_code')
            .leftJoin(FgWhReqSubLinesEntity, 'fg_wh_sub_line', 'fg_wh_sub_line.fg_wh_rl_id = fg_wh_line.id')
            .leftJoin(FgWhReqLineAttrsEntity, 'attr', 'attr.fg_wh_rl_id = fg_wh_line.id')
            .andWhere(`fg_wh_line.unit_code = '${unitCode}' AND fg_wh_line.company_code = '${companyCode}' AND wh_head.req_type = '${PkmsFgWhReqTypeEnum.OUT}'`)
            .groupBy(`request_no`)
        if (whCode) {
            qry = qry.andWhere(`wh_head.to_wh_code = '${whCode}'`)
        }
        if (floor) {
            qry = qry.andWhere(`fg_wh_line.floor = '${floor}'`)
        }
        return qry.getRawMany();
    }

    /**
         * Repo method to get warehouse request header ids for packing list
         * @param reqObj 
         * @returns 
        */
    async getWhPackingListCountInfoForWhCodeAndFloor(reqObj: WhFloorRequest): Promise<{
        packListCount: number;
        warehouse_code: string;
        floor: string;
        noOfCartonsInWh: number;
        totalSOCountInWh: number;
    }[]> {
        const { unitCode, companyCode, floor, whCode } = reqObj;
        let qry = this.fgwhReqEntity.createQueryBuilder('wh_head')
            .select('wh_head.to_wh_code as warehouse_code, fg_wh_line.floor, count(fg_wh_line.id)as packListCount, COUNT(fg_wh_sub_line.id) as noOfCartonsInWh, COUNT(DISTINCT attr.mo_no) totalSOCountInWh')
            .leftJoin(FgWhReqLinesEntity, 'fg_wh_line', 'fg_wh_rh_id = wh_head.id AND fg_wh_line.unit_code = wh_head.unit_code AND fg_wh_line.company_code = wh_head.company_code')
            .leftJoin(FgWhReqSubLinesEntity, 'fg_wh_sub_line', 'fg_wh_sub_line.fg_wh_rl_id = fg_wh_line.id')
            .leftJoin(FgWhReqLineAttrsEntity, 'attr', 'attr.fg_wh_rl_id = fg_wh_line.id')
            .andWhere(`fg_wh_line.unit_code = '${unitCode}' AND fg_wh_line.company_code = '${companyCode}'`)
            .groupBy(`wh_head.to_wh_code, fg_wh_line.floor`)
        if (whCode) {
            qry = qry.andWhere(`wh_head.to_wh_code = '${whCode}'`)
        }
        if (floor) {
            qry = qry.andWhere(`fg_wh_line.floor = '${floor}'`)
        }
        return qry.getRawMany();
    }

    /**
         * Repo method to get warehouse request header ids for packing list
         * @param reqObj 
         * @returns 
    */
    async getWhApprovalPercentageForWhCodeAndFloor(reqObj: WhFloorRequest): Promise<{
        request_approval_status: PkmsFgWhReqApprovalEnum;
        count: number;
        warehouse_code: string;
        floor: string;
    }[]> {
        const { unitCode, companyCode, floor, whCode } = reqObj;
        let qry = this.fgwhReqEntity.createQueryBuilder('wh_head')
            .select('wh_head.to_wh_code as warehouse_code, fg_wh_line.floor, request_approval_status, count(wh_head.id) as count')
            .leftJoin(FgWhReqLinesEntity, 'fg_wh_line', 'fg_wh_rh_id = wh_head.id AND fg_wh_line.unit_code = wh_head.unit_code AND fg_wh_line.company_code = wh_head.company_code')
            .andWhere(`fg_wh_line.unit_code = '${unitCode}' AND fg_wh_line.company_code = '${companyCode}'`)
            .groupBy(`wh_head.to_wh_code, fg_wh_line.floor, request_approval_status`)
        if (whCode) {
            qry = qry.andWhere(`wh_head.to_wh_code = '${whCode}'`)
        }
        if (floor) {
            qry = qry.andWhere(`fg_wh_line.floor = '${floor}'`)
        }
        return qry.getRawMany();
    }


    /**
         * Repo method to get warehouse request header ids for packing list
         * @param reqObj 
         * @returns 
    */
    async getWhApprovalPercentageForWhCodeAndFloorByDate(reqObj: WhFloorRequest): Promise<{
        request_approval_status: PkmsFgWhReqApprovalEnum;
        count: number;
        requested_date: string;
    }[]> {
        const { unitCode, companyCode, floor, whCode } = reqObj;
        let qry = this.fgwhReqEntity.createQueryBuilder('wh_head')
            .select('request_approval_status, count(wh_head.id) as count, requested_date')
            .leftJoin(FgWhReqLinesEntity, 'fg_wh_line', 'fg_wh_rh_id = wh_head.id AND fg_wh_line.unit_code = wh_head.unit_code AND fg_wh_line.company_code = wh_head.company_code')
            .andWhere(`fg_wh_line.unit_code = '${unitCode}' AND fg_wh_line.company_code = '${companyCode}'`)
            .groupBy(`request_approval_status, requested_date`)
        if (whCode) {
            qry = qry.andWhere(`wh_head.to_wh_code = '${whCode}'`)
        }
        if (floor) {
            qry = qry.andWhere(`fg_wh_line.floor = '${floor}'`)
        }
        return qry.getRawMany();
    }

    async getCountAgainstCurrentStage(req: FgWhReqHeaderFilterReq) {
        let qry = this.fgwhReqEntity.createQueryBuilder('fgw')
            .select('current_stage as currentStage, COUNT(*) as count')
            .where(`id > 0 `)
        if (req.reqType) {
            qry = qry.where(` req_type = '${req.reqType}'`)
        }
        qry = qry.groupBy('current_stage')
        return await qry.getRawMany()
    }


    async getFgWhLocationReport(req: PKMSWhCodeReqDto): Promise<FgWhReportResponseDto[]> {
        const query: FgWhReqLocationReportRawQueryDto[] = await this.fgwhReqEntity.createQueryBuilder('whH')
            .select('Date(whH.scan_start_time) as scan_start_time, whL.floor,intS.fg_color,intS.style,intS.customer_name,intS.product_name')
            .addSelect('intS.po_number as fg_wh_req_sub_lines,whSl.location')
            .addSelect('GROUP_CONCAT(DISTINCT crt.id) AS crtn_ids, COUNT(DISTINCT crt.id) as crtn_count, SUM(crt.required_qty) as total_required_qty')
            .leftJoin(FgWhReqLinesEntity, 'whL', 'whL.fg_wh_rh_id  = whH.id')
            .leftJoin(FgWhReqSubLinesEntity, 'whSl', 'whL.id = whSl.fg_wh_rl_id')
            .leftJoin(CrtnEntity, 'crt', 'crt.id = whSl.ref_no')
            .leftJoin(ConfigLeastChildEntity, 'sr', 'sr.parent_hierarchy_id = crt.carton_proto_id')
            .leftJoin(PKMSPoSubLineEntity, 'intS', 'intS.id = sr.po_order_sub_line_id')
            .where(`whH.req_type =  "${PkmsFgWhReqTypeEnum.IN}"`)
            .andWhere(`whH.to_wh_code = "${req.whCode}"`)
            .andWhere(`whH.unit_code = '${req.unitCode}' AND whH.company_code = '${req.companyCode}'`)
            .groupBy(`DATE(whH.scan_start_time) ,whL.floor,intS.fg_color,intS.style`)
            .addGroupBy(`intS.customer_name,intS.product_name,intS.po_number,whSl.location`)
            .getRawMany()
        const result: FgWhReportResponseDto[] = [];
        for (const rec of query) {
            const crtnIds = rec.crtn_ids.split(',');
            const childQuery = await this.dataSource.getRepository(FgWhReqSubLinesEntity).createQueryBuilder('whSl')
                .select('COUNT(1) as carton_out_qty,SUM(crt.`required_qty`) as garment_out_qty')
                .leftJoin(FgWhReqHeaderEntity, 'whH', 'whH.id = whSl.fg_wh_rh_id')
                .leftJoin(CrtnEntity, 'crt', 'crt.id = whSl.ref_no')
                .where(`whH.req_type =  "${PkmsFgWhReqTypeEnum.OUT}"`)
                .andWhere(`whH.unit_code = '${req.unitCode}' AND whH.company_code = '${req.companyCode}'`)
                .andWhere(`whSl.ref_no IN(${crtnIds})`)
                .getRawOne()
            result.push(new FgWhReportResponseDto(rec.scan_start_time, rec.floor, rec.customer_name, rec.style, rec.fg_color, rec.po_number, 0, rec.crtn_count, rec.total_required_qty, childQuery.carton_out_qty, childQuery.garment_out_qty, 0, 0, rec.location, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined))
        }
        return result
    }




}