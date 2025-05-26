import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";

@Entity('quality_checklist_config')
export class QualityCheckListConfigEntity extends AbstractEntity {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column('varchar', { name: 'name', length: 50, nullable: false })
    name: string;

    

    
}