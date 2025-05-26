import { GlobalResponseObject } from "../../common";
import { GatePassResDto } from "./gate-pass-res-dto";

export class GatePassResponse extends GlobalResponseObject {
    data: GatePassResDto[]
    constructor(status: boolean,
        errorCode: number,
        internalMessage: string, data: GatePassResDto[]) {
        super(status, errorCode, internalMessage)
        this.data=data
    }
}