
import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { ProcessTypeEnum, OpFormEnum } from '@xpparel/shared-models';

@Entity('mo_op_version')
export class MoOpVersionEntity extends AbstractEntity {

  @Column('varchar', { length: 20, name: 'version', nullable: false })
  version: string;

  @Column('varchar', { length: 100, name: 'description', nullable: false })
  description: string;

  @Column({ type: 'bigint', name: 'mo_product_fg_color_id', nullable: false })
  moProductFgColorId: number;

  @Column({ type: 'bigint', name: 'parent_version_id', nullable: false })
  parentVersionId: number;

  @Column('varchar', { length: 20, name: 'parent_version', nullable: false })
  parentVersion: string;

}