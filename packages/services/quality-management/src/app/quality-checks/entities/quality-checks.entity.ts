import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { ProcessTypeEnum, QMS_QualityCheckStatus } from "@xpparel/shared-models";
import { BarcodeLevelEnum } from "@xpparel/shared-services";

@Entity('quality_checks')
export class QualityChecksEntity extends AbstractEntity {

    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column('varchar', { name: 'barcode', length: 40 })
    barcode: string;

    @Column('int', { name: 'barcode_qty',nullable:false  })
    barcodeQty: number;


    @Column('bigint', { name: 'quality_config_id', nullable: true })
    qualityConfigId: number;

    @Column('bigint', { name: 'quality_type_id', nullable: true })
    qualityTypeId: number;

    @Column('int', { name: 'reported_qty', nullable: false })
    reportedQuantity: number;

    @Column('varchar', { name: 'quality_status', length: 25, nullable: false })
    qualityStatus: QMS_QualityCheckStatus;

    @Column('varchar', { name: 'style_code', length: 50, nullable: false })
    styleCode: string;

    @Column('varchar', { name: 'process_type', length: 25, nullable: false })
    processType: ProcessTypeEnum;


    @Column('varchar', { name: 'fg_sku', nullable: true, length: 25 })
    fgSku: string;

    @Column('varchar', { name: 'job_number', nullable: true, length: 25 })
    jobNumber: string

    @Column('varchar', { name: 'reason', length: 250, nullable: true })
    reason: string;

    @Column('varchar', { name: 'reported_by', length: 50, nullable: true })
    reportedBy: string;

    @Column('varchar', { name: 'reported_on', length: 10, nullable: true })
    reportedOn: string;

    @Column("varchar", { length: "20", name: "location", nullable: true })
    location: string;

    @Column("varchar", { length: "20", name: "op_code", nullable: true })
    operationCode: string;

    @Column('varchar', { name: 'barcode_level', nullable: true, length: 1 })
    barcodeLevel: BarcodeLevelEnum;
}