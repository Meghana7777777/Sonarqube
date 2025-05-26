import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";

@Entity('w_allocation')
export class WAllocationEntity extends AbstractEntity {
    @Column('int', { name: 'doc/cutNo' })
    docCutNo: number;

    @Column('varchar', { name: 'w_roll_data_id', length: 100 })
    wRollDataId: string;

    @Column('int', { name: 'allocated_qty' })
    allocatedQty: number;

   
}
