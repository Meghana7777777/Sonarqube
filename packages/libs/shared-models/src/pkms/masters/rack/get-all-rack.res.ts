
import { GlobalResponseObject } from "../../../common";
import { FgGetAllRackDto } from "./get-all-rack.dto";


export class FgGetAllRackResp extends GlobalResponseObject {
    data?: FgGetAllRackDto[];
    /**
       * @params status
       * @params errorCode
       * @params internalMessage
       * @param data
       */
    constructor(status: boolean, errorCode: number, internalMessage: string, data?: FgGetAllRackDto[]) {
        super(status, errorCode, internalMessage)
        this.data = data;
    }
}