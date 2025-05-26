import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../../database/common-entities";
import { CurrentPalletLocationEnum, CurrentPalletStateEnum, PalletBehaviourEnum, PalletBinStatusEnum, PalletGroupTypeEnum, PreferredStorageMaterialEnum } from "@xpparel/shared-models";

@Entity('pallet_group')
export class PalletGroupEntity extends AbstractEntity {

    @Column('varchar', {
        name: 'pg_name',
        nullable: false,
        length: 5,
    })
    pgName: string;

    @Column('varchar', {
        name: 'pg_type',
        length: 10,
        nullable:false,
    })
    pgType: PalletGroupTypeEnum;

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
    
}

