import { DocGenStatusEnum } from '@xpparel/shared-models';
import { Column, Entity, OneToMany } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { PoRatioComponentEntity } from "./po-ratio-component.entity";
import { PoRatioLineEntity } from "./po-ratio-line.entity";

@Entity('po_ratio')
export class PoRatioEntity extends AbstractEntity {

  @Column("bigint", { name: "po_serial", nullable: false, comment: '' })
  poSerial: number;

  @Column("varchar", { length: 50, name: "ratio_name", nullable: true, comment: 'the ratio name if any' })
  ratioName: string;

  @Column("int", { name: "ratio_code", nullable: true,  comment: 'the unique number for the ratio under a SUB PO'})
  ratioCode: number;

  @Column("varchar", { length: 50, name: "ratio_desc", nullable: true, comment: '' })
  ratioDesc: string;

  @Column("tinyint", { name: "doc_gen_status", nullable: false, default: 0, comment: 'The doc status. 0-OPEN, 1-STARTED, 2-COMPLETED, 3-INPROGRESS ' })
  docGenStatus: DocGenStatusEnum;

  // Reference key. Usually null. If Mo-line level ratios are maintained, then here we will put the po_line PK associated with the so-line
  @Column("bigint", { name: 'p_order_line_id', nullable: true, comment: 'Usually empty. But when a SO line level ratio is saved, then this will the po_line PK' })
  pOrderLineId: number;

  @Column("bigint", { name: 'po_marker_id', nullable: true, comment: 'The PK of the marker entity' })
  poMarkerId: number;

  @OneToMany(type => PoRatioLineEntity, pl => pl.poRatioId, { cascade: true, onDelete: 'CASCADE' })
  poRatioLines: PoRatioLineEntity[];

  @OneToMany(type => PoRatioComponentEntity, prc => prc.poRatioId, { cascade: true, onDelete: 'CASCADE' })
  poRatioComponents: PoRatioComponentEntity[];

}
