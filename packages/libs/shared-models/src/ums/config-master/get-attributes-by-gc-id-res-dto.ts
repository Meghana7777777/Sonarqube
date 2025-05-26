import { GlobalResponseObject } from "../../common";
import { GetAttributesByGcId } from "./get-attributes-by-gc-id.dto";

export class GetAttributesByGcIdResponseDto extends GlobalResponseObject {
    data: GetAttributesByGcId[];
    constructor(status: boolean, errorCode: number, internalMessage: string, data: GetAttributesByGcId[]) {
        super(status, errorCode, internalMessage);
        this.data = data
    }
}