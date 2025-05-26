import { GlobalResponseObject } from "../../common"; 
import { GetAllSectionsResDto } from "./gb-get-all-sections-res-dto";

export class GbGetAllSectionsResponseModal extends GlobalResponseObject {
    data: GetAllSectionsResDto[];
    constructor(status: boolean, errorCode: number, internalMessage: string, data: GetAllSectionsResDto[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}