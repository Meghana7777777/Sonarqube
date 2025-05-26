
import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { ProcessTypeEnum, OpFormEnum } from '@xpparel/shared-models';

@Entity('mo_op_sub_process')
export class MoOpSubprocessEntity extends AbstractEntity {
  
  @Column({ type: 'bigint', name: 'process_type_id', nullable: false })
  processTypeId: number;

  @Column('varchar', { length: 10, name: 'proc_type', nullable: false })
  procType: ProcessTypeEnum;

  @Column('varchar', { length: 15, name: 'sub_process_name', nullable: false })
  subProcessName: string;

  @Column('tinyint', { name: 'order', nullable: false })
  order: number;

  @Column('varchar', { length: 60, name: 'dep_sub_processes', nullable: false })
  depSubProcesses: string;

  @Column('varchar', { length: 30, name: 'output_item_sku', nullable: false })
  outPutItemSku: string; // PROCESSING TYPE + STYLE + PRODUCT TYPE + ORDER
}
