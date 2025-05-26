
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";

@Entity('pm_t_pl_config_least_child')
export class ConfigLeastChildEntity extends AbstractEntity {

  @Column({ name: 'pk_spec_id', type: 'int' })
  pkSpecId: number;

  @Column('varchar', { name: 'color', length: 40 })
  color: string;

  @Column('varchar', { name: 'size', length: 10 })
  size: string;

  @Column({ name: 'ratio', type: 'int' })
  ratio: number;

  @Column('varchar', { name: 'product_ref', length: 15, nullable: false })
  productRef: string;

  @Column('varchar', { name: 'product_code', length: 50, nullable: false })
  productCode: string;

  @Column('varchar', { name: 'product_name', length: 50, nullable: false })
  productName: string; 

  @Column('varchar', { name: 'product_type', length: 50, nullable: false })
  productType: string;

  @Column("varchar", { name: 'upc_barcode', length: 15 })
  upcBarcode: string;

  @Column("bigint", { name: 'least_aggregator_id' })
  leastAggregator: number;

  @Column("bigint", { name: 'po_line_id' })
  poLineId: number;

  @Column("bigint", { name: 'po_order_sub_line_id' })
  poOrderSubLineId: number;

  @Column("bigint", { name: 'po_id' })
  poId: number;

  @Column("bigint", { name: 'pk_config_id' })
  pkConfigId: number;

  @Column("bigint", { name: 'parent_hierarchy_id' })
  parentHierarchyId: number;
}