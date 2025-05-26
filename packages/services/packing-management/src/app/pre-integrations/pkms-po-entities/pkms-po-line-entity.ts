import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { ProcessTypeEnum } from "@xpparel/shared-models";

@Entity('pkms_po_line')
export class PKMSPoLineEntity extends AbstractEntity {
    
    @Column('bigint', { name: 'processing_serial', nullable: false })
    processingSerial: number;

    @Column('varchar', { name: 'process_type', length: 25, nullable: false })
    processType: ProcessTypeEnum;

    @Column('varchar', { name: 'mo_line_number', length: 20, nullable: false })
    moLineNumber: string;

    @Column('varchar', { name: 'mo_number', length: 50, nullable: false })
    moNumber: string;

    @Column('varchar', { name: 'customer_name', length: 50, nullable: false })
    customerName: string;

    @Column('varchar', { name: 'co_number', length: 50, nullable: false })
    coNumber: string;

    @Column('bigint', { name: 'po_id', nullable: false })
    poId: number;

    @Column('bigint', { name: 'mo_line_id', nullable: true })
    moLineId: number;

    @Column('bigint', { name: 'mo_id', nullable: true })
    moId: number;
    
}