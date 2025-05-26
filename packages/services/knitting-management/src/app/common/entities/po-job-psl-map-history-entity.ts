import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { AbstractEntity } from '../../../database/common-entities';

@Entity('po_job_psl_map_history')
export class PoJobPslMapHistoryEntity extends AbstractEntity {

    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column('varchar', { name: 'job_number', length: 50, nullable: false })
    jobNumber: string;

    @Column('bit', { name: 'psl_id', nullable: false })
    pslId: boolean;

    @Column('int', { name: 'quantity', nullable: false })
    quantity: number;
}
