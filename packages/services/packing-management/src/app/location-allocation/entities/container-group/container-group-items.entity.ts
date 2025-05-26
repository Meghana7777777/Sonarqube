import { FGContainerGroupTypeEnum } from "@xpparel/shared-models";
import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../../database/common-entities";

@Entity('fg_t_container_group_items')
export class FGContainerGroupItemsEntity extends AbstractEntity {

    @Column('varchar', {
        name: 'pg_name',
        nullable: false,
        length: 5,
    })
    pgName: string;

    @Column('varchar', {
        name: 'pg_type',
        length: 10,
        nullable:false,
    })
    pgType: FGContainerGroupTypeEnum;
    
    @Column('int', {
        name: 'item_lines_id',
        nullable:false,
    })
    itemLinesId: number;

    @Column('int', {
        name: 'pg_id',
        nullable:false,
    })
    pgId: number;

    @Column('int', {
        name: 'pack_list_id',
        nullable: false
    })
    packListId: number;
    
}

