import { CommonRequestAttrs } from "../../../../common";
import { ModuleModel } from "./module-model";

export class ModuleRequest extends CommonRequestAttrs {
    Module: ModuleModel;

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        Module: ModuleModel
    ) {
        super(username, unitCode, companyCode, userId);
        this.Module = Module;
    }
}
