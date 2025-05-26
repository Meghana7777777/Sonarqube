import { Column, CreateDateColumn, DataSource, Entity, ManyToMany, ManyToOne, OneToMany, Repository } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { OrderLineQueryResponse, PackOrderCreationOptionsEnum, PackOrderCreationRequest, RollSelectionTypeEnum, SewingCreationOptionsEnum, SewingOrderCreationRequest } from '@xpparel/shared-models';
import { Injectable } from "@nestjs/common";
import { OrderLineEntity } from "../entity/order-line.entity";
import { SoProdTypeCombinationQResponse } from "./query-response/so-prod-type-combinations.qresponse";
import { OrderEntity } from "../entity/order.entity";
import { orderAndOrderlineQueryResponse } from "./query-response/order-and-order-line-query.response";

@Injectable()
export class OrderLineRepository extends Repository<OrderLineEntity> {
    constructor(private dataSource: DataSource) {
        super(OrderLineEntity, dataSource.createEntityManager());
    }

    // gets the combinaitons of the order + product type + color -- to create the sub products accordingly
    async getSoProductTypeColorCombinations(orderId: number, companyCode: string, unitCode: string): Promise<SoProdTypeCombinationQResponse[]> {
        const query = this.createQueryBuilder('l')
            .select('id, order_id, product_sub_type, color_desc, style_description, style_code, style_name, sub_product_name, GROUP_CONCAT(id) as line_ids')
            .where(`order_id = ${orderId} AND company_code = '${companyCode}' AND unit_code = '${unitCode}' AND is_active = true AND is_original = false`)
            .groupBy('sub_product_name, product_sub_type, color_desc')
        return await query.getRawMany();
    }

    async getOrderAndOrderLineInformation(orderId: string, companyCode: string, unitCode: string): Promise<orderAndOrderlineQueryResponse[]> {
        const query = this.createQueryBuilder('orderline')
            .select('orderInfo.order_no, orderline.order_line_no, orderInfo.plant_style, orderInfo.style_description, orderInfo.style_code,orderInfo.style_name, orderline.garment_vendor_code, orderline.garment_vendor_name, orderline.garment_vendor_po, orderline.garment_vendor_po_item, orderInfo.buyer_loc, orderInfo.customer_name, orderInfo.customer_code, orderInfo.profit_center_code, orderInfo.profit_center_name, orderInfo.profit_center_name, orderInfo.product_name, orderInfo.product_category')
            .leftJoin(OrderEntity, 'orderInfo', 'orderInfo.company_code=orderline.company_code and orderInfo.unit_code=orderline.unit_code and orderInfo.id=orderline.order_id')
            .where(`orderInfo.order_no = '${orderId}' AND orderline.company_code = '${companyCode}' AND orderline.unit_code = '${unitCode}' AND orderline.is_active = true`)
            .groupBy('orderline.order_line_no')
        return await query.getRawMany();
    }


