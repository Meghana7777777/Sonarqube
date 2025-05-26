
import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { ProcessTypeEnum, OpFormEnum } from '@xpparel/shared-models';

@Entity('sp_version')
export class SpOpVersionEntity extends AbstractEntity {

  @Column('varchar', { length: 20, name: 'version', nullable: false })
  version: string;

  @Column('varchar', { length: 100, name: 'description', nullable: false })
  description: string;

  @Column({ type: 'bigint', name: 'sp_id', nullable: false })
  styleProductTypeId: number;

 
}