import { GlobalResponseObject } from "../../../common";
import { PackListContainerCfNcfPendingCartonsModel } from "./packlist-container-cf-ncf-cartons.model";


export class PackListContainerCfNcfPfendingCartonsResponse extends GlobalResponseObject {
    data?: PackListContainerCfNcfPendingCartonsModel[];
    constructor(status: boolean, errorCode: number, internalMessage: string, data: PackListContainerCfNcfPendingCartonsModel[]) {
            super(status, errorCode, internalMessage);
            this.data = data;
    }
}
