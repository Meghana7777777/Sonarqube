import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { PhItemLinesActualEntity } from "../entities/ph-item-lines-actual.entity";
import { dataSource } from "../../../database/type-orm-config/typeorm.config-migrations";
import { GsmDetailsQryResp } from "./query-response/gsm-details.qry.resp";
import { RelaxationDetailsQryResp } from "./query-response/relaxation-details.qry.resp";
import { ShadeDetailsQryResp } from "./query-response/shade-details.qry.resp";

@Injectable()
export class PhItemLinesActualRepo extends Repository<PhItemLinesActualEntity>{
    constructor(dataSource: DataSource) {
        super(PhItemLinesActualEntity, dataSource.createEntityManager());
    }

    /**
     * REPOSITORY METHOD TO GET THE ITEM LINES ACTUAL GSM VALUES
     * @param rollId 
     * @param unitCode 
     * @param companyCode 
     * @returns 
    */
    async geItemLineActualForGsm(rollId: number, unitCode: string, companyCode: string): Promise<GsmDetailsQryResp> {
        return await this.createQueryBuilder('line_item_actual')
        .select('a_gsm, tolerance_from, tolerance_to, adjustment_value, adjustment')
        .where(`ph_item_lines_id = ${rollId} AND unit_code = '${unitCode}' AND company_code = '${companyCode}'`)
        .getRawOne();
    }

    /**
     * REPOSITORY TO GET ITEM LINE ACTUAL INFORMATION FOR THE RELAXATION 
     * @param rollId 
     * @param unitCode 
     * @param companyCode 
     * @returns 
    */
    async getItemLineActualForRelaxation(rollId: number, unitCode: string, companyCode: string): Promise<RelaxationDetailsQryResp> {
        return await this.createQueryBuilder('line_item_actual')
        .select('no_of_joins, a_width, a_length')
        .where(`ph_item_lines_id = ${rollId} AND unit_code = '${unitCode}' AND company_code = '${companyCode}'`)
        .getRawOne();
    }

    /**
     * REPOSITORY TO GET ITEM LINE ACTUAL INFORMATION FOR THE SHADE 
     * @param rollId 
     * @param unitCode 
     * @param companyCode 
     * @returns 
    */
    async getItemLineActualForShade(rollId: number, unitCode: string, companyCode: string): Promise<ShadeDetailsQryResp> {
        return await this.createQueryBuilder('line_item_actual')
        .select('a_shade_group, a_shade')
        .where(`ph_item_lines_id = ${rollId} AND unit_code = '${unitCode}' AND company_code = '${companyCode}'`)
        .getRawOne();
    }


}