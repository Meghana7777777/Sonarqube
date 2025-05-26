import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { AbstractEntity } from '../../../database/common-entities';
import { KJ_MaterialStatusEnum, ProcessTypeEnum, SewingJobPlanStatusEnum, TrimStatusEnum } from '@xpparel/shared-models';

@Entity('po_knit_job_plan')
export class PoKnitJobPlanEntity extends AbstractEntity {

    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column('bigint', { name: 'processing_serial', nullable: false })
    processingSerial: number;

    @Column('varchar', { name: 'process_type', length: 25, nullable: false })
    processType: ProcessTypeEnum;

    @Column('varchar', { name: 'job_number', length: 50, nullable: false })
    jobNumber: string;

    @Column('varchar', { name: 'status', nullable: false })
    status: SewingJobPlanStatusEnum;

    @Column('varchar', { name: 'raw_material_status', nullable: false, default: KJ_MaterialStatusEnum.OPEN })
    rawMaterialStatus: KJ_MaterialStatusEnum;

    @Column('datetime', { name: 'plan_input_date', nullable: true })
    planInputDate: Date;

    @Column('tinyint', { name: 'job_priority', nullable: false })
    jobPriority: number;

    @Column('varchar', { name: 'location_code', length: 50, nullable: true })
    locationCode: string;

    @Column('varchar', { name: 'bom_sku_status', nullable: false, default: KJ_MaterialStatusEnum.OPEN })
    bomSkuStatus: KJ_MaterialStatusEnum;
}
