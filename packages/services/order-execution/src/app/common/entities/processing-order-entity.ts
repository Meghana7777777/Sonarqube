import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { BundleGenStatusEnum, JobsGenStatusEnum, ProcessingOrderStatusEnum, ProcessTypeEnum, RatioGenStatusEnum } from "@xpparel/shared-models";

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

    @Column('varchar', { name: 'process_type', length: 25, nullable: false })
    processType: ProcessTypeEnum;

    @Column('tinyint', { name: 'status', nullable: false ,default:ProcessingOrderStatusEnum.OPEN})
    status: ProcessingOrderStatusEnum;

    @Column('varchar', { name: 'style_code', length: 50, nullable: false})
    styleCode: string;

    @Column('tinyint', { name: 'bundle_gen_status', nullable: false, default: BundleGenStatusEnum.OPEN })
    bundleGenStatus: BundleGenStatusEnum;

    @Column('tinyint', { name: 'ratio_gen_status', nullable: false, default: RatioGenStatusEnum.OPEN })
    ratioGenStatus: RatioGenStatusEnum;

    @Column('tinyint', { name: 'jobs_gen_status', nullable: false, default: JobsGenStatusEnum.OPEN })
    jobsGenStatus: JobsGenStatusEnum;
}

