import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Unique } from "typeorm";
import { AbstractEntity } from "../../database/common-entities";
import { InvBarcodeLevelEnum } from "./inv.in.request.bundle.entity";

@Entity('inv_out_request_bundle')
export class InvOutRequestBundleEntity extends AbstractEntity {

    @Column({ name: 'item_sku', type: 'varchar', length: 30, nullable: false, comment: 'Item SKU as per the STYLE operation routing' })
    itemSku: string;
    
    @Column({ name: 'bundle_barcode', type: 'varchar', length: 30, nullable: false, comment: 'Unique barcode for this specific FG + processing type' })
    bundleBarcode: string;

    @Column({ name: 'org_qty', type: 'smallint', nullable: false, comment: 'Total original quantity of this barcode' })
    orgQty: number;

    @Column({ name: 'in_qty', type: 'smallint', nullable: false, comment: 'Total quantity that came into inventory for this barcode' })
    reqQty: number;

    @Column({ name: 'psl_id', type: 'bigint', nullable: false, comment: 'product sub line id' })
    pslId: number;

    @Column({ name: 'barcode_level', type: 'varchar', length: 1, nullable: false, comment: 'Level of barcode: FG/BUNDLE. refer InvBarcodeLevelEnum' })
    barcodeLevel: InvBarcodeLevelEnum;

    @Column({ name: 'inv_out_req_id', type: 'bigint', nullable: false })
    invOutRequestId: number;

    @Column({ name: 'inv_out_req_item_id', type: 'bigint', nullable: false })
    invOutRequestItemId: number;

    @Column({ name: 'processing_serial', type: 'int', nullable: false, comment: 'Processing serial number associated with the item' })
    processingSerial: number;

    @Column({ name: 'process_type', type: 'varchar', length: 5, nullable: false, comment: 'Type of process for this item' })
    processType: string;
}
