import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { ProcessTypeEnum } from "@xpparel/shared-models";

@Entity('po_knit_job_ratio_sub_line')
export class PoKnitJobRatioSubLineEntity extends AbstractEntity {
    @PrimaryGeneratedColumn({ name: 'id' }) // Auto-incrementing primary key
    id: number;

    @Column('bigint', { name: 'processing_serial', nullable: false })
    processingSerial: number;

    @Column('varchar', { name: 'process_type', length: 25, nullable: false })
    processType: ProcessTypeEnum;

    @Column('varchar', { name: 'fg_color', length: 20, nullable: false })
    fgColor: string;

    @Column('varchar', { name: 'size', length: 20, nullable: false })
    size: string;

    @Column('int', { name: 'quantity' })
    quantity: number;

    @Column('int', { name: 'max_job_qty' })
    maxJobQty: number;

    @Column('bigint', { name: 'po_knit_job_ratio_line_id', nullable: false })
    poKnitJobRatioLineId: number;
    
    @Column('smallint', { name: 'logical_bundle_qty', nullable: false })
    logicalBundleQty: number;
}
