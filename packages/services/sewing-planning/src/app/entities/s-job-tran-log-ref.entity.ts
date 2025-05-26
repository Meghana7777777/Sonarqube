import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../database/common-entities";

@Entity('s_job_tran_log_ref')
export class SJobTranLogRefEntity extends AbstractEntity {

  @Column('bigint', { name: 'tran_log_ref_id', nullable: false })
  tranLogRefId: number;

}

