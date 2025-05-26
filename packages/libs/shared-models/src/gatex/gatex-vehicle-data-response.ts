import { GlobalResponseObject } from "../common";
import { VehicleRecordsForReferenceIdResponseDto } from "./vehicle-records-for-reference-id-response-dto";
export class VehicleRecordsForReferenceIdResponse extends GlobalResponseObject {
    data: VehicleRecordsForReferenceIdResponseDto
    constructor(status: boolean, errorCode: number, internalMessage: string, data: VehicleRecordsForReferenceIdResponseDto) {
        super(status, errorCode, internalMessage);

    }

}