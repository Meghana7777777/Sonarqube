import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../database/common-entities";
import { ProcessTypeEnum } from "@xpparel/shared-models";
import { InvOutRequestIssuanceStatusEnum } from "./inv.out.req.entity";

// This can have multiple records for 1 request id
// Whenever an allocation is made, then we create a record into this table. The allocation can be done multiple times in future but now only once per request
@Entity('inv_out_alloc')
export class InvOutAllocEntity extends AbstractEntity {

    @Column({ name: 'inv_out_request_id', type: 'bigint', comment: 'PK of the inv out request' })
    invOutRequestId: number;

    @Column({ name: 'allocated_by', type: 'varchar', length: 30, comment: 'Person who did the allocation' })
    allocatedBy: string;

    @Column({ name: 'allocated_date', type: 'datetime', comment: 'Date time on which the allocation is done' })
    allocatedDate: string;

    @Column({ name: 'issued_by', type: 'varchar', length: 30,  comment: 'Person who issued the allocation' })
    issuedBy: string;

    @Column({ name: 'issued_date', type: 'datetime', comment: 'Date time on which the issuance is done' })
    issuedDate: string;

    @Column({ name: 'forced_allocation', type: 'boolean', default: false, comment: 'Flag that is set when you are trying to allocate partial inventory due to lack of avl panels/fgs from the previous processing type' })
    forcedAllocation: boolean;

    @Column({ name: 'issuance_status', type: 'tinyint', nullable: false, default: InvOutRequestIssuanceStatusEnum.OPEN, comment: 'Refer InvOutRequestIssuanceStatusEnum' })
    issuanceStatus: InvOutRequestIssuanceStatusEnum;

    @Column({ name: 'inv_alloc_ack', type: 'boolean', default: false, comment: 'Flag that is set to true by the ack by SPS after allocation handled' })
    invSpsAllocAck: boolean;

    @Column({ name: 'inv_iss_ack', type: 'boolean', default: false, comment: 'Flag that is set to true by the ack by SPS after issuance handling' })
    invSpsIssAck: boolean;

    @Column({ name: 'inv_pts_iss_ack', type: 'boolean', default: false, comment: 'Flag that is set to true by the ack by PTS' })
    invPtsIssAck: boolean;

    @Column({ name: 'from_proc_types', type: 'varchar', length: 15, nullable: false, comment: 'Processing type: KNIT / LINK / FIN / WASH. CSV of the to processing types. ATM 1' })
    fromProcTypes: string;
    
    @Column({ name: 'to_proc_type', type: 'varchar', length: 10, nullable: false, comment: 'Processing type: KNIT / LINK / FIN / WASH. ATM 1' })
    toProcType: ProcessTypeEnum;
}

