
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";

@Entity('order_pack_method')
export class OrderPackMethodEntity extends AbstractEntity {

    // Reference key
    @Column({ type: 'bigint',  name: 'order_id', nullable: false })
    orderId: number;

    @Column({ type: 'varchar', length: '60', name: 'product_name', nullable: false, comment: 'User entered product name while giving the pack method' })
    productName: string;

    @Column({ type: 'varchar', length: '40', name: 'product_type', nullable: false })
    productType: string;

    @Column({ type: 'text', name: 'item_codes', nullable: false })
    iCodes: string;

}
