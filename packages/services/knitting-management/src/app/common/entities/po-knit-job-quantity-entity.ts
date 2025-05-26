import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { AbstractEntity } from '../../../database/common-entities';
import { ProcessTypeEnum } from '@xpparel/shared-models';

@Entity('po_knit_job_qty')
export class PoKnitJobQtyEntity extends AbstractEntity {

    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column('bigint', { name: 'processing_serial', nullable: false })
    processingSerial: number;

    @Column('varchar', { name: 'process_type', length: 25, nullable: false })
    processType: ProcessTypeEnum;

    @Column('varchar', { name: 'job_number', length: 50, nullable: false })
    jobNumber: string;

    @Column('int', { name: 'original_qty', nullable: false })
    originalQty: number;

    @Column('int', { name: 'input_qty', nullable: false })
    inputQty: number;

    @Column('int', { name: 'good_qty', nullable: false })
    goodQty: number;

    @Column('int', { name: 'rejected_qty', nullable: false })
    rejectedQty: number;

    @Column('decimal', { name: 'reported_weight', precision: 10, scale: 2, nullable: false })
    reportedWeight: number;

    @Column('decimal', { name: 'original_weight', precision: 10, scale: 2, nullable: false })
    originalWeight: number;
}
