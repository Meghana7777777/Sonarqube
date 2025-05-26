import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { DocBundleGenerationStatusEnum, DocConfirmationStatusEnum, EmbLocationTypeEnum } from "@xpparel/shared-models";

@Entity('emb_rejection_header')
export class EmbRejectionHeaderEntity extends AbstractEntity {

    // Ref key of the po serial
    @Column("bigint", { name: "po_serial", nullable: false, comment: 'The ref id of the PO' })
    poSerial: number;

    // PE-3:154AB-1, PE-3:154AB-2, PE-3:154AB-3
    // format: PEMB + group number + Poserial + auto inc under a PO serial
    @Column("varchar", { length: 20, name: "emb_job_number", nullable: false, comment: 'The generated emb job number' })
    embJobNumber: string;

    @Column("varchar", { length: 3, name: "operation_code", nullable: false, comment: 'The operation code' })
    operationCode: string;

    @Column("varchar", { name: "op_group", length: 2,  nullable: false, comment: 'The group of the operation  whatever defined in the op version' })
    opGroup: string;
    
    @Column("smallint", { name: "rej_quantity", nullable: false, comment: 'The rej qty of the operation' })
    rejQuantity: number;
}

