import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { AbstractEntity } from '../../../database/common-entities';
import { EmbReqAttibutesEnum } from '@xpparel/shared-models';


@Entity('emb_attribute')
export class EmbAttributeEntity {
  @PrimaryGeneratedColumn({name: 'id'})
  id: number;

  @Column('mediumint', { name: 'emb_header_id', nullable: true })
  embHeaderId: number;

  @Column('mediumint', { name: 'emb_line_id', nullable: true })
  embLineId: number;

  @Column('varchar', { name: 'name', length: 10, nullable: false })
  name: EmbReqAttibutesEnum;

  @Column('text', { name: 'value' })
  value: string;
}
