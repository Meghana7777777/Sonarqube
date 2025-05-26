import { FGContainerGroupTypeEnum } from "@xpparel/shared-models";
import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../../database/common-entities";

@Entity('fg_t_container_group')
export class FGContainerGroupEntity extends AbstractEntity {

    @Column('varchar', {
        name: 'pg_name',
        nullable: false,
        length: 5,
    })
    pgName: string;

    @Column('varchar', {
        name: 'pg_type',
        length: 10,
        nullable: false,
    })
    pgType: FGContainerGroupTypeEnum;

    @Column('int', {
        name: 'confirmed_container_id',
        nullable: true,
    })
    confirmedContainerId: number;

    @Column('int', {
        name: 'pack_list_id',
        nullable: false
    })
    packListId: number;

}

