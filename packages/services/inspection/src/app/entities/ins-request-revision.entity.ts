import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../../database/common-entities';
import { RollSelectionTypeEnum } from '@xpparel/shared-models';

@Entity('ins_request_revision')
export class InsRequestRevisionEntity extends AbstractEntity{

  @Column('int',{ name: 'ins_request_id' })
  insRequestId: number;

  @Column('int',{ name: 'percentage' })
  percentage: number;

  @Column({ name: 'roll_selection_type', type: 'enum', enum: RollSelectionTypeEnum })
  rollSelectionType: RollSelectionTypeEnum;
}
