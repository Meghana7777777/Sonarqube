import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../database/common-entities";
import { ProcessTypeEnum } from "@xpparel/shared-models";

@Entity('s_job_bundle')
export class SJobBundleEntity extends AbstractEntity {

  @Column('bigint', {
    name: 's_job_line_id',
    nullable: false
  })
  sJobLineId: number

  @Column('varchar', {
    name: 'color',
    length: 30,
    nullable: false
  })
  color: string

  @Column('varchar', {
    name: 'size',
    length: 30,
    nullable: false
  })
  size: string

  @Column('int', {
    name: 'qty',
    nullable: false
  })
  qty: number

  @Column('bigint', { name: 'mo_product_sub_line_id', nullable: false })
  moProductSubLineId: number; 

  @Column('varchar', { name: 'bundle_number', length: 30, nullable: false })
  bundleNumber: string;

  @Column('boolean', { name: 'is_act_bun', default: false })
  isActBun: boolean;

  @Column('boolean', { name: 'moved_to_inv', default: false })
  movedToInv: boolean;

  @Column('bigint', { name: 'processing_serial', nullable: false })
  processingSerial: number;

  @Column('varchar', { name: 'process_type', length: 25, nullable: false })
  processType: ProcessTypeEnum;

}
