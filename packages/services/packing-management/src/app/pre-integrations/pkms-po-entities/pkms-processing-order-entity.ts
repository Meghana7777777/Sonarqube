import { BundleGenStatusEnum, JobsGenStatusEnum, ProcessTypeEnum, ProcessingOrderStatusEnum, RatioGenStatusEnum, TaskStatusEnum } from "@xpparel/shared-models";
import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";

@Entity('pkms_processing_order')
export class PKMSProcessingOrderEntity extends AbstractEntity {

    @Column('bigint', { name: 'processing_serial', nullable: false })
    processingSerial: number;

    @Column('varchar', { name: 'prc_ord_description', length: 50, nullable: false })
    prcOrdDescription: string;

    @Column('varchar', { name: 'prc_ord_remarks', length: 50, nullable: false })
    prcOrdRemarks: string;

    @Column('varchar', { name: 'process_type', length: 25, nullable: false })
    processType: ProcessTypeEnum;

    @Column('tinyint', { name: 'status', nullable: false, default: TaskStatusEnum.OPEN })
    status: TaskStatusEnum;

    @Column('varchar', { name: 'style_code', length: 50, nullable: false })
    styleCode: string;

    @Column('varchar', { name: 'customer_name', length: 50, nullable: false })
    customerName: string;

    @Column('tinyint', { name: 'pl_gen_status', nullable: false, default: TaskStatusEnum.OPEN })
    plGenStatus: TaskStatusEnum;

    @Column('tinyint', { name: 'jobs_gen_status', nullable: false, default: TaskStatusEnum.OPEN })
    jobsGenStatus: TaskStatusEnum;
}

