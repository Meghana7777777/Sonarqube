import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../database/common-entities";
import { ProcessTypeEnum } from "@xpparel/shared-models";

@Entity('inv_in_request')
export class InvInRequestEntity extends AbstractEntity {

    @Column({ name: 'ref_id', type: 'bigint', nullable: false, comment: 'confirmation id of either KNIT or SPS' })
    refId: number;

    @Column({ name: 'ref_type', type: 'varchar', length: 20, nullable: false, comment: 'Type of reference: KNIT / LINK / FIN / WASH' })
    refType: ProcessTypeEnum;

    @Column({ name: 'request_number', type: 'varchar', length: 50, nullable: false, comment: 'Unique request number for this inventory request' })
    requestNumber: string;

    @CreateDateColumn({ name: 'first_came_on', type: 'datetime', nullable: false, comment: 'Timestamp when the first bundle came in under this job' })
    firstCameOn: Date;

    @CreateDateColumn({ name: 'last_came_on', type: 'datetime', nullable: false, comment: 'Timestamp when the last bundle came in under this job' })
    lastCameOn: Date;

    @Column({ name: 'request_status', type: 'tinyint', nullable: false, comment: 'Refer InvInRequestStatus' })
    requestStatus: InvInRequestStatus;
}


// after creating an inv request, if we put all the bundles in the inventory then this will be 2. In current implementation this is always 2
export enum InvInRequestStatus {
    OPEN = 0,
    PARTIALLY_IN = 1,
    COMPLETELY_CAME_IN = 2
}