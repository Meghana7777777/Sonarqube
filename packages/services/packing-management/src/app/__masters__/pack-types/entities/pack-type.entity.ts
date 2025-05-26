import { PackingMethodsEnum } from "@xpparel/shared-models";
import { Column, Entity, OneToMany } from "typeorm";
import { AbstractEntity } from "../../../../database/common-entities";
import { PLConfigEntity } from "../../../packing-list/entities/pack-list.entity";

@Entity('pm_m_pack_type')
export class PackTypeEntity extends AbstractEntity {
    @Column("varchar", { name: 'code', length: 40 })
    packTypeCode: string;

    @Column("varchar", { name: 'desc', length: 40 })
    packTypeDesc: string;

    @Column('enum', {
        name: 'pack_method',
        enum: PackingMethodsEnum
    })
    packMethod: PackingMethodsEnum;

    // @OneToMany(type => PLConfigEntity, posl => posl.po)
    // plConfigs: PLConfigEntity[];

 

}