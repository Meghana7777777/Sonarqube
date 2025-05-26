import { InsInspectionStatusEnum } from '@xpparel/shared-models';
import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../../database/common-entities';

@Entity('ins_approval_hierarchy')
export class InsApprovalHierarchyEntity extends AbstractEntity {
  @Column('int', { name: 'ins_request_id' })
  insRequestId: number;

  @Column('varchar', { name: 'user_role', length: 100 })
  userRole: string;

  @Column('varchar', { name: 'order', length: 100 })
  order: string;

  @Column('enum',{ name: 'status', enum: InsInspectionStatusEnum })
  status: InsInspectionStatusEnum;

  @Column('varchar', { name: 'sub_feature', length:100 })
  subFeature: string;
}