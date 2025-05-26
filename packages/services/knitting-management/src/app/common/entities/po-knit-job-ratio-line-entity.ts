import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { ProcessTypeEnum } from "@xpparel/shared-models";

@Entity('po_knit_job_ratio_line')
export class PoKnitJobRatioLineEntity extends AbstractEntity {
    @PrimaryGeneratedColumn({ name: 'id' }) // Auto-incrementing primary key
    id: number;

    @Column('bigint', { name: 'processing_serial', nullable: false })
    processingSerial: number;

    @Column('varchar', { name: 'process_type', length: 25, nullable: false })
    processType: ProcessTypeEnum;

    @Column('bigint', { name: 'po_knit_job_ratio_id', nullable: false })
    poKnitJobRatioId: number;

    @Column('varchar', { name: 'product_ref', length: 15, nullable: false })
    productRef: string;
}
