import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { PoWhRequestLineEntity } from "../po-wh-request-line-entity";

@Injectable()
export class PoWhRequestLineRepository extends Repository<PoWhRequestLineEntity> {
    constructor( dataSource: DataSource ) {
        super(PoWhRequestLineEntity, dataSource.createEntityManager());
    }

    async getPoWhReqLineDataByJobNumber( jobNumber: string, companyCode: string, unitCode: string, size: string, itemCode: string, productRef: string, fgColor: string ): Promise<number[]> {
        const results = await this.createQueryBuilder("pwr")
          .select("pwr.id", "id")
          .where("pwr.jobNumber = :jobNumber", { jobNumber })
          .andWhere("pwr.companyCode = :companyCode", { companyCode })
          .andWhere("pwr.unitCode = :unitCode", { unitCode })
        //   .andWhere("pwr.size = :size", { size })
          .andWhere("pwr.itemCode = :itemCode", { itemCode })
          .andWhere("pwr.productRef = :productRef", { productRef })
          .andWhere("pwr.fgColor = :fgColor", { fgColor })
          .getRawMany();
      
        return results.map(row => row.id);
      }
      

}

