import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { CutStatusEnum, DocBundleGenerationStatusEnum, DocConfirmationStatusEnum, LayingInspectionStatusEnum, LayingStatusEnum, TaskStatusEnum, WhAckEnum } from "@xpparel/shared-models";

@Entity('po_docket_lay_downtime')
export class PoDocketLayDowntimeEntity extends AbstractEntity {

    // Ref key of the po serial
    @Column("bigint", { name: "po_serial", nullable: false, comment: '' })
    poSerial: number;

    // Reference key of the po_docket_lay
    @Column("bigint", { name: "po_docket_lay_id", nullable: false, comment: 'The reference key of po_docket_lay' })
    poDocketLayId: number;

    @Column("varchar", { length: 20, name: "docket_group", nullable: false, comment: 'The docket group as is in the OES' })
    docketGroup: string;

    @Column("varchar", { name: "downtime_start_date_time", nullable: false, comment: '' })
    downtimeStartDateTime: string;

    @Column("varchar", { name: "downtime_end_date_time", nullable: true, comment: '' })
    downtimeEndDateTime: string;

    @Column("int", { name: "downtime_mins", nullable: true, comment: 'The diff of downtime_start_date_time - downtime_end_date_time in minutes' })
    downTimeMins: number;

    @Column("boolean", { name: "downtime_resumed", nullable: true, comment: 'To know if the downtime is completed', default: false })
    downtimeCompleted: boolean;

    @Column("int", { name: "reason_id", nullable: true, comment: '' })
    reasonId: number;

    @Column("text", { name: "reason_desc", comment: '' })
    reasonDesc: string;
}


