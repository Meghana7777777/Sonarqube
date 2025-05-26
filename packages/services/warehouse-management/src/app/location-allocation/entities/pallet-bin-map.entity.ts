import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { CurrentPalletLocationEnum, CurrentPalletStateEnum, PalletBehaviourEnum, PalletBinStatusEnum, PreferredStorageMaterialEnum } from "@xpparel/shared-models";

@Entity('pallet_bin_map')
export class PalletBinMapEntity extends AbstractEntity {

    @Column('int', {
        name: 'pallet_id',
        nullable:false,
    })
    palletId: number

    @Column('int', {
        name: 'suggested_bin_id',
        nullable:false,
    })
    suggestedBinId: number;

    @Column('int', {
        name: 'confirmed_bin_id',
        nullable:false,
    })
    confirmedBinId: number;

    @Column('enum', {
        name: 'status',
        enum: PalletBinStatusEnum
    })
    status: PalletBinStatusEnum;
    
}
