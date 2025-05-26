

import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { DocBundleGenerationStatusEnum, DocConfirmationStatusEnum } from "@xpparel/shared-models";

@Entity('po_cut_docket')
export class PoCutDocketEntity extends AbstractEntity {

    // Ref key of the po serial
    @Column("bigint", { name: "po_serial", nullable: false, comment: 'The ref id of the PO' })
    poSerial: number;

    @Column("smallint", { name: "cut_number", nullable: false, comment: 'The cut number under a PO' })
    cutNumber: number;

    @Column("varchar", { length: "15", name: "docket_number", nullable: false, comment: 'The docket number under a PO' })
    docketNumber: string;

    @Column("smallint", { name: "cut_sub_number", nullable: false, comment: 'The cut number under a PO + product name' })
    cutSubNumber: number;

}