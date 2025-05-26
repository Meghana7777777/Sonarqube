import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PackIdRequest, PackListIdRequest } from "@xpparel/shared-models";
import { BaseAbstractRepository } from "packages/services/packing-management/src/database/common-repositories";
import { Repository } from "typeorm";
import { ItemDimensionsEntity } from "../../__masters__/items/entities/item-dimensions.entity";
import { ItemsEntity } from "../../__masters__/items/entities/items.entity";
import { CartonParentHierarchyEntity } from "../entities/carton-config-parent-hierarchy.entity";
import { ConfigLeastAggregatorEntity } from "../entities/config-least-aggregator.entity";
import { ConfigLeastChildEntity } from "../entities/config-least-child.entity";
import { PLConfigEntity } from "../entities/pack-list.entity";
import { ConfigLeastChildRepoInterface } from "./config-least-child.repo.interface";
import { PKMSPoSubLineEntity } from "../../pre-integrations/pkms-po-entities/pkms-po-sub-line-entity";
import { PKMSProcessingOrderEntity } from "../../pre-integrations/pkms-po-entities/pkms-processing-order-entity";

@Injectable()
export class ConfigLeastChildRepo extends BaseAbstractRepository<ConfigLeastChildEntity> implements ConfigLeastChildRepoInterface {
    constructor(
        @InjectRepository(ConfigLeastChildEntity)
        private readonly configChildEntity: Repository<ConfigLeastChildEntity>,
    ) {
        super(configChildEntity);
    }
    async getPlGenQty(companyCode: string, unitCode: string, subLineId: number): Promise<{
        qty: number;
    }> {
        const query: { qty: number } = await this.configChildEntity.createQueryBuilder('fgRatios')
            .select(`sum(fgRatios.ratio*carton_proto.count*poly_bag.count) as qty`)
            .leftJoin(PKMSPoSubLineEntity, 'sub_po', 'sub_po.company_code = fgRatios.company_code AND sub_po.unit_code = fgRatios.unit_code AND sub_po.id = fgRatios.po_order_sub_line_id')
            .leftJoin(CartonParentHierarchyEntity, 'carton_proto', 'carton_proto.company_code = fgRatios.company_code AND carton_proto.unit_code = fgRatios.unit_code AND carton_proto.id = fgRatios.parent_hierarchy_id')
            .leftJoin(ConfigLeastAggregatorEntity, 'poly_bag', 'poly_bag.company_code = fgRatios.company_code AND poly_bag.unit_code = fgRatios.unit_code AND poly_bag.id = fgRatios.least_aggregator_id')
            .where(`fgRatios.company_code = '${companyCode}' AND fgRatios.unit_code = '${unitCode}' AND fgRatios.po_order_sub_line_id ='${subLineId}'`)
            .groupBy(`fgRatios.po_order_sub_line_id`)
            .getRawOne();
        return query;
    }



    async getColorCode(req: PackListIdRequest) {
        const query = await this.configChildEntity.createQueryBuilder('pmt')
            .select(`DISTINCT pmt.color as color, pmt.size AS size`)
            .leftJoin(PLConfigEntity, 'pl', 'pl.id=pmt.pk_config_id')
            .where(`pmt.pk_config_id='${req.packListId}' and pmt.company_code='${req.companyCode}' and pmt.unit_code='${req.unitCode}'`)
            .getRawMany()
        return query;

    }



    async getSizes(req: PackIdRequest) {
        const query = await this.configChildEntity.createQueryBuilder('pmt')
            .select(`DISTINCT pmt.size AS size`)
            .where(`pmt.pk_config_id='${req.packListId}' and pmt.company_code='${req.companyCode}' and pmt.unit_code='${req.unitCode}'`)
            .getRawMany()
        return query;
    }

    async getReportData(req: PackIdRequest) {
        const query = await this.configChildEntity.createQueryBuilder('lc')
            .select(`CONCAT (lc.size,'-',lc.ratio) AS sizeRatio,lc.ratio as ratio,lc.color as colorCode,
                sb.fg_color as color,
                sb.destination as country,
                sb.product_name as product_name,
                lc.po_order_sub_line_id,
                carton_proto.net_weight,
                carton_proto.gross_weight,
                item_dimensions.length,
                item_dimensions.width,
                item_dimensions.height,
                lc.parent_hierarchy_id,
                pl.no_of_cartons,sb.qty as orderQty,lc.pk_config_id as plId,lc.size,pl.pl_config_desc as block`)
            .leftJoin(PKMSPoSubLineEntity, 'sb', 'lc.`po_order_sub_line_id` = sb.id')
            .leftJoin(PLConfigEntity, 'pl', 'pl.id=lc.pk_config_id')
            .leftJoin(PKMSProcessingOrderEntity, 'po', 'po.id=lc.po')
            .leftJoin(CartonParentHierarchyEntity, 'carton_proto', 'carton_proto.company_code = lc.company_code AND carton_proto.unit_code = lc.unit_code AND carton_proto.id = lc.parent_hierarchy_id')
            .leftJoin(ItemsEntity, 'items', 'items.id = carton_proto.itemId')
            .leftJoin(ItemDimensionsEntity, 'item_dimensions', 'item_dimensions.id = items.dimensions_id')
            .where(`lc.pk_config_id in (${req.packListId}) and lc.company_code='${req.companyCode}' and lc.unit_code='${req.unitCode}'`)
            .getRawMany()
        return query;
    }


}