
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";

@Entity('order_sizes')
export class OrderSizesEntity extends AbstractEntity {

    @Column({ type: 'varchar', length: 15, name: 'size', nullable: false })
    size: string;

    // Reference
    @Column({ type: 'bigint', name: 'order_id', nullable: false, comment: "PK of the order table" })
    orderId: number;

}
