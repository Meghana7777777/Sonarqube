import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { InsConfigItemsEntity } from "../entities/ins-header-config-items";

@Injectable()
export class InsConfigItemRepo extends Repository<InsConfigItemsEntity> {
    constructor(dataSource: DataSource) {
        super(InsConfigItemsEntity, dataSource.createEntityManager());
    }
    async getDistinctInsCats(headers: number[]) {
        return await this.createQueryBuilder('item')
            .select('DISTINCT item.headerRef', 'headerRef')
            .where('item.headerRef IN (:...headerIds)', { headerIds: headers })
            .getRawMany();
    }
}