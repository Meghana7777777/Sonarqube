import { Entity, Column } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { PKMSInspectionHeaderAttributesEnum } from "@xpparel/shared-models";

@Entity('pm_t_carton_template_attributes')
export class CartonTemplateAttributesEntity extends AbstractEntity {
    @Column('int', { name: 'carton_template_id' })
    cartonRequestId: number;
  
    @Column('varchar', { name: 'attribute_name', length: 100 })
    attributeName: PKMSInspectionHeaderAttributesEnum;
  
    @Column('text', { name: 'attribute_value' })
    attributeValue: string;
}