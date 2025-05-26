import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { AbstractEntity } from '../../../database/common-entities';

@Entity('pack_wh_job_material_issuance')
export class PackWhJobMaterialIssuanceEntity extends AbstractEntity {

    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column('bigint', { name: 'issuance_id', nullable: false })
    issuanceId: number;

    @Column('varchar', { name: 'item_code', length: 50, nullable: false })
    itemCode: string;

    @Column('varchar', { name: 'object_code', length: 50, nullable: false })
    objectCode: string;

    @Column('decimal', { name: 'allocated_qty', precision: 10, scale: 2, nullable: false })
    allocatedQty: number;

    @Column('decimal', { name: 'issued_qty', precision: 10, scale: 2, nullable: false })
    issuedQty: number;

    @Column('decimal', { name: 'reported_weight', precision: 10, scale: 2, nullable: false })
    reportedWeight: number;

    @Column('varchar', { name: 'job_number', length: 50, nullable: false })
    jobNumber: string;

}
