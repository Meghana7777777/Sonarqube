import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { BundleGenStatusEnum, JobsGenStatusEnum, ProcessingOrderStatusEnum, ProcessTypeEnum, RatioGenStatusEnum } from "@xpparel/shared-models";
import { AbstractEntity } from "../../database/common-entities";

@Entity('processing_order')
export class ProcessingOrderEntity extends AbstractEntity {

    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column('bigint', { name: 'processing_serial', nullable: false })
    processingSerial: number;

    @Column('varchar', { name: 'prc_ord_description', length: 50, nullable: false })
    prcOrdDescription: string;

    @Column('varchar', { name: 'prc_ord_remarks', length: 50, nullable: false })
    prcOrdRemarks: string;

    @Column('tinyint', { name: 'status', nullable: false, default: ProcessingOrderStatusEnum.OPEN })
    status: ProcessingOrderStatusEnum;

    @Column('varchar', { name: 'style_code', length: 50, nullable: false })
    styleCode: string;

    @Column('boolean', { name: 'is_actual_tracking', default: false })
    isActualTracking: boolean;

}

