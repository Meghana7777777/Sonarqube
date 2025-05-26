import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { AbstractEntity } from '../../../database/common-entities';
import { KJ_MaterialStatusEnum, ProcessTypeEnum, SewingJobPlanStatusEnum, TrimStatusEnum } from '@xpparel/shared-models';

@Entity('po_knit_job_plan_history')
export class PoKnitJobPlanHistoryEntity extends AbstractEntity {

    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column('varchar', { name: 'job_number', length: 50, nullable: false })
    jobNumber: string;

    @Column('varchar', {  name: 'status',  nullable: false })
    status: SewingJobPlanStatusEnum;

    // @Column('enum', {  name: 'raw_material_status',  nullable: false })
    // rawMaterialStatus: string;

    @Column('varchar', { name: 'location_code', length: 50, nullable: true })
    locationCode: string;

    @Column('bigint', { name: 'processing_serial', nullable: false })
    processingSerial: number;
    
    @Column('varchar', { name: 'process_type', length: 25, nullable: false })
    processType: ProcessTypeEnum;
        
    @Column('varchar', { name: 'raw_material_status', nullable: false, default: TrimStatusEnum.OPEN })
    rawMaterialStatus: KJ_MaterialStatusEnum;
    
    @Column('datetime', { name: 'plan_input_date', nullable: false })
    planInputDate: Date;

    @Column('tinyint', { name: 'job_priority', nullable: false })
    jobPriority: number;

    @Column('varchar', { name: 'bom_sku_status', nullable: false, default: TrimStatusEnum.OPEN })
    bomSkuStatus: KJ_MaterialStatusEnum;
}
