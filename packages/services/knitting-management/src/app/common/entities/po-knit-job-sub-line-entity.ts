import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { ProcessTypeEnum } from "@xpparel/shared-models";

// -------  Indexes -----------
// knit job number
// proc serial + col
// bundle number
// po_knit_job_line_id
@Entity('po_knit_job_sub_line')
export class PoKnitJobSubLineEntity extends AbstractEntity  {
    @PrimaryGeneratedColumn({ name: 'id' }) // Auto-incrementing primary key
    id: number;

    @Column('bigint', { name: 'processing_serial', nullable: false })
    processingSerial: number;

    @Column('varchar', { name: 'fg_color', length: 20, nullable: false })
    fgColor: string;

    @Column('varchar', { name: 'size', length: 20, nullable: false })
    size: string;

    @Column('int', { name: 'quantity' })
    quantity: number;

    @Column('varchar', { name: 'bundle_number', length: 25, nullable: false })
    bundleNumber: string;

    @Column('smallint', { name: 'bundle_sequence', nullable: false })
    bundleSequence: number;

    @Column('varchar', { name: 'product_ref', length: 15, nullable: false })
    productRef: string;

    @Column('bigint', { name: 'po_knit_job_line_id', nullable: false })
    poKnitJobLineId: number;

    @Column('varchar', { name: 'process_type', length: 25, nullable: false })
    processType: ProcessTypeEnum;

    // have to be indexed alone
    @Column('varchar', { name: 'knit_job_number', length: 25, nullable: false })
    knitJobNumber: string;
}
