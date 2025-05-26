import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { PoKnitBundlingMoveToInvStatusEnum, ProcessTypeEnum } from "@xpparel/shared-models";

@Entity('po_bundling')
export class PoBundlingEntity extends AbstractEntity {

    @Column('bigint', { name: 'processing_serial', nullable: false })
    processingSerial: number;

    @Column('varchar', { name: 'process_type', length: 25, nullable: false })
    processType: ProcessTypeEnum;

    @Column('varchar', { length: 30, name: 'confirmed_by', nullable: false, comment: 'The user who confirmed the bundles' })
    confirmedBy: string;

    @Column('bigint', { name: 'confirmation_id', nullable: false })
    confirmationId: number;

    @Column('tinyint', { name: 'inventory_status', nullable: false, default: 0, comment: '0-default 1-moved to inventory. refer PoKnitBundlingMoveToInvStatusEnum' })
    invStatus: PoKnitBundlingMoveToInvStatusEnum;

    @Column('tinyint', { name: 'pts_status', nullable: false, default: 0, comment: '0-default 1-moved to inventory. refer PoKnitBundlingMoveToInvStatusEnum' })
    ptsStatus: PoKnitBundlingMoveToInvStatusEnum;
}

