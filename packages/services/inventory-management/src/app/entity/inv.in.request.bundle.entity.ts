import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Unique } from "typeorm";
import { AbstractEntity } from "../../database/common-entities";

@Entity('inv_in_request_bundle')
export class InvInRequestBundleEntity extends AbstractEntity {

    @Column({ name: 'item_sku', type: 'varchar', length: 30, nullable: false, comment: 'Item SKU as per the STYLE operation routing' })
    itemSku: string;
    
    @Column({ name: 'bundle_barcode', type: 'varchar', length: 30, nullable: false, comment: 'Unique barcode for this specific FG + processing type' })
    bundleBarcode: string;

    @Column({ name: 'org_qty', type: 'int', nullable: false, comment: 'Total original quantity of this barcode' })
    orgQty: number;

    @Column({ name: 'in_qty', type: 'int', nullable: false, comment: 'Total quantity that came into inventory for this barcode' })
    inQty: number;

    @Column({ name: 'psl_id', type: 'bigint', nullable: false, comment: 'product sub line id' })
    pslId: number;

    @Column({ name: 'barcode_level', type: 'varchar', length: 1, nullable: false, comment: 'Level of barcode: FG/BUNDLE. refer InvBarcodeLevelEnum' })
    barcodeLevel: InvBarcodeLevelEnum;

    @Column({ name: 'inv_in_req_id', type: 'bigint', nullable: false })
    invInRequestId: number;

    @Column({ name: 'inv_in_req_item_id', type: 'bigint', nullable: false })
    invInRequestItemId: number;

    @Column({ name: 'job_number', type: 'varchar', length: 20, nullable: false, comment: 'The job number against to which this bundle came into inventory' })
    jobNumber: string;

    @Column({ name: 'processing_serial', type: 'int', nullable: false, comment: 'Processing serial number associated with the item' })
    processingSerial: number;

    @Column({ name: 'process_type', type: 'varchar', length: 5, nullable: false, comment: 'Type of process for this item' })
    processType: string;

    @Column({ name: 'source_type', type: 'varchar', length: 10, nullable: true, comment: 'Source module type. knit/sew/wash/link' })
    sourceType: string;

    @Column({ name: 'source_id', type: 'bigint', nullable: true, comment: 'Location id from which this barcode originated' })
    sourceId: number;

    @Column({ name: 'bundle_state', type: 'tinyint', default: 0, comment: '0 - open, 1 - after allocating for inv-out-request, 2 - after issuance' })
    bundleState: BundleConsumptionStatusEnum;
}

export enum InvBarcodeLevelEnum {
    FG = 'F',
    BUNDLE = 'B'
}

export enum BundleConsumptionStatusEnum {
    OPEN = 0,
    ALLOCATED = 1,
    ISSUED = 2
}