import { PKMSInspectionHeaderAttributesEnum } from '@xpparel/shared-models';
import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../../../database/common-entities';

@Entity('pm_t_ins_request_attributes')
export class PackInsRequestAttributeEntity extends AbstractEntity {
  @Column('int', { name: 'ins_request_id' })
  insRequestId: number;

  @Column('varchar', { name: 'attribute_name', length: 100 })
  attributeName: PKMSInspectionHeaderAttributesEnum;

  @Column('text', { name: 'attribute_value' })
  attributeValue: string;
}
