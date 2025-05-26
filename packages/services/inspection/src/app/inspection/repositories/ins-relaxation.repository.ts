import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { InsRelaxationEntity } from "../../entities/ins_relaxation.entity";
import { RelaxationPointValuesQryResp } from "./query-response/relaxation-point-values.qry.resp";

@Injectable()
export class InsRelaxationRepo extends Repository<InsRelaxationEntity> {
    constructor(dataSource: DataSource) {
        super(InsRelaxationEntity, dataSource.createEntityManager());
    }



    /**
     * REPOSITORY TO GET ITEM LINE ACTUAL INFORMATION FOR THE RELAXATION 
     * @param rollId 
     * @param unitCode 
     * @param companyCode 
     * @returns 
    */

    async getRelaxationPointDetailsForRollId(rollId: number, unitCode: string, companyCode: string): Promise<RelaxationPointValuesQryResp[]> {
        return await this.createQueryBuilder('ph_item_relaxation')
            .select('width, measured_ref, measured_at, measured_order')
            .where(`ins_req_item_id = ${rollId} AND unit_code = '${unitCode}' AND company_code = '${companyCode}'`)
            .getRawMany();
    }





}