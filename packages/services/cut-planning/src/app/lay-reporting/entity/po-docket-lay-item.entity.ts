import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { CutStatusEnum, DocBundleGenerationStatusEnum, DocConfirmationStatusEnum, LayingInspectionStatusEnum, LayingStatusEnum, TaskStatusEnum, WhAckEnum } from "@xpparel/shared-models";

@Entity('po_docket_lay_item')
export class PoDocketLayItemEntity extends AbstractEntity {

    // Ref key of the po serial
    @Column("bigint", { name: "po_serial", nullable: false, comment: '' })
    poSerial: number;

    // Reference key of the po_docket_lay
    @Column("bigint", { name: "po_docket_lay_id", nullable: false, comment: 'The reference key of po_docket_lay' })
    poDocketLayId: number;

    @Column("varchar", { length: 20, name: "docket_group", nullable: false, comment: 'The docket group as is in the OES' })
    docketGroup: string;

    @Column("bigint", { name: "roll_id", nullable: false, comment: '' })
    rollId: number;

    @Column("varchar", { length: 20, name: "roll_barcode", nullable: false, comment: '' })
    rollBarcode: string;

    // @Column("decimal", { precision: 8, scale: 2,  name: "layed_plies", nullable: false, comment: '' })
    // layedPlies: number;

    @Column("varchar", { length: 5, name: "shade", nullable: false, comment: 'The sahde of the roll' })
    shade: string;

    @Column("smallint", { name: "layed_plies", nullable: false, comment: 'The layed qty in yardage. Mostly plies * mklength' })
    layedPlies: number;

    @Column("decimal", { precision: 8, scale: 2,  name: "end_bits", nullable: false, comment: 'The end bits qty in yardage' })
    endBits: number;

    @Column("decimal", { precision: 8, scale: 2,  name: "damage", nullable: false, comment: 'The damaged qty in yardage' })
    damage: number;

    @Column("decimal", { precision: 8, scale: 2,  name: "shortage", nullable: false, comment: 'The damaged qty in yardage' })
    shortage: number;

    @Column("datetime", {  name: "started_date_time", nullable: true, comment: 'The user entered value of the roll laying start', default: ()=>'NOW()' })
    layStartDateTime: string; // YYYY-MM-DD HH:MM:SS
    
    @Column("datetime", {  name: "completed_date_time", nullable: true, comment: 'The user entered value of the roll laying end', default: ()=>'NOW()'})
    layCompletedDateTime: string; // YYYY-MM-DD HH:MM:SS

    @Column("tinyint", { name: "lay_inspection_status", nullable: false, comment: 'The inspection status of the roll that was layed' })
    layInspectionStatus: LayingInspectionStatusEnum;

    @Column("tinyint",{  name:"sequence",  nullable:true,  comment:''})
    sequence: number;

    @Column("decimal",{  precision:5, scale:2, name:"joints_overlapping",  nullable:true,  comment:''})
    jointsOverlapping: number;

    @Column("tinyint",{  name:"no_of_joints",  nullable:true,  comment:''})
    noOfJoints: number;

    @Column("decimal",{  precision:5, scale:2, name:"remnants_of_other_lay",  nullable:true,  comment:''})
    remnantsOfOtherLay: number;

    @Column("decimal",{  precision:5, scale:2, name:"half_plie_of_pre_roll",  nullable:true,  comment:''})
    halfPlieOfPreRoll: number;

    @Column("decimal",{  precision:5, scale:2, name:"fabric_defects",  nullable:true,  comment:''})
    fabricDefects: number;

    @Column("decimal",{  precision:5, scale:2, name:"usable_remains",  nullable:true,  comment:''})
    usableRemains: number;

    @Column("decimal",{  precision:5, scale:2, name:"un_usable_remains",  nullable:true,  comment:''})
    unUsableRemains: number;

}



