import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";

@Entity('shift')
export class ShiftEntity extends AbstractEntity {

    @Column('char', { length: 1, name: 'shift', nullable: false })
    shift: string;

    @Column('time', { name: 'start_time', nullable: false })
    startTime: string; // HH:MM:SS

    @Column('time', { name: 'end_time', nullable: false })
    endTime: string; // HH:MM:SS

}
