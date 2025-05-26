import { Injectable } from "@nestjs/common";
import { Repository, DataSource } from "typeorm";
import { LRackEntity } from "../entities/l-rack.entity";


@Injectable()
export class LRackRepo extends Repository<LRackEntity>{
    constructor(private dataSource: DataSource) {
        super(LRackEntity, dataSource.createEntityManager());
    }

    async getAllRacksDataa() {
        const query = this.createQueryBuilder('lr')
            .select(`lr.name AS rackName, lr.id, lr.code`)
        const result = await query.getRawMany();
        return result;
    }
}