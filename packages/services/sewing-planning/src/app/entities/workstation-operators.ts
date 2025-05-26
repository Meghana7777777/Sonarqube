import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../database/common-entities";

@Entity('workstation_operators')
export class WorkstationOperatorsEntity extends AbstractEntity {
  
    @Column({ type: 'varchar', length: 10, name: 'workstation_id' })
    workstationId: string;
  
    @Column({ type: 'date',  name: 'date' })
    date: string ;
  
    @Column({ type: 'varchar', length: 10, name: 'shift' })
    shift: string;
  
    @Column({ type: 'tinyint', name: 'operator_name', default: 0 })
    operatorName: number;
  
    @Column({ type: 'datetime', name: 'start_time' })
    startTime: string;

    @Column({ type: 'datetime', name: 'end_time' })
    endTime: string;


  
   
}