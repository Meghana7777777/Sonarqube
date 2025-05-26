import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { DSetSubItemContainerMapEntity } from "../entity/d-set-sub-item-container-map.entity";

@Injectable()
export class DSetSubItemContainerMapRepository extends Repository<DSetSubItemContainerMapEntity>{
    constructor(private dataSource:DataSource){
        super(DSetSubItemContainerMapEntity,dataSource.createEntityManager())
    }


    async getPendingToPutInBagItemsCountForDsetIds(dSetIds: number[], companyCode: string, unitCode: string): Promise<{total_items: number}> {
        const totalItemsInBags: {total_items: number} = await this.createQueryBuilder('m')
        .select(`count(DISTINCT d_set_sub_item_id) as total_items`)
        .where(` d_set_id IN(:...ids)  AND company_code = '${companyCode}' AND unit_code = '${unitCode}' AND is_active = true `, {ids: dSetIds})
        .getRawOne();
        return totalItemsInBags;
    }

}