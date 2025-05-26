import { MaterialTypeEnum } from "@xpparel/shared-models";
import {
  Column,
  Entity,
  OneToMany
} from "typeorm";
import { AbstractEntity } from "../../../../database/common-entities";
import { BoxMapEntity } from "../../packing-spec/entities/box-map.entity";

@Entity("pm_m_items")
export class ItemsEntity extends AbstractEntity {
  @Column("varchar", { name: "code", length: 20 })
  code: string;

  @Column("varchar", { name: "desc", length: 40 })
  desc: string;

  @Column("int", { name: "dimensions_id", nullable: true })
  dimensionsId: number;

  @Column({
    name: "category",
    type: "enum",
    enum: MaterialTypeEnum,
    nullable: false,
  })
  category: MaterialTypeEnum;

  @OneToMany((type) => BoxMapEntity, (pol) => pol.itemId, { cascade: true })
  boxMappings: BoxMapEntity[];

  @Column("int", { name: "material_type" })
  materialType: number;


}
