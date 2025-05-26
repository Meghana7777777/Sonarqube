import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { FgContainerLocationStatusEnum } from "@xpparel/shared-models";

@Entity('fg_t_container_carton_map')
export class FGContainerCartonMapEntity extends AbstractEntity {

    @Column('int', {
        name: 'item_lines_id',
        nullable:false,
    })
    itemLinesId: number;

    @Column('int', {
        name: 'suggested_container_id',
        nullable:false,
    })
    suggestedContainerId: number;

    @Column('int', {
        name: 'confirmed_container_id',
        nullable:false,
    })
    confirmedContainerId: number;

    @Column('enum', {
        name: 'status',
        enum: FgContainerLocationStatusEnum
    })
    status: FgContainerLocationStatusEnum;

    @Column('int', {
        name: 'pack_list_id',
        nullable: false
    })
    packListId: number;
    
}





