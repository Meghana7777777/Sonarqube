import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { ProcessTypeEnum, OpFormEnum, RollSelectionTypeEnum } from '@xpparel/shared-models';
import { OrderLineEntity } from "./order-line.entity";

@Entity('order_line_op')
export class OrderLineOpEntity extends AbstractEntity {

    @Column({ type: 'varchar', length: 5, name: 'op_code', nullable: false })
    opCode: string;

    @Column({ type: 'varchar', length: 5, name: 'i_op_code', nullable: true })
    iOpCode: string;

    @Column({ type: 'varchar', length: 5, name: 'e_op_code', nullable: true })
    eOpCode: string;

    @Column({ type: 'varchar', length: 10, name: 'op_form', nullable: true })
    opForm: OpFormEnum;

    @Column({ type: 'varchar', length: 10, name: 'op_category', nullable: true })
    opCategory: ProcessTypeEnum;

    @Column({ type: 'varchar', length: 20, name: 'op_name', nullable: true })
    opName: string;

    @Column({ type: 'decimal', name: 'op_smv', nullable: true })
    opSmv: number;

    @Column({ type: 'varchar', length: 20, name: 'op_wk_station', nullable: true })
    opWkStation: string;

    // Reference key
    @Column({ type: 'bigint', name: 'order_id' })
    orderId: string;
    
    @ManyToOne(type => OrderLineEntity, o => o.orderLineOp, { nullable: false })
    @JoinColumn({ name: "order_line_id", foreignKeyConstraintName: "OL_TO_OP" })
    orderLineId: OrderLineEntity;
}
