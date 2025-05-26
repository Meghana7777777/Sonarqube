import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";


@Entity('__log_revised_order_line')
export class LogRevisedOrderLineEntity extends AbstractEntity {

    @Column({ type: 'varchar', name: 'order_line_no', nullable: false })
    orderLineNo: string;

    @Column({ type: 'int', name: 'quantity', nullable: false })
    quantity: number

    @Column({ type: 'int', name: 'revised_qty', nullable: false })
    revisedQty: number

    @Column({ type: 'int', name: 'order_line_id', nullable: false })
    orderLineId: number;

    @Column({ name: "order_id", type: 'int', nullable: false })
    orderId: number;
}