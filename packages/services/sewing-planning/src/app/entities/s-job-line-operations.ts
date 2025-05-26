import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../database/common-entities";
import { FixedOpCodeEnum, ProcessTypeEnum } from "@xpparel/shared-models";

@Entity('s_job_line_operations')
export class SJobLineOperationsEntity extends AbstractEntity {


  @Column('bigint', { name: 'processing_serial', nullable: false })
  processingSerial: number;

  @Column('varchar', { name: 'process_type', length: 25, nullable: false })
  processType: ProcessTypeEnum;

  @Column({ type: 'varchar', length: 30, name: 'job_number' })
  jobNumber: string;

  @Column({ type: 'varchar', name: 'operation_group' })
  operationGroup: string;

  @Column({ type: 'varchar', name: 'operation_codes' })
  operationCodes: string;

  @Column({ type: 'varchar', length: 3, nullable: false, name: 'operation_code', comment: 'The hardcoded op code for the input and the output' })
  operationCode: FixedOpCodeEnum;

  @Column({ type: 'int', name: 'original_qty' })
  originalQty: number;

  @Column({ type: 'int', name: 'input_qty', default: 0 })
  inputQty: number;

  @Column({ type: 'int', name: 'good_qty' })
  goodQty: number;

  @Column({ type: 'int', name: 'rejection_qty' })
  rejectionQty: number;

  @Column({ type: 'tinyint', name: 'open_rejections' })
  openRejections: number; // DUMMY

  @Column({ type: 'smallint', name: 'operation_sequence' })
  operationSequence: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'smv' })
  smv: number;
}