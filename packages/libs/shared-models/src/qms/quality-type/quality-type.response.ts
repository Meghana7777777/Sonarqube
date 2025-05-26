import { GlobalResponseObject } from "../../common";
import { QualityTypeDto } from "./quality-type-dto";

export class QualityTypeInfoResponse extends GlobalResponseObject {
    data?: QualityTypeDto[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: QualityTypeDto[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}