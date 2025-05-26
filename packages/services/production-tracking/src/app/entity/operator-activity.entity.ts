
import { Entity, Column } from "typeorm";
import { AbstractEntity } from "../../database/common-entities";

// A table that maintains the successful last bundle scanned by a operator and his tran log id
// The record in this table will be cleared automatically by a CRON job. So we only maintain the very bare minimum records for an operator in this table
@Entity('operator_activity')
export class OperatorActivityEntity extends AbstractEntity {

    @Column("varchar", { length: 30, name: "bundle_barcode", nullable: false, comment: '' })
    bundleBarcode: string;

    @Column("smallint", { name: "operator_id", nullable: false, comment: '' })
    operatorId: number;

    @Column("smallint", { name: "op_code", nullable: false, comment: '' })
    opCode: number;

    @Column("bigint", { name: "bun_tran_id", default: false, comment: 'The pk of the bundle trans' })
    tranLogId: number;
}

