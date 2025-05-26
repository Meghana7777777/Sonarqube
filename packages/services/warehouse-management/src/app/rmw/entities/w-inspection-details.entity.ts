import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";

@Entity('w_inspection_details')
export class WInspectionDetailsEntity extends AbstractEntity {
    @Column('varchar', { name: 'attribute_name',length:100 })
    attributeName: number;

    @Column('int', { name: 'attribute_value'})
    attributeValue: number;

    @Column('int', { name: 'w_inspection_id' })
    wInspectionId: number;

   
}