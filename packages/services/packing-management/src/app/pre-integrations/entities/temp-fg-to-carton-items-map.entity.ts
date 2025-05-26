import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('pkms_temp_fg_to_carton_items_map')
export class TempFGToCartonItemsMapEntity {
    @PrimaryGeneratedColumn({
        name: 'id'
    })
    id: number;

    @Column("bigint", { name: "crt_id", nullable: false, comment: '' })
    crtId: number;

    @Column("bigint", { name: "osl_id", nullable: false, comment: 'external osl ref id' })
    oslId: number;

    @Column("bigint", { name: "psl_id", nullable: false, comment: 'pack sub line id' })
    pslId: number;

    @Column("bigint", { name: "carton_item_id", nullable: false })
    cartonItemId: number;

    @Column('varchar', { name: 'fg_barcode', length: 20, nullable: false })
    fgBarcode: string;

}