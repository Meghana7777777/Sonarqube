

import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";

@Entity('po_cut')
export class PoCutEntity extends AbstractEntity {

    // Ref key of the po serial
    @Column("bigint", { name: "po_serial", nullable: false, comment: 'The ref key of the PO' })
    poSerial: number;
  
    @Column("varchar", { length: 50, name: "product_name", nullable: false, comment: '' })
    productName: string;

    @Column("varchar", { length: 50, name: "fg_color", nullable: false, comment: '' })
    fgColor: string;

    @Column("varchar", { length: 40, name: "product_type", nullable: false, comment: '' })
    productType: string;

    @Column("varchar", { length: 20, name: "ref_docket_number", nullable: false, comment: 'The main docket number' })
    refDocketNumber: string;

    @Column("boolean", { name: "is_main_cut", nullable: false, comment: 'If the cut is created for main docket as ref then it will be true. else false' })
    isMainCut: boolean;

    @Column("smallint", { name: "cut_number", nullable: false, comment: 'The cut number under a PO' })
    cutNumber: number;

    @Column("smallint", { name: "cut_sub_number", nullable: false, comment: 'The cut number under a PO + product name' })
    cutSubNumber: number;
}