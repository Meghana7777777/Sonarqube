import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";

// NOT USED
@Entity('inv_in_request_fg')
export class InventoryIncomingRequestFinishedGoodsEntity extends AbstractEntity {

    @PrimaryGeneratedColumn({ comment: 'Unique identifier for each FG record in inventory request' })
    id: number;

    @Column({ name: 'size', type: 'varchar', length: 20, nullable: false, comment: 'Size of the finished goods' })
    size: string;

    @Column({ name: 'psl_id' })
    psl: number;

    @Column({ name: 'fg_number', type: 'varchar', length: 50, nullable: false, comment: 'Finished goods number' })
    fgNumber: string;

    @Column({ name: 'consumed', type: 'int', nullable: false, comment: 'Consumption status: 0 = Not consumed, 1 = Partially consumed, 2 = Fully consumed' })
    consumed: number;
}
