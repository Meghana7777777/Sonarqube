

import { DSetItemAttrEnum } from "@xpparel/shared-models";
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
    //     MO = 'l1', // Mo number
    //     PSTREF = 'lm1', // plant style REF
    //     CO = 'l3', // customer order no
    //     VPO = 'l4', // vendor purchase no
    //     PNM = 'lm2', // product name
    //     CNO = 'l6', // cut no
    //     CSNO = 'l7', // cut sub number
    //     DDT = 'l8', // delivery date
    //     DEST = 'l5', // destination
    //     STY = 'l2', // the style 
    //     COMPS = 'lt1', // csv of components
    //     MOL = 'lt2', // csv of Mo lines
    //     COL = 'l9' // color of the  item
    //     LIDS = 'l10' // lay ids of the main dockets
    // }

    // Mo number
    @Column("varchar", { length: "20", name: 'l1', nullable: true, comment: 'The Mo number ' })
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
    
    // destination
    @Column("varchar", { length: "20", name: 'l5', nullable: true, comment: 'The destination' })
    l5: string;
    
    // cut no
    @Column("varchar", { length: "20", name: 'l6', nullable: true, comment: 'The cut number ' })
    l6: string;
    
    // cut sub number
    @Column("varchar", { length: "20", name: 'l7', nullable: true, comment: 'The cut sub number ' })
    l7: string;
    
    // del date
    @Column("varchar", { length: "20", name: 'l8', nullable: true, comment: 'The del date ' })
    l8: string;
    
    // color
    @Column("varchar", { length: "20", name: 'l9', nullable: true, comment: 'The color' })
    l9: string;
    
    // CSV of lay ids of the main docket
    @Column("varchar", { length: "20", name: "l10", nullable: true, comment: 'CSV of lay ids of the main docket' })
    l10: string;

    // not used ATM
    @Column("varchar", { length: "20", name: "l11", nullable: true, comment: 'NOT USED' })
    l11: string;

    // not used ATM
    @Column("varchar", { length: "20", name: "l12", nullable: true, comment: 'NOT USED' })
    l12: string;
        
    // Plant style ref
    @Column("varchar", { length: "40", name: "lm1", nullable: true, comment:  'Plant style ref'  })
    lm1: string;
    
    // Product name
    @Column("varchar", { length: "40", name: "lm2", nullable: true, comment: 'Product name' })
    lm2: string;

    // not used ATM
    @Column("varchar", { length: "40", name: "lm3", nullable: true, comment:  'NOT USED'  })
    lm3: string;
    
    // not used ATM
    @Column("varchar", { length: "40", name: "lm4", nullable: true, comment: 'NOT USED' })
    lm4: string;

    // components
    @Column("text", { name: "lt1", nullable: true, comment: 'The compoents in CSV ' })
    lt1: string;
    
    // Mo lines
    @Column("text", { name: "lt2", nullable: true, comment: 'The mo lines ' })
    lt2: string;

    
}