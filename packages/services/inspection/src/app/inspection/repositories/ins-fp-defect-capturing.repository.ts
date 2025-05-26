import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InsFpDefectEntity } from "../../entities/ins-fp-defect.entity";
import { DefectCapturingDetailsResp } from "./query-response/defect-capturing-details.qry.resp";

@Injectable()
export class InsFpDefectCapturingRepo extends Repository<InsFpDefectEntity> {
    constructor(dataSource: DataSource) {
        super(InsFpDefectEntity, dataSource.createEntityManager());
    }

    /**
     * Repository method to get four point details for roll
     * @param rollId 
     * @param unitCode 
     * @param companyCode 
    */
    async getFourPointDetailsForRoll(rollId: number, unitCode: string, companyCode: string): Promise<DefectCapturingDetailsResp[]> {
        const pointInfo = await this.createQueryBuilder('defect_detail')
            .select('id, point_length, point_value, reason, reason_id, remarks, point_position')
            .where(`ph_item_lines_id = ${rollId} AND unit_code = '${unitCode}' AND company_code = '${companyCode}'`)
            .getRawMany()
        return pointInfo;
    }
}   