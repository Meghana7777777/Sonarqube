import { Entity, Column } from "typeorm";
import { AbstractEntity } from "../../database/common-entities";
import { ProcessTypeEnum } from "@xpparel/shared-models";

@Entity('op_sequence')
export class OpSequenceEntity extends AbstractEntity {

    @Column("varchar", { length: "255", name: "mo_no", nullable: true, comment: '' })
    moNo: string;

    @Column("bigint", { name: "sew_serial", nullable: true, comment: '' })
    sewSerial: number;

    @Column("varchar", { length: "255", name: "prod_name", nullable: true, comment: '' })
    prodName: string;

    @Column("bigint", { name: "job_group", nullable: true, comment: '' })
    jobGroup: number;

    @Column("varchar", { length: "255", name: "op_code", nullable: true, comment: '' })
    opCode: string;

    @Column("varchar", { length: "255", name: "pre_ops", nullable: true, comment: '' })
    preOps: string;

    @Column("varchar", { length: "255", name: "components", nullable: true, comment: 'csv' })
    components: string;

    @Column("boolean", { name: "qms_check", nullable: true, comment: '' })
    qmsCheck: boolean;

    @Column("enum", { enum: ProcessTypeEnum, name: "op_category", nullable: true, comment: '' })
    opCategory: ProcessTypeEnum;

    @Column("bigint", { name: "smv", nullable: true, comment: '' })
    smv: number;

    @Column("bigint", { name: "op_order", nullable: true, comment: '' })
    opOrder: number;

}
