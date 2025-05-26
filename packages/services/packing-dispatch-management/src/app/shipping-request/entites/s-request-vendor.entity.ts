import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";

@Entity('s_request_vendor')
export class SRequestVendorEntity extends AbstractEntity {

    @Column("tinyint", { name: "s_request_id", nullable: false, comment: '' })
    sRequestId: number;

    @Column("bigint", { name: "vendor_id", nullable: false, comment: '' })
    vendorId: number;

    @Column("text", { name: "remarks", nullable: false, comment: '' })
    remarks: string;

    @Column("datetime", { name: "planned_dispatch_date", nullable: false, comment: '' })
    plannedDispatchDate: string;
}