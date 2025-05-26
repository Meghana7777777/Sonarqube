
import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { ProcessTypeEnum, OpFormEnum, BomItemTypeEnum, PhItemCategoryEnum } from '@xpparel/shared-models';

@Entity('mo_op_sub_proc_bom')
export class MoOpSubProcessBomEntity extends AbstractEntity {

  @Column({ type: 'bigint', name: 'sub_process_id', nullable: false })
  subProcessId: number;

  @Column('varchar', { length: 10, name: 'proc_type', nullable: false })
  procType: ProcessTypeEnum;

  @Column('varchar', { length: 15, name: 'sub_process_name', nullable: false })
  subProcessName: string;

  @Column('varchar', { length: 30, name: 'bom_item_code', nullable: false })
  bomItemCode: string;

  @Column('varchar', { length: 50, name: 'bom_item_desc', nullable: false })
  bomItemDesc: string;

  @Column('varchar', { length: 10, name: 'bom_item_type', nullable: false })
  bomItemType: BomItemTypeEnum;

  @Column('varchar', { length: 10, name: 'item_type', nullable: false, default: PhItemCategoryEnum.DEFAULT })
  itemType: PhItemCategoryEnum;

  @Column('varchar', { length: 30, name: 'bom_sku', nullable: true })
  bomSku: string; // 

  @Column({ type: 'decimal', name: 'consumption', nullable: true, precision: 10, scale: 2, })
  consumption: number;
}

