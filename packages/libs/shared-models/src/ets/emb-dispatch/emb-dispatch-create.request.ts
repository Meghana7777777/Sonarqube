import { CommonRequestAttrs } from "../../common";


export class EmbDispatchCreateRequest extends CommonRequestAttrs {

    remarks: string;
    vendorId: number; // The pk of the ums vendors
    embLineIds: number[]; // The pk of the emb line 

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        embLineIds: number[],
        vendorId: number,
        remarks: string
    ) {
        super(username, unitCode, companyCode, userId);

        this.embLineIds = embLineIds;
        this.vendorId = vendorId;
        this.remarks = remarks;
    }
}



// {
//     "companyCode": "5000",
//     "embLineIds": ["1"],
//     "remarks": "test",
//     "unitCode": "B3",
//     "userId": "4",
//     "username": "admin",
//     "vendorId": "1"
// }