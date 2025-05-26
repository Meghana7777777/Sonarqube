import { Entity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { AbstractEntity } from '../../../database/common-entities';

@Unique(['moRefId', 'phRefId','poNumber'])
@Entity('mo_to_po_map')
export class MoToPoMapEntity extends AbstractEntity {

    @Column({ type: 'bigint', name: 'mo_ref_id', nullable: false })
    moRefId: number;

    @Column({ name: 'mo_no', type: 'varchar', length: 20, nullable: false, comment: '' })
    moNo: string;

    @Column({ type: 'bigint', name: 'ph_ref_id', nullable: false })
    phRefId: number;

    @Column({ type: 'varchar', length: 20, name: 'po_number' })
    poNumber: string;

    @Column('varchar', {
        name: 'pack_list_code',
        length: 100,
    })
    packListCode: string

}