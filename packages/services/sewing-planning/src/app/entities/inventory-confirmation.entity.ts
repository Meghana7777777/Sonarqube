import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { PoCutBundlingMoveToInvStatusEnum, PoKnitBundlingMoveToInvStatusEnum, ProcessTypeEnum, SpsBundleInventoryMoveToInvStatusEnum } from "@xpparel/shared-models";
import { AbstractEntity } from "../../database/common-entities";

@Entity('inventory_confirmation')
export class InventoryConfirmationEntity extends AbstractEntity {

    @Column('bigint', { name: 'processing_serial', nullable: false })
    processingSerial: number;

    @Column('varchar', { name: 'process_type', length: 5, nullable: false })
    processType: ProcessTypeEnum;

    @Column("varchar", { length: 50, name: "product_name", nullable: false, comment: '' })
    productName: string;

    @Column("varchar", { length: 100, name: "color", nullable: true, comment: '' })
    color: string;

    @Column('varchar', { length: 30, name: 'confirmed_by', nullable: false, comment: 'The user who confirmed the bundles' })
    confirmedBy: string;

    @Column('bigint', { name: 'confirmation_id', nullable: false })
    confirmationId: number;

    @Column('tinyint', { name: 'inventory_status', nullable: false, default: 0, comment: '0-default 1-moved to inventory. refer SpsBundleInventoryMoveToInvStatusEnum' })
    invStatus: SpsBundleInventoryMoveToInvStatusEnum;

    @Column('smallint', { name: 'total_bundles_confirmed', default: 0 })
    totalBundlesConfirmed: number;

    @Column('smallint', { name: 'total_moved_quantity', default: 0 })
    totalMovedQuantity: number;
}

