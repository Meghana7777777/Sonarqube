import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { DocBundleGenerationStatusEnum, DocConfirmationStatusEnum, TaskStatusEnum, WhAckEnum } from "@xpparel/shared-models";

@Entity('mrn_item')
export class MrnItemEntity extends AbstractEntity {

    // Ref key of the po serial
    @Column("bigint", { name: "po_serial", nullable: false, comment: '' })
    poSerial: number;

    // The PK of the mrn entity
    @Column("mediumint", { name: "mrn_id", nullable: false, comment: 'The PK of the mrn entity' })
    mrnId: number;

    @Column("varchar", { length: 30, name: "lot_no", nullable: false, comment: '' })
    lotNo: string;

    @Column("bigint", { name: "roll_id", nullable: false, comment: '' })
    rollId: number;

    @Column("varchar", { length: 20, name: "roll_barcode", nullable: false, comment: '' })
    rollBarcode: string;

    @Column("decimal", { precision: 8, scale: 2, name: "requested_quantity", nullable: false, comment: '' })
    requestedQuantity: number;

    @Column("decimal", { precision: 8, scale: 2, name: "consumed_quantity", nullable: false, comment: 'The actual layed qty for the roll after the physical laying. Can sometimes be more than the requested qty', default: 0 })
    consumedQuantity: number;
}



