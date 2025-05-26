
import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { ProcessTypeEnum, OpFormEnum } from '@xpparel/shared-models';

@Entity('sew_sequence')
export class SewSequence extends AbstractEntity {

  @Column('varchar', { length: 10, name: 'i_op_Code', nullable: false })
  iOpCode: string;

  @Column('varchar', { length: 10, name: 'e_op_code', nullable: false })
  eOpCode: string;

  @Column('varchar', { length: 20, name: 'op_name', nullable: false })
  opName: string;

  @Column('varchar', { length: 10, name: 'op_category', nullable: false })
  opCategory: ProcessTypeEnum;

  @Column('varchar', { length: 30, name: 'op_form', nullable: false })
  opForm: OpFormEnum;

  @Column('tinyint', { name: 'sequence', default: 0, nullable: false })
  opSequence: number;

  @Column('tinyint', { name: 'group', nullable: false })
  group: number;

  @Column('varchar', { length: 30, name: 'dep_group', nullable: false })
  depGroup: string;

  @Column('int', { name: 'smv', default: 0 })
  smv: number;

  @Column('text', { name: 'components' })
  componentNames: string;

  @Column('int', { name: 'op_version_id', nullable: false })
  opVersionId: number;

  // @Column('bigint',{ name: 'po_serial', nullable: false })
  // poSerial: number;

  @Column('varchar', { length: 30, name: 'product_name', nullable: false })
  productName: string;

  @Column('int', {
    name: 'sew_serial',
    nullable: false
  })
  sewSerial: number


  @Column('varchar', { length: 30, name: 'job_type', nullable: true })
  jobType: ProcessTypeEnum;

  @Column('varchar', { length: 30, name: 'to_warehouse', nullable: true })
  warehouse: string;


  @Column('varchar', { length: 30, name: 'to_ExtProcessing', nullable: true })
  extProcessing: string;

  @Column('tinyint', { name: 'bundle_group', nullable: false })
  bundleGroup: number;

  @Column('varchar', { length: 10, name: 'item_code', nullable: true })
  itemCode: string;

}