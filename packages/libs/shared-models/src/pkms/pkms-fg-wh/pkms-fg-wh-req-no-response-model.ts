import { GlobalResponseObject } from "../../common";
import { PKMSFgWhReqNoResponseDto } from "./pkms-fg-wh-req-no-response.dto";

export class PKMSFgWhReqNoResponseModel extends GlobalResponseObject {
    data: PKMSFgWhReqNoResponseDto[];
    constructor(
        status: boolean, errorCode: number, internalMessage: string, data: PKMSFgWhReqNoResponseDto[]
    ) {
        super(status, errorCode, internalMessage,)
        this.data = data;
    }
}