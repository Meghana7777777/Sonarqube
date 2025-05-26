import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { PackingListEntity } from "./packing-list.entity";
import { PhItemsEntity } from "./ph-items.entity";

@Entity('ph_lines')
export class PhLinesEntity extends AbstractEntity {
    
    @Column('varchar', {
        name: 'lot_number',
    })
    lotNumber: string;

    @Column('varchar', {
        name: 'batch_number',
    })
    batchNumber: string;

    @Column('varchar', {
        name: 'invoice_number',
        default: null
    })
    invoiceNumber: string;

    @Column('varchar', {
        name: 'invoice_date',
        default: null
    })
    invoiceDate: string;

    @Column('varchar', {
        name: 'delivery_date',
        default: null
    })
    deliveryDate: string;

    @ManyToOne(type => PackingListEntity, packingHeader => packingHeader.phLineInfo, { nullable: false })
    @JoinColumn({ name: "ph_id" })
    packHeaderId: PackingListEntity | null;

    // TODO
    @OneToMany(type => PhItemsEntity, phItems => phItems.phLinesId, { nullable: false, cascade: true })
    phItemInfo: PhItemsEntity[];

}