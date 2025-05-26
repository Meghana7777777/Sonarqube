import { Entity, Column } from "typeorm";
import { AbstractEntity } from "../../database/common-entities";

@Entity('trans_log')
export class TransLogEntity extends AbstractEntity {

    @Column("bigint", { name: "sew_serial", nullable: true, comment: '' })
    sewSerial: number;

    @Column("bigint", { name: "osl_id", nullable: true, comment: '' })
    oslId: number;

    @Column("varchar", { length: "255", name: "bundle_barcode", nullable: true, comment: '' })
    bundleBarcode: string;

    @Column("varchar", { length: "255", name: "job_number", nullable: true, comment: '' })
    jobNumber: string;

    @Column("bigint", { name: "g_qty", nullable: true, comment: '' })
    gQty: number;

    @Column("bigint", { name: "r_qty", nullable: true, comment: '' })
    rQty: number;

}
