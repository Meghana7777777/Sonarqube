import { PackListLoadingStatus } from "@xpparel/shared-models";

export class VehicleUnloadingDetailsQryResp {
    vehicle_number: string;
    driver_name: string;
    vehicle_contact: string;
    status: PackListLoadingStatus;
    unload_start_at: Date;
    unload_complete_at: Date;
    unload_pause_at: Date;
    unload_spent_secs: number;
    ph_id: number;
    net_weight: number;
    in_at: Date;
    out_at: Date;
    wait_time: number;
}