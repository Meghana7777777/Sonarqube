import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { CutStatusEnum, DocBundleGenerationStatusEnum, DocConfirmationStatusEnum, LayingStatusEnum, TaskStatusEnum, WhAckEnum } from "@xpparel/shared-models";

// Primary KEY: poSerial + id
// KEY: po + poDocketLayId + poDbNumber
// KEY: po + docketNumber + poDbNumber
@Entity('po_adb')
export class PoAdbEntity extends AbstractEntity {

    // Ref key of the po serial
    @Column("bigint", { name: "po_serial", nullable: false, comment: '' })
    poSerial: number;

    // The ref key of the po_docket_lay
    @Column("bigint", { name: "po_docket_lay_id", nullable: false, comment: 'The reference key of po_docket_lay' })
    poDocketLayId: number;

    @Column("bigint", { name: "docket_number", nullable: false, comment: 'The docket number' })
    docketNumber: string;

    @Column("varchar", { name: "size", nullable: false, comment: 'The size of the docket bundle' })
    size: string;

    @Column("smallint", { name: "po_db_number", nullable: false, comment: 'The docket bundle number' })
    poDbNumber: number;

    // This is an increment number under a docket + docket bundle. 1 lay for a DocBundle will only have 1 poAdbNumber
    @Column("smallint", { name: "po_adb_number", nullable: false, comment: 'The actual docket bundle number' })
    poAdbNumber: number;

    // The ADB number auto incremented under 1 laying of the PO. Diff layings can have the same under lay ADB number
    @Column("mediumint", { name: "under_lay_adb_number", nullable: false, comment: 'The ADB number auto incremented under 1 laying of the PO. Diff layings can have the same under lay ADB number' })
    underLayAdbNumber: number;

    @Column("smallint", { name: "act_bundle_qty", nullable: false, comment: 'actual cut qty of the bundle' })
    actBundleqty: number;

    // @Column("int", { name: "panel_start_number", nullable: true, default: 0, comment: '' })
    // panelStartNumber: number;

    // @Column("int", { name: "panel_end_number", nullable: true, default: 0, comment: '' })
    // panelEndNumber: number;

    // @Column("int", { name: "fg_start_number", nullable: true, default: 0, comment: '' })
    // fgStartNumber: number;

    // @Column("int", { name: "fg_end_number", nullable: true, default: 0, comment: '' })
    // fgEndNumber: number;

    // B9999999-99999
    // Barcode: doc bundle prefix + HEX(laying id) + under laying adb number 
    @Column("varchar", { length: 18, name: "barcode", nullable: true, comment: 'format: doc bundle prefix + HEX(laying id) + under lay adb number  ' })
    barcode: string;
}

