import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { CutStatusEnum, DocBundleGenerationStatusEnum, DocConfirmationStatusEnum, LayingStatusEnum, TaskStatusEnum, WhAckEnum } from "@xpparel/shared-models";

@Entity('po_docket_lay_bundle_print')
export class PoDocketLayBundlePrintEntity {

    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    // Ref key of the po serial
    @Column("bigint", { name: "po_serial", nullable: false, comment: '' })
    poSerial: number;

    // Reference key of the po_docket_lay
    @Column("bigint", { name: "po_docket_lay_id", nullable: false, comment: 'The reference key of po_docket_lay' })
    poDocketLayId: number;

    @Column("varchar", { length: 20, name: "docket_number", nullable: false, comment: 'The docket number to which the labels are printed' })
    docketNumber: string;

    @Column("tinyint", { name: "action", nullable: false, comment: 'The action .i.e print / release of the barcodes for the laying 0-released 1-printed' })
    action: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}



