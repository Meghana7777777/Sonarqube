import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { RollSelectionTypeEnum } from '@xpparel/shared-models';
import { OrderLineEntity } from "./order-line.entity";
import { OrderSubLineRmEntity } from "./order-sub-line-rm.entity";

@Entity('order_sub_line')
export class OrderSubLineEntity extends AbstractEntity {

    @Column({ type: 'varchar', length: 50, name: 'color_Desc', nullable: true })
    colorDesc: string;

    @Column({ type: 'varchar', length: 10, name: 'size_code', nullable: false })
    sizeCode: string;

    @Column({ type: 'varchar', length: 15, name: 'size_desc', nullable: true })
    sizeDesc: string;

    @Column({ type: 'int', name: 'quantity', nullable: false })
    quantity: number;

    // currently not used
    // any ext ref if exists
    @Column({ type: 'varchar', length: 20, name: 'e_ref_no', nullable: true })
    eRefNo: string;
    // currently not used
    // any int ref if exists
    @Column({ type: 'varchar', length: 20, name: 'i_ref_no', nullable: true })
    iRefNo: string;

    @Column({ type: 'date', name: 'delivery_date', nullable: true })
    deliveryDate: Date;

    @Column({ type: 'date', name: 'start_date', nullable: true })
    startDate: Date;

    @Column({ type: 'boolean', name: 'is_planned', default: false })
    isPlanned: boolean;

    // Reference key
    @Column({ type: 'bigint', name: 'order_id' })
    orderId: number;

    // FK
    @ManyToOne(type => OrderLineEntity, ol => ol.orderSubLines, { nullable: false })
    @JoinColumn({ name: "order_line_id", foreignKeyConstraintName: "OL_TO_SUB_LINE" })
    orderLineId: OrderLineEntity;

    @OneToMany(type => OrderSubLineRmEntity, oslRm => oslRm.orderSublineId, { cascade: true })
    orderSubLineRm: OrderSubLineRmEntity[];

}
