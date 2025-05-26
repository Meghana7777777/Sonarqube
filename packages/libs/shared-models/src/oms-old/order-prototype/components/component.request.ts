import { CommonRequestAttrs } from "../../../common";
import { ComponentModel } from "./component.model";

export class ComponentRequest extends CommonRequestAttrs {
    components: ComponentModel[];

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        components: ComponentModel[],

    ) {
        super(username, unitCode, companyCode, userId);
        this.components = components;
    }
}