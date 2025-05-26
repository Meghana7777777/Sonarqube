import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { DocBundleGenerationStatusEnum, DocConfirmationStatusEnum, TaskStatusEnum, WhAckEnum } from "@xpparel/shared-models";

@Entity('po_docket_cut_table')
export class PoDocketCutTableEntity extends AbstractEntity {

    // Ref key of the po serial
    @Column("bigint", { name: "po_serial", nullable: false, comment: '' })
    poSerial: number;

    // Ref request number
    @Column("varchar", { length: 20, name: "request_number", nullable: false, comment: '' })
    requestNumber: string;

    @Column("varchar", { length: 20, name: "docket_group", nullable: false, comment: '' })
    docketGroup: string;

    @Column("varchar", { length: 20, name: "resource_id", nullable: true, comment: '' })
    resourceId: string;

    @Column("varchar", { length: 20, name: "resource_desc", nullable: true, comment: '' })
    resourceDesc: string;

    @Column("int", { name: "priority", nullable: false, comment: '', default: 0 })
    priority: number;

    @Column("datetime", {  name: "planned_date_time", nullable: true, comment: '', default: null })
    plannedDateTime: string; // YYYY-MM-DD HH:MM:SS
    
    @Column("datetime", {  name: "completed_date_time", nullable: true, comment: '', default: null })
    completedDateTime: string; // YYYY-MM-DD HH:MM:SS

    @Column("datetime", {  name: "mat_request_on", nullable: true, comment: 'The material requested datetime', default: null })
    matReqOn: string; // YYYY-MM-DD HH:MM:SS

    @Column("varchar", { length: "25", name: "mat_request_by", nullable: true, comment: 'The material requested person', default: null })
    matReqBy: string; // YYYY-MM-DD HH:MM:SS

    @Column("datetime", {  name: "mat_fulfill_date_time", nullable: true, comment: 'The material fulfillment date time for the request' })
    matFulfillmentDateTime: string; // YYYY-MM-DD HH:MM:SS

    @Column("tinyint", {  name: "task_status", nullable: false, comment: '', default: TaskStatusEnum.OPEN })
    taskStatus: TaskStatusEnum;

    @Column("tinyint", {  name: "wh_ack", nullable: false, comment: 'The ack by the wh after the request is created/deleted in the CPS', default: WhAckEnum.OPEN })
    whAck: WhAckEnum;
}



