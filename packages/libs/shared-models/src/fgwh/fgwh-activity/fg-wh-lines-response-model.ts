import { GlobalResponseObject } from "../../common";
import { FgWhLinesResDto } from "./fg-wh-lines-res-dto";

export class FgWhLinesResponseModel extends GlobalResponseObject {
    data: FgWhLinesResDto[];
    constructor(status: boolean, errorCode: number, internalMessage: string, data: FgWhLinesResDto[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}