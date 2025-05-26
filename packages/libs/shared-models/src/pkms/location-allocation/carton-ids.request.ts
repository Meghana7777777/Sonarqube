import { CommonRequestAttrs } from "../../common";

export class CartonIdsRequest extends CommonRequestAttrs {
    cartonIds: number[];
    dontThrowException?: boolean;

    iNeedContainerInfo?: boolean;
    locationInfo?: boolean;
    iNeedTrayInfo?: boolean;
    iNeedTcartoneyInfo?: boolean;
    constructor(username: string, unitCode: string, companyCode: string, userId: number, cartonIds: number[], dontThrowException?: boolean, iNeedContainerInfo?: boolean,
        locationInfo?: boolean, iNeedTrayInfo?: boolean, iNeedTcartoneyInfo?: boolean ) {
        super(username, unitCode, companyCode, userId)
        this.cartonIds = cartonIds;
        this.dontThrowException = dontThrowException;
        this.iNeedContainerInfo = iNeedContainerInfo;
        this.locationInfo = locationInfo;
        this.iNeedTrayInfo = iNeedTrayInfo;
        this.iNeedTcartoneyInfo = iNeedTcartoneyInfo;
    }
}

// {
//     "cartonIds": [13312],
//     "companyCode": "5000",
//     "unitCode": "B3",
//     "username": "rajesh",
//     "userId": 0,
//     "dontThrowException": true
// }