import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../database/common-entities";
import { ProcessTypeEnum, SewingJobPlanStatusEnum, TrimStatusEnum } from "@xpparel/shared-models";

@Entity('s_job_line_plan')
export class SJobLinePlanEntity extends AbstractEntity {

  @Column('bigint', { name: 'processing_serial', nullable: false })
  processingSerial: number;

  @Column('varchar', { name: 'process_type', length: 25, nullable: false })
  processType: ProcessTypeEnum;

  @Column({ type: 'varchar', length: 30, name: 'job_number', nullable: false })
  jobNumber: string;

  @Column({ type: 'varchar', length: 10, name: 'location_code', nullable: true })
  locationCode: string;

  @Column({ type: 'enum', enum: SewingJobPlanStatusEnum, name: 'status', default: SewingJobPlanStatusEnum.OPEN, })
  status: SewingJobPlanStatusEnum;

  @Column({ type: 'enum', enum: TrimStatusEnum, name: 'raw_material_status', default: TrimStatusEnum.OPEN, })
  rawMaterialStatus: TrimStatusEnum;

  @Column({ type: 'enum', enum: TrimStatusEnum, name: 'item_sku_status', default: TrimStatusEnum.OPEN})
  itemSkuStatus: TrimStatusEnum;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'smv' })
  smv: number;

  @Column({ type: 'timestamp', name: 'plan_input_date', nullable: true })
  planInputDate: Date;

  @Column('int', { name: 'job_priority', nullable: false })
  jobPriority: number

}