import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { ProcessTypeEnum } from "@xpparel/shared-models";

@Entity('po_knit_job')
export class PoKnitJobEntity extends AbstractEntity {

    @Column('bigint', { name: 'processing_serial', nullable: false })
    processingSerial: number;

    @Column('varchar', { name: 'process_type', length: 25, nullable: false })
    processType: ProcessTypeEnum;

    @Column('bigint', { name: 'po_knit_job_ratio_id', nullable: false })
    poKnitJobRatioId: number;

    @Column('varchar', { name: 'group_code', length: 15, nullable: false })
    groupCode: string;

    @Column('varchar', { name: 'knit_job_number', length: 25, nullable: false })
    knitJobNumber: string;

    @Column('int', { name: 'quantity' })
    quantity: number;

    @Column('boolean', {
        nullable: false,
        default: false,
        name: 'is_confirmed',
    })
    isConfirmed: boolean;
}

