import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../database/common-entities";
import { ProcessTypeEnum } from "@xpparel/shared-models";

@Entity('inv_out_req')
export class InvOutRequestEntity extends AbstractEntity {

    @Column({ name: 'ref_id', type: 'bigint', nullable: false, comment: 'confirmation id of either KNIT or SPS item req header table' })
    refId: number;

    @Column({ name: 'process_type', type: 'varchar', length: 20, nullable: false, comment: 'Type of reference: KNIT / LINK / FIN / WASH' })
    processType: ProcessTypeEnum;

    @Column({ name: 'request_number', type: 'varchar', length: 50, nullable: false, comment: 'Unique request number for this inventory request' })
    requestNumber: string;

    @Column({ name: 'allocation_status', type: 'tinyint', nullable: false, comment: 'Refer InvOutRequestAllocationStatusEnum' })
    allocationStatus: InvOutRequestAllocationStatusEnum;

    @Column({ name: 'issuance_status', type: 'tinyint', nullable: false, comment: 'Refer InvOutRequestIssuanceStatusEnum' })
    issuanceStatus: InvOutRequestIssuanceStatusEnum;
}

export enum InvOutRequestAllocationStatusEnum {
    OPEN = 0,
    PARTIAL_ALLOCATED = 1,
    ALLOCATED = 2
}

export enum InvOutRequestIssuanceStatusEnum {
    OPEN = 0,
    PARTIAL_ISSUED = 1,
    ISSUED = 2
}

