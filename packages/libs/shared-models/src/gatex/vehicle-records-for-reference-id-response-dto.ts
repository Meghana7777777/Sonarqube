
import { VehicleINRAndOTRStateRecord } from "./vehicle-inr-and-otr-state-record";
import { VehicleINRAndOTRDetailsDto } from "./vehicle-inr-and-otr-details-dto";
import { VehicleInAndOTRRecordsDto } from "./vehicle-in-and-otr-records-dto";

export class VehicleRecordsForReferenceIdResponseDto {
    vehicleINR: VehicleINRAndOTRDetailsDto;
    vehicleOTR: VehicleINRAndOTRDetailsDto;
    vehicleINRRecords: VehicleInAndOTRRecordsDto[];
    vehicleOTRRecords: VehicleInAndOTRRecordsDto[];
    vehicleINRStateRecords: VehicleINRAndOTRStateRecord[];
    vehicleOTRStateRecords: VehicleINRAndOTRStateRecord[];
    constructor(
        vehicleINR: VehicleINRAndOTRDetailsDto,
        vehicleOTR: VehicleINRAndOTRDetailsDto,
        vehicleINRRecords: VehicleInAndOTRRecordsDto[],
        vehicleOTRRecords: VehicleInAndOTRRecordsDto[],
        vehicleINRStateRecords: VehicleINRAndOTRStateRecord[],
        vehicleOTRStateRecords: VehicleINRAndOTRStateRecord[],
    ) {
        this.vehicleINR = vehicleINR;
        this.vehicleOTR = vehicleOTR;
        this.vehicleINRRecords = vehicleINRRecords;
        this.vehicleOTRRecords = vehicleOTRRecords;
        this.vehicleINRStateRecords = vehicleINRStateRecords;
        this.vehicleOTRStateRecords = vehicleOTRStateRecords;
    }
}