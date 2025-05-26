import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { AbstractEntity } from "../../../../database/common-entities";
import { FabricUOM, PreferredFGStorageMaterialEnum } from "@xpparel/shared-models";
import { FGMWareHouseEntity } from "../../warehouse-masters/entities/fg-m-warehouse.entity";

@Entity('fg_m_rack')
export class FgMRackEntity extends AbstractEntity {
    @Column('varchar', {
        name: 'name',
        length: 20,
        nullable: false,
    })
    name: string

    @Column('varchar', {
        name: 'code',
        length: 20,
        nullable: false,
    })
    code: string

    @Column('int', {
        name: 'levels',
        nullable: false,
    })
    levels: number

    @Column('int', {
        name: 'floor',
        nullable: false,
    })
    floor: number

    @Column("decimal", { precision: 8, scale: 2,
        name: 'weight_capacity',
        nullable: false,
    })
    weightCapacity: number

    @Column('varchar', {
        name: 'weight_uom',
        length: 50,
        nullable: false,
    })
    weightUom: string

    @Column('int', {
        name: 'columns',
        nullable: false,
    })
    columns: number

    @Column('enum', {
        name: 'preferred_storage_material',
        enum: PreferredFGStorageMaterialEnum
    })
    preferredStorageMaterial: PreferredFGStorageMaterialEnum

    @Column('int', {
        name: 'priority',
        nullable: false,
    })
    priority: number;


    @Column('boolean', {
        nullable: true,
        default: false,
        name: 'create_locations',
    })
    createLocations: boolean;



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

    @Column('enum', {
        name: 'length_uom',
        enum: FabricUOM,
        nullable: false,
    })
    lengthUom: FabricUOM

    @Column('int', {
        name: 'width',
        nullable: false,
    })
    width: number


    @Column('enum', {
        name: 'width_uom',
        enum: FabricUOM,
        nullable: false,
    })
    widthUom: FabricUOM


    @Column('int', {
        name: 'height',
        nullable: false,
    })
    height: number

    @Column('enum', {
        name: 'height_uom',
        enum: FabricUOM,
        nullable: false,
    })
    heightUom: FabricUOM

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

    @Column('int', {
        name: 'wh_id',
        nullable: false,
    })
    whId: number;
}

