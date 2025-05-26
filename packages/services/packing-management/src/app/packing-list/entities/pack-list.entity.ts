import { JobsGenStatusEnum, StatusEnums } from "@xpparel/shared-models";
import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";

@Entity('pm_t_pl_config')
export class PLConfigEntity extends AbstractEntity {
    @Column('varchar', { name: 'pl_config_no', length: 25 })
    plConfigNo: string;

    @Column('text', { name: 'pl_config_desc' })
    plConfigDesc: string;

    // // Ref key of the po serial
    @Column("bigint", { name: "processing_serial", nullable: false, comment: '' })
    packSerial: number;

    @Column({ name: 'no_of_cartons', type: 'int' })
    noOfCartons: number;

    @Column({ name: 'quantity', type: 'int' })
    quantity: number;

    @Column({ name: 'pack_job_qty', type: 'int' })
    packJobQty: number;

    @Column({ name: 'status', type: 'enum', enum: StatusEnums, default: StatusEnums.Open })
    status: StatusEnums;


    @Column({ name: 'pk_type_id', type: 'int' })
    pkTypeId: number;

    @Column({ name: 'pk_spec_id', type: 'int' })
    pkSpecId: number;


    @Column('bigint', { name: 'po_id', nullable: false })
    poId: number;

    @Column({ nullable: false, type: 'enum', enum: JobsGenStatusEnum, default: JobsGenStatusEnum.OPEN, name: 'pj_gen_status' })
    pjGenStatus: JobsGenStatusEnum

}