import { Entity, Column } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { ProcessTypeEnum, OpFormEnum } from "@xpparel/shared-models";

@Entity('bank_req_dep_job')
export class BankRequestDepJobEntity extends AbstractEntity {

    @Column("bigint", { name: "sew_serial", nullable: true, comment: '' })
    sewSerial: number;

    @Column("bigint", { name: "br_id", nullable: true, comment: '' })
    brId: number;

    @Column("bigint", { name: "brl_id", nullable: true, comment: '' })
    brlId: number;

    @Column("varchar", { length: "255", name: "curr_job", nullable: true, comment: '' })
    currJob: string;

    @Column("bigint", { name: "pre_jg", nullable: true, comment: '' })
    preJg: number;

    @Column("varchar", { length: "255", name: "pre_jg_last_op", nullable: true, comment: '' })
    preJgLastOp: string;

    @Column("enum", { enum: OpFormEnum, name: "job_type", nullable: true, comment: '' })
    jobType: OpFormEnum;

    @Column("enum", { enum: ProcessTypeEnum, name: "op_category", nullable: true, comment: '' })
    opCategory: ProcessTypeEnum;

    @Column("bigint", { name: "req_qty", nullable: true, comment: '' })
    reqQty: number;

    @Column("bigint", { name: "iss_qty", nullable: true, comment: '' })
    issQty: number;

}
