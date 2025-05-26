import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { AbstractEntity } from '../../../database/common-entities';
import { ProcessTypeEnum } from '@xpparel/shared-models';

@Entity('po_wh_knit_job_material_issuance')
export class PoWhKnitJobMaterialIssuanceEntity extends AbstractEntity {

    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column('bigint', { name: 'processing_serial', nullable: false })
    processingSerial: number;

    @Column('bigint', { name: 'issuance_id', nullable: false })
    issuanceId: number;

    @Column('varchar', { name: 'process_type', length: 25, nullable: false })
    processType: ProcessTypeEnum;

    @Column('varchar', { name: 'item_code', length: 50, nullable: false })
    itemCode: string;

    @Column('varchar', { name: 'object_code', length: 50, nullable: false })
    objectCode: string;

    @Column('varchar', { name: 'item_type', length: 50, nullable: false })
    itemType: string;

    @Column('varchar', { name: 'item_name', length: 50, nullable: false })
    itemName: string;

    @Column('varchar', { name: 'item_color', length: 50, nullable: false })
    itemColor: string;

    @Column('varchar', { name: 'item_description', length: 150, nullable: false })
    itemDescription: string;

    @Column('decimal', { name: 'allocated_qty', precision: 10, scale: 2, nullable: false })
    allocatedQty: number;

    @Column('decimal', { name: 'issued_qty', precision: 10, scale: 2, nullable: false })
    issuedQty: number;

    @Column('decimal', { name: 'reported_weight', precision: 10, scale: 2, nullable: false })
    reportedWeight: number;

    @Column('varchar', { name: 'job_number', length: 50, nullable: false })
    jobNumber: string;

    @Column('varchar', { name: 'group_code', length: 15, nullable: false })
    groupCode: string;

}
