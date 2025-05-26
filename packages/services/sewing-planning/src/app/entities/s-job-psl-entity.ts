import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { KJ_MaterialStatusEnum, ProcessTypeEnum, SewingJobPlanStatusEnum, TrimStatusEnum } from '@xpparel/shared-models';
import { AbstractEntity } from '../../database/common-entities';

@Entity('s_job_psl')
export class SJobPslEntity extends AbstractEntity {

    @Column('bigint', { name: 'processing_serial', nullable: false })
    processingSerial: number;

    @Column('varchar', { name: 'process_type', length: 10, nullable: false })
    processType: ProcessTypeEnum;

    @Column('varchar', { name: 'job_number', length: 25, nullable: false })
    jobNumber: string;

    @Column('varchar', { name: 'sub_process_name', length: 25, nullable: false, })
    subProcessName: string

    @Column('smallint', { name: 'quantity', nullable: false })
    quantity: number;

    @Column('smallint', { name: 'cancelled_quantity', default: 0, nullable: false, comment: 'Will be added when the actual bundles are confirmed and sewing job qty goes down if any' })
    cancelledQuantity: number;

    @Column('smallint', { name: 're_job_gen_quantity', default: 0, nullable: false, comment: 'Will be incremented after the sewing job are regenerated for the cancelled_quantity if any' })
    reJobGenQty: number;

    @Column('bigint', { name: 'mo_product_sub_line_id', nullable: false })
    moProductSubLineId: number;
}
