import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { CurrentPalletLocationEnum, CurrentPalletStateEnum, PalletBehaviourEnum, PalletBinStatusEnum, PreferredStorageMaterialEnum } from "@xpparel/shared-models";

@Entity('pallet_roll_map')
export class PalletRollMapEntity extends AbstractEntity {

    @Column('int', {
        name: 'item_lines_id',
        nullable:false,
    })
    itemLinesId: number;

    @Column('int', {
        name: 'suggested_pallet_id',
        nullable:false,
    })
    suggestedPalletId: number;

    @Column('int', {
        name: 'confirmed_pallet_id',
        nullable:false,
    })
    confirmedPalletId: number;

    @Column('enum', {
        name: 'status',
        enum: PalletBinStatusEnum
    })
    status: PalletBinStatusEnum;

    @Column('int', {
        name: 'pack_list_id',
        nullable: false
    })
    packListId: number;
    
}





