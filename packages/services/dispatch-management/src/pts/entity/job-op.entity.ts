import { Entity, Column } from "typeorm";
import { AbstractEntity } from "../../database/common-entities";
import { JobBarcodeTypeEnum, ProcessTypeEnum } from "@xpparel/shared-models";

@Entity('job_op')
export class JobOpEntity extends AbstractEntity {

    @Column("bigint", { name: "sew_serial", nullable: true, comment: '' })
    sewSerial: number;

    @Column("varchar", { length: "255", name: "op_code", nullable: true, comment: '' })
    opCode: string;

    @Column("bigint", { name: "job_group", nullable: true, comment: '' })
    jobGroup: number;

    @Column("varchar", { length: "255", name: "job_number", nullable: true, comment: '' })
    jobNumber: string;

    @Column("varchar", { length: "255", name: "pre_ops", nullable: true, comment: '' })
    preOps: string;

    @Column("bigint", { name: "g_qty", nullable: true, comment: '' })
    gQty: number;

    @Column("bigint", { name: "r_qty", nullable: true, comment: '' })
    rQty: number;

    @Column("bigint", { name: "org_qty", nullable: true, comment: '' })
    orgQty: number;

    @Column("boolean", { name: "reconciled", nullable: true, comment: '' })
    reconciled: boolean;

    @Column("boolean", { name: "isfirst_op", nullable: true, comment: '' })
    isfirstOp: boolean;

    @Column("bigint", { name: "op_order", nullable: true, comment: '' })
    opOrder: number;

    @Column("enum", { enum: ProcessTypeEnum, name: "op_category", nullable: true, comment: '' })
    opCategory: ProcessTypeEnum;

    @Column("varchar", { length: 5, name: "op_category", nullable: true, comment: '' })
    jobType: JobBarcodeTypeEnum;
}
