import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { PoCutBundlingMoveToInvStatusEnum, PoKnitBundlingMoveToInvStatusEnum, ProcessTypeEnum } from "@xpparel/shared-models";

@Entity('po_bundling')
export class PoBundlingEntity extends AbstractEntity {

    @Column('bigint', { name: 'processing_serial', nullable: false })
    processingSerial: number;

    @Column('varchar', { name: 'process_type', length: 25, nullable: false })
    processType: ProcessTypeEnum;

    @Column("varchar", { length: 50, name: "product_type", nullable: false, comment: '' })
    productType: string;

    @Column("varchar", { length: 50, name: "product_name", nullable: false, comment: '' })
    productName: string;

    @Column("varchar", { length: 100, name: "color", nullable: true, comment: '' })
    color: string;

    @Column("bigint", { name: "docket_number", nullable: true, comment: '', default: null })
    docketNumber: string;

    @Column("tinyint", { name: "under_doc_lay_number", nullable: true, comment: '', default: 0 })
    underDocLayNumber: number;

    @Column('varchar', { length: 30, name: 'confirmed_by', nullable: false, comment: 'The user who confirmed the bundles' })
    confirmedBy: string;

    @Column('bigint', { name: 'confirmation_id', nullable: false })
    confirmationId: number;

    @Column('tinyint', { name: 'inventory_status', nullable: false, default: 0, comment: '0-default 1-moved to inventory. refer PoCutBundlingMoveToInvStatusEnum' })
    invStatus: PoCutBundlingMoveToInvStatusEnum;

    @Column('tinyint', { name: 'pts_status', nullable: false, default: 0, comment: '0-default 1-moved to pts. refer PoCutBundlingMoveToInvStatusEnum' })
    ptsStatus: PoCutBundlingMoveToInvStatusEnum;

    @Column('smallint', { name: 'total_bundles_confirmed', default: 0 })
    totalBundlesConfirmed: number;

    @Column('smallint', { name: 'total_bundled_quantity', default: 0 })
    totalBundledQuantity: number;
}

