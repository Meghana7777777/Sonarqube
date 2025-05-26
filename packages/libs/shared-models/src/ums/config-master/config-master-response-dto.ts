import { GlobalResponseObject } from "../../common";
import { ConfigMasterModelDto } from "./config-master-model-dto";


export class  ConfigMasterResponse extends GlobalResponseObject{
    data ?: ConfigMasterModelDto[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: ConfigMasterModelDto[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}