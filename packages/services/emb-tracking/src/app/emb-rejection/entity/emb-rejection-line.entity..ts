import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { DocBundleGenerationStatusEnum, DocConfirmationStatusEnum, EmbLocationTypeEnum } from "@xpparel/shared-models";

@Entity('emb_rejection_line')
export class EmbRejectionLineEntity extends AbstractEntity {

    // Ref key of the po serial
    @Column("bigint", { name: "po_serial", nullable: false, comment: 'The ref id of the PO' })
    poSerial: number;

    @Column("varchar", { length: 20, name: "barcode", nullable: false, comment: 'The barcode of the emb bundle' })
    barcode: string;
    
    // PK of the emb rejection header
    @Column("bigint", { name: "rh_id", nullable: false, comment: 'The PK of the Rejection header' })
    rhId: number;

    // docket number
    @Column("varchar", { length: 10, name: "reason_id", nullable: false, comment: 'The ref of the ums.rejections' })
    reasonId: string;

    @Column("varchar", { length: 30, name: "reason_desc", nullable: false, comment: 'The resaon desc' })
    reasonDesc: string;

    @Column("varchar", { length: 3, name: "operation_code", nullable: false, comment: 'The operation code' })
    operationCode: string;

    @Column("varchar", { name: "op_group", length: 2,  nullable: false, comment: 'The group of the operation  whatever defined in the op version' })
    opGroup: string;

    @Column("smallint", { name: "rej_quantity", nullable: false, comment: 'The rej qty of the operation' })
    rejQuantity: number;
    
}

