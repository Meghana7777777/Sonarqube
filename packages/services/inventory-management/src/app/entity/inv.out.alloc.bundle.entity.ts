import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Unique } from "typeorm";
import { AbstractEntity } from "../../database/common-entities";
import { InvBarcodeLevelEnum } from "./inv.in.request.bundle.entity";

@Entity('inv_out_alloc_bundle')
export class InvOutAllocBundleEntity extends AbstractEntity {

    @Column({ name: 'item_sku', type: 'varchar', length: 30, nullable: false, comment: 'Item SKU as per the STYLE operation routing' })
    itemSku: string;
    
    @Column({ name: 'bundle_barcode', type: 'varchar', length: 100, nullable: false, comment: 'Unique barcode for this specific FG + processing type' })
    bundleBarcode: string;

    @Column({ name: 'org_qty', type: 'int', nullable: false, comment: 'Total original quantity of this barcode' })
    orgQty: number;

    @Column({ name: 'req_qty', type: 'int', nullable: false, comment: 'Total requesting quantity from this barcode' })
    reqQty: number;

    @Column({ name: 'in_qty', type: 'int', nullable: false, comment: 'Total quantity that came into inventory for this barcode. This will come from inv request item table and will populate the same value here or based on the MIN(of all pre process types for the bundle)' })
    issQty: number;

    @Column({ name: 'psl_id', type: 'bigint', nullable: false, comment: 'product sub line id' })
    pslId: number;

    @Column({ name: 'issued', type: 'boolean', default: false, comment: 'Status of whether this specific bundle is issued or not' })
    issued: boolean;

    @Column({ name: 'inv_out_alloc_id', type: 'bigint', nullable: false })
    invOutAllocId: number;

    @Column({ name: 'inv_out_req_id', type: 'bigint', nullable: false })
    invOutRequestId: number;
}
