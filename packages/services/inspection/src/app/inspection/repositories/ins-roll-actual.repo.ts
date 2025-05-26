import { Injectable } from "@nestjs/common";
import { InsRollsActualInfoEntity } from "../../entities/ins_rolls_actual_info.entity";
import { DataSource, Repository } from "typeorm";
import { ShadeDetailsQryResp } from "./query-response/ins-shade-details.qry.resp";
import { GsmDetailsQryResp } from "./query-response/ins-gsm-details.qry.resp";
import { RelaxationDetailsQryResp } from "./query-response/ins-relaxation.qry.resp";

@Injectable()
export class InsRollActualRepo extends Repository<InsRollsActualInfoEntity> {
    constructor(private dataSource: DataSource) {
        super(InsRollsActualInfoEntity, dataSource.createEntityManager());
    }

    async getItemLineActualForShade(rollId: number, unitCode: string, companyCode: string): Promise<ShadeDetailsQryResp> {
        return await this.createQueryBuilder('ins_rolls_actual_info')
            .select('a_shade_group, a_shade')
            .where(`ins_req_items_id = ${rollId} AND unit_code = '${unitCode}' AND company_code = '${companyCode}'`)
            .getRawOne();
    }

    async geItemLineActualForGsm(insReqItemId: number, unitCode: string, companyCode: string): Promise<GsmDetailsQryResp> {
        return await this.createQueryBuilder('ins_gsm')
            .select('a_gsm, tolerance_from, tolerance_to, adjustment_value, adjustment, gsm')
            .where(`ins_req_items_id = ${insReqItemId} AND unit_code = '${unitCode}' AND company_code = '${companyCode}'`)
            .getRawOne();
    }

    async getItemLineActualForRelaxation(rollId: number, unitCode: string, companyCode: string): Promise<RelaxationDetailsQryResp> {
            return await this.createQueryBuilder('ins_relaxation')
                .select('no_of_joins, a_width, a_length')
                .where(`ins_req_items_id = ${rollId} AND unit_code = '${unitCode}' AND company_code = '${companyCode}'`)
                .getRawOne();
        }

}