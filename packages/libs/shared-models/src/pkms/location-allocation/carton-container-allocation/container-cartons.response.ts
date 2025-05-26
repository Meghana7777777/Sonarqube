import { CommonRequestAttrs, GlobalResponseObject } from "../../../common";
import { ContainerCartonsModel } from "./container-cartons.model";

export class ContainerCartonsResponse extends GlobalResponseObject {
    data?: ContainerCartonsModel[];
    constructor(status: boolean, errorCode: number, internalMessage: string, data: ContainerCartonsModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}
