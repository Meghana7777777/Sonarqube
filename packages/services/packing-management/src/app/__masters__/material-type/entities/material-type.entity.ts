import { Column, Entity, OneToMany } from "typeorm";
import { AbstractEntity } from "../../../../database/common-entities";
import { ItemsEntity } from "../../items/entities/items.entity";

@Entity('pm_m_material_type')
export class MaterialTypeEntity extends AbstractEntity {
    @Column("varchar", { name: 'code', length: 40 })
    materialTypeCode: string;

    @Column("varchar", { name: 'desc', length: 40 })
    materialTypeDesc: string;

    // @OneToMany(type => ItemsEntity, pol => pol.materialType)
    // items: ItemsEntity[];
 

}