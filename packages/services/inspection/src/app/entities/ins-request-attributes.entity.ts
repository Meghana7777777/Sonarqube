import { InsInspectionHeaderAttributes, InsUomEnum } from '@xpparel/shared-models';
import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../../database/common-entities';

@Entity('ins_request_attributes')
export class InsRequestAttributeEntity extends AbstractEntity {
  // @PrimaryGeneratedColumn({
  //   name: 'id'
  // })

  @Column('int', { name: 'ins_request_id' })
  insRequestId: number;

  @Column('varchar', { name: 'attribute_name', length: 100 })
  attributeName: InsInspectionHeaderAttributes;

  @Column('text', { name: 'attribute_value',nullable: true })
  attributeValue: string;

  @Column('enum', { name: 'uom', enum: InsUomEnum })
  finalInspectionStatus: InsUomEnum;


}
