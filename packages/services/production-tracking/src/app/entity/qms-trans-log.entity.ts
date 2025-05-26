import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../database/common-entities";
import { BarcodeLevelEnum } from "@xpparel/shared-services";
import { ProcessTypeEnum } from "@xpparel/shared-models";

@Entity('qms_trans_log')
export class QMSTransLogEntity extends AbstractEntity {

    @Column('varchar', { name: 'quality_type', nullable: true, length: 55 })
    qualityType: string;

    @Column('varchar', { name: 'quality_reason', nullable: true, length: 100 })
    qualityReason: string;

    @Column('varchar', { name: 'inspector_name', nullable: true, length: 100 })
    inspectorName: string;

    @Column('varchar', { name: 'location_code', nullable: true, length: 20 })
    locationCode: string;

    @Column('varchar', { name: 'barcode_level', nullable: true, length: 1 })
    barcodeLevel: BarcodeLevelEnum;

    @Column('varchar', { name: 'date_time', nullable: true, length: 20 })
    dateTime: string;

    @Column('varchar', { name: 'barcode', nullable: true, length: 20 })
    barcode: string;

    @Column('int', { name: 'quantity', nullable: false })
    quantity: number;

    @Column('varchar', { name: 'reason', nullable: true, length: 100 })
    reason: string;

    @Column('varchar', { name: 'process_type', length: 25, nullable: false })
    processType: ProcessTypeEnum;

    @Column("varchar", { length: "20", name: "op_code", nullable: true })
    operationCode: string;



}