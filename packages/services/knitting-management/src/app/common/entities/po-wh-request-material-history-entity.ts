import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { AbstractEntity } from '../../../database/common-entities';

@Entity('po_wh_request_material_history')
export class PoWhRequestMaterialHistoryEntity extends AbstractEntity {

    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column('bigint', { name: 'po_wh_req_id', nullable: false })
    poWhReqId: number;

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

    @Column('decimal', { name: 'required_qty', precision: 10, scale: 2, nullable: false })
    requiredQty: number;

    @Column('decimal', { name: 'allocated_qty', precision: 10, scale: 2, nullable: false })
    allocatedQty: number;

    @Column('decimal', { name: 'issued_qty', precision: 10, scale: 2, nullable: false })
    issuedQty: number;

    @Column('decimal', { name: 'reported_weight', precision: 10, scale: 2, nullable: false })
    reportedWeight: number;
}


 