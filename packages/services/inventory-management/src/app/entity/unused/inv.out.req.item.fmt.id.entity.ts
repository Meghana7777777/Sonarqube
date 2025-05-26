import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";

@Entity('inv_out_req_item_fg')
export class InventoryOutgoingRequestItemFGEntity extends AbstractEntity {

    @PrimaryGeneratedColumn({ comment: 'Unique identifier for each finished goods item mapped to an inventory outgoing request' })
    id: number;

    @Column({ name: 'fg_number', type: 'varchar', length: 50, nullable: false, comment: 'Finished goods number' })
    fgNumber: string;

    @Column({ name: 'processing_serial', type: 'int', nullable: false, comment: 'Processing serial number for tracking' })
    processingSerial: number;

    @Column({ name: 'bundle_barcode', type: 'varchar', length: 100, nullable: false, comment: 'Barcode of the bundle assigned to this finished good' })
    bundleBarcode: string;

    @Column({ name: 'inv_out_req_item_fmt_id', type: 'int', nullable: false, comment: 'Reference to the fulfilled request item format ID' })
    invOutReqItemFmtId: number;
}
