import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { MaterialRequestTypeEnum, ProcessTypeEnum, RequestTypeEnum, TrimStatusEnum, WhRequestStatusEnum } from '@xpparel/shared-models';
import { AbstractEntity } from '../../database/common-entities';

@Entity('po_wh_issuance')
export class PoWhIssuanceEntity extends AbstractEntity {

    @Column('bigint', { name: 'processing_serial', nullable: false })
    processingSerial: number;

    @Column('varchar', { name: 'process_type', length: 25, nullable: false })
    processType: ProcessTypeEnum;

    @Column('varchar', { name: 'request_code', length: 50, nullable: false })
    requestCode: string;

    @Column('varchar', { name: 'request_type', length: 50, nullable: false })
    requestType: MaterialRequestTypeEnum; // TRIM , PB

    @Column('bigint', { name: 'issuance_id', nullable: false })
    issuanceId: number;

    @Column({ type: 'enum', enum: WhRequestStatusEnum, name: 'status', default: WhRequestStatusEnum.OPEN })
    status: WhRequestStatusEnum;

    @Column('bigint', { name: 'wh_req_id', nullable: false })
    whReqId: number;
}
