import { GlobalResponseObject } from "../../../common";
import { GetAllBinsByRackIdDto } from "./get-all-bins-by-rack-id.dto";

export class GetAllBinsByRackIdRes extends GlobalResponseObject{
    binsData: GetAllBinsByRackIdDto;
    /**
     * @params status
     * @params errorCode
     * @params internalMessage
     * @param binsData
     */
    constructor(status: boolean, errorCode: number, internalMessage: string, binsData: GetAllBinsByRackIdDto){
        super(status, errorCode, internalMessage)
        this.binsData = binsData;
    }
}