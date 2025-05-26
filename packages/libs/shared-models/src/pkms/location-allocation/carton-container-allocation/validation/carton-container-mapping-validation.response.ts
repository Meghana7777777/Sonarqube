import { CommonRequestAttrs, GlobalResponseObject } from "../../../../common";
import { CartonContainerMappingValidationModel } from "./carton-container-mapping-validation.model";

export class CartonContainerMappingValidationResponse extends GlobalResponseObject {
    data?: CartonContainerMappingValidationModel[];
    constructor(status: boolean, errorCode: number, internalMessage: string, data: CartonContainerMappingValidationModel[]) {
            super(status, errorCode, internalMessage);
            this.data = data;
    }
}
