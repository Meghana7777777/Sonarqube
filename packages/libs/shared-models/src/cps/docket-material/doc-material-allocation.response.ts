import { GlobalResponseObject } from "../../common";
import { DocMaterialAllocationModel } from "./doc-material-allocation.model";

export class DocMaterialAllocationResponse extends GlobalResponseObject {
    data ?: DocMaterialAllocationModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: DocMaterialAllocationModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}
