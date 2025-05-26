import { Injectable } from "@nestjs/common";
import { Repository, DataSource } from "typeorm";
import { LBinEntity } from "../entities/l-bin.entity";
import { LRackEntity } from "../entities/l-rack.entity";


@Injectable()
export class LBinRepo extends Repository<LBinEntity>{
    constructor(private dataSource: DataSource) {
        super(LBinEntity, dataSource.createEntityManager());
    }

    
    async getAllBinsDataByRackId(lRackId: number){
        const query = this.createQueryBuilder('lb')
        .select(`lb.bin_code, lr.code AS rack_code`)
        .leftJoin(LRackEntity, 'lr', 'lr.id=lb.l_rack_id')
        .where(`lb.l_rack_id = ${lRackId}`)
        const result = await query.getRawMany();
        return result;
    }
}