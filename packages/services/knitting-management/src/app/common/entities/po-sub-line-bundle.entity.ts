import { Column, Entity } from "typeorm";
import { ProcessTypeEnum } from "@xpparel/shared-models";
import { AbstractEntity } from "../../../database/common-entities";

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

    @Column('smallint', { name: 'quantity' })
    quantity: number;

    @Column('smallint', { name: 'finalized_quantity', default: 0 })
    finalizedQuantity: number;

    @Column('varchar', { length: 15, name: 'fg_sku', comment: 'unique SKU under a MO MO_PROCTYPE_PCODE_COL_SIZE' })
    fgSku: string;

    @Column('tinyint', { name: 'bundle_state', comment: 'Refer KnitOrderProductBundleStateEnum. 0 - initially, 1 - when the bundle is confirmed, 2 - when the bundle is moved to inventory' })
    bundleState: KnitOrderProductBundleStateEnum;

    @Column('bigint', { name: 'confirmation_id', default: 0 })
    confirmationId: number;
}

export enum KnitOrderProductBundleStateEnum {
    OPEN = 0,
    FORMED = 1,
    MOVED_TO_INV = 1,
}
