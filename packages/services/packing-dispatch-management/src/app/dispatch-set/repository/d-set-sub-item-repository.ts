
import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { DSetSubItemEntity } from "../entity/d-set-sub-item.entity";
import { DSetSubItemAttrEntity } from "../entity/d-set-sub-item-attr.entity";
import { GroupedSubItemsQueryResponse } from "./query-response/grouped-sub-items.query.response";

@Injectable()
export class DSetSubItemRepository extends Repository<DSetSubItemEntity> {
    constructor(private dataSource: DataSource) {
        super(DSetSubItemEntity, dataSource.createEntityManager());
    }

    async getSubItemsGroupBySizeShade(dSetId: number, dSetItemId: number, companyCode: string, unitCode: string): Promise<GroupedSubItemsQueryResponse[]> {
        const query = this.createQueryBuilder('si')
        .select(` l1 as size, l2 as shade, count(1) as total_bundles, SUM(item_quantity) as total_quantity `)
        .leftJoin(DSetSubItemAttrEntity, 'sia', 'sia.d_set_sub_item_ref_id = si.de_ref_id')
        .where(`si.company_code = '${companyCode}' AND si.unit_code = '${unitCode}' AND si.d_set_item_id = ${dSetItemId} AND si.d_set_id = ${dSetId} `)
        .groupBy(`l1, l2`);

        const result : GroupedSubItemsQueryResponse[] = await query.getRawMany();
        return result;
    }

}
