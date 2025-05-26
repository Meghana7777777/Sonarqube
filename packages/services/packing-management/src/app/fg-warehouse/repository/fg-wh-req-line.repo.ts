import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { FgWhReqLinesEntity } from "../entity/fg-wh-req-lines.entity";
import { BaseAbstractRepository } from "../../../database/common-repositories";
import { FgWhReqLineRepoInterface } from "./fg-wh-req-line-repo-interface";
import { InjectRepository } from "@nestjs/typeorm";
import { FgWhSrIdPlIdsRequest, PKMSFgWhReqNoResponseDto, PKMSPackJobIdReqDto } from "@xpparel/shared-models";
import { FgWhReqSubLinesEntity } from "../entity/fg-wh-req-sub-lines.entity";
import { FgWhReqHeaderEntity } from "../entity/fg-wh-req-header.entity";
import { FgWhRequestStatusEnum } from "packages/libs/shared-models/src/pkms/enum/fg-wh-reqstatus.enum";

@Injectable()
export class FgWhReqLineRepo extends BaseAbstractRepository<FgWhReqLinesEntity> implements FgWhReqLineRepoInterface {
    constructor(
        @InjectRepository(FgWhReqLinesEntity)
        private readonly lineEntity: Repository<FgWhReqLinesEntity>
    ) {
        super(lineEntity);
    }


    /**
     * Repo method to get warehouse request header ids for packing list
     * @param reqObj 
     * @returns 
    */
    async getWhHeaderIdsForPackListIds(reqObj: FgWhSrIdPlIdsRequest): Promise<number[]> {
        const { plIds, unitCode, companyCode } = reqObj;
        const cartonIds = [];
        if (reqObj?.packListCartoonIDs?.length) {
            reqObj.packListCartoonIDs.map(rec => rec.cartonIds.forEach((c) => cartonIds.push(c)))
        }
        const query = this.lineEntity.createQueryBuilder('wh_head_line')
            .select('DISTINCT wh_head_line.fg_wh_rh_id as fg_wh_rh_id')
            .leftJoin(FgWhReqSubLinesEntity, 'sub_line', 'sub_line.fg_wh_rl_id = wh_head_line.id and sub_line.unit_code = wh_head_line.unit_code AND sub_line.company_code = wh_head_line.company_code')
            .andWhere('pack_list_id IN (:...pListIds)', { pListIds: plIds })
            .andWhere(`wh_head_line.unit_code = '${unitCode}' AND wh_head_line.company_code = '${companyCode}'`)
        if (reqObj?.packListCartoonIDs?.length) {
            query.andWhere('sub_line.ref_no IN (:...cartonIds)', { cartonIds })
        }
        const result: { fg_wh_rh_id: number }[] = await query.getRawMany();
        return result.map(eachObj => eachObj.fg_wh_rh_id);
    }


    /**
     * Repo method to get warehouse request header ids for packing list
     * @param reqObj 
     * @returns 
    */
    async getWhFloorInfoForPackListIds(reqObj: FgWhSrIdPlIdsRequest): Promise<{
        cartonCount: number;
        warehouse_code: string;
        floor: string;
        pack_list_no: string;
        pack_list_id: number;
        quantity: number;
        cartonIds: string;
    }[]> {
        const { plIds, unitCode, companyCode } = reqObj;
        const cartonIds = [];
        if (reqObj?.packListCartoonIDs?.length) {
            reqObj.packListCartoonIDs.map(rec => rec.cartonIds.forEach((c) => cartonIds.push(c)))
        }
        const query = this.lineEntity.createQueryBuilder('fg_wh_line')
            .select('fg_wh_line.pack_list_no, pack_list_id, sum(sub_line.qty) as quantity, COUNT(DISTINCT sub_line.ref_no)as cartonCount, wh_head.to_wh_code as warehouse_code, fg_wh_line.floor,GROUP_CONCAT(DISTINCT sub_line.ref_no) as cartonIds ')
            .leftJoin(FgWhReqHeaderEntity, 'wh_head', 'fg_wh_rh_id = wh_head.id AND fg_wh_line.unit_code = wh_head.unit_code AND fg_wh_line.company_code = wh_head.company_code')
            .leftJoin(FgWhReqSubLinesEntity, 'sub_line', 'sub_line.fg_wh_rl_id = fg_wh_line.id and sub_line.unit_code = wh_head.unit_code AND sub_line.company_code = wh_head.company_code')
            .where(`fg_wh_line.unit_code = '${unitCode}' AND fg_wh_line.company_code = '${companyCode}'`)
            .andWhere(`sub_line.status = '${FgWhRequestStatusEnum.LOCATION_IN}'`)
        if (reqObj?.packListCartoonIDs?.length) {
            query.andWhere('sub_line.ref_no IN (:...cartonIds)', { cartonIds })
        }
        if (reqObj?.plIds?.length) {
            query.andWhere('pack_list_id IN (:...pListIds)', { pListIds: plIds })
        }
        query.groupBy(`fg_wh_line.pack_list_no, pack_list_id,wh_head.to_wh_code, fg_wh_line.floor`)
        const result = await query.getRawMany();
        return result
    }


    async getFgReqNoAgainstToPackJobNo(req: PKMSPackJobIdReqDto): Promise<PKMSFgWhReqNoResponseDto[]> {
        const query = await this.lineEntity.createQueryBuilder('fg_wh_line')
            .select('wh_head.request_no, wh_head.id,Group_concat(fg_wh_line.pack_list_id) pack_list_ids,wh_head.to_wh_code,wh_head.current_stage,wh_head.request_approval_status,fg_wh_line.floor,wh_head.requested_date')
            .leftJoin(FgWhReqHeaderEntity, 'wh_head', 'fg_wh_line.fg_wh_rh_id = wh_head.id AND fg_wh_line.unit_code = wh_head.unit_code AND fg_wh_line.company_code = wh_head.company_code')
            .where(`fg_wh_line.pack_order_id = '${req.packOrderId}'`)
            .andWhere(`wh_head.unit_code = '${req.unitCode}' AND wh_head.company_code = '${req.companyCode}'`)
            .orderBy('wh_head.created_at', 'DESC')
            .groupBy('fg_wh_line.fg_wh_rh_id')
            .getRawMany()
        return query.map((rec) => new PKMSFgWhReqNoResponseDto(rec?.id, rec?.request_no, rec?.pack_list_ids?.split(','), rec?.to_wh_code, rec?.current_stage, rec.request_approval_status, Number(rec.floor), rec.requested_date
        ))

    }



}