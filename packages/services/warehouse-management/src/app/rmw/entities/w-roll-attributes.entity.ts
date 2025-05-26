import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { RmwAttributeNameEnum } from "@xpparel/shared-models";


@Entity('w_roll_attributes')
export class WRollAttributesEntity extends AbstractEntity {

    @Column('enum', {
        name: 'attribute_name',
        enum: RmwAttributeNameEnum
    })
    attributeName: RmwAttributeNameEnum;

    @Column('varchar', { name: 'attribute_value', length: 50 })
    attributeValue: string;

  
}

