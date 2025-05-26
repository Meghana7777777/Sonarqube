import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { CurrentPalletLocationEnum, CurrentPalletStateEnum, PalletBehaviourEnum, PalletBinStatusEnum, PreferredStorageMaterialEnum } from "@xpparel/shared-models";

@Entity('trolley_bin_map_history')
export class TrolleyBinMapHistoryEntity extends AbstractEntity {

    @Column('int', {
        name: 'trolley_id',
        nullable: false,
        comment: "The trolley id. PK of the l_trolly"
    })
    trolleyId: number; // The trolley id

    @Column('int', {
        name: 'from_bin_id',
        nullable: false,
        comment: "The PK of the l_bin"
    })
    fromBinId: number;

    @Column('int', {
        name: 'to_bin_id',
        nullable: false,
        comment: "The PK of the l_bin"
    })
    toBinId: number;

    @Column('varchar', {
        name: 'moved_by',
        nullable:false,
        length: 20
    })
    movedBy: string
    
}





