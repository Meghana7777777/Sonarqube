import { GlobalResponseObject, SectionModel } from "../../..";

 export class SectionResponse extends GlobalResponseObject {
    data?: SectionModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data?: SectionModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}
