import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { ShippingRequestItemLevelEnum } from "@xpparel/shared-models";

@Entity('s_request_item_attr')
export class SRequestItemAttrEntity extends AbstractEntity {

    @Column("bigint", { name: "s_request_id", nullable: false, comment: 'PK of the s_request' })
    sRequestId: number;

    @Column("bigint", { name: "s_request_item_id", nullable: false, comment: 'PK of the s_request_item' })
    sRequestItemId: number;


    // export enum ShippingRequestItemAttrEnum {
    //     TOT_BUN = 'li1', // mo number
    //     TOT_PAN = 'li2', // plant style REF
    //     MO = 'l1',
    //     CUT_NOS = 'lm1',
    //     CUT_S_NOS = 'lm2',
    //     PNAME = 'lm3',
    //     CON_BARCODES = 'lt1'
    // }

    // total bundles for the DSet .i.e sum of bundles of all cuts under dset
    @Column("numeric", { name: "li1", nullable: false, comment: 'The total bundles for the DSet .i.e sum of bundles of all cuts under dset' })
    li1: number;

    // total shipping qty for the DSet i.e total panels  of all cuts under dset
    @Column("numeric", { name: "li2", nullable: true, comment: 'total shipping qty for the DSet i.e total panels  of all cuts under dset' })
    li2: number;

    // NOT USED
    @Column("numeric", { name: "li3", nullable: true, comment: 'NOT USED' })
    li3: string;

    // mo number
    @Column("varchar", { length: "20", name: "l1", nullable: true, comment: 'The mo number' })
    l1: string;

    // NOT USED
    @Column("varchar", { length: "20", name: "l2", nullable: true, comment: 'NOT USED' })
    l2: string;

    // NOT USED
    @Column("varchar", { length: "20", name: "l3", nullable: true, comment: 'NOT USED' })
    l3: string;
        
    // csv of cut numbers
    @Column("varchar", { length: "40", name: "lm1", nullable: true, comment: 'The csv of cut numbers' })
    lm1: string;

    // csv of cut sub numbers
    @Column("varchar", { length: "40", name: "lm2", nullable: true, comment: 'The csv of cut sub numbers' })
    lm2: string;

    // product name
    @Column("varchar", { length: "40", name: "lm3", nullable: true, comment: 'The product name' })
    lm3: string;

    // container barcodes in csv
    @Column("text", { name: "lt1", nullable: true, comment: 'container barcodes in csv' })
    lt1: string;

    // container numbers in csv
    @Column("text", { name: "lt2", nullable: true, comment: 'container numbers in csv' })
    lt2: string;
}