import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../database/common-entities";
import { InvOutRequestAllocationStatusEnum, InvOutRequestIssuanceStatusEnum } from "./inv.out.req.entity";
import { ProcessTypeEnum } from "@xpparel/shared-models";

@Entity('inv_out_req_activity')
export class InvOutRequestActivityEntity extends AbstractEntity {

    @Column({ name: 'inv_out_request_id', type: 'bigint', nullable: false, comment: 'Reference to the inventory outgoing request ID' })
    invOutRequestId: number;

    @Column({ name: 'allocation_status', type: 'tinyint', default: InvOutRequestAllocationStatusEnum.OPEN, comment: 'Refer InvOutRequestAllocationStatusEnum' })
    allocationStatus: InvOutRequestAllocationStatusEnum;

    @Column({ name: 'issuance_status', type: 'tinyint', nullable: false, default: InvOutRequestAllocationStatusEnum.OPEN, comment: 'Refer InvOutRequestIssuanceStatusEnum' })
    issuanceStatus: InvOutRequestIssuanceStatusEnum;
}
