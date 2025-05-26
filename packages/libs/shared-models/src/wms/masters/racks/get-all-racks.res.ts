import { GlobalResponseObject } from "../../../common";
import { getAllRacksDto } from "./get-all-racks.dto";

export class GetAllRacksResp extends GlobalResponseObject {
    racksData : getAllRacksDto[];
    /**
       * @params status
       * @params errorCode
       * @params internalMessage
       * @param racksData
       */
    constructor(status: boolean, errorCode: number, internalMessage: string, racksData: getAllRacksDto[]) {
        super(status, errorCode, internalMessage)
        this.racksData = racksData;
    }
}