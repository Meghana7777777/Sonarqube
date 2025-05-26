

import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

// not used ATM
@Entity('d_set_sub_item_attr')
export class DSetSubItemAttrEntity {

    @PrimaryGeneratedColumn({
        name: 'id'
    })
    id: number

    @Column("bigint", { name: "d_set_item_id", nullable: false, comment: 'The set item PK' })
    dSetItemId: number;

    @Column("bigint", { name: "d_set_id", nullable: false, comment: 'The set PK' })
    dSetId: number;

    // Please note we dont maintain the dSetSubItem id here as a ref to improve speed of insertions
    @Column("varchar", { length: '12', name: "d_set_sub_item_ref_id", nullable: false, comment: 'The ref_id column in d_set_sub_item (The PK of the adb shade)' })
    dSetSubItemRefId: number;

    // export enum DSetSubItemAttrEnum {
    //     SZ = 'l1', // size
    //     SHD = 'l2', //  shade of bundle
    //     BNO = 'l3', // bundle no
    //     COL = 'lm1', // fg color
    // }

    // size
    @Column("varchar", { length: "20", name: 'l1', nullable: true, comment: 'The size ' })
    l1: string;
        
    // sahde of the bundle
    @Column("varchar", { length: "20", name: 'l2', nullable: true, comment: 'The shade ' })
    l2: string;

    // bundle no
    @Column("varchar", { length: "20", name: 'l3', nullable: true, comment: 'The bundle no ' })
    l3: string;

    // not used ATM
    @Column("varchar", { length: "20", name: 'l4', nullable: true, comment: 'NOT USED' })
    l4: string;
    
    // not used ATM
    @Column("varchar", { length: "20", name: 'l5', nullable: true, comment: 'NOT USED' })
    l5: string;

    @Column("varchar", { length: "40", name: 'lm1', nullable: true, comment: 'The color' })
    lm1: string;

    @Column("varchar", { length: "40", name: 'lm2', nullable: true, comment: 'NOT USED' })
    lm2: string;
    
}