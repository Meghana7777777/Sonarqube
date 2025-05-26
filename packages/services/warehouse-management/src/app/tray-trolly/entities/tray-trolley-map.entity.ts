import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { CurrentPalletLocationEnum, CurrentPalletStateEnum, PalletBehaviourEnum, PalletBinStatusEnum, PreferredStorageMaterialEnum } from "@xpparel/shared-models";

@Entity('tray_trolley_map')
export class TrayTrolleyMapEntity extends AbstractEntity {

    @Column('int', {
        name: 'tray_id',
        nullable:false,
    })
    trayId: number

    // CURRENTLY NOT USED
    @Column('int', {
        name: 'suggested_trolley_id',
        nullable: true,
        comment: "PK of the l_trolley"
    })
    suggestedTrolleyId: number;

    @Column('int', {
        name: 'confirmed_trolley_id',
        nullable:false,
        comment: "PK of the l_trolley"
    })
    confirmedTrolleyId: number;
}
