import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { AbstractEntity } from '../../../database/common-entities';

@Entity('po_wh_request_material_item_history')
export class PoWhRequestMaterialItemHistoryEntity extends AbstractEntity {

    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column('bigint', { name: 'po_wh_request_line_id', nullable: false })
    poWhRequestLineId: number;


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

    @Column('varchar', { name: 'object_code', length: 50, nullable: false })
    objectCode: string;

    @Column('varchar', { name: 'location_code', length: 50, nullable: true })
    locationCode: string;

    @Column('varchar', { name: 'supplier_code', length: 50, nullable: false })
    supplierCode: string;

    @Column('varchar', { name: 'vpo', length: 50, nullable: true })
    vpo: string;

    @Column('enum', { name: 'object_type', nullable: false })
    objectType: string;

    @Column('decimal', { name: 'required_qty', precision: 10, scale: 2, nullable: false })
    requiredQty: number;

    @Column('decimal', { name: 'allocated_qty', precision: 10, scale: 2, nullable: false })
    allocatedQty: number;

    @Column('decimal', { name: 'issued_qty', precision: 10, scale: 2, nullable: false })
    issuedQty: number;

    @Column('decimal', { name: 'reported_weight', precision: 10, scale: 2, nullable: false })
    reportedWeight: number;
}

