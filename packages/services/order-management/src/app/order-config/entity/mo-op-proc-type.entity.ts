
import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { ProcessTypeEnum, OpFormEnum } from '@xpparel/shared-models';

@Entity('mo_op_proc_type')
export class MoOpProcTypeEntity extends AbstractEntity {

  @Column({ type: 'bigint', name: 'mo_op_version_id', nullable: false })
  moOpVersionId: number;

  @Column('varchar', { length: 10, name: 'proc_type', nullable: false })
  procType: ProcessTypeEnum;

  @Column('tinyint', { name: 'order', nullable: false })
  order: number;

  @Column('varchar', { length: 15, name: 'dep_proc_type', nullable: false, comment: "CSV of the processing types" })
  depProcType: string; // csv

  @Column('varchar', { length: 10, name: 'routing_group', nullable: false })
  routingGroup: string;

  @Column('int', { name: 'bundle_quantity', nullable: false })
  bundleQty: number;

  @Column('int', { name: 'output_bundle_quantity', nullable: false, default: 0 })
  outPutBundleQty: number;

  @Column('varchar', { length: 10, name: 'output_fg_sku', nullable: false, comment: 'FG Sku configured at the style + product + color level. Refer fg_sku master table' })
  outPutItemSku: string;

  @Column('boolean', {
    nullable: false,
    default: false,
    name: 'is_bundling_ops',
  })
  isBundlingOps: boolean;

  @Column('boolean', {
    nullable: false,
    default: true,
    name: 'is_operatorLevel_tracking',
  })
  isOperatorLevelTracking: boolean;


  @Column('boolean', {
    nullable: false,
    default: true,
    name: 'is_inventory_item',
  })
  isInventoryItem: boolean;
}




