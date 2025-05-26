import { Injectable } from "@nestjs/common";
import { Repository, DataSource } from "typeorm";
import { FgMRackEntity } from "../entity/fg-m-rack.entity";
import { FGMWareHouseEntity } from "../../warehouse-masters/entities/fg-m-warehouse.entity";
import { CommonRequestAttrs, FgRackFilterRequest } from "@xpparel/shared-models";



@Injectable()
export class FgRacksRepository extends Repository<FgMRackEntity> {
    constructor(private dataSource: DataSource) {
        super(FgMRackEntity, dataSource.createEntityManager());
    }

    async getAllRacksDataa() {
        const query = this.createQueryBuilder('lr')
            .select(`lr.name AS rackName, lr.id, lr.code`)
        const result = await query.getRawMany();
        return result;
    }

    async getAllRacksData(req: FgRackFilterRequest) {
        const query = await this.createQueryBuilder('lr')
            .select(`lr.*,whId.desc,whId.id as whId`)
            .leftJoin(FGMWareHouseEntity, 'whId', `whId.id=lr.wh_id`)
            .where(`lr.company_code = '${req.companyCode}' and lr.unit_code = '${req.unitCode}'`)
            .orderBy('lr.created_at', 'DESC');
             if (req.whId) {
                query.andWhere(`lr.wh_id='${req.whId}'`)
                // query.andWhere(`lr.is_active= 1`)
            }
        return query.getRawMany();
    }

    async getRacksData(req: FgRackFilterRequest) {
        const query = await this.createQueryBuilder('lr')
            .select(`lr.*,whId.desc,whId.id as whId`)
            .leftJoin(FGMWareHouseEntity, 'whId', `whId.id=lr.wh_id`)
            .where(`lr.company_code = '${req.companyCode}' and lr.unit_code = '${req.unitCode}'`)
        if (req.whId) {
            query.andWhere(`lr.wh_id='${req.whId}'`)
            // query.andWhere(`lr.is_active= 1`)
        }
        return query.getRawMany();
    }
}