import { GlobalResponseObject } from "../../../common";
import { PackJobResModel } from "./pack-job-response.model";

export class PoPackJobResponse extends GlobalResponseObject{
    data:PackJobResModel[]
    constructor(
        status: boolean,
        errorCode: number,
        internalMessage: string, data: PackJobResModel[]
    ) {
        super(status, errorCode, internalMessage)
        this.data = data
    }
}