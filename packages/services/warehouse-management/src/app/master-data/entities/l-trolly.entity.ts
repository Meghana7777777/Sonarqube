import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { CurrentPalletLocationEnum, CurrentPalletStateEnum, PalletBehaviourEnum, PreferredStorageMaterialEnum } from "@xpparel/shared-models";

@Entity('l_trolley')
export class LTrolleyEntity extends AbstractEntity {

    @Column('varchar', {
        name: 'name',
        length:20,
        nullable:false,
    })
    name: string

    @Column('varchar', {
        name: 'code',
        length:50,
        nullable:false,
    })
    code: string

    @Column('varchar', {
        name: 'barcode',
        length: 20,
        nullable: false,
    })
    barcode: string;
    
    @Column('varchar', {
        name: 'capacity',
        length:50,
        nullable:false,
    })
    capacity: string

    @Column('varchar', {
        name: 'uom',
        length:50,
        nullable:false,
    })
    uom: string

    @Column('varchar', {
        name: 'l_bin_id',
        length:50,
        nullable:false,
        comment: "this is the BIN where the trolley alwyas belongs to (MASTER BIN).This can be anywhere but SPOC is this specific BIN"
    })
    binId: string; // this is the BIN where the trolley alwyas belongs to. (MASTER BIN).This can be anywhere but SPOC is this specific BIN

   
    
}
