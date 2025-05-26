import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ActivityStatusEnum, InsInspectionActivityStatusEnum, InsInspectionFinalInSpectionStatusEnum } from '@xpparel/shared-models';
import { AbstractEntity } from '../../database/common-entities';

@Entity('ins_request_items')
export class InsRequestItemEntity extends AbstractEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;
  @Column('int', { name: 'ins_request_id' })
  insRequestId: number;

  @Column('int', { name: 'ins_request_line_id', nullable: false })
  insRequestLineId: number;

  @Column('varchar', { name: 'ref_id_L1', nullable: true, comment: 'PK of the roll / carton' })
  refIdL1: string;

  @Column('varchar', { name: 'ref_id_L2', nullable: true, comment: 'PK of the gmt, etc' })
  refIdL2: string;

  @Column('varchar', { name: 'ref_no_L1', nullable: true, comment: 'Roll barcode / carton barcode' })
  refNoL1: string;

  @Column('varchar', { name: 'ref_no_L2', nullable: true, comment: 'Polybag barcode' })
  refNoL2: string;

  @Column('int', { name: 'ins_quantity', nullable: false, comment: 'Roll qty / NO of gmts IN the carton' })
  insQuantity: number;

  @Column('int', { name: 'ins_pass_quantity', nullable: true })
  insPassQuantity: number;

  @Column('int', { name: 'ins_fail_quantity', nullable: true })
  insFailQuantity: number;

  @Column('enum', { name: 'ins_activity_status', enum: InsInspectionActivityStatusEnum })
  insActivityStatus: InsInspectionActivityStatusEnum; 

  @Column('enum', { name: 'ins_final_inspection_status', enum: InsInspectionFinalInSpectionStatusEnum })
  finalInspectionStatus: InsInspectionFinalInSpectionStatusEnum;

  @Column('enum', { name: 'inspection_result', enum: InsInspectionFinalInSpectionStatusEnum })
  inspectionResult: InsInspectionFinalInSpectionStatusEnum;

  @Column('varchar', { name: 'inspection_owner', length: 100 })
  inspectionOwner: string;

  @Column('varchar', { name: 'inspection_area_I1', length: 100 })
  inspectionAreaI1: string;

  @Column('varchar', { name: 'inspection_area_I2', length: 100 })
  inspectionAreaI2: string;

  @Column('int',{name:'rejected_reason_id'})
  rejectedReasonId:number; 


  @Column('varchar', { name: 'item_code', nullable: false, comment: 'item_code',length: 50 })
  itemCode: string;













  // @Column('varchar', { name: 'object_type', length: 255 })
  // objectType: string;



  // @Column("decimal", {
  //   name: "quantity",
  //   nullable: false,
  //   precision: 8,
  //   scale: 2,
  // })
  // quantity: number;

  // @Column("decimal", {
  //   name: "accepted_quantity",
  //   nullable: false,
  //   precision: 8,
  //   scale: 2,
  // })
  // acceptedQuantity: number;

  // @Column('varchar', { name: 'inspection_result', length: 10 })
  // inspectionResult: InspectionFinalInSpectionStatusEnum;

  // @Column('varchar', { name: 'final_inspection_result', length: 10 })
  // finalInspectionResult: InspectionFinalInSpectionStatusEnum;

  // // @Column('varchar', { name: 'inspection_result', length: 100 })
  // // inspectionResult: InspectionResultEnum;

  // @Column('boolean', { name: 'acceptance', default: null })
  // acceptance: boolean;


  // @Column('varchar', { name: 'inspection_person', length: 100, default: null })
  // inspectionPerson: string;

  // @Column('timestamp', { name: 'ins_started_at', default: null })
  // insStartedAt: Date;

  @Column('timestamp', { name: 'ins_completed_at', default: null })
  insCompletedAt: Date;

  // @Column('varchar', { name: 'workstation_code', length: 100, default: null })
  // workstationCode: string;

  // @Column('int', { name: 'ph_item_line_sample_id', default: null })
  // phItemLineSampleId: number;

  // @Column('varchar', { name: 'lot_number' })
  // lotNumber: string;

  // @Column('varchar', { name: 'batch_number' })
  // batchNumber: string;

  // @Column('varchar', { name: 'item_code', length: 50 })
  // itemCode: string;

  @Column('varchar', { name: 'style_number', length: 25 })
  styleNumber: string;

}
