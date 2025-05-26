import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { DocBundleGenerationStatusEnum, DocConfirmationStatusEnum, EmbDispatchStatusEnum, EmbLocationTypeEnum } from "@xpparel/shared-models";

@Entity('emb_dispatch_header')
export class EmbDispatchHeaderEntity extends AbstractEntity {

    // Ref key of the po serial
    @Column("bigint", { name: "po_serial", nullable: false, comment: 'The ref id of the PO' })
    poSerial: number;

    // Under a PO serail, an auto inc number
    @Column("varchar", { length: 20, name: "request_number", nullable: false, comment: 'The generated dispatch request number. Under a po serial and auto inc number' })
    requestNumber: string;

    @Column("varchar", { length: 5, name: "request_status", nullable: false, comment: 'The dispatch request status' })
    requestStatus: EmbDispatchStatusEnum;

    @Column("boolean", { name: "print_status", nullable: false, comment: 'The print status' })
    printStatus: boolean;

    @Column("varchar", { length: 5, name: "vendor_id", nullable: false, comment: 'The vendor id' })
    vendorId: number;
}

