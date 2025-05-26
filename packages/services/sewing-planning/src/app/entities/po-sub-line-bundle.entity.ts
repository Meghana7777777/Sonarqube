import { Column, Entity } from "typeorm";
import { ProcessTypeEnum } from "@xpparel/shared-models";
import { AbstractEntity } from "../../database/common-entities";

@Entity('po_sub_line_bundle')
export class PoSubLineBundleEntity extends AbstractEntity {

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

    @Column('varchar', { length: 15, name: 'fg_sku', comment: 'unique SKU under a MO MO_PROCTYPE_PCODE_COL_SIZE' })
    fgSku: string;

    @Column('boolean', {
        nullable: false,
        default: false,
        name: 'is_job_generated',
        comment: "It turns into false after this bundle attached to the processing job"
    })
    isJobGenerated: boolean;
}
