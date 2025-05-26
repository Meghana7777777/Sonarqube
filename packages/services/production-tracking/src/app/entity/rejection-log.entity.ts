import { Entity, Column } from "typeorm";
import { AbstractEntity } from "../../database/common-entities";


@Entity('rejection_log')
export class RejectionLogEntity extends AbstractEntity {

    @Column("bigint", { name: "fg_number", nullable: false, comment: '' })
    fgNumber: number;

    @Column("bigint", { name: "sew_serial", nullable: false, comment: '' })
    sewSerial: number;

    @Column("bigint", { name: "osl_id", nullable: false, comment: '' })
    oslId: number;

    @Column("varchar", { length: 20, name: "reason_id", nullable: false, comment: '' })
    reasonId: string;

    @Column("varchar", { length: 40, name: "reason_name", nullable: false, comment: 'the reason_name column value in the ums.reasons' })
    reasonName: string;

    @Column("varchar", { length: 5, name: "op_code", nullable: false, comment: '' })
    opCode: string;

    @Column("varchar", { length: "20", name: "bundle_barcode", nullable: false, comment: '' })
    bundleBarcode: string;

    @Column("varchar", { length: "20", name: "job_number", nullable: false, comment: '' })
    jobNumber: string;

    @Column("tinyint", { name: "job_group", nullable: false, comment: '' })
    jobGroup: number;
}

