import { Entity, Column } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { PackingStatusEnum, PackInspectionStatusEnum } from "@xpparel/shared-models";

@Entity('pm_t_crtns')
export class CrtnEntity extends AbstractEntity {

    @Column({ name: 'pk_config_id', type: 'int', comment: 'pack_list_id' })
    pkConfigId: number;

    @Column("varchar", { length: 100, name: "scan_start_time", nullable: true, comment: '' })
    scanStartTime: string;

    @Column("varchar", { length: 100, name: "scan_end_time", nullable: true, comment: '' })
    scanEndTime: string;

    @Column('varchar', { name: 'barcode', length: 40 })
    barcode: string;

    @Column("tinyint", { name: "print_status", nullable: false, comment: 'The Carton print status', default: false })
    printStatus: boolean;

    @Column('boolean', { name: 'is_scanned', default: false })
    isScanned: boolean;

    @Column({ name: 'required_qty', type: 'int' })
    requiredQty: number;

    @Column({ name: 'completed_qty', type: 'int', default: 0 })
    completedQty: number;

    @Column({ name: 'pk_job_id', type: 'int' })
    pkJobId: number;

    @Column({ name: 'carton_proto_id', type: 'int' })
    cartonProtoId: number;

    @Column({ name: 'pk_spec_id', type: 'int' })
    pkSpecId: number;

    @Column({ name: 'item_id', type: 'int', nullable: false })
    itemId: number;

    @Column('varchar', { name: 'style', length: 40 })
    style: string;

    @Column('varchar', { name: 'exfactory', length: 40 })
    exfactory: string;

    @Column({ name: 'gross_weight', type: 'int', nullable: true })
    grossWeight: number;

    @Column({ name: 'net_weight', type: 'int', nullable: true })
    netWeight: number;

    @Column({ name: 'planned_gross_weight', type: 'int', nullable: true })
    plannedGrossWeight: number;

    @Column({ name: 'planned_net_weight', type: 'int', nullable: true })
    plannedNetWeight: number;

    @Column('varchar', { name: 'delivery_date', length: 40 })
    deliveryDate: string;

    @Column('tinyint', { name: 'inspection_pick', default: false })
    inspectionPick: boolean;

    @Column({ name: 'status', type: 'enum', enum: PackingStatusEnum, default: PackingStatusEnum.OPEN, comment: JSON.stringify(PackingStatusEnum) })
    packingStatus: PackingStatusEnum;

    @Column({
        type: 'enum',
        name: 'inspection_status',
        enum: PackInspectionStatusEnum,
    })
    inspectionStatus: PackInspectionStatusEnum;

    @Column('bigint', { name: 'po_id', nullable: false })
    poId: number;
}