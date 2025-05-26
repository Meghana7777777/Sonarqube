import { Entity, Column } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { ProcessTypeEnum } from "@xpparel/shared-models";

@Entity('bank_request_line')
export class BankRequestLineEntity extends AbstractEntity {

    @Column("bigint", { name: "sew_serial", nullable: true, comment: '' })
    sewSerial: number;

    @Column("bigint", { name: "br_id", nullable: true, comment: '' })
    brId: number;

    @Column("varchar", { length: "255", name: "job_number", nullable: true, comment: '' })
    jobNumber: string;

    @Column("enum", { enum: ProcessTypeEnum, name: "op_category", nullable: true, comment: '' })
    opCategory: ProcessTypeEnum;

    @Column("bigint", { name: "readiness_status", nullable: true, comment: '' })
    readinessStatus: number;

    @Column("bigint", { name: "issuance_status", nullable: true, comment: '' })
    issuanceStatus: number;

}
