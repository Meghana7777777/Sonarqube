import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { FgContainerLocationStatusEnum } from "@xpparel/shared-models";

@Entity('fg_t_container_location_map')
export class FGContainerLocationMapEntity extends AbstractEntity {

    @Column('int', {
        name: 'container_id',
        nullable:false,
    })
    containerId: number

    @Column('int', {
        name: 'suggested_location_id',
        nullable:false,
    })
    suggestedLocationId: number;

    @Column('int', {
        name: 'confirmed_location_id',
        nullable:false,
    })
    confirmedLocationId: number;

    @Column('enum', {
        name: 'status',
        enum: FgContainerLocationStatusEnum
    })
    status: FgContainerLocationStatusEnum;
    
}
