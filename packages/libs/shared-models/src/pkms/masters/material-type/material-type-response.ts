import { GlobalResponseObject } from "../../../common";
import { MaterialTypeResponseDto } from "./material-type-response-dto";

export class MaterialTypesResponse extends GlobalResponseObject{
    data ?: MaterialTypeResponseDto[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: MaterialTypeResponseDto[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}