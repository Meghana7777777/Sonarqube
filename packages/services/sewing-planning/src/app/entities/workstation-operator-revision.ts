import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../database/common-entities";

@Entity('workstation_operator-revision')
export class WorkstationOperatorRevisionEntity extends AbstractEntity {
  
    @Column({ type: 'varchar', length: 10, name: 'workstation_operator_id' })
    workstationOperatorId: string;
  
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

    @Column({ type: 'varchar', length: 10, name: 'from_ws' })
    fromWs: string;

    @Column({ type: 'varchar', length: 10, name: 'to_ws' })
    toWs: string;

    @Column({ type: 'varchar', length: 10, name: 'from_mod' })
    fromMod: string;

    @Column({ type: 'varchar', length: 10, name: 'to_mod' })
    toMod: string;

  
   
}