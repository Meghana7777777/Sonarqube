

import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


// This is a linear table with 16 attribute columns
// 12 - small lenght of 20
// 2 - mid lenght of 40
// 2 - text columns
@Entity('d_set_item_attr')
export class DSetItemAttrEntity {

    @PrimaryGeneratedColumn({
        name: 'id'
    })
    id: number;

    @Column("bigint", { name: "d_set_item_id", nullable: false, comment: 'The set item  id for  dispatch' })
    dSetItemId: number;

    @Column("bigint", { name: "d_set_id", nullable: false, comment: 'The set id for  dispatch' })
    dSetId: number;

    // export enum DSetItemAttrEnum {
    //     MO = 'l1', // mo number
    //     PSTREF = 'lm1', // plant style REF
    //     CO = 'l3', // customer order no
    //     VPO = 'l4', // vendor purchase no
    //     PNM = 'lm2', // product name
    //     DDT = 'l8', // delivery date
    //     DEST = 'l5', // destination
    //     STY = 'l2', // the style 
    //     BUY = 'lm4'
    // }

    // mo number
    @Column("varchar", { length: "20", name: 'l1', nullable: true, comment: 'The mo number ' })
    l1: string;
    
    // the style
    @Column("varchar", { length: "20", name: "l2", nullable: true, comment: 'Tha actual style from EXT System' })
    l2: string;

    // customer order no
    @Column("varchar", { length: "20", name: 'l3', nullable: true, comment: 'The customer order number ' })
    l3: string;

    // vendor purchase no
    @Column("varchar", { length: "20", name: 'l4', nullable: true, comment: 'The vendor order number ' })
    l4: string;
    
    // null
    @Column("varchar", { length: "20", name: 'l5', nullable: true, comment: 'null' })
    l5: string;
    
    // null
    @Column("varchar", { length: "20", name: 'l6', nullable: true, comment: 'null' })
    l6: string;
    
    // null
    @Column("varchar", { length: "20", name: 'l7', nullable: true, comment: 'null ATM' })
    l7: string;
    
    // null
    @Column("varchar", { length: "20", name: 'l8', nullable: true, comment: 'null ATM' })
    l8: string;
    
    // null
    @Column("varchar", { length: "20", name: 'l9', nullable: true, comment: 'null ATM' })
    l9: string;
    
    // null
    @Column("varchar", { length: "20", name: "l10", nullable: true, comment: 'null' })
    l10: string;

    // not used ATM
    @Column("varchar", { length: "20", name: "l11", nullable: true, comment: 'NOT USED' })
    l11: string;

    // not used ATM
    @Column("varchar", { length: "20", name: "l12", nullable: true, comment: 'NOT USED' })
    l12: string;
        
    // Plant style refs
    @Column("varchar", { length: "40", name: "lm1", nullable: true, comment:  'Plant style ref'  })
    lm1: string;
    
    // destinations
    @Column("varchar", { length: "40", name: "lm2", nullable: true, comment: 'destinations' })
    lm2: string;

    // delivery dates
    @Column('text', {   name: "lm3", nullable: true, comment:  'delivery dates'  })
    lm3: string;
    
    // buyers
    @Column("varchar", { length: "40", name: "lm4", nullable: true, comment: 'Buyers' })
    lm4: string;

    // Product names
    @Column("text", { name: "lt1", nullable: true, comment: 'The components in CSV ' })
    lt1: string;
    
    // mo lines
    @Column("text", { name: "lt2", nullable: true, comment: 'The mo lines ' })
    lt2: string;
}