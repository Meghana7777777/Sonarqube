import { CommonRequestAttrs } from "../../common";
import { VehicleDetailsModel } from "./info";

export class CutDispatchVendorTransUpdateRequest extends CommonRequestAttrs {
    cutDispatchId: number;
    vendorId: number;
    vehicleInfo: VehicleDetailsModel[];

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        cutDispatchId: number,
        vendorId: number,
        vehicleInfo: VehicleDetailsModel[]
    ) {
        super(username, unitCode, companyCode, userId);
        this.cutDispatchId = cutDispatchId;
        this.vendorId = vendorId;
        this.vehicleInfo = vehicleInfo;
    }

}


// {
//     "username": "rajesh",
//     "unitCode": "B3",
//     "companyCode": "5000",
//     "userId": 0,
//     "remarks": "sample",
//     "cutDrId": 7,
//     "vendorId": 1,
//     "vehicleInfo": [
//         {
//             "vehicleNo": "AP293656",
//             "vehicleRemarks": "tata ace",
//             "contactNumber": "78898885896"
//         }
//     ]
// }