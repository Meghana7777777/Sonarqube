import { Column, CreateDateColumn, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";

@Entity('vehicle_unloading_history')
export class VehicleUnloadingHistory extends AbstractEntity {
    @Column('bigint', {
        name: 'ph_vehicle_id',
        nullable: false,
    })
    phVehicleId: number

    @CreateDateColumn({
        name: "unload_start_at",
        nullable: true,
    })
    unloadStartAt: Date

    @CreateDateColumn({
        name: "unload_complete_at",
        nullable: true,
    })
    unloadCompleteAt: Date

    // @CreateDateColumn({
    //     name: "actual_unload_start_at",
    //     nullable: true,
    // })
    // actualUnloadStartAt: Date

    // @CreateDateColumn({
    //     name: "actual_unload_complete_at",
    //     nullable: true,
    // })
    // actualUnloadCompleteAt: Date

    // @CreateDateColumn({
    //     name: "unload_pause_at",
    //     nullable: true,
    // })
    // unloadPausedAt: Date

    @Column('integer', {
        name: 'unload_spent_secs',
        nullable: true,
        default: 0
    })
    unloadingSpentSecs: number

    @Column('varchar', {
        name: 'pause_reason',
        nullable: true,
    })
    pauseReason: string;

    @Column('boolean', {
        nullable: false,
        default: false,
        name: 'is_paused',
    })
    isPaused: boolean;

}