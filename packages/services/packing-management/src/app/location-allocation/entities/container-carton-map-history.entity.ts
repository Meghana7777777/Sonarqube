import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";

@Entity('fg_t_container_carton_map_history')
export class FGContainerCartonMapHistoryEntity extends AbstractEntity {

    @Column('int', {
        name: 'item_lines_id',
        nullable:false,
    })
    itemLinesId: number;

    @Column('int', {
        name: 'from_container_id',
        nullable:false,
    })
    fromContainerId: number;

    @Column('int', {
        name: 'to_container_id',
        nullable:false,
    })
    toContainerId: number;

    @Column('int', {
        name: 'pack_list_id',
        nullable:false,
    })
    packListId: number;

    @Column('varchar', {
        name: 'moved_by',
        nullable:false,
        length: 20
    })
    movedBy: string;
}

