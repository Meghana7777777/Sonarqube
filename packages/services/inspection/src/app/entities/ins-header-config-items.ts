import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity('ins_config_items')
export class InsConfigItemsEntity {
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;
    @Column('bigint', { name: 'pl_ref_id', comment: 'Pk of pack-list' })
    plRefId: number;

    @Column('bigint', { name: 'header_ref_id', comment: 'Pk of header ref id' })
    headerRef: number;

    @Column('bigint', { name: 'ins_item_id', comment: 'pk of the inspection items' })
    insItemId: number;

    @Column('varchar', { name: 'ins_item_barcode', comment: 'barcode inspection' })
    insItemBarcode: string;

}