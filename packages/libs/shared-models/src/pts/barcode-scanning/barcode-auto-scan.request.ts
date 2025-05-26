import { CommonRequestAttrs } from "../../common";
import { RejectionQtyModel } from "./rejection-qty.model";

export class BarcodeAutoScanRequest extends CommonRequestAttrs {
    barcode: string; // required for input
    workstationCode: string; // workstation code // required for input
    operatorName: string; // required for input
    operatorId: number;
    reasonQtys: RejectionQtyModel[]; // required for input

    constructor(
        username: string, unitCode: string, companyCode: string, userId: number,
        barcode: string,
        workstationCode: string,
        operatorName: string,
        operatorId: number,
        reasonQtys: RejectionQtyModel[]
    ) {
        super(username,unitCode,companyCode,userId);
        this.barcode = barcode;
        this.workstationCode = workstationCode;
        this.operatorName = operatorName;
        this.operatorId = operatorId;
        this.reasonQtys = reasonQtys;
    }
}


// {
//     "barcode": "IRON-LB-91-5-1",
//     "workstationCode": "WS3",
//     "operatorName": "rajesh",
//     "companyCode": "5000",
//     "unitCode": "B3",
//     "username": "rajesh"
//         "reasonQtys": [
//             {
//                 "reasonId": 5,
//                 "quantity": 15
//             },{
//                 "reasonId": 6,
//                 "quantity": 10
//             }
//         ]
// }