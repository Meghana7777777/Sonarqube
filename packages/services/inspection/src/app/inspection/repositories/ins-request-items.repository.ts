import { Injectable } from "@nestjs/common";
import { InsFabricInspectionRequestCategoryEnum, InsInspectionFinalInSpectionStatusEnum } from "@xpparel/shared-models";
import { DataSource, Repository } from "typeorm";
import { InsRequestItemEntity } from "../../entities/ins-request-items.entity";
import { InsRequestEntity } from "../../entities/ins-request.entity";
import { BasicRollInfoQryResp } from "./query-response/roll-basic-info.qry.resp";


@Injectable()
export class InsRequestItemRepo extends Repository<InsRequestItemEntity> {
    constructor(private dataSource: DataSource) {
        super(InsRequestItemEntity, dataSource.createEntityManager());
    }
    /**
     * Repository method to get inspected quantity for inspection id
     * @param inspReqId 
     * @param unitCode 
     * @param companyCode 
     * @returns 
    */
    async getInspectedQtyByInspReqId(inspReqId: number, unitCode: string, companyCode: string): Promise<{ inspected_qty: number; no_of_rolls: number }> {
        const inspectedQtyDetail: { inspected_qty: number; no_of_rolls: number } = await this.createQueryBuilder('insp_req_items')
            .select([
                'SUM(ins_quantity) AS inspected_qty',
                'COUNT(id) AS no_of_rolls'
            ])
            .where('ins_request_id = :inspReqId', { inspReqId })
            .andWhere('unit_code = :unitCode', { unitCode })
            .andWhere('company_code = :companyCode', { companyCode })
            .andWhere('inspection_result = :status', { status: InsInspectionFinalInSpectionStatusEnum.OPEN })
            .getRawOne();

        console.log('inspectedQtyDetail54', inspectedQtyDetail);
        return inspectedQtyDetail;
    }


    /**
     * Repository method to get inspected quantity for inspection id
     * @param inspReqId 
     * @param unitCode 
     * @param companyCode 
     * @returns 
    */
    async getInspectionQtyByInspReqId(inspReqId: number, unitCode: string, companyCode: string): Promise<{ inspected_qty: number, no_of_rolls: number }> {
        const inspectedQtyDetail: { inspected_qty: number, no_of_rolls: number } = await this.createQueryBuilder('insp_req_items')
            .select(`sum(ins_quantity) as inspected_qty, count(id) as no_of_rolls`)
            .where(`ins_request_id = ${inspReqId} AND unit_code = '${unitCode}' AND company_code = '${companyCode}'`)
            .getRawOne();
        return inspectedQtyDetail;
    }


    /**
     * REPOSITORY TO GET INSPECTION REQUEST ID FOR A ROLL ID AND REQUEST CATEGORY
     * @param rollId 
     * @param inspCategory 
     * @param unitCode 
     * @param companyCode 
     * @returns 
    */
    async getInspectionReqIdByRollIdAndReqCategory(rollId: number, inspCategory: InsFabricInspectionRequestCategoryEnum, unitCode: string, companyCode: string): Promise<number> {
        const qryRes: { ins_request_id: number } = await this.createQueryBuilder('insp_req_items')
            .select(`insp_req_items.ins_request_id`)
            .leftJoin(InsRequestEntity, 'ins_req', 'ins_req.id = insp_req_items.ins_request_id')
            .where(`insp_req_items.ref_id_L1 = ${rollId} AND ins_req.ins_type = '${inspCategory}' AND insp_req_items.unit_code = '${unitCode}' AND insp_req_items.company_code = '${companyCode}'`)
            .getRawOne();
        return qryRes ? qryRes.ins_request_id : null;
    }

    /**
     * REPOSITORY TO GET INSPECTION REQUEST ID FOR A ROLL ID AND REQUEST CATEGORY
     * @param rollId 
     * @param inspCategory 
     * @param unitCode 
     * @param companyCode 
     * @returns 
    */
    async getInspectionReqIdBySampleRollIdAndReqCategory(rollId: number, inspCategory: InsFabricInspectionRequestCategoryEnum, unitCode: string, companyCode: string): Promise<number> {
        const qryRes: { ins_request_id: number } = await this.createQueryBuilder('insp_req_items')
            .select(`insp_req_items.ins_request_id`)
            .leftJoin(InsRequestEntity, 'ins_req', 'ins_req.id = insp_req_items.ins_request_id')
            .where(`insp_req_items.ref_id_L1 = ${rollId} AND ins_req.ins_type = '${inspCategory}' AND insp_req_items.unit_code = '${unitCode}' AND insp_req_items.company_code = '${companyCode}'`)
            .getRawOne();
        return qryRes ? qryRes.ins_request_id : null;
    }

