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

    @Column('varchar', { length: 15, name: 'fg_sku', comment: 'unique SKU under a MO MO_PROCTYPE_PCODE_COL_SIZE' })
    fgSku: string;

    @Column('smallint', { name: 'bundled_quantity', default: 0, comment: 'Will be updated after the bundling operation' })
    bundledQty: number;

    @Column('tinyint', { name: 'total_abs', default: 0, comment: 'total actual bundles under the product bundle' })
    totalAbs: number;
}

export enum CutOrderProductBundleStateEnum {
    OPEN = 0,
    FORMED = 1,
    MOVED_TO_INV = 1,
}
