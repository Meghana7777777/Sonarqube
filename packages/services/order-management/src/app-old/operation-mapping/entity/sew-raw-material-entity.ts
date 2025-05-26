
import { Column, Entity, ViewColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { InsUomEnum } from '@xpparel/shared-models';

@Entity('sew_raw_material')
export class SewRawMaterial extends AbstractEntity {

    @Column('varchar', { length: 10, name: 'i_op_Code', nullable: false })
    iOpCode: string;


    @Column('varchar', { name: 'Product', length: 15, nullable: false })
    product: string;


    @Column('varchar', { name: 'product_type', nullable: false })
    productType: string;


    @Column('varchar', { name: 'consumption', length: 15, nullable: false })
    consumption: string;


    @Column('varchar', { name: 'uom', nullable: false })
    uom: InsUomEnum;


    @Column('int', { name: 'op_version_id', nullable: false })
    opVersionId: number;


    @Column('int', { name: 'sew_serial', nullable: false })
    sewSerial: number;
} 