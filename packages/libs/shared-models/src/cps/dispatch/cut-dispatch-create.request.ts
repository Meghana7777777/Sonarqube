import { CommonRequestAttrs } from "../../common";

export interface ICutToBagMapModel {
    bagNumbers: number[]; // the bag number for this specific cut number
    cutNumber: number;
}

export class CutDispatchCreateRequest extends CommonRequestAttrs {

    remarks: string;
    cutNos: number[];
    bagNumbers: ICutToBagMapModel[];
    poSerial: number;
    // vendorId: number; // The pk of the ums vendors
    // layIds: number[]; // The pk of the laying records

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        remarks: string,
        poSerial: number,
        cutNos: number[],
        bagNumbers: ICutToBagMapModel[]
    ) {
        super(username, unitCode, companyCode, userId);
        this.cutNos = cutNos;
        this.poSerial = poSerial;
        this.remarks = remarks;
        this.bagNumbers = bagNumbers;
    }
}




// {
//     "username": "rajesh",
//     "unitCode": "B3",
//     "companyCode": "5000",
//     "userId": 0,
//     "remarks": "sample",
//     "cutNos": [1, 2],
//     "bagNumbers": [
//     	{
//     		"bagNumbers": [1,2,3],
//     		"cutNumber": 1
//     	},
//     	{
//     		"bagNumbers": [3,4],
//     		"cutNumber": 2
//     	}
//     ],
//     "poSerial": 1
// }