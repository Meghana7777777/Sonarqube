import { Column, CreateDateColumn, DataSource, Entity, ManyToMany, ManyToOne, OneToMany, Repository } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { PackOrderCreationOptionsEnum, RollSelectionTypeEnum, SubLineQueryResponse } from '@xpparel/shared-models';
import { Injectable } from "@nestjs/common";
import { OrderSubLineRmEntity } from "../entity/order-sub-line-rm.entity";
import { OrderSubLineEntity } from "../entity/order-sub-line.entity";
import { OrderLineEntity } from "../entity/order-line.entity";
import { OrderEntity } from "../entity/order.entity";

@Injectable()
export class OrderSubLineRepository extends Repository<OrderSubLineEntity> {
    constructor(private dataSource: DataSource) {
        super(OrderSubLineEntity, dataSource.createEntityManager());
    }
    async getOrderSubLineInfo(ids: string[], subLineWhereObj: any[], sewSublineIds: any[]): Promise<SubLineQueryResponse[]> {
        const query = this.createQueryBuilder('osl')
            .select(`ol.order_line_no,ol.po_serial,osl.id,osl.color_Desc,osl.size_code,osl.quantity,ol.planned_delivery_date as delivery_date,ol.destination,ol.planned_cut_date,ol.planned_production_date as planned_production_date,ol.co_line,ol.buyer_po,ol.garment_vendor_po, ol.sub_product_name as product_name, o.order_no as so_number, o.style_code as style`)
            .leftJoin(OrderLineEntity, 'ol', 'osl.order_line_id = ol.id')
            .leftJoin(OrderEntity, 'o', 'o.id = ol.order_id')
            .groupBy(`osl.id`)
            .where(`ol.is_original = false`)
        if (ids.length) {
            query.andWhere('osl.orderLineId IN (:...ids)', { ids })
        }
        if (sewSublineIds.length > 0) {
            query.andWhere('osl.id NOT IN (:...sewSublineIds)', { sewSublineIds })
        }
        for (const subLineWhere of subLineWhereObj) {
            let key = Object.keys(subLineWhere)[0];
            if(key === PackOrderCreationOptionsEnum.CUTDATE){
                key = 'o.'+ key as any
            }
            query.andWhere(`${key} = '${subLineWhere[key]}'`);
        }
        return await query.getRawMany();
    }

    async getOrderSubLineInfoForOslIds(oslIds: number[], companyCode: string, unitCode: string): Promise<SubLineQueryResponse[]> {
        const query = this.createQueryBuilder('osl')
            .select(`ol.order_line_no,ol.po_serial,osl.id,osl.color_Desc,osl.size_code,osl.quantity,ol.planned_delivery_date as delivery_date,ol.destination,ol.planned_cut_date,ol.planned_production_date as planned_production_date,ol.co_line,ol.buyer_po,ol.garment_vendor_po, ol.sub_product_name as product_name, o.order_no as so_number, o.style_code as style`)
            .leftJoin(OrderLineEntity, 'ol', 'osl.order_line_id = ol.id AND osl.company_code = ol.company_code AND osl.unit_code = ol.unit_code ')
            .leftJoin(OrderEntity, 'o', 'o.id = ol.order_id AND o.company_code = ol.company_code AND o.unit_code = ol.unit_code ')
            .where(`osl.id IN (:...ids) AND osl.company_code = '${companyCode}' AND osl.unit_code = '${unitCode}' `, {ids: oslIds})
            .groupBy(`osl.id`);
        return await query.getRawMany();
    }


}
