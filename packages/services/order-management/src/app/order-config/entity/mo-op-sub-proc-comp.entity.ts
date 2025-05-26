
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { ProcessTypeEnum, OpFormEnum } from '@xpparel/shared-models';

@Entity('mo_op_sub_proc_component')
export class MoOpSubProcessComponentEntity {

  @PrimaryGeneratedColumn({
    name: 'id'
  })
  public id: number;

  @Column({ type: 'bigint', name: 'sub_process_id', nullable: false })
  subProcessId: number;

  @Column('varchar', { length: 10, name: 'proc_type', nullable: false })
  procType: ProcessTypeEnum;

  @Column('varchar', { length: 15, name: 'sub_process_name', nullable: false })
  subProcessName: string;

  @Column('varchar', { length: 20, name: 'op_code', nullable: false })
  componentName: string;
}