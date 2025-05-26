import { Entity, Column } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";

@Entity('bank_request_header')
export class BankRequestHeaderEntity extends AbstractEntity {

    @Column("bigint", { name: "sew_serial", nullable: true, comment: '' })
    sewSerial: number;

    @Column("varchar", { length: "255", name: "req_no", nullable: true, comment: '' })
    reqNo: string;

    @Column("varchar", { length: "255", name: "requested_by", nullable: true, comment: '' })
    requestedBy: string;

    @Column("bigint", { name: "approval_status", nullable: true, comment: '' })
    approvalStatus: number;

    @Column("bigint", { name: "readiness_status", nullable: true, comment: '' })
    readinessStatus: number;

    @Column("bigint", { name: "issuance_status", nullable: true, comment: '' })
    issuanceStatus: number;

}
