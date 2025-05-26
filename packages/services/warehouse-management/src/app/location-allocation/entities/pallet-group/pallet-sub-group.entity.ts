import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../../database/common-entities";
import { CurrentPalletLocationEnum, CurrentPalletStateEnum, PalletBehaviourEnum, PalletBinStatusEnum, PalletGroupTypeEnum, PreferredStorageMaterialEnum } from "@xpparel/shared-models";

@Entity('pallet_sub_group')
export class PalletSubGroupEntity extends AbstractEntity {

    @Column('varchar', {
        name: 'pg_type',
        length: 10,
        nullable:false,
    })
    pgType: PalletGroupTypeEnum;

    @Column('int', {
        name: 'ph_lines_id',
        nullable:false,
    })
    phLinesId: number; // BATCH reference

    @Column('varchar', {
        name: 'shade',
        length: 5,
        nullable:true,
    })
    shade: string;

    @Column('decimal', {
        name: 'width',
        nullable:false,
    })
    width: string;

    @Column('int', {
        name: 'item_count',
        nullable:false,
    })
    itemCount: number;

    @Column('int', {
        name: 'confirmed_pallet_id',
        nullable:true,
    })
    confirmedPalletId: number;
    
    @Column('int', {
        name: 'pack_list_id',
        nullable: false
    })
    packListId: number;
    
    @Column('int', {
        name: 'pg_id',
        nullable:false,
    })
    pgId: number;
}


