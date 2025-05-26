import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { DocBundleGenerationStatusEnum, DocConfirmationStatusEnum, WhMatReqLineStatusEnum } from "@xpparel/shared-models";

@Entity('po_docket_material_request')
export class PoDocketMaterialRequestEntity extends AbstractEntity {

    // Ref key of the po serial
    @Column("bigint", { name: "po_serial", nullable: false, comment: '' })
    poSerial: number;
  
    // Reference key
    @Column("varchar", { length: 20, name: "request_number", nullable: false, comment: 'po_serial + auto inc number under a PO' })
    requestNumber: string;

    // @Column("varchar", { length: 20, name: "docket_number", nullable: true, comment: '' })
    // docketNumber: string;

    @Column("varchar", { length: 20, name: "docket_group", nullable: true, comment: 'The docket group as in the OES' })
    docketGroup: string;

    @Column("varchar", { length: 100, name: "item_code", nullable: false, comment: '' })
    itemCode: string;

    @Column("decimal", { precision: 8, scale: 2, name: "requested_quantity", nullable: false, comment: '' })
    requestedQuantity: number;

    // the material status of the docket
    @Column("varchar", { name: "request_status", nullable: false, comment: '', default: WhMatReqLineStatusEnum.OPEN })
    requestStatus: WhMatReqLineStatusEnum;
}