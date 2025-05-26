import { Entity, Column } from "typeorm";
import { AbstractEntity } from "../../database/common-entities";

@Entity('bundle_fg')
export class BundleFgEntity extends AbstractEntity {

    @Column("bigint", { name: "fg_number", nullable: true, comment: '' })
    fgNumber: number;

    @Column("bigint", { name: "sew_serial", nullable: true, comment: '' })
    sewSerial: number;

    @Column("bigint", { name: "osl_id", nullable: true, comment: '' })
    oslId: number;

    @Column("varchar", { length: "255", name: "bundle_barcode", nullable: true, comment: '' })
    bundleBarcode: string;

    @Column("varchar", { length: "255", name: "job_number", nullable: true, comment: '' })
    jobNumber: string;

    @Column("tinyint", { name: "job_group", nullable: true, comment: '' })
    jobGroup: string;
}
