import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, JoinColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { OrderEntity } from "./order.entity";
import { OrderSubLineEntity } from "./order-sub-line.entity";
import { OrderLineRmEntity } from "./order-line-rm.entity";
import { OrderLineOpEntity } from "./order-line-op.entity";
import { OrderLineOpRmEntity } from "./order-line-op-rm.entity";

@Entity('order_line')
export class OrderLineEntity extends AbstractEntity {



        // ext ref no for order line
        @Column({ type: 'varchar', name: 'order_line_no', nullable: false })
        orderLineNo: string;

        @Column({ type: 'varchar', length: 20, name:'style_name', nullable: false })
        styleName: string;

        @Column({ type: 'varchar', length: 50, name: 'color_desc', nullable: false })
        colorDesc: string;

        @Column({ type: 'varchar', length: 50, name: 'color_code', nullable: false })
        colorCode: string;

        @Column({ type: 'int', name:'quantity', nullable: false })
        quantity: number;

        @Column({ type: 'varchar', length: 30, name: 'co_line', nullable: true })
        coLine: string;

        @Column({ type: 'varchar', length: 30, name: 'e_ref_no', nullable: true })
        eRefNo: string;

        @Column({ type: 'varchar', length: 30, name: 'i_ref_no', nullable: true })
        iRefNo: string;

        @Column({ type: 'varchar', length: 30, name:'destination', nullable: true })
        destination: string;

        @Column({ type: 'date', name: 'delivery_date', nullable: true })
        deliveryDate: string;

        @Column({ type: 'varchar', length: 50, name: 'sub_product_name', nullable: true })
        subProductName: string;

        @Column({ type: 'varchar', length: 40, name: 'product_sub_type', nullable: true })
        productSubType: string;

        @Column({ type: 'varchar', length: 50, name: 'combination_ref', nullable: true })
        combinationRef: string;

        @Column({ type: 'boolean', name: 'is_original', default: true })
        isOriginal: boolean;

        // this column is a self relation where  original line is break down into multiple lines based on the pack method qtys
        @Column({ type: 'int', name: 'parent_id', nullable: true, default: 0 })
        parentId: number;

        @Column({ type: 'varchar', length: 50, name: 'buyer_po', nullable: true })
        buyerPo: string;

        @Column({ type: 'varchar', length: 50, name: 'garment_vendor_code', nullable: true })
        garmentVendorCode: string;

        @Column({ type: 'varchar', length: 50, name: 'garment_vendor_name', nullable: true })
        garmentVendorName: string;

        @Column({ type: 'varchar', length: 50, name: 'garment_vendor_unit', nullable: true })
        garmentVendorUnit: string;

        @Column({ type: 'varchar', length: 50, name: 'garment_vendor_po', nullable: true })
        garmentVendorPo: string;

        @Column({ type: 'varchar', length: 50, name: 'garment_vendor_po_item', nullable: true })
        garmentVendorPoItem: string;

        @Column({ type: 'varchar', length: 100, name: 'style_code', nullable: true })
        styleCode: string;

        @Column({ type: 'varchar', length: 100, name: 'style_description', nullable: true })
        styleDesc: string;

        // THE Production order id of the OES. Refernce key
        @Column({ type: 'bigint', name: 'po_id', default: 0 })
        poId: string;

        @Column('bigint', { name: 'po_serial', nullable: false})
        poSerial: number;

        @ManyToOne(type => OrderEntity, o => o.orderLines, { nullable: false })
        @JoinColumn({ name: "order_id", foreignKeyConstraintName: "ORD" })
        orderId: OrderEntity;

        @OneToMany(type => OrderSubLineEntity, osl => osl.orderLineId, { cascade: true })
        orderSubLines: OrderSubLineEntity[];

        @OneToMany(type => OrderLineOpEntity, olop => olop.orderLineId, { cascade: true })
        orderLineOp: OrderLineOpEntity[];

        @OneToMany(type => OrderLineRmEntity, olrm => olrm.orderLineId, { cascade: true })
        orderLineRm: OrderLineRmEntity[];

        @OneToMany(type => OrderLineOpRmEntity, olOpRm => olOpRm.orderLineId, { cascade: true })
        orderLineOpRm: OrderLineOpRmEntity[];
       
        @Column('varchar', {
                name: 'planned_cut_date',
                length: 25,
        })
        plannedCutDate: string;

        @Column('varchar', {
                name: 'planned_production_date',
                length: 25,
        })
        plannedProductionDate: string;

        @Column('varchar', {
                name: 'planned_delivery_date',
                length: 25,
        })
        plannedDeliveryDate: string;
}

