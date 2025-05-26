
import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";

@Entity('fg_t_container_location_map_history')
export class FGContainerLocationMapHistoryEntity extends AbstractEntity {

    @Column('int', {
        name: 'container_id',
        nullable:false,
    })
    containerId: number

    @Column('int', {
        name: 'from_location_id',
        nullable:false,
    })
    fromLocationId: number

    @Column('int', {
        name: 'to_location_id',
        nullable:false,
    })
    toLocationId: number
    
    @Column('varchar', {
        name: 'moved_by',
        nullable:false,
        length: 20
    })
    movedBy: string
}
