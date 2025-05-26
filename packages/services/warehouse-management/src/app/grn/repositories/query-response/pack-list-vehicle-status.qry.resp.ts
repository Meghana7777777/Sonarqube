import { CheckListStatus, PackListLoadingStatus } from "@xpparel/shared-models";

export class PackListVehicleStatusResp {
    in_at: Date;
    out_at: Date;
    unload_start_at: Date;
    unload_complete_at: Date;
    check_list_status: CheckListStatus;
    vehicle_number: string;
    driver_name: string;
    invoice_no: string;
    id: number;
    vehicle_contact: string;
    status: PackListLoadingStatus;
    constructor(in_at: Date,
        out_at: Date,
        unload_start_at: Date,
        unload_complete_at: Date,
        check_list_status: CheckListStatus,
        vehicle_number: string,
        driver_name: string,
        invoice_no: string,
        id: number,
        vehicle_contact: string,
        status: PackListLoadingStatus){
        this.in_at =in_at;
        this.out_at = out_at;
        this.unload_start_at=unload_start_at;
        this.unload_complete_at=unload_complete_at;
        this.check_list_status=check_list_status;
        this.vehicle_number=vehicle_number;
        this.driver_name=driver_name;
        this.invoice_no=invoice_no;
        this.id=id;
        this.vehicle_contact=vehicle_contact;
        this.status=status;


        
    }
}
