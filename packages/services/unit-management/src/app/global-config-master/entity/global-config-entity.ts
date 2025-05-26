import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities/abstract.entity";

@Unique(['masterName','masterCode','masterLabel'])
@Entity('global_config')
export class GlobalConfigEntity extends AbstractEntity {


    @Column('varchar', {
        name: 'master_name',
        nullable: false
    })
    masterName: string;

    @Column('varchar', {
        name: 'master_code',
        nullable: false
    })
    masterCode: string;

    @Column('varchar', {
        name: 'master_label',
        nullable: false
    })
    masterLabel: string;

    @Column('int', {
        name: 'parent_id',
        nullable: true
    })
    parentId?: number;

}