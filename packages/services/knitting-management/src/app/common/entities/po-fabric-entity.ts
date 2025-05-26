import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { ProcessTypeEnum } from "@xpparel/shared-models";

@Entity('po_fabric')
export class PoFabricEntity extends AbstractEntity {
    @PrimaryGeneratedColumn({ name: 'id' }) // Auto-incrementing primary key
    id: number;

    @Column('varchar', { name: 'item_code', length: 50, nullable: false })
    itemCode: string;

    @Column('varchar', { name: 'item_name', length: 200, nullable: false })
    itemName: string;

    @Column('varchar', { name: 'item_desc', length: 200, nullable: true })
    itemDesc: string;

    @Column('varchar', { name: 'item_type', length: 15, nullable: false })
    itemType: string;

    @Column('varchar', { name: 'item_sub_type', length: 15, nullable: true })
    itemSubType: string;

    @Column('varchar', { name: 'item_color', length: 20, nullable: true })
    itemColor: string;

    @Column('varchar', { name: 'item_uom', length: 10, nullable: true })
    itemUom: string;

    @Column('int', { name: 'sequence', nullable: true })
    sequence: number;

    @Column('bigint', { name: 'processing_serial', nullable: false })
    processingSerial: number;

    @Column('varchar', { name: 'process_type', length: 25, nullable: false })
    processType: ProcessTypeEnum;

    @Column('varchar', { name: 'product_ref', length: 15, nullable: false })
    productRef: string;
}
