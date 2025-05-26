import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { CutStatusEnum, DocBundleGenerationStatusEnum, DocConfirmationStatusEnum, LayingStatusEnum, TaskStatusEnum, WhAckEnum } from "@xpparel/shared-models";

@Entity('po_adb_component')
export class PoAdbComponentEntity {

    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    // Ref key of the po serial
    @Column("bigint", { name: "po_serial", nullable: false, comment: '' })
    poSerial: number;

    // Ref key of the po serial
    @Column("varchar", { name: "component", nullable: false, comment: '' })
    component: string;

    @Column("bigint", { name: "po_docket_lay_id", nullable: false, comment: 'The reference key of po_docket_lay' })
    poDocketLayId: number;

    @Column("bigint", { name: "adb_id", nullable: false, comment: 'The reference key of ADB' })
    adbId: number;

    @Column("int", { name: "panel_start_number", nullable: true, default: 0, comment: '' })
    panelStartNumber: number;

    @Column("int", { name: "panel_end_number", nullable: true, default: 0, comment: '' })
    panelEndNumber: number;

    @Column("int", { name: "fg_start_number", nullable: true, default: 0, comment: '' })
    fgStartNumber: number;

    @Column("int", { name: "fg_end_number", nullable: true, default: 0, comment: '' })
    fgEndNumber: number;
}

