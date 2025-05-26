import { GlobalResponseObject } from "../../common";
import { InsFabInsSelectedBatchModel } from "./fab-ins-selected-batch.model";

export class InsFabInsSelectedBatchResponse extends GlobalResponseObject{
    data: InsFabInsSelectedBatchModel[];
    constructor(status: boolean, errorCode: number, internalMessage: string, data: InsFabInsSelectedBatchModel[]) {
		super(status, errorCode, internalMessage);
		this.data = data;
	}
}