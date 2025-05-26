import { GlobalResponseObject, ModuleModel } from "../../../../common";


export class ModuleResponse extends GlobalResponseObject{
    data?: ModuleModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data?: ModuleModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}
