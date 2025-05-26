import { GlobalResponseObject,  } from "../../common";
import { SectionsModel } from "./sections-model";

 export class SectionsResponse extends GlobalResponseObject {
    data?: SectionsModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data?: SectionsModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}
