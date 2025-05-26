import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";

@Entity('po_docket_gen_order')
export class PoDocketGenOrderEntity extends AbstractEntity {
  
  @Column("bigint", { name: "po_serial", nullable: false, comment: '' })
  poSerial: number;

  @Column("bigint", { name: "po_ratio_id", nullable: false, comment: '' })
  poRatioId: number;
}