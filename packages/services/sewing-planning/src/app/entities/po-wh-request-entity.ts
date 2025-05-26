import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { MaterialRequestTypeEnum, ProcessTypeEnum, RequestTypeEnum, TrimStatusEnum, WhRequestStatusEnum } from '@xpparel/shared-models';
import { AbstractEntity } from '../../database/common-entities';

@Entity('po_wh_request')
export class PoWhRequestEntity extends AbstractEntity {

    @Column('bigint', { name: 'processing_serial', nullable: false })
    processingSerial: number;

    @Column('varchar', { name: 'process_type', length: 25, nullable: false })
    processType: ProcessTypeEnum;

    @Column('varchar', { name: 'request_code', length: 50, nullable: false })
    requestCode: string;

    @Column('varchar', { name: 'request_type', length: 50, nullable: false })
    requestType: MaterialRequestTypeEnum; // TRIM , PB

    @Column('varchar', { name: 'requested_by', length: 50, nullable: false })
    requestedBy: string;

    @Column('datetime', { name: 'plan_close_date', nullable: false })
    planCloseDate: Date;

    @Column('tinyint', { name: 'sla', nullable: false })
    sla: number;
    
    @Column({ type: 'enum', enum: WhRequestStatusEnum, name: 'status', default: WhRequestStatusEnum.OPEN})
    status: WhRequestStatusEnum;
}
