import { PackFinalInspectionStatusEnum } from '@xpparel/shared-models';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { AbstractEntity } from '../../../database/common-entities';
import { RejectedReasonsEntity } from '../rejected-reasons/entities/rejected-reasons.entity';

@Entity('pm_t_ins_request_items')
export class PackInsRequestItemEntity extends AbstractEntity {
  @Column('varchar', { name: 'object_type', length: 255 })
  objectType: string;

  @Column('int', { name: 'ph_item_lines_id', comment: 'carton_id' })
  phItemLinesId: number;

  @Column('int', { name: 'ins_request_id' })
  insRequestId: number;

  @Column("decimal", {
    name: "quantity",
    nullable: false,
    precision: 8,
    scale: 2,
  })
  quantity: number;

  @Column("decimal", {
    name: "accepted_quantity",
    nullable: false,
    precision: 8,
    scale: 2,
  })
  acceptedQuantity: number;

  @Column({ name: 'gross_weight', type: 'int', nullable: true })
  grossWeight: number;

  @Column({ name: 'net_weight', type: 'int', nullable: true })
  netWeight: number;

  @Column('varchar', { name: 'inspection_result', length: 10 })
  inspectionResult: PackFinalInspectionStatusEnum;

  @Column('varchar', { name: 'final_inspection_result', length: 10 })
  finalInspectionResult: PackFinalInspectionStatusEnum;

  @Column('boolean', { name: 'acceptance', default: null })
  acceptance: boolean;


  @Column('varchar', { name: 'inspection_person', length: 100, default: null })
  inspectionPerson: string;

  @Column('timestamp', { name: 'ins_started_at', default: null })
  insStartedAt: Date;

  @Column('timestamp', { name: 'ins_completed_at', default: null })
  insCompletedAt: Date;

  @Column('varchar', { name: 'workstation_code', length: 100, default: null })
  workstationCode: string;

  @Column('int', { name: 'ph_item_line_sample_id', default: null })
  phItemLineSampleId: number;

  @Column('integer', { name: 'po_id' })
  poId: number;

  @Column('integer', {
    name: 'pack_list_id',
  })
  packListId: number;

  @Column('varchar', { name: 'item_code', length: 50 })
  itemCode: string;

  @Column('varchar', { name: 'style_number', length: 25 })
  styleNumber: string;


  @Column('int', { name: 'rejected_reason_id' })
  rejectedReason: number;


  // @ManyToOne(() => RejectedReasonsEntity, (res) => res.insItems)
  // @JoinColumn([{ name: 'rejected_reason_id' }])
  // rejectedReason: RejectedReasonsEntity

}
