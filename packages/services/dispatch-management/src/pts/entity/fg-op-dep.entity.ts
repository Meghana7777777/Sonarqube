import { Entity, Column } from "typeorm";
import { AbstractEntity } from "../../database/common-entities";
import { ProcessTypeEnum } from "@xpparel/shared-models";

@Entity('fg_op_dep')
export class FgOpDepEntity extends AbstractEntity {

    @Column("bigint", { name: "fg_number", nullable: true, comment: '' })
    fgNumber: number;

    @Column("bigint", { name: "sew_serial", nullable: true, comment: '' })
    sewSerial: number;

    @Column("bigint", { name: "osl_id", nullable: true, comment: '' })
    oslId: number;

    @Column("varchar", { length: "255", name: "op_code", nullable: true, comment: '' })
    opCode: string;

    @Column("varchar", { length: "255", name: "curr_job", nullable: true, comment: '' })
    currJob: string;

    @Column("bigint", { name: "dep_job_group", nullable: true, comment: '' })
    depJobGroup: number;

    @Column("varchar", { length: "255", name: "dep_job", nullable: true, comment: '' })
    depJob: string;

    @Column("varchar", { length: "255", name: "dep_op_code", nullable: true, comment: '' })
    depOpCode: string;

    @Column("varchar", { length: "255", name: "dep_bundle", nullable: true, comment: '' })
    depBundle: string;

    @Column("enum", { enum: ProcessTypeEnum, name: "dep_job_type", nullable: true, comment: '' })
    depJobType: ProcessTypeEnum;

    @Column("bigint", { name: "ref_serial", nullable: true, comment: '' })
    refSerial: number;

    @Column("bigint", { name: "ext_fg_number", nullable: true, comment: '' })
    extFgNumber: number;

    @Column("boolean", { name: "issued", nullable: true, comment: '' })
    issued: boolean;

    @Column("boolean", { name: "op_completed", nullable: true, default: false, comment: '' })
    opCompleted: boolean;

    @Column("boolean", { name: "is_rejected", nullable: true, default: false, comment: '' })
    isRejected: boolean;
}

export enum DepJobEnum {
    PANEL = 'P',
    SEMI_GMT = 'SG'
}
