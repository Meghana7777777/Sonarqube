import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { CurrentPalletLocationEnum, CurrentPalletStateEnum, PalletBehaviourEnum, PalletBinStatusEnum, PreferredStorageMaterialEnum } from "@xpparel/shared-models";

@Entity('tray_roll_map')
export class TrayRollMapEntity extends AbstractEntity {

    @Column('int', {
        name: 'item_lines_id',
        nullable:false,
        comment: "The roll id. PK of the ph_item_lines"
    })
    itemLinesId: number; // The roll id

    // Currently not utilized
    @Column('int', {
        name: 'suggested_tray_id',
        nullable:true,
        comment: "The suggested tray id for the roll. This is kept for futrue impelementation. currently not utilized"
    })
    suggestedTrayId: number;

    @Column('int', {
        name: 'confirmed_tray_id',
        nullable:false,
        comment: "The PK of the tray id l_tray"
    })
    confirmedTrayId: number;

    @Column('int', {
        name: 'pack_list_id',
        nullable: false,
        comment: "The PK of the packlist packing_list_header"
    })
    packListId: number;
    
}





