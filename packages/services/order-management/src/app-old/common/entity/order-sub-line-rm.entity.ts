import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { OrderSubLineEntity } from "./order-sub-line.entity";

@Entity('order_sub_line_rm')
export class OrderSubLineRmEntity extends AbstractEntity {
    
    @Column({ type: 'varchar', length: 30, name: 'item_code', nullable: false })
    itemCode: string;

    @Column({ type: 'int', name: 'consumption', nullable: true })
    itemConsumption: number;

    @Column({ type: 'int', name: 'wastage', nullable: true })
    itemWastage: number;

    @ManyToOne(type => OrderSubLineEntity, osl => osl.orderSubLineRm, { nullable: false })
    @JoinColumn({ name: "order_sub_line_id", foreignKeyConstraintName: "OSL" })
    orderSublineId: OrderSubLineEntity;
}
