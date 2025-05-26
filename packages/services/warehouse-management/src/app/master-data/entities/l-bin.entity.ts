import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { PreferredStorageMaterialEnum } from "@xpparel/shared-models";

@Entity('l_bin')
export class LBinEntity extends AbstractEntity {

    @Column('varchar', {
        name: 'bin_name',
        length:20,
        nullable:false,
    })
    name: string

    @Column('varchar', {
        name: 'bin_code',
        length:50,
        nullable:false,
    })
    code: string;

    @Column('int', {
        name: 'supported_pallets_count',
        nullable:false,
    })
    supportedPalletsCount: number;

    @Column('int', {
        name: 'l_rack_id',
        nullable:false,
    })
    lRackId: number;

    @Column('int', {
        name: 'level',
        nullable: false,
    })
    level: number

    @Column('int', {
        name: 'column',
        nullable:false,
    })
    column: number

    @Column('enum', {
        name: 'preffered_storage_material',
        enum: PreferredStorageMaterialEnum
    })
    prefferedStorageMaterial: PreferredStorageMaterialEnum
    
    @Column('varchar', {
        name: 'barcode_id',
        length:50,
        nullable:false,
    })
    barcodeId: string
    
}
