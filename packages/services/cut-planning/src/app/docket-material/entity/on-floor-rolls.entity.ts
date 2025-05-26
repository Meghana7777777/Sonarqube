import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { RollLocationEnum, RollReceivingConfirmationStatusEnum } from "@xpparel/shared-models";

/**
 * This entity will contain the rolls that are released after the laying operation
 * The consumed qty = the total layed qty for that roll in that instance
 * The avl qty = total roll qty - issued qty in the WH
 * Once the roll is allocated to some other docket, or put in WH, the 
 */
@Entity('on_floor_rolls')
export class OnFloorRollsEntity extends AbstractEntity {

    @Column("varchar", { length: 30, name: "lot_no", nullable: false, comment: '' })
    lotNo: string;

    @Column("bigint", { name: "roll_id", nullable: false, comment: 'The PK of the roll record in WMS' })
    rollId: number;

    @Column("varchar", { length: 20, name: "roll_barcode", nullable: false, comment: '' })
    rollBarcode: string;

    // @Column("varchar", { length: 15, name: "docket_number", nullable: false, comment: '' })
    // docketNumber: string;

    @Column("varchar", { length: 20, name: "docket_group", nullable: true, comment: 'The docket group as in the OES' })
    docketGroup: string;

    @Column("decimal", { precision: 8, scale: 2, name: "consumed_quantity", nullable: false, comment: 'The consumed qty at this specific instance of the docket' })
    consumedQuantity: number;

    @Column("varchar", { length: 2, name: "roll_location", nullable: false, comment: 'The current location of the roll' })
    rollLocation: RollLocationEnum;

    @Column("bigint", { name: "po_docket_material_id", nullable: false, comment: 'The PK of the PO docket material' })
    docketMaterialId: number;

    @Column("bigint", { name: "po_docket_lay_id", nullable: false, comment: 'The PK of the PO docket lay' })
    poDocketLayId: number;

    @Column("bigint", { name: "po_serial", nullable: false, comment: '' })
    poSerial: number;

    @Column("int", { name: "reason_id", default: 0, comment: 'The reason id of the wms masters inspection reasons' })
    reasonId: number;

    @Column("varchar", { name: "rc_status", length: 4, default: RollReceivingConfirmationStatusEnum.YET_TO_RECEIVE, comment: 'The confirmation status that the roll has been received or not from the cutting dept' })
    rollRcConfirmationStatus: RollReceivingConfirmationStatusEnum;

    // @Column("decimal", { precision: 8, scale: 2, name: "avl_quantity", nullable: false, default: 0, comment: 'The stil left over qty for the roll at the instance which it was released. This is just for a ref. Dont use this column for any calculations' })
    // avlQuantity: number;

    // @Column("tinyint", { name: "roll_location", nullable: false, default: RollLocationEnum.ONFLOOR, comment: 'The current location of the roll' })
    // rollLocation: RollLocationEnum;
}