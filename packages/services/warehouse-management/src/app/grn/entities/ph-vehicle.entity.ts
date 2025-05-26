import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { CheckListStatus, PackListLoadingStatus } from '@xpparel/shared-models';

@Entity('ph_vehicle')
export class PhVehicleEntity extends AbstractEntity {

    @Column('varchar', {
        name: 'vehicle_number',
        length: 20,
        nullable: false,
    })
    vehicleNumber: string

    @Column('bigint', {
        name: 'ph_id',
        nullable: false,
    })
    phId: number;

    @Column('varchar', {
        name: 'driver_name',
        length: 20,
        nullable: false,
    })
    driverName: string

    @Column({
        name: "in_at",
    })
    inAt: Date

    @Column({
        name: "out_at",
        nullable: true,
    })
    outAt: Date

    @Column('enum', {
        name: 'status',
        enum: PackListLoadingStatus
    })
    status: PackListLoadingStatus

    @Column('enum', {
        name: 'check_list_status',
        enum: CheckListStatus
    })
    checkListStatus: CheckListStatus

    @Column('varchar', {
        name: 'security_name',
        length: 20,
        nullable: false,
    })
    securityName: string

    @Column('varchar', {
        name: 'vehicle_contact',
        length: 20,
        nullable: false,
    })
    vehicleContact: string

    @Column({
        name: "unload_start_at",
        nullable: true,
        type: 'datetime'
    })
    unloadStartAt: Date

    @Column({
        name: "unload_complete_at",
        nullable: true,
        type: 'datetime'
    })
    unloadCompleteAt: Date

    @Column({
        name: "actual_unload_start_at",
        nullable: true,
        type: 'datetime'
    })
    actualUnloadStartAt: Date

    @Column({
        name: "unload_pause_at",
        nullable: true,
        type: 'datetime'
    })
    unloadPauseAt: Date

    @Column('integer', {
        name: 'unload_spent_secs',
        nullable: true,
        default: 0
    })
    unloadingSpentSecs: number;

    @Column({
        name: "actual_unload_complete_at",
        nullable: true,
        type: 'datetime'
    })
    actualUnloadCompleteAt: Date

    @Column('integer', {
        name: 'net_weight',
        nullable: true,
    })
    netWeight: number

    @Column('integer', {
        name: 'gross_weight',
        nullable: true,
    })
    grossWeight: number

    @Column('varchar', {
        name: 'cusdec_no',
        length: 20,
        nullable: true,
    })
    cusDecNo: string;


    @Column('varchar', {
        name: 'invoice_no',
        length: 20,
        nullable: true,
    })
    invoiceNo: string

    @Column('varchar', {
        name: 'container_no',
        length: 20,
        nullable: true,
    })
    containerNo: string

}
