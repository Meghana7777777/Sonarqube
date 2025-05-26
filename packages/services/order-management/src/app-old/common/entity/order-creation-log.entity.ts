
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { MoStatusEnum } from "@xpparel/shared-models";

@Entity('order_creation_log')
export class OrderCreationLogEntity extends AbstractEntity {

    @Column({ type: 'varchar', length: 30, name: 'order_no', nullable: false })
    saleOrderNo: string;

    @Column({ type: 'tinyint', name: 'status', nullable: false, comment: 'The status of the SO. 0-OPEN, 1-PROGRESS, 2-DOWNLOADED, 3-COMPLETED, 4-FAILED' })
    status: MoStatusEnum;

    @Column({ type: 'text', name: 'message', nullable: false, comment: 'The error message of the order creation for the SO' })
    message: string;

}
