import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { ProcessTypeEnum } from "@xpparel/shared-models";

@Entity('production_defects_n')
export class ProductionDefectsNEntity extends AbstractEntity {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column('bigint', { name: 'quality_config_id', nullable: true })
    qualityConfigId: number;

    @Column('int', { name: 'good_qty', nullable: false })
    goodQty: number;

    @Column('int', { name: 'rejected_qty', nullable: false })
    rejectedQty: number;

    @Column('varchar', { name: 'barcode', length: 40 })
    barcode: string;

    @Column('varchar', { name: 'style_code', length: 50, nullable: false })
    styleCode: string;

    
    @Column('varchar', { name: 'process_type', length: 25, nullable: false })
    processType: ProcessTypeEnum;
    
    @Column('bigint', { name: 'quality_type_id', nullable: true })
    qualityTypeId: number;

    @Column('bigint', { name: 'processing_serial', nullable: true })
    processingSerial: number; // optional currently

    @Column('varchar', { name: 'fg_sku', nullable: true ,length:25})
    fgSku: string;

    @Column('varchar', { name: 'job_number', nullable: true, length:25})
    jobNumber:string
}