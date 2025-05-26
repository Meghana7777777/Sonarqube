import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { CurrentPalletLocationEnum, CurrentPalletStateEnum, PalletBehaviourEnum, PalletBinStatusEnum, PreferredStorageMaterialEnum } from "@xpparel/shared-models";

@Entity('trolley_bin_map')
export class TrolleyBinMapEntity extends AbstractEntity {

    @Column('int', {
        name: 'trolley_id',
        nullable:false,
        comment: "The trolley id. PK of thfe l_trolly"
    })
    trolleyId: number; // The trolley id

    @Column('int', {
        name: 'rack_id',
        nullable:false,
        comment: "The PK of the l_rack"
    })
    rackId: number;

    @Column('int', {
        name: 'bin_id',
        nullable:false,
        comment: "The PK of the l_bin"
    })
    binId: number;
    
}





