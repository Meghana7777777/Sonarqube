import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { PhItemLineSampleEntity } from "../entities/ph-item-line-sample.entity";
import { dataSource } from "../../../database/type-orm-config/typeorm.config-migrations";
import { rollIdSampleIdQryResp } from "./query-response/roll-id-sample-id.qry.resp";

@Injectable()
export class PhItemLineSampleRepo extends Repository<PhItemLineSampleEntity>{
    constructor(dataSource: DataSource) {
        super(PhItemLineSampleEntity, dataSource.createEntityManager());
    }

    /**
     * REPOSITORY TO GET ROLL ID BY BARCODE
     * @param barcode 
     * @param uniCode 
     * @param companyCode 
     * @returns 
    */
    async getSampleRollIdByBarcode(barcode: string, uniCode: string, companyCode: string): Promise<rollIdSampleIdQryResp> {
        return await this.createQueryBuilder('ph_line_items_sample')
        .select('ph_item_lines_id as roll_id, id as sample_roll_id')
        .where(`barcode = '${barcode}' AND ph_line_items_sample.unit_code = '${uniCode}' AND ph_line_items_sample.company_code = '${companyCode}'`)
        .getRawOne();
    }

    /**
     * REPOSITORY TO GET ROLL ID BY BARCODE
     * @param barcode 
     * @param uniCode 
     * @param companyCode 
     * @returns 
    */
    async getSampleRollIdByRollId(rollId: number, uniCode: string, companyCode: string): Promise<rollIdSampleIdQryResp> {
        return await this.createQueryBuilder('ph_line_items_sample')
        .select('ph_item_lines_id as roll_id, id as sample_roll_id')
        .where(`ph_item_lines_id = '${rollId}' AND ph_line_items_sample.unit_code = '${uniCode}' AND ph_line_items_sample.company_code = '${companyCode}'`)
        .getRawOne();
    }
}