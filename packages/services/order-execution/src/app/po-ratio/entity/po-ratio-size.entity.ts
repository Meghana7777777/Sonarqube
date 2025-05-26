import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { PoRatioLineEntity } from "./po-ratio-line.entity";

@Entity('po_ratio_size')
export class PoRatioSizeEntity extends AbstractEntity {

  @Column("varchar", { length: 20, name: "size", nullable: false, comment: '' })
  size: string;

  @Column("smallint", { name: "ratio", nullable: false, default: 0 })
  ratio: number;

  // Ref key of the ratio entity PK
  // @Column("bigint", { name: "po_ratio_id", nullable: false, default: 0 })
  // poRatioId: number;

  @ManyToOne(type => PoRatioLineEntity, prl => prl.poRatioSizes, { nullable: false })
  @JoinColumn({ name: "po_ratio_line_id", foreignKeyConstraintName: "PRATIO_LINE_S" })
  poRatioLineId: PoRatioLineEntity[];
}