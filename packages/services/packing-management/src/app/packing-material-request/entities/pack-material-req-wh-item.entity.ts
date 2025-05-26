import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { AbstractEntity } from '../../../database/common-entities';

@Entity('pm_t_pack_material_wh_item')
export class PackMatReqWhItemEntity extends AbstractEntity {

    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column({ name: 'pm_m_items_id', type: 'int'})
    items: number;

    @Column('bigint', { name: 'pack_wh_request_line_id', nullable: false })
    packWhRequestLineId: number;

    @Column('varchar', { name: 'object_code', length: 50, nullable: false })
    objectCode: string;

    @Column('varchar', { name: 'location_code', length: 50, nullable: true })
    locationCode: string;

    @Column('varchar', { name: 'supplier_code', length: 50, nullable: false })
    supplierCode: string;

    @Column('varchar', { name: 'vpo', length: 50, nullable: true })
    vpo: string;

    @Column('varchar', { name: 'object_type', nullable: false })
    objectType: string;

    @Column('decimal', { name: 'required_qty', precision: 10, scale: 2, nullable: false })
    requiredQty: number;

    @Column('decimal', { name: 'allocated_qty', precision: 10, scale: 2, nullable: false })
    allocatedQty: number;

    @Column('decimal', { name: 'issued_qty', precision: 10, scale: 2, nullable: false })
    issuedQty: number;
}
