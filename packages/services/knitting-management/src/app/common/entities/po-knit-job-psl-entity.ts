import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { AbstractEntity } from '../../../database/common-entities';
import { KJ_MaterialStatusEnum, ProcessTypeEnum, SewingJobPlanStatusEnum, TrimStatusEnum } from '@xpparel/shared-models';

@Entity('po_knit_job_psl')
export class PoKnitJobPslEntity extends AbstractEntity {

    @Column('bigint', { name: 'processing_serial', nullable: false })
    processingSerial: number;

    @Column('varchar', { name: 'process_type', length: 25, nullable: false })
    processType: ProcessTypeEnum;

    @Column('varchar', { name: 'job_number', length: 50, nullable: false })
    jobNumber: string;

    @Column('varchar', { name: 'group_code', length: 15, nullable: false })
    groupCode: string;

    @Column('smallint', { name: 'quantity', nullable: false })
    quantity: number;

    @Column('smallint', { name: 'rep_quantity', nullable: false, default: 0 })
    repQuantity: number;

    @Column('smallint', { name: 'rej_quantity', nullable: false, default: 0 })
    rejQuantity: number;

    @Column('smallint', { name: 'bundled_quantity', nullable: false })
    bundledQuantity: number;

    @Column('bigint', { name: 'mo_product_sub_line_id', nullable: false })
    moProductSubLineId: number;
}
