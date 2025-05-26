import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";

@Entity('quality_esclations_config')
export class QualityEsclationsConfigEntity extends AbstractEntity {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column('bigint', { name: 'quality_config_id', nullable: true })
    qualityConfigId: number;

    @Column('varchar', { nullable: true, name: "name", length: 250 })
    name: string;

    @Column('int', { nullable: true, name: "quantity", })
    quantity: number;

    @Column('varchar', { nullable: true, name: "responsible_user", length: 100 })
    responsibleUser: string;

    @Column('int', { nullable: true, name: "level", })
    level: string;

}