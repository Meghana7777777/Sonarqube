import { Entity, Column } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { PKMSInspectionHeaderAttributesEnum } from "@xpparel/shared-models";

@Entity('pm_t_pack_list_attributes')
export class PackListRequestAttributesEntity extends AbstractEntity {
    @Column('int', { name: 'pack_list_id' })
    packListId: number;
  
    @Column('varchar', { name: 'attribute_name', length: 100 })
    attributeName: PKMSInspectionHeaderAttributesEnum;
  
    @Column('text', { name: 'attribute_value' })
    attributeValue: string;
}