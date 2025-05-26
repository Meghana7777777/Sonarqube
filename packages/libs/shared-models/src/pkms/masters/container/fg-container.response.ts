import { GlobalResponseObject } from "../../../common";
import { FgContainerCreationModel } from "./fg-container-creation-model";

export class FgContainerResponse extends GlobalResponseObject {
    data?: FgContainerCreationModel[];
    constructor(status: boolean,
        errorCode: number,
        internalMessage: string,
        data?: FgContainerCreationModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}