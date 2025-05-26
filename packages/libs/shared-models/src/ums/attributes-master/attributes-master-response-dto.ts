import { GlobalResponseObject } from "../../common";
import { AttributesMasterModelDto } from "./attributes-master-model-dto";


export class  AttributesMasterResponse extends GlobalResponseObject{
    data?: AttributesMasterModelDto[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: AttributesMasterModelDto[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}