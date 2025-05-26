import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { AbstractEntity } from '../../../database/common-entities';
import { ProcessTypeEnum, TrimStatusEnum, WhRequestStatusEnum } from '@xpparel/shared-models';

@Entity('po_wh_request')
export class PoWhRequestEntity extends AbstractEntity {

    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column('bigint', { name: 'processing_serial', nullable: false })
    processingSerial: number;

    @Column('varchar', { name: 'process_type', length: 25, nullable: false })
    processType: ProcessTypeEnum;

    @Column('varchar', { name: 'request_code', length: 50, nullable: false })
    requestCode: string;

    @Column('varchar', { name: 'requested_by', length: 50, nullable: false })
    requestedBy: string;

    @Column('datetime', { name: 'plan_close_date', nullable: false })
    planCloseDate: Date;

    @Column('tinyint', { name: 'sla', nullable: false })
    sla: number;
    
    @Column({ type: 'enum', enum: WhRequestStatusEnum, name: 'status', default: WhRequestStatusEnum.OPEN, })
    status: WhRequestStatusEnum;
}
