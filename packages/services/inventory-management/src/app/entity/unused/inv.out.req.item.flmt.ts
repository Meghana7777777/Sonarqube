import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";

@Entity('inv_out_req_item_flmt')
export class InventoryOutgoingRequestItemFulfillmentEntity extends AbstractEntity {

    @PrimaryGeneratedColumn({ comment: 'Unique identifier for each inventory outgoing request item fulfillment record' })
    id: number;

    @Column({ name: 'fg_color', type: 'varchar', length: 50, nullable: false, comment: 'Finished goods color' })
    fgColor: string;

    @Column({ name: 'size', type: 'varchar', length: 20, nullable: false, comment: 'Size of the finished goods' })
    size: string;

    @Column({ name: 'bundle_barcode', type: 'varchar', length: 100, nullable: false, comment: 'Barcode of the bundle assigned to this request' })
    bundleBarcode: string;

    @Column({ name: 'quantity', type: 'int', nullable: false, comment: 'Quantity fulfilled from the bundle' })
    quantity: number;

    @Column({ name: 'inv_out_req_item_id', type: 'int', nullable: false, comment: 'Reference to the inventory outgoing request item' })
    invOutReqItemId: number;

    @Column({ name: 'processing_serial', type: 'int', nullable: false, comment: 'Processing serial number for the operation' })
    processingSerial: number;

    @Column({ name: 'process_type', type: 'varchar', length: 50, nullable: false, comment: 'Type of process (KNIT, LINK, FIN, WASH, etc.)' })
    processType: string;

    @Column({ name: 'inv_out_req_activity_id', type: 'int', nullable: false, comment: 'Reference to the related inventory outgoing request activity' })
    invOutReqActivityId: number;
}
