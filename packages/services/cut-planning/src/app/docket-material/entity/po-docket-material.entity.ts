import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { DocBundleGenerationStatusEnum, DocConfirmationStatusEnum, RollLockEnum, WhMatReqLineItemStatusEnum } from "@xpparel/shared-models";

@Entity('po_docket_material')
export class PoDocketMaterialEntity extends AbstractEntity {

    // Ref key of the po serial
    @Column("bigint", { name: "po_serial", nullable: false, comment: '' })
    poSerial: number;
  
    // Reference key
    @Column("varchar", { name: "request_number", nullable: false, comment: 'po_serial + auto inc number under a PO' })
    requestNumber: string;

    @Column("varchar", { length: 20, name: "docket_group", nullable: true, comment: 'The docket group as in the OES' })
    docketGroup: string;

    @Column("varchar", { length: 100, name: "item_code", nullable: false, comment: '' })
    itemCode: string;

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

    @Column("varchar", { name: "request_status", nullable: false, comment: '', default: WhMatReqLineItemStatusEnum.OPEN })
    requestStatus: WhMatReqLineItemStatusEnum;

    @Column("tinyint", { name: "roll_lock_status", nullable: false, comment: '0 - open , 1 - locked' })
    rollLockStatus: RollLockEnum;

    @Column("mediumint", { name: "mrn_id", nullable: false, default: 0, comment: 'The PK of the mrn entity. This is valid in case of mrn request material' })
    mrnId: number;

}