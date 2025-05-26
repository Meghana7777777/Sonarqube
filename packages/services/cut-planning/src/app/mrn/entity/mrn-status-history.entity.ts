import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { DocBundleGenerationStatusEnum, DocConfirmationStatusEnum, MrnStatusEnum, TaskStatusEnum, WhAckEnum } from "@xpparel/shared-models";

@Entity('mrn_status_history')
export class MrnStatusHistoryEntity extends AbstractEntity {

    // Ref key of the po serial
    @Column("bigint", { name: "po_serial", nullable: false, comment: '' })
    poSerial: number;

    // The PK of the mrn entity
    @Column("mediumint", { name: "mrn_id", nullable: false, comment: 'The PK of the mrn entity' })
    mrnId: number;

    @Column("varchar", { length: 3, name: "request_status", nullable: false, comment: 'OP - open, APR - approved, REJ - rejected, ISS - Issued' })
    requestStatus: MrnStatusEnum;
}


