
import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";

@Entity('tray_trolley_map_history')
export class TrayTrolleyMapHistoryEntity extends AbstractEntity {

    @Column('int', {
        name: 'tray_id',
        nullable:false,
    })
    trayId: number

    @Column('int', {
        name: 'from_trolley_id',
        nullable:false,
    })
    fromTrolleyId: number

    @Column('int', {
        name: 'to_trolley_id',
        nullable:false,
    })
    toTrolleyId: number
    
    @Column('varchar', {
        name: 'moved_by',
        nullable:false,
        length: 20
    })
    movedBy: string
}
