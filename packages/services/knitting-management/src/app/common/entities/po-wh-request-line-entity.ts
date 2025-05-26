import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { AbstractEntity } from '../../../database/common-entities';
import { ProcessTypeEnum } from '@xpparel/shared-models';

@Entity('po_wh_request_line')
export class PoWhRequestLineEntity extends AbstractEntity {

    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column('bigint', { name: 'processing_serial', nullable: false })
    processingSerial: number;

    @Column('varchar', { name: 'process_type', length: 25, nullable: false })
    processType: ProcessTypeEnum;

    @Column('varchar', { name: 'job_number', length: 50, nullable: false })
    jobNumber: string;

    @Column('varchar', { name: 'group_code', length: 15, nullable: false })
    groupCode: string;

    @Column('varchar', { name: 'item_code', length: 50, nullable: false })
    itemCode: string;

    @Column('varchar', { name: 'item_type', length: 50, nullable: false })
    itemType: string;

    @Column('varchar', { name: 'item_name', length: 50, nullable: false })
    itemName: string;

    @Column('varchar', { name: 'item_color', length: 50, nullable: false })
    itemColor: string;

    @Column('varchar', { name: 'item_description', length: 150, nullable: false })
    itemDescription: string;

    @Column('int', { name: 'required_qty', nullable: true })
    requiredQty: number;

    @Column('int', { name: 'allocated_qty', nullable: true })
    allocatedQty: number;

    @Column('int', { name: 'issued_qty', nullable: true })
    issuedQty: number;

    @Column('float', { name: 'reported_weight', nullable: true })
    reportedWeight: number;

    @Column('bigint', { name: 'po_wh_req_id', nullable: false })
    poWhRequestId: number;

}
