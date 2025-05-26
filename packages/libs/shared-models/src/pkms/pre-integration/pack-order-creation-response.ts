import { GlobalResponseObject } from "../../common";
import { PackOrderCreationModel } from "./pack-order-creation-model";



export class PackOrderCreationResponse extends GlobalResponseObject {
    data: PackOrderCreationModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: PackOrderCreationModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}