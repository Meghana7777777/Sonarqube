import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";

// Dont maintain any foreign keys. Only maintain reference keys for optimal performance
@Entity('po_actual_docket_panel')
export class PoActualDocketPanelEntity extends AbstractEntity {

    @Column("bigint", { name: "po_serial", nullable: false, comment: '' })
    poSerial: number;
  
    @Column("varchar", { length: 20, name: "docket_number", nullable: true, comment: '' })
    docketNumber: string;

    @Column("int", {name: "bundle_number", nullable: true, comment: '' })
    bundleNumber: number;
  
    @Column("int", { name: "panel_number", nullable: false, comment: '' })
    panelNumber: number;

    @Column("int", { name: "fg_number", nullable: false, comment: '' })
    fgNumber: number;

    @Column("varchar", { length: '20', name: "size", nullable: false, comment: '' })
    size: string;

    @Column("varchar", { length: '20', name: "component", nullable: false, comment: '' })
    component: string;

    // useful for a bulk retrieval of panels under a docket + laying 
    @Column("smallint", { name: "under_doc_lay_number", nullable: false, default: 0, comment: 'Lay number is the seq of the lay under a docket' })
    underDoclayNumber: number;

    // adb number is the adb number as in the po-docket-actual-bundle
    @Column("smallint", { name: "adb_number", nullable: false, default: 0, comment: 'Adb number is the adb number as in the po-docket-actual-bundle' })
    adbNumber: number;

    // Reference key for the adb roll entity
    @Column("bigint", { name: "adb_roll_id", nullable: false, default: 0, comment: 'Reference key for the adb roll entity' })
    adbRollId: number;

    // the ref key of the ADB shade entity
    @Column("bigint", { name: "adb_shade_id", nullable: false, comment: 'The reference key of ADB_shade' })
    adbShadeId: number;

    @Column("bigint", { name: "psl_id", nullable: false,  comment: 'The PSL Id in oms. Will be inserted at the time of cut reporting'})
    pslId: number;
}
