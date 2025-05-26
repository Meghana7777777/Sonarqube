import { Injectable } from "@nestjs/common";
import { StyleProductCodeRequest } from "@xpparel/shared-models";
import { DataSource, Repository } from "typeorm";
import { SpOpVersionEntity } from "../entity/sp-op-version.entity";
import { SpProcTypeEntity } from "../entity/sp-proc-type.entity";
import { StyleProductTypeEntity } from "../entity/style-product.entity";

@Injectable()
export class StyleProductTypeRepository extends Repository<StyleProductTypeEntity> {
    constructor(private dataSource: DataSource) {
        super(StyleProductTypeEntity, dataSource.createEntityManager());
    }

    async getProcessTypesForStyle(req:StyleProductCodeRequest){
        const  query = await this.createQueryBuilder('spt')
        .select('DISTINCT(spt.proc_type) as processType')
        .leftJoin(SpOpVersionEntity,'spv','spv.sp_id = spt.id')
        .leftJoin(SpProcTypeEntity,'spp','spp.sp_version_id = spv.id')
        .where(`spt.company_code = ${req.companyCode} and spt.unit_code = ${req.unitCode}`)
        .andWhere(`spt.style_code = ${req.styleCode}`)

        return await query.getRawMany()
    }

}

