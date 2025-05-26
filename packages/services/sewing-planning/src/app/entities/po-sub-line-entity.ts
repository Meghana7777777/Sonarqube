import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ProcessTypeEnum } from "@xpparel/shared-models";
import { AbstractEntity } from "../../database/common-entities";

@Entity('po_sub_line')
export class PoSubLineEntity extends AbstractEntity {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column('bigint', { name: 'processing_serial', nullable: false })
    processingSerial: number;

    @Column('varchar', { name: 'fg_color', length: 20, nullable: false })
    fgColor: string;
    
    @Column('varchar', { name: 'size', length: 20, nullable: false })
    size: string;

    @Column('int', { name: 'quantity' })
    quantity: number;

    @Column('bigint', { name: 'mo_product_sub_line_id', nullable: false })
    moProductSubLineId: number;

    // refrence column - externalRefNo1 column from oms - mo_product_sub_line table
    @Column('varchar', { name: 'mo_sub_line_ref_no', length: 20, nullable: true })
    moSubLineRefNo: string;

    @Column('varchar', { name: 'product_ref', length: 15, nullable: false })
    productRef: string;

    @Column('bigint', { name: 'po_line_id', nullable: false })
    poLineId: number;

    @Column('varchar', { name: 'style_code', length: 50, nullable: false })
    styleCode: string; //NOTE : style code column added temporarily to support job generation

    @Column('varchar', { name: 'product_code', length: 50, nullable: false })
    productCode: string; //NOTE : style code column added temporarily to support job generation

    @Column('varchar', { name: 'product_name', length: 50, nullable: false })
    productName: string;  //NOTE : style code column added temporarily to support job generation

    @Column('varchar', { name: 'product_type', length: 50, nullable: false })
    productType: string; //NOTE : style code column added temporarily to support job generation
}
