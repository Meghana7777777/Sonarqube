
import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { OpCategoryEnum, OpFormEnum } from '@xpparel/shared-models';

@Entity('op_version')
export class OpVersion extends AbstractEntity {
  
    @Column('varchar', { length: 20, name: 'version', nullable: false })
    version: string;
  
    @Column('varchar', { length: 30, name: 'description', nullable: false })
    description: string;
  
    @Column('bigint',{ name: 'po_serial', nullable: false })
    poSerial: number;

    @Column('varchar', { length: 30, name: 'product_name', nullable: false })
    productName: string;

    @Column("varchar", { length: "50", name: "prod_code", nullable: true, comment: '' })
    productCode: string;

    @Column("varchar", { length: "50", name: "style", nullable: true, comment: '' })
    style: string;

    @Column("varchar", { length: "50", name: "fg_color", nullable: true, comment: '' })
    fgColor: string;
}