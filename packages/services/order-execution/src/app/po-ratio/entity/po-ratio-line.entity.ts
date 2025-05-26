import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { PoRatioFabricEntity } from "./po-ratio-fabric.entity";
import { PoRatioSizeEntity } from "./po-ratio-size.entity";
import { PoRatioEntity } from "./po-ratio.entity";

@Entity('po_ratio_line')
export class PoRatioLineEntity extends AbstractEntity {

  @Column("bigint", { name: "po_serial", nullable: false, comment: '' })
  poSerial: number;

  @Column("varchar", { length: 20, name: "style", nullable: true, comment: '' })
  style: string;

  @Column("varchar", { length: 50, name: "color", nullable: true,  comment: ''})
  color: string;

  @Column("smallint", { name: "plies", nullable: false, comment: '' })
  plies: number;

  // Reference key. Usually null. If Mo-line level ratios are maintained, then here we will put the po_line PK associated with the Mo-line
  @Column({ type: 'bigint', name: 'p_order_line_id', nullable: true  })
  pOrderLineId: number;

  @Column({ type: 'varchar', length: 40, name: 'product_type', nullable: false })
  productType: string;

  @Column({ type: 'varchar', length: 60, name: 'product_name', nullable: false })
  productName: string;

  @ManyToOne(type => PoRatioEntity, pr => pr.poRatioLines, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: "po_ratio_id", foreignKeyConstraintName: "PRATIO" })
  poRatioId: PoRatioEntity;

  @OneToMany(type => PoRatioFabricEntity, prf => prf.poRatioLineId, { cascade: true })
  poRatioFabs: PoRatioFabricEntity[];

  @OneToMany(type => PoRatioSizeEntity, prs => prs.poRatioLineId, { cascade: true })
  poRatioSizes: PoRatioSizeEntity[];

}


  