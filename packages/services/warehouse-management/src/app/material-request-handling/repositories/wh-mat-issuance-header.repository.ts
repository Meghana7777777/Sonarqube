import { Injectable } from "@nestjs/common";
import { Repository, DataSource } from "typeorm";
import { WhMatIssLogHeaderEntity } from "../entities/wh-mat-issuance-header.entity";
import { Rm_issuanceInfoModel } from "@xpparel/shared-models";


@Injectable()
export class WhMatIssLogHeaderRepo extends Repository<WhMatIssLogHeaderEntity>{
    constructor(private dataSource: DataSource) {
        super(WhMatIssLogHeaderEntity, dataSource.createEntityManager());
    }

    async getIssuanceDateAndIssuedByByIssuanceNo( issuanceId: number, unitCode: string, companyCode: string ): Promise<Rm_issuanceInfoModel | null> {
        const result = await this.createQueryBuilder('wmih')
          .select([
            'wmih.id AS "issuanceId"',
            'wmih.issuance_by AS "issuedBy"',
            'wmih.issued_on AS "issuanceDate"',
          ])
          .where('wmih.unit_code = :unitCode', { unitCode })
          .andWhere('wmih.company_code = :companyCode', { companyCode })
          .andWhere('wmih.id = :issuanceId', { issuanceId })
          .getRawOne<Rm_issuanceInfoModel>();
        return result ?? null;
      }

}