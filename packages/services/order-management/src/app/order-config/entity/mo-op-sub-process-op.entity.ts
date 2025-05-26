
import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { ProcessTypeEnum, OpFormEnum } from '@xpparel/shared-models';

@Entity('mo_op_sub_process_op')
export class MoOpSubProcessOPEntity extends AbstractEntity {

  @Column({ type: 'bigint', name: 'sub_process_id', nullable: false })
  subProcessId: number;

  @Column('varchar', { length: 10, name: 'proc_type', nullable: false })
  procType: ProcessTypeEnum;

  @Column('varchar', { length: 15, name: 'sub_process_name', nullable: false })
  subProcessName: string;

  @Column('varchar', { length: 10, name: 'op_code', nullable: false })
  opCode: string;

  @Column('varchar', { length: 20, name: 'op_group', nullable: false })
  opGroup: string;

  @Column('varchar', { length: 100, name: 'op_name', nullable: false })
  opName: string;

  @Column('decimal', { precision: 5, scale: 2, name: 'smv', nullable: false })
  smv: number;

  @Column('tinyint', { name: 'order', nullable: false })
  order: number;

  
}

