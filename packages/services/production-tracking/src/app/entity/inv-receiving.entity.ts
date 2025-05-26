import { Entity, Column } from "typeorm";
import { ProcessTypeEnum } from "@xpparel/shared-models";
import { AbstractEntity } from "../../database/common-entities";

@Entity('inv_receiving')
export class InvReceivingEntity extends AbstractEntity {

    @Column("bigint", { name: "ext_alloc_id", nullable: false, comment: 'The allocaion id of the external system. Currently PK of inv_out_allocation' })
    extAllocationId: number;

    @Column("varchar", { name: "to_proc_type", length: 6, nullable: false, comment: 'The receiving process type' })
    toProcessType: ProcessTypeEnum;

    @Column("boolean", { name: "process_status", default: false, comment: 'This will turn to true if the allocation is handled and the respective PTS tables are updated for the specific issuance id' })
    processStatus: boolean;

    @Column("boolean", { name: "alloc_reversed", nullable: false, comment: 'This will turn to true if the allocation is reversed' })
    allocationReversed: boolean;
}
