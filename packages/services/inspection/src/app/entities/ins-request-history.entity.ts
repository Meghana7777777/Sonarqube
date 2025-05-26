import { InsInspectionActivityStatusEnum, InsTypesEnum, InsTypesEnumType } from '@xpparel/shared-models';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { AbstractEntity } from '../../database/common-entities';

@Entity('ins_request_history')
export class InsRequestHistoryEntity extends AbstractEntity {

  @PrimaryGeneratedColumn()
  id: number;


  @Column('integer', { name: 'ins_req_id', comment: 'pk of insreq' })
  InsRedId: number;

  @Column('int', { name: 'ins_request_item_id', nullable: false })
  insRequestItemId: number;

  @Column('varchar', { name: 'inspection_person', nullable: false })
  inspectionPerson: string;

  @Column('enum', { name: 'old_status', enum: InsInspectionActivityStatusEnum })
  oldStatus: InsInspectionActivityStatusEnum;

  @Column('enum', { name: 'new_statuss', enum: InsInspectionActivityStatusEnum })
  newStatus: InsInspectionActivityStatusEnum;


  // @Column('enum', { name: 'fab_ins_type', enum: InsFabricInspectionRequestCategoryEnum })
  // FabInsType: InsFabricInspectionRequestCategoryEnum;

  // @Column('enum', { name: 'fg_ins_type', enum: PackFabricInspectionRequestCategoryEnum })
  // FgInsType: PackFabricInspectionRequestCategoryEnum; 


  @Column('enum', { name: 'ins_type', enum: InsTypesEnum })
  insType: InsTypesEnumType;


  @Column('text', { name: 'remarks', nullable: true, comment: 'Remarks for status change' })
  remarks: string;

  @Column('text', { name: 'reason', nullable: true, comment: 'Reason for status change' })
  reason: string;

  @Column('varchar', { name: 'inspection_area_I1', length: 100 })
  inspectionAreaI1: string;

  @Column('varchar', { name: 'inspection_area_I2', length: 100 })
  inspectionAreaI2: string;



  // @Column('varchar', { name: 'ins_code', length: 50 })
  // insCode: string;

  // @Column('enum', {
  // name: 'ins_material_type',
  // enum: InspectionInsMaterialTypeEnum,
  // })
  // insMaterialType: InspectionInsMaterialTypeEnum;

  // @Column('enum', {
  // name: 'ins_material',
  // enum: InspectionInsMaterialEnum,
  // })
  // insMaterial: InspectionInsMaterialEnum;

  // @Column('int', { name: 'ph_lines_id' })
  // phLinesId: number;

  // @Column('int', { name: 'ph_id' })
  // phId: number;

  // @Column('int', { name: 'lot_number' })
  // lotNumber: number;

  // @Column('int', { name: 'batch_number' })
  // batchNumber: number;

  // @Column('varchar', { name: 'item_code', length: 50 })
  // itemCode: string;

  // @Column('varchar', { name: 'sla', length: 50 })
  // sla: string;

  // @Column('varchar', { name: 'ins_creation_time' })
  // insCreationTime: Date;

  // @Column('varchar', { name: 'material_receive_at' })
  // materialReceiveAt: string;

  // @Column('varchar', { name: 'ins_started_at' })
  // insStartedAt: string;

  // @Column('varchar', { name: 'ins_completed_at' })
  // insCompletedAt: string;

  // @Column('enum', {
  // name: 'ins_activity_status',
  // enum: InspectionInsActivityStatusEnum,
  // })
  // insActivityStatus: InspectionInsActivityStatusEnum;

  // @Column('enum', {
  // name: 'final_inspection_status',
  // enum: InspectionFinalInSpectionStatusEnum,
  // })
  // finalInspectionStatus: InspectionFinalInSpectionStatusEnum;

  // @Column('varchar', { name: 'priority', length: 50 })
  // priority: string;

  // @Column('enum', {
  // name: 'request_category',
  // enum: FabricInspectionRequestCategoryEnum,
  // })
  // requestCategory: FabricInspectionRequestCategoryEnum;

  // @Column('int', { name: 'parent_request_id'})
  // parentRequestId: number;

  // @Column('int', { name: 'ins_request_revision' })
  // insRequestRevision: number;

  // @Column('int', { name: 'ins_request_id' })
  // insRequestId: number;
}
