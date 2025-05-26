

import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { DocBundleGenerationStatusEnum, DocConfirmationStatusEnum, JobReconciliationEnum } from "@xpparel/shared-models";

@Entity('emb_op_header')
export class EmbOpHeaderEntity extends AbstractEntity {

    // Ref key of the po serial
    @Column("bigint", { name: "po_serial", nullable: false, comment: 'The ref id of the PO' })
    poSerial: number;

    // PE-3:154AB-1, PE-3:154AB-2, PE-3:154AB-3
    // format: PEMB + group number + Poserial + auto inc under a PO serial
    @Column("varchar", { length: '20', name: "emb_job_number", nullable: false, comment: 'The generated emb job number' })
    embJobNumber: string;

    @Column("bigint", { name: "emb_header_id", nullable: false, comment: 'The ref id of the Emb Header' })
    embHeaderId: number;

    @Column("smallint", { name: "job_quantity", default: 0, nullable: false, comment: 'The job qty' })
    jobQuantity: number;

    @Column("smallint", { name: "good_quantity",  default: 0, nullable: false, comment: 'The good qty of the last operation' })
    goodQuantity: number;

    @Column("smallint", { name: "rejected_quantity",  default: 0, nullable: false, comment: 'The overall rejected qty' })
    rejectedQuantity: number;

    @Column("varchar", { length: 2, name: "reconciliation_status", nullable: false, default: JobReconciliationEnum.OPEN })
    reconciliationStatus: JobReconciliationEnum;

}
