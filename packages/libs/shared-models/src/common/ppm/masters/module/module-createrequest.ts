import { CommonRequestAttrs } from "../../../common-request-attr.model";
import { ModuleModel } from "./module-model";

export class ModuleCreateRequest extends CommonRequestAttrs {
    modules: ModuleModel[];

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        modules: ModuleModel[]
    ) {
        super(username, unitCode, companyCode, userId);
        this.modules = modules;
    }
}