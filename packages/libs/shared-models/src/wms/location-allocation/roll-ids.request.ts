import { CommonRequestAttrs } from "../../common";

export class RollIdsRequest extends CommonRequestAttrs {
    rollIds: number[];
    dontThrowException?: boolean;

    iNeedPalletInfo?: boolean;
    binInfo?: boolean;
    iNeedTrayInfo?: boolean;
    iNeedTrolleyInfo?: boolean;
    constructor(username: string, unitCode: string, companyCode: string, userId: number, rollIds: number[], dontThrowException?: boolean, iNeedPalletInfo?: boolean,
        binInfo?: boolean, iNeedTrayInfo?: boolean, iNeedTrolleyInfo?: boolean ) {
        super(username, unitCode, companyCode, userId)
        this.rollIds = rollIds;
        this.dontThrowException = dontThrowException;
        this.iNeedPalletInfo = iNeedPalletInfo;
        this.binInfo = binInfo;
        this.iNeedTrayInfo = iNeedTrayInfo;
        this.iNeedTrolleyInfo = iNeedTrolleyInfo;
    }
}

// {
//     "rollIds": [13312],
//     "companyCode": "5000",
//     "unitCode": "B3",
//     "username": "rajesh",
//     "userId": 0,
//     "dontThrowException": true
// }