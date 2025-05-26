import { GlobalResponseObject } from "../common";
import { DowntimeData } from "./ws-downtime-data";


export class DowntimeResponseModel extends GlobalResponseObject {

    data?: DowntimeData[];
    constructor(status: boolean,
        errorCode: number,
        internalMessage: string,
        data?: DowntimeData[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}