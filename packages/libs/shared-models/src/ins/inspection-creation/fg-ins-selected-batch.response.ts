import {GlobalResponseObject, InsFgSelectedBatchModel } from "@xpparel/shared-models";


export class FgInsSelectedBatchResponse extends GlobalResponseObject {
	data: InsFgSelectedBatchModel[];
	constructor(status: boolean, errorCode: number, internalMessage: string, data: InsFgSelectedBatchModel[]) {
		super(status, errorCode, internalMessage);
		this.data = data;
	}
}