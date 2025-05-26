

import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { DocBundleGenerationStatusEnum, DocConfirmationStatusEnum } from "@xpparel/shared-models";

// The bundle level records
@Entity('emb_line_item')
export class EmbLineItemEntity extends AbstractEntity {

    // Ref key of the po serial. We need this in here to reduce the index page size.
    @Column("bigint", { name: "po_serial", nullable: false, comment: 'The ref id of the PO' })
    poSerial: number;

    @Column("bigint", { name: "emb_header_id", nullable: false, comment: 'The ref id of the Emb Header' })
    embHeaderId: number;

    @Column("bigint", { name: "emb_line_id", nullable: false, comment: 'The ref id of the Emb Line' })
    embLineId: number;

    @Column("smallint", { name: "quantity", nullable: false, comment: 'The quantity of the bundle' })
    quantity: number;

    @Column("varchar", { length: 10, name: "size", nullable: false, comment: 'The color of the bundle' })
    size: string;

    @Column("bigint", { name: "ref_bundle_id", nullable: false, comment: 'The PK of the ADB shade' })
    refBundleId: string;

    // format: BarcodePrefixEnum.PANEL_EMB_BUNDLE prefix + HEX(POSERIAL) + HEX(under po lay number) + bundle number
    @Column("varchar", { length: 20, name: "barcode", nullable: false, comment: 'The barcode of the emb bundle' })
    barcode: string;

}



