import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../database/common-entities";
import { InsTrimDefectTypesEnum } from "@xpparel/shared-models";


@Entity('ins_trim_defects')
export class InsTrimDefects extends AbstractEntity {
  
    @Column('integer', { name: 'items_id', nullable: true })
    ItemsId: number;

    @Column('enum', { name: 'defect_type', enum: InsTrimDefectTypesEnum })
    defectType: InsTrimDefectTypesEnum;

    
    @Column('varchar', { name: 'defect_description', nullable: true })
    defectDescription	: string;

    @Column('integer', { name: 'defect_quantity', nullable: true })
    defectQuantity: number;

} 