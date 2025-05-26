import { Column, CreateDateColumn, DataSource, Entity, ManyToMany, ManyToOne, OneToMany, Repository } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { GlobalResponseObject, RollSelectionTypeEnum } from '@xpparel/shared-models';
import { Injectable } from "@nestjs/common";
import { OrderSubLineRmEntity } from "../entity/order-sub-line-rm.entity";
import { OrderSubLineEntity } from "../entity/order-sub-line.entity";
import { OrderEntity } from "../entity/order.entity";
import { OrderLineEntity } from "../entity/order-line.entity";
import { OrderInfoByPoSerailQueryResponse } from "./query-response/order-info-by-poserial-query.response";
import { OrderWithSelectedFieldsResponse } from "./query-response/order-and-order-line-query.response";

@Injectable()
export class OrderRepository extends Repository<OrderEntity> {
  constructor(private dataSource: DataSource) {
    super(OrderEntity, dataSource.createEntityManager());
  }
  async getOrdersWithSelectedFields(orderNos: string[], companyCode: string, unitCode: string): Promise<OrderWithSelectedFieldsResponse[]> {
    return await this.createQueryBuilder('order')
      .select([
        'order.orderNo AS orderNo',
        'order.plantStyle AS plantStyleReference',
        'order.plannedCutDate AS plannedCutDate',
        'orderLine.plannedCutDate AS plannedOrderLineCutDate',
        'orderLine.plannedProductionDate AS plannedProductionDate',
        'orderLine.plannedDeliveryDate AS plannedDeliveryDate'
      ])
      .leftJoin('order.orderLines', 'orderLine')
      .where('order.unit_code = :unitCode', { unitCode })
      .andWhere('order.company_code = :companyCode', { companyCode })
      .andWhere('order.orderNo IN (:...orderNos)', { orderNos })
      .getRawMany<OrderWithSelectedFieldsResponse>();
  }


            
    async getOrderInfoByPoSerial(poSerail : number): Promise<OrderInfoByPoSerailQueryResponse[]>{
        return await this.createQueryBuilder('o')
        .select('o.product_type,o.product_name,o.product_category,o.plant_style,ol.planned_delivery_date, ol.destination,ol.planned_production_date,ol.planned_cut_date,ol.co_line,ol.buyer_po,ol.garment_vendor_po,osl.id as oslId')
        .leftJoin(OrderLineEntity,'ol','o.id = ol.order_id')
        .leftJoin(OrderSubLineEntity,'osl','osl.order_id = o.id')
        .where(`ol.po_serial = ${poSerail}`)
        .groupBy(`osl.id`)
        .getRawMany()
    }


   
}
