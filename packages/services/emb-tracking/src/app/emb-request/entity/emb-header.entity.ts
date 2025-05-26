

import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { DocBundleGenerationStatusEnum, DocConfirmationStatusEnum, EmbLocationTypeEnum } from "@xpparel/shared-models";

@Entity('emb_header')
export class EmbHeaderEntity extends AbstractEntity {

    // Ref key of the po serial
    @Column("bigint", { name: "po_serial", nullable: false, comment: 'The ref id of the PO' })
    poSerial: number;

    // PE-3:154AB-1, PE-3:154AB-2, PE-3:154AB-3
    // format: PEMB + group number + Poserial + auto inc under a PO serial
    @Column("varchar", { length: '20', name: "emb_job_number", nullable: false, comment: 'The generated emb job number' })
    embJobNumber: string;

    // docket number
    @Column("varchar", { length: 10, name: "emb_parent_job_ref", nullable: false, comment: 'The docket number for which this emb is created' })
    embParentJobRef: string;

    @Column("varchar", { length: 20, name: "docket_group", nullable: false, comment: 'The docket group as is in the OES' })
    docketGroup: string;
    
    @Column("varchar", { length: '30', name: "product_name", nullable: false, comment: 'The prod name' })
    productName: string;

    @Column("varchar", { length: '40', name: "product_type", nullable: false, comment: 'The prod type' })
    productType: string;

    @Column("varchar", { name: "emb_type", length: 2, nullable: false, comment: 'The flag that denotes whether an internal or external emb' })
    embType: EmbLocationTypeEnum;

    @Column("smallint", { name: "supplier_id", nullable: false, comment: 'The ref PK of the vendor entity in the UMS' })
    supplierId: number;

    @Column("varchar", { name: "op_group", length: 2,  nullable: false, comment: 'The group of the operation  whatever defined in the op version' })
    opGroup: string;
    
}
