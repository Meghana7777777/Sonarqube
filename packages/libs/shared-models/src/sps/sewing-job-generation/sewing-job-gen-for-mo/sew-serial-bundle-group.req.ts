import { CommonRequestAttrs } from "../../../common";

export class SewSerialBundleGroupReq extends CommonRequestAttrs {
    sewSerial: number; // Sewing serial number
    bundleGroup: number; // Bundle group number

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        sewSerial: number,
        bundleGroup: number
    ) {
        super(username, unitCode, companyCode, userId);
        this.sewSerial = sewSerial;
        this.bundleGroup = bundleGroup;
    }
}
