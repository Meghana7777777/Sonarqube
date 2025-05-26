import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { AbstractEntity } from '../../../database/common-entities';
import { ProcessTypeEnum } from '@xpparel/shared-models';

@Entity('po_job_psl_map')
export class PoJobPslMapEntity extends AbstractEntity {

    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column('bigint', { name: 'processing_serial', nullable: false })
    processingSerial: number;

    @Column('varchar', { name: 'process_type', length: 25, nullable: false })
    processType: ProcessTypeEnum;

    @Column('varchar', { name: 'group_code', nullable: false })
    groupCode: string;

    @Column('bigint', { name: 'po_knit_job_ratio_id', nullable: false })
    poKnitJobRatioId: number;

    @Column('bigint', { name: 'po_job_sub_line_id', nullable: false })
    poJobSubLineId: number;

    @Column('varchar', { name: 'job_number', length: 50, nullable: false })
    jobNumber: string;

    @Column('bigint', { name: 'mo_product_sub_line_id', nullable: false })
    moProductSubLineId: number;

    @Column('int', { name: 'quantity', nullable: false })
    quantity: number;
    
    @Column('varchar', { name: 'product_ref', length: 15, nullable: false })
    productRef: string;

    @Column('varchar', { name: 'bundle_number', length: 25, nullable: false })
    bundleNumber: string;

    @Column('varchar', { name: 'fg_color', length: 20, nullable: false })
    fgColor: string; //NOTE :  fg color column added temporarily to support job generation

    @Column('varchar', { name: 'size', length: 20, nullable: false })
    size: string; //NOTE : size column added temporarily to support job generation
}
