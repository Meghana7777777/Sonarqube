
import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { OpCategoryEnum, OpFormEnum, ProcessTypeEnum } from '@xpparel/shared-models';

@Entity('op_sequence')
export class OpSequence extends AbstractEntity {
  
    @Column("varchar", { length: "50", name: "prod_name", nullable: true, comment: '' })
    productName: string;

    @Column("varchar", { length: "50", name: "prod_code", nullable: true, comment: '' })
    productCode: string;

    @Column("varchar", { length: "50", name: "style", nullable: true, comment: '' })
    style: string;

    @Column("varchar", { length: "50", name: "fg_color", nullable: true, comment: '' })
    fgColor: string;

    @Column('varchar', { length: 10, name: 'i_op_Code', nullable: false })
    iOpCode: string;
  
    @Column('varchar', { length: 10, name: 'e_op_code', nullable: false })
    eOpCode: string;
  
    @Column('varchar', { length: 20, name: 'op_name', nullable: false })
    opName: string;

    @Column('varchar', { length: 10, name: 'op_category', nullable: false })
    opCategory: ProcessTypeEnum;

    @Column('varchar', { length: 10, name: 'op_form', nullable: false })
    opForm: OpFormEnum;
  
    @Column('tinyint', { name: 'sequence', default: 0, nullable: false })
    opSequence: number;
  
    @Column('varchar', { name: 'group', nullable: false, length: 10 })
    group: string;
  
    @Column('varchar', { length: 30, name: 'dep_group', nullable: false })
    depGroup: string;
  
    @Column('int', { name: 'smv', default: 0 })
    smv: number;
  
    @Column('text', { name: 'components' })
    componentNames: string;

    @Column('int',{ name: 'op_version_id', nullable: false })
    opVersionId: number;

    @Column('bigint',{ name: 'po_serial', nullable: false })
    poSerial: number;

}