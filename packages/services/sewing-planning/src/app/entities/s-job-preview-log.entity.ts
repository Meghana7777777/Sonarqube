import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../database/common-entities";
import { SewJoGenRefTypeEnum, TransactionLockStatusEnum } from "@xpparel/shared-models";

@Entity('s_job_preview_log')
export class SJobPreviewLog extends AbstractEntity {
    @Column('int', {
        name: 'sew_serial',
        nullable: false
    })
    sewSerial: number

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
    sewingJobQty: number

    @Column('integer', {
        name: 'logical_bundle_qty',
        nullable: false
    })
    logicalBundleQty: number

    @Column('bigint', {
        name: 'transaction_id',
        nullable: false
    })
    transactionId: number

    @Column('tinyint', {
        name: 'status',
        nullable: true
    })
    status: TransactionLockStatusEnum
}
