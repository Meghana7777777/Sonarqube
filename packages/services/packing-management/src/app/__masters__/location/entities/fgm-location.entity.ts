import { PreferredFGStorageMaterialEnum } from "@xpparel/shared-models";
import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../../database/common-entities";

@Entity('fg_m_location')
export class FgMLocationEntity extends AbstractEntity {

    @Column('varchar', {
        name: 'location_name',
        length: 20,
        nullable: false,
    })
    name: string

    @Column('varchar', {
        name: 'location_code',
        length: 10,
        nullable: false,
    })
    code: string;

    @Column('int', {
        name: 'supported_pallets_count',
        nullable: false,
    })
    supportedPalletsCount: number;

    // @Column('decimal', { name: 'capacity', precision: 10, scale: 2, nullable: false })
    // eachPalletCapacity: number;

    @Column('int', {
        name: 'rack_id',
        nullable: false,
    })
    rackId: number;

    @Column('int', {
        name: 'wh_id',
        nullable: false,
    })
    whId: number;

    @Column('int', {
        name: 'level',
        nullable: false,
    })
    level: number

    @Column('int', {
        name: 'column',
        nullable: false,
    })
    column: number

    @Column('enum', {
        name: 'preferred_storage_material',
        enum: PreferredFGStorageMaterialEnum
    })
    preferredStorageMaterial: PreferredFGStorageMaterialEnum

    @Column('varchar', {
        name: 'barcode_id',
        length: 50,
        nullable: false,
    })
    barcodeId: string

    @Column('int', {
        name: 'length',
        nullable: false,
    })
    length: number

    @Column('int', {
        name: 'width',
        nullable: false,
    })
    width: number

    @Column('int', {
        name: 'height',
        nullable: false,
    })
    height: number

    @Column('varchar', {
        name: 'latitude',
        nullable: false,
        length: 12
    })
    latitude: string

    @Column('varchar', {
        name: 'longitude',
        nullable: false,
        length: 12
    })
    longitude: string



}
