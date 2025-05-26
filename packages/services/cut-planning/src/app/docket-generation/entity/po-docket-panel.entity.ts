import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";

// Dont maintain any foreign keys. Only maintain reference keys for optimal performance
@Entity('po_docket_panel')
export class PoDocketPanelEntity extends AbstractEntity {

    @Column("bigint", { name: "po_serial", nullable: false, comment: '' })
    poSerial: number;

    @Column("varchar", { length: 20, name: "docket_number", nullable: true, comment: '' })
    docketNumber: string;

    @Column("int", {name: "bundle_number", nullable: true, comment: '' })
    bundleNumber: number;
  
    @Column("bigint", { name: "panel_number", nullable: false, comment: '' })
    panelNumber: number;

    @Column("varchar", { length: '20', name: "size", nullable: false, comment: '' })
    size: string;

    @Column("varchar", { length: '20', name: "component", nullable: false, comment: '' })
    component: string;

    @Column("boolean", { name: "cut_reported", nullable: false, default: false, comment: '' })
    cutReported: boolean;

    @Column("bigint", { name: "psl_id", nullable: false,  comment: 'The PSL Id in oms. Will be inserted at the time of panel creation'})
    pslId: number;

    // useful for a bulk retrieval of panels under a docket + laying 
    @Column("smallint", { name: "under_doc_lay_number", nullable: false, default: 0, comment: 'Lay number is the seq of the lay under a docket' })
    underDocLayNumber: number;

    // adb number is the adb number as in the po-docket-actual-bundle
    @Column("smallint", { name: "adb_number", nullable: false, default: 0, comment: 'Adb number is the adb number as in the po-docket-actual-bundle' })
    adbNumber: number;

    // Reference key for the adb roll entity
    @Column("bigint", { name: "adb_roll_id", nullable: false, default: 0, comment: 'Reference key for the adb roll entity' })
    adbRollId: number;

    @Column("bigint", { name: "confirmation_id", nullable: false,  comment: 'A random confirmation id just to keep a track of the panels under a specific confirmation id'})
    confirmationId: number;

    @Column("boolean", { name: "bundled", nullable: false, default: false, comment: 'turns to true' })
    bundled: boolean;

    @Column({ type: 'varchar', name: 'pb_number', length: 25, nullable: false })
    pbNumber: string;

    @Column({ type: 'varchar', name: 'ab_number', length: 25, nullable: false })
    abNumber: string;
}
