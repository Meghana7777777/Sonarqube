import { CommonRequestAttrs, GlobalResponseObject } from "../../../common";
import { InspectionContainerCartonsModel } from "./inspection-container-cartons.model";

export class InspectionContainerCartonsResponse extends GlobalResponseObject {
    data?: InspectionContainerCartonsModel[];
    constructor(status: boolean, errorCode: number, internalMessage: string, data: InspectionContainerCartonsModel[]) {
            super(status, errorCode, internalMessage);
            this.data = data;
    }
}
