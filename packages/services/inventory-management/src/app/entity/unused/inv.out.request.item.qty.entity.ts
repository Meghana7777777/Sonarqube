import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";

@Entity('inv_out_req_item_qty')
export class InventoryOutgoingRequestItemQuantityEntity extends AbstractEntity {

    @PrimaryGeneratedColumn({ comment: 'Unique identifier for each inventory outgoing request item quantity' })
    id: number;

    @Column({ name: 'fg_color', type: 'varchar', length: 50, nullable: false, comment: 'Finished goods color' })
    fgColor: string;

    @Column({ name: 'size', type: 'varchar', length: 20, nullable: false, comment: 'Size of the finished goods' })
    size: string;

    @Column({ name: 'asking_qty', type: 'int', nullable: false, comment: 'Quantity requested' })
    askingQty: number;

    @Column({ name: 'fulfilled_qty', type: 'int', nullable: false, default: 0, comment: 'Quantity fulfilled' })
    fulfilledQty: number;
}
