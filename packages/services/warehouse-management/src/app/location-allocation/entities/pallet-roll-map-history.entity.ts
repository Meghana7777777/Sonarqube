import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { CurrentPalletLocationEnum, CurrentPalletStateEnum, PalletBehaviourEnum, PalletBinStatusEnum, PreferredStorageMaterialEnum } from "@xpparel/shared-models";

@Entity('pallet_roll_map_history')
export class PalletRollMapHistoryEntity extends AbstractEntity {

    @Column('int', {
        name: 'itme_lines_id',
        nullable:false,
    })
    itemLinesId: number;

    @Column('int', {
        name: 'from_pallet_id',
        nullable:false,
    })
    fromPalletId: number;

    @Column('int', {
        name: 'to_pallet_id',
        nullable:false,
    })
    toPalletId: number;

    @Column('int', {
        name: 'pack_list_id',
        nullable:false,
    })
    packListId: number;

    @Column('varchar', {
        name: 'moved_by',
        nullable:false,
        length: 20
    })
    movedBy: string;
}

