import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { CutStatusEnum, DocBundleGenerationStatusEnum, DocConfirmationStatusEnum, LayingStatusEnum, TaskStatusEnum, WhAckEnum } from "@xpparel/shared-models";

@Entity('po_docket_lay')
export class PoDocketLayEntity extends AbstractEntity {

    // Ref key of the po serial
    @Column("bigint", { name: "po_serial", nullable: false, comment: '' })
    poSerial: number;

    // Ref request number
    @Column("varchar", { length: 20, name: "request_number", nullable: false, comment: '' })
    requestNumber: string;

    @Column("varchar", { length: 20, name: "docket_group", nullable: false, comment: 'The docket group as is in the OES' })
    docketGroup: string;

    @Column("smallint", { name: "under_doc_lay_number", nullable: false, comment: 'The lay number is a seq number for a docket. i.e the no of lays' })
    underDocLayNumber: number;

    // This is very helpful while generating the barcodes
    @Column("smallint", { name: "under_po_lay_number", nullable: false, comment: 'The lay number is a seq number for a po. i.e the no of lays' })
    underPolayNumber: number;

    @Column("datetime", {  name: "started_date_time", nullable: false, comment: 'The time at which the user clicked on start lay' })
    layStartDateTime: string; // YYYY-MM-DD HH:MM:SS
    
    @Column("datetime", {  name: "completed_date_time", nullable: true, comment: 'The time at which the user clicked on complete lay' })
    layCompletedDateTime: string; // YYYY-MM-DD HH:MM:SS

    @Column("varchar", { length: 20, name: "lay_inititated_person", nullable: false, comment: 'Person who clicked on the start lay' })
    layInitiatedPerson: string;

    @Column("varchar", { length: 20, name: "lay_inspected_person", nullable: true, comment: 'Person who confirmded the lay for the lay id' })
    layInspectedPerson: string;

    @Column("tinyint", {  name: "laying_status", nullable: false, comment: 'OPEN = 0, INPROG = 1, HOLD = 99 , COMPLETED = 2', default: LayingStatusEnum.INPROGRESS })
    layingStatus: LayingStatusEnum;

    @Column("tinyint", {  name: "cut_status", nullable: false, comment: 'OPEN = 0, REP_INPROGRESS = 1, REV_INPROGRESS = 2, HOLD = 99 , COMPLETED = 3', default: CutStatusEnum.OPEN })
    cutStatus: CutStatusEnum;

    @Column("tinyint", {  name: "bundle_print_status", nullable: false, comment: 'The bundle print status for this laying', default: false })
    bundlePrintStatus: boolean;
}



