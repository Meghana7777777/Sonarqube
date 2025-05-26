import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";

@Entity('w_inspection')
export class WInspectionEntity extends AbstractEntity {

    @Column('varchar', { name: 'w_roll_data_id', length: 100 })
    wRollDataId: string;

    @Column('varchar', { name: 'inspection_type',length:100 })
    inspectionType: string;

    @Column('varchar', { name: 'Status' ,length:50})
    status: string;

   
}
