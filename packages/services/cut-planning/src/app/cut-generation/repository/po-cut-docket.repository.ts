import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { PoCutEntity } from "../entity/po-cut.entity";
import { PoCutDocketEntity } from "../entity/po-cut-docket.entity";
import { LayerMeterageRequest } from "@xpparel/shared-models";
import moment from "moment";

@Injectable()
export class PoCutDocketRepository extends Repository<PoCutDocketEntity> {
    constructor(private dataSource: DataSource) {
        super(PoCutDocketEntity, dataSource.createEntityManager());
    }

    async getTotalLayedCutsTodayRepo(unitCode: string, companyCode: string, docketNumber: number): Promise<{cutNumber:  number}> {
        const query = await this.createQueryBuilder('pcd')
            .select('COUNT(DISTINCT pcd.cut_number)', 'cutNumber')
            .where('pcd.docket_number IN (:docketNumbers)', { docketNumbers: docketNumber })
            .andWhere('pcd.unit_code = :unitCode', { unitCode })
            .andWhere('pcd.company_code = :companyCode', { companyCode })
            .getRawOne();

        return query?.cutNumber ?? 0;
    }


}

