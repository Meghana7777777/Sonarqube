import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { FgMRackEntity } from "../../racks/entity/fg-m-rack.entity";
import { FgMLocationEntity } from "../entities/fgm-location.entity";
import { FGMWareHouseEntity } from "../../warehouse-masters/entities/fg-m-warehouse.entity";



@Injectable()
export class FgMLocationsRepo extends Repository<FgMLocationEntity> {
    constructor(private dataSource: DataSource) {
        super(FgMLocationEntity, dataSource.createEntityManager());
    }


    async getAllLocationsDataByRackId(lRackId: number): Promise<{ r_id: number, id: number, location_code: string, rack_code: string }[]> {
        const query = this.createQueryBuilder('lb')
            .select(`lb.id,lb.location_code,lr.id as r_id, lr.code AS rack_code`)
            .leftJoin(FgMRackEntity, 'lr', 'lr.id=lb.rack_id')
            .where(`lb.rack_id = ${lRackId}`)
        const result = await query.getRawMany();
        return result;
    }
}