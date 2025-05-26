import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { KC_KnitJobConfStatusEnum, KC_KnitJobGenStatusEnum, ProcessTypeEnum } from "@xpparel/shared-models";

@Entity('po_knit_job_ratio')
export class PoKnitJobRatioEntity extends AbstractEntity {
    @PrimaryGeneratedColumn({ name: 'id' }) // Auto-incrementing primary key
    id: number;

    @Column('bigint', { name: 'processing_serial', nullable: false })
    processingSerial: number;

    @Column('varchar', { name: 'process_type', length: 25, nullable: false })
    processType: ProcessTypeEnum;

    @Column('varchar', { name: 'ratio_code', length: 50, nullable: false })
    ratioCode: string;

    @Column('varchar', { name: 'ratio_desc', length: 100, nullable: false })
    ratioDesc: string;

    @Column('varchar', { name: 'group_code', nullable: false })
    groupCode: string;

    @Column('boolean', { name: 'job_for_each_size', nullable: false })
    jobForEachSize: boolean;

    @Column('varchar', { name: 'product_ref', length: 15, nullable: false })
    productRef: string;

    @Column('tinyint', { name: 'jobs_gen_status', nullable: false, default: KC_KnitJobGenStatusEnum.OPEN })
    jobsGenStatus: KC_KnitJobGenStatusEnum;

    @Column('tinyint', { name: 'jobs_confirm_status', nullable: false, default: KC_KnitJobConfStatusEnum.OPEN })
    jobsConfirmStatus: KC_KnitJobConfStatusEnum;

    @Column('int', { name: 'ratio_knit_job_qty', nullable: false })
    ratioKnitJobQty: number;
}
