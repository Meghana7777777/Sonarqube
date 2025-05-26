import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";

@Entity('ins_config_items')
export class InsConfigItemsEntity extends AbstractEntity { 
    
    @Column('bigint', { name: 'pl_ref_id', comment: 'Pk of pack-list', nullable: true })
    plRefId: number;

    @Column('bigint', { name: 'header_ref_id', comment: 'Pk of header ref id', nullable: true })
    headerRef: number;

    @Column('bigint', { name: 'ins_item_id', comment: 'pk of the inspection items' })
    insItemId: number;

    @Column('varchar', { name: 'ins_item_barcode', comment: 'barcode inspection' })
    insItemBarcode: string;

}