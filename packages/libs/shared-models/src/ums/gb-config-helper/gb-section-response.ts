import { GlobalResponseObject,  } from "../../common";
import { GBSectionsModel } from "./gb-section-model";

 export class GBSectionsResponse extends GlobalResponseObject {
    data?: GBSectionsModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data?: GBSectionsModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}
