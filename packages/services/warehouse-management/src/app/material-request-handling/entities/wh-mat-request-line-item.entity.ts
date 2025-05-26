import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { WhMatReqLineItemStatusEnum } from "@xpparel/shared-models";

@Entity('wh_mat_request_line_item')
export class WhMatRequestLineItemEntity extends AbstractEntity {

    // the roll barcode
    @Column("bigint", { name: "item_id", nullable: false, comment: 'The PK of the roll/sticers bunch/buttons pakcet/ etc' })
    itemId: number;

    // the roll barcode
    @Column("varchar", { length: 20, name: "item_barcode", nullable: false, comment: 'item barcode of the requesting item. ie. ROLL barcode / Pakcet barcode / etc' })
    itemBarcode: string;

    // Roll/Stickers/Cartons etc. default ROLL
    @Column("varchar", { length: 15, name: "item_type", nullable: false, comment: 'Roll/Stickers/Cartons etc', default: 'ROLL' })
    itemType: string;

    @Column("decimal", { scale: 2, precision: 8,  name: "req_quanitty", nullable: false, comment: 'The requesting quantity form this specific roll/scahet/pack' })
    reqQuantity: number;

    @Column("decimal", { scale: 2, precision: 8,  name: "issued_quantity", nullable: false, comment: 'The issued quantity form this specific roll/scahet/pack' })
    issuedQuantity: number;

    @Column("varchar", { length: 5, name: "req_line_item_status", nullable: false, default: WhMatReqLineItemStatusEnum.OPEN, comment: 'The material status of this entity' })
    reqLineItemStatus: WhMatReqLineItemStatusEnum;

    // Ref key. PK of the WH request header
    @Column("bigint", { name: "wh_mat_request_header_id", nullable: false, comment: 'PK of the WH request header' })
    whRequestHeaderId: number;

    @Column("bigint", { name: "wh_mat_request_line_id", nullable: false, comment: 'PK of the WH request line' })
    whRequestLineId: number;
}