import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InsShrinkageEntity } from "../../entities/ins-shrinkage.entity";
import { ShrinkageTypeDetailsQryResp } from "./query-response/ins-shrinkage-details.qry.resp";

@Injectable()
export class InsShrinkageRepo extends Repository<InsShrinkageEntity>{
    constructor(dataSource: DataSource) {
        super(InsShrinkageEntity, dataSource.createEntityManager());
    }

    /**
     * Repository method to get SHRINKAGE details for roll
     * @param rollId 
     * @param unitCode 
     * @param companyCode 
    */
    async getShrinkageDetailsForRoll(rollId: number, unitCode: string, companyCode: string): Promise<ShrinkageTypeDetailsQryResp[]> {
        const shrinkageInfo = await this.createQueryBuilder('defect_detail')
            .select('shrinkage_type, a_sk_length, a_sk_width, sk_group, ins_req_item_id, uom, width_after_sk, length_after_sk')
            .where(`ins_req_item_id = ${rollId} AND unit_code = '${unitCode}' AND company_code = '${companyCode}'`)
            .getRawMany()
        return shrinkageInfo;
    }
}   