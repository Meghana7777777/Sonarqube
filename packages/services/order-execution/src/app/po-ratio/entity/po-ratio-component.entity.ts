import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PoRatioEntity } from "./po-ratio.entity";

@Entity('po_ratio_component')
export class PoRatioComponentEntity {
  @PrimaryGeneratedColumn({name: 'id'})
  id: number;

  @Column("bigint", { name: "po_serial", nullable: false, comment: '' })
  poSerial: number;

  @Column("varchar", { length: 20, name: "component", nullable: false, comment: '' })
  component: string;

  @Column({ type: 'varchar', length: 60, name: 'product_name', nullable: false })
  productName: string;
  
  @ManyToOne(type => PoRatioEntity, pr => pr.poRatioComponents, { nullable: false })
  @JoinColumn({ name: "po_ratio_id", foreignKeyConstraintName: "PRATIO_COMP" })
  poRatioId: PoRatioEntity;
}