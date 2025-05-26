import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { PreferredStorageMaterialEnum } from "@xpparel/shared-models";



@Entity('l_rack')
export class LRackEntity extends AbstractEntity {
    @Column('varchar', {
        name: 'name',
        length: 20,
        nullable: false,
    })
    name: string

    @Column('varchar', {
        name: 'code',
        length: 50,
        nullable: false,
    })
    code: string

    @Column('int', {
        name: 'levels',
        nullable: false,
    })
    levels: number

    @Column('varchar', {
        name: 'w_code',
        length: 50,
        nullable: false,
    })
    wCode: string

    @Column('int', {
        name: 'columns',
        nullable: false,
    })
    columns: number

    @Column('enum', {
        name: 'preffered_storage_material',
        enum: PreferredStorageMaterialEnum
    })
    prefferedStorageMaterial: PreferredStorageMaterialEnum

    @Column('int', {
        name: 'priority',
        nullable: false,
    })
    priority: number

    @Column('varchar', {
        name: 'barcode_id',
        length: 50,
        nullable: false,
    })
    barcodeId: string

    @Column('int', {
        name: 'capacity_in_mts',
        nullable: false,
    })
    capacityInMts: number
}