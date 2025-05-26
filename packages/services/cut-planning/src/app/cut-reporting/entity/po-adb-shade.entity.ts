import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { CutStatusEnum, DocBundleGenerationStatusEnum, DocConfirmationStatusEnum, LayingStatusEnum, TaskStatusEnum, WhAckEnum } from "@xpparel/shared-models";

// KEY: po + layingid + podb number
// bundle number: docnumber + doc bundle number + adb number + shade
@Entity('po_adb_shade')
export class PoAdbShadeEntity extends AbstractEntity {

    // Ref key of the po serial
    @Column("bigint", { name: "po_serial", nullable: false, comment: '' })
    poSerial: number;

    @Column("bigint", { name: "po_docket_lay_id", nullable: false, comment: 'The reference key of po_docket_lay' })
    poDocketLayId: number;

    @Column("mediumint", { name: "under_lay_adb_number", nullable: false, comment: 'The ADB number auto incremented under 1 laying of the PO. Diff layings can have the same under lay ADB number' })
    underLayAdbNumber: number;
    
    // This is an increment number under a docket + docket bundle. As many shades we have under a lay reporting +  doc bundle those many bundles we have here
    @Column("smallint", { name: "po_adbs_number", nullable: false, comment: 'The actual docket bundle number' })
    poAdbsNumber: number;

    @Column("smallint", { name: "act_bundle_qty", nullable: false, comment: 'actual cut qty of the bundle ww.r.t the shade' })
    actBundleqty: number;

    @Column("varchar", { length: 2, name: "shade", nullable: false, comment: 'The shade of the bundle' })
    shade: string;

    // B9999999-99999-99
    // Barcode: doc bundle prefix + HEX(laying id) + under laying adb number + poAdbsNumber
    @Column("varchar", { length: 15, name: "barcode", nullable: false, comment: 'format: doc bundle prefix + HEX(laying id) + under laying adb number + poAdbsNumber ' })
    barcode: string;

    @Column("bigint", { name: "docket_number", nullable: true, comment: '', default: null })
    docketNumber: string;
}

