

import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { DocBundleGenerationStatusEnum, DocConfirmationStatusEnum } from "@xpparel/shared-models";

@Entity('emb_line')
export class EmbLineEntity extends AbstractEntity {

    // Ref key of the po serial
    @Column("bigint", { name: "po_serial", nullable: false, comment: 'The ref id of the PO' })
    poSerial: number;

    @Column("bigint", { name: "emb_header_id", nullable: false, comment: 'The PK of the Emb Header' })
    embHeaderId: number;

    // docket number
    @Column("varchar", { length: 10, name: "emb_parent_job_ref", nullable: false, comment: 'The docket number for which this emb is created' })
    embParentJobRef: string;

    // the laying id
    @Column("varchar", { length: 10, name: "emb_actual_job_ref", nullable: false, comment: 'The actual docket number (lay id) for which this emb is created' })
    embActualJobRef: string;

    // This color is maintained here to reduce the memory occupancy in the bundles table
    @Column("varchar", { length: 40, name: "color", nullable: false, comment: 'The color of the lay' })
    color: string;

    @Column("smallint", { name: "supplier_id", nullable: false, comment: 'The ref PK of the vendor entity in the UMS' })
    supplierId: number;

    @Column("tinyint", {  name: "bundle_print_status", nullable: false, comment: 'The bundle print status for this emb job', default: false })
    bundlePrintStatus: boolean;

    @Column("varchar", { name: "op_group", length: 2,  nullable: false, comment: 'The group of the operation  whatever defined in the op version' })
    opGroup: string;

    @Column("boolean", { name: "freeze_status",  default: false, comment: 'The freeze status that indicates, no operation can be performed on this emb job line barcode. scanning / printing barcodes is prohibitted. This will turn to true usually after cut dispatch' })
    freezeStatus: boolean;
}




