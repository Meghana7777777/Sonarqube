import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { CurrentPalletLocationEnum, CurrentPalletStateEnum, PalletBehaviourEnum, PreferredStorageMaterialEnum } from "@xpparel/shared-models";

@Entity('l_pallet')
export class LPalletEntity extends AbstractEntity {

    @Column('varchar', {
        name: 'pallet_name',
        length:20,
        nullable:false,
    })
    palletName: string

    @Column('int', {
        name: 'max_items',
        nullable:false,
    })
    maxItems: number;

    @Column('varchar', {
        name: 'pallet_code',
        length:50,
        nullable:false,
    })
    palletCode: string

    @Column('int', {
        name: 'fabric_capacity',
        nullable:false,
    })
    fabricCapacity: number

    @Column('varchar', {
        name: 'fabric_uom',
        length:50,
        nullable:false,
    })
    fabricUom: string

    @Column('varchar', {
        name: 'weight_capacity',
        length:50,
        nullable:false,
    })
    weightCapacity: string

    @Column('varchar', {
        name: 'weight_uom',
        length:50,
        nullable:false,
    })
    weightUom: string

    @Column('varchar', {
        name: 'current_bin_id',
        length:50,
        nullable:false,
    })
    currentBinId: string

    @Column('enum', {
        name: 'current_pallet_state',
        enum: CurrentPalletStateEnum
    })
    currentPalletState: CurrentPalletStateEnum

    @Column('enum', {
        name: 'current_pallet_location',
        enum: CurrentPalletLocationEnum,
        default: CurrentPalletLocationEnum.NONE
    })
    currentPalletLocation: CurrentPalletLocationEnum

    @Column('enum', {
        name: 'pallet_beahvior',
        enum: PalletBehaviourEnum
    })
    palletBeahvior: PalletBehaviourEnum
    

    @Column('varchar', {
        name: 'freeze_status',
        length:50,
        nullable:false,
    })
    freezeStatus: string;
    
    @Column('varchar', {
        name: 'barcode_id',
        length:50,
        nullable:false,
    })
    barcodeId: string

    
}
