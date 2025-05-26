

import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { DocBundleGenerationStatusEnum, DocConfirmationStatusEnum } from "@xpparel/shared-models";

@Entity('emb_op_line')
export class EmbOpLineEntity extends AbstractEntity {

    // Ref key of the po serial
    @Column("bigint", { name: "po_serial", nullable: false, comment: 'The ref id of the PO' })
    poSerial: number;

    // PE-3:154AB-1, PE-3:154AB-2, PE-3:154AB-3
    // format: PEMB + group number + Poserial + auto inc under a PO serial
    @Column("varchar", { length: '20', name: "emb_job_number", nullable: false, comment: 'The generated emb job number' })
    embJobNumber: string;

    @Column("varchar", { length: 10, name: "emb_parent_job_ref", nullable: false, comment: 'The docket number for which this emb is created' })
    embParentJobRef: string;

    @Column("bigint", { name: "emb_op_header_id", nullable: false, comment: 'The ref id of the Emb Op Header' })
    embOpHeaderId: number;

    @Column("varchar", { length: 3, name: "operation_code", nullable: false, comment: 'The operation code' })
    operationCode: string;

    // @Column("varchar", { length: 10, name: "pre_operation_code", nullable: false, comment: 'The pre operation codes in the CSV format' })
    // preOperationCode: string;

    @Column("varchar", { length: 2, name: "op_group", nullable: false, comment: 'The op group of the operation' })
    opGroup: string;

    // @Column("varchar", { length: 10, name: "pre_op_group", nullable: false, comment: 'The op group of the current op group operation' })
    // preOpGroup: string;

    @Column("tinyint", { name: "sequence", nullable: false, comment: 'The op sequence' })
    sequence: number;

    @Column("smallint", { name: "job_quantity", nullable: false, comment: 'The job qty' })
    jobQuantity: number;

    @Column("smallint", { name: "good_quantity", nullable: false, comment: 'The good qty of the operation' })
    goodQuantity: number;

    @Column("smallint", { name: "rejected_quantity", nullable: false, comment: 'The rejected qty of the operation' })
    rejectedQuantity: number;

}
