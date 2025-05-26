import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { ProcessTypeEnum } from "@xpparel/shared-models";

@Entity('po_knit_job_line')
export class PoKnitJobLineEntity extends AbstractEntity {
    @PrimaryGeneratedColumn({ name: 'id' }) // Auto-incrementing primary key
    id: number;

    @Column('bigint', { name: 'processing_serial', nullable: false })
    processingSerial: number;

    @Column('varchar', { name: 'process_type', length: 25, nullable: false })
    processType: ProcessTypeEnum;

    @Column('varchar', { name: 'knit_job_number', length: 25, nullable: false })
    knitJobNumber: string;

    @Column('bigint', { name: 'po_knit_job_id', nullable: false })
    poKnitJobId: number;

    @Column('int', { name: 'quantity' })
    quantity: number;

}
