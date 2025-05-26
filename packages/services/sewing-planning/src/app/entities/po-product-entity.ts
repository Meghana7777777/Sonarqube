import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ProcessTypeEnum } from "@xpparel/shared-models";
import { AbstractEntity } from "../../database/common-entities";

@Entity('po_product')
export class PoProductEntity extends AbstractEntity {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column('bigint', { name: 'processing_serial', nullable: false })
    processingSerial: number;

    @Column('varchar', { name: 'product_code', length: 50, nullable: false })
    productCode: string;

    @Column('varchar', { name: 'product_name', length: 50, nullable: false })
    productName: string;

    @Column('varchar', { name: 'product_type', length: 50, nullable: false })
    productType: string;

    @Column('varchar', { name: 'product_ref', length: 50, nullable: false })
    productRef: string; //SHORT FORM  COMBINATION OF productCode+productName+productType



}