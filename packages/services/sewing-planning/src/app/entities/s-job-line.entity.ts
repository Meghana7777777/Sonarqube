import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../database/common-entities";
import { ProcessTypeEnum } from "@xpparel/shared-models";

@Entity('s_job_line')
export class SJobLineEntity extends AbstractEntity {

  @Column('bigint', { name: 'processing_serial', nullable: false })
  processingSerial: number;

  @Column('varchar', { name: 'process_type', length: 25, nullable: false })
  processType: ProcessTypeEnum;

  @Column('bigint', {
    name: 's_job_header_id',
    nullable: false
  })
  sJobHeaderId: number

  @Column('varchar', {
    name: 'sub_process_name',
    nullable: false
  })
  subProcessName: string

  @Column('varchar', {
    name: 'job_number',
    length: 30,
    nullable: false
  })
  jobNumber: string

}
