
import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { ProcessTypeEnum, OpFormEnum } from '@xpparel/shared-models';

@Entity('sp_proc_type')
export class SpProcTypeEntity extends AbstractEntity {

  @Column({ type: 'bigint', name: 'sp_version_id', nullable: false })
  spVersionId: number;

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

  @Column('boolean', {
    nullable: false,
    default: false,
    name: 'is_bundling_ops',
  })
  isBundlingOps: boolean;

  @Column('boolean', {
    nullable: false,
    default: true,
    name: 'is_operator_level_tracking',
  })
  isOperatorLevelTracking: boolean;


  @Column('boolean', {
    nullable: false,
    default: true,
    name: 'is_inventory_item',
  })
  isInventoryItem: boolean;
}




