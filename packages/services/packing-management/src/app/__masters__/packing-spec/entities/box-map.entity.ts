import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../../database/common-entities";

@Entity('pm_m_ps_to_box_map')
export class BoxMapEntity extends AbstractEntity {

    @Column({ name: 'level_no', type: 'int' })
    levelNo: number;

    @Column({ name: 'no_of_items', type: 'int' })
    noOfItems: number;

    @Column('int', { name: 'spec_id' })
    specId : number;


    @Column('int', { name: 'item_id' })
    itemId: number; 
}