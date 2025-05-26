import { Injectable } from "@nestjs/common";
import { Repository, DataSource } from "typeorm";
import { InsRequestEntity } from "../../entities/ins-request.entity";
import { InspReqStatusQryResp } from "./query-response/insp-req-status.qry-resp";
import { InsRequestItemEntity } from "../../entities/ins-request-items.entity";
import { InsPackListInfoResponse } from "./query-response/ins-pack-list-info-resp";
import {InsFabricInspectionRequestCategoryEnum, InsDateGroupUnitRequest, InsInspActPlanModel } from "@xpparel/shared-models";
import moment from "moment";
// import { PackingListEntity } from "../../entities/packing-list.entity";
// import { PhItemLinesEntity } from "../../entities/ph-item-lines.entity";
// import { PhItemsEntity } from "../../entities/ph-items.entity";


@Injectable()
export class InsRequestEntityRepo extends Repository<InsRequestEntity> {
    constructor(private dataSource: DataSource) {
        super(InsRequestEntity, dataSource.createEntityManager());
    }

    /**
     * Repository method to get last request number for a packing list
     * @param packListId 
     * @param unitCode 
     * @param companyCode 
     * @returns 
    */
    async getLastRequestNumberForPackList(packListId: number, unitCode: string, companyCode: string): Promise<number> {
        return await this.createQueryBuilder('ins_request')
            .where(`ref_id_L1 = ${packListId} AND unit_code = '${unitCode}' AND company_code = '${companyCode}'`)
            .getCount();
    }

    async getInspectionDetailsForLot(packListId: number, lotNumber: string, unitCode: string, companyCode: string): Promise<InspReqStatusQryResp[]> {
        return await this.createQueryBuilder('ins_request')
            .select('id as ins_req_id, final_inspection_status as status')
            .where(`lot_number = '${lotNumber}' AND ph_id = ${packListId} AND unit_code = '${unitCode}' AND company_code = '${companyCode}'`)
            .getRawMany();
    }

    async getPackListWiseInspectionDetails(fromDate: string, toDate: string, unitCode: string, companyCode: string): Promise<InsPackListInfoResponse[]> {
        return await this.createQueryBuilder('ir')
            .select([
                'ir.batch_number as id',
                'ir.request_category',
                'ph.pack_list_code',
                'ph.id AS pack_list_id',
                'ph.pack_list_code',
                `GROUP_CONCAT(IF(ini.ins_completed_at IS NOT NULL, ini.ph_item_lines_id, NULL)) AS completed_rolls`,
                `GROUP_CONCAT(IF((ini.ins_started_at IS NOT NULL AND ini.ins_completed_at IS NULL), ini.ph_item_lines_id, NULL)) AS started_rolls`,
                `GROUP_CONCAT(IF((ini.ins_started_at IS NULL AND ini.ins_completed_at IS NULL), ini.ph_item_lines_id, NULL)) AS open_rolls`,
                'ir.ins_activity_status',
                'ir.final_inspection_status',
                'pii.item_code',
                'DATE(ir.ins_creation_time)',
                'ir.lot_number'
            ])
            // .leftJoin(PackingListEntity, 'ph', 'ph.id = ir.ph_id AND ph.unit_code = ir.unit_code AND ph.company_code = ir.company_code')
            .leftJoin(InsRequestItemEntity, 'ini', 'ini.ins_request_id = ir.id')
            // .leftJoin(PhItemLinesEntity, 'pl', 'pl.id = ini.ph_item_lines_id')
            // .leftJoin(PhItemsEntity, 'pii', 'pii.id = pl.ph_items_id')
            .where('ir.unit_code = :unitCode', { unitCode: `${unitCode}` })
            .andWhere('ir.company_code = :companyCode', { companyCode: `${companyCode}` })
            .andWhere('DATE(ir.ins_creation_time) BETWEEN :startDate AND :endDate', {
                startDate: `${fromDate}`,
                endDate: `${toDate}`
            })
            .groupBy('ir.id')
            .getRawMany();
    }

    async getInspectionActualAndPlanData(payload: InsDateGroupUnitRequest): Promise<InsInspActPlanModel[]> {
        const { fromDate, toDate, group } = payload;

        // Convert groupBy into appropriate SQL DATE_FORMAT strings for grouping
        let dateFormat;
        switch (group) {
            case 'YEAR':
                dateFormat = '%Y';
                break;
            case 'MONTH':
                dateFormat = '%Y-%m';
                break;
            case 'DATE':
                dateFormat = '%Y-%m-%d';
                break;
            default:
                throw new Error('Invalid group value. Allowed values: YEAR, MONTH, DATE.');
        }

        // Step 1: Get the date range in the desired format
        const startDate = new Date(fromDate);
        const endDate = new Date(toDate);
        const dateRange = [];
        let currentDate = new Date(startDate);

        while (currentDate <= endDate) {
            // Format the date based on group
            let formattedDate;
            if (group === 'YEAR') {
                formattedDate = currentDate.getFullYear().toString();
                currentDate.setFullYear(currentDate.getFullYear() + 1);
            } else if (group === 'MONTH') {
                formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
                currentDate.setMonth(currentDate.getMonth() + 1);
            } else {
                formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
                currentDate.setDate(currentDate.getDate() + 1);
            }
            dateRange.push(formattedDate);
        }

        // Step 2: Fetch actual data and group by date and category
        const actualDataQuery = this.createQueryBuilder('ins')
            .select([
                `DATE_FORMAT(ins.ins_completed_at, '${dateFormat}') AS rangedDate`,
                'COUNT(ins.ins_completed_at) AS actualCount',
                'COUNT(ins.material_receive_at) AS expectedCount',
                'ins.request_category AS processType',
            ])
            .where('DATE(ins.ins_creation_time) BETWEEN :fromDate AND :toDate', { fromDate, toDate })
            .groupBy('rangedDate, ins.request_category');

        const actualDataRaw = await actualDataQuery.getRawMany();

        // Step 3: Populate data with all dates and categories
        const result: InsInspActPlanModel[] = [];
        for (const date of dateRange) {
            for (const category of Object.values(InsFabricInspectionRequestCategoryEnum)) {
                // Find matching record in actual data
                const record = actualDataRaw.find(
                    (data) => data.rangedDate === date && data.processType === category
                );

                // If found, use actual data; otherwise, default to zeros
                result.push({
                    rangedDate: new Date(date),
                    actualCount: record ? parseInt(record.actualCount, 10) : 0,
                    expectedCount: record ? parseInt(record.expectedCount, 10) : 0,
                    processType: category as InsFabricInspectionRequestCategoryEnum,
                });
            }
        }

        return result;
    }

    async getAllInspectionCompletedIds(unitCode: string, companyCode: string, date: string): Promise<{ request_category: InsFabricInspectionRequestCategoryEnum; ins_request_id: number }[]> {
        const startDate = `${date} 00:00:00`;
        const endDate = `${date} 23:59:59`;

        const query = await this.createQueryBuilder('ins_request')
            .select(['ins_request.request_category', 'ins_request.id'])
            .where('ins_request.unit_code = :unitCode', { unitCode })
            .andWhere('ins_request.company_code = :companyCode', { companyCode })
            .andWhere('ins_request.ins_activity_status = :status', { status: 'COMPLETED' })
            .andWhere('ins_request.ins_completed_at BETWEEN :startDate AND :endDate', { startDate, endDate })
            .groupBy('ins_request.request_category')
            .addGroupBy('ins_request.id')
            .getRawMany();

        return query;
    }

}