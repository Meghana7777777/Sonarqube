import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { ProcessTypeEnum } from "@xpparel/shared-models";

@Entity('quality_config')
export class QualityConfigurationEntity extends AbstractEntity {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column('varchar', { name: 'style_code', length: 50, nullable: false })
    styleCode: string;

    @Column('varchar', { name: 'process_type', length: 25, nullable: false })
    processType: ProcessTypeEnum;

    @Column('bigint', { name: 'quality_type_id', nullable: true })
    qualityTypeId: number;

    @Column('int', { name: 'quality_percentage', nullable: true })
    qualityPercentage: number;

    @Column('boolean', { nullable: false, default: true,name: 'is_mandatory'})
    isMandatory: boolean;
    
}