import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { RollSelectionTypeEnum } from '@xpparel/shared-models';
import { OrderLineEntity } from "./order-line.entity";

@Entity('order_line_op_rm')
export class OrderLineOpRmEntity extends AbstractEntity {
  
    @Column({ type: 'varchar', length: 30, name: 'item_code', nullable: false })
    itemCode: string;

    @Column({ type: 'varchar', length: 10, name: 'op_code', nullable: false })
    opCode: string;

    // FK
    @ManyToOne(type => OrderLineEntity, ol => ol.orderLineOpRm, { nullable: false })
    @JoinColumn({ name: "order_line_id", foreignKeyConstraintName: "OL_TO_OP_RM" })
    orderLineId: OrderLineEntity;
}
