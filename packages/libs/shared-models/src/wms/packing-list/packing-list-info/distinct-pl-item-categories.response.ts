import { GlobalResponseObject } from "../../../common";
import { DistinctPLItemCategoriesModel } from "./distinct-pl-item-categories.model";

export class DistinctPLItemCategoriesModelResp extends GlobalResponseObject {
    data?: DistinctPLItemCategoriesModel[];

    /**
     * @param status 
     * @param errorCode 
     * @param internalMessage 
     * @param data 
     */

    constructor(status: boolean,
        errorCode: number,
        internalMessage: string,
        data: DistinctPLItemCategoriesModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}