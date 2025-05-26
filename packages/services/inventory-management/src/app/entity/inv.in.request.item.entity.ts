import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { AbstractEntity } from "../../database/common-entities";

@Entity('inv_in_request_item')
export class InvInRequestItemEntity extends AbstractEntity {

    @Column({ name: 'item_sku', type: 'varchar', length: 30, nullable: false, comment: 'Item SKU as per the STYLE operation routing' })
    itemSku: string;

    @Column({ name: 'processing_serial', type: 'int', nullable: false, comment: 'Processing serial number associated with the item' })
    processingSerial: number;

    @Column({ name: 'process_type', type: 'varchar', length: 5, nullable: false, comment: 'Type of process for this item' })
    processType: string;
    
    @Column({ name: 'inv_in_req_id', type: 'bigint' })
    invInRequestId: number;
}
