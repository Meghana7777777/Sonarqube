import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { DocBundleGenerationStatusEnum, DocConfirmationStatusEnum, MrnStatusEnum, TaskStatusEnum, WhAckEnum } from "@xpparel/shared-models";

@Entity('mrn')
export class MrnEntity extends AbstractEntity {

    // Ref key of the po serial
    @Column("bigint", { name: "po_serial", nullable: false, comment: '' })
    poSerial: number;

    // Ref request number
    @Column("varchar", { length: 20, name: "request_number", nullable: false, comment: 'The mrn request no' })
    requestNumber: string;

    @Column("varchar", { length: 20, name: "docket_group", nullable: false, comment: '' })
    docketGroup: string;

    // The PK of the po docket lay entity
    @Column("bigint", { name: "po_docket_lay_id", nullable: false, comment: 'The PK of the po docket lay entity' })
    poDocketLayId: number;

    @Column("varchar", { length: 3, name: "request_status", nullable: false, comment: 'OP - open, APR - approved, REJ - rejected, ISS - Issued' })
    requestStatus: MrnStatusEnum;
}


