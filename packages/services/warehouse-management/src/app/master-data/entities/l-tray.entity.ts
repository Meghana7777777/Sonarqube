import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { CurrentPalletLocationEnum, CurrentPalletStateEnum, PalletBehaviourEnum, PreferredStorageMaterialEnum } from "@xpparel/shared-models";

@Entity('l_tray')
export class LTrayEntity extends AbstractEntity {

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
    code: string;

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
        name: 'l_trolly_id',
        length:50,
        nullable:false,
        comment: "usually this is the default Trolley ID in which the tray belongs to (A Master Trolley). The tray can be anywhere but the SPOC is this trolley"
    })
    trollyId: string; // usually this is the default Trolley ID in which the tray belongs to (A Master Trolley). The tray can be anywhere but the SPOC is this trolley
   
    @Column('varchar', {
        name: 'length',
        length:50,
        nullable:false,
    })
    length: string

    @Column('varchar', {
        name: 'width',
        length:50,
        nullable:false,
    })
    width: string

    @Column('varchar', {
        name: 'height',
        length:50,
        nullable:false,
    })
    height: string
   
    
}
