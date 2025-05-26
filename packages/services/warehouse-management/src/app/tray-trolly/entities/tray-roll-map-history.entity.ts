import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { CurrentPalletLocationEnum, CurrentPalletStateEnum, PalletBehaviourEnum, PalletBinStatusEnum, PreferredStorageMaterialEnum } from "@xpparel/shared-models";

@Entity('tray_roll_map_history')
export class TrayRollMapHistoryEntity extends AbstractEntity {

    @Column('int', {
        name: 'item_lines_id',
        nullable:false,
        comment: "The roll id. PK of the ph_item_lines"
    })
    itemLinesId: number; // The roll id

    @Column('int', {
        name: 'from_tray_id',
        nullable:false,
        comment: "The PK of the tray id l_tray"
    })
    fromTrayId: number;

    @Column('int', {
        name: 'to_tray_id',
        nullable:false,
        comment: "The PK of the tray id l_tray"
    })
    toTrayId: number;

    @Column('int', {
        name: 'pack_list_id',
        nullable:false,
        comment: "The PK of the packlist packing_list_header"
    })
    packListId: number;

    @Column('varchar', {
        name: 'moved_by',
        nullable:false,
        length: 20
    })
    movedBy: string;
}

