

import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { PoRoutingGroupEntity } from "../po-routing-group-entity";
import { ProcessTypeQueryResp } from "./query-response";



@Injectable()
export class PoRoutingGroupRepository extends Repository<PoRoutingGroupEntity> {
    constructor(private dataSource: DataSource) {
        super(PoRoutingGroupEntity, dataSource.createEntityManager());
    }


    async getDistinctProcessTypesForPoSerial(processingSerial: number[],unitCode:string,companyCode:string):Promise<ProcessTypeQueryResp[]>{
        
        const query = this.createQueryBuilder('poRg')
        .select('DISTINCT poRg.processType', 'processType')
        .where('poRg.processingSerial IN (:...processingSerial)', { processingSerial })
        .andWhere('poRg.unitCode = :unitCode', { unitCode })
        .andWhere('poRg.companyCode = :companyCode', { companyCode })
        .getRawMany();

        return await query;

    }
}
