import { CommonRequestAttrs } from "@xpparel/shared-models";

export class OslRefIdRequest extends CommonRequestAttrs {
    oslRefId: number[];

    constructor(
        username: string, unitCode: string, companyCode: string, userId: number,
        oslRefId: number[]
    ) {
        super(username,unitCode,companyCode,userId);
        this.oslRefId = oslRefId;
    }
}

// {
//     "companyCode": "NORLANKA",
//     "unitCode": "NORLANKA",
//     "oslRefId": [3850, 3851, 3852, 3853]
// }

