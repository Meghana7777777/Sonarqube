import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { PoRatioLineEntity } from "./po-ratio-line.entity";

@Entity('po_ratio_fabric')
export class PoRatioFabricEntity extends AbstractEntity {

  @Column("bigint", { name: "po_serial", nullable: false, comment: '' })
  poSerial: number;

  @Column("varchar", { length: 100, name: "item_color", nullable: false,  comment: ''})
  itemColor: string;

  @Column("varchar", { length: 100, name: "item_code", nullable: false, comment: '' })
  itemCode: string;

  @Column("smallint", { name: "plies", nullable: false, default: 0, comment: '' })
  plies: number;

  @Column("smallint", { name: "max_plies", nullable: false, default: 0, comment: '' })
  maxPlies: number;

  @Column("varchar", { length: 5, name: "cg_name", nullable: true, comment: '' })
  cgName: string;

  @Column("varchar", { length: 20, name: "fabric_category", nullable: true, comment: '' })
  fabricCategory: string;

  // Ref key of the ratio entity PK
  // @Column("bigint", { name: "po_ratio_id", nullable: false, default: 0 })
  // poRatioId: number;

  @ManyToOne(type => PoRatioLineEntity, prl => prl.poRatioFabs, { nullable: false })
  @JoinColumn({ name: "po_ratio_line_id", foreignKeyConstraintName: "PRATIO_LINE_F" })
  poRatioLineId: PoRatioLineEntity[];

}
