import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { DocBundleGenerationStatusEnum, DocConfirmationStatusEnum, WhMatReqLineStatusEnum } from "@xpparel/shared-models";

@Entity('po_material_request')
export class PoMaterialRequestEntity extends AbstractEntity {

    // Ref key of the po serial
    @Column("bigint", { name: "po_serial", nullable: false, comment: '' })
    poSerial: number;
  
    // an unique number to identify a request across warehouse
    @Column("varchar", { name: "request_number", nullable: false, comment: 'po_serial + auto inc number under a PO' })
    requestNumber: string;

    @Column("varchar", { name: "request_status", nullable: false, comment: '', default: WhMatReqLineStatusEnum.OPEN })
    requestStatus: WhMatReqLineStatusEnum;

}
