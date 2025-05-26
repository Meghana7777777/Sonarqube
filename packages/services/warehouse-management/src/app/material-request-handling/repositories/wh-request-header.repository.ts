import { Injectable } from "@nestjs/common";
import { Repository, DataSource } from "typeorm";
import { WhMatRequestHeaderEntity } from "../entities/wh-mat-request-header.entity";
import { WhMatRequestLineEntity } from "../entities/wh-mat-request-line.entity";
import { Rm_OutAllocationInfoModel, TaskStatusEnum, WhMatReqLineItemStatusEnum, WhReqByObjectEnum } from "@xpparel/shared-models";
import { WhMatRequestLineItemEntity } from "../entities/wh-mat-request-line-item.entity";


@Injectable()
export class WhRequestHeaderRepo extends Repository<WhMatRequestHeaderEntity> {
    constructor(private dataSource: DataSource) {
        super(WhMatRequestHeaderEntity, dataSource.createEntityManager());
    }

    /**
     * Repository method to get warehouse request details for cut table
     * @param cutTableId 
     * @param companyCode 
     * @param unitCode 
     * @returns 
    */
    async getWareHouseRequestDetailsByCutTableId(cutTableId: number, companyCode: string, unitCode: string): Promise<WhMatRequestHeaderEntity[]> {
        return await this.createQueryBuilder('wh_req_mat_header')
            .leftJoin(WhMatRequestLineEntity, 'wh_req_line', 'wh_req_line.wh_mat_request_header_id = wh_req_mat_header.id')
            .where(`wh_req_line.mat_destination_id = ${cutTableId} AND wh_req_mat_header.company_code = '${companyCode}' AND wh_req_mat_header.unit_code = '${unitCode}' AND req_progress_status = '${TaskStatusEnum.OPEN}'`)
            .getMany()
    }

    /**
     * Repository method to get warehouse request details for cut
     * @param cutTableId 
     * @param companyCode 
     * @param unitCode 
     * @returns 
    */
    async getWareHouseRequestDetailsByReqNoAndJob(jobNumber: string, reqNo: string, companyCode: string, unitCode: string): Promise<WhMatRequestHeaderEntity[]> {
        const query = this.createQueryBuilder('wh_req_mat_header')
            .leftJoin(WhMatRequestLineEntity, 'wh_req_line', 'wh_req_line.wh_mat_request_header_id = wh_req_mat_header.id')
            .where(`wh_req_mat_header.company_code = '${companyCode}' AND wh_req_mat_header.unit_code = '${unitCode}' AND req_progress_status = '${TaskStatusEnum.OPEN}'`)
        if (jobNumber) query.andWhere(`job_number = '${jobNumber}'`)

        return await query.andWhere(`ext_req_no = '${reqNo}'`)
            .getMany()
    }

    /**
     * 
     * @param rollId 
     * @param unitCode 
     * @param companyCode 
     * @returns 
    */
    async getWarehouseReqDateByRolls(rollId: number[], unitCode: string, companyCode: string): Promise<string> {
        const respObj: { date: string } = await this.createQueryBuilder('wh_req_mat_header')
            .select('MAX(fulfill_within) as date')
            .leftJoin(WhMatRequestLineEntity, 'wh_req_line', 'wh_req_line.wh_mat_request_header_id = wh_req_mat_header.id')
            .leftJoin(WhMatRequestLineItemEntity, 'wh_req_line_item', 'wh_req_line_item.wh_mat_request_line_id = wh_req_line.id')
            .where(`wh_req_mat_header.unit_code = '${unitCode}' AND wh_req_mat_header.company_code = '${companyCode}'`)
            .andWhere(`wh_req_line_item.item_id IN(:...rollIds)`, { rollIds: rollId })
            .getRawOne();
        return respObj.date;
    }


    async getNoOfRollsPendingToIssueByGivenDate(date: string, unitCode: string, companyCode: string): Promise<number> {
        const rollsCount: { cnt: number } = await this.createQueryBuilder('wh_req_mat_header')
            .select('COUNT(wh_req_line_item.item_id) as cnt')
            .leftJoin(WhMatRequestLineEntity, 'wh_req_line', 'wh_req_line.wh_mat_request_header_id = wh_req_mat_header.id')
            .leftJoin(WhMatRequestLineItemEntity, 'wh_req_line_item', 'wh_req_line_item.wh_mat_request_line_id = wh_req_line.id')
            .where(`DATE(fulfill_within) = '${date}' AND wh_req_mat_header.unit_code = '${unitCode}' AND wh_req_mat_header.company_code = '${companyCode}' AND wh_req_line_item.req_line_item_status = '${WhMatReqLineItemStatusEnum.OPEN}'`)
            .getRawOne();
        return Number(rollsCount.cnt);
    }

    async getPendingQtyToIssueByGivenDate(date: string, unitCode: string, companyCode: string): Promise<number> {
        const rollsCount: { cnt: number } = await this.createQueryBuilder('wh_req_mat_header')
            .select('SUM(wh_req_line_item.req_quanitty) as cnt')
            .leftJoin(WhMatRequestLineEntity, 'wh_req_line', 'wh_req_line.wh_mat_request_header_id = wh_req_mat_header.id')
            .leftJoin(WhMatRequestLineItemEntity, 'wh_req_line_item', 'wh_req_line_item.wh_mat_request_line_id = wh_req_line.id')
            .where(`DATE(fulfill_within) = '${date}' AND wh_req_mat_header.unit_code = '${unitCode}' AND wh_req_mat_header.company_code = '${companyCode}' AND wh_req_line_item.req_line_item_status = '${WhMatReqLineItemStatusEnum.OPEN}'`)
            .getRawOne();
        return Number(rollsCount.cnt);
    }

    async getRmAllocatedMaterialForAllocationId(extRefId: number, unitCode: string, companyCode: string): Promise<Rm_OutAllocationInfoModel[]> {
        const result = await this.createQueryBuilder('wrmh')
            .select([
                'wrmh.ext_ref_id AS "exReqId"',
                'wrmh.ext_req_no AS "extReqNo"',
                'wrmh.id AS "allocationId"',
                'wrl.job_number AS "jobNumber"',
                'wrli.req_quanitty AS "rQty"',
                'wrli.req_quanitty AS "aQty"',
                'wrli.issued_quantity AS "iQty"',
                'wrli.item_id AS "itemSku"',
                'wrli.item_barcode AS "bunBarcode"',
            ])
            .leftJoin(WhMatRequestLineEntity, 'wrl', 'wrl.wh_mat_request_header_id = wrmh.id')
            .leftJoin(WhMatRequestLineItemEntity, 'wrli', 'wrli.wh_mat_request_line_id = wrl.id')
            .where('wrmh.ext_ref_id = :extRefId', { extRefId })
            .andWhere('wrmh.ext_ref_entity_type = :extRefEntityType', { extRefEntityType: WhReqByObjectEnum.SEWING })
            .andWhere('wrmh.unit_code = :unitCode', { unitCode })
            .andWhere('wrmh.company_code = :companyCode', { companyCode })
            .getRawMany<Rm_OutAllocationInfoModel>();

        return result;
    }

}