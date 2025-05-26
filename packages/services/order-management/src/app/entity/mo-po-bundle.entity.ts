import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../database/common-entities";
import { ProcessTypeEnum } from "@xpparel/shared-models";

@Entity('mo_po_bundle')
export class MoPoBundleEntity extends AbstractEntity {

    @Column({ type: 'varchar', name: 'mo_number', length: 25, nullable: false })
    moNumber: string;

    @Column({ type: 'varchar', name: 'bundle_number', length: 25, nullable: false })
    bundleNumber: string;
    
    @Column('bigint', { name: 'mo_product_sub_line_id', nullable: false })
    moProductSubLineId: number;

    @Column('varchar', { length: 10, name: 'proc_type', nullable: false })
    procType: ProcessTypeEnum;

    @Column('bigint', { name: 'processing_serial', nullable: false })
    processingSerial: number;

    @Column('int', { name: 'quantity' })
    quantity: number;

    @Column('varchar', { length: 30, name: 'item_sku', nullable: false, comment: 'SKU code for the bundle means physically what is is' })
    itemSku: string;

}
