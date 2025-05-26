
import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { ProcessTypeEnum, OpFormEnum } from '@xpparel/shared-models';

@Entity('sew_version')
export class SewVersion extends AbstractEntity {

  @Column('varchar', { length: 20, name: 'version', nullable: false })
  version: string;

  @Column('varchar', { length: 30, name: 'description', nullable: false })
  description: string;

  // @Column('bigint',{ name: 'po_serial', nullable: false })
  // poSerial: number;

  @Column('varchar', { length: 30, name: 'product_name', nullable: false })
  productName: string;

  @Column('int', { name: 'sew_serial', nullable: false })
  sewSerial: number;

  @Column('varchar', { length: 20, name: 'sale_order', nullable: false })
  saleOrder: string;
}