

import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";

@Entity('emb_transaction_log')
export class EmbTransactionLogEntity extends AbstractEntity {

    // Ref key of the po serial
    @Column("bigint", { name: "po_serial", nullable: false, comment: 'The ref id of the PO' })
    poSerial: number;

    // PE-3:154AB-1, PE-3:154AB-2, PE-3:154AB-3
    // format: PEMB + group number + Poserial + auto inc under a PO serial
    @Column("varchar", { length: '20', name: "emb_job_number", nullable: false, comment: 'The generated emb job number' })
    embJobNumber: string;

    @Column("varchar", { length: 20, name: "barcode", nullable: false, comment: 'The barcode of the emb bundle' })
    barcode: string;

    @Column("varchar", { length: 3, name: "operation_code", nullable: false, comment: 'The operation code' })
    operationCode: string;
    
    @Column("varchar", { length: 40, name: "color", nullable: false, comment: 'The color of the bundle' })
    color: string;

    @Column("varchar", { length: 20, name: "size", nullable: false, comment: 'The size of the bundle' })
    size: string;

    @Column("smallint", { name: "good_quantity", nullable: false, comment: 'The good qty of the operation' })
    goodQuantity: number;

    @Column("smallint", { name: "rejected_quantity", nullable: false, comment: 'The rejected qty of the operation' })
    rejectedQuantity: number;

}