    /**
     * Repository method to get selected roll Info for lot  and Request category
     * @param lotNumber 
     * @param inspectionType 
     * @param unitCode 
     * @param companyCode 
     * @returns 
    */
    async getSelectedRollInfoForLotReqType(lotNumber: string, inspectionType: InsFabricInspectionRequestCategoryEnum, unitCode: string, companyCode: string): Promise<number[]> {
        const rollIds: { ph_item_lines_id: number }[] = await this.createQueryBuilder('insp_req_items')
            .select('insp_req_items.ph_item_lines_id')
            .leftJoin(InsRequestEntity, 'ins_req', 'ins_req.id = insp_req_items.ins_request_id')
            .where(`ins_req.lot_number = '${lotNumber}' AND ins_req.request_category = '${inspectionType}' AND ins_req.unit_code = '${unitCode}' AND ins_req.company_code = '${companyCode}'`)
            .getRawMany();
        return rollIds.map(roll => roll.ph_item_lines_id);
    }




    async getInspectionResultsByRequestIds(unitCode: string, companyCode: string, id: Array<number>): Promise<{
        inspection_result: string;
        total_rolls: string
        total_rolls_count: string;
        total_bales_count: string;
    }[]> {
        const query = await this.createQueryBuilder('ins_request_items')
            .select('ins_request_items.inspection_result', 'inspection_result')
            .addSelect('COUNT(ins_request_items.object_type)', 'total_rolls')
            .addSelect('COUNT(CASE WHEN p.object_type = "ROLL" THEN 1 END)', 'total_rolls_count')
            .addSelect('COUNT(CASE WHEN p.object_type = "BALE" THEN 1 END)', 'total_bales_count')
            .leftJoin('ph_item_lines', 'p', 'p.id = ins_request_items.ph_item_lines_id')
            .where('ins_request_items.ins_request_id IN (:...id)', { id })
            .andWhere('ins_request_items.unit_code = :unitCode', { unitCode })
            .andWhere('ins_request_items.company_code = :companyCode', { companyCode })
            .groupBy('ins_request_items.inspection_result')
            .addGroupBy('ins_request_items.ins_request_id')
            .getRawMany();

        return query as {
            inspection_result: string;
            total_rolls: string
            total_rolls_count: string;
            total_bales_count: string;
        }[];
    }

    async getRollCountByBatchNoForIns(jobL1: string, unitCode: string, companyCode: string): Promise<number> {
        const qryRes: { count: number } = await this.createQueryBuilder('iri')
            .select('COUNT(iri.id)', 'count')
            .leftJoin('ins_request', 'ir', 'ir.id = iri.ins_request_id')
            .where('ir.ref_job_L1 = :jobL1', { jobL1 })
            .andWhere('iri.unit_code = :unitCode', { unitCode })
            .andWhere('iri.company_code = :companyCode', { companyCode })
            .getRawOne();
        return qryRes?.count ?? 0;
    }

    async getInsRollIdByBarcode(
        barcode: string,
        uniCode: string,
        companyCode: string
    ): Promise<{ rollid: number[]; insReqId: number[] } | null> {
        const qryResp: { roll_id: number; ins_request_id: number }[] =
            await this.createQueryBuilder('ins_request_items')
                .select([
                    'ins_request_items.ref_id_L1 as roll_id',
                    'ins_request_items.ins_request_id as ins_request_id'
                ])
                .where('ref_no_L1 = :barcode', { barcode })
                .andWhere('ins_request_items.unit_code = :uniCode', { uniCode })
                .andWhere('ins_request_items.company_code = :companyCode', { companyCode })
                .getRawMany();

        if (!qryResp || qryResp.length === 0) {
            return null;
        }

        return {
            rollid: qryResp.map((r) => r.roll_id),
            insReqId: qryResp.map((r) => r.ins_request_id)
        };
    }



    async getInsBasicRollInfoForRollId(rollId: number, uniCode: string, companyCode: string): Promise<BasicRollInfoQryResp> {
        return await this.createQueryBuilder('ins_request_items')
            .select('ref_no_L1 as barcode, ir.ref_job_L2 as lot_number, ins_quantity as quantity')
            .leftJoin('ins_request', 'ir', 'ir.id = ins_request_items.ins_request_id')
            .where(`ins_request_items.ref_id_L1 = '${rollId}' AND ins_request_items.unit_code = '${uniCode}' AND ins_request_items.company_code = '${companyCode}'`)
            .getRawOne()
    }





}