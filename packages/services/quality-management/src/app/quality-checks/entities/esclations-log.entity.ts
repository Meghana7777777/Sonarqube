import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";

@Entity('esclations_log')
export class EsclationsLogEntity extends AbstractEntity {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;


    @Column('bigint', { name: 'escaltion_id', nullable: true })
    esclationId: number;

    @Column('varchar', { name: 'action_status', length: 50, nullable: false })
    actionStatus: string;

    @Column('int', { name: 'quantity', nullable: false })
    quantity: number;
    
    @Column('varchar', { name: 'quality_check_ids', length: 50, nullable: false })
    qualityCheckIds: string;

    @Column('bigint', { name: 'quality_config_id', nullable: true })
    qualityConfigId: number;
}