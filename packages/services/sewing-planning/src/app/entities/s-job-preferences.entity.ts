import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../database/common-entities";
import { ProcessTypeEnum, SewJoGenRefTypeEnum } from "@xpparel/shared-models";

@Entity('s_job_preference')
export class SJobPreferences extends AbstractEntity {
    @Column('bigint', { name: 'processing_serial', nullable: false })
    processingSerial: number;

    @Column('varchar', { name: 'process_type', length: 25, nullable: false })
    processType: ProcessTypeEnum;

    @Column('text', {
        name: 'group_info',
        nullable: false
    })
    groupInfo: string

    @Column('boolean', {
        nullable: false,
        default: true,
        name: 'multi_color',
    })
    multiColor: boolean;


    @Column('boolean', {
        nullable: false,
        default: true,
        name: 'multi_size',
    })
    multiSize: boolean;

    @Column('integer', {
        name: 'sewing_job_qty',
        nullable: false
    })
    sewingJobQty: number;
}
