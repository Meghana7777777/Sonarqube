import { CommonRequestAttrs } from "../../common";
import { StyleProductTypeOpVersionCreation } from "./style-product-type-op-version-creation-request";

export class SpVersionRequest extends CommonRequestAttrs {
    style: string;
    productType: string;
    opSeqModel: StyleProductTypeOpVersionCreation;
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        style: string,
        productType: string,
        opSeqModel: StyleProductTypeOpVersionCreation,

    ) {
        super(username, unitCode, companyCode, userId);
        this.productType = productType;
        this.style = style;
        this.opSeqModel = opSeqModel;

    }
}