    async getOrderLineInfo(req: SewingOrderCreationRequest): Promise<OrderLineQueryResponse[]> {
        const companyCode = req.companyCode;
        const unitCode = req.unitCode;
        const query = this.createQueryBuilder('l')
            .select(`GROUP_CONCAT(DISTINCT l.id) as id,l.order_id,l.order_line_no AS soline,GROUP_CONCAT(DISTINCT l.po_serial) AS cutserial,SUM(l.quantity) AS qty,GROUP_CONCAT(DISTINCT l.style_code) AS style,GROUP_CONCAT(DISTINCT l.e_ref_no) AS e_ref_no,GROUP_CONCAT(DISTINCT l.style_code) AS style_code,GROUP_CONCAT(DISTINCT l.style_description) AS style_description,GROUP_CONCAT(DISTINCT l.planned_delivery_date) AS delivery_date,GROUP_CONCAT(DISTINCT l.destination) AS destination ,GROUP_CONCAT(DISTINCT l.planned_cut_date) AS planned_cut_date,GROUP_CONCAT(DISTINCT l.planned_production_date) AS planned_production_date,GROUP_CONCAT(DISTINCT l.co_line) AS co_line ,GROUP_CONCAT(DISTINCT l.buyer_po) AS buyer_po,GROUP_CONCAT(DISTINCT l.garment_vendor_po) AS garment_vendor_po,GROUP_CONCAT(DISTINCT l.sub_product_name) AS sub_product_name,GROUP_CONCAT(DISTINCT l.product_sub_type) AS product_sub_type`)
            .where(`order_id = '${req.orderId}' AND company_code = '${companyCode}' AND unit_code = '${unitCode}' AND l.is_original = false`)
        if (req.orderLine) {
            query.andWhere(`order_line_no = :orderLine`, { orderLine: req.orderLine });
        }
        if (req.cutSerial) {
            query.andWhere(`po_serial = :cutSerial`, { cutSerial: req.cutSerial });
        }
        query.groupBy(`order_line_no,product_sub_type,sub_product_name`);

        if (req.options && req.options.length > 0) {
            for (let optionsData of req.options) {
                // if (optionsData === SewingCreationOptionsEnum.CUTDATE) {
                //     optionsData = 'o.' + optionsData as any
                // }
                //query.addGroupBy(SewingCreationOptionsEnum[optionsData]); // Join column names with commas
                query.addGroupBy(optionsData);
            }

        }
        return await query.getRawMany();
    }

    async getOrderLineInfoForPackOrder(req: PackOrderCreationRequest): Promise<OrderLineQueryResponse[]> {
        const query = this.createQueryBuilder('l')
            .select(`GROUP_CONCAT(DISTINCT l.id) as id,l.order_id,l.order_line_no AS soline,GROUP_CONCAT(DISTINCT l.po_serial) AS cutserial,SUM(l.quantity) AS qty,GROUP_CONCAT(DISTINCT l.style_code) AS style,GROUP_CONCAT(DISTINCT l.e_ref_no) AS e_ref_no,GROUP_CONCAT(DISTINCT l.style_code) AS style_code,GROUP_CONCAT(DISTINCT l.style_description) AS style_description,GROUP_CONCAT(DISTINCT l.planned_delivery_date) AS delivery_date,GROUP_CONCAT(DISTINCT l.destination) AS destination ,GROUP_CONCAT(DISTINCT l.planned_cut_date) AS planned_cut_date,GROUP_CONCAT(DISTINCT l.planned_production_date) AS planned_production_date,GROUP_CONCAT(DISTINCT l.co_line) AS co_line ,GROUP_CONCAT(DISTINCT l.buyer_po) AS buyer_po,GROUP_CONCAT(DISTINCT l.garment_vendor_po) AS garment_vendor_po,GROUP_CONCAT(DISTINCT l.sub_product_name) AS sub_product_name,GROUP_CONCAT(DISTINCT l.product_sub_type) AS product_sub_type, GROUP_CONCAT(DISTINCT o.buyer_desc) AS buyer_desc, GROUP_CONCAT(o.order_no) AS so_no, GROUP_CONCAT(o.co) AS co_no, GROUP_CONCAT(o.customer_name) AS customer`)
            .leftJoin(OrderEntity, 'o', 'o.company_code = l.company_code AND o.unit_code = l.unit_code AND o.id = l.order_id ')
            .where(`order_id = '${req.orderId}' AND l.company_code = '${req.companyCode}' AND l.unit_code = '${req.unitCode}' AND l.is_original = false`)
        if (req.orderLine) {
            query.andWhere(`order_line_no = :orderLine`, { orderLine: req.orderLine });
        }
        if (req.cutSerial) {
            query.andWhere(`po_serial = :cutSerial`, { cutSerial: req.cutSerial });
        }
        query.groupBy(`order_line_no,product_sub_type,sub_product_name`);

        if (req.options && req.options.length > 0) {
            for (let optionsData of req.options) {
                if (optionsData === PackOrderCreationOptionsEnum.CUTDATE) {
                    optionsData = 'o.' + optionsData as any
                }
                //query.addGroupBy(SewingCreationOptionsEnum[optionsData]); // Join column names with commas
                query.addGroupBy(optionsData);
            }
        }
        return await query.getRawMany();
    }
}
