import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";

@Entity('s_request_item_attr')
export class SRequestItemAttrEntity extends AbstractEntity {

    @Column("bigint", { name: "s_request_id", nullable: false, comment: 'PK of the s_request' })
    sRequestId: number;

    @Column("bigint", { name: "s_request_item_id", nullable: false, comment: 'PK of the s_request_item' })
    sRequestItemId: number;


    // export enum PkShippingRequestItemAttrEnum {
    //     TOT_CTN = 'li1', // total cartons
    //     TOT_QTY = 'li2', // total FGs
    //     DEL_DATE = 'lm1', 
    //     DEST = 'lm2',
    //     BUYER = 'lm3',
    //     STYLES = 'lt1'
    // }

    // total cartons for the DSet
    @Column("numeric", { name: "li1", nullable: false, comment: 'The total cartons under dset' })
    li1: number;

    // total FGs of the DSet
    @Column("numeric", { name: "li2", nullable: true, comment: 'The total FGs under dset' })
    li2: number;

    // NOT USED
    @Column("numeric", { name: "li3", nullable: true, comment: 'NOT USED' })
    li3: string;

    // MO NO
    @Column("varchar", { length: "20", name: "l1", nullable: true, comment: 'Currenlty MO NO' })
    l1: string;

    // VPO NO
    @Column("varchar", { length: "20", name: "l2", nullable: true, comment: 'Currenlty VPO NO' })
    l2: string;

    // CO NO
    @Column("varchar", { length: "20", name: "l3", nullable: true, comment: 'Currently CO NO' })
    l3: string;
        
    // del dates
    @Column("varchar", { length: "40", name: "lm1", nullable: true, comment: 'The csv of delivery dates' })
    lm1: string;

    // destinations
    @Column('text', { name: "lm2", nullable: true, comment: 'The csv of destinations' })
    lm2: string;

    // buyers
    @Column("varchar", { length: "40", name: "lm3", nullable: true, comment: 'The csv of buyers' })
    lm3: string;

    // styles
    @Column("text", { name: "lt1", nullable: true, comment: 'EXT styles in csv' })
    lt1: string;

    // null
    @Column("text", { name: "lt2", nullable: true, comment: 'null' })
    lt2: string;
